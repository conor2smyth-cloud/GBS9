import pandas as pd
import json
import os

INPUT_EXCEL = "cocktails.xlsx"
OUTPUT_JSON = "data/drinks.json"

def safe_str(value, default=""):
    """Convert Excel cell to string safely, handle NaN/None/float."""
    if pd.isna(value):
        return default
    return str(value).strip()

def sheet_to_list(sheet, item_type):
    """Convert a DataFrame into a list of dicts formatted for listings."""
    items = []
    for _, row in sheet.iterrows():
        items.append({
            "name": safe_str(row.get("Name")),
            "type": item_type,
            "base": safe_str(row.get("Base Spirit")),
            "glass": safe_str(row.get("Glass")),
            "ingredients": [
                ing.strip() for ing in safe_str(row.get("Ingredients")).split(";") if ing.strip()
            ],
            "short": safe_str(row.get("Method / Blurb")),
            "image": safe_str(row.get("Image Filename"), "coming-soon.jpg"),
            "kegged": safe_str(row.get("Kegged"), "No"),
            "flavour": safe_str(row.get("Flavour"))
        })
    return items

def import_excel():
    if not os.path.exists(INPUT_EXCEL):
        print(f"[ERROR] Excel file not found: {INPUT_EXCEL}")
        return

    try:
        xls = pd.ExcelFile(INPUT_EXCEL)
        data = {
            "cocktails": sheet_to_list(pd.read_excel(xls, "Cocktails"), "cocktails"),
            "beer": sheet_to_list(pd.read_excel(xls, "Beer"), "beer"),
            "equipment": sheet_to_list(pd.read_excel(xls, "Equipment"), "equipment"),
            "snacks": sheet_to_list(pd.read_excel(xls, "Snacks"), "snacks"),
            "glasses": sheet_to_list(pd.read_excel(xls, "Glasses"), "glasses"),
            "misc": sheet_to_list(pd.read_excel(xls, "Misc"), "misc"),
        }

        with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"[OK] Exported Excel -> {OUTPUT_JSON}")


    except Exception as e:
        print("[ERROR] Failed to convert Excel into JSON. Check formatting.")
        print("DETAILS:", e)

if __name__ == "__main__":
    import_excel()
