import pandas as pd
import json

def sheet_to_list(sheet):
    """Convert a DataFrame into a list of dicts formatted for listings"""
    items = []
    for _, row in sheet.iterrows():
        # Split flavours into a list if provided
        flavour_list = []
        if pd.notna(row.get("Flavour", None)):
            flavour_list = [f.strip() for f in str(row["Flavour"]).split(",") if f.strip()]

        # Split ingredients if string with periods
        ingredients_list = []
        if pd.notna(row.get("Ingredients", None)):
            ingredients_list = [i.strip() for i in str(row["Ingredients"]).split(".") if i.strip()]

        items.append({
            "name": row["Name"],
            "base": row.get("Base", ""),
            "glass": row.get("Glass", ""),
            "image": row.get("Image", ""),
            "ingredients": ingredients_list,
            "short": row.get("Short", ""),
            "kegged": row.get("Kegged", "No"),
            "type": row.get("Type", "cocktails"),
            "flavour": flavour_list
        })
    return items

def generate_combined_json(excel_file="cocktails.xlsx", output_file="data/cocktails.json"):
    xls = pd.ExcelFile(excel_file)
    combined = {
        "cocktails": sheet_to_list(pd.read_excel(xls, "Cocktails")),
        "beer": sheet_to_list(pd.read_excel(xls, "Beer")),
        "equipment": sheet_to_list(pd.read_excel(xls, "Equipment"))
    }

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(combined, f, indent=2, ensure_ascii=False)

    print(f"✅ JSON generated and saved to {output_file}")

if __name__ == "__main__":
    generate_combined_json()
