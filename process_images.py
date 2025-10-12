import os, json, math
from PIL import Image, ImageDraw, ImageFilter

RAW_DIR = "images/_raw"
OUT_DIR = "images"
DATA_FILE = "data/images.json"
WATERMARK = "images/logos/logo2.png"  # transparent PNG; fallback to no watermark if missing

# Target frames (no squashing; we letterbox to these)
SIZES = {
    "cocktails": (640, 800),   # portrait frame
    "beer":      (560, 760),   # pint-friendly
    "equipment": (900, 600)    # landscape
}

def fit_letterbox(im, frame):
    """Keep aspect ratio – fit into frame with subtle dark background (no stretch)."""
    w, h = frame
    img = im.copy()
    img_ratio = img.width / img.height
    frame_ratio = w / h

    if img_ratio > frame_ratio:
        new_w = w
        new_h = int(w / img_ratio)
    else:
        new_h = h
        new_w = int(h * img_ratio)

    img = img.resize((new_w, new_h), Image.LANCZOS)

    bg = Image.new("RGBA", (w, h), (18, 18, 18, 255))
    x = (w - new_w) // 2
    y = (h - new_h) // 2
    bg.paste(img, (x, y), img if img.mode == "RGBA" else None)
    return bg

def add_vignette(img, strength=0.18):
    """Very light vignette for subtle focus."""
    w, h = img.size
    # radial alpha mask
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    max_r = int(math.hypot(w, h) / 1.15)
    for r in range(max_r, 0, -10):
        val = int(255 * (1 - (r / max_r)) ** 1.8)
        bbox = [w//2 - r, h//2 - r, w//2 + r, h//2 + r]
        draw.ellipse(bbox, fill=val)
    mask = mask.filter(ImageFilter.GaussianBlur(40))

    overlay = Image.new("RGBA", (w, h), (0, 0, 0, int(255 * strength)))
    vignetted = Image.new("RGBA", (w, h))
    vignetted = Image.composite(overlay, Image.new("RGBA", (w, h), (0,0,0,0)), mask)
    img.alpha_composite(vignetted)
    return img

def add_tint(img, amount=0.03):
    """Very subtle warm tint (almost imperceptible)."""
    # Apply by blending a warm overlay with low alpha
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (255, 210, 150, int(255 * amount)))  # warm beige
    img.alpha_composite(overlay)
    return img

def add_watermark(img):
    try:
        if not os.path.exists(WATERMARK):
            return img
        wm = Image.open(WATERMARK).convert("RGBA")
        target_w = max(56, img.width // 7)   # smaller than before
        ratio = wm.height / wm.width
        wm = wm.resize((target_w, int(target_w * ratio)), Image.LANCZOS)
        pad = 12
        pos = (img.width - wm.width - pad, img.height - wm.height - pad)
        img.alpha_composite(wm, pos)
    except Exception:
        pass
    return img

def save_dual(img, dest_base):
    jpg = dest_base + ".jpg"
    webp = dest_base + ".webp"
    img.convert("RGB").save(jpg, "JPEG", quality=86, optimize=True)
    img.save(webp, "WEBP", quality=82, method=6)
    return jpg, webp

def process_category(cat, db):
    raw_dir = os.path.join(RAW_DIR, cat)
    out_dir = os.path.join(OUT_DIR, cat)
    os.makedirs(out_dir, exist_ok=True)

    if not os.path.isdir(raw_dir):
        print(f"⚠️  No raw/{cat} folder. Skipping.")
        return

    frame = SIZES[cat]
    files = [f for f in os.listdir(raw_dir) if f.lower().endswith((".jpg",".jpeg",".png",".webp"))]
    for file in files:
        src = os.path.join(raw_dir, file)
        name, _ = os.path.splitext(file)
        try:
            base = Image.open(src).convert("RGBA")
            # Fit & finish
            out = fit_letterbox(base, frame)
            out = add_vignette(out, 0.18)
            out = add_tint(out, 0.03)
            if cat == "cocktails":
                out = add_watermark(out)

            dest_base = os.path.join(out_dir, name)
            jpg, webp = save_dual(out, dest_base)
            entry = {
                "name": name.replace("-", " ").title(),
                "image": jpg.replace("\\","/"),
                "image_webp": webp.replace("\\","/")
            }
            # optional fields for premium/tinder pages (safe defaults)
            entry.update({"bio": ""})
            db[cat].append(entry)

            print(f"✅ {cat}: {file} → {os.path.basename(jpg)}, {os.path.basename(webp)}")
        except Exception as e:
            print(f"❌ {cat}: {file} — {e}")

def main():
    os.makedirs("data", exist_ok=True)
    db = {"cocktails": [], "beer": [], "equipment": []}
    for cat in SIZES.keys():
        process_category(cat, db)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)
    print(f"\n🎉 Done. Updated {DATA_FILE}")

if __name__ == "__main__":
    main()




