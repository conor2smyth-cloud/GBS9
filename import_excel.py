import pandas as pd
import json

def sheet_to_list(sheet, type_name):
    """Convert DataFrame into list of dicts formatted for listings"""
    items = []
    for _, row in sheet.iterrows():
        item = {"name": row["Name"], "type": type_name}

        if "Base" in row: item["base"] = row["Base"]
        if "Glass" in row: item["glass"] = row["Glass"]
        if "Image" in row: item["image"] = row["Image"]
        if "Ingredients" in row:
            item["ingredients"] = [i.strip() for i in str(row["Ingredients"]).split(".") if i.strip()]
        if "Blurb" in row: item["short"] = row["Blurb"]
        if "Kegged" in row: item["kegged"] = row["Kegged"]
        if "Flavours" in row:
            item["flavours"] = [f.strip() for f in str(row["Flavours"]).split(",") if f.strip()]
        if "ABV" in row: item["abv"] = row["ABV"]
        if "Price" in row: item["price"] = row["Price"]
        if "Capacity" in row: item["capacity"] = row["Capacity"]

        items.append(item)
    return items

def generate_json():
    # Load Excel file
    df = pd.read_excel("cocktails.xlsx", sheet_name=None)

    cocktails = sheet_to_list(df["Cocktails"], "cocktails") if "Cocktails" in df else []
    beer = sheet_to_list(df["Beer"], "beer") if "Beer" in df else []
    equipment = sheet_to_list(df["Equipment"], "equipment") if "Equipment" in df else []
    glasses = sheet_to_list(df["Glasses"], "glasses") if "Glasses" in df else []
    snacks = sheet_to_list(df["Snacks"], "snacks") if "Snacks" in df else []
    misc = sheet_to_list(df["Misc"], "misc") if "Misc" in df else []

    # Save cocktails.json (used for Design Your Menu + Premium cocktails only)
    cocktails_output = {"cocktails": cocktails}
    with open("data/cocktails.json", "w", encoding="utf-8") as f:
        json.dump(cocktails_output, f, indent=2, ensure_ascii=False)
    print("✅ cocktails.json updated!")

    # Save drinks.json (master file for the site)
    drinks_output = {
        "cocktails": cocktails,
        "beer": beer,
        "equipment": equipment,
        "glasses": glasses,
        "snacks": snacks,
        "misc": misc
    }
    with open("data/drinks.json", "w", encoding="utf-8") as f:
        json.dump(drinks_output, f, indent=2, ensure_ascii=False)
    print("✅ drinks.json updated!")

if __name__ == "__main__":
    generate_json()

