import { getRequestEvent } from "@builder.io/qwik-city";
import { createQwikCity } from "@builder.io/qwik-city/middleware/node";
import qwikCityPlan from "@qwik-city-plan";
import render from "./entry.ssr";
import { createServer } from "node:http";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

const { router, notFound, staticFile } = createQwikCity({
  render,
  qwikCityPlan,
  static: {
    cacheControl: "public, max-age=31536000, immutable",
  },
});

const server = createServer();

process.on("uncaughtExceptionMonitor", (error, origin) => {
  const requestEv = getRequestEvent();
  if (requestEv) {
    console.error("Unhandled exception during request", {
      origin,
      method: requestEv.method,
      url: requestEv.url.href,
      headersSent: requestEv.headersSent,
      error,
    });
    return;
  }

  console.error("Unhandled exception outside request", { origin, error });
});

server.on("request", (req, res) => {
  staticFile(req, res, () => {
    router(req, res, () => {
      notFound(req, res, () => {});
    });
  });
});

const serverInstance = server.listen(PORT, HOST, () => {
  console.log(`[HoneyBudget] Production server running on http://${HOST}:${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`[HoneyBudget] Received ${signal}, closing server gracefully...`);
  serverInstance.close(() => {
    console.log("[HoneyBudget] Server closed successfully.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
