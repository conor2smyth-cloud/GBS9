import subprocess
import sys

# Run a shell command and capture output
def run_command(cmd, stop_on_error=True):
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True, shell=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Command failed: {cmd}")
        if e.stdout:
            print("STDOUT:\n", e.stdout.strip())
        if e.stderr:
            print("STDERR:\n", e.stderr.strip())
        if stop_on_error:
            sys.exit(1)
        return None


def main():
    print("Step 1: Importing Excel -> JSON ...")
    if run_command("python import_excel.py", stop_on_error=False) is None:
        print("[ERROR] Failed to convert Excel into JSON. Check formatting.")
        sys.exit(1)
    print("[OK] Exported Excel -> data/drinks.json")

    print("\nStep 2: Validating JSON ...")
    if run_command("python validate_json.py", stop_on_error=False) is None:
        print("[ERROR] Validation failed. Fix JSON before proceeding.")
        sys.exit(1)
    print("[OK] data/drinks.json is valid against schema.json")

    print("\nStep 3: Committing & pushing to GitHub ...")

    # Stage and commit changes
    run_command("git add .")
    run_command('git commit -m "Auto-update drinks.json" || echo "No changes to commit"', stop_on_error=False)

    # Try normal push
    push_result = run_command("git push", stop_on_error=False)

    if push_result is None:  # Push failed, try upstream fix
        print("\n[WARNING] Git push failed. Trying to set upstream automatically...")
        upstream_result = run_command("git push --set-upstream origin main", stop_on_error=False)
        if upstream_result is None:
            print("\n[ERROR] Git push failed completely. Check your GitHub connection or branch name.")
            sys.exit(1)
        else:
            print("\n[OK] Git push fixed with --set-upstream origin main")
    else:
        print("\n[OK] Git push successful!")

    print("\nUpdate complete. GitHub Pages will rebuild automatically.")


if __name__ == "__main__":
    main()

def main():
    print("Step 1: Importing Excel -> JSON ...")
    if run_command("python import_excel.py", stop_on_error=False) is None:
        print("[ERROR] Failed to convert Excel into JSON. Check formatting.")
        sys.exit(1)
    print("[OK] Exported Excel -> data/drinks.json & data/heroes.json")

    print("\nStep 2: Validating JSON ...")
    if run_command("python validate_json.py", stop_on_error=False) is None:
        print("[ERROR] Validation failed. Fix JSON before proceeding.")
        sys.exit(1)

    print("\nStep 3: Committing & pushing to GitHub ...")
    run_command("git add .")
    run_command('git commit -m "Auto-update JSON" || echo "No changes to commit"', stop_on_error=False)
    push_result = run_command("git push", stop_on_error=False)

    if push_result is None:
        print("\n⚠️  Git push failed. Trying to set upstream automatically...")
        upstream_result = run_command("git push --set-upstream origin main", stop_on_error=False)
        if upstream_result is None:
            print("\n❌ Git push failed completely. Check your GitHub connection or branch name.")
            sys.exit(1)
        else:
            print("\n✅ Git push fixed with --set-upstream origin main")
    else:
        print("\n✅ Git push successful!")

    print("\n🎉 Update complete. GitHub Pages will rebuild automatically.")

import firebase_admin
from firebase_admin import credentials, firestore
import json

# Load Firestore service account
cred = credentials.Certificate("gbs9-service-key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load drinks.json
with open("data/drinks.json", "r", encoding="utf-8") as f:
    drinks_data = json.load(f)

# Define collections to push
collections = ["cocktails", "beer", "spirits", "mixers"]

for col in collections:
    if col in drinks_data:
        col_ref = db.collection(col)

        # Wipe existing collection
        docs = col_ref.stream()
        for doc in docs:
            doc.reference.delete()

        # Add updated drinks
        for drink in drinks_data[col]:
            col_ref.add(drink)

print("✅ Drinks pushed to Firestore!")
