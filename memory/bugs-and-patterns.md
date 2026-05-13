---
name: bugs-and-patterns
description: Record of important bugs, fixes, and error-prone patterns encountered in this project
metadata:
  type: project
---

## Bugs & Fixes

### request.js response interceptor fallthrough
- **Bug**: When `data.code` was neither 200 nor -1, the interceptor returned `undefined` (no fallback return). Callers got `undefined` instead of response data.
- **Fix**: Added `return data` at the end for non-200/non-(-1) codes. Changed if-else chain to flat if statements.
- **File**: `src/utils/request.js`

### DashBoard render crash — undefined nested property (twice)
- **Bug 1**: `analyzeData` initialized as `ref({})`, template accessed `analyzeData.systemOverview.totalUsers` before API resolved. `systemOverview` was `undefined`.
- **Bug 2**: Same root cause — added `consultationStats` template bindings but forgot to add the default value in the ref initialization. `analyzeData.consultationStats` was `undefined` on initial render.
- **Fix**: Initialize ref with full default structure so nested properties exist during initial render. Whenever adding template bindings that access a new nested path, always add the corresponding default value.
- **File**: `src/views/DashBoard.vue`

### Vite static asset — new URL() requires import.meta.url
- **Bug**: `new URL('@/assets/icon.png')` without second parameter throws `TypeError: Failed to construct 'URL': Invalid URL`
- **Fix**: Always use `new URL('@/assets/icon.png', import.meta.url).href`
- **File**: `src/views/DashBoard.vue`

### Element Plus dialog — bare <template> not rendering
- **Bug**: `<template>` without slot directive (e.g., `#footer`) renders content into dialog body, not footer.
- **Fix**: Use `<template #footer>` for named slots. `#` is `v-slot:` shorthand.
- **File**: `src/views/EmotionalDiary.vue`

### Dependency scan error — importing type declaration path
- **Bug**: `import { Position } from '@element-plus/icons-vue/dist/types'` — this is a `.d.ts` type declaration path, not a runtime module.
- **Fix**: Removed the import. `Position` in ECharts config should just be lowercase string `position:`.
- **File**: `src/views/DashBoard.vue`

### ECharts init logic — wrong guard variable
- **Bug**: `if (!emotionChart) return` checked the instance variable, not the DOM ref. Made the subsequent `dispose()` unreachable.
- **Fix**: Changed to `if (!emotionChartRef.value) return` — guard on the DOM ref, not the instance.

### CSS class mismatch — .value vs .number
- **Bug**: Template used `class="number"` but CSS defined `.value` — number styling never applied.
- **Fix**: Changed CSS `.value` to `.number` to match template.

## Key Patterns

### Slot types
- **Named slot**: `<template #header>` / `<template #footer>` — component-defined slot names
- **Scoped slot**: `<template #default="scope">` — component passes row data via slot, access with `scope.row`, `scope.$index`
- `#` = `v-slot:` shorthand

### el-card
- Provides `#header` named slot for card title area
- Default slot for card body content (no `#footer`)
- `shadow="always"` (string, no colon binding) for always-visible shadow

### el-dialog
- Provides `#footer` named slot for bottom button area
- `v-model="dialogVisible"` controls visibility
