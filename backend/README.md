# RC3SI Stage 06 — FastAPI historical demo (v1)

## What this demonstrates
Historical 2023 recorded soil measurements from known physical irrigation lines, and a **frozen** Stage 04 classifier trained on 10 engineered features. **Not a real-time feed, crop-stress diagnosis, intervention recommendation, or early-warning system.** The selected model is confounded by line identity vs irrigation regime and has not been externally validated.

## Setup on your laptop (VS Code terminal)

```bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
Open http://127.0.0.1:8000/docs ; API: http://127.0.0.1:8000/metadata

**Use Python 3.11 or 3.12.** Pin `scikit-learn==1.6.1` because Stage 04 trained under that version. Unpickling the model under 1.8.0 fails (`SimpleImputer._fill_dtype`). Do not load unknown/untrusted joblib files.

## Guided demo
1. GET `/health` checks data loading (does not assert model ready).
2. GET `/metadata` explains features, metrics, and limitations.
3. GET `/records?line=3&split=test&limit=3` displays timestamped real sensor measurements.
4. GET `/test/predictions?limit=3` displays Stage 05 stored test predictions *without re-running the model*.
5. Copy the `timestamp` from `/records` to GET `/predict/record?line=3&split=test&timestamp=...` to **run real inference** from the frozen model. If this reports 503, check the sklearn version in your runtime.
6. POST `/predict/features` accepts **exactly** ten pre-engineered numeric feature values from `/metadata` (no line or irrigation-percentage input). Raw single-sensor readings are not enough to reproduce lag features.

## Checks
Run `python -m pytest -q` from the project directory. Integration tests do **not** assume the model is compatible on arbitrary Python environments. Manual `/predict/record` is needed for a full inference smoke test under the pinned environment.

## Ethics and provenance
Raw engineered features and outcomes come from the user's executed Stage 03 and Stage 05 outputs; no invented live data or simulated risk thresholds. Original source: Parma 2023 experimental irrigation sensor data (see the Mendeley dataset and its attribution/license terms before redistributing). This folder includes derived CSVs for a reproducible local demo; check publishing permissions before pushing those data files to a public GitHub repository. Results are within one season/known physical lines, not verified stress or early-warning observations.

## Frontend connection
The React frontend is integrated with this FastAPI backend. The application displays historical Parma 2023 sensor records, saved model-evaluation metrics, and predictions from the frozen classifier. The dashboard operates in historical-data playback mode, not live sensor-monitoring mode.
