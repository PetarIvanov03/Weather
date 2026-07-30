# CLAUDE.md

## Deploys

GitHub Pages CDN caches `app.js`/`styles.css` ~10min; `index.html` always
revalidates. Bump `?v=` on both tags in `index.html` whenever `app.js` or
`styles.css` changes — otherwise Pages can serve new HTML paired with stale JS/CSS.

## Git rules
- NEVER run `git push` automatically. Ever.
- NEVER run `git commit` automatically unless explicitly asked in that message.
- Staging changes and showing diffs is fine — describe what you'd commit, but the user runs all `git commit`/`git push` commands themselves.
- Do not include git commands inside multi-step task execution.
