"""
bg_remove.py - Remove white/near-white backgrounds from bow-tie product photos.

Strategy:
  Pass 1: BFS flood-fill from ALL border pixels -> removes outer background.
  Pass 2: Any remaining near-white pixel NOT part of the product is interior
          background (enclosed cavities like the bow-tie gap). We detect these
          by running a second flood-fill that seeds from EVERY remaining white
          pixel that isn't already marked as subject, scanning inward. But that
          would eat into white elements. Instead we use: grow the SUBJECT mask
          outward from the first pass, then anything still near-white inside is
          background.
  Simpler equivalent used here:
  - After pass 1 mask is built, perform a GLOBAL threshold: any pixel whose
    RGB is all >= WHITE-THRESHOLD and whose alpha in the current mask is 255
    (i.e. "subject") gets re-checked. We run a connected-component analysis:
    small near-white blobs entirely enclosed by the subject are probably the
    real enclosed gap, so we remove them.
  - Finally feather edges.

Requires:  pip install Pillow
"""

import sys
import io
from pathlib import Path
from collections import deque
from PIL import Image, ImageFilter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# ── Config ────────────────────────────────────────────────────────────────────
SRC_DIRS = [
    Path(r"C:\Users\Mi5a\GamenEG Brand\Images\TRANSPARENT"),
    Path(r"C:\Users\Mi5a\GamenEG Brand\Images\TRANSPARENT\PNG"),
]
OUT_DIR = Path(r"C:\Users\Mi5a\GamenEG Brand\Images\TRANSPARENT\PNG")
EXTENSIONS = {".jpg", ".jpeg", ".png"}

THRESHOLD = 60   # colour distance from white; 60 handles shadow bridge pixels (RGB ~215)
FEATHER   = 2    # Gaussian feather radius in pixels
# ──────────────────────────────────────────────────────────────────────────────


def is_near_white(r: int, g: int, b: int, t: int) -> bool:
    return r >= 255 - t and g >= 255 - t and b >= 255 - t


def build_alpha_mask(img_rgb: Image.Image, threshold: int) -> Image.Image:
    width, height = img_rgb.size
    pixels = img_rgb.load()

    # ── Pass 1: BFS from all border pixels ────────────────────────────────────
    bg = bytearray(width * height)          # 0 = subject, 1 = background

    queue = deque()
    # Seed from every border pixel
    for x in range(width):
        for y in [0, height - 1]:
            if not bg[y * width + x]:
                r, g, b = pixels[x, y][:3]
                if is_near_white(r, g, b, threshold):
                    bg[y * width + x] = 1
                    queue.append((x, y))
    for y in range(1, height - 1):
        for x in [0, width - 1]:
            if not bg[y * width + x]:
                r, g, b = pixels[x, y][:3]
                if is_near_white(r, g, b, threshold):
                    bg[y * width + x] = 1
                    queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x-1, y), (x+1, y), (x, y-1), (x, y+1)):
            if 0 <= nx < width and 0 <= ny < height:
                idx = ny * width + nx
                if not bg[idx]:
                    r, g, b = pixels[nx, ny][:3]
                    if is_near_white(r, g, b, threshold):
                        bg[idx] = 1
                        queue.append((nx, ny))

    # ── Pass 2: find enclosed near-white blobs (interior cavities) ───────────
    # Scan every pixel not yet marked background. If it's near-white, BFS it.
    # If the entire connected component NEVER touches the outer edge, it's
    # interior background (the bow-tie gap). Mark it as background too.
    visited = bytearray(width * height)

    def bfs_component(sx, sy):
        """Return (list_of_coords, touches_edge)."""
        stack = deque()
        stack.append((sx, sy))
        visited[sy * width + sx] = 1
        coords = [(sx, sy)]
        edge = (sx == 0 or sx == width-1 or sy == 0 or sy == height-1)
        while stack:
            cx, cy = stack.popleft()
            for nx, ny in ((cx-1, cy), (cx+1, cy), (cx, cy-1), (cx, cy+1)):
                if 0 <= nx < width and 0 <= ny < height:
                    nidx = ny * width + nx
                    if not bg[nidx] and not visited[nidx]:
                        r, g, b = pixels[nx, ny][:3]
                        if is_near_white(r, g, b, threshold):
                            visited[nidx] = 1
                            coords.append((nx, ny))
                            stack.append((nx, ny))
                            if nx == 0 or nx == width-1 or ny == 0 or ny == height-1:
                                edge = True
        return coords, edge

    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if not bg[idx] and not visited[idx]:
                r, g, b = pixels[x, y][:3]
                if is_near_white(r, g, b, threshold):
                    coords, touches_edge = bfs_component(x, y)
                    if not touches_edge:
                        # Interior cavity -> remove
                        for cx, cy in coords:
                            bg[cy * width + cx] = 1

    # ── Build mask image ───────────────────────────────────────────────────────
    mask = Image.new("L", (width, height), 255)
    mask_pixels = mask.load()
    for y in range(height):
        for x in range(width):
            if bg[y * width + x]:
                mask_pixels[x, y] = 0

    return mask


def remove_background(src: Path, dst: Path):
    img = Image.open(src).convert("RGB")
    mask = build_alpha_mask(img, THRESHOLD)

    if FEATHER > 0:
        mask = mask.filter(ImageFilter.GaussianBlur(radius=FEATHER))

    img_rgba = img.convert("RGBA")
    img_rgba.putalpha(mask)
    img_rgba.save(dst, format="PNG")
    print(f"  OK  {src.name}  ->  {dst.name}")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    processed = set()

    for src_dir in SRC_DIRS:
        for src in sorted(src_dir.iterdir()):
            if src.is_dir():
                continue
            if src.suffix.lower() not in EXTENSIONS:
                continue
            if src.stem.endswith("_transparent"):
                print(f"  skip (already converted): {src.name}")
                continue

            stem = src.stem
            for ext in (".JPG", ".JPEG", ".PNG", ".jpg", ".jpeg", ".png"):
                stem = stem.replace(ext, "")
            out_name = stem + "_transparent.png"
            dst = OUT_DIR / out_name

            if out_name in processed:
                print(f"  skip (duplicate): {src.name}")
                continue
            processed.add(out_name)

            print(f"Processing {src.name} ...")
            try:
                remove_background(src, dst)
            except Exception as e:
                print(f"  FAILED: {e}")

    print("\nDone! All transparent PNGs saved to:")
    print(f"  {OUT_DIR}")


if __name__ == "__main__":
    main()
