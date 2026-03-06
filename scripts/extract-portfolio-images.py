#!/usr/bin/env python3
"""
Extract images from the HFBK 2023 Portfolio PDF and organize them by project.

Each project in the PDF spans a known page range. Images are extracted per page,
filtered by minimum size (to skip decorative elements), and saved to the
corresponding project's asset directory with a JSON manifest of captions.

Usage:
    python3 scripts/extract-portfolio-images.py
"""

import json
import os
import sys

import fitz  # PyMuPDF

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
PDF_PATH = os.path.join(PROJECT_ROOT, "docs", "reference-data", "HFBK-Hamburg_2023-Portfolio.pdf")
CAPTIONS_PATH = os.path.join(PROJECT_ROOT, "docs", "reference-data", "HFBK-Portfolio_extracted-text.txt")
ASSETS_DIR = os.path.join(PROJECT_ROOT, "src", "assets", "projects")

# Minimum image dimensions to keep (skip tiny decorative images)
MIN_WIDTH = 200
MIN_HEIGHT = 200

# Page-to-project mapping (1-indexed PDF page numbers)
# Format: (start_page, end_page, slug, project_name)
PROJECTS = [
    (3, 7, "drei-drie-three", "Drei, Drie, Three"),
    (8, 9, "institute-for-human-activities", "Institute for Human Activities"),
    (10, 13, "open-lobby", "Open Lobby"),
    (14, 15, "studium-generale", "Studium Generale"),
    (16, 19, "sandberg-open-day", "Sandberg Institute"),
    (20, 23, "closed", "Closed Design System"),
    (24, 27, "sandberg-manifesto", "Sandberg Manifesto"),
    (28, 33, "kabk-graduation-festival", "Graduation Festival"),
    (34, 35, "schwules-museum", "schwulesmuseum.de"),
    (36, 39, "museum-digital", "Museum Utopie und Alltag Digital"),
    (40, 43, "sandberg-graduation-show", "Sandberg Graduation Show"),
    (44, 45, "voith", "Voith"),
    # Education: Seminars
    (48, 51, "event-horizon", "Event/Horizon"),
    (52, 55, "all-watched-over", "All watched over by machines of loving grace"),
    (56, 59, "orte", "Orte"),
    (60, 61, "talk-to-us-corona", "Corona Awareness Campaign"),
    (62, 65, "pictures-of-an-exhibition", "Pictures of an Exhibition"),
    (66, 68, "jitsi-bitsi-spider", "Jitsi Bitsi Spider"),
    (69, 71, "weissensee-tv-rundgang", "weissensee.tv"),
    (72, 73, "mehr-als-rundgang", "Open Day Campaign"),
    (74, 75, "bender-gallery", "Bender"),
    (76, 77, "radio-sowjo", "Radiosowjo"),
    (78, 79, "die-unsichtbaren-staedte", "The Invisible Cities"),
    (80, 81, "modern-talking", "Modern Talking"),
    (82, 83, "don-t-do-it-yourself", "Don't do it yourself"),
    (84, 85, "3x3-100-jahre-de-stijl", "3 x 3"),
    (86, 87, "false-colours-seminar", "False Colours (seminar)"),
    (88, 91, "digital-design-i", "Digital Design"),
    (92, 95, "moving-membranes-workshop", "Green Screen"),
    # Education: Graduation Works
    (98, 99, "open-the-black-box", "Open the Black Box"),
    (100, 101, "ma-chi-ne", "MA(CHI)NE"),
    (102, 103, "wir-muessen-reden", "Wir müssen reden"),
    (104, 105, "synthetische-wahrnehmungsform", "Synästhetische Wahrnehmungsform"),
    (106, 107, "wasserstories", "Water Stories"),
    (108, 109, "ein-gespenst-geht-um", "Ein gespenst geht um"),
    # Research
    (112, 115, "no-exit", "No Exit"),
    (116, 117, "digital-campfire-i", "Digital Campfire van Eyck"),
    (118, 119, "digital-campfire-esac", "Digital vs. Archaic ESAC Cambrai"),
    (120, 132, "sanity-outsourced", "Sanity is Something Better Outsourced"),
    (133, 136, "the-power-of-mesh", "Power of Mesh"),
    (137, 139, "more-free-wifi", "More Free Wifi"),
    (140, 148, "false-colours", "False Colours"),
    (148, 149, "false-colours-an-image-reading", "False Colours: An Image Reading"),
    (150, 153, "item-to-item", "Item to Item"),
]


