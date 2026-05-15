"""
inspect_pixels.py - Check pixel values in the enclosed white area of IMG_2212.
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

from PIL import Image

img = Image.open(r"C:\Users\Mi5a\GamenEG Brand\Images\TRANSPARENT\IMG_2212.JPG.jpeg").convert("RGB")
w, h = img.size
pixels = img.load()

print(f"Image size: {w} x {h}")

# Sample the region that appears to be the enclosed white area
# The bow-tie center gap is roughly in the top-center area
# Let's sample a strip across the center of the image
cx = w // 2
print(f"\nVertical strip at x={cx} (center column), y range 0..{h//3}:")
for y in range(0, h//3, 20):
    r, g, b = pixels[cx, y]
    print(f"  ({cx}, {y}): RGB=({r}, {g}, {b})")

print(f"\nHorizontal strip at y={h//5} (upper area):")
for x in range(w//4, 3*w//4, 20):
    r, g, b = pixels[x, h//5]
    print(f"  ({x}, {h//5}): RGB=({r}, {g}, {b})")

# Sample the narrow bridge area (top of center knot)
# That's roughly at 45-50% x, 20-35% y
print(f"\nBridge area scan (upper-center region):")
for y in range(int(h*0.15), int(h*0.40), 15):
    for x in range(int(w*0.35), int(w*0.65), 25):
        r, g, b = pixels[x, y]
        if r > 200 and g > 200 and b > 200:
            print(f"  ({x}, {y}): RGB=({r}, {g}, {b}) <- near white")
