import os, json
from PIL import Image

# ========= CONFIG =========
RAW_FOLDERS = {
    "cocktails": "images/_raw/cocktails",
    "beer": "images/_raw/beer",
    "equipment": "images/_raw/equipment"
}
OUTPUT_FOLDERS = {
    "cocktails": "images/cocktails",
    "beer": "images/beer",
    "equipment": "images/equipment"
}
DATA_FILES = {
    "cocktails": "data/cocktails.json",
    "beer": "data/beer.json",
    "equipment": "data/equipment.json"
}
WATERMARK_PATH = "logo2.png"  # transparent logo
MAX_WIDTH = 800
MAX_HEIGHT = 800
# ==========================

def process_image(src, dest, watermark):
    """Resize, watermark, and save image maintaining aspect ratio"""
    img = Image.open(src).convert("RGBA")
    img.thumbnail((MAX_WIDTH, MAX_HEIGHT))

    if watermark:
        wm = watermark.copy()
        wm.thumbnail((int(img.width * 0.2), int(img.height * 0.2)))
        pos = (img.width - wm.width - 10, img.height - wm.height - 10)
        img.alpha_composite(wm, pos)

    if img.mode != "RGB":
        img = img.convert("RGB")
    img.save(dest, "JPEG", quality=85)


def make_entries(src_folder, category):
    """Generate JSON entries from filenames"""
    entries = []
    if not os.path.exists(src_folder):
        print(f"⚠️ Missing folder: {src_folder}")
        return entries

    for filename in os.listdir(src_folder):
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            name = filename.replace("-", " ").replace(".jpg", "").replace(".jpeg", "").replace(".png", "").title()
            entry = {
                "name": name,
                "image": filename,
                "short": f"A {category} item: {name}."
            }

            # Category-specific defaults
            if category == "cocktails":
                entry.update({
                    "base": "TBD",
                    "glass": "TBD",
                    "status": "available",
                    "kegged": "no"
                })
            elif category == "beer":
                entry.update({
                    "type": "lager",
                    "abv": "TBD"
                })
            elif category == "equipment":
                entry.update({
                    "usage": "bar setup",
                    "status": "in stock"
                })

            entries.append(entry)
    return entries


def main():
    os.makedirs("data", exist_ok=True)
    watermark = None
    if os.path.exists(WATERMARK_PATH):
        watermark = Image.open(WATERMARK_PATH).convert("RGBA")

    for category, src_folder in RAW_FOLDERS.items():
        dest_folder = OUTPUT_FOLDERS[category]
        os.makedirs(dest_folder, exist_ok=True)

        print(f"📂 Processing {category} images...")
        for filename in os.listdir(src_folder):
            if filename.lower().endswith((".jpg", ".jpeg", ".png")):
                src_path = os.path.join(src_folder, filename)
                dest_path = os.path.join(dest_folder, filename.replace(".png", ".jpg"))
                process_image(src_path, dest_path, watermark)

        print(f"📄 Generating {category}.json...")
        entries = make_entries(src_folder, category)
        with open(DATA_FILES[category], "w") as f:
            json.dump(entries, f, indent=2)

    print("✅ All images processed and JSON files generated.")


if __name__ == "__main__":
    main()
