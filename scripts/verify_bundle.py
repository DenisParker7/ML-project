"""Static offline integrity verification, no model deserialization required."""
from pathlib import Path
import json,csv
root=Path(__file__).resolve().parents[1]
m=json.loads((root/'backend/model/stage05_manifest.json').read_text())
features=json.loads((root/'backend/model/inference_features.json').read_text())
with (root/'backend/data/parma2023_binary_engineered.csv').open(newline='',encoding='utf-8') as f:
 rows=list(csv.DictReader(f))
print('Saved model family:',m['model_family'])
print('Historical rows:',len(rows))
assert len(rows)==3531
assert m['train_size']+m['validation_size']+m['test_size']==3531
assert len(m['features_ordered'])==10
assert (root/'backend/model/final_model_stage04_frozen.joblib').exists()
print('Bundle checks passed. Run backend pytest to verify actual inference.')
