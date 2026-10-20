# Running the demonstration on Windows 11

Prerequisites: Python 3.11, Node.js LTS, Git, VS Code (optional). In separate PowerShell terminals:

## Terminal A — API
```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m pytest -v
python -m uvicorn app.main:app --reload
```
If PowerShell blocks activation, run `Set-ExecutionPolicy -Scope Process RemoteSigned` and retry. Confirm `http://127.0.0.1:8000/health` reports `predictor_loaded: true`. Swagger docs: `http://127.0.0.1:8000/docs`.

## Terminal B — Web app
```powershell
cd frontend
node --version
npm --version
npm ci
npm run build
npm run dev
```
Open `http://localhost:5173`. For npm's PowerShell policy conflicts use `npm.cmd` rather than `npm`.

## Inference sanity check
In Swagger execute `GET /predict/record` with line = `1`, timestamp = `2023-08-30T06:00:00+00:00`, split = `test`. Should return class `0` and a class-1 score around `0.000359885`, or `0.04%` in the rounded frontend. Compare actual class and timestamp as well.

## Security before publishing
The current lockfile reports historical advisories inherited from Tailwind 3 (`braces` and `postcss-selector-parser`) in the user's npm audit. **Do not publicly deploy this unchanged.** Audit and migrate/test dependencies rather than applying `npm audit fix --force` blindly. The app is intended for localhost. A >500 kB Vite bundle warning is a performance warning, not a build failure. Do not commit `.env`, `.venv`, `node_modules`, or large downloaded original datasets.
