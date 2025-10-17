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
            "base": str(row.get("Base Spirit", "")).strip() or "",
            "glass": str(row.get("Glass", "")).strip() or "",
            "ingredients": [
                i.strip() for i in str(row.get("Ingredients", "")).split(";") if i.strip()
            ],
            "short": str(row.get("Method / Blurb", "")).strip(),
            "image": str(row.get("Image Filename", "")).strip() or "coming-soon.jpg",
            "kegged": str(row.get("Kegged", "No")).strip(),
            "flavour": str(row.get("Flavour", "")).strip() or ""
        }
        # Drop empty fields so JSON is clean
        item = {k: v for k, v in item.items() if v not in ["", "", "nan", "NaN"]}
        items.append(item)
    return items

def import_excel():
    if not os.path.exists(EXCEL_FILE):
        raise FileNotFoundError(f"[ERROR] Excel file not found: {EXCEL_FILE}")

    xls = pd.ExcelFile(EXCEL_FILE)

    # Drinks data
    data = {
        "cocktails": sheet_to_list(pd.read_excel(xls, "Cocktails"), "cocktails") if "Cocktails" in xls.sheet_names else [],
        "beer": sheet_to_list(pd.read_excel(xls, "Beer"), "beer") if "Beer" in xls.sheet_names else [],
        "equipment": sheet_to_list(pd.read_excel(xls, "Equipment"), "equipment") if "Equipment" in xls.sheet_names else [],
        "snacks": sheet_to_list(pd.read_excel(xls, "Snacks"), "snacks") if "Snacks" in xls.sheet_names else [],
        "glasses": sheet_to_list(pd.read_excel(xls, "Glasses"), "glasses") if "Glasses" in xls.sheet_names else [],
        "misc": sheet_to_list(pd.read_excel(xls, "Misc"), "misc") if "Misc" in xls.sheet_names else [],
    }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"[OK] Exported Excel -> {OUTPUT_JSON}")

    # Heroes sheet
    if "Heroes" in xls.sheet_names:
        heroes_df = pd.read_excel(xls, "Heroes").fillna("")
        heroes = []
        for _, row in heroes_df.iterrows():
            # Button handling
            enabled_raw = str(row.get("Button Enabled", "")).strip().upper()
            btn_enabled = enabled_raw == "Y"
            btn_text = str(row.get("Button Text", "")).strip()
            btn_link = str(row.get("Button Link", "")).strip()
            if not btn_text or not btn_link:
                btn_enabled = False

            # Visual settings
            style_class = str(row.get("Style Class", "")).strip()
            height = str(row.get("Height", "")).strip()
            gradient = str(row.get("Gradient", "")).strip()
            acc_color = str(row.get("Accordion Color", "")).strip()
            acc_bg = str(row.get("Accordion Background", "")).strip()

            heroes.append({
                "id": str(row.get("ID", "")).strip(),
                "page": str(row.get("Page", "")).strip(),
                "title": str(row.get("Title", "")).strip(),
                "subtitle": str(row.get("Subtitle", "")).strip(),
                "image": str(row.get("Image Filename", "")).strip(),
                "filter": str(row.get("Filter", "Y")).strip().upper() == "Y",
                "style_class": style_class if style_class else "",
                "height": height if height else "",
                "gradient": gradient if gradient else "",
                "accordion": str(row.get("Accordion", "Y")).strip().upper() == "Y",
                "description": str(row.get("Description", "")).strip(),
                "accordion_color": acc_color if acc_color else "",
                "accordion_bg": acc_bg if acc_bg else "",
                "button_enabled": btn_enabled,
                "button_text": btn_text,
                "button_link": btn_link
            })

        with open("data/heroes.json", "w", encoding="utf-8") as f:
            json.dump(heroes, f, indent=2, ensure_ascii=False)

        print(f"[OK] Exported Heroes -> data/heroes.json")

if __name__ == "__main__":
    import_excel()

