/** Platform name shown in the attribution row, independent of `productName`. */
export const ANEMONE_ATTRIBUTION_NAME = "Anemone";

/** Used for attribution links when connection info has no `primaryBaseUrl` (e.g. mock mode). */
export const DEFAULT_ANEMONE_PRIMARY_BASE_URL = "https://app.anemoneos.com";

export const ANEMONE_TERMS_PATH = "/terms";
export const ANEMONE_PRIVACY_PATH = "/privacy";
export const ANEMONE_LOGO_PATH = "/favicon.svg";

/**
 * Required attribution for every connect UI: the Anemone logo and name plus
 * links to the Anemone Terms of Service and Privacy Policy.
 */
export type AnemoneAttribution = {
  name: string;
  logoUrl: string;
  termsUrl: string;
  privacyUrl: string;
};

export function resolveAnemoneAttribution(
  primaryBaseUrl?: string | null,
): AnemoneAttribution {
  const base = (primaryBaseUrl?.trim() || DEFAULT_ANEMONE_PRIMARY_BASE_URL).replace(/\/$/, "");
  return {
    name: ANEMONE_ATTRIBUTION_NAME,
    logoUrl: `${base}${ANEMONE_LOGO_PATH}`,
    termsUrl: `${base}${ANEMONE_TERMS_PATH}`,
    privacyUrl: `${base}${ANEMONE_PRIVACY_PATH}`,
  };
}

const SVG_NS = "http://www.w3.org/2000/svg";

/** Top-down anemone mark, matching the product favicon. Fills with `currentColor`. */
export function appendAnemoneLogo(parent: Element, className: string): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("class", className);
  svg.setAttribute("aria-hidden", "true");

  const group = document.createElementNS(SVG_NS, "g");
  group.setAttribute("transform", "translate(16 16)");

  for (let i = 0; i < 8; i += 1) {
    const tentacle = document.createElementNS(SVG_NS, "ellipse");
    tentacle.setAttribute("cx", "0");
    tentacle.setAttribute("cy", "-7.6");
    tentacle.setAttribute("rx", "2.15");
    tentacle.setAttribute("ry", "5.4");
    if (i > 0) tentacle.setAttribute("transform", `rotate(${i * 45})`);
    group.appendChild(tentacle);
  }

  const mouth = document.createElementNS(SVG_NS, "path");
  mouth.setAttribute("fill-rule", "evenodd");
  mouth.setAttribute(
    "d",
    "M0 5.6a5.6 5.6 0 1 0 0-11.2 5.6 5.6 0 0 0 0 11.2zm0-3.4a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z",
  );
  group.appendChild(mouth);
  svg.appendChild(group);
  parent.appendChild(svg);
  return svg;
}

function legalLink(href: string, label: string): HTMLAnchorElement {
  const link = document.createElement("a");
  link.className = "an-widget__attribution-link";
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
}

export function createAnemoneAttributionElement(
  primaryBaseUrl?: string | null,
): HTMLElement {
  const attribution = resolveAnemoneAttribution(primaryBaseUrl);
  const row = document.createElement("div");
  row.className = "an-widget__attribution";

  const brand = document.createElement("span");
  brand.className = "an-widget__attribution-brand";
  appendAnemoneLogo(brand, "an-widget__attribution-logo");
  brand.appendChild(document.createTextNode(attribution.name));
  row.appendChild(brand);

  const legal = document.createElement("nav");
  legal.className = "an-widget__attribution-legal";
  legal.setAttribute("aria-label", `${attribution.name} legal`);
  legal.appendChild(legalLink(attribution.termsUrl, "Terms"));
  const separator = document.createElement("span");
  separator.setAttribute("aria-hidden", "true");
  separator.textContent = "·";
  legal.appendChild(separator);
  legal.appendChild(legalLink(attribution.privacyUrl, "Privacy"));
  row.appendChild(legal);

  return row;
}

/** Renders the required Anemone attribution row inside a host (for custom connection UIs). */
export function renderAnemoneAttribution(
  host: HTMLElement,
  primaryBaseUrl?: string | null,
): void {
  host.replaceChildren(createAnemoneAttributionElement(primaryBaseUrl));
}
