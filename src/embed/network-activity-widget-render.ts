import { appendDevWidgetChevron } from "./dev-widget-helpers.js";
import { formatNetworkJson } from "./network-activity.js";
import type { NetworkActivityExchange } from "./network-activity.js";

export type NetworkActivitySortDirection = "newest" | "oldest";

export type NetworkActivityWidgetView = {
  exchanges: NetworkActivityExchange[];
  expanded: boolean;
  sortDirection: NetworkActivitySortDirection;
  selectedExchangeId?: string;
  onToggleExpanded: () => void;
  onToggleSortDirection: () => void;
  onClear: () => void;
  onOpenDetails: (exchangeId: string) => void;
  onCloseDetails: () => void;
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function statusClass(status: number | undefined, error?: string): string {
  if (error) return "na-network-console__status na-network-console__status--error";
  if (status == null) return "na-network-console__status";
  if (status >= 200 && status < 300) return "na-network-console__status na-network-console__status--ok";
  if (status >= 400) return "na-network-console__status na-network-console__status--error";
  return "na-network-console__status na-network-console__status--warn";
}

function renderBlock(
  title: string,
  className: string,
  content: string,
): HTMLDivElement {
  const block = el("div", "na-network-console__block");
  block.appendChild(el("p", "na-network-console__block-title", title));
  const pre = el("pre", className);
  pre.textContent = content || "(empty)";
  block.appendChild(pre);
  return block;
}

function normalizeTreeValue(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function isTreeValue(value: unknown): value is Record<string, unknown> | unknown[] {
  return typeof value === "object" && value !== null;
}

function treeEntries(value: Record<string, unknown> | unknown[]): [string, unknown][] {
  if (Array.isArray(value)) {
    return value.map((entry, index) => [String(index), entry]);
  }
  return Object.entries(value);
}

function treeSummary(value: Record<string, unknown> | unknown[]): string {
  const count = treeEntries(value).length;
  if (Array.isArray(value)) return `Array(${count})`;
  return count === 1 ? "1 key" : `${count} keys`;
}

function primitiveValue(value: unknown): string {
  if (value === undefined) return "(empty)";
  if (value === null) return "null";
  if (typeof value === "string") return value === "" ? "(empty string)" : value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  return formatNetworkJson(value);
}

function renderTreeValue(value: unknown): HTMLElement {
  const normalized = normalizeTreeValue(value);
  if (!isTreeValue(normalized)) {
    return el("span", "na-network-console__tree-primitive", primitiveValue(normalized));
  }

  const details = el("details", "na-network-console__tree-details");
  const summary = el("summary", "na-network-console__tree-summary", treeSummary(normalized));
  details.appendChild(summary);
  details.appendChild(renderTreeTable(normalized));
  return details;
}

function renderTreeTable(value: Record<string, unknown> | unknown[]): HTMLTableElement {
  const table = el("table", "na-network-console__tree-table");
  const tbody = el("tbody");
  const entries = treeEntries(value);

  if (entries.length === 0) {
    const row = el("tr");
    const empty = el("td", "na-network-console__tree-empty", "(empty)");
    empty.colSpan = 2;
    row.appendChild(empty);
    tbody.appendChild(row);
  }

  for (const [key, entryValue] of entries) {
    const row = el("tr");
    row.appendChild(el("th", "na-network-console__tree-key", key));
    const valueCell = el("td", "na-network-console__tree-value");
    valueCell.appendChild(renderTreeValue(entryValue));
    row.appendChild(valueCell);
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  return table;
}

function renderTreeBlock(title: string, value: unknown): HTMLDivElement {
  const block = el("div", "na-network-console__block");
  block.appendChild(el("p", "na-network-console__block-title", title));
  const tree = el("div", "na-network-console__tree");
  const normalized = normalizeTreeValue(value);
  if (isTreeValue(normalized)) {
    tree.appendChild(renderTreeTable(normalized));
  } else {
    tree.appendChild(renderTreeValue(normalized));
  }
  block.appendChild(tree);
  return block;
}

function endpointFromUrl(url: string): string {
  try {
    const parsed = new URL(url, typeof window === "undefined" ? undefined : window.location.href);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

function responseLabel(exchange: NetworkActivityExchange): string {
  if (exchange.response) {
    return `${exchange.response.status}${exchange.response.statusText ? ` ${exchange.response.statusText}` : ""}`;
  }
  if (exchange.error) return "Failed";
  return "Pending";
}

function exchangeTime(exchange: NetworkActivityExchange): number {
  return new Date(exchange.completedAt ?? exchange.startedAt).getTime();
}

function exchangeDate(exchange: NetworkActivityExchange): Date | undefined {
  const time = exchangeTime(exchange);
  if (!Number.isFinite(time)) return undefined;
  return new Date(time);
}

function formatExchangeTimestamp(exchange: NetworkActivityExchange): string {
  const date = exchangeDate(exchange);
  if (!date) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatExchangeTimestampTooltip(exchange: NetworkActivityExchange): string {
  const date = exchangeDate(exchange);
  if (!date) return "";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

function methodClass(method: string): string {
  const normalized = method.trim().toLowerCase();
  if (/^[a-z]+$/.test(normalized)) {
    return `na-network-console__method--${normalized}`;
  }
  return "na-network-console__method--other";
}

function findExchange(
  exchanges: NetworkActivityExchange[],
  id: string | undefined,
): NetworkActivityExchange | undefined {
  if (!id) return undefined;
  for (const exchange of exchanges) {
    if (exchange.id === id) return exchange;
    const child = findExchange(exchange.children ?? [], id);
    if (child) return child;
  }
  return undefined;
}

function flattenExchanges(exchanges: NetworkActivityExchange[]): NetworkActivityExchange[] {
  const flattened: NetworkActivityExchange[] = [];
  for (const exchange of exchanges) {
    flattened.push(exchange);
    if (exchange.children?.length) {
      flattened.push(...flattenExchanges(exchange.children));
    }
  }
  return flattened;
}

function sortExchanges(
  exchanges: NetworkActivityExchange[],
  direction: NetworkActivitySortDirection,
): NetworkActivityExchange[] {
  const multiplier = direction === "newest" ? -1 : 1;
  return [...exchanges].sort((a, b) => {
    const aTime = exchangeTime(a);
    const bTime = exchangeTime(b);
    if (!Number.isFinite(aTime) && !Number.isFinite(bTime)) return 0;
    if (!Number.isFinite(aTime)) return 1;
    if (!Number.isFinite(bTime)) return -1;
    return (aTime - bTime) * multiplier;
  });
}

function renderRawExchange(
  exchange: NetworkActivityExchange,
  depth = 0,
): HTMLElement {
  const wrap = el("article", "na-network-console__exchange");
  if (depth > 0) {
    wrap.classList.add("na-network-console__exchange--nested");
    wrap.style.setProperty("--na-network-depth", String(depth));
  }

  const head = el("div", "na-network-console__exchange-head");
  const meta = el("div", "na-network-console__meta");

  const label = el("span", "na-network-console__label", exchange.label);
  meta.appendChild(label);

  const verb = el(
    "span",
    "na-network-console__verb",
    `${exchange.request.method} ${exchange.request.url}`,
  );
  meta.appendChild(verb);

  if (exchange.response) {
    const status = el(
      "span",
      statusClass(exchange.response.status),
      `${exchange.response.status}${exchange.response.statusText ? ` ${exchange.response.statusText}` : ""}`,
    );
    meta.appendChild(status);
  } else if (exchange.error) {
    meta.appendChild(el("span", statusClass(undefined, exchange.error), "Failed"));
  }

  if (exchange.durationMs != null) {
    meta.appendChild(el("span", "na-network-console__timing", `${exchange.durationMs}ms`));
  }

  head.appendChild(meta);
  wrap.appendChild(head);

  const body = el("div", "na-network-console__exchange-body");
  body.appendChild(
    renderBlock(
      "Request",
      "na-network-console__pre na-network-console__pre--request",
      [
        formatNetworkJson(exchange.request.headers),
        formatNetworkJson(exchange.request.body),
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );

  if (exchange.response) {
    body.appendChild(
      renderBlock(
        "Response",
        "na-network-console__pre na-network-console__pre--response",
        [
          formatNetworkJson(exchange.response.headers),
          formatNetworkJson(exchange.response.body),
        ]
          .filter(Boolean)
          .join("\n\n"),
      ),
    );
  } else if (exchange.error) {
    body.appendChild(
      renderBlock("Error", "na-network-console__pre na-network-console__pre--error", exchange.error),
    );
  }

  wrap.appendChild(body);

  if (exchange.children?.length) {
    const nested = el("div", "na-network-console__children");
    for (const child of exchange.children) {
      nested.appendChild(renderRawExchange(child, depth + 1));
    }
    wrap.appendChild(nested);
  }

  return wrap;
}

function renderExchangeSummary(
  exchange: NetworkActivityExchange,
  view: NetworkActivityWidgetView,
): HTMLElement {
  const wrap = el("article", "na-network-console__exchange na-network-console__exchange--summary");
  const details = el("details", "na-network-console__summary-details");

  const head = el("summary", "na-network-console__exchange-head");
  const meta = el("div", "na-network-console__meta");
  meta.appendChild(
    el("span", `na-network-console__method ${methodClass(exchange.request.method)}`, exchange.request.method),
  );
  meta.appendChild(el("span", "na-network-console__endpoint", endpointFromUrl(exchange.request.url)));
  meta.appendChild(el("span", statusClass(exchange.response?.status, exchange.error), responseLabel(exchange)));
  const timestamp = formatExchangeTimestamp(exchange);
  if (timestamp) {
    const timestampEl = el("time", "na-network-console__timestamp", timestamp);
    timestampEl.title = formatExchangeTimestampTooltip(exchange);
    timestampEl.dateTime = exchange.completedAt ?? exchange.startedAt;
    meta.appendChild(timestampEl);
  }
  head.appendChild(meta);

  const detailBtn = el("button", "na-network-console__details", "View raw data");
  detailBtn.type = "button";
  detailBtn.setAttribute("aria-label", `View raw data for ${exchange.request.method} ${exchange.request.url}`);
  detailBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    view.onOpenDetails(exchange.id);
  });
  head.appendChild(detailBtn);
  const chevron = appendDevWidgetChevron(head);
  chevron.classList.add("na-network-console__summary-chevron");
  details.appendChild(head);

  const body = el("div", "na-network-console__summary-body");
  body.appendChild(
    renderBlock(
      "Payload",
      "na-network-console__pre na-network-console__pre--request",
      formatNetworkJson(exchange.request.body),
    ),
  );
  if (exchange.response) {
    body.appendChild(renderTreeBlock("Response Body", exchange.response.body));
  } else if (exchange.error) {
    body.appendChild(
      renderBlock("Error", "na-network-console__pre na-network-console__pre--error", exchange.error),
    );
  }
  details.appendChild(body);
  wrap.appendChild(details);

  return wrap;
}

function renderDetailsModal(
  exchange: NetworkActivityExchange,
  view: NetworkActivityWidgetView,
): HTMLElement {
  const backdrop = el("div", "na-network-console-modal");
  backdrop.setAttribute("role", "presentation");
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) view.onCloseDetails();
  });

  const dialog = el("div", "na-network-console-modal__dialog");
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", `Raw network data for ${exchange.label}`);

  const header = el("div", "na-network-console-modal__header");
  const title = el("div", "na-network-console-modal__title");
  title.appendChild(el("span", "na-network-console__label", exchange.label));
  title.appendChild(el("span", "na-network-console__verb", `${exchange.request.method} ${exchange.request.url}`));
  header.appendChild(title);

  const closeBtn = el("button", "na-network-console-modal__close", "Close");
  closeBtn.type = "button";
  closeBtn.addEventListener("click", view.onCloseDetails);
  header.appendChild(closeBtn);
  dialog.appendChild(header);

  const consoleEl = el("div", "na-network-console na-network-console--modal");
  consoleEl.appendChild(renderRawExchange(exchange));
  dialog.appendChild(consoleEl);
  backdrop.appendChild(dialog);
  return backdrop;
}

export function renderNetworkActivityWidget(
  host: HTMLElement,
  view: NetworkActivityWidgetView,
): void {
  const section = el("section", "na-network-activity na-widget na-dev-widget");
  if (!view.expanded) {
    section.classList.add("na-dev-widget--collapsed");
  }
  section.setAttribute("aria-label", "NextAddress network activity");

  const header = el("div", "na-dev-widget__header");
  const toggleBtn = el("button", "na-dev-widget__toggle", "");
  toggleBtn.type = "button";
  toggleBtn.setAttribute("aria-expanded", view.expanded ? "true" : "false");
  toggleBtn.setAttribute(
    "aria-label",
    view.expanded ? "Collapse network activity" : "Expand network activity",
  );
  toggleBtn.addEventListener("click", view.onToggleExpanded);

  const toggleCopy = el("span", "na-dev-widget__toggle-copy");
  toggleCopy.appendChild(el("h3", "na-dev-widget__title", "Network activity"));
  toggleCopy.appendChild(el("span", "na-dev-widget__badge na-dev-widget__badge--amber", "Dev only"));
  if (view.exchanges.length > 0) {
    const requestCount = flattenExchanges(view.exchanges).length;
    const countLabel =
      requestCount === 1 ? "1 request" : `${requestCount} requests`;
    toggleCopy.appendChild(el("span", "na-dev-widget__count", countLabel));
  }
  toggleBtn.appendChild(toggleCopy);
  appendDevWidgetChevron(toggleBtn);
  header.appendChild(toggleBtn);
  section.appendChild(header);

  const body = el("div", "na-dev-widget__body");
  if (!view.expanded) {
    body.hidden = true;
  }

  body.appendChild(
    el(
      "p",
      "na-dev-widget__subtitle",
      "Integration requests and responses, grouped with downstream primary API calls.",
    ),
  );

  const toolbar = el("div", "na-network-activity__toolbar");
  const sortBtn = el(
    "button",
    "na-network-activity__sort",
    view.sortDirection === "newest" ? "Newest first" : "Oldest first",
  );
  sortBtn.type = "button";
  sortBtn.setAttribute(
    "aria-label",
    view.sortDirection === "newest"
      ? "Sort network requests oldest first"
      : "Sort network requests newest first",
  );
  sortBtn.addEventListener("click", view.onToggleSortDirection);
  toolbar.appendChild(sortBtn);

  const clearBtn = el("button", "na-network-activity__clear", "Clear log");
  clearBtn.type = "button";
  clearBtn.addEventListener("click", view.onClear);
  toolbar.appendChild(clearBtn);
  body.appendChild(toolbar);

  const consoleEl = el("div", "na-network-console");
  consoleEl.setAttribute("role", "log");
  consoleEl.setAttribute("aria-live", "polite");
  consoleEl.setAttribute("aria-relevant", "additions");

  if (view.exchanges.length === 0) {
    consoleEl.appendChild(
      el(
        "p",
        "na-network-console__empty",
        "No network activity yet. Connect, save contact info, or run a simulation to populate the log.",
      ),
    );
  } else {
    for (const exchange of sortExchanges(flattenExchanges(view.exchanges), view.sortDirection)) {
      consoleEl.appendChild(renderExchangeSummary(exchange, view));
    }
  }

  body.appendChild(consoleEl);
  section.appendChild(body);
  const selectedExchange = findExchange(view.exchanges, view.selectedExchangeId);
  if (selectedExchange) {
    section.appendChild(renderDetailsModal(selectedExchange, view));
  }
  host.replaceChildren(section);
}
