const dataUrl = "data/run-summary.json";

const formatter = new Intl.NumberFormat();

async function load() {
  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error(`Unable to load ${dataUrl}: ${response.status}`);
  }
  return response.json();
}

function render(summary) {
  const failedCommands = summary.commandExecutions.filter((command) => command.exitCode !== null && command.exitCode !== 0);
  document.querySelector("#summary").textContent =
    `A browser-readable pulse of ${formatter.format(summary.totalLines)} Codex events generated from the local run log.`;
  document.querySelector("#metric-lines").textContent = formatter.format(summary.totalLines);
  document.querySelector("#metric-commands").textContent = formatter.format(summary.commandStats.total);
  document.querySelector("#metric-failures").textContent = formatter.format(failedCommands.length);

  renderBars(document.querySelector("#event-bars"), summary.eventTypes);
  renderCommands(document.querySelector("#commands"), summary.commandExecutions);
  renderTimeline(document.querySelector("#timeline"), summary.timeline);
}

function renderBars(container, counts) {
  const max = Math.max(...counts.map((item) => item.count), 1);
  container.replaceChildren(
    ...counts.map((item) => {
      const row = document.createElement("div");
      row.className = "bar-row";
      row.innerHTML = `
        <span class="bar-label"></span>
        <span class="bar-track"><span class="bar-fill"></span></span>
        <span class="bar-value"></span>
      `;
      row.querySelector(".bar-label").textContent = item.name;
      row.querySelector(".bar-fill").style.width = `${Math.max(8, (item.count / max) * 100)}%`;
      row.querySelector(".bar-value").textContent = formatter.format(item.count);
      return row;
    })
  );
}

function renderCommands(container, commands) {
  if (!commands.length) {
    container.replaceChildren(emptyState("No command executions were present in the log."));
    return;
  }

  container.replaceChildren(
    ...commands.map((command) => {
      const item = document.createElement("li");
      const status = command.exitCode === 0 ? "ok" : command.exitCode === null ? "pending" : "fail";
      item.className = `command command-${status}`;
      item.innerHTML = `
        <code></code>
        <dl>
          <div><dt>Status</dt><dd></dd></div>
          <div><dt>Exit</dt><dd></dd></div>
          <div><dt>Output lines</dt><dd></dd></div>
        </dl>
      `;
      item.querySelector("code").textContent = command.command;
      item.querySelector("dl div:nth-child(1) dd").textContent = command.status;
      item.querySelector("dl div:nth-child(2) dd").textContent = command.exitCode ?? "running";
      item.querySelector("dl div:nth-child(3) dd").textContent = formatter.format(command.outputLines);
      return item;
    })
  );
}

function renderTimeline(container, timeline) {
  container.replaceChildren(
    ...timeline.map((event) => {
      const marker = document.createElement("article");
      marker.className = `timeline-item ${event.eventType.replaceAll(".", "-")}`;
      marker.innerHTML = `
        <span class="line"></span>
        <div>
          <strong></strong>
          <p></p>
        </div>
      `;
      marker.querySelector(".line").textContent = event.line;
      marker.querySelector("strong").textContent = event.eventType;
      marker.querySelector("p").textContent = event.label;
      return marker;
    })
  );
}

function emptyState(message) {
  const element = document.createElement("p");
  element.className = "empty";
  element.textContent = message;
  return element;
}

load()
  .then(render)
  .catch((error) => {
    document.querySelector("#summary").textContent = error.message;
  });
