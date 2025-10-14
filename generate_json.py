import json
import os

def generate_combined_json():
    # Load cocktails.json
    with open("data/cocktails.json", "r", encoding="utf-8") as f:
        cocktails = json.load(f)

    # Beer and equipment placeholders (populate however you like)
    beer = [
        {"name": "Guinness", "image": "guinness.jpg", "short": "Iconic Irish stout"},
        {"name": "Heineken", "image": "heineken.jpg", "short": "Crisp Dutch lager"}
    ]
    equipment = [
        {"name": "Cocktail Shaker", "image": "shaker.jpg", "short": "Essential for mixing drinks"}
    ]

    # Create drinks.json with cocktails pulled directly
    combined = {
        "cocktails": cocktails,
        "beer": beer,
        "equipment": equipment
    }

    with open("data/drinks.json", "w", encoding="utf-8") as f:
        json.dump(combined, f, indent=2, ensure_ascii=False)

    print("✅ drinks.json updated successfully!")

if __name__ == "__main__":
    generate_combined_json()
