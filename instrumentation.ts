export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { reportError } = await import("@/lib/monitoring/report-error");

    process.on("unhandledRejection", (reason) => {
      void reportError(reason, { source: "unhandledRejection" });
    });

    process.on("uncaughtException", (error) => {
      void reportError(error, { source: "uncaughtException" });
    });
  }
}
