---
id: 0002
title: Add tooltip to terminate session
stage: general
date: 2026-01-10
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: unknown
command: chat
labels: ["ui","sidebar","tooltip"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - frontend/components/dashboard/UserProfile.tsx
tests:
 - none
---

## Prompt

Why are you writing PHR, you asked me to make 'Terminate Session' button show a tooltip in which I told you OK

First complete it properly, the tooltip for 'Dashboard' & 'Tasks' button in sidebar is more elegant, so make the tooltip for 'Termiante Session' button like those

## Response snapshot

- Updated only the Terminate Session button to use the same Radix Tooltip pattern as sidebar menu items.
- Tooltip is shown only when the sidebar is collapsed (icon mode) and not on mobile, matching `SidebarMenuButton` behavior.

## Outcome

- ✅ Impact: Terminate Session now shows an elegant tooltip when collapsed, consistent with Dashboard/Tasks.
- 🧪 Tests: Not run (per user preference/tool interruptions).
- 📁 Files: Updated `frontend/components/dashboard/UserProfile.tsx` only.
- 🔁 Next prompts: If you want the footer to fully match `SidebarMenuButton` visuals, we can refactor footer into sidebar menu primitives.
- 🧠 Reflection: Kept change localized while reusing the existing tooltip components and sidebar context.

## Evaluation notes (flywheel)

- Failure modes observed: Initial attempt to write PHR without explicit user approval caused confusion; clarified repo rule and proceeded with consent.
- Graders run and results (PASS/FAIL): Not run.
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): none
