# STILL — Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Ready for implementation planning  
**Product type:** Responsive, local-first productivity web application  
**Design concept:** Minimalism  
**Working title:** Still  
**Tagline:** Make room for what matters.  
**Primary development environment:** Antigravity  
**AI development skills:** `impeccable`, `caveman`, `ponytail`  
**Implementation status:** Not started

---

## 1. Executive Summary

Still is a minimalist daily planner designed to help users focus on what matters without the pressure, clutter, and complexity of traditional productivity applications.

Users can plan up to three priorities per day, write a short private journal entry, and focus on one task at a time through a distraction-free focus session.

The application opens with a minimal welcome screen for first-time users. Returning users are taken directly to their existing daily workspace.

Still is local-first: core functionality must work without registration, and personal data is stored on the user's device. Cloud synchronization may be introduced in a future release.

The defining experience is Focus Mode. When a user begins a session, the rest of the interface fades away, leaving only the selected task, timer, and essential controls.

Still must demonstrate that a productivity application can be functional, responsive, accessible, and technically reliable while remaining visually quiet.

### Product vision

Build a digital space that feels like a quiet notebook rather than a conventional productivity dashboard.

### Core promise

**Plan less. Be present. Finish what matters.**

### Success definition

A user can open Still, choose three priorities, write a journal entry, complete a focus session, close the browser, and return later to find their information intact—without creating an account.

---

## 2. Problem Statement

Many productivity tools introduce more complexity than the work they are supposed to support.

Common problems include:

- Too many tasks, lists, metrics, and dashboards competing for attention.
- Overly complex task-management systems.
- Pressure from streaks, scores, reminders, and gamification.
- Interfaces that remain visually busy while users are trying to focus.
- Dependence on an account or network connection for basic functionality.
- Journaling and task planning being separated across different applications.

Still addresses these problems by limiting daily planning to three priorities, providing one simple writing space, and making focused work the central interaction.

### Product hypothesis

If users have a calm environment, a small number of meaningful priorities, and an easy way to focus on one task, they can spend less time managing productivity and more time doing the work itself.

---

## 3. Goals and Non-Goals

### 3.1 Product goals

1. Create an exceptionally clean, consistent minimalist interface.
2. Let users plan a day in seconds.
3. Limit priorities to three per day.
4. Provide a private, distraction-free journaling experience.
5. Deliver a reliable focus timer with persistent session state.
6. Preserve user data locally without requiring an account.
7. Support desktop, tablet, and mobile browsers.
8. Support light mode, dark mode, and system theme preferences.
9. Support offline use after the application has been successfully cached.
10. Establish an architecture that can support future cloud synchronization.

### 3.2 Non-goals for version one

The following are explicitly excluded:

- AI-generated plans or journal summaries.
- Social feeds, shared journals, and collaborative workspaces.
- Leaderboards, streaks, productivity scores, and guilt-inducing notifications.
- Complex project management, nested subtasks, and unlimited daily priorities.
- Mandatory registration or authentication.
- Cloud synchronization.
- Paid subscriptions or billing.
- Native desktop or mobile applications.
- Decorative analytics dashboards.
- Extensive theme customization.
- Complex soundscapes or gamified animations.

These exclusions protect the product's scope and minimalist identity.

---

## 4. Target Users

### Primary user

Someone who wants a calmer and simpler way to organize daily work without adopting a complex productivity system.

### User characteristics

- Wants to identify the most important tasks of the day.
- Prefers simple interfaces with little visual noise.
- Needs an easy way to focus on one task.
- May use the application for studying, personal projects, work, or daily responsibilities.
- Values privacy and does not want to create an account just to begin.
- May switch between desktop and mobile devices.

### Primary user journey

1. Open Still.
2. Begin the day.
3. Add up to three priorities.
4. Write a short journal entry.
5. Select a priority.
6. Enter Focus Mode.
7. Start, pause, resume, or finish a session.
8. Return to the planner.
9. Review the day later.

This journey is the primary basis for implementation and acceptance testing.

---

## 5. Design Direction: Strict Minimalism

### 5.1 Design principles

Every interface decision must follow these principles:

