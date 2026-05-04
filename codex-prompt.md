# Daily Codex Project Run

Read and follow this spec exactly:

# Daily Codex Project Spec

Build one small personal project per run using the local Codex CLI.

## Goals

Each run should produce a fully functional, tested repository that gets published to GitHub. Keep the scope small enough to finish in one session.

## Preferred themes

Choose one of these each day:

1. Benchmarks or evaluation tools
2. Small forks, extensions, or reinterpretations of popular AI repos
3. Random data visualizations, especially ones that can be shipped as GitHub Pages sites

Rotate naturally. Do not get stuck on one theme forever.

## Hard constraints

- No mocks, placeholders, fake features, or TODO-only scaffolding.
- The project must actually run.
- The project must have automated tests, and those tests must pass.
- Use third-party APIs only if Jamie already has access set up locally and the full end-to-end flow is genuinely tested in this run.
- If there is any doubt about API credentials or signup status, do not use that API.
- Default to no third-party APIs unless they are clearly necessary.
- Use real local, bundled, or openly available data when data is needed.
- Every repo must be published to GitHub.
- Every repo must include a robust README and useful documentation.

## Repo requirements

At minimum, every repo should contain:

- `README.md` with:
  - what it is
  - why it exists
  - features
  - setup
  - how to run
  - how to test
  - example usage
  - limitations and next ideas
- `docs/` with at least one additional documentation file
- automated tests
- a clean git history for the run, with the result pushed to GitHub

## GitHub Pages

If the project is a static visualization or a browser-based artifact that makes sense as a live demo, publish it via GitHub Pages and include the live URL in the output metadata.

## Metadata file

The finished repo must include a file named `.jamie-project-meta.json` with this shape:

```json
{
  "name": "repo-name",
  "summary": "short paragraph",
  "category": "benchmark|ai-fork|data-viz|other",
  "tech_stack": ["..."],
  "test_commands": ["..."],
  "run_commands": ["..."],
  "github_repo": "owner/repo",
  "github_url": "https://github.com/owner/repo",
  "pages_url": "https://... or empty string"
}
```

Rules:

- `test_commands` must be accurate and runnable from the repo root.
- Include at least one test command.
- `run_commands` should be the simplest useful commands for a human.
- If no Pages site exists, set `pages_url` to an empty string.

## Delivery expectations

The run should end with a concise human summary that includes:

- project name
- what it does
- repo URL
- live URL if any
- exact test commands that passed
- any meaningful caveats

You are building one small but real personal project from scratch in the current git repo.

Important constraints:
- Keep scope tight enough to finish in one uninterrupted session.
- Prefer zero third-party APIs.
- Do not use mocks, placeholders, TODO stubs, or fake integrations.
- The project must work locally.
- The project must include automated tests that pass.
- The project must include a robust README and a docs/ directory.
- The repo must be published to GitHub.
- If it is a static visualization or small front-end artifact, also publish it to GitHub Pages.
- Leave a `.jamie-project-meta.json` file in the repo root that matches the spec exactly.

Execution requirements:
1. Pick a worthwhile idea from the preferred themes.
2. Build the project fully.
3. Run the tests yourself and fix anything failing.
4. Create the GitHub repo with gh and push the result.
5. If GitHub Pages makes sense, enable it and include the final URL in the metadata.
6. Make sure `.jamie-project-meta.json` is truthful.
7. Print a short summary at the end with the repo URL, pages URL if any, and the test commands you ran.

GitHub publishing notes:
- Assume gh is already authenticated.
- Create a public repo unless there is a concrete reason not to.
- Use a sensible original repo name.

Do not ask for clarification. Make good choices and finish the job.
