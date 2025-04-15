#!/bin/bash

# Activate virtual environment if needed
# source venv/bin/activate  # Uncomment if you're using venv

echo "[INFO] Starting automation sequence..."

echo "[STEP 1] Running main.py"
python3 main.py

echo "[STEP 2] Running resume.py"
python3 resume.py

echo "[STEP 3] Running basic-information.py"
python3 basic-information.py

echo "[STEP 4] Running apply.py"
python3 apply.py

echo "[STEP 5] Running volunteer.py"
python3 volunteer.py

echo "[STEP 6] Running self-identity.py"
python3 self-identity.py

echo "[COMPLETE] All scripts executed successfully."
