---
name: feedback-compaction-priorities
description: User wants compaction to preserve bug fixes, business logic checkpoints, and important/error-prone knowledge points
metadata:
  type: feedback
---

When compacting context, prioritize preserving:
1. Checkpoints after each completed feature/component
2. Bugs encountered and their root causes + fixes
3. Business logic specifics that are easy to forget
4. Important but error-prone knowledge points (e.g., slot usage, CSS scoping, ECharts init flow)

**Why:** User explicitly requested this — they want the compressed context to retain these items for future debugging and reference.
**How to apply:** When writing compaction summaries, structure them around these categories rather than chronological narration.
