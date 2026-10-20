# 5–7 minute live demonstration script

1. **Problem (45 s).** We classify known historical irrigation-treatment *patterns* from one tomato-cultivation dataset; line 1=100% and line 3=30%. Not physiological stress diagnosis.
2. **Data (45 s).** Explain one shared environmental sensor and physical-line soil sensors, 2023 only, missing-data cleaning, timestamp alignment, and chronological separation.
3. **Course ML methods (90 s).** Open 01–05 executed Colab notebooks: EDA; historical 1h/3h/6h lag/rolling features; training-only feature ranking and model-family comparisons; validation-only model selection.
4. **Evaluation (60 s).** Show confusion matrix 353 TN, 0 FP, 126 FN, 227 TP; accuracy 82.15%, recall 64.31%, F1 78.28%, ROC-AUC 0.9215. Explain why precision is 100% here but recall low, and no new-farm claim.
5. **Working demo (90 s).** Start two terminals; open `/health` (predictor_loaded true), dashboard, select line 1/test, pick 2023-08-30 06:00 UTC; show class 0 and 0.04% class-1 score; show matching Swagger result and network HTTP 200. Change line and split to show genuine historical records.
6. **Limitations/next steps (45 s).** One line per treatment confounds line with irrigation; hourly observations are correlated; data have no independently validated crop-stress labels or onset times. Publishable scientific claims require additional replicated seasons/sites and research validation.

Prepare for questions: why 5 models; why accuracy + F1 + ROC/PR; why chronological split; how timestamp joins avoid using the future; why no live sensor predictions; what 0.04% means (model class score, not stress risk).
