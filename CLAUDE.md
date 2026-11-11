# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page React 19 + Vite + TypeScript showcase/landing page for the `social-share-toolkit` npm package (`SocialShareBox` / `SocialShareButton` from `social-share-toolkit/react`). Almost everything lives in `src/App.tsx` and `src/App.css`.

## Commands

- `npm run build` — runs `tsc -b` then `vite build`; use it to type-check. There is no test suite.
- `npm run lint` — ESLint flat config (`eslint.config.js`).
- `npm run deploy` — builds and pushes `dist/` to the `gh-pages` branch via `gh-pages`. This publishes the live site; only run when asked.

## Gotchas

- The site is served from GitHub Pages under `/social-share-toolkit-demo/`, set as `base` in `vite.config.ts`. Reference public assets through Vite (e.g. `import.meta.env.BASE_URL`) rather than hard-coded root paths, or they 404 in production.
- `social-share-toolkit` is developed in a separate repo and consumed only as a published npm version. Never patch it in `node_modules` or vendor it here; if a library change is needed, say so instead.
- `tsconfig.app.json` has `noImplicitAny: false` but `noUnusedLocals`/`noUnusedParameters` on — unused code breaks the build.

## Conventions

- Source files use tab indentation and double quotes (the ESLint config file is the exception).
- Commit messages follow Conventional Commits (`feat:`, `chore:`, …).
