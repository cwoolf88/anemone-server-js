type DebugListener = () => void;

let manualDebugEnabled = false;
const listeners = new Set<DebugListener>();

function notifyDebugListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

function isDevelopmentEnvironment(): boolean {
  if (typeof process !== "undefined") {
    const env = process.env?.NODE_ENV;
    if (env === "development") return true;
  }
  return false;
}

/** Turn on Anemone embed dev tools in non-development builds. */
export function enableAnemoneDebugMode(): void {
  manualDebugEnabled = true;
  notifyDebugListeners();
}

/** Turn off manually enabled Anemone embed dev tools. */
export function disableAnemoneDebugMode(): void {
  manualDebugEnabled = false;
  notifyDebugListeners();
}

/** True in development or after {@link enableAnemoneDebugMode}. */
export function isAnemoneDebugModeEnabled(): boolean {
  return manualDebugEnabled || isDevelopmentEnvironment();
}

export function subscribeAnemoneDebugMode(listener: DebugListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
