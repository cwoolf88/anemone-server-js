import { resolveProductDisplayName } from "../branding.js";
import { appendDevWidgetChevron } from "./dev-widget-helpers.js";
import {
  simulationEventPhaseLabel,
  type SimulationEvent,
} from "./simulation-events.js";
import {
  SCENARIO_CATEGORY_LABELS,
  SCENARIO_CATEGORY_ORDER,
  scenarioDescription,
  scenarioLabel,
  scenariosForCategory,
} from "./simulation-copy.js";
import type { IntegrationSimulationScenario } from "./types.js";

export type SimulationWidgetView = {
  busy: boolean;
  statusMessage: string | null;
  statusError: string | null;
  canArmScenario: boolean;
  expanded: boolean;
  events: SimulationEvent[];
  /** Product display name. Blank values fall back to "Anemone". */
  productName?: string;
  onToggleExpanded: () => void;
  onClearEvents: () => void;
  onArmScenario: (scenario: IntegrationSimulationScenario) => void;
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

function scenarioButton(
  scenario: IntegrationSimulationScenario,
  busy: boolean,
  enabled: boolean,
  onArm: (scenario: IntegrationSimulationScenario) => void,
  productName?: string,
): HTMLButtonElement {
  const btn = el(
    "button",
    "an-simulation__btn an-simulation__btn--scenario",
    scenarioLabel(scenario, productName),
  );
  btn.type = "button";
  btn.disabled = busy || !enabled;
  btn.title = scenarioDescription(scenario, productName);
  btn.setAttribute(
    "aria-label",
    `${scenarioLabel(scenario, productName)}. ${scenarioDescription(scenario, productName)}`,
  );
  btn.addEventListener("click", () => onArm(scenario));
  return btn;
}

function phaseClass(phase: SimulationEvent["phase"]): string {
  switch (phase) {
    case "armed":
      return "an-simulation-events__phase an-simulation-events__phase--armed";
    case "applied":
      return "an-simulation-events__phase an-simulation-events__phase--applied";
    case "consumed":
      return "an-simulation-events__phase an-simulation-events__phase--consumed";
    case "triggered":
      return "an-simulation-events__phase an-simulation-events__phase--triggered";
    default:
      return "an-simulation-events__phase an-simulation-events__phase--failed";
  }
}

function formatEventTime(at: string): string {
  try {
    return new Date(at).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return at;
  }
}

function renderSimulationEvent(event: SimulationEvent, productName?: string): HTMLElement {
  const article = el("article", "an-simulation-events__item");
  const head = el("div", "an-simulation-events__head");

  head.appendChild(el("span", phaseClass(event.phase), simulationEventPhaseLabel(event.phase)));
  head.appendChild(
    el("span", "an-simulation-events__scenario", scenarioLabel(event.scenario, productName)),
  );

  if (event.context) {
    head.appendChild(
      el("span", "an-simulation-events__context", event.context.replace(/_/g, " ")),
    );
  }
  if (event.httpStatus != null) {
    head.appendChild(
      el("span", "an-simulation-events__status", `HTTP ${event.httpStatus}`),
    );
  }
  head.appendChild(el("time", "an-simulation-events__time", formatEventTime(event.at)));
  article.appendChild(head);

  if (event.message) {
    article.appendChild(el("p", "an-simulation-events__message", event.message));
  }
  if (event.hint) {
    article.appendChild(el("p", "an-simulation-events__hint", event.hint));
  }

  return article;
}

export function renderSimulationWidget(host: HTMLElement, view: SimulationWidgetView): void {
  const product = resolveProductDisplayName(view.productName);
  const section = el("section", "an-simulation an-widget an-dev-widget");
  if (!view.expanded) {
    section.classList.add("an-dev-widget--collapsed");
  }
  section.setAttribute("aria-label", `${product} integration simulations`);

  const header = el("div", "an-dev-widget__header");
  const toggleBtn = el("button", "an-dev-widget__toggle", "");
  toggleBtn.type = "button";
  toggleBtn.setAttribute("aria-expanded", view.expanded ? "true" : "false");
  toggleBtn.setAttribute(
    "aria-label",
    view.expanded ? "Collapse integration simulations" : "Expand integration simulations",
  );
  toggleBtn.addEventListener("click", view.onToggleExpanded);

  const toggleCopy = el("span", "an-dev-widget__toggle-copy");
  toggleCopy.appendChild(el("h3", "an-dev-widget__title", "Integration simulations"));
  toggleCopy.appendChild(el("span", "an-dev-widget__badge an-dev-widget__badge--amber", "Dev only"));
  if (view.events.length > 0) {
    const countLabel =
      view.events.length === 1 ? "1 event" : `${view.events.length} events`;
    toggleCopy.appendChild(el("span", "an-dev-widget__count", countLabel));
  }
  toggleBtn.appendChild(toggleCopy);
  appendDevWidgetChevron(toggleBtn);
  header.appendChild(toggleBtn);
  section.appendChild(header);

  const body = el("div", "an-dev-widget__body");
  if (!view.expanded) {
    body.hidden = true;
  }

  body.appendChild(
    el(
      "p",
      "an-dev-widget__subtitle",
      "Arm common failure scenarios, then save contact info or refresh the connection widget to trigger them.",
    ),
  );

  const actions = el("div", "an-simulation__actions");
  for (const category of SCENARIO_CATEGORY_ORDER) {
    const scenarios = scenariosForCategory(category);
    const group = el("div", "an-simulation__group");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", SCENARIO_CATEGORY_LABELS[category]);
    group.appendChild(el("p", "an-simulation__legend", SCENARIO_CATEGORY_LABELS[category]));

    const grid = el("div", "an-simulation__grid");
    for (const scenario of scenarios) {
      grid.appendChild(
        scenarioButton(scenario, view.busy, view.canArmScenario, view.onArmScenario, product),
      );
    }
    group.appendChild(grid);
    actions.appendChild(group);
  }
  body.appendChild(actions);

  if (!view.canArmScenario) {
    body.appendChild(
      el(
        "p",
        "an-simulation__hint",
        "Wire simulation.armScenario on your integration (tenant API → AnemoneClient.armIntegrationSimulation).",
      ),
    );
  }

  if (view.busy) {
    const loading = el("p", "an-simulation__status an-simulation__status--loading", "Arming scenario…");
    loading.setAttribute("role", "status");
    loading.setAttribute("aria-live", "polite");
    body.appendChild(loading);
  } else if (view.statusMessage) {
    const ok = el("p", "an-simulation__status an-simulation__status--ok", view.statusMessage);
    ok.setAttribute("role", "status");
    body.appendChild(ok);
  } else if (view.statusError) {
    const err = el("p", "an-simulation__status an-simulation__status--error", view.statusError);
    err.setAttribute("role", "alert");
    body.appendChild(err);
  }

  const eventsToolbar = el("div", "an-simulation-events__toolbar");
  eventsToolbar.appendChild(el("p", "an-simulation-events__title", "Simulation events"));
  const clearBtn = el("button", "an-simulation-events__clear", "Clear events");
  clearBtn.type = "button";
  clearBtn.addEventListener("click", view.onClearEvents);
  eventsToolbar.appendChild(clearBtn);
  body.appendChild(eventsToolbar);

  const eventsLog = el("div", "an-simulation-events");
  eventsLog.setAttribute("role", "log");
  eventsLog.setAttribute("aria-live", "polite");
  eventsLog.setAttribute("aria-relevant", "additions");

  if (view.events.length === 0) {
    eventsLog.appendChild(
      el(
        "p",
        "an-simulation-events__empty",
        "No simulation events yet. Arm a scenario or trigger a failure to populate the timeline.",
      ),
    );
  } else {
    for (const event of view.events) {
      eventsLog.appendChild(renderSimulationEvent(event, product));
    }
  }
  body.appendChild(eventsLog);

  section.appendChild(body);
  host.replaceChildren(section);
}
