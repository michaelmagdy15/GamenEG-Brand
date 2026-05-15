"""
Re-process product images using ORIGINAL photos (not rough-cut transparents).
Uses source JPEGs from Images/ folder for the cleanest possible cutout.
"""
from rembg import remove
from PIL import Image
import os

BASE = os.path.dirname(__file__)
ORIGINALS_DIR = os.path.join(BASE, "Images")
OUTPUT_DIR = os.path.join(BASE, "Images", "TRANSPARENT", "PNG")

# Map: source original -> output transparent PNG
# ALL from original photos, never from rough-cut transparent versions
images_to_process = [
    ("IMG_2212.JPG.jpeg", "IMG_2212_transparent.png"),
    ("IMG_2215.JPG.jpeg", "IMG_2215_transparent.png"),
    ("IMG_2220.JPG.jpeg", "IMG_2220_transparent.png"),
]

print("=== GAMÉN Clean Cutout (from originals) ===\n")

for src_name, dst_name in images_to_process:
    src_path = os.path.join(ORIGINALS_DIR, src_name)
    dst_path = os.path.join(OUTPUT_DIR, dst_name)
    
    if not os.path.exists(src_path):
        print(f"  SKIP: {src_name} not found")
        continue
    
    print(f"  Processing {src_name} -> {dst_name} ...")
    inp = Image.open(src_path)
    out = remove(inp)
    out.save(dst_path)
    print(f"    Done! ({os.path.getsize(dst_path) / 1024:.0f} KB)")

print("\n=== All originals processed ===")
