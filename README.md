# PM Photo Gallery

Prototype **Version 0.1 — Phase 1**: static responsive gallery with **demonstration data only**.

## Features
- No login required for the demonstration UI.
- Home opens immediately at year selection (current Buddhist year and one previous year).
- Hierarchy: **Year → Month → Activity → Photos**.
- Activity galleries, full-screen image viewer, previous/next controls, keyboard navigation, and a demonstration image download/open link.
- Mobile and desktop responsive layout.
- No photographer names are displayed.

## Run locally
Open `index.html` in a web browser. No build process or dependencies required. An internet connection is needed for Google Fonts and Unsplash demo pictures.

## Deployment
Repository is public. To publish, open **Settings → Pages → Build and deployment → Deploy from a branch**, choose **main / (root)**, and save. URL will normally be:
https://athipong-netizen.github.io/pm-photo-gallery/

GitHub Pages deployment is **not** enabled automatically by these files.

## Phase 1 boundaries
All event names, dates, and image references are **fictional demonstration content**. Images load from Unsplash and are not owned school images. Some browsers may open a cross-origin image in a new tab instead of downloading it directly. The real original-file download requires the phase-2 Google Drive integration.

## Phase 2 plan
- Connect the existing Google Drive folder hierarchy through a safe server-side API (e.g. Apps Script), without moving/deleting original images.
- Aggregate images from nested subfolders without displaying photographer folder names.
- Return metadata for the current Buddhist year and previous year.
- Provide a verified public access strategy and original-image downloads without exposing private tokens.
- Handle loading/error states, pagination, folder permissions, and media loading failure.

**Security:** Never commit credentials, OAuth tokens, private Drive file IDs, or personal data into this public repository.
