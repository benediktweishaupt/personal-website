#!/usr/bin/env python3
"""
Generate MDX content for project pages using extracted portfolio images.

For each project with a manifest.json, this script:
1. Finds the corresponding .md file in src/content/projects/
2. Converts it to .mdx
3. Adds image imports and ProjectMediaGrid components
4. Sets projectAudience to 'all'

Usage:
    python3 scripts/generate-mdx-from-manifests.py
    python3 scripts/generate-mdx-from-manifests.py --dry-run
"""

import glob
import json
import os
import re
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(PROJECT_ROOT, "src", "assets", "projects")
CONTENT_DIR = os.path.join(PROJECT_ROOT, "src", "content", "projects")

# Map asset directory slugs to content file slugs
# (only where they differ)
SLUG_MAP = {
    "drei-drie-three": "clients/drei-drie-three-100-jahre-de-stijl",
    "institute-for-human-activities": "clients/institute-for-human-activities",
    "open-lobby": "clients/open-lobby",
    "studium-generale": "clients/studium-generale",
    "sandberg-open-day": "clients/sandberg-open-day",
    "closed": None,  # skip — already a rich case study (closed-ecommerce.mdx)
    "sandberg-manifesto": "clients/sandberg-manifesto",
    "kabk-graduation-festival": "clients/kabk-graduation-festival",
    "schwules-museum": "clients/schwules-museum",
    "museum-digital": None,  # skip — already a rich case study (museum-digital.mdx)
    "sandberg-graduation-show": "clients/sandberg-graduation-show",
    "voith": "clients/voith",
    "event-horizon": "teaching/event-horizon",
    "all-watched-over": "teaching/all-watched-over-by-machines-of-loving-grace",
    "orte": "teaching/orte",
    "talk-to-us-corona": "teaching/talk-to-us-corona-awareness-campaign",
    "pictures-of-an-exhibition": "teaching/pictures-of-an-exhibition",
    "jitsi-bitsi-spider": "teaching/jitsi-bitsi-spider",
    "weissensee-tv-rundgang": "teaching/weissensee-tv-rundgang",
    "mehr-als-rundgang": "teaching/mehr-als-rundgang",
    "bender-gallery": "teaching/bender-gallery",
    "radio-sowjo": "teaching/radio-sowjo",
    "die-unsichtbaren-staedte": "teaching/die-unsichtbaren-staedte",
    "modern-talking": "teaching/modern-talking",
    "don-t-do-it-yourself": "teaching/don-t-do-it-yourself",
    "3x3-100-jahre-de-stijl": "teaching/3x3-100-jahre-de-stijl",
    "false-colours-seminar": None,  # skip — same images as research/false-colours
    "digital-design-i": "teaching/digital-design-i",
    "moving-membranes-workshop": "teaching/moving-membranes-workshop",
    "open-the-black-box": "teaching/open-the-black-box",
    "ma-chi-ne": "teaching/ma-chi-ne",
    "wir-muessen-reden": "teaching/wir-muessen-reden",
    "synthetische-wahrnehmungsform": "teaching/synthetische-wahrnehmungsform-im-gestaltungsprozess",
    "wasserstories": "teaching/wasserstories",
    "ein-gespenst-geht-um": "teaching/ein-gespenst-geht-um",
    "no-exit": "research/no-exit",
    "digital-campfire-i": "teaching/digital-campfire-i",
    "digital-campfire-esac": None,  # variant of digital-campfire-i, images go there
    "sanity-outsourced": "research/sanity-is-something-better-outsourced",
    "the-power-of-mesh": "research/the-power-of-mesh",
    "more-free-wifi": "research/more-free-wifi",
    "false-colours": "research/false-colours",
    "false-colours-an-image-reading": "research/false-colours-an-image-reading",
    "item-to-item": "research/item-to-item",
}


def find_md_file(content_slug):
    """Find the .md file for a given content slug."""
    md_path = os.path.join(CONTENT_DIR, content_slug + ".md")
    mdx_path = os.path.join(CONTENT_DIR, content_slug + ".mdx")
    if os.path.exists(mdx_path):
        return mdx_path
    if os.path.exists(md_path):
        return md_path
    return None


def compute_relative_path(content_slug, asset_slug):
    """Compute the relative path from content file to asset directory."""
    # Content files are at src/content/projects/<category>/<file>.mdx
    # Assets are at src/assets/projects/<slug>/
    # Relative: ../../../assets/projects/<slug>/
    return f"../../../assets/projects/{asset_slug}"


