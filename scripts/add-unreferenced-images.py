#!/usr/bin/env python3
"""
Add unreferenced images from asset folders to MDX files.
For each project, finds images in the folder that aren't imported
in the MDX, then adds imports and a ProjectMediaGrid at the bottom.
"""

import re
import sys
from pathlib import Path

DRY_RUN = "--dry-run" in sys.argv

ASSETS = Path("src/assets/projects")
CONTENT = Path("src/content/projects")
SKIP_MDX = {
    "closed-ecommerce.mdx",
    "museum-digital.mdx",
    "reteach-design-system.mdx",
    "reteach-ai-course-creation.mdx",
    "reteach-compliance-workflows.mdx",
    "algorithmic-film.mdx",
}
SKIP_FOLDERS = {"closed", "museum-digital", "reteach", "algorithmic-film"}


def get_mdx_files():
    files = []
    for cat in ["clients", "research", "teaching"]:
        for f in sorted((CONTENT / cat).glob("*.mdx")):
            if f.name not in SKIP_MDX:
                files.append(f)
    return files


def get_imported_files(content):
    """Get set of filenames imported in MDX content."""
    imported = set()
    for m in re.finditer(r'from\s+"[^"]*?/([^/"]+)"', content):
        imported.add(m.group(1))
    # Cover image
    cm = re.search(r"image:\s*\S*?/([^/\s]+)\s*$", content, re.MULTILINE)
    if cm:
        imported.add(cm.group(1))
    return imported


def get_asset_folder(content):
    """Extract asset folder name from imports or cover path."""
    folders = re.findall(r"assets/projects/([^/]+)/", content)
    for f in folders:
        if f not in SKIP_FOLDERS and (ASSETS / f).exists():
            return f
    return None


def get_highest_img_number(content):
    """Find the highest imgNN variable number in the file."""
    numbers = [int(m) for m in re.findall(r"img(\d+)", content)]
    return max(numbers) if numbers else 0


def process_mdx(mdx_path):
    with open(mdx_path) as f:
        content = f.read()

    folder_name = get_asset_folder(content)
    if not folder_name:
        return 0

    folder_path = ASSETS / folder_name
    if not folder_path.exists():
        return 0

    imported = get_imported_files(content)

    # Get all images in folder (not in duplicates/)
    all_imgs = sorted(
        f.name
        for f in folder_path.iterdir()
        if f.is_file() and f.suffix.lower() in (".png", ".jpg", ".jpeg")
    )

    unreferenced = [img for img in all_imgs if img not in imported]
    if not unreferenced:
        return 0

    print(f"\n[{mdx_path.stem}] Adding {len(unreferenced)} images")

    # Build new imports and grid
    highest = get_highest_img_number(content)
    new_imports = []
    new_items = []

    for i, img in enumerate(unreferenced):
        var_num = highest + 1 + i
        var_name = f"img{var_num:02d}"
        import_path = f"../../../assets/projects/{folder_name}/{img}"
        new_imports.append(f'import {var_name} from "{import_path}";')
        new_items.append(f'    {{ type: "image", src: {var_name}, alt: "" }}')
        print(f"  + {var_name} <- {img}")

    # Find where to insert imports (after last existing import)
    import_positions = [m.end() for m in re.finditer(r'^import .+;$', content, re.MULTILINE)]
    if import_positions:
        insert_pos = import_positions[-1]
    else:
        # After frontmatter closing ---
        fm_end = content.find("---", content.find("---") + 3)
        insert_pos = fm_end + 3

    # Insert new imports
    imports_block = "\n" + "\n".join(new_imports)
    content = content[:insert_pos] + imports_block + content[insert_pos:]

    # Build grid component
    grid = "\n<ProjectMediaGrid\n  columns={2}\n  items={[\n"
    grid += ",\n".join(new_items)
    grid += ",\n  ]}\n/>\n"

    # Append grid at end of file
    content = content.rstrip() + "\n" + grid

    if not DRY_RUN:
        with open(mdx_path, "w") as f:
            f.write(content)

    return len(unreferenced)


def main():
    if DRY_RUN:
        print("=== DRY RUN ===\n")

    total = 0
    for mdx in get_mdx_files():
        total += process_mdx(mdx)

    print(f"\n=== Added {total} images total ===")
    if DRY_RUN:
        print("(Dry run — no changes made)")


if __name__ == "__main__":
    main()
