# GitHub publish — user-executed workflow

Destination: https://github.com/DenisParker7/ML-project (was empty when previously checked). The original Mendeley dataset is licensed under CC BY 4.0. The project documents its original authors, citation, license, and preprocessing modifications in docs/DATA_AND_ATTRIBUTION.md. Verify that no separately identified third-party content requires additional permission before publication.

Open VS Code at **repository root**, then PowerShell:
```powershell
git --version
git init
git branch -M main
git status
git add .
git status
git commit -m "Add reproducible RC3SI ML demo, notebooks, FastAPI and React dashboard"
git remote add origin https://github.com/DenisParker7/ML-project.git
git push -u origin main
```
If `origin` already exists, run `git remote -v` and update it only if incorrect. If the remote contains commits, do not force-push; fetch and reconcile first. Authenticate through GitHub's normal sign-in flow.

Do not push `.venv/`, `node_modules/`, `dist/`, private keys, secrets, or unchecked source licenses. Ensure `git status` is clean after push and visit the GitHub README to verify.
