import os
import json
from PIL import Image

# Paths
RAW_DIR = "images/_raw"
OUT_DIR = "images"
DATA_FILE = "data/images.json"
WATERMARK = "logo2.png"  # transparent PNG logo

# Size rules per category
SIZES = {
    "cocktails": (600, 800),   # portrait
    "beer": (500, 700),        # pint
    "equipment": (800, 600)    # landscape
}

def add_watermark(img, watermark_path):
    """Apply watermark bottom-right for cocktails only."""
    watermark = Image.open(watermark_path).convert("RGBA")

    # Scale watermark relative to image width
    scale = img.width // 5
    wm_width = scale
    wm_height = int(scale * watermark.height / watermark.width)
    watermark = watermark.resize((wm_width, wm_height))

    # Position bottom-right with padding
    position = (img.width - wm_width - 10, img.height - wm_height - 10)
    img.alpha_composite(watermark, position)
    return img

def process_folder(category, db):
    """Process images from _raw folder into optimized JPG + WebP and update JSON."""
    raw_folder = os.path.join(RAW_DIR, category)
    out_folder = os.path.join(OUT_DIR, category)
    os.makedirs(out_folder, exist_ok=True)

    if not os.path.exists(raw_folder):
        print(f"⚠️ Skipping {category}, no raw folder found.")
        return

    for file in os.listdir(raw_folder):
        if not file.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        src_path = os.path.join(raw_folder, file)
        name, _ = os.path.splitext(file)

        try:
            img = Image.open(src_path).convert("RGBA")
            img = img.resize(SIZES[category], Image.LANCZOS)

            # watermark only cocktails
            if category == "cocktails" and os.path.exists(WATERMARK):
                img = add_watermark(img, WATERMARK)

            # Save JPG
            jpg_name = f"{name}.jpg"
            jpg_path = os.path.join(out_folder, jpg_name)
            img.convert("RGB").save(jpg_path, "JPEG", quality=85)

            # Save WebP
            webp_name = f"{name}.webp"
            webp_path = os.path.join(out_folder, webp_name)
            img.save(webp_path, "WEBP", quality=80)

            print(f"✅ Processed {file} → {jpg_name}, {webp_name}")

            # Add to JSON database
            db[category].append({
                "name": name.replace("-", " ").title(),  # readable title
                "image": f"images/{category}/{jpg_name}",
                "image_webp": f"images/{category}/{webp_name}"
            })

        except Exception as e:
            print(f"❌ Error processing {file}: {e}")

def main():
    db = {"cocktails": [], "beer": [], "equipment": []}

    for category in SIZES.keys():
        process_folder(category, db)

    os.makedirs("data", exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)

    print(f"\n🎉 All done! Images processed and {DATA_FILE} updated.")

if __name__ == "__main__":
    main()


