import type { Analytics } from "@/wab/shared/analytics/Analytics";
import { ConsoleLogAnalytics } from "@/wab/shared/analytics/ConsoleLogAnalytics";
import { ensure } from "@/wab/shared/common";

let globalAnalytics: Analytics;

export function analytics(): Analytics {
  return new ConsoleLogAnalytics();
  return globalAnalytics;
}

export function initBrowserAnalytics(analyticsInstance: Analytics) {
  console.log(
    "🚀 ~ initBrowserAnalytics ~ analyticsInstance:",
    analyticsInstance
  );
  ensure(globalAnalytics === undefined, "Cannot initialize analytics twice");
  globalAnalytics = analyticsInstance;
}
