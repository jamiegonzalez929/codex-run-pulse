import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { buildSummaryFromJsonl, parseJsonl, summarizeEvents } from "../src/runPulse.js";

test("parseJsonl returns records and line-scoped parse errors", () => {
  const parsed = parseJsonl('{"type":"thread.started"}\nnot-json\n{"type":"turn.started"}\n');

  assert.equal(parsed.records.length, 2);
  assert.equal(parsed.records[0].line, 1);
  assert.equal(parsed.records[1].line, 3);
  assert.equal(parsed.errors.length, 1);
  assert.equal(parsed.errors[0].line, 2);
});

test("summarizeEvents counts events, command executions, and timeline entries", () => {
  const records = parseJsonl([
    '{"type":"turn.started"}',
    '{"type":"item.started","item":{"id":"cmd_1","type":"command_execution","command":"npm test","status":"in_progress","exit_code":null}}',
    '{"type":"item.completed","item":{"id":"cmd_1","type":"command_execution","command":"npm test","status":"completed","exit_code":0,"aggregated_output":"ok\\n"}}',
    '{"type":"item.completed","item":{"id":"msg_1","type":"agent_message","text":"done"}}'
  ].join("\n")).records;

  const summary = summarizeEvents(records);

  assert.equal(summary.totalLines, 4);
  assert.deepEqual(summary.eventTypes[0], { name: "item.completed", count: 2 });
  assert.equal(summary.commandStats.total, 1);
  assert.equal(summary.commandStats.completed, 1);
  assert.equal(summary.commandExecutions[0].outputLines, 1);
  assert.equal(summary.agentMessages[0].text, "done");
  assert.equal(summary.timeline.length, 4);
});

test("the bundled run log produces browser-ready summary data", () => {
  const text = fs.readFileSync("codex-events.jsonl", "utf8");
  const summary = buildSummaryFromJsonl(text);

  assert.equal(summary.parseErrors.length, 0);
  assert.ok(summary.totalLines > 0);
  assert.ok(summary.eventTypes.some((eventType) => eventType.name === "thread.started"));
  assert.equal(summary.timeline.length, summary.totalLines);
});
