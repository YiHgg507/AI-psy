# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

| Task | Command |
|---|---|
| Dev server | `pnpm dev` |
| Production build | `pnpm build` |
| Preview production build | `pnpm preview` |
| Lint (eslint + oxlint) | `pnpm lint` |
| Format | `pnpm format` |

## Architecture Overview

This is the **admin management backend** for a psychological AI assistant, built with Vue 3 Composition API (`<script setup>`), Element Plus, Vue Router, and Pinia. Pure JavaScript — no TypeScript.

- **Auth flow**: Login stores `token` and `userInfo` in localStorage. Axios interceptor (`src/utils/request.js`) attaches the token as a custom `token` header (not `Authorization: Bearer`). Response interceptor unwraps `data.data` on success and redirects to `/auth/login` on auth failure (code -1).
- **Route structure**: Two top-level groups — `/back/*` (admin pages, wrapped in `BackendLayout`) and `/auth/*` (login/register, wrapped in `AuthLayout`). The sidebar (`SideBar.vue`) reads children from the first route group to render menu items.
- **BackendLayout** (`src/components/BackendLayout.vue`): Top-level admin shell — sidebar on the left, NavBar + `<router-view>` on the right. Sidebar collapse state is in Pinia store (`useAdminStore.isCollapsed`).
- **API layer**: Service functions in `src/api/admin.js`, all using the shared Axios instance from `src/utils/request.js`. Backend base URL is `/api` proxied via Vite to `http://159.75.169.224:1235`. File uploads reference `src/config/index.js` (`fileBaseUrl`).
- **Data flow**: Components use local `ref`/`reactive` for page state. No global store for business data — Pinia only stores sidebar collapse state. Each view manages its own API calls and pagination via `watch` on `pagination.current`.
- **Auto-imports**: Vue/Router/Pinia APIs (`ref`, `computed`, `watch`, `onMounted`, etc.) and Element Plus components/icons are auto-imported by unplugin. They do not need explicit imports, though some files still include them — both styles work.
- **TableSearch component** (`src/components/TableSearch.vue`): Generic search form that renders inputs/selects/dates from a `formItem` array prop and emits `@search` with the form values. Reused across list pages.

## Key Conventions

- **Prettier**: `semi: false`, `singleQuote: true`, `printWidth: 100`, `trailingComma: "none"`
- **Styles**: SCSS with `<style scoped lang="scss">` in Vue SFCs
- **Path alias**: `@/` maps to `src/` (configured in `vite.config.js` and `jsconfig.json`)
- **Vite proxy**: `/api` requests are proxied to the backend during dev — configure `VITE_API_BASE_URL` env var to override