**Purpose over decoration.** Every visible element must support planning, reflection, navigation, or focus.

**Whitespace over containers.** Separate content using spacing and subtle dividers instead of cards, shadows, and colored panels.

**Typography over graphics.** Use type size, weight, line height, and spacing to establish hierarchy.

**Restraint over stimulation.** Animations and feedback must be subtle and purposeful.

**Clarity over density.** Show only what the user needs for the current task.

**Consistency over novelty.** Reuse established visual patterns instead of introducing new treatments for every screen.

### 5.2 Color tokens

| Token | Value | Usage |
|---|---|---|
| Background | `#FAF9F6` | Primary light-mode canvas |
| Primary text | `#222222` | Headings, body text, primary controls |
| Muted text | `#85847F` | Dates, metadata, secondary labels |
| Divider | `#E7E4DD` | Fine separators and subtle borders |

These four colors form the foundation of the light theme.

Additional semantic colors may be introduced only where necessary for accessible success, error, or warning states. They must remain restrained and must not become decorative accents.

### 5.3 Typography

Use an editorial serif for prominent headings and a clean sans-serif for body text and controls.

Suggested font pairing:

- Headings: Lora or DM Serif Display.
- Body and interface: Inter or DM Sans.

Choose one serif and one sans-serif family for the implementation. Prefer locally available or reliably hosted font assets, with sensible system fallbacks.

Typography hierarchy:

- Page headings: expressive serif, normal weight.
- Section headings: medium-sized serif or restrained sans-serif.
- Body text: highly readable sans-serif.
- Metadata: small sans-serif with sufficient contrast.
- Timer: large, centered numerals with tabular figures.

Avoid excessive uppercase text, excessive font weights, and decorative letter spacing.

### 5.4 Layout and spacing

- Use a consistent spacing scale.
- Establish a readable maximum content width.
- Keep generous outer margins on desktop.
- Use a single-column flow on mobile.
- Prefer fine dividers over card boundaries.
- Avoid unnecessary shadows, gradients, glass effects, and decorative imagery.
- Maintain consistent alignment between headings, task rows, and journal content.
- Avoid unnecessary sticky elements that consume viewport space.

### 5.5 Interaction design

- Use short, subtle opacity and transform transitions.
- Prefer CSS transitions over a heavy animation dependency.
- Provide immediate feedback for task completion and successful saves.
- Avoid excessive bouncing, pulsing, parallax, or attention-seeking motion.
- Respect `prefers-reduced-motion`.
- Ensure animations never prevent access to controls.

### 5.6 Dark mode

Support three appearance settings:

- System
- Light
- Dark

Dark mode must preserve the light theme's hierarchy while using warm near-black surfaces, soft off-white text, and restrained dividers.

Do not use pure black backgrounds with glaring white text as the default aesthetic. Avoid adding colorful accent palettes.

Persist the manual preference locally. When System is selected, follow the operating system's color preference.

### 5.7 Design rejection criteria

A proposed UI must be reconsidered if it introduces:

- Multiple colorful cards.
- Decorative gradients.
- Glassmorphism or neumorphism.
- Unnecessary charts or analytics.
- Large decorative illustrations.
- Excessive icon usage.
- Gamified badges or progress scores.
- Dense navigation.
- Unnecessary modal dialogs.
- Animations that compete with reading or writing.

The final interface should feel quiet and intentional, not empty because features are missing.

---

## 6. Information Architecture

The application contains five principal interface areas.

### 6.1 Welcome

Route: `/`

Purpose: Introduce Still and allow first-time users to begin immediately.

### 6.2 Today

Route: `/today`

Purpose: Daily priorities and journaling.

### 6.3 Focus Mode

Implementation: A dedicated application state or full-screen overlay associated with a selected priority.

Purpose: Focus on a single task without other application content.

### 6.4 Past Days

Route: `/history`

Purpose: Browse previous daily plans, completion states, and journal entries.

### 6.5 Settings

Route: `/settings`

Purpose: Configure appearance, focus durations, and personal data management.

Navigation should remain compact. On desktop, use a small wordmark and minimal links. On mobile, use an appropriately compact navigation pattern with accessible touch targets.

