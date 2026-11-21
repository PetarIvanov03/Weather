---
name: release
description: Pre-release checklist for shipping the weather app to GitHub Pages — review the pending diff, cache-bust ?v=, sync README, smoke test, then propose a commit message and ask. Commits only on the user's explicit OK; never pushes on its own.
disable-model-invocation: true
argument-hint: [release name / summary]
---

# Release checklist

Ships = `main` is pushed; GitHub Pages deploys it. You prepare and ask; commit and
push happen only on the user's explicit word (CLAUDE.md "Ask first").

## 1. What's going out

```sh
git status --short
git diff --stat HEAD
git log --oneline origin/main..HEAD
```

Summarise the change set in user terms. Flag anything that looks unrelated to
the release (stray files, debug `console.log`, test pages like the old
`test.html`, commented-out code) and ask before including it.

## 2. Cache-bust

```sh
grep -o '\(styles\.css\|app\.js\)?v=[0-9]*' index.html
git show HEAD:index.html | grep -o '\(styles\.css\|app\.js\)?v=[0-9]*'
git diff --name-only HEAD -- app.js styles.css
```

If `app.js` or `styles.css` changed vs HEAD (or vs `origin/main` for unpushed
commits), both `?v=` values must equal each other and be higher than the
deployed ones. Fix it if not.

## 3. Review

Run `/code-review` (default level) on the pending diff, or review it inline
against CLAUDE.md "Code conventions": `TXT` strings, `escapeHtml` on API
strings, null-safe reads, race guards, reduced-motion, `hover: hover`, 768px breakpoint.
Report findings; fix only with the user's OK.

## 4. Docs

README matches the shipped behaviour: Features, Detail popups, Data sources,
threshold names, Known limitations. Meta/OG text in `index.html` and
`manifest.json` still accurate if the feature set changed.

## 5. Smoke test

Run `/smoke-test` with the release's main feature as the focus area.

## 6. Breaking changes?

Check the diff against CLAUDE.md "Ask first" #3 (saved-location schema, URLs,
manifest, removed/renamed features, units/defaults, new hosts). If any applies,
list it with its migration and get an explicit OK before going on.

## 7. Hand-off

Give the user:
- the pass/fail summary,
- the files to stage,
- a ready commit message (subject ≤ 60 chars, imperative, body = what & why),

then ask: commit? Run `git commit` only if their reply says so. Push is a separate
yes (it deploys); `git push` is denied in `.claude/settings.json`, so if they want
it, they run it themselves unless they remove the deny.
After the push: suggest checking https://ivanovp.site in ~1–2 min with a hard reload.
