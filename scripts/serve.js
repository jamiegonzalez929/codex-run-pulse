import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public");
const host = "127.0.0.1";
const requestedPort = Number.parseInt(process.env.PORT ?? "4173", 10);
const maxAttempts = 20;

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"]
]);

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${host}`);
  const pathname = decodeURIComponent(url.pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
  const resolvedPath = path.resolve(root, relativePath);

  if (!resolvedPath.startsWith(`${root}${path.sep}`) && resolvedPath !== root) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(resolvedPath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "content-type": contentTypes.get(path.extname(resolvedPath)) ?? "application/octet-stream"
    });
    response.end(data);
  });
});

listenWithFallback(requestedPort, 0);

function listenWithFallback(port, attempt) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && attempt < maxAttempts) {
      listenWithFallback(port + 1, attempt + 1);
      return;
    }

    throw error;
  });

  server.listen(port, host, () => {
    const address = server.address();
    console.log(`Serving public at http://${host}:${address.port}`);
  });
}
