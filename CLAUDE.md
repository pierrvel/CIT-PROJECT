# Claude Code Guidelines

Please refer to and strictly follow [AGENTS.md](AGENTS.md) for all architectural rules, inviolable constraints, and workflow guidelines.

## Quick Summary for Claude
- **Single File WebApp**: Do not split `index.html`. It must run standalone without npm/vite build steps.
- **No Code Omission**: Do not use `// ...existing code...` or `// TODO`. Always output complete code.
- **Preserve All Features**: Exam Pacer, Analog CSAT watch, Web Audio chime synthesis, Wake Lock, Undo window, PIN sync (`server.py`), Sprint Planner, and Time Dashboard must be 100% preserved.
- **Git Routine**: Run `git pull origin main` before starting, and commit & push to `main` when done.