def extract_frontmatter(content):
    """Extract frontmatter and body from a .md/.mdx file."""
    match = re.match(r'^---\n(.*?)\n---\n?(.*)', content, re.DOTALL)
    if match:
        return match.group(1), match.group(2)
    return "", content


def update_frontmatter(frontmatter, updates):
    """Update specific fields in YAML frontmatter string."""
    lines = frontmatter.split("\n")
    result = []
    for line in lines:
        replaced = False
        for key, value in updates.items():
            if line.strip().startswith(f"{key}:"):
                result.append(f"{key}: {value}")
                replaced = True
                break
        if not replaced:
            result.append(line)
    return "\n".join(result)


def filter_page_captions(captions, project_name, all_project_names):
    """Filter caption lines for a single PDF page to only keep image captions.

    Removes: description paragraphs, project titles, section headers, metadata.
    Keeps: short lines that describe specific images, joining multi-line captions.
    """
    skip_patterns = [
        r"^Research:",
        r"^Education:",
        r"^Portfolio:",
        r"^Art Direction:",
        r"^Format:",
        r"^DESIGN$",
        r"^RESEARCH$",
        r"^EDUCATION",
    ]

    # First pass: remove metadata/headers/titles
    filtered_lines = []
    for line in captions:
        if any(re.match(p, line) for p in skip_patterns):
            continue
        if line.strip() in all_project_names:
            continue
        filtered_lines.append(line)

    # Second pass: remove description blocks (3+ consecutive lines > 50 chars)
    # Also consume trailing short line that ends the paragraph
    result_lines = []
    i = 0
    while i < len(filtered_lines):
        line = filtered_lines[i]

        if len(line) > 50:
            block = [line]
            j = i + 1
            while j < len(filtered_lines) and len(filtered_lines[j]) > 50:
                block.append(filtered_lines[j])
                j += 1
            if len(block) >= 3:
                # Consume trailing short line that ends the paragraph
                if j < len(filtered_lines):
                    tail = filtered_lines[j]
                    if len(tail) < 50 and tail.rstrip().endswith(('.', '"', ')', '\u201d')):
                        j += 1
                i = j
                continue

        result_lines.append(line)
        i += 1

    # Third pass: join multi-line captions (next line starts with lowercase)
    joined = []
    i = 0
    while i < len(result_lines):
        caption = result_lines[i]
        i += 1
        while i < len(result_lines):
            next_line = result_lines[i]
            if next_line[0:1].islower():
                caption = caption.rstrip() + " " + next_line.lstrip()
                i += 1
            else:
                break
        joined.append(caption)

    return joined


def get_captions_for_page(manifest, pdf_page, project_name, all_project_names):
    """Get filtered image captions for a specific PDF page."""
    captions_by_pdf = manifest.get("captions_by_pdf_page", {})
    page_captions = captions_by_pdf.get(str(pdf_page), [])
    if not page_captions:
        return []
    return filter_page_captions(page_captions, project_name, all_project_names)


