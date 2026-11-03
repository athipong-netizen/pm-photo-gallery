# Connect Google Drive to PM Photo Gallery

## Inspected hierarchy
- Root folder: `173bPSwiddc338Yj9-tSslwwy6RlXoPX7` (รวมภาพถ่าย)
- Year folders include `ภาพถ่ายปี 2568`, `ภาพถ่ายปี 2569`.
- Month folders are named `2569-11`, `2569-10`, etc.
- Event folders are named with event dates and titles.
- Inside each event may be nested photographer folders. Their names must NOT appear on the website.

## One-time Google Apps Script deployment (by the owner of the photo account)
1. Sign in to **photos@pm.ac.th**, or another Google account with access to the complete photo hierarchy.
2. Go to https://script.google.com/home/projects/create .
3. Replace the default `Code.gs` content with the contents of [Code.gs](apps-script/Code.gs).
4. Save. Click **Deploy → New deployment**; select **Web app**.
5. Set **Execute as: Me** and **Who has access: Anyone**, then **Deploy** and authorize Drive read access. (A Google Workspace admin may restrict public deployments.)
6. Copy the published web app URL ending in `/exec`.
7. In this GitHub repository edit `config.js` and paste the URL into `window.PM_GALLERY_API_URL`, then commit the change.
8. Open the GitHub Pages gallery and test selecting year, month, event, images, and original downloads. Once the site loads data, **demo content is no longer used**.

The frontend uses a fixed-callback JSONP script request because Google Apps Script ContentService redirects and direct browser fetch may fail due to CORS.

### Security / privacy
- Anyone can access the API when deployed as above. This is necessary for a no-login website. **Only deploy for photos explicitly approved for public sharing.**
- The root folder currently has **Anyone with the link: Viewer**, but verify that **individual images** can also be opened anonymously. Viewer links / thumbnails may fail if inherited permissions differ.
- Publishing the backend makes its image IDs publicly discoverable; do not expose personal, sensitive, student-private or confidential material.
- Do **not** commit credentials, private API keys or access tokens. The endpoint URL itself is not a secret.
- API validates the requested year/month and that event folders lie under the configured root. It never edits Drive.
- Opening the full-resolution file uses Google Drive's own viewer/download endpoint; Google may prompt the user for large files or when permissions disallow download.

### Functional notes
- Dynamically loads only current and previous Buddhist calendar years.
- Reads month and event folders on demand; gathers all image files recursively, ignoring photographer folder labels.
- The backend returns up to 2,500 image references per event and a nesting depth up to 8. Very large events may hit Google Apps Script execution limits and require pagination/caching in a later release.
- Google Drive does not guarantee reliable public image hotlinking via the thumbnail endpoint. Test with real images and adjust serving method if previews are blocked.
- No guarantee of anonymous access to each image without explicit permission checks.

## Deployment test
Use your web app URL with the following query string to verify it returns a JavaScript callback:
`?callback=pmGalleryCallback&level=years`
Expected prefix: `pmGalleryCallback({"ok":true,...})`.

GitHub Pages: https://athipong-netizen.github.io/pm-photo-gallery/