def parse_captions(captions_path):
    """Parse the extracted text file to build a page-number to captions mapping."""
    captions_by_page = {}
    current_page = None
    caption_lines = []

    with open(captions_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    for line in lines:
        stripped = line.strip()
        # Page numbers appear as standalone numbers
        if stripped.isdigit():
            page_num = int(stripped)
            if 1 <= page_num <= 200:
                current_page = page_num
                continue

        # Skip metadata lines and section headers
        if stripped.startswith("Format:") or stripped.startswith("Art Direction:"):
            continue
        if stripped.startswith("Portfolio:") or stripped.startswith("DESIGN") or stripped.startswith("EDUCATION") or stripped.startswith("RESEARCH"):
            continue
        if not stripped:
            continue

        # Potential caption text — associate with current page
        if current_page is not None:
            if current_page not in captions_by_page:
                captions_by_page[current_page] = []
            captions_by_page[current_page].append(stripped)

    return captions_by_page


def portfolio_page_to_pdf_page(portfolio_page):
    """Convert portfolio page number (from extracted text) to 0-indexed PDF page.

    The PDF uses landscape spreads: each PDF page contains two portfolio pages.
    Portfolio pages 1-2 = PDF page 0, pages 3-4 = PDF page 1, etc.
    """
    return (portfolio_page - 1) // 2


def extract_images_for_project(doc, start_page, end_page, slug, project_name, captions_by_page):
    """Extract images from a page range and save to project directory."""
    output_dir = os.path.join(ASSETS_DIR, slug)
    os.makedirs(output_dir, exist_ok=True)

    images = []
    img_counter = 1

    # Convert portfolio page numbers to PDF page indices
    pdf_start = portfolio_page_to_pdf_page(start_page)
    pdf_end = portfolio_page_to_pdf_page(end_page)

    seen_xrefs = set()  # avoid duplicate images across pages
    for pdf_page_idx in range(pdf_start, pdf_end + 1):
        if pdf_page_idx >= doc.page_count:
            break
        page = doc[pdf_page_idx]
        image_list = page.get_images(full=True)

        for img_index, img_info in enumerate(image_list):
            xref = img_info[0]

            if xref in seen_xrefs:
                continue
            seen_xrefs.add(xref)

            try:
                base_image = doc.extract_image(xref)
            except Exception:
                continue

            if not base_image:
                continue

            image_bytes = base_image["image"]
            ext = base_image["ext"]
            width = base_image.get("width", 0)
            height = base_image.get("height", 0)

            # Skip tiny images (decorative elements, icons)
            if width < MIN_WIDTH or height < MIN_HEIGHT:
                continue

            # Save image
            filename = f"portfolio-{img_counter:02d}.{ext}"
            filepath = os.path.join(output_dir, filename)

            with open(filepath, "wb") as f:
                f.write(image_bytes)

            images.append({
                "filename": filename,
                "width": width,
                "height": height,
                "pdf_page": pdf_page_idx + 1,
                "portfolio_pages": f"{pdf_page_idx * 2 + 1}-{pdf_page_idx * 2 + 2}",
            })
            img_counter += 1

    # Collect captions for this project's page range
    project_captions = []
    for page_num in range(start_page, end_page + 1):
        if page_num in captions_by_page:
            project_captions.extend(captions_by_page[page_num])

    # Write manifest
    manifest = {
        "project": project_name,
        "slug": slug,
        "pages": f"{start_page}-{end_page}",
        "images": images,
        "captions": project_captions,
    }

    manifest_path = os.path.join(output_dir, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    return len(images)


def main():
    if not os.path.exists(PDF_PATH):
        print(f"ERROR: PDF not found at {PDF_PATH}")
        sys.exit(1)

    print(f"Opening PDF: {PDF_PATH}")
    doc = fitz.open(PDF_PATH)
    print(f"PDF has {doc.page_count} pages")

    captions_by_page = parse_captions(CAPTIONS_PATH)
    print(f"Parsed captions for {len(captions_by_page)} pages")

    total_images = 0
    for start, end, slug, name in PROJECTS:
        count = extract_images_for_project(doc, start, end, slug, name, captions_by_page)
        total_images += count
        print(f"  {name}: {count} images (pages {start}-{end}) → {slug}/")

    doc.close()
    print(f"\nDone! Extracted {total_images} images across {len(PROJECTS)} projects")


if __name__ == "__main__":
    main()
