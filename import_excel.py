import pandas as pd
import json
import os

EXCEL_FILE = "data/drinks.xlsx"
OUTPUT_JSON = "data/drinks.json"

def sheet_to_list(sheet, dtype):
    """Convert a DataFrame into a list of dicts formatted for listings"""
    items = []
    for _, row in sheet.iterrows():
        item = {
            "name": str(row.get("Name", "")).strip(),
            "type": dtype,
            "base": str(row.get("Base Spirit", "")).strip() or None,
            "glass": str(row.get("Glass", "")).strip() or None,
            "ingredients": [
                i.strip() for i in str(row.get("Ingredients", "")).split(";") if i.strip()
            ],
            "short": str(row.get("Method / Blurb", "")).strip(),
            "image": str(row.get("Image Filename", "")).strip() or "coming-soon.jpg",
            "kegged": str(row.get("Kegged", "No")).strip(),
            "flavour": str(row.get("Flavour", "")).strip() or None
        }
        # Drop empty fields so JSON is clean
        item = {k: v for k, v in item.items() if v not in ["", None, "nan", "NaN"]}
        items.append(item)
    return items

def import_excel():
    if not os.path.exists(EXCEL_FILE):
        raise FileNotFoundError(f"[ERROR] Excel file not found: {EXCEL_FILE}")

    xls = pd.ExcelFile(EXCEL_FILE)

    data = {}
    for sheet_name in ["Cocktails", "Beer", "Spirits", "Snacks", "Glasses", "Misc"]:
        if sheet_name in xls.sheet_names:
            print(f"[INFO] Importing {sheet_name}...")
            data[sheet_name.lower()] = sheet_to_list(pd.read_excel(xls, sheet_name), sheet_name.lower())

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"[SUCCESS] Exported Excel -> {OUTPUT_JSON}")

def import_excel():
    xls = pd.ExcelFile(EXCEL_FILE)

    data = {
        "cocktails": sheet_to_list(pd.read_excel(xls, "Cocktails"), "cocktails") if "Cocktails" in xls.sheet_names else [],
        "beer": sheet_to_list(pd.read_excel(xls, "Beer"), "beer") if "Beer" in xls.sheet_names else [],
        "equipment": sheet_to_list(pd.read_excel(xls, "Equipment"), "equipment") if "Equipment" in xls.sheet_names else [],
        "snacks": sheet_to_list(pd.read_excel(xls, "Snacks"), "snacks") if "Snacks" in xls.sheet_names else [],
        "glasses": sheet_to_list(pd.read_excel(xls, "Glasses"), "glasses") if "Glasses" in xls.sheet_names else [],
        "misc": sheet_to_list(pd.read_excel(xls, "Misc"), "misc") if "Misc" in xls.sheet_names else [],
    }

    # Ensure all keys exist, even if not in Excel
    for key in ["cocktails", "beer", "equipment", "snacks", "glasses", "misc"]:
        if key not in data:
            data[key] = []

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"[OK] Exported Excel -> {OUTPUT_JSON}")

def import_excel():
    xls = pd.ExcelFile(EXCEL_FILE)

    # Existing drinks import...
    output = {
        "cocktails": sheet_to_list(pd.read_excel(xls, "Cocktails"), "cocktails"),
        "beer": sheet_to_list(pd.read_excel(xls, "Beer"), "beer"),
        "equipment": sheet_to_list(pd.read_excel(xls, "Equipment"), "equipment"),
        "snacks": sheet_to_list(pd.read_excel(xls, "Snacks"), "snacks"),
        "misc": sheet_to_list(pd.read_excel(xls, "Misc"), "misc"),
        "glasses": sheet_to_list(pd.read_excel(xls, "Glasses"), "glasses"),
    }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    # Heroes sheet -> heroes.json
    if "Heroes" in xls.sheet_names:
        heroes_df = pd.read_excel(xls, "Heroes").fillna("")
        heroes = []
        for _, row in heroes_df.iterrows():
            heroes.append({
                "page": str(row.get("Page", "")).strip(),
                "section": str(row.get("Section", "")).strip(),
                "header": str(row.get("Header Text", "")).strip(),
                "image": str(row.get("Image Filename", "")).strip(),
                "filter": str(row.get("Filter", "Y")).strip().upper() == "Y",
                "height": str(row.get("Height", "250px")).strip(),
            })

        with open("data/heroes.json", "w", encoding="utf-8") as f:
            json.dump(heroes, f, indent=2, ensure_ascii=False)



if __name__ == "__main__":
    import_excel()

