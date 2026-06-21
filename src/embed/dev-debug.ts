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

/** Turn on NextAddress embed dev tools in non-development builds. */
export function enableNextAddressDebugMode(): void {
  manualDebugEnabled = true;
  notifyDebugListeners();
}

/** Turn off manually enabled NextAddress embed dev tools. */
export function disableNextAddressDebugMode(): void {
  manualDebugEnabled = false;
  notifyDebugListeners();
}

/** True in development or after {@link enableNextAddressDebugMode}. */
export function isNextAddressDebugModeEnabled(): boolean {
  return manualDebugEnabled || isDevelopmentEnvironment();
}

export function subscribeNextAddressDebugMode(listener: DebugListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
