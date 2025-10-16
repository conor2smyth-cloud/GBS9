import pandas as pd
import json
import os

def sheet_to_list(sheet, category):
    """Convert a DataFrame into a list of dicts formatted for listings."""
    items = []
    for _, row in sheet.iterrows():
        # Defensive read: replace NaN with empty strings
        name = str(row.get("Name", "")).strip()
        if not name:  # skip completely empty rows
            continue

        item = {
            "name": name,
            "base": str(row.get("Base", "")).strip(),
            "glass": str(row.get("Glass", "")).strip(),
            "image": str(row.get("Image", "")).strip(),
            "ingredients": str(row.get("Ingredients", "")).strip(),
            "short": str(row.get("Short", "")).strip(),
            "kegged": str(row.get("Kegged", "No")).strip(),
            "type": category
        }
        items.append(item)
    return items

def import_excel_to_json(excel_file, output_file="data/cocktails.json"):
    """Read Excel sheets and export to structured JSON for the site."""
    try:
        xls = pd.ExcelFile(excel_file)

        cocktails = sheet_to_list(xls.parse("cocktails"), "cocktails") if "cocktails" in xls.sheet_names else []
        beer = sheet_to_list(xls.parse("beer"), "beer") if "beer" in xls.sheet_names else []
        equipment = sheet_to_list(xls.parse("equipment"), "equipment") if "equipment" in xls.sheet_names else []
        glasses = sheet_to_list(xls.parse("glasses"), "glasses") if "glasses" in xls.sheet_names else []
        snacks = sheet_to_list(xls.parse("snacks"), "snacks") if "snacks" in xls.sheet_names else []
        misc = sheet_to_list(xls.parse("misc"), "misc") if "misc" in xls.sheet_names else []

        data = {
            "cocktails": cocktails,
            "beer": beer,
            "equipment": equipment,
            "glasses": glasses,
            "snacks": snacks,
            "misc": misc
        }

        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"✅ JSON successfully written to {output_file}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    import_excel_to_json("data/drinks.xlsx")

