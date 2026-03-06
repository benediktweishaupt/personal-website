#!/usr/bin/env python3
"""
Cleanup script for project image assets:
1. Deduplicate images (move duplicates to subfolder)
2. Rename kept images to {slug}-NN.png
3. Update MDX imports to match new filenames
"""

import hashlib
import os
import re
import shutil
import sys
from pathlib import Path
from typing import Optional

DRY_RUN = "--dry-run" in sys.argv

ASSETS_ROOT = Path("src/assets/projects")
CONTENT_ROOT = Path("src/content/projects")

# Case study folders to skip
SKIP_ASSET_FOLDERS = {"closed", "museum-digital", "reteach", "algorithmic-film"}
SKIP_MDX_FILES = {
    "closed-ecommerce.mdx",
    "museum-digital.mdx",
    "reteach-design-system.mdx",
    "reteach-ai-course-creation.mdx",
    "reteach-compliance-workflows.mdx",
    "algorithmic-film.mdx",
}

# MDX slug -> asset folder name (only where they differ)
SLUG_TO_FOLDER = {
    "drei-drie-three-100-jahre-de-stijl": "drei-drie-three",
    "all-watched-over-by-machines-of-loving-grace": "all-watched-over",
    "sanity-is-something-better-outsourced": "sanity-outsourced",
    "synthetische-wahrnehmungsform-im-gestaltungsprozess": "synthetische-wahrnehmungsform",
    "talk-to-us-corona-awareness-campaign": "talk-to-us-corona",
    "digital-campfire-i": "digital-campfire-I-esac-cambrai",
}


def md5_file(path: Path) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def find_mdx_files():
    """Find all non-case-study MDX files."""
    mdx_files = []
    for category in ["clients", "research", "teaching"]:
        cat_dir = CONTENT_ROOT / category
        if not cat_dir.exists():
            continue
        for f in sorted(cat_dir.glob("*.mdx")):
            if f.name not in SKIP_MDX_FILES:
                mdx_files.append(f)
    return mdx_files


def parse_mdx_imports(mdx_path: Path):
    """Parse import statements from MDX file.
    Returns list of (var_name, relative_path, folder_name, filename)."""
    imports = []
    with open(mdx_path) as f:
        content = f.read()
    for match in re.finditer(
        r'^import\s+(\w+)\s+from\s+"([^"]+)"', content, re.MULTILINE
    ):
        var_name = match.group(1)
        rel_path = match.group(2)
        # Extract folder and filename from path like ../../../assets/projects/slug/file.png
        parts = rel_path.split("/")
        if "assets" in parts and "projects" in parts:
            idx = parts.index("projects")
            if idx + 2 < len(parts):
                folder = parts[idx + 1]
                filename = parts[idx + 2]
                imports.append((var_name, rel_path, folder, filename))
    return imports


def get_cover_path(mdx_path: Path):
    """Extract cover image path from frontmatter."""
    with open(mdx_path) as f:
        content = f.read()
    match = re.search(r"cover:\s*\n\s+image:\s*(.+)", content)
    if match:
        return match.group(1).strip()
    return None


def get_asset_folder(mdx_path: Path) -> Optional[str]:
    """Determine the asset folder for an MDX file."""
    slug = mdx_path.stem

    # Check explicit mapping
    if slug in SLUG_TO_FOLDER:
        folder = SLUG_TO_FOLDER[slug]
        if (ASSETS_ROOT / folder).exists():
            return folder

    # Try slug directly
    if (ASSETS_ROOT / slug).exists():
        return slug

    # Try from imports
    imports = parse_mdx_imports(mdx_path)
    for _, _, folder, _ in imports:
        if (ASSETS_ROOT / folder).exists():
            return folder

    # Try from cover path
    cover = get_cover_path(mdx_path)
    if cover:
        match = re.search(r"projects/([^/]+)/", cover)
        if match and (ASSETS_ROOT / match.group(1)).exists():
            return match.group(1)

    return None


def get_referenced_files(mdx_path: Path, asset_folder: str):
    """Get set of filenames referenced by MDX (imports + cover)."""
    referenced = set()

    imports = parse_mdx_imports(mdx_path)
    for _, _, folder, filename in imports:
        if folder == asset_folder:
            referenced.add(filename)

    cover = get_cover_path(mdx_path)
    if cover:
        match = re.search(r"projects/[^/]+/(.+)", cover)
        if match:
            referenced.add(match.group(1))

    return referenced


