import pandas as pd
import json

def sheet_to_list(sheet):
    """Convert DataFrame into list of dicts for cocktails"""
    items = []
    for _, row in sheet.iterrows():
        items.append({
            "name": row["Name"],
            "base": row["Base"],
            "glass": row["Glass"],
            "image": row["Image"],
            "ingredients": [i.strip() for i in str(row["Ingredients"]).split(".") if i.strip()],
            "short": row["Blurb"],
            "kegged": row.get("Kegged", "No"),
            "type": "cocktails",
            "flavours": [f.strip() for f in str(row.get("Flavours", "")).split(",") if f.strip()]
        })
    return items

def generate_json():
    # Load Excel file
    df = pd.read_excel("cocktails.xlsx", sheet_name=None)

    cocktails = sheet_to_list(df["Cocktails"]) if "Cocktails" in df else []

    # Save cocktails.json (used by Design Your Menu + Premium)
    cocktails_output = {"cocktails": cocktails}
    with open("data/cocktails.json", "w", encoding="utf-8") as f:
        json.dump(cocktails_output, f, indent=2, ensure_ascii=False)
    print("✅ cocktails.json updated!")

    # Save drinks.json (combined format for Sips + global use)
    drinks_output = {
        "cocktails": cocktails,
        "beer": [],        # placeholders until we wire Excel sheets for beer/equipment
        "equipment": []
    }
    with open("data/drinks.json", "w", encoding="utf-8") as f:
        json.dump(drinks_output, f, indent=2, ensure_ascii=False)
    print("✅ drinks.json updated!")

if __name__ == "__main__":
    generate_json()
