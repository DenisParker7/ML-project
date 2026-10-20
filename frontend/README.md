# C3SI — Counterfactual Cross-Zone Stress Intelligence
## Frontend Website & Precision Greenhouse Monitoring Dashboard (Member 2 Deliverables)

### 🌿 Aesthetic & Design Theme
- **Primary Canvas**: Luxury Warm Beige (`#DDD0C8`)
- **Primary Contrast Typography & Controls**: Charcoal Dark Grey (`#323232`)
- **Card Surfaces**: Soft Cream & Elevated Beige (`#FAF8F5`, `#F7F2EE`, `#EAE1DB`)
- **Borders & Dividers**: Subtle Hairline Natural Sand (`#CEBEB4`)
- **Buttons & Indicators**: Pill buttons (`rounded-full bg-[#323232] text-[#DDD0C8] shadow-pill`) inspired by minimalist luxury editorial design.
- **Typography**: Editorial Serif headers (`Playfair Display`) combined with high-legibility geometric sans (`Plus Jakarta Sans`) and precise technical monospacing (`JetBrains Mono`).

---

### 🚀 Key Features (Member 2 Checklist)
- [x] **Responsive Dashboard with Sidebar Navigation**: Minimalist, mobile-friendly navigation between Overview, Cultivation Zones, Stress Intelligence, Sensor Health, Evaluation Reports, and FastAPI Integration.
- [x] **Editorial Hero & KPI Status Cards**: Total zones monitored, stressed zones breakdown (Water stress, Heat stress, Nutrient deficiency, Early disease, Healthy), inference confidence %, and closed-loop verification status.
- [x] **Sensor Monitoring Cards**: Specialized microclimate cards for **Moisture**, **Temperature**, **Humidity**, and **Light Intensity** with target range visualizers, baseline residuals, and ambient/VPD indicators.
- [x] **Interactive Trend & Counterfactual Charts (Recharts)**: Time-series charts plotting observed readings $x_{i,t}$ against counterfactual healthy trajectories $\hat{x}_{i,t}^{(0)}$ with residual deviation bar plots ($r_{i,t}$).
- [x] **Dynamic Cross-Zone Relationship Graph**: Interactive visualizer showing physical adjacency ($a_{ij}$), learned behavioral similarity ($s_{ij,t}$), and tunable $\alpha$ parameter slider ($w_{ij,t} = \alpha a_{ij} + (1-\alpha) s_{ij,t}$).
- [x] **Integrated Dashboard Pages**:
  1. `Overview`: Spatial zone matrix, quick alerts, real-time telemetry, and "Dispatch Action" pill button.
  2. `Zone Details`: Deep-dive into specific bays, actuator states (valves, fans, shade screens, misting nozzles), residual deviations, and historical recovery.
  3. `Stress Intelligence`: Softmax stress probabilities, residual vectors, dynamic graph inspector, and research novelty analysis.
  4. `Sensor Health & Reliability`: Data quality index ($q_{i,t}$), packet loss tracking, sensor drift detection, and single-click zero-offset recalibration.
  5. `Evaluation & Benchmarks`: Rigorous research metrics including **Zone-Transfer Robustness Gap (ZTRG)**, water efficiency ($L/kg$), early lead times, Brier score calibration, and cross-zone comparison charts.
  6. `FastAPI Integration Hub`: Seamless toggle between Standalone Simulation Engine and Member 3's live FastAPI backend.
- [x] **Constrained Intervention Modal**: Safety limits, actuator parameter controls, and closed-loop response verification.
- [x] **Filters & State Controls**: Global Zone selector, Time range filters (`1h`, `24h`, `7d`, `30d`), and live telemetry stream pause/resume.
- [x] **CSV Report Exporters**: Instant downloadable CSV reports for Telemetry, Interventions, and Model Predictions.

---

### 🏃 Quick Start (How to Run)

1. **Navigate to the frontend directory**:
   ```powershell
   cd "e:\Course Projects\ml project\frontend"
   ```

2. **Start the Vite development server**:
   ```powershell
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

3. **Build for production**:
   ```powershell
   npm run build
   ```
