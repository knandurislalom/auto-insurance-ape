#!/bin/bash

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

echo "Python environment setup complete!"
echo "To activate the environment, run: source venv/bin/activate"
echo "To start the server, run: python main.py"
