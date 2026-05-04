import fs from "node:fs";

const KNOWN_COMMAND_STATUSES = new Set(["completed", "in_progress", "failed"]);

export function parseJsonl(text) {
  const records = [];
  const errors = [];

  text.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    try {
      records.push({ line: index + 1, value: JSON.parse(trimmed) });
    } catch (error) {
      errors.push({
        line: index + 1,
        message: error.message
      });
    }
  });

  return { records, errors };
}

export function summarizeEvents(records) {
  const eventTypeCounts = new Map();
  const itemTypeCounts = new Map();
  const commandExecutions = new Map();
  const timeline = [];
  const agentMessages = [];

  for (const record of records) {
    const event = record.value;
    const eventType = typeof event.type === "string" ? event.type : "unknown";
    eventTypeCounts.set(eventType, (eventTypeCounts.get(eventType) ?? 0) + 1);

    const item = event.item && typeof event.item === "object" ? event.item : null;
    if (item?.type) {
      itemTypeCounts.set(item.type, (itemTypeCounts.get(item.type) ?? 0) + 1);
    }

    if (item?.type === "command_execution") {
      const existing = commandExecutions.get(item.id) ?? {
        id: item.id,
        command: item.command,
        status: "in_progress",
        exitCode: null,
        startedLine: null,
        completedLine: null,
        outputLines: 0,
        outputPreview: ""
      };

      if (eventType === "item.started") existing.startedLine = record.line;
      if (eventType === "item.completed") existing.completedLine = record.line;
      if (typeof item.command === "string") existing.command = item.command;
      if (KNOWN_COMMAND_STATUSES.has(item.status)) existing.status = item.status;
      if (typeof item.exit_code === "number") existing.exitCode = item.exit_code;
      if (typeof item.aggregated_output === "string") {
        existing.outputLines = item.aggregated_output.split(/\r?\n/).filter(Boolean).length;
        existing.outputPreview = item.aggregated_output.trim().slice(0, 240);
      }

      commandExecutions.set(item.id, existing);
    }

    if (item?.type === "agent_message" && typeof item.text === "string") {
      agentMessages.push({
        line: record.line,
        text: item.text
      });
    }

    timeline.push({
      line: record.line,
      eventType,
      itemType: item?.type ?? "",
      label: labelForEvent(event, record.line)
    });
  }

  const commands = [...commandExecutions.values()].sort((a, b) => {
    return (a.startedLine ?? a.completedLine ?? 0) - (b.startedLine ?? b.completedLine ?? 0);
  });

  return {
    generatedAt: new Date().toISOString(),
    totalLines: records.length,
    eventTypes: sortedCounts(eventTypeCounts),
    itemTypes: sortedCounts(itemTypeCounts),
    commandExecutions: commands,
    commandStats: {
      total: commands.length,
      completed: commands.filter((command) => command.status === "completed").length,
      failed: commands.filter((command) => command.exitCode && command.exitCode !== 0).length
    },
    agentMessages,
    timeline
  };
}

export function buildSummaryFromJsonl(text) {
  const parsed = parseJsonl(text);
  return {
    ...summarizeEvents(parsed.records),
    parseErrors: parsed.errors
  };
}

export function buildSummaryFromFile(path) {
  return buildSummaryFromJsonl(fs.readFileSync(path, "utf8"));
}

function sortedCounts(counts) {
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function labelForEvent(event, line) {
  if (event.type === "thread.started") return `Thread ${event.thread_id ?? "started"}`;
  if (event.type === "turn.started") return "Turn started";
  if (event.item?.type === "command_execution") {
    return `${event.type.replace("item.", "")}: ${event.item.command ?? "command"}`;
  }
  if (event.item?.type === "agent_message") return "Agent update";
  return `${event.type ?? "unknown"} at line ${line}`;
}
