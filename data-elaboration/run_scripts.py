import subprocess
import sys

# List of script filenames to run
scripts = [
    "./files/script_input.py",
    "./files/script_dayView.py",
    "./files/miner_dataset.py",   
    "./files/transaction.py",
    "./files/neighbour_script.py"
]

def run_script(script):
    """Run a Python script and check if it completes successfully."""
    try:
        # Run the script using subprocess
        result = subprocess.run(
            [sys.executable, script],  # sys.executable ensures the correct Python interpreter is used
            check=True,                # Raise an exception if the script fails
            text=True                  # Capture output as text (instead of bytes)
        )
        print(f"{script} completed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error: {script} failed with error: {e}")
        return False
    return True

def run_scripts_in_sequence():
    """Run each script in the list sequentially."""
    for script in scripts:
        if not run_script(script):
            print(f"Stopping execution because {script} failed.")
            break  # Exit if any script fails

if __name__ == "__main__":
    run_scripts_in_sequence()