import fs from "node:fs";
import path from "node:path";
import { buildSummaryFromFile } from "../src/runPulse.js";

const defaultSourcePath = fs.existsSync("codex-events.jsonl")
  ? "codex-events.jsonl"
  : "data/codex-events-snapshot.jsonl";
const sourcePath = process.argv[2] ?? defaultSourcePath;
const outputPath = process.argv[3] ?? "public/data/run-summary.json";

const summary = buildSummaryFromFile(sourcePath);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`);

console.log(`Wrote ${outputPath} from ${sourcePath}`);
