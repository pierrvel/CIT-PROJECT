# Claude Code Guidelines

Please refer to and strictly follow [AGENTS.md](AGENTS.md) for full architectural guidelines, directory structures, and workflow requirements.

## Quick Summary for Claude
- **Vite + React 18 Modular Architecture**: Code is cleanly split into `src/components/`, `src/utils/`, `src/constants/`. Edit modular files rather than stuffing code into a monolith.
- **Standalone Backup**: `index.standalone.html` exists as a zero-dependency backup for double-click testing.
- **No Code Omission**: Never use `// ...existing code...` or `// TODO`. Always output 100% complete files.
- **Preserve All Features**:
  1. Sprint Planner (adaptive 3-way rescheduling: force surge, weekend deferral, scope pruning)
  2. Exam Pacer (Dual / Analog / Digital views, sequential time attack pipeline, Web Audio bell synthesizer, silent visual pulse, wake lock, 3s undo window)
  3. 6-digit PIN cloud sync (`server.py`)
  4. Time Analytics Dashboard & customizable glassmorphism wallpaper / dark mode
- **Build Verification**: Run `npm run build` to confirm 0 compilation errors before committing.
- **Git Routine**: Run `git pull origin main` before starting, and commit & push to `main` when done.
