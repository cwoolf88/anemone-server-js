import {
  contactSyncDisplayCopy,
  resolveProductDisplayName,
} from "../branding.js";
import type { ContactSyncDisplayState } from "../sync.js";
import {
  connectionStatusTooltip,
  connectionSubtitle,
  disconnectButtonLabel,
  sessionPollRefreshLabel,
  settingsButtonLabel,
} from "./connection-copy.js";
import type { SessionPollState, WidgetConnectionView } from "./types.js";
import { shouldShowSessionPollRefresh } from "./integration.js";

export type ConnectionWidgetActions = {
  onConnectAccount: () => void;
  onDisconnect: () => void;
  onOpenSettings: () => void;
  onRetryConnectSession?: () => void;
};

export type SyncWidgetActions = {
  onRetry?: () => void;
  retryDisabled?: boolean;
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function ghostLine(widthClass: string): HTMLDivElement {
  const line = el("div", `an-widget__ghost-line ${widthClass}`);
  line.setAttribute("aria-hidden", "true");
  return line;
}

function renderConnectionGhost(section: HTMLElement, productName: string): void {
  const ghost = el("div", "an-widget__ghost");
  ghost.setAttribute("aria-hidden", "true");

  const header = el("div", "an-widget__ghost-header");
  const top = el("div", "an-widget__header-top");
  const copy = el("div", "an-widget__ghost-copy");
  copy.appendChild(ghostLine("an-widget__ghost-line--title"));
  copy.appendChild(ghostLine("an-widget__ghost-line--subtitle"));
  top.appendChild(copy);
  const slot = el("div", "an-widget__connection-status-slot");
  slot.appendChild(el("div", "an-widget__ghost-icon"));
  top.appendChild(slot);
  header.appendChild(top);
  header.appendChild(el("div", "an-widget__ghost-pill"));
  ghost.appendChild(header);

  const footer = el("div", "an-widget__ghost-footer");
  footer.appendChild(el("div", "an-widget__ghost-btn"));
  ghost.appendChild(footer);

  section.appendChild(ghost);

  const sr = el("span", "an-widget__ghost-sr", `Loading ${productName}…`);
  section.appendChild(sr);
}

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function strokeIcon(attrs: Record<string, string>): SVGElement {
  const node = svgEl(attrs.tag as "path" | "circle" | "line" | "polyline");
  for (const [key, value] of Object.entries(attrs)) {
    if (key !== "tag") {
      node.setAttribute(key, value);
    }
  }
  node.setAttribute("fill", "none");
  node.setAttribute("stroke", "currentColor");
  node.setAttribute("stroke-width", "2");
  node.setAttribute("stroke-linecap", "round");
  node.setAttribute("stroke-linejoin", "round");
  return node;
}

/** Checkmark — color from parent (success when connected, muted when not). */
function appendCheckmarkIcon(svg: SVGSVGElement): void {
  const check = strokeIcon({
    tag: "path",
    d: "M20 6L9 17l-5-5",
  });
  check.setAttribute("stroke-width", "2");
  svg.append(check);
}

function appendSettingsGearIcon(svg: SVGSVGElement): void {
  const gear = strokeIcon({
    tag: "path",
    d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
  });
  gear.setAttribute("stroke-width", "1.75");
  svg.append(gear);
  const hub = strokeIcon({
    tag: "circle",
    cx: "12",
    cy: "12",
    r: "3",
  });
  hub.setAttribute("stroke-width", "1.75");
  svg.append(hub);
}

function appendSettingsButton(
  container: HTMLElement,
  view: WidgetConnectionView,
  onOpenSettings: () => void,
  productName: string,
): void {
  if (!view.signedIntoPrimary) return;

  const label = settingsButtonLabel(true, productName);
  const btn = el("button", "an-widget__settings-btn");
  btn.type = "button";
  btn.setAttribute("aria-label", label);
  btn.title = label;
  btn.disabled = view.statusLoading;

  const svg = createConnectionStatusSvg(16);
  svg.setAttribute("class", "an-widget__settings-icon");
  appendSettingsGearIcon(svg);
  btn.appendChild(svg);
  btn.addEventListener("click", onOpenSettings);
  container.appendChild(btn);
}

function appendRefreshIcon(svg: SVGSVGElement): void {
  const path = strokeIcon({
    tag: "path",
    d: "M21 12a9 9 0 1 1-2.64-6.36",
  });
  svg.append(path);
  const head = strokeIcon({
    tag: "polyline",
    points: "21 3 21 9 15 9",
  });
  svg.append(head);
}

function appendSessionPollRefreshButton(
  container: HTMLElement,
  poll: SessionPollState,
  onRetry: () => void
): void {
  const label = sessionPollRefreshLabel(poll.phase);
  const btn = el("button", "an-widget__session-refresh-btn");
  btn.type = "button";
  btn.setAttribute("aria-label", label);
  btn.title = label;

  const svg = createConnectionStatusSvg(16);
  svg.setAttribute("class", "an-widget__session-refresh-icon");
  appendRefreshIcon(svg);
  btn.appendChild(svg);
  btn.addEventListener("click", onRetry);
  container.appendChild(btn);
}

const LOADING_RIPPLE_COUNT = 4;
const LOADING_RIPPLE_DUR_S = 4;

function rippleAnimate(
  attributeName: string,
  from: string,
  to: string,
  begin: string
): SVGAnimateElement {
  const anim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
  anim.setAttribute("attributeName", attributeName);
  anim.setAttribute("from", from);
  anim.setAttribute("to", to);
  anim.setAttribute("dur", `${LOADING_RIPPLE_DUR_S}s`);
  anim.setAttribute("begin", begin);
  anim.setAttribute("repeatCount", "indefinite");
  return anim;
}

/** Low at birth → brighter mid-expand → fade to 0 at the clip edge. */
function rippleOpacityAnimate(begin: string): SVGAnimateElement {
  const anim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
  anim.setAttribute("attributeName", "opacity");
  anim.setAttribute("values", "0.22;0.62;0");
  anim.setAttribute("keyTimes", "0;0.42;1");
  anim.setAttribute("dur", `${LOADING_RIPPLE_DUR_S}s`);
  anim.setAttribute("begin", begin);
  anim.setAttribute("repeatCount", "indefinite");
  return anim;
}

/** Concentric rings expanding from the icon center until clipped at the edge. */
function appendLoadingPulse(svg: SVGSVGElement): void {
  const clipId = `an-ripple-clip-${Math.random().toString(36).slice(2, 9)}`;
  const defs = svgEl("defs");
  const clipPath = svgEl("clipPath");
  clipPath.setAttribute("id", clipId);
  const clipCircle = svgEl("circle");
  clipCircle.setAttribute("cx", "12");
  clipCircle.setAttribute("cy", "12");
  clipCircle.setAttribute("r", "12");
  clipPath.appendChild(clipCircle);
  defs.appendChild(clipPath);
  svg.appendChild(defs);

  const ripples = svgEl("g");
  ripples.setAttribute("class", "an-widget__connection-status-ripples");
  ripples.setAttribute("clip-path", `url(#${clipId})`);

  for (let i = 0; i < LOADING_RIPPLE_COUNT; i++) {
    const begin = `${((i * LOADING_RIPPLE_DUR_S) / LOADING_RIPPLE_COUNT).toFixed(2)}s`;
    const circle = svgEl("circle");
    circle.setAttribute("class", "an-widget__connection-status-ripple");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "0.5");
    circle.appendChild(rippleAnimate("r", "0.5", "11.5", begin));
    circle.appendChild(rippleOpacityAnimate(begin));
    ripples.appendChild(circle);
  }
  svg.appendChild(ripples);

  const hub = svgEl("circle");
  hub.setAttribute("class", "an-widget__connection-status-ripple-hub");
  hub.setAttribute("cx", "12");
  hub.setAttribute("cy", "12");
  hub.setAttribute("r", "1.25");
  svg.appendChild(hub);
}