def deduplicate_folder(folder_path: Path, referenced_files: set):
    """Move duplicate images to a duplicates/ subfolder.
    Returns (count_moved, set_of_moved_filenames)."""
    dupes_dir = folder_path / "duplicates"
    image_files = [
        f
        for f in folder_path.iterdir()
        if f.is_file()
        and f.suffix.lower() in (".png", ".jpg", ".jpeg")
        and f.name != ".DS_Store"
    ]

    # Hash all images
    hash_groups = {}
    for img in image_files:
        h = md5_file(img)
        hash_groups.setdefault(h, []).append(img)

    moves = []
    for h, files in hash_groups.items():
        if len(files) <= 1:
            continue

        # Pick keeper: prefer file referenced by MDX, then shortest name
        keeper = None
        for f in files:
            if f.name in referenced_files:
                keeper = f
                break
        if not keeper:
            # Pick shortest/cleanest name
            files_sorted = sorted(files, key=lambda f: (len(f.name), f.name))
            keeper = files_sorted[0]

        for f in files:
            if f != keeper:
                moves.append(f)

    moved_names = set()
    if moves:
        if not DRY_RUN:
            dupes_dir.mkdir(exist_ok=True)
        for f in moves:
            moved_names.add(f.name)
            dest = dupes_dir / f.name
            print(f"  MOVE duplicate: {f.name} -> duplicates/{f.name}")
            if not DRY_RUN:
                shutil.move(str(f), str(dest))

    return len(moves), moved_names


def rename_images(folder_path: Path, slug: str, referenced_files: set, moved_names: set):
    """Rename all kept images to {slug}-NN.ext. Returns old->new mapping."""
    rename_map = {}

    # Get all remaining image files (after dedup), excluding moved duplicates
    image_files = [
        f
        for f in folder_path.iterdir()
        if f.is_file()
        and f.suffix.lower() in (".png", ".jpg", ".jpeg")
        and f.name != ".DS_Store"
        and f.name not in moved_names
    ]

    # Separate cover from portfolio images
    cover_file = None
    portfolio_files = []
    for f in image_files:
        if f.stem.lower().startswith("cover") or f.name == "cover.jpg":
            cover_file = f
        else:
            portfolio_files.append(f)

    # Rename cover
    if cover_file:
        new_name = f"{slug}-cover{cover_file.suffix.lower()}"
        if cover_file.name != new_name:
            rename_map[cover_file.name] = new_name
            print(f"  RENAME: {cover_file.name} -> {new_name}")
            if not DRY_RUN:
                cover_file.rename(folder_path / new_name)

    # Sort portfolio files: by numeric suffix if available, else alphabetically
    def sort_key(f):
        # Extract number from filename
        match = re.search(r"(\d+)", f.stem)
        if match:
            return (0, int(match.group(1)), f.name)
        return (1, 0, f.name)

    portfolio_files.sort(key=sort_key)

    # Rename portfolio files
    # First pass: rename to temp names to avoid collisions
    temp_map = {}
    for i, f in enumerate(portfolio_files, 1):
        new_name = f"{slug}-{i:02d}{f.suffix.lower()}"
        if f.name != new_name:
            temp_name = f"__temp_rename_{i:02d}{f.suffix.lower()}"
            temp_map[f] = (temp_name, new_name)

    # Execute temp renames
    if not DRY_RUN:
        for f, (temp_name, _) in temp_map.items():
            f.rename(folder_path / temp_name)

    # Execute final renames
    for f, (temp_name, new_name) in temp_map.items():
        rename_map[f.name] = new_name
        print(f"  RENAME: {f.name} -> {new_name}")
        if not DRY_RUN:
            (folder_path / temp_name).rename(folder_path / new_name)

    # Build ordered list of new filenames (excluding cover)
    new_files_ordered = []
    for i, f in enumerate(portfolio_files, 1):
        new_name = f"{slug}-{i:02d}{f.suffix.lower()}"
        new_files_ordered.append(new_name)

    return rename_map, new_files_ordered


