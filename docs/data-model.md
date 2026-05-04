# Data Model

Codex Run Pulse reads a Codex CLI event log and emits `public/data/run-summary.json` for the browser.

## Source

Each non-empty line in the source JSONL file is parsed as a standalone JSON object. Invalid lines are retained as parse errors instead of crashing the build, which makes partial logs inspectable.

By default, `scripts/build-data.js` reads `codex-events.jsonl` when a live local log exists. Otherwise it uses the bundled `data/codex-events-snapshot.jsonl` captured during this project run.

## Derived Fields

- `totalLines`: number of valid JSONL records.
- `eventTypes`: count of top-level Codex event names such as `thread.started`, `turn.started`, and `item.completed`.
- `itemTypes`: count of nested item kinds when an event has an `item`.
- `commandExecutions`: command lifecycle records keyed by item id, including command text, status, exit code, output line count, and source line positions.
- `commandStats`: totals derived from `commandExecutions`.
- `agentMessages`: assistant update text with source line numbers.
- `timeline`: one compact label for each parsed record in original line order.
- `parseErrors`: JSON parse failures with line numbers.

## Regenerating

Run:

```sh
npm run build:data
```

The command rewrites `public/data/run-summary.json` from the current `codex-events.jsonl`.
