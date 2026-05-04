# Codex Run Pulse

Codex Run Pulse is a small static data visualization for a local Codex CLI project run. It reads the real `codex-events.jsonl` generated in this repository and renders a GitHub Pages-friendly dashboard with event counts, command history, and a line-by-line timeline.

## Why It Exists

Daily Codex runs leave behind useful execution telemetry, but JSONL logs are not pleasant to scan by hand. This project turns one run into a compact browser artifact that can be inspected locally or published as a static site.

## Features

- Parses newline-delimited Codex event JSON without external APIs.
- Surfaces top-level event type counts and nested item type counts.
- Reconstructs command execution records from started/completed events.
- Shows command exit codes and output line counts.
- Provides a chronological timeline linked to source JSONL line numbers.
- Ships as static HTML, CSS, JavaScript, and generated JSON data.
- Includes automated Node tests for parsing, summarization, and bundled log compatibility.

## Setup

Requirements:

- Node.js 20 or newer
- npm

Install dependencies:

```sh
npm install
```

There are currently no runtime npm dependencies; `npm install` creates the lockfile for reproducible script execution.

## How To Run

Generate the browser data:

```sh
npm run build:data
```

Serve the site locally:

```sh
npm run serve
```

The server prints the local URL. It starts at `http://127.0.0.1:4173` and automatically tries the next port if that one is busy.

## How To Test

```sh
npm test
```

## Example Usage

Refresh the visualization after another Codex CLI session appends to the log:

```sh
npm run build:data
npm run serve
```

You can also point the builder at another compatible JSONL file:

```sh
node scripts/build-data.js path/to/codex-events.jsonl public/data/run-summary.json
```

## Documentation

See [docs/data-model.md](docs/data-model.md) for the generated JSON schema and field definitions.

## Limitations And Next Ideas

- The bundled dataset is the current repository's run log, so the visualization grows as this run progresses.
- The site uses source line order rather than timestamps because this JSONL format does not guarantee timestamps for every event.
- Command duration is not calculated unless future logs include reliable timing data.
- A future version could compare multiple runs, export SVG charts, or add filters for item type and command status.