def update_mdx_imports(mdx_path: Path, asset_folder: str, rename_map: dict, new_files_ordered: list):
    """Update import paths and cover path in MDX file.

    rename_map: old_filename -> new_filename for files that existed
    new_files_ordered: list of new filenames in order (slug-01.png, slug-02.png, ...)
    """
    with open(mdx_path) as f:
        content = f.read()

    original = content
    correct_folder = asset_folder

    # Build reverse map: for each import, find the new filename
    # First collect all imports in order
    import_pattern = re.compile(r'^import\s+(\w+)\s+from\s+"([^"]+)"', re.MULTILINE)
    all_imports = list(import_pattern.finditer(content))

    # For each import, determine the new filename
    import_filename_map = {}  # var_name -> new_filename
    used_new_files = set()

    for match in all_imports:
        var_name = match.group(1)
        rel_path = match.group(2)
        parts = rel_path.split("/")

        if "projects" not in parts:
            continue
        idx = parts.index("projects")
        if idx + 2 >= len(parts):
            continue

        old_folder = parts[idx + 1]
        old_filename = parts[idx + 2]

        # Try direct lookup in rename map
        new_filename = rename_map.get(old_filename)

        # Try cross-project variants
        if not new_filename and old_folder != correct_folder:
            for variant in [
                f"{old_folder}-{old_filename}",
                f"{old_folder}--{old_filename}",
            ]:
                if variant in rename_map:
                    new_filename = rename_map[variant]
                    break

        # If file wasn't renamed (already had correct name or didn't exist)
        if not new_filename:
            # Check if old_filename is itself a new file (wasn't renamed)
            if old_filename in new_files_ordered:
                new_filename = old_filename

        if new_filename:
            import_filename_map[var_name] = new_filename
            used_new_files.add(new_filename)

    # For imports that still couldn't be resolved (broken imports),
    # assign them to unused new files in order
    unresolved_vars = []
    for match in all_imports:
        var_name = match.group(1)
        if var_name not in import_filename_map:
            unresolved_vars.append(var_name)

    removed_vars = set()
    if unresolved_vars:
        available = [f for f in new_files_ordered if f not in used_new_files]
        for i, var_name in enumerate(unresolved_vars):
            if i < len(available):
                import_filename_map[var_name] = available[i]
                print(f"  FIX broken import: {var_name} -> {available[i]}")
            else:
                removed_vars.add(var_name)
                print(f"  REMOVE import: {var_name} (no file available)")

    # Remove import lines for removed vars (including trailing semicolons and newlines)
    if removed_vars:
        for var_name in removed_vars:
            content = re.sub(
                r'^import\s+' + re.escape(var_name) + r'\s+from\s+"[^"]+";\n?',
                '',
                content,
                flags=re.MULTILINE,
            )

    # Rewrite remaining imports
    def replace_import(match):
        var_name = match.group(1)
        if var_name in import_filename_map:
            new_filename = import_filename_map[var_name]
            new_path = f"../../../assets/projects/{correct_folder}/{new_filename}"
            return f'import {var_name} from "{new_path}"'
        return match.group(0)

    content = import_pattern.sub(replace_import, content)

    # Remove empty lines left by removed imports
    content = re.sub(r'\n{3,}', '\n\n', content)

    # Remove JSX references to removed vars in ProjectMediaGrid items
    if removed_vars:
        for var_name in removed_vars:
            # Remove items referencing removed vars from items arrays
            # Match patterns like: { type: "image", src: imgXX, alt: "...", caption: "..." },
            content = re.sub(
                r'\s*\{\s*type:\s*"image",\s*src:\s*' + re.escape(var_name) + r'[^}]*\},?\n?',
                '',
                content,
            )
            # Remove standalone ProjectFullWidthImage components referencing removed vars
            content = re.sub(
                r'<ProjectFullWidthImage\s[^>]*src=\{' + re.escape(var_name) + r'\}[^/]*/>\n?',
                '',
                content,
            )
        # Clean up empty items arrays and components
        content = re.sub(r'items=\{\[\s*\]\}', 'items={[]}', content)
        # Remove ProjectMediaGrid with empty items
        content = re.sub(
            r'<ProjectMediaGrid\s[^>]*items=\{\[\]\}\s*/>\n?',
            '',
            content,
        )

    # Update cover path
    def replace_cover(match):
        prefix = match.group(1)
        old_path = match.group(2)
        parts = old_path.split("/")
        if "projects" not in parts:
            return match.group(0)
        idx = parts.index("projects")
        if idx + 2 >= len(parts):
            return match.group(0)
        old_folder = parts[idx + 1]
        old_filename = parts[idx + 2]
        new_filename = rename_map.get(old_filename, old_filename)
        new_path = f"../../../assets/projects/{correct_folder}/{new_filename}"
        return f"{prefix}{new_path}"

    content = re.sub(
        r"(image:\s*)(\.\./\.\./\.\./assets/projects/[^\s]+)",
        replace_cover,
        content,
    )

    if content != original:
        print(f"  UPDATE MDX: {mdx_path}")
        if not DRY_RUN:
            with open(mdx_path, "w") as f:
                f.write(content)
        return True
    return False


