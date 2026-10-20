# Pipeline overview

```text
Mendeley Parma 2023 raw CSVs + README
             |
 Colab 01: load/audit
             v
 Colab 02: timestamp clean + backward environmental merge + chronological splits
             v
 Colab 03: lag/rolling features (past-only) + train-only mutual-information ranking
             v
 Colab 04: Dummy, Logistic Regression, RBF SVM, Random Forest, Histogram Gradient Boosting; validation F1 selection
             v
 Colab 05: once-only 706-sample held-out evaluation + frozen trusted joblib
             v
     FastAPI /records /metadata /predict/record
             v
     React/Vite historical dashboard (localhost)
```

Primary inference inputs are **ten precomputed historical features**, not raw instant readings. The API's recorded-observation endpoint looks up these already-engineered features. It does not implement live real-time processing or feature construction from arbitrary streaming sensors.

Only 2023 data are in scope. Shared environmental sensor context does not identify line-specific weather. Neither intervention effect nor stress onset is measured.
