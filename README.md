# RC3SI — Parma 2023 recorded irrigation-pattern classification

**College ML course demonstration; not a validated physiological plant-stress detector, early-warning system or causal counterfactual system.**

This repository combines 5 executed Google Colab notebooks with a Python FastAPI backend and a React/Vite historical-data dashboard. Dataset: [IoT-based Dataset of a Tomato Cultivation Under Different Irrigation Regimes (Mendeley Data, version 2)](https://data.mendeley.com/datasets/35wh56287y/2). The research data refer to a single farm/season in 2023. Confirm the original dataset license and attribution before redistribution.

## What works
- 2023 measurements from known physical irrigation lines; model distinguishes the recorded 100% line (class 0) versus 30% line (class 1).
- Train-only feature selection, chronological validation/test separation, frozen model, and evaluated held-out observations.
- FastAPI serves historical records and classification; React displays plots and predicts selected recorded observations.
- Backend regression tests include real inference with the saved model.

## Verified held-out evaluation (Stage 05, 706 observations)
| Metric | Score |
|---|---:|
| Accuracy | 82.15% |
| Precision for class 1 | 100.00% |
| Recall for class 1 | 64.31% |
| F1 for class 1 | 78.28% |
| ROC-AUC | 0.9215 |
| True negatives / false positives / false negatives / true positives | 353 / 0 / 126 / 227 |

**Crucial limitation:** Each treatment is confounded with a physical sensor line. Repeated hourly readings are *not* independent treatment replicates. These are within-season, known-line results; no claim of generalization to new farms, lines, years or biological plant-stress onset. The 100% precision on this particular held-out interval coexists with 126 missed class-1 observations.

## Setup
Follow [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md). Python 3.11 and scikit-learn 1.6.1 are used to load the frozen trusted model; Node.js LTS is used for frontend development.

## Project layout
- `notebooks/` five executed Colab stages, preserve actual outputs.
- `backend/` API, bundled scored-records CSV, trusted model artifact, tests.
- `frontend/` React/Vite UI. `src/App.tsx` renders the historical demo; legacy Member-2 mock screens remain in source but are not claimed as live/validated functions.
- `reports/` captured metrics, comparisons, feature ranking.
- `docs/` architecture, demonstration steps, limitations, provenance and progress.

## Reproduce and check
Training stages should be run in sequence; Stage 02–05 request their predecessor's exported ZIP, which is **not committed** here. To reproduce exactly, generate those intermediates in Colab and use the dataset linked above. The trained model is included as an artifact to demonstrate inference; the code notebooks disclose how it was selected and evaluated. Do not load untrusted joblib/pickle artifacts.

## References and attribution
Refer to [docs/DATA_AND_ATTRIBUTION.md](docs/DATA_AND_ATTRIBUTION.md). We did not establish patent novelty or IEEE acceptability through this demonstration.