function createConnectionStatusSvg(sizePx: number): SVGSVGElement {
  const svg = svgEl("svg");
  svg.setAttribute("class", "an-widget__connection-status-icon");
  svg.setAttribute("width", String(sizePx));
  svg.setAttribute("height", String(sizePx));
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  return svg;
}

function appendConnectionStatusIcon(
  slot: HTMLElement,
  view: WidgetConnectionView,
  mockMode: boolean,
  productName: string,
): void {
  const connected = view.connected;
  const tooltip = connectionStatusTooltip(view, mockMode, productName);
  const status = el("span", "an-widget__connection-status");
  status.tabIndex = 0;
  status.setAttribute("role", "status");
  status.setAttribute("data-na-tooltip", tooltip);
  status.setAttribute("aria-label", tooltip);

  const svg = createConnectionStatusSvg(16);

  if (view.statusLoading) {
    status.classList.add("an-widget__connection-status--loading");
    appendLoadingPulse(svg);
  } else {
    status.classList.add(
      connected ? "an-widget__connection-status--connected" : "an-widget__connection-status--disconnected"
    );
    appendCheckmarkIcon(svg);
  }

  status.appendChild(svg);
  slot.replaceChildren(status);
}

function renderSyncBlockInto(
  parent: HTMLElement,
  state: ContactSyncDisplayState,
  syncActions: SyncWidgetActions,
  productName?: string,
): void {
  if (state.status === "idle") return;

  const copy = contactSyncDisplayCopy(productName);
  const block = el("div", "an-widget__sync");

  if (state.status === "syncing") {
    block.classList.add("an-widget__sync--syncing");
    block.setAttribute("role", "status");
    block.setAttribute("aria-live", "polite");
    block.appendChild(el("p", "an-widget__sync-title", copy.syncing));
  } else if (state.status === "synced") {
    block.classList.add("an-widget__sync--synced");
    block.setAttribute("role", "status");
    block.appendChild(el("p", "an-widget__sync-title", copy.synced));
  } else if (state.status === "queued") {
    block.classList.add("an-widget__sync--queued");
    block.setAttribute("role", "status");
    block.appendChild(el("p", "an-widget__sync-title", copy.queuedTitle));
    block.appendChild(el("p", undefined, copy.queuedBody));
  } else {
    block.classList.add("an-widget__sync--failed");
    block.setAttribute("role", "alert");
    block.setAttribute("aria-live", "assertive");
    block.appendChild(el("p", "an-widget__sync-title", copy.failedTitle));
    block.appendChild(
      el(
        "p",
        undefined,
        state.httpStatus != null
          ? copy.failedWithStatus(state.httpStatus)
          : copy.failedBody,
      ),
    );
    if (state.retryable && syncActions.onRetry) {
      const row = el("div", "an-widget__sync-actions");
      const retry = el("button", "an-widget__retry", "Try again");
      retry.type = "button";
      retry.disabled = !!syncActions.retryDisabled;
      retry.addEventListener("click", syncActions.onRetry);
      row.appendChild(retry);
      block.appendChild(row);
    }
    const details = el("details", "an-widget__details");
    const summary = el("summary", "an-widget__details-summary", "Error details");
    details.appendChild(summary);
    details.appendChild(el("p", "an-widget__error-message", state.errorMessage));
    block.appendChild(details);
  }

  parent.appendChild(block);
}