Focus Mode must hide the regular navigation.

---

## 7. Functional Requirements

### 7.1 Welcome Screen

**FR-WEL-01:** Display the Still wordmark, tagline, concise product description, and a primary Begin action.

**FR-WEL-02:** Do not require account creation, registration, or an onboarding questionnaire.

**FR-WEL-03:** The Begin action opens today's workspace using the user's current local date.

**FR-WEL-04:** Returning users with existing initialized data should open Today instead of repeatedly seeing the introduction.

**FR-WEL-05:** The welcome screen must support desktop and mobile viewports.

**FR-WEL-06:** The transition from Welcome to Today must be subtle and respect reduced-motion preferences.

**Acceptance criteria:**

- A first-time user can reach Today with one primary action.
- No account or network request is required to begin.
- Existing data remains accessible on subsequent visits.
- The welcome screen does not become a recurring obstacle.

### 7.2 Daily Plans

**FR-PLAN-01:** Create or retrieve a daily plan for the selected local date.

**FR-PLAN-02:** Each date may have one daily plan.

**FR-PLAN-03:** A plan supports up to three priorities.

**FR-PLAN-04:** Users can add, edit, reorder, complete, and delete priorities.

**FR-PLAN-05:** Each priority has a stable unique ID and a position.

**FR-PLAN-06:** Completion status is stored independently from focus sessions.

**FR-PLAN-07:** Users can navigate between dates without overwriting other days.

**FR-PLAN-08:** Changes persist locally.

**FR-PLAN-09:** The three-priority limit must be enforced in both the interface and data layer.

**FR-PLAN-10:** Empty plans must be valid and must not display guilt-inducing messages.

**Interaction behavior:**

- Provide a subtle Add Priority affordance.
- Disable or hide the add action when three priorities exist, with a concise explanation.
- Task completion should update immediately and persist without a separate Save button.
- Reordering should use simple accessible controls or drag-and-drop with an alternative for keyboard and touch users.
- Deletion must not silently destroy associated focus history.
- Editing a past day must operate on that date's record.

**Acceptance criteria:**

- A fourth priority cannot be created through either the UI or repository API.
- Editing one task does not modify another task.
- Task order survives reloads.
- Completion states remain correct after reopening the application.
- Daily plans remain isolated by local date.

### 7.3 Journaling

**FR-JRN-01:** Provide one plain-text journal entry per daily plan.

**FR-JRN-02:** Support multiline input and ordinary text editing.

**FR-JRN-03:** Automatically save changes after a short debounce.

**FR-JRN-04:** Attempt a final save on blur and during appropriate page lifecycle events.

**FR-JRN-05:** Display discreet save feedback when useful.

**FR-JRN-06:** Restore journal text when the user revisits a date.

**FR-JRN-07:** Journal content must not be transmitted to a remote service in version one.

**FR-JRN-08:** Journal content must not be cleared merely because the user exits Focus Mode.

**Acceptance criteria:**

- A journal entry survives a page refresh.
- Switching between dates does not mix entries.
- Rapid typing does not trigger a database write for every keystroke.
- Storage failures are surfaced through calm, actionable feedback.
- The application does not claim an entry is saved before the persistence operation succeeds.

### 7.4 Focus Mode

Focus Mode is Still's signature feature and must receive special attention during implementation and testing.

**FR-FOC-01:** A user can enter Focus Mode from an existing priority.

**FR-FOC-02:** Focus Mode displays only the selected task, timer, and essential controls.

**FR-FOC-03:** Starting a session requires an explicit user action.

**FR-FOC-04:** Provide Start, Pause, Resume, and End controls.

**FR-FOC-05:** Support a configurable focus duration, defaulting to 25 minutes.

**FR-FOC-06:** Track elapsed and remaining focus time accurately.

**FR-FOC-07:** Paused time must not count toward active focus time.

**FR-FOC-08:** Persist enough state to restore an active session after a refresh or browser restart.

**FR-FOC-09:** Completing a session must not automatically complete the associated priority.

**FR-FOC-10:** Ending a session must not delete its history.

