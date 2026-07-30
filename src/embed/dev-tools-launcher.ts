import { createAnemoneNetworkActivityWidget } from "./network-activity-widget.js";
import type { AnemoneNetworkActivityWidgetHandle } from "./network-activity-widget.js";
import { createAnemoneSimulationWidget } from "./simulation-widget.js";
import type {
  AnemoneSimulationWidgetHandle,
  AnemoneSimulationWidgetOptions,
} from "./simulation-widget.js";
import type { AnemoneNetworkActivityWidgetOptions } from "./network-activity-widget.js";
import {
  isAnemoneDebugModeEnabled,
  subscribeAnemoneDebugMode,
} from "./dev-debug.js";
import { injectWidgetStyles } from "./widget-styles.js";
import {
  productDisplayInitials,
  resolveProductDisplayName,
} from "../branding.js";

export type AnemoneDevToolsLauncherOptions = {
  simulation?: Omit<
    AnemoneSimulationWidgetOptions,
    "mount" | "injectStyles" | "defaultExpanded"
  >;
  networkActivity?: Omit<
    AnemoneNetworkActivityWidgetOptions,
    "mount" | "injectStyles" | "defaultExpanded"
  >;
  /** Product display name shown in the launcher. Blank values fall back to "Anemone". */
  productName?: string;
  /** Fallback left offset when the Next.js dev badge is not found yet. */
  offsetLeft?: number;
  /** Fallback bottom offset when the Next.js dev badge is not found yet. */
  offsetBottom?: number;
  /** Horizontal gap between the Next.js dev badge and this launcher. Default 8px. */
  nextJsBadgeGap?: number;
};

export type AnemoneDevToolsLauncherHandle = {
  openModal(): void;
  closeModal(): void;
  isModalOpen(): boolean;
  destroy(): void;
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

function menuRow(label: string, value: string, onClick?: () => void): HTMLButtonElement {
  const btn = el("button", "an-dev-tools-launcher__menu-item");
  btn.type = "button";
  btn.appendChild(el("span", "an-dev-tools-launcher__menu-label", label));
  btn.appendChild(el("span", "an-dev-tools-launcher__menu-value", value));
  if (onClick) btn.addEventListener("click", onClick);
  return btn;
}

function findNextJsDevToolsButton(): HTMLElement | null {
  const portal = document.querySelector("nextjs-portal");
  const shadow = portal?.shadowRoot;
  if (!shadow) return null;
  return shadow.querySelector<HTMLElement>("[data-nextjs-dev-tools-button]");
}

function findNextJsDevToolsAnchor(): HTMLElement | null {
  const nextBtn = findNextJsDevToolsButton();
  if (!nextBtn) return null;
  return nextBtn.closest<HTMLElement>("[data-next-badge]") ?? nextBtn;
}

type LauncherPositionSyncOptions = {
  fallbackLeft: number;
  fallbackBottom: number;
  gap: number;
};

/** Keep the Anemone launcher aligned beside the Next.js dev badge when present. */
function attachLauncherPositionSync(
  root: HTMLElement,
  options: LauncherPositionSyncOptions,
): () => void {
  let badgeObserver: ResizeObserver | null = null;

  function applyPosition(): void {
    const anchor = findNextJsDevToolsAnchor();
    badgeObserver?.disconnect();
    badgeObserver = null;

    if (anchor) {
      badgeObserver =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => applyPosition())
          : null;
      badgeObserver?.observe(anchor);
      badgeObserver?.observe(root);

      const rect = anchor.getBoundingClientRect();
      const naHeight = root.getBoundingClientRect().height;
      const nextCenterY = rect.top + rect.height / 2;
      const naTop = nextCenterY - naHeight / 2;

      root.style.left = `${Math.round(rect.right + options.gap)}px`;
      root.style.top = `${Math.round(naTop)}px`;
      root.style.bottom = "auto";
      return;
    }

    root.style.top = "auto";
    root.style.left = `${options.fallbackLeft}px`;
    root.style.bottom = `${options.fallbackBottom}px`;
  }

  applyPosition();

  window.addEventListener("resize", applyPosition);
  window.addEventListener("scroll", applyPosition, true);

  const pageObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => applyPosition())
      : null;
  pageObserver?.observe(document.documentElement);

  const domObserver = new MutationObserver(() => applyPosition());
  domObserver.observe(document.body, { childList: true, subtree: true });

  const retryTimers = [100, 500, 1500, 3000].map((ms) =>
    window.setTimeout(applyPosition, ms),
  );

  return () => {
    window.removeEventListener("resize", applyPosition);
    window.removeEventListener("scroll", applyPosition, true);
    badgeObserver?.disconnect();
    pageObserver?.disconnect();
    domObserver.disconnect();
    for (const id of retryTimers) window.clearTimeout(id);
  };
}

/**
 * Fixed-position Anemone dev launcher (Next.js-style) with a popover menu and large tools modal.
 */
