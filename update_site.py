import pandas as pd
import json
import subprocess
import sys
import os
import shutil

# --- File paths ---
EXCEL_FILE = "data/drinks.xlsx"
JSON_FILE = "data/drinks.json"
IMAGES_SRC = "data/images"
IMAGES_DEST = "assets/drinks"

def main():
    # --- Step 1: Excel → JSON ---
    print("Step 1: Importing Excel -> JSON ...")

    try:
        # Load workbook
        xls = pd.ExcelFile(EXCEL_FILE)

        # Normalize column names: lowercase, underscores
        def normalize_columns(df):
            df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
            return df

        # Safe parser
        def parse_sheet(sheet_name):
            if sheet_name in xls.sheet_names:
                df = xls.parse(sheet_name).fillna("")
                df = normalize_columns(df)
                return df.to_dict(orient="records")
            else:
                print(f"[WARN] Sheet '{sheet_name}' not found in Excel. Using empty list.")
                return []

        # Collect sheets
        drinks_data = {
            "cocktails": parse_sheet("Cocktails"),
            "beer": parse_sheet("Beer"),
            "spirits": parse_sheet("Spirits"),
            "misc": parse_sheet("Misc"),
            "equipment": parse_sheet("Equipment"),
            "glasses": parse_sheet("Glasses"),
            "snacks": parse_sheet("Snacks")
        }

        # Save JSON
        with open(JSON_FILE, "w", encoding="utf-8") as f:
            json.dump(drinks_data, f, indent=2, ensure_ascii=False)

        print(f"[OK] Exported Excel -> {JSON_FILE}")

    except Exception as e:
        print(f"[ERROR] Excel import failed: {e}")
        sys.exit(1)

    # --- Step 2: Validate JSON ---
    print("\nStep 2: Validating JSON ...")
    try:
        subprocess.check_call([sys.executable, "validate_json.py"])
    except subprocess.CalledProcessError:
        print("[ERROR] Validation failed.")
        sys.exit(1)

    # --- Step 3: Sync images ---
    print("\nStep 3: Syncing images ...")
    if not os.path.exists(IMAGES_DEST):
        os.makedirs(IMAGES_DEST)

    copied = 0
    for root, _, files in os.walk(IMAGES_SRC):
        for file in files:
            src_path = os.path.join(root, file)
            dest_path = os.path.join(IMAGES_DEST, file)

            if not os.path.exists(dest_path):
                shutil.copy2(src_path, dest_path)
                copied += 1

    print(f"[OK] Copied {copied} new images to {IMAGES_DEST}")

    # --- Step 4: Upload drinks.json → Firestore ---
    print("\nStep 4: Uploading drinks.json to Firestore ...")
    try:
        subprocess.check_call(["node", "uploadDrinks.js"])
    except subprocess.CalledProcessError:
        print("[ERROR] Firestore upload failed.")
        sys.exit(1)

    # --- Step 5: Commit + push ---
    print("\nStep 5: Committing + pushing changes ...")
    try:
        subprocess.check_call(["git", "add", "-A"])
        subprocess.check_call(["git", "commit", "-m", "Auto-update drinks, images, and Firestore"])
        subprocess.check_call(["git", "push", "origin", "main"])
        print("✅ Git commit + push complete!")
    except subprocess.CalledProcessError:
        print("[WARN] Git push failed. Please check manually.")

    print("\n🎉 Update complete!")

if __name__ == "__main__":
    main()

