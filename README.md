# Satya Journeys — free-hosting starter

This starter uses:
- Eleventy (11ty) to generate static pages
- Decap CMS for the browser-based publishing dashboard
- GitHub to store code and content
- Cloudflare Pages to host the site

## Important: setup order
1. Create a GitHub repository and upload this folder's contents.
2. Connect the repository to Cloudflare Pages.
3. Set the build command to `npm run build` and output directory to `_site`.
4. Visit the `*.pages.dev` URL and confirm the site works.
5. Configure Decap CMS authentication before relying on `/admin/`. The CMS config currently uses a placeholder OAuth endpoint. Do not expose GitHub tokens in browser code.
6. After the Pages preview works, connect `satyajourneys.com` by following Cloudflare's current custom-domain instructions. Preserve existing GoDaddy DNS/email records before changing nameservers.

## Build settings
- Framework preset: None / Eleventy if available
- Build command: `npm run build`
- Build output directory: `_site`
- Production branch: `main`

## Local preview (optional)
Install Node.js LTS, then run:
```sh
npm install
npm run build
npm run serve
```
Open the local URL printed by Eleventy.

## Add/edit content
After authentication is configured, open `/admin/` on the deployed site. The dashboard collections are:
- Destinations
- Travel stories
- Itineraries
- Service providers

Content is stored in `content/` and media in `uploads/`. CMS content edits commit to GitHub; Cloudflare Pages rebuilds on commits.

## Free-tier notes
This starter avoids paid hosting by design, but free-plan limits and provider policies can change. Large original video files should not be uploaded to the repository; use a suitable video host and embed the video URL. Keep separate backups of original photos/videos.

## Domain safety
Do not change nameservers until you have checked whether the domain is used for email or other services. Follow the live Cloudflare dashboard instructions and preserve required DNS records.
