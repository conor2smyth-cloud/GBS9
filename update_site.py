import subprocess

def run_command(command, error_message):
    """Run a system command and handle errors clearly"""
    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {error_message}")
        print("DETAILS:")
        print(e.stdout)
        print(e.stderr)
        return False

def update_site():
    print("🔄 Step 1: Importing Excel → JSON ...")
    if not run_command(["python", "import_excel.py"], "Failed to convert Excel into JSON. Check your Excel formatting."):
        return

    print("🔍 Step 2: Validating JSON ...")
    if not run_command(["python", "validate_json.py"], "Validation failed. JSON structure doesn’t match schema.json."):
        return

    print("⬆️ Step 3: Committing & pushing to GitHub ...")
    if not run_command(["git", "add", "."], "Git add failed."):
        return
    if not run_command(["git", "commit", "-m", "Auto-update drinks.json"], "Git commit failed."):
        return
    if not run_command(["git", "push"], "Git push failed. Check your connection or branch."):
        return

    print("✅ Site updated and pushed successfully!")

if __name__ == "__main__":
    update_site()