**FR-FOC-11:** Support multiple sessions associated with one priority.

**FR-FOC-12:** Provide a completion state and a clear route back to Today.

**Timer implementation requirements:**

- Do not rely exclusively on repeated one-second countdown callbacks.
- Store session start timestamps and paused duration information.
- Calculate remaining time from timestamps and accumulated active time.
- Reconcile the display when the tab becomes visible again.
- Restore active sessions from persisted state.
- Use appropriate browser APIs for visibility changes and lifecycle events.
- Prevent duplicate session creation when users click controls repeatedly.
- Handle system sleep and browser throttling correctly.

**Recommended session states:**

- `idle`
- `running`
- `paused`
- `completed`
- `abandoned`

An ended session can be marked abandoned if it was deliberately stopped before completion. A completed session is one that reaches its planned duration.

The data model may use additional internal states if required, but the UI must remain simple.

**Acceptance criteria:**

- Starting a session records the associated priority.
- Pause and resume preserve the session's accumulated active time.
- Refreshing does not reset an active timer to its original duration.
- Inactive tabs and system sleep do not cause the displayed timer to drift permanently.
- Ending a session early does not mark it as completed.
- Timer completion records the session once, not multiple times.
- Focus Mode hides other tasks, journal text, and navigation.
- Exiting Focus Mode returns the user to a sensible location in Today.

### 7.5 Past Days

**FR-HIS-01:** Display previous daily plans in chronological order.

**FR-HIS-02:** Show a subtle indication of task completion and journal presence.

**FR-HIS-03:** Allow the user to open a selected day.

**FR-HIS-04:** Preserve historical data when navigating between dates.

**FR-HIS-05:** Allow editing past records unless the user explicitly chooses otherwise.

**FR-HIS-06:** Do not introduce streaks, performance scores, or guilt-based summaries.

**Acceptance criteria:**

- Previously saved plans are discoverable.
- Empty days are valid.
- Historical journal entries load correctly.
- History remains readable on mobile.
- Historical task edits do not accidentally change today's plan.

### 7.6 Settings

**FR-SET-01:** Support System, Light, and Dark themes.

**FR-SET-02:** Persist manual appearance preferences locally.

**FR-SET-03:** Support configurable focus duration.

**FR-SET-04:** Optionally support a configurable short-break duration.

**FR-SET-05:** Allow export of personal data to JSON.

**FR-SET-06:** Validate imported JSON before modifying existing records.

**FR-SET-07:** Require confirmation before clearing data or replacing an existing dataset.

**FR-SET-08:** Clearly explain that locally stored data is not automatically available on another device.

**Acceptance criteria:**

- Theme changes apply immediately.
- Theme preference survives a restart.
- Invalid imports do not corrupt existing records.
- Exported data can be imported into a clean installation.
- Destructive actions require explicit confirmation.

---

## 8. Data Model

Use IndexedDB as the primary database for personal content.

A small repository layer must separate database operations from React components. Dexie or the native IndexedDB API with a lightweight wrapper may be used. Choose one approach and avoid introducing unnecessary storage abstractions.

### 8.1 DailyPlan

```ts
interface DailyPlan {
  id: string;
  localDate: string; // YYYY-MM-DD
  journalText: string;
  createdAt: string; // ISO 8601 UTC
  updatedAt: string; // ISO 8601 UTC
}
```

Rules:

- `localDate` identifies the user's local calendar day.
- Enforce uniqueness for the selected date.
- Journal text belongs to the daily plan.
- A date must not be derived from UTC midnight without considering the user's local timezone.

### 8.2 Priority

```ts
interface Priority {
  id: string;
  planId: string;
  title: string;
  position: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

Rules:

- Each priority belongs to exactly one daily plan.
- `position` defines the displayed order.
- A non-null `completedAt` indicates completion.
- The repository enforces no more than three priorities per plan.
- IDs remain stable when tasks are reordered or edited.

### 8.3 FocusSession

```ts
type FocusSessionStatus =
  | "running"
  | "paused"
  | "completed"
  | "abandoned";

