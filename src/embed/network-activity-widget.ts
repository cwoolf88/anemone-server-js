import { resolveProductDisplayName } from "../branding.js";
import { injectWidgetStyles } from "./widget-styles.js";
import { NetworkActivityLog } from "./network-activity.js";
import { renderNetworkActivityWidget } from "./network-activity-widget-render.js";
import type { NetworkActivitySortDirection } from "./network-activity-widget-render.js";

export type AnemoneNetworkActivityWidgetOptions = {
  mount: HTMLElement | string;
  /** Shared log instance — create one and pass to {@link createLoggedFetch} helpers in your app. */
  log?: NetworkActivityLog;
  injectStyles?: boolean;
  maxEntries?: number;
  /** Whether the console body is visible. Default false (collapsed). */
  defaultExpanded?: boolean;
  /** Product display name. Blank values fall back to "Anemone". */
  productName?: string;
};

export type AnemoneNetworkActivityWidgetHandle = {
  getLog(): NetworkActivityLog;
  isExpanded(): boolean;
  setExpanded(expanded: boolean): void;
  toggleExpanded(): void;
  clear(): void;
  destroy(): void;
};

function resolveMount(mount: HTMLElement | string): HTMLElement {
  if (typeof mount !== "string") return mount;
  const el = document.querySelector<HTMLElement>(mount);
  if (!el) {
    throw new Error(`Anemone network activity widget mount not found: ${mount}`);
  }
  return el;
}

function countExchanges(exchanges: ReturnType<NetworkActivityLog["getExchanges"]>): number {
  return exchanges.reduce(
    (count, exchange) => count + 1 + countExchanges(exchange.children ?? []),
    0,
  );
}

function scrollNetworkActivityToBottom(container: HTMLElement): void {
  const scrollTargets = container.querySelectorAll<HTMLElement>(
    ".an-network-activity .an-dev-widget__body, .an-network-console",
  );
  for (const target of scrollTargets) {
    target.scrollTop = target.scrollHeight;
  }
}

/**
 * Dev console for viewing grouped integration HTTP exchanges (request + response JSON).
 */
export function createAnemoneNetworkActivityWidget(
  options: AnemoneNetworkActivityWidgetOptions,
): AnemoneNetworkActivityWidgetHandle {
  if (typeof document === "undefined") {
    throw new Error("createAnemoneNetworkActivityWidget requires a browser DOM");
  }

  if (options.injectStyles !== false) {
    injectWidgetStyles();
  }

  const log = options.log ?? new NetworkActivityLog();
  const container = resolveMount(options.mount);
  container.classList.add("an-widget-host", "an-network-activity-host");
  const productName = resolveProductDisplayName(options.productName);
  let expanded = options.defaultExpanded ?? false;
  let sortDirection: NetworkActivitySortDirection = "oldest";
  let selectedExchangeId: string | undefined;
  let previousRequestCount: number | undefined;

  function paint(): void {
    const hadOpenRequest = container.querySelector(".an-network-console__summary-details[open]") != null;
    let exchanges = log.getExchanges();
    if (options.maxEntries != null && options.maxEntries > 0) {
      exchanges = exchanges.slice(0, options.maxEntries);
    }
    const requestCount = countExchanges(exchanges);
    const shouldScrollToBottom =
      expanded &&
      sortDirection === "oldest" &&
      previousRequestCount != null &&
      requestCount > previousRequestCount &&
      !hadOpenRequest;

    renderNetworkActivityWidget(container, {
      exchanges,
      expanded,
      sortDirection,
      selectedExchangeId,
      productName,
      onToggleExpanded: () => {
        expanded = !expanded;
        paint();
      },
      onToggleSortDirection: () => {
        sortDirection = sortDirection === "newest" ? "oldest" : "newest";
        paint();
      },
      onClear: () => {
        selectedExchangeId = undefined;
        log.clear();
      },
      onOpenDetails: (exchangeId) => {
        selectedExchangeId = exchangeId;
        paint();
      },
      onCloseDetails: () => {
        selectedExchangeId = undefined;
        paint();
      },
    });
    if (shouldScrollToBottom) {
      scrollNetworkActivityToBottom(container);
    }
    previousRequestCount = requestCount;
  }

  const unsubscribe = log.subscribe(paint);
  paint();

  return {
    getLog: () => log,
    isExpanded: () => expanded,
    setExpanded(next) {
      expanded = next;
      paint();
    },
    toggleExpanded: () => {
      expanded = !expanded;
      paint();
    },
    clear: () => log.clear(),
    destroy() {
      unsubscribe();
      container.replaceChildren();
      container.classList.remove("an-widget-host", "an-network-activity-host");
    },
  };
}
