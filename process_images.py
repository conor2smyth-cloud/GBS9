import os, json, math
from PIL import Image, ImageDraw, ImageFilter, ImageOps

RAW_DIR = "images/_raw"
OUT_DIR = "images"
DATA_FILE = "data/images.json"
WATERMARK = "images/logos/logo2.png"  # transparent PNG

SIZES = {
    "cocktails": (640, 800),   # portrait frame
    "beer":      (560, 760),   # pint-friendly
    "equipment": (900, 600)    # landscape
}

def fit_letterbox(im, frame):
    """Keep aspect ratio: fit image into a frame with subtle blurred border (no stretch)."""
    w, h = frame
    img = im.copy()
    img_ratio = img.width / img.height
    frame_ratio = w / h

    # scale to fit
    if img_ratio > frame_ratio:
        new_w = w
        new_h = int(w / img_ratio)
    else:
        new_h = h
        new_w = int(h * img_ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)

    # background (very dark, slightly blurred edges)
    bg = Image.new("RGBA", frame, (15, 15, 15, 255))
    x = (w - new_w) // 2
    y = (h - new_h) // 2
    bg.paste(img, (x, y), img if img.mode == "RGBA" else None)
    return bg

def add_vignette(img, strength=0.45):
    """Radial vignette: darker corners, premium focus."""
    w, h = img.size
    vignette = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(vignette)
    max_r = int(math.hypot(w, h) / 1.2)
    for r in range(max_r, 0, -8):
        val = int(255 * (1 - (r / max_r)) ** 1.8)
        bbox = [w//2 - r, h//2 - r, w//2 + r, h//2 + r]
        draw.ellipse(bbox, fill=val)
    vignette = vignette.filter(ImageFilter.GaussianBlur(35))
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, int(255 * strength)))
    img.alpha_composite(Image.merge("RGBA", (*overlay.split()[:3], vignette)))
    return img

def add_warm_tint(img, amount=0.07):
    """Very subtle warm tint for premium feel."""
    r, g, b, a = img.split()
    r = ImageEnhanceChannel(r, 1 + amount)
    g = ImageEnhanceChannel(g, 1 + amount*0.5)
    img = Image.merge("RGBA", (r, g, b, a))
    return img

def ImageEnhanceChannel(ch, factor):
    lut = [min(255, int(i*factor)) for i in range(256)]
    return ch.point(lut)

def add_watermark(img):
    if not os.path.exists(WATERMARK): return img
    wm = Image.open(WATERMARK).convert("RGBA")
    scale = max(60, img.width // 6)
    ratio = wm.height / wm.width
    wm = wm.resize((scale, int(scale*ratio)), Image.LANCZOS)
    pad = 14
    pos = (img.width - wm.width - pad, img.height - wm.height - pad)
    img.alpha_composite(wm, pos)
    return img

def save_dual(img, dest_base):
    jpg = dest_base + ".jpg"; webp = dest_base + ".webp"
    img.convert("RGB").save(jpg, "JPEG", quality=85, optimize=True)
    img.save(webp, "WEBP", quality=82, method=6)
    return jpg, webp

def process_category(cat, db):
    raw_dir = os.path.join(RAW_DIR, cat)
    out_dir = os.path.join(OUT_DIR, cat)
    os.makedirs(out_dir, exist_ok=True)
    frame = SIZES[cat]
    if not os.path.isdir(raw_dir):
        print(f"⚠️  No raw folder for {cat}, skipping.")
        return

    for file in os.listdir(raw_dir):
        if not file.lower().endswith((".jpg", ".jpeg", ".png", ".webp")): 
            continue
        src = os.path.join(raw_dir, file)
        name, _ = os.path.splitext(file)
        try:
            base = Image.open(src).convert("RGBA")
            out = fit_letterbox(base, frame)
            out = add_vignette(out, 0.42)
            out = add_warm_tint(out, 0.06)
            if cat == "cocktails":
                out = add_watermark(out)
            dest_base = os.path.join(out_dir, name)
            jpg, webp = save_dual(out, dest_base)
            db[cat].append({
                "name": name.replace("-", " ").title(),
                "image": jpg.replace("\\","/"),
                "image_webp": webp.replace("\\","/"),
                "bio": ""  # you can fill these later in JSON if you wish
            })
            print(f"✅ {cat}: {file} → {os.path.basename(jpg)}, {os.path.basename(webp)}")
        except Exception as e:
            print(f"❌ {file}: {e}")

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




