import { resolveProductDisplayName } from "../branding.js";
import type { WidgetConnectionView } from "./types.js";

/** Default primary settings path when signed in without a per-merchant link. */
export const DEFAULT_PRIMARY_SETTINGS_PATH = "/addresses";

/** Widget heading: describes the connect feature, not the integrating site. */
export function connectionTitle(): string {
  return "Address profile";
}

export function connectionSubtitle(
  view: WidgetConnectionView,
  tenantName: string,
  productName?: string,
): string {
  const app = tenantName || "your app";
  const product = resolveProductDisplayName(productName);
  if (view.autoConnected && !view.signedIntoPrimary) {
    return `${app} matched your ${product} account by verified email. Sign in to manage your shared profile.`;
  }
  if (view.connected) {
    return `Contact updates from ${app} sync through your shared ${product} profile.`;
  }
  if (view.signedIntoPrimary) {
    return `Connect ${app} to keep your address and contact info in sync across partners.`;
  }
  return `One address profile for everywhere you shop—sign in to connect ${app}.`;
}

export function connectionStatusTooltip(
  view: WidgetConnectionView,
  mockMode: boolean,
  productName?: string,
): string {
  const product = resolveProductDisplayName(productName);
  if (view.statusLoading) {
    return `Checking connection status with ${product}…`;
  }
  if (view.connected) {
    if (view.autoConnected && !view.signedIntoPrimary) {
      return `Auto-connected by verified email. Sign in to manage your ${product} profile.`;
    }
    return mockMode
      ? `Connected (mock). Changes you save sync to your ${product} profile.`
      : `Connected. Changes you save in this app sync to your ${product} profile.`;
  }
  return mockMode
    ? "Not connected (mock). Connect to sync contact and address updates."
    : `Not connected. Connect to send contact and address updates to ${product}.`;
}

export function sessionPollRefreshLabel(phase: "sign-in" | "connect" | null): string {
  if (phase === "connect") {
    return "Check connection status again";
  }
  return "Check sign-in status again";
}

export function settingsButtonLabel(
  signedIntoPrimary: boolean,
  productName?: string,
): string {
  const product = resolveProductDisplayName(productName);
  return signedIntoPrimary
    ? `Manage your addresses in ${product}`
    : `Sign in to manage your addresses in ${product}`;
}

export function disconnectButtonLabel(
  signedIntoPrimary: boolean,
  hasDisconnectSignInUrl: boolean
): string {
  if (!signedIntoPrimary && hasDisconnectSignInUrl) {
    return "Sign in to disconnect";
  }
  return "Disconnect account";
}

export function resolvePrimarySettingsUrl(
  primaryBaseUrl: string,
  merchantSettingsPath: string | null
): string {
  const base = primaryBaseUrl.replace(/\/$/, "");
  const path = merchantSettingsPath ?? DEFAULT_PRIMARY_SETTINGS_PATH;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