export function createAnemoneDevToolsLauncher(
  options: AnemoneDevToolsLauncherOptions = {},
): AnemoneDevToolsLauncherHandle {
  if (typeof document === "undefined") {
    throw new Error("createAnemoneDevToolsLauncher requires a browser DOM");
  }

  injectWidgetStyles();

  const productName = resolveProductDisplayName(options.productName);
  const toolsLabel = `${productName} dev tools`;
  const offsetLeft = options.offsetLeft ?? 64;
  const offsetBottom = options.offsetBottom ?? 20;
  const nextJsBadgeGap = options.nextJsBadgeGap ?? 8;

  let menuOpen = false;
  let modalOpen = false;
  let visible = isAnemoneDebugModeEnabled();
  let simulationWidget: AnemoneSimulationWidgetHandle | null = null;
  let networkWidget: AnemoneNetworkActivityWidgetHandle | null = null;

  const root = el("div", "an-dev-tools-launcher-root");
  root.hidden = !visible;
  root.style.left = `${offsetLeft}px`;
  root.style.bottom = `${offsetBottom}px`;

  const trigger = el(
    "button",
    "an-dev-tools-launcher__trigger",
    productDisplayInitials(productName),
  );
  trigger.type = "button";
  trigger.title = toolsLabel;
  trigger.setAttribute("aria-label", toolsLabel);
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");

  const menu = el("div", "an-dev-tools-launcher__menu");
  menu.hidden = true;
  menu.setAttribute("role", "menu");

  const debugValue = el("span", "an-dev-tools-launcher__menu-value");
  const debugRow = el("div", "an-dev-tools-launcher__menu-static");
  debugRow.appendChild(el("span", "an-dev-tools-launcher__menu-label", "Debug mode"));
  debugRow.appendChild(debugValue);

  const modal = el("div", "an-dev-tools-launcher__modal");
  modal.hidden = true;
  modal.setAttribute("role", "presentation");

  const dialog = el("div", "an-dev-tools-launcher__modal-dialog");
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", toolsLabel);

  const modalHeader = el("div", "an-dev-tools-launcher__modal-header");
  modalHeader.appendChild(el("h2", "an-dev-tools-launcher__modal-title", toolsLabel));
  const closeBtn = el("button", "an-dev-tools-launcher__modal-close", "✕");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close dev tools");
  modalHeader.appendChild(closeBtn);

  const modalBody = el("div", "an-dev-tools-launcher__modal-body an-dev-tools-modal-panel");
  const simulationMount = el("div", "an-dev-tools-launcher__panel");
  simulationMount.appendChild(el("h3", "an-dev-tools-launcher__panel-title", "Integration simulations"));
  const simulationHost = el("div");
  simulationMount.appendChild(simulationHost);

  const networkMount = el("div", "an-dev-tools-launcher__panel");
  networkMount.appendChild(el("h3", "an-dev-tools-launcher__panel-title", "Network activity"));
  const networkHost = el("div");
  networkMount.appendChild(networkHost);

  modalBody.append(simulationMount, networkMount);
  dialog.append(modalHeader, modalBody);
  modal.appendChild(dialog);
  root.append(trigger, menu, modal);
  document.body.appendChild(root);

  const stopPositionSync = attachLauncherPositionSync(root, {
    fallbackLeft: offsetLeft,
    fallbackBottom: offsetBottom,
    gap: nextJsBadgeGap,
  });

  function syncDebugLabel(): void {
    debugValue.textContent = isAnemoneDebugModeEnabled() ? "Enabled" : "Off";
  }

  function mountWidgets(): void {
    if (options.simulation && !simulationWidget) {
      simulationWidget = createAnemoneSimulationWidget({
        ...options.simulation,
        productName: options.simulation.productName ?? productName,
        mount: simulationHost,
        injectStyles: false,
        defaultExpanded: true,
      });
    }
    if (options.networkActivity && !networkWidget) {
      networkWidget = createAnemoneNetworkActivityWidget({
        ...options.networkActivity,
        productName: options.networkActivity.productName ?? productName,
        mount: networkHost,
        injectStyles: false,
        defaultExpanded: true,
      });
    }
  }

  function destroyWidgets(): void {
    simulationWidget?.destroy();
    networkWidget?.destroy();
    simulationWidget = null;
    networkWidget = null;
  }

  function setMenuOpen(next: boolean): void {
    menuOpen = next;
    menu.hidden = !menuOpen;
    trigger.setAttribute("aria-expanded", menuOpen ? "true" : "false");
  }

  function setModalOpen(next: boolean): void {
    modalOpen = next;
    modal.hidden = !modalOpen;
    if (modalOpen) {
      mountWidgets();
      setMenuOpen(false);
    } else {
      destroyWidgets();
    }
  }

  function setVisible(next: boolean): void {
    visible = next;
    root.hidden = !visible;
    if (!visible) {
      setMenuOpen(false);
      setModalOpen(false);
    }
  }

  const openDevToolsRow = menuRow("Dev tools", "Open ›", () => setModalOpen(true));
  openDevToolsRow.setAttribute("role", "menuitem");

  menu.append(
    openDevToolsRow,
    el("div", "an-dev-tools-launcher__menu-divider"),
    debugRow,
  );

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenuOpen(!menuOpen);
  });

  closeBtn.addEventListener("click", () => setModalOpen(false));
  modal.addEventListener("mousedown", (event) => {
    if (event.target === modal) setModalOpen(false);
  });

  function onDocumentClick(event: MouseEvent): void {
    if (!menuOpen) return;
    if (root.contains(event.target as Node)) return;
    setMenuOpen(false);
  }

  function onDocumentKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      if (modalOpen) setModalOpen(false);
      else setMenuOpen(false);
    }
  }

  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onDocumentKeyDown);

  const unsubscribeDebug = subscribeAnemoneDebugMode(() => {
    syncDebugLabel();
    setVisible(isAnemoneDebugModeEnabled());
  });

  syncDebugLabel();
  setVisible(visible);

  return {
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
    isModalOpen: () => modalOpen,
    destroy() {
      unsubscribeDebug();
      stopPositionSync();
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onDocumentKeyDown);
      destroyWidgets();
      root.remove();
    },
  };
}
