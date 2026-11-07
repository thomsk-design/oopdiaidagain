# Oops I AI’d Again

Website for Thom Hamilton, live at https://www.oopsiaidagain.com/.

## Source snapshot

Imported from the production Vercel deployment `dpl_CWd7RMiXsQ78XTzf2EooDdaNpXsG` on 7 November 2026. All 21 application files were checked byte-for-byte against the deployment’s source manifest before the initial commit. The README and Git ignore rules were added for repository use.

## Structure

- `index.html`: homepage, tools, story, pricing and booking.
- `whitetail.html`, `conference.html`, `work.html`: detailed examples.
- `style.css`, `app.js`: design and page interactions.
- `assessment.js`: website assessment interface.
- `api/read-site.mjs`: Node.js serverless function for reading selected public website pages.
- `bot.js`, `bot-knowledge.json`: chatbot and its public knowledge.
- `assets/`: published images, video and conference PDF.

## Preview and hosting

This is a static HTML/CSS/JavaScript site with one Vercel Node.js API function. No frontend compilation or package installation is needed. For the complete local flow, run `vercel dev` from this directory with an authenticated Vercel CLI. A basic static server can preview the layout, but will not execute `/api/read-site`.

For a Git-backed Vercel deployment, use the repository root and the Other framework preset, with no build command. The existing production Vercel project is `oops-i-aid-again`. This source import does not change hosting or automatically connect the repository to Vercel.

The AI interfaces call an existing hosted AI proxy. That service and its provider credentials are managed separately and are not included here. The booking links open Thom’s existing Google appointment page. Never commit provider keys or local environment files.

## Editing

Edit the HTML, CSS and JavaScript directly. Keep `bot-knowledge.json` aligned with public site facts. Public files, images and PDFs are visitor-visible; do not add private client records or correspondence. Private working documents and assessment-test pages are intentionally excluded.
