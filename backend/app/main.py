"""RC3SI research-demo API: recorded Parma 2023 measurements, never live or clinically/physiologically validated stress."""
from __future__ import annotations
import json
from functools import lru_cache
from pathlib import Path
import numpy as np
import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "parma2023_binary_engineered.csv"
SAVED_TEST = ROOT / "data" / "heldout_test_predictions.csv"
MODEL = ROOT / "model" / "final_model_stage04_frozen.joblib"
FEATURES = json.loads((ROOT / "model" / "inference_features.json").read_text())["features_ordered"]
MANIFEST = json.loads((ROOT / "model" / "stage05_manifest.json").read_text())
app = FastAPI(title="RC3SI Parma 2023 Historical Demo", version="1.1.0", description="Recorded experimental lines only. Not a live crop stress diagnosis or irrigation recommendation.")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_credentials=False, allow_methods=["GET", "POST"], allow_headers=["Content-Type"])

@lru_cache
def frame():
    df = pd.read_csv(DATA, parse_dates=["timestamp"]).sort_values(["timestamp", "line"]).reset_index(drop=True)
    if not {"timestamp", "line", "split", "target", *FEATURES}.issubset(df.columns):
        raise RuntimeError("Input schema does not match frozen feature schema")
    return df

@lru_cache

def saved_test():
    return pd.read_csv(SAVED_TEST, parse_dates=["timestamp"])

@lru_cache

def classifier():
    # SECURITY: Load only user-controlled, trusted model file. joblib uses pickle.
    try:
        return joblib.load(MODEL)
    except Exception as exc:
        raise RuntimeError("Model loading failed; run Python with scikit-learn==1.6.1 (training version)") from exc

class FeaturesIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    values: dict[str, float] = Field(description="Exactly ten Stage 03 features, already engineered with historical data")

@app.get("/health")
def health():
    try:
        classifier()
        loaded = True
        model_error = None
    except Exception as exc:
        loaded = False
        model_error = f"{type(exc).__name__}: inspect server logs and pinned dependencies"
    return {"status":"ok" if loaded else "degraded", "mode":"historical-recorded-data", "rows":len(frame()),
            "predictor_loaded":loaded, "model_error": model_error,
            "caution":"Readiness includes model load; use /predict/record to verify inference."}

@app.get("/metadata")
def metadata():
    return {"project":"RC3SI", "dataset":"Parma 2023", "mode":"historical playback", "feature_order":FEATURES,
            "threshold":0.5, "classes":{"0":"100% irrigation line", "1":"30% irrigation line"},
            "limitations":["One farm, one season, one physical line per treatment", "Line/treatment confounding", "NOT a physiological stress diagnosis", "NOT verified early warning", "NOT a live sensor feed"],
            "reported_test_metrics":MANIFEST["test_metrics"]}

@app.get("/records")
def records(line: int | None = Query(None, ge=1, le=3), split: str | None = Query(None, pattern="^(train|validation|test)$"), limit: int = Query(50,ge=1,le=500), offset: int = Query(0,ge=0)):
    df=frame()
    if line is not None: df=df[df.line == line]
    if split is not None: df=df[df.split == split]
    subset=df.iloc[offset:offset+limit]
    fields=["timestamp","line","split","soil_humidity","soil_temperature","soil_electrical_conductivity","target"]
    return {"total":len(df),"items":[{k:(r[k].isoformat() if k=="timestamp" else (int(r[k]) if k in ("line","target") else r[k])) for k in fields} for _,r in subset.iterrows()]}

@app.get("/test/predictions")
def test_predictions(limit:int=Query(50,ge=1,le=500),offset:int=Query(0,ge=0)):
    df=saved_test().iloc[offset:offset+limit]
    return {"total":len(saved_test()),"items":df.assign(timestamp=df.timestamp.dt.strftime("%Y-%m-%dT%H:%M:%S%z")).replace({np.nan:None}).to_dict(orient="records"),
            "note":"FROZEN Stage 05 recorded test outputs, not a live model run"}

@app.post("/predict/features")
def predict_features(payload:FeaturesIn):
    incoming=set(payload.values)
    expected=set(FEATURES)
    if incoming != expected:
        raise HTTPException(status_code=422,detail={"missing":sorted(expected-incoming),"unexpected":sorted(incoming-expected)})
    values=np.array([payload.values[k] for k in FEATURES],dtype=float)
    if not np.isfinite(values).all():
        raise HTTPException(status_code=422,detail="Values must be finite")
    x=pd.DataFrame([values],columns=FEATURES)
    try: p=float(classifier().predict_proba(x)[0,1])
    except Exception as exc:
        raise HTTPException(status_code=503,detail=f"Model unavailable or incompatible sklearn runtime: {type(exc).__name__}; install scikit-learn==1.6.1") from exc
    return {"probability_30percent_line":p,"predicted_class":int(p>=0.5),"threshold":0.5,
            "meaning":"Classification of recorded irrigation-line pattern, NOT measured physiological stress"}

@app.get("/predict/record")
def predict_record(line:int=Query(...),timestamp:str=Query(...), split:str=Query("test",pattern="^(train|validation|test)$")):
    if line not in (1,3): raise HTTPException(status_code=422,detail="Only Line 1 and Line 3 were modeled")
    try: t=pd.Timestamp(timestamp)
    except Exception as exc: raise HTTPException(status_code=422,detail="Invalid timestamp") from exc
    if t.tzinfo is None: raise HTTPException(status_code=422,detail="Timestamp must include timezone e.g. +00:00")
    rows=frame();rows=rows[(rows.line==line)&(rows.timestamp==t)&(rows.split==split)]
    if len(rows)!=1: raise HTTPException(status_code=404,detail="No matching recorded row; use /records")
    r=rows.iloc[0];result=predict_features(FeaturesIn(values={k:float(r[k]) for k in FEATURES}))
    return {"line":line,"timestamp":r.timestamp.isoformat(),"split":split,"observed_treatment_class":int(r.target),"inference":result}
