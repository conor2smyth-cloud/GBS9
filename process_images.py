import os
import re
from PIL import Image

INPUT_DIR = "images/_raw/cocktails"   # <-- fixed path
OUTPUT_DIR = "images/cocktails"

def normalize_filename(name):
    name = name.lower()
    name = re.sub(r"[^a-z0-9]+", "-", name).strip("-")
    return f"cocktail-{name}.jpg"

def process_images():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    seen = set()

    for filename in os.listdir(INPUT_DIR):
        filepath = os.path.join(INPUT_DIR, filename)

        if not os.path.isfile(filepath):
            continue

        base, ext = os.path.splitext(filename)
        if ext.lower() not in [".jpg", ".jpeg", ".png", ".webp"]:
            continue

        new_name = normalize_filename(base)
        new_path = os.path.join(OUTPUT_DIR, new_name)

        if new_name in seen or os.path.exists(new_path):
            print(f"🗑 Removing duplicate/mismatched file: {filename}")
            os.remove(filepath)
            continue

        seen.add(new_name)

        try:
            with Image.open(filepath) as img:
                rgb_img = img.convert("RGB")
                rgb_img.save(new_path, "JPEG", quality=85)

            webp_path = new_path.replace(".jpg", ".webp")
            rgb_img.save(webp_path, "WEBP", quality=85)

            print(f"✅ Processed: {filename} → {new_name}")

        except Exception as e:
            print(f"❌ Failed to process {filename}: {e}")

    print("\n🎉 Image processing complete. All filenames normalized to cocktail-*.jpg")

if __name__ == "__main__":
    process_images()