def delete_stale_md_files():
    """Delete .md files that have .mdx counterparts."""
    count = 0
    for category in ["clients", "research", "teaching"]:
        cat_dir = CONTENT_ROOT / category
        if not cat_dir.exists():
            continue
        for md_file in sorted(cat_dir.glob("*.md")):
            mdx_file = md_file.with_suffix(".mdx")
            if mdx_file.exists():
                print(f"  DELETE stale: {md_file.relative_to('.')}")
                if not DRY_RUN:
                    md_file.unlink()
                count += 1
    return count


def cleanup_empty_folders():
    """Remove manifest.json and empty unassigned folder."""
    # Clean up manifests
    for folder in ASSETS_ROOT.iterdir():
        if not folder.is_dir() or folder.name in SKIP_ASSET_FOLDERS:
            continue
        manifest = folder / "manifest.json"
        if manifest.exists():
            print(f"  DELETE: {manifest.relative_to('.')}")
            if not DRY_RUN:
                manifest.unlink()

    # Remove unassigned if empty or near-empty
    unassigned = ASSETS_ROOT / "unassigned"
    if unassigned.exists():
        files = list(unassigned.iterdir())
        if len(files) <= 1:  # empty or just .DS_Store
            print(f"  DELETE folder: {unassigned.relative_to('.')}")
            if not DRY_RUN:
                shutil.rmtree(str(unassigned))


def main():
    if DRY_RUN:
        print("=== DRY RUN MODE ===\n")

    mdx_files = find_mdx_files()
    total_dupes = 0
    total_renames = 0
    total_mdx_updates = 0

    for mdx_path in mdx_files:
        slug = mdx_path.stem
        asset_folder = get_asset_folder(mdx_path)

        if not asset_folder:
            # No asset folder — remove all imports and their JSX references
            imports = parse_mdx_imports(mdx_path)
            if imports:
                print(f"\n[{slug}] no asset folder — removing {len(imports)} broken imports")
                with open(mdx_path) as f:
                    content = f.read()
                original = content
                all_vars = set(var for var, _, _, _ in imports)
                # Remove import lines
                content = re.sub(
                    r'^import\s+\w+\s+from\s+"[^"]+";\n?',
                    '',
                    content,
                    flags=re.MULTILINE,
                )
                # Remove JSX references
                for var_name in all_vars:
                    content = re.sub(
                        r'\s*\{\s*type:\s*"image",\s*src:\s*' + re.escape(var_name) + r'[^}]*\},?\n?',
                        '',
                        content,
                    )
                    content = re.sub(
                        r'<ProjectFullWidthImage\s[^>]*src=\{' + re.escape(var_name) + r'\}[^/]*/>\n?',
                        '',
                        content,
                    )
                content = re.sub(r'<ProjectMediaGrid\s[^>]*items=\{\[\s*\]\}\s*/>\n?', '', content)
                content = re.sub(r'\n{3,}', '\n\n', content)
                if content != original:
                    print(f"  UPDATE MDX: {mdx_path}")
                    if not DRY_RUN:
                        with open(mdx_path, "w") as f:
                            f.write(content)
                    total_mdx_updates += 1
            else:
                print(f"\n[SKIP] {slug}: no asset folder found")
            continue

        folder_path = ASSETS_ROOT / asset_folder
        if not folder_path.exists():
            print(f"\n[SKIP] {slug}: folder {asset_folder}/ doesn't exist")
            continue

        print(f"\n[{slug}] -> {asset_folder}/")

        # Get referenced files
        referenced = get_referenced_files(mdx_path, asset_folder)

        # Step 1: Deduplicate
        dupes_moved, moved_names = deduplicate_folder(folder_path, referenced)
        total_dupes += dupes_moved

        # Step 2: Rename
        rename_map, new_files_ordered = rename_images(folder_path, asset_folder, referenced, moved_names)
        total_renames += len(rename_map)

        # Step 3: Update MDX
        if update_mdx_imports(mdx_path, asset_folder, rename_map, new_files_ordered):
            total_mdx_updates += 1

    # Step 4: Delete stale .md files
    print("\n--- Stale .md files ---")
    stale_count = delete_stale_md_files()

    # Step 5: Cleanup
    print("\n--- Cleanup ---")
    cleanup_empty_folders()

    print(f"\n=== Summary ===")
    print(f"Duplicates moved: {total_dupes}")
    print(f"Files renamed: {total_renames}")
    print(f"MDX files updated: {total_mdx_updates}")
    print(f"Stale .md files deleted: {stale_count}")

    if DRY_RUN:
        print("\n(Dry run — no changes made)")


if __name__ == "__main__":
    main()
