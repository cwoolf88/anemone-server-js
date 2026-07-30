import { injectWidgetStyles } from "./widget-styles.js";
import { renderWidget } from "./widget-render.js";
import { createAnemoneIntegration } from "./integration.js";
import {
  applyWidgetPalette,
  clearWidgetPalette,
  resolveWidgetPalette,
} from "./themes.js";
import type {
  AnemoneWidgetHandle,
  AnemoneWidgetOptions,
} from "./types.js";

function resolveMount(mount: HTMLElement | string): HTMLElement {
  if (typeof mount !== "string") return mount;
  const el = document.querySelector<HTMLElement>(mount);
  if (!el) {
    throw new Error(`Anemone widget mount not found: ${mount}`);
  }
  return el;
}

/**
 * Packaged Anemone account widget with optional in-widget contact sync status.
 * For custom UIs, use {@link createAnemoneIntegration} with {@link renderSyncBlock}.
 */
export function createAnemoneWidget(
  options: AnemoneWidgetOptions
): AnemoneWidgetHandle {
  if (typeof document === "undefined") {
    throw new Error("createAnemoneWidget requires a browser DOM");
  }

  if (options.injectStyles !== false) {
    injectWidgetStyles();
  }

  const container = resolveMount(options.mount);
  container.classList.add("an-widget-host");
  const palette = resolveWidgetPalette(options.theme);
  applyWidgetPalette(container, palette);

  let integration!: ReturnType<typeof createAnemoneIntegration>;

  function paint(): void {
    const { connection, sync, syncBusy, tenantName, productName, sessionPoll } =
      integration.getState();
    renderWidget(
      container,
      connection,
      tenantName,
      {
        onConnectAccount: () => integration.connectAccount(),
        onDisconnect: () => integration.disconnect(),
        onOpenSettings: () => integration.openSettings(),
        onRetryConnectSession: () => void integration.retryConnectSession(),
      },
      options.sync ? sync : null,
      {
        onRetry: options.sync ? () => void integration.sync() : undefined,
        retryDisabled: syncBusy,
      },
      sessionPoll,
      productName,
    );
  }

  integration = createAnemoneIntegration({
    fetchConnection: options.fetchConnection,
    tenantName: options.tenantName,
    productName: options.productName,
    sync: options.sync,
    visibilityRefreshMs: options.visibilityRefreshMs,
    navigateToPrimary: options.navigateToPrimary,
    simulation: options.simulation,
    simulateAddressChangeSecurityEvent: options.simulateAddressChangeSecurityEvent,
    onChange: () => paint(),
  });

  paint();

  return {
    ...integration,
    destroy() {
      integration.destroy();
      container.replaceChildren();
      clearWidgetPalette(container);
      container.classList.remove("an-widget-host");
    },
  };
}
