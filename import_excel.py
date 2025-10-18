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

    # ✅ Define Excel file once
    xls = pd.ExcelFile(EXCEL_FILE)

    # === Drinks ===
    output = {
        "cocktails": sheet_to_list(pd.read_excel(xls, "Cocktails"), "cocktails") if "Cocktails" in xls.sheet_names else [],
        "beer": sheet_to_list(pd.read_excel(xls, "Beer"), "beer") if "Beer" in xls.sheet_names else [],
        "equipment": sheet_to_list(pd.read_excel(xls, "Equipment"), "equipment") if "Equipment" in xls.sheet_names else [],
        "snacks": sheet_to_list(pd.read_excel(xls, "Snacks"), "snacks") if "Snacks" in xls.sheet_names else [],
        "glasses": sheet_to_list(pd.read_excel(xls, "Glasses"), "glasses") if "Glasses" in xls.sheet_names else [],
        "misc": sheet_to_list(pd.read_excel(xls, "Misc"), "misc") if "Misc" in xls.sheet_names else [],
    }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"[OK] Exported Excel -> {OUTPUT_JSON}")

    # === Heroes ===
    if "Heroes" in xls.sheet_names:
        heroes_df = pd.read_excel(xls, "Heroes").fillna("")
        heroes = []
        for _, row in heroes_df.iterrows():
            subtitles = [
                str(row.get("Subtitle 1", "")).strip(),
                str(row.get("Subtitle 2", "")).strip(),
                str(row.get("Subtitle 3", "")).strip()
            ]
            subtitles = [s for s in subtitles if s]  # remove empties

            heroes.append({
                "id": str(row.get("ID", "")).strip(),
                "page": str(row.get("Page", "")).strip(),
                "title": str(row.get("Title", "")).strip(),
                "subtitles": subtitles,
                "description": str(row.get("Description", "")).strip(),
                "image": str(row.get("Image Filename", "")).strip(),
                "filter": str(row.get("Filter", "Y")).strip().upper() == "Y",
                "style_class": str(row.get("Style Class", "")).strip(),
                "height": str(row.get("Height", "250px")).strip(),
                "gradient": str(row.get("Gradient", "")).strip(),
                "accordion_bg": str(row.get("Accordion Background", "")).strip(),
                "accordion_color": str(row.get("Accordion Color", "")).strip(),
                "button_enabled": str(row.get("Button Enabled", "Y")).strip().upper() == "Y",
                "button_text_1": str(row.get("Button Text 1", "")).strip(),
                "button_link_1": str(row.get("Button Link 1", "")).strip(),
                "button_text_2": str(row.get("Button Text 2", "")).strip(),
                "button_link_2": str(row.get("Button Link 2", "")).strip()
            })

        with open("data/heroes.json", "w", encoding="utf-8") as f:
            json.dump(heroes, f, indent=2, ensure_ascii=False)

        print("[OK] Exported Excel -> data/heroes.json")

if __name__ == "__main__":
    import_excel()
