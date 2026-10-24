/** Brand mark for attribution, titles, and standalone labels. */
export const DEFAULT_DISPLAY_NAME = "AnemoneOS";

/** Short name for prose and sentences (never includes "OS"). */
export const DEFAULT_PRODUCT_DISPLAY_NAME = "Anemone";

/** Normalize an optional brand mark and fall back to AnemoneOS. */
export function resolveDisplayName(displayName?: string | null): string {
  return displayName?.trim() || DEFAULT_DISPLAY_NAME;
}

/** Normalize an optional in-sentence product name and fall back to Anemone. */
export function resolveProductDisplayName(productName?: string | null): string {
  return productName?.trim() || DEFAULT_PRODUCT_DISPLAY_NAME;
}

/** Two-letter abbreviation of a product display name. */
export function productDisplayInitials(productName?: string | null): string {
  const resolved = resolveProductDisplayName(productName);
  const words = resolved.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }
  return resolved.slice(0, 2).toUpperCase();
}

export type ContactSyncDisplayCopy = {
  syncing: string;
  synced: string;
  queuedTitle: string;
  queuedBody: string;
  failedTitle: string;
  failedWithStatus: (httpStatus: number) => string;
  failedBody: string;
};

/** Shared user-facing sync status copy for DOM and React renderers. */
export function contactSyncDisplayCopy(
  productName?: string | null,
): ContactSyncDisplayCopy {
  const product = resolveProductDisplayName(productName);
  return {
    syncing: `Syncing with ${product}…`,
    synced: `Synced with ${product}`,
    queuedTitle: "Sync pending",
    queuedBody: `Your update is queued and will reach ${product} on the next scheduled sync.`,
    failedTitle: "Syncing failed",
    failedWithStatus: (httpStatus) => `${product} returned status ${httpStatus}.`,
    failedBody: `We could not sync this contact update with ${product}.`,
  };
}