/** Renders sync status inside a widget host (for custom connection UIs). */
export function renderSyncBlock(
  host: HTMLElement,
  state: ContactSyncDisplayState,
  syncActions: SyncWidgetActions,
  productName?: string,
): void {
  host.replaceChildren();
  renderSyncBlockInto(host, state, syncActions, productName);
}

export function renderConnectionSection(
  host: HTMLElement,
  view: WidgetConnectionView,
  tenantName: string,
  actions: ConnectionWidgetActions,
  sessionPoll: SessionPollState = { active: false, timedOut: false, phase: null },
  syncState: ContactSyncDisplayState | null = null,
  syncActions: SyncWidgetActions = {},
  productName?: string,
): void {
  const product = resolveProductDisplayName(productName);
  const section = el("section", "an-widget an-widget__connection");
  section.setAttribute("aria-label", product);

  if (view.loading) {
    section.setAttribute("aria-busy", "true");
    renderConnectionGhost(section, product);
    host.replaceChildren(section);
    return;
  }
  section.removeAttribute("aria-busy");

  if (!view.info) {
    const unavailable = el("section", "an-widget__connection-unavailable");
    unavailable.setAttribute("aria-label", product);
    unavailable.setAttribute("role", "alert");
    unavailable.appendChild(
      el("p", undefined, view.error ?? "Tenant connection unavailable.")
    );
    host.replaceChildren(unavailable);
    return;
  }

  const info = view.info;
  const header = el("div", "an-widget__header");
  const top = el("div", "an-widget__header-top");
  const copy = el("div", "an-widget__copy");
  copy.appendChild(el("h2", "an-widget__title", product));
  copy.appendChild(
    el("p", "an-widget__subtitle", connectionSubtitle(view, tenantName, product)),
  );
  top.appendChild(copy);

  const headerActions = el("div", "an-widget__header-actions");
  const connectionSlot = el("div", "an-widget__connection-status-slot");
  appendConnectionStatusIcon(connectionSlot, view, info.mockMode, product);
  headerActions.appendChild(connectionSlot);
  if (
    shouldShowSessionPollRefresh(view, sessionPoll) &&
    actions.onRetryConnectSession
  ) {
    appendSessionPollRefreshButton(
      headerActions,
      sessionPoll,
      actions.onRetryConnectSession
    );
  }
  top.appendChild(headerActions);
  header.appendChild(top);

  if (!info.mockMode && view.signedIntoPrimary) {
    const signInBadge = el("span", "an-widget__badge an-widget__badge--signed-in");
    signInBadge.textContent = view.primaryEmail
      ? `Signed in as ${view.primaryEmail}`
      : "Signed in";
    header.appendChild(signInBadge);
  }
  if (view.autoConnected) {
    header.appendChild(el("span", "an-widget__badge an-widget__badge--auto", "Auto-connected"));
  }

  section.appendChild(header);

  if (view.error) {
    section.appendChild(el("p", "an-widget__error", view.error));
  }

  const footer = el("div", "an-widget__footer");
  const actionsRow = el("div", "an-widget__actions");

  if (view.connected && !view.signedIntoPrimary) {
    const btn = el("button", "an-widget__btn an-widget__btn--primary", "Sign in");
    btn.type = "button";
    btn.disabled = !info.connectSignInUrl || view.statusLoading;
    btn.addEventListener("click", actions.onConnectAccount);
    actionsRow.appendChild(btn);
  } else if (view.connected) {
    const btn = el("button", "an-widget__btn an-widget__btn--secondary", "Disconnect account");
    btn.type = "button";
    btn.disabled = !info.disconnectUrl || (!view.signedIntoPrimary && !info.disconnectSignInUrl);
    if (!view.signedIntoPrimary && info.disconnectSignInUrl) {
      btn.textContent = disconnectButtonLabel(false, true);
    }
    btn.addEventListener("click", actions.onDisconnect);
    actionsRow.appendChild(btn);
  } else {
    const btn = el("button", "an-widget__btn an-widget__btn--primary", "Connect account");
    btn.type = "button";
    const canConnect = view.signedIntoPrimary
      ? !!info.connectUrl
      : !!info.connectSignInUrl;
    btn.disabled = !canConnect || view.statusLoading;
    btn.addEventListener("click", actions.onConnectAccount);
    actionsRow.appendChild(btn);
    if (!info.connectSignInUrl) {
      const hint = el(
        "p",
        "an-widget__hint",
        "Set ANEMONE_PRIMARY_BASE_URL to enable sign-in."
      );
      actionsRow.appendChild(hint);
    }
  }

  footer.appendChild(actionsRow);

  if (info.primaryBaseUrl && !info.mockMode) {
    appendSettingsButton(footer, view, actions.onOpenSettings, product);
  }

  section.appendChild(footer);

  if (syncState) {
    renderSyncBlockInto(section, syncState, syncActions, product);
  }

  host.replaceChildren(section);
}

export function renderWidget(
  host: HTMLElement,
  connection: WidgetConnectionView,
  tenantName: string,
  connectionActions: ConnectionWidgetActions,
  syncState: ContactSyncDisplayState | null,
  syncActions: SyncWidgetActions,
  sessionPoll: SessionPollState = { active: false, timedOut: false, phase: null },
  productName?: string,
): void {
  renderConnectionSection(
    host,
    connection,
    tenantName,
    connectionActions,
    sessionPoll,
    syncState,
    syncActions,
    productName,
  );
}
