# Claude Instructions – Visa Checker App

This file defines how Claude should assist with development on this project.
Follow these rules strictly unless explicitly told otherwise.

---

## Core Principles

- Minimal comments
- Easy-to-read, descriptive function and component names
- Prefer clarity over cleverness
- Small, incremental changes only
- Do not refactor unrelated code
- Do not introduce new libraries unless explicitly requested

---

## Project Overview

App name: Visa Checker  
Platform: iOS (Expo / React Native managed workflow)

Purpose:
Check visa requirements based on:
- Passport nationality
- Destination country

The app is an MVP-first product and should stay simple.

---

## Tech Stack

- Expo (managed workflow)
- React Native
- JavaScript (not TypeScript unless explicitly requested)
- No backend initially
- Local mock data for visa rules

---

## Code Style Rules

- Use functional components only
- Use hooks (`useState`, `useEffect`) where appropriate
- No class components
- Avoid over-abstraction
- Keep files short and focused

### Naming
- Functions: verbs that describe intent (e.g. `getVisaRequirement`)
- Components: clear nouns (e.g. `VisaResultCard`)
- Variables: readable over short

---

## UI & Layout Rules

- Keep UI simple and readable
- Prefer Flexbox
- Avoid absolute positioning unless necessary
- Touch targets must be reliably clickable
- Mobile-first thinking always

---

## Data & Logic Rules

- Visa rules live in plain JS objects or JSON
- No hardcoding inside components
- Separate UI from logic
- All visa logic must be deterministic and easy to test

---

## What Claude Should Do

- Create new components when asked
- Fix bugs in a targeted way
- Explain briefly what was changed and why
- Ask for clarification only when truly necessary

---

## What Claude Must NOT Do

- Large refactors without permission
- Change file structure without asking
- Add analytics, auth, payments, or backend code
- Over-comment code
- Rewrite working code unnecessarily

---

## Incremental Development Rule

Each change should:
- Solve one problem
- Touch as few files as possible
- Be easy to revert

---

## Deployment Awareness

The app will eventually be deployed via Expo / App Store.
Avoid anything that complicates:
- EAS builds
- App Store review
- Offline usage

---

## When in Doubt

If a decision affects architecture, UX flow, or data modeling:
- Stop
- Ask before implementing