def escape_mdx_string(s):
    """Escape a string for use in MDX JSX attributes."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")


def generate_mdx_body(manifest, asset_slug, content_slug, all_project_names):
    """Generate MDX body content with image imports and grids."""
    images = manifest["images"]
    if not images:
        return ""

    project_name = manifest.get("project", "")
    rel_path = compute_relative_path(content_slug, asset_slug)

    # Generate imports
    imports = []
    for i, img in enumerate(images):
        var_name = f"img{i + 1:02d}"
        imports.append(f'import {var_name} from "{rel_path}/{img["filename"]}";')

    # Group images by PDF page for the spread layout
    pages = {}
    for i, img in enumerate(images):
        pdf_page = img["pdf_page"]
        if pdf_page not in pages:
            pages[pdf_page] = []
        pages[pdf_page].append((i, img))

    # Generate grid components
    grids = []
    for pdf_page in sorted(pages.keys()):
        page_images = pages[pdf_page]
        page_captions = get_captions_for_page(manifest, pdf_page, project_name, all_project_names)

        if len(page_images) == 1:
            # Single image on this spread — full width
            idx, img = page_images[0]
            var_name = f"img{idx + 1:02d}"
            is_hero = img["width"] > 1500
            # Use first caption if available
            caption = page_captions[0] if page_captions else ""
            caption_attr = f' caption="{escape_mdx_string(caption)}"' if caption else ""
            alt_text = escape_mdx_string(caption) if caption else ""
            if is_hero:
                grids.append(
                    f'<ProjectFullWidthImage src={{{var_name}}} alt="{alt_text}"{caption_attr} />'
                )
            else:
                caption_part = f', caption: "{escape_mdx_string(caption)}"' if caption else ""
                grids.append(
                    f'<ProjectMediaGrid columns={{1}} items={{[\n'
                    f'  {{ type: "image", src: {var_name}, alt: "{alt_text}"{caption_part} }},\n'
                    f']}} />'
                )
        else:
            # Multiple images — match captions positionally
            items = []
            for img_idx_in_page, (idx, img) in enumerate(page_images):
                var_name = f"img{idx + 1:02d}"
                caption = page_captions[img_idx_in_page] if img_idx_in_page < len(page_captions) else ""
                alt_text = escape_mdx_string(caption) if caption else ""
                caption_part = f', caption: "{escape_mdx_string(caption)}"' if caption else ""
                items.append(f'  {{ type: "image", src: {var_name}, alt: "{alt_text}"{caption_part} }}')
            cols = 2 if len(page_images) in (2, 4) else 1
            if len(page_images) > 3:
                cols = 2
            items_str = ",\n".join(items)
            grids.append(
                f'<ProjectMediaGrid columns={{{cols}}} items={{[\n'
                f'{items_str},\n'
                f']}} />'
            )

    # Combine
    body_parts = []
    body_parts.append("\n".join(imports))
    body_parts.append("")  # blank line after imports
    for grid in grids:
        body_parts.append(grid)
        body_parts.append("")  # blank line between grids

    return "\n".join(body_parts)


def process_project(asset_slug, all_project_names, dry_run=False):
    """Process a single project: read manifest, generate MDX, write file."""
    manifest_path = os.path.join(ASSETS_DIR, asset_slug, "manifest.json")
    if not os.path.exists(manifest_path):
        return None

    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    # Look up content file slug
    if asset_slug not in SLUG_MAP:
        print(f"  SKIP {asset_slug}: no slug mapping")
        return None

    content_slug = SLUG_MAP[asset_slug]
    if content_slug is None:
        print(f"  SKIP {asset_slug}: mapped to None (variant/duplicate)")
        return None

    # Find the source .md file
    source_path = find_md_file(content_slug)
    if source_path is None:
        print(f"  SKIP {asset_slug}: no .md/.mdx file found for {content_slug}")
        return None

    # Read existing content
    with open(source_path, "r", encoding="utf-8") as f:
        content = f.read()

    frontmatter, old_body = extract_frontmatter(content)

    # Update frontmatter
    new_frontmatter = update_frontmatter(frontmatter, {
        "projectAudience": "all",
    })

    # Generate new body
    new_body = generate_mdx_body(manifest, asset_slug, content_slug, all_project_names)

    # Combine
    new_content = f"---\n{new_frontmatter}\n---\n\n{new_body}\n"

    # Determine output path (.mdx)
    if source_path.endswith(".md"):
        output_path = source_path[:-3] + ".mdx"
    else:
        output_path = source_path

    if dry_run:
        print(f"  {asset_slug} → {os.path.relpath(output_path, PROJECT_ROOT)} ({len(manifest['images'])} images)")
        return output_path

    # Write new file
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    # Remove old .md if we created a new .mdx
    if source_path != output_path and os.path.exists(source_path):
        os.remove(source_path)

    print(f"  {asset_slug} → {os.path.relpath(output_path, PROJECT_ROOT)} ({len(manifest['images'])} images)")
    return output_path


def main():
    dry_run = "--dry-run" in sys.argv

    if dry_run:
        print("DRY RUN — no files will be modified\n")

    # Find all manifest.json files
    manifests = glob.glob(os.path.join(ASSETS_DIR, "*/manifest.json"))
    manifests.sort()

    print(f"Found {len(manifests)} project manifests\n")

    # Collect all project names for caption filtering (to skip neighboring project titles)
    all_project_names = set()
    for mp in manifests:
        with open(mp, "r", encoding="utf-8") as f:
            m = json.load(f)
            all_project_names.add(m.get("project", ""))

    processed = 0
    for manifest_path in manifests:
        asset_slug = os.path.basename(os.path.dirname(manifest_path))
        result = process_project(asset_slug, all_project_names, dry_run)
        if result:
            processed += 1

    print(f"\n{'Would process' if dry_run else 'Processed'} {processed} projects")


if __name__ == "__main__":
    main()
