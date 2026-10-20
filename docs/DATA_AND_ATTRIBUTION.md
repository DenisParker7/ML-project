# Dataset Attribution and Provenance

## Original Dataset

**Title:** IoT-based Dataset of a Tomato Cultivation Under Different Irrigation Regimes

**Authors:** Laura Belli, Luca Davoli, Giulia Oddi, Luca Preite, Martina Galaverni, Tommaso Ganino, Gianluigi Ferrari

**Publication:** Mendeley Data, Version 2 (2024)

**DOI:** https://doi.org/10.17632/35wh56287y.2

**Dataset:** https://data.mendeley.com/datasets/35wh56287y/2

**License:** Creative Commons Attribution 4.0 International (CC BY 4.0)

**License URL:** https://creativecommons.org/licenses/by/4.0/

## Modifications Made

The RC3SI project team processed the original dataset for machine-learning experiments. These modifications include:

- Cleaning repeated CSV header rows and inspecting missing values.
- Aggregating sensor readings and aligning timestamps.
- Engineering historical lag and rolling features.
- Selecting predictive features using training-only data.
- Creating chronological training, validation, and test partitions.
- Training and evaluating machine-learning classification models.
- Producing derived historical datasets, evaluation reports, and model artifacts.

The project's redistributed CSV files contain transformed observations rather than an unmodified copy of the complete original dataset.

## Research Scope

This implementation evaluates classification of recorded irrigation-treatment patterns using historical sensor measurements.

It does not establish physiological plant-stress diagnosis, causal counterfactual effects, real-time crop monitoring, or generalization to independent farms.

## Attribution and Non-Endorsement

The original dataset and associated intellectual contributions belong to their respective authors.

The dataset is used under CC BY 4.0. Appropriate attribution is provided, modifications are disclosed, and no endorsement by the original authors is implied.

## Frontend Contribution

The RC3SI team's frontend implementation was developed collaboratively and integrated with the FastAPI backend and saved machine-learning model for historical-data visualization and classification.

## Reproducibility and Security

The notebooks document the processing and evaluation workflow. The saved `.joblib` model should only be loaded from trusted sources because Python serialization formats can execute code.

The original larger multi-year dataset was not used for this implementation.
## Confirmed dataset citation and license

Belli, Laura; Davoli, Luca; Oddi, Giulia; Preite, Luca; Galaverni, Martina; Ganino, Tommaso; Ferrari, Gianluigi (2024), "IoT-based Dataset of a Tomato Cultivation Under Different Irrigation Regimes", Mendeley Data, V2.
DOI: https://doi.org/10.17632/35wh56287y.2

License: Creative Commons Attribution 4.0 International (CC BY 4.0)
https://creativecommons.org/licenses/by/4.0/

The RC3SI team modified the original measurements through data cleaning, timestamp alignment, feature engineering, chronological splitting, and machine-learning analysis. The original authors do not endorse this project.