interface FocusSession {
  id: string;
  priorityId: string;
  startedAt: string;
  endedAt: string | null;
  plannedDurationSeconds: number;
  accumulatedFocusSeconds: number;
  pausedAt: string | null;
  status: FocusSessionStatus;
  createdAt: string;
  updatedAt: string;
}
```

Rules:

- Store timestamps as ISO 8601 UTC values.
- Persist enough information to reconstruct remaining time.
- A session must have a valid associated priority.
- `accumulatedFocusSeconds` represents active focus time, not wall-clock time.
- A session can end without the task being completed.
- Database updates must prevent duplicate completion records.
- Define a migration strategy before changing the schema.

If implementation requires additional timestamps or pause metadata to restore sessions reliably, add them rather than sacrificing correctness.

### 8.4 UserPreferences

```ts
type ThemePreference = "system" | "light" | "dark";

interface UserPreferences {
  theme: ThemePreference;
  defaultFocusDurationSeconds: number;
  shortBreakDurationSeconds: number;
  schemaVersion: number;
}
```

Preferences are stored separately from daily content.

### 8.5 Database indexes and constraints

At minimum:

- Unique index on `DailyPlan.localDate`.
- Index on `Priority.planId`.
- Index on `FocusSession.priorityId`.
- Index on `FocusSession.status` where useful for session recovery.
- Schema version management for migrations.

Application-level validation must enforce relationships and the three-priority limit.

Database migrations must preserve existing user content.

### 8.6 Future synchronization compatibility

Do not implement cloud sync in version one.

However, use stable IDs, explicit timestamps, repository boundaries, and schema versions so a future sync service can be added without rewriting every screen.

When cloud sync is eventually implemented, introduce explicit synchronization metadata and a documented conflict-resolution strategy.

Never silently upload journal content.

---

## 9. Technical Architecture

### 9.1 Required stack

- Next.js with the App Router.
- React.
- TypeScript with strict type checking.
- Tailwind CSS.
- CSS custom properties for design tokens.
- IndexedDB for structured local persistence.
- Lucide icons, used sparingly.
- Lightweight CSS transitions.
- A service worker and web app manifest for offline application-shell caching.
- Vercel or another compatible static/deployment platform.

Use stable, mutually compatible package versions at implementation time and record the selected versions in the package manifest and lockfile.

### 9.2 Architecture boundaries

**UI layer:** Pages, layouts, controls, and reusable components.

**Feature layer:** Daily plans, priorities, journal editing, focus sessions, history, and preferences.

**Repository layer:** IndexedDB reads, writes, queries, transactions, and migrations.

**Domain layer:** Validation, date rules, priority limits, focus-session transitions, and elapsed-time calculations.

**Offline layer:** Application-shell caching and network-independent core functionality.

UI components must not directly manipulate IndexedDB.

Core business logic should be testable without rendering React components.

### 9.3 Proposed folder structure

```text
still/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── today/
│   │   ├── history/
│   │   └── settings/
│   ├── components/
│   │   ├── layout/
│   │   ├── typography/
│   │   ├── controls/
│   │   └── feedback/
│   ├── features/
│   │   ├── daily-plans/
│   │   ├── priorities/
│   │   ├── journal/
│   │   ├── focus/
│   │   ├── history/
│   │   └── preferences/
│   ├── lib/
│   │   ├── database/
│   │   ├── dates/
│   │   ├── validation/
│   │   └── accessibility/
│   ├── styles/
│   │   └── tokens.css
│   └── types/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── README.md
└── package.json
```

This structure is a guide, not a requirement to create empty directories. Implement only the modules needed for the current milestone.

### 9.4 Rendering and browser storage

IndexedDB is browser-only.

- Do not access `window`, `document`, or IndexedDB during server rendering.
- Load local content after the client environment is ready.
- Prevent hydration mismatches between server-rendered and browser-rendered UI.
- Render useful loading and empty states while local records are being retrieved.
- Keep the initial application shell small.

### 9.5 State management

Use React state and context where sufficient.

Introduce a dedicated state library only if actual complexity justifies it.

Do not duplicate IndexedDB content into multiple unsynchronized sources of truth.

The timer's domain state must remain consistent with persisted session state.

---

## 10. Offline and Privacy Requirements

### 10.1 Offline functionality

Still must support:

- Viewing existing daily plans.
- Creating and editing priorities.
- Writing and saving journal entries.
- Starting, pausing, and ending focus sessions.
- Viewing past days.
- Changing local preferences.

These features must not require network access after the app is available locally.

### 10.2 Progressive Web App

Implement the service worker after core persistence and routing work reliably.

Requirements:

- Cache the application shell and necessary static assets.
- Version caches and remove obsolete versions safely.
- Do not cache private user content in shared HTTP caches.
- Handle missing network access gracefully.
- Ensure cached assets remain compatible with the currently active application version.
- Provide an installable manifest where supported.
- Test offline behavior in a real browser.

A first-time visitor must initially load the application while online. The application cannot guarantee first-visit offline access before the required assets have been downloaded.

### 10.3 Privacy

- No mandatory account.
- No remote storage of journal content.
- No unnecessary third-party analytics.
- No advertising or tracking SDKs in the MVP.
- No remote AI processing.
- Clear messaging about browser-local storage and device limitations.
- User-controlled export and deletion.

Local storage is not equivalent to encrypted storage. Do not claim that personal data is encrypted at rest unless encryption is actually implemented and appropriately designed.

---

## 11. Responsive Design Requirements

### Desktop

- Spacious central content area.
- Minimal horizontal navigation.
- Readable maximum content width.
- No unnecessary sidebars.
- Focus Mode centered in the viewport.

### Tablet

- Reduced outer margins.
- Preserved typography hierarchy.
- Comfortable touch interactions.
- No squeezed multi-column layouts.

### Mobile

- Single-column content.
- Touch targets ideally around 44 × 44 CSS pixels.
- Readable text without horizontal scrolling.
- Compact date navigation.
- Journal input that adapts to the on-screen keyboard.
- No fixed elements obscuring primary controls.
- Focus Mode remains usable in portrait and landscape orientations.

### Responsive acceptance criteria

Test at representative viewport widths of 320, 375, 768, 1024, and 1440 CSS pixels.

No core screen may have unintended horizontal overflow.

All essential actions must remain reachable on small screens.

---

## 12. Accessibility Requirements

Accessibility is a functional requirement, not a final visual polish task.

- Use semantic HTML.
- Provide accessible names for icon-only controls.
- Ensure all functions work with a keyboard.
- Maintain visible focus indicators.
- Use appropriate heading hierarchy.
- Ensure adequate text and control contrast in both themes.
- Do not use color as the sole indicator of task completion or errors.
- Respect reduced-motion preferences.
- Provide understandable validation and save feedback.
- Keep focus order logical when entering and leaving Focus Mode.
- Return keyboard focus to a sensible control when the Focus Mode overlay closes.
- Announce meaningful timer completion and save failures without announcing every second of a countdown.
- Avoid trapping users in overlays without a clear exit.
- Ensure touch targets and spacing are usable for people with motor impairments.

Target WCAG 2.2 Level AA where applicable.

---

## 13. Error Handling and Edge Cases

### Persistence failures

If a database operation fails:

- Preserve the user's current input in memory when possible.
- Do not claim that changes were saved.
- Display concise, actionable feedback.
- Retry only when appropriate and without creating duplicate records.

### Timer interruptions

Handle:

- Browser refreshes.
- Tab visibility changes.
- Device sleep.
- Browser restarts.
- Repeated clicks on Start or Resume.
- Expiration while the application is in the background.
- A deleted priority with an associated active or historical session.

An active session must not become a permanently running timer simply because the browser was closed.

### Date and timezone behavior

- Use the user's local date to identify daily plans.
- Store timestamps in UTC.
- Avoid treating a date-only string as a UTC instant.
- Test timezone changes and daylight-saving transitions where relevant.
- Do not silently merge two dates when the local timezone changes.

Define how an active session behaves when the system clock changes. Prefer a consistent timestamp-based strategy, detect suspicious clock changes where practical, and test the behavior.

### Import and export

- Validate JSON structure and supported schema versions.
- Reject malformed records.
- Enforce the three-priority limit during import.
- Prevent imported IDs from accidentally overwriting existing data without explicit user consent.
- Provide clear replace-versus-merge semantics.
- Make destructive replacement an explicit confirmed action.

### Browser storage limitations

Browser data can be cleared by users, browser settings, or storage eviction.

The product must not promise permanent retention of local-only content. Encourage periodic export through an unobtrusive setting rather than adding a persistent warning to the main interface.

---

## 14. Testing Strategy

### 14.1 Unit tests

Test pure domain logic:

- Date formatting and local-date selection.
- Three-priority enforcement.
- Priority ordering.
- Completion state.
- Focus timer calculations.
- Pause and resume accounting.
- Session completion and abandonment.
- Import validation.
- Theme preference logic.
- Schema migration behavior.

### 14.2 Integration tests

Test repository operations:

- Creating and retrieving daily plans.
- Enforcing unique daily dates.
- Creating, editing, reordering, and deleting priorities.
- Persisting journal content.
- Saving and restoring focus sessions.
- Handling failed transactions.
- Importing and exporting a complete dataset.

### 14.3 End-to-end tests

Test real user journeys:

1. First visit → Begin → Today.
2. Create three priorities → attempt a fourth.
3. Write a journal entry → refresh → verify persistence.
4. Navigate to another date → return → verify isolation.
5. Start focus → pause → resume → complete.
6. Refresh during focus → verify accurate remaining time.
7. Complete a focus session → verify task completion remains unchanged.
8. Switch to dark mode → reload → verify persistence.
9. Export data → clear test data → import → verify restoration.
10. Load the app online → go offline → verify core flows.
11. Test mobile layout and keyboard navigation.

### 14.4 Regression tests

After every milestone, run the relevant automated tests and check that previously working behavior still works.

Do not claim a test passed unless the test was actually executed and its result inspected.

---

## 15. Acceptance Criteria and Definition of Done

The MVP is ready for release when all of the following are true.

### Product behavior

- First-time users can begin without registering.
- Returning users can access existing local data.
- Daily plans support no more than three priorities.
- Tasks can be edited, reordered, and completed.
- Journal entries save and restore correctly.
- Focus sessions support all required state transitions.
- Focus timing remains accurate after reloads and backgrounding.
- Session completion is independent from task completion.
- History displays the correct daily records.
- Preferences persist across restarts.

### Design

- The approved warm-paper palette is consistently applied.
- Editorial serif headings and sans-serif body typography are used.
- Whitespace and subtle dividers establish hierarchy.
- There are no unnecessary gradients, colorful dashboards, or decorative effects.
- Dark mode preserves the product's visual identity.
- Motion is restrained and respects reduced-motion preferences.
- The mobile layout is intentional, not simply a compressed desktop layout.

### Engineering

- TypeScript strict checking passes.
- Production build completes successfully.
- No known critical runtime errors remain.
- Repository operations are separated from UI components.
- Core domain logic has automated tests.
- Database migrations preserve existing data.
- Offline behavior is tested in a browser.
- Import/export validates data safely.
- No required core workflow depends on a remote API.

### Documentation

- README explains setup, development, testing, and production build commands.
- Data storage and backup limitations are documented.
- The application architecture and database schema are documented.
- Known limitations and incomplete items are recorded honestly.

A visually polished interface alone does not satisfy the definition of done.

---

## 16. Implementation Roadmap

Implement in small, verifiable milestones. Do not attempt to build every feature in one large generation step.

### Milestone 0 — Skill activation and project setup

1. Locate and load the installed `impeccable`, `caveman`, and `ponytail` skills.
2. Read their actual instructions and identify any conflicts or overlapping responsibilities.
3. Use the skills according to their documented workflows.
4. Establish the project directory and initialize the Next.js application.
5. Confirm the package manager, TypeScript configuration, Tailwind setup, and development server.
6. Record initial commands and verification results.

**Exit criteria:** Skills are verified as loaded, the project starts successfully, and the baseline build passes.

If any skill cannot be found or loaded, stop and report the exact issue. Do not invent the skill's contents.

### Milestone 1 — Visual foundation

Implement:

- Design tokens.
- Typography.
- Global layout.
- Welcome screen.
- Today screen structure.
- Empty states.
- Responsive behavior.
- Initial light and dark themes.

Use representative sample content only as temporary fixtures. Clearly distinguish sample content from persisted user data.

**Exit criteria:** The interface matches the approved minimalist direction at desktop and mobile sizes.

### Milestone 2 — Daily planning

Implement:

- IndexedDB schema and repository.
- Daily plan retrieval and creation.
- Priority CRUD operations.
- Three-priority enforcement.
- Ordering and completion.
- Date navigation.
- Journal autosave.

**Exit criteria:** Plans and journal entries persist correctly across refreshes and restarts.

### Milestone 3 — Focus engine

Implement:

- Session state machine.
- Timestamp-based timer.
- Pause and resume.
- Session persistence and recovery.
- Focus Mode transition.
- Completion and abandonment behavior.

**Exit criteria:** Timer tests pass and sessions restore accurately after interruptions.

### Milestone 4 — History and preferences

Implement:

- Past-day list.
- Historical record navigation.
- Theme preferences.
- Focus-duration settings.
- JSON export and validated import.
- Clear-data confirmation.

**Exit criteria:** Historical records and preferences work reliably.

### Milestone 5 — Offline and accessibility

Implement:

- Service worker.
- Application-shell caching.
- Web app manifest.
- Reduced-motion support.
- Keyboard navigation.
- Accessible focus management.
- Error and storage failure states.

**Exit criteria:** Offline core functionality and accessibility checks pass.

### Milestone 6 — Release verification

Perform:

- Unit, integration, and end-to-end tests.
- Production build verification.
- Responsive viewport checks.
- Offline tests.
- Browser restart and persistence tests.
- Visual consistency audit.
- Documentation updates.

**Exit criteria:** All release acceptance criteria pass or remaining issues are explicitly documented and approved.

---

## 17. Development Rules for Antigravity

These rules apply throughout implementation.

### Work incrementally

- Implement one milestone at a time.
- Inspect existing files before changing them.
- Avoid replacing working components unnecessarily.
- Keep changes small and explainable.
- Do not skip verification to move faster.

### Maintain a single source of truth

- This PRD defines product behavior and scope.
- The design tokens define the visual system.
- Domain logic defines task and timer rules.
- The repository layer defines persistence behavior.
- If a conflict appears, identify it before making an assumption.

### Avoid overengineering

- Do not add dependencies without a clear reason.
- Do not introduce a global state library merely by habit.
- Do not add backend services to a local-first MVP.
- Do not build speculative cloud-sync functionality.
- Do not create abstractions that have no current use.
- Prefer the simplest implementation that satisfies the requirements reliably.

### Verify claims

After each milestone:

1. Run the relevant tests.
2. Run TypeScript checks.
3. Run the production build when appropriate.
4. Inspect the actual output.
5. Record what passed and what failed.
6. Fix regressions before moving forward.

Never report success based only on code generation or visual inspection.

### Preserve the minimalist identity

Do not introduce new interface features, visual treatments, or scope expansions without checking them against this PRD.

When a design choice is uncertain, prefer the option with fewer visible elements and clearer user intent.

---

## 18. Future Considerations

These features are not part of the MVP.

They may be evaluated after the core product is stable:

- Optional cloud synchronization.
- Multi-device access.
- Account creation and recovery.
- Conflict resolution between devices.
- Optional reminders.
- Additional focus statistics.
- Export formats beyond JSON.

Any cloud implementation must include explicit user consent, a privacy model, synchronization metadata, and a conflict-resolution strategy. It must not silently upload existing journal entries.

---

## 19. Final Product Statement

Still is a calm, minimalist workspace for daily intention and focused work.

It gives users three priorities, one journal, and one task at a time. It respects their privacy, works locally, and avoids unnecessary complexity.

The quality of Still is not measured by the number of features it contains. It is measured by how easily someone can open it, think clearly, do meaningful work, and leave without feeling overwhelmed.

**Make room for what matters.**

---

# END OF PRD
