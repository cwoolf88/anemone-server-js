/** Bundled styles for {@link createNextAddressWidget}. Tokens set on `.na-widget-host`. */
export const WIDGET_CSS = `
.na-widget-host {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  --na-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --na-font-family-title: var(--na-font-family);
  --na-font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --na-font-size: 0.875rem;
  --na-font-size-sm: 0.75rem;
  --na-font-size-title: 0.9375rem;
  --na-line-height: 1.45;
  --na-font-weight-body: 400;
  --na-font-weight-emphasis: 600;
  --na-letter-spacing: normal;
  --na-widget-bg: rgb(255 255 255 / 0.9);
  --na-widget-border: #e8e4df;
  --na-widget-shadow: 0 1px 2px rgb(28 25 23 / 0.06);
  --na-widget-radius: 1rem;
  --na-widget-backdrop-blur: 0;
  --na-ink: #1c1917;
  --na-muted: #78716c;
  --na-error: #dc2626;
  --na-badge-muted-bg: #faf8f5;
  --na-badge-muted-text: #78716c;
  --na-badge-muted-ring: #e8e4df;
  --na-badge-info-bg: #e0f2fe;
  --na-badge-info-text: #075985;
  --na-badge-success-bg: #d1fae5;
  --na-badge-success-text: #065f46;
  --na-btn-primary-bg: #0d9488;
  --na-btn-primary-hover: #0f766e;
  --na-btn-primary-text: #ffffff;
  --na-btn-secondary-bg: #faf8f5;
  --na-btn-secondary-border: #e8e4df;
  --na-btn-secondary-hover: #f5f0e8;
  --na-btn-secondary-text: #1c1917;
  --na-btn-shadow: 0 1px 2px rgb(28 25 23 / 0.08);
  --na-transition-fast: 150ms ease;
  --na-transition-normal: 200ms ease;
  --na-hint: #78716c;
  --na-sync-syncing-border: #bfdbfe;
  --na-sync-syncing-bg: #eff6ff;
  --na-sync-syncing-text: #1e3a8a;
  --na-sync-synced-border: #bbf7d0;
  --na-sync-synced-bg: #f0fdf4;
  --na-sync-synced-text: #14532d;
  --na-sync-queued-border: #fde68a;
  --na-sync-queued-bg: #fffbeb;
  --na-sync-queued-text: #78350f;
  --na-sync-failed-border: #fecaca;
  --na-sync-failed-bg: #fef2f2;
  --na-sync-failed-text: #7f1d1d;
  --na-retry-border: #b91c1c;
  --na-retry-text: #b91c1c;
  --na-retry-hover-bg: #fee2e2;
  --na-error-message-bg: rgb(127 29 29 / 0.06);
  --na-ghost-base: var(--na-badge-muted-bg);
  --na-ghost-shine: var(--na-badge-muted-ring);
}
.na-widget {
  position: relative;
  border: 1px solid var(--na-widget-border);
  border-radius: var(--na-widget-radius);
  background: var(--na-widget-bg);
  padding: 1rem;
  font-family: var(--na-font-family);
  font-size: var(--na-font-size);
  font-weight: var(--na-font-weight-body);
  line-height: var(--na-line-height);
  letter-spacing: var(--na-letter-spacing);
  color: var(--na-ink);
  box-shadow: var(--na-widget-shadow);
  -webkit-backdrop-filter: blur(var(--na-widget-backdrop-blur));
  backdrop-filter: blur(var(--na-widget-backdrop-blur));
}
.na-widget__connection-unavailable {
  border: 1px solid var(--na-widget-border);
  border-radius: calc(var(--na-widget-radius) * 0.75);
  background: var(--na-widget-bg);
  padding: 0.75rem 0.875rem;
  box-shadow: var(--na-widget-shadow);
  color: var(--na-error);
  font-weight: var(--na-font-weight-emphasis);
}
.na-widget__connection-unavailable p { margin: 0; }
.na-widget__connection {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}
.na-widget__header {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.625rem;
}
.na-widget__header-top {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.na-widget__copy {
  flex: 1;
  min-width: 0;
}
.na-widget__header-actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.375rem;
}
.na-widget__connection-status-slot {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
}
.na-widget__session-refresh-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 9999px;
  padding: 0;
  color: var(--na-badge-muted-text);
  background: var(--na-badge-muted-bg);
  cursor: pointer;
  outline: none;
}
.na-widget__session-refresh-btn:hover {
  color: var(--na-ink);
  background: var(--na-btn-secondary-hover);
}
.na-widget__session-refresh-btn:focus-visible {
  box-shadow: 0 0 0 2px var(--na-widget-bg), 0 0 0 4px var(--na-btn-primary-bg);
}
.na-widget__session-refresh-icon {
  display: block;
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}
.na-widget__settings-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: 9999px;
  padding: 0;
  color: var(--na-badge-muted-text);
  background: var(--na-badge-muted-bg);
  box-shadow: inset 0 0 0 1px var(--na-badge-muted-ring);
  cursor: pointer;
  outline: none;
}
.na-widget__settings-btn:hover:not(:disabled) {
  color: var(--na-ink);
  background: var(--na-btn-secondary-hover);
}
.na-widget__settings-btn:focus-visible {
  box-shadow:
    inset 0 0 0 1px var(--na-badge-muted-ring),
    0 0 0 2px var(--na-widget-bg),
    0 0 0 4px var(--na-btn-primary-bg);
}
.na-widget__settings-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.na-widget__settings-icon {
  display: block;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
.na-widget__connection-status-slot .na-widget__connection-status {
  width: 100%;
  height: 100%;
}
.na-widget__title {
  margin: 0;
  font-family: var(--na-font-family-title);
  font-size: var(--na-font-size-title);
  font-weight: var(--na-font-weight-emphasis);
  line-height: var(--na-line-height);
  letter-spacing: var(--na-letter-spacing);
  color: var(--na-ink);
}
.na-widget__subtitle {
  margin: 0.25rem 0 0;
  font-size: var(--na-font-size);
  font-weight: var(--na-font-weight-body);
  color: var(--na-muted);
}
.na-widget__badge {
  align-self: flex-start;
  border-radius: 9999px;
  padding: 0.25rem 0.625rem;
  font-size: var(--na-font-size-sm);
  font-weight: var(--na-font-weight-emphasis);
  letter-spacing: var(--na-letter-spacing);
}
.na-widget__badge--muted {
  background: var(--na-badge-muted-bg);
  color: var(--na-badge-muted-text);
  box-shadow: inset 0 0 0 1px var(--na-badge-muted-ring);
}
.na-widget__badge--signed-in {
  background: var(--na-badge-info-bg);
  color: var(--na-badge-info-text);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.na-widget__badge--auto {
  background: var(--na-badge-success-bg);
  color: var(--na-badge-success-text);
}
.na-widget__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.125rem;
}
.na-widget__connection-status {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  color: var(--na-badge-muted-text);
  background: var(--na-badge-muted-bg);
  cursor: help;
  outline: none;
}
.na-widget__connection-status--connected {
  color: var(--na-badge-success-bg);
  background: var(--na-badge-success-text);
}
.na-widget__connection-status--disconnected {
  color: var(--na-badge-muted-bg);
  background: color-mix(in srgb, var(--na-badge-muted-text) 50%, transparent);
}
.na-widget__connection-status--connected .na-widget__connection-status-icon,
.na-widget__connection-status--disconnected .na-widget__connection-status-icon {
  width: 1rem;
  height: 1rem;
}
.na-widget__connection-status--loading {
  background: var(--na-badge-muted-bg);
  box-shadow: none;
  overflow: hidden;
}
.na-widget__connection-status-icon {
  display: block;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
}
.na-widget__connection-status--loading .na-widget__connection-status-icon {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.na-widget__connection-status--loading .na-widget__connection-status-ripples {
  color: var(--na-btn-primary-bg);
}
.na-widget__connection-status--loading .na-widget__connection-status-ripple-hub {
  fill: var(--na-btn-primary-bg);
  opacity: 0.55;
}
.na-widget__connection-status--loading .na-widget__connection-status-ripple {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.75;
}
.na-widget__connection-status[data-na-tooltip]::after {
  content: attr(data-na-tooltip);
  position: absolute;
  z-index: 2;
  top: calc(100% + 0.375rem);
  right: 0;
  width: max-content;
  max-width: 14rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  background: var(--na-ink);
  color: #fff;
  font-size: var(--na-font-size-sm);
  font-weight: var(--na-font-weight-body);
  line-height: 1.35;
  text-align: left;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}
.na-widget__connection-status:hover::after,
.na-widget__connection-status:focus-visible::after {
  opacity: 1;
}
.na-widget__error { margin: 0.75rem 0 0; color: var(--na-error); }
.na-widget__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
  margin-top: 0;
}
.na-widget__btn {
  appearance: none;
  border-radius: calc(var(--na-widget-radius) * 0.75);
  padding: 0.625rem 1.25rem;
  font-family: var(--na-font-family);
  font-size: var(--na-font-size);
  font-weight: var(--na-font-weight-emphasis);
  letter-spacing: var(--na-letter-spacing);
  line-height: var(--na-line-height);
  cursor: pointer;
  box-shadow: var(--na-btn-shadow);
}
.na-widget__btn:disabled { cursor: not-allowed; opacity: 0.5; }
.na-widget__btn--primary {
  border: none;
  background: var(--na-btn-primary-bg);
  color: var(--na-btn-primary-text);
}
.na-widget__btn--primary:hover:not(:disabled) { background: var(--na-btn-primary-hover); }
.na-widget__btn--secondary {
  border: 1px solid var(--na-btn-secondary-border);
  background: var(--na-btn-secondary-bg);
  color: var(--na-btn-secondary-text);
}
.na-widget__btn--secondary:hover:not(:disabled) { background: var(--na-btn-secondary-hover); }
.na-widget__hint {
  margin: 0.5rem 0 0;
  font-size: var(--na-font-size-sm);
  font-weight: var(--na-font-weight-body);
  color: var(--na-hint);
}
.na-widget__sync {
  margin-top: 1rem;
  border-radius: calc(var(--na-widget-radius) * 0.75);
  padding: 0.75rem 0.875rem;
}
.na-widget__sync--syncing {
  border: 1px solid var(--na-sync-syncing-border);
  background: var(--na-sync-syncing-bg);
  color: var(--na-sync-syncing-text);
}
.na-widget__sync--synced {
  border: 1px solid var(--na-sync-synced-border);
  background: var(--na-sync-synced-bg);
  color: var(--na-sync-synced-text);
}
.na-widget__sync--queued {
  border: 1px solid var(--na-sync-queued-border);
  background: var(--na-sync-queued-bg);
  color: var(--na-sync-queued-text);
}
.na-widget__sync--failed {
  border: 1px solid var(--na-sync-failed-border);
  background: var(--na-sync-failed-bg);
  color: var(--na-sync-failed-text);
}
.na-widget__sync-title {
  margin: 0 0 0.5rem;
  font-family: var(--na-font-family-title);
  font-size: var(--na-font-size-title);
  font-weight: var(--na-font-weight-emphasis);
}
.na-widget__sync-title:last-child { margin-bottom: 0; }
.na-widget__sync-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.625rem; }
.na-widget__retry {
  appearance: none;
  border: 1px solid var(--na-retry-border);
  border-radius: 0.375rem;
  background: var(--na-widget-bg);
  color: var(--na-retry-text);
  cursor: pointer;
  font-family: var(--na-font-family);
  font-size: var(--na-font-size);
  font-weight: var(--na-font-weight-emphasis);
  padding: 0.375rem 0.75rem;
}
.na-widget__retry:hover:not(:disabled) { background: var(--na-retry-hover-bg); }
.na-widget__retry:disabled { cursor: not-allowed; opacity: 0.6; }
.na-widget__details { margin-top: 0.625rem; }
.na-widget__details-summary {
  cursor: pointer;
  font-size: var(--na-font-size);
  font-weight: var(--na-font-weight-emphasis);
  list-style: none;
}
.na-widget__details-summary::-webkit-details-marker { display: none; }
.na-widget__error-message {
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.625rem;
  border-radius: 0.375rem;
  background: var(--na-error-message-bg);
  font-family: var(--na-font-family-mono);
  font-size: var(--na-font-size-sm);
  font-weight: var(--na-font-weight-body);
  line-height: var(--na-line-height);
  white-space: pre-wrap;
  word-break: break-word;
}
@keyframes na-widget-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.na-widget__ghost-header {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
.na-widget__ghost-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.na-widget__ghost-header .na-widget__ghost-pill {
  width: 8rem;
  height: 1.375rem;
  border-radius: 9999px;
}
.na-widget__ghost-line,
.na-widget__ghost-pill,
.na-widget__ghost-btn {
  border-radius: 0.375rem;
  background: linear-gradient(
    90deg,
    var(--na-ghost-base) 0%,
    var(--na-ghost-shine) 50%,
    var(--na-ghost-base) 100%
  );
  background-size: 200% 100%;
  animation: na-widget-shimmer 1.4s ease-in-out infinite;
}
.na-widget__ghost-line { height: 0.75rem; }
.na-widget__ghost-line--title { width: 9rem; max-width: 55%; }
.na-widget__ghost-line--subtitle { width: 14rem; max-width: 85%; height: 0.625rem; }
.na-widget__ghost-pill {
  width: 5.5rem;
  height: 1.375rem;
  border-radius: 9999px;
}
.na-widget__ghost-icon {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
}
.na-widget__ghost-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.875rem;
}
.na-widget__ghost-btn {
  width: 7.5rem;
  height: 2.375rem;
  border-radius: calc(var(--na-widget-radius) * 0.75);
}
.na-widget__ghost-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.na-simulation-host, .na-network-activity-host { display: block; }
.na-dev-widget.na-widget { gap: 0; background: rgb(255 255 255 / 0.9); }
.na-dev-widget__toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.na-dev-widget__toggle:focus-visible {
  outline: 2px solid var(--na-btn-primary-bg);
  outline-offset: 2px;
  border-radius: 0.375rem;
}
.na-dev-widget__toggle-copy { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; min-width: 0; }
.na-dev-widget__title {
  margin: 0;
  font-family: var(--na-font-family-title);
  font-size: var(--na-font-size-title);
  font-weight: var(--na-font-weight-emphasis);
  line-height: 1.3;
}
.na-dev-widget__badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  font-size: var(--na-font-size-sm);
  font-weight: var(--na-font-weight-emphasis);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.na-dev-widget__badge--amber { background: var(--na-sync-queued-bg); color: var(--na-sync-queued-text); }
.na-dev-widget__badge--sky { background: var(--na-sync-syncing-bg); color: var(--na-sync-syncing-text); }
.na-dev-widget__count {
  border-radius: 9999px;
  background: var(--na-badge-muted-bg);
  color: var(--na-ink);
  padding: 0.125rem 0.5rem;
  font-size: var(--na-font-size-sm);
  font-weight: var(--na-font-weight-emphasis);
}
.na-dev-widget__chevron {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  fill: var(--na-btn-primary-bg);
  transition: fill 0.16s ease;
  transform: rotate(0deg);
  transform-origin: center;
}
.na-dev-widget--collapsed > .na-dev-widget__header .na-dev-widget__chevron {
  animation: na-dev-widget-chevron-collapse 0.16s ease both;
}
.na-dev-widget:not(.na-dev-widget--collapsed) > .na-dev-widget__header .na-dev-widget__chevron {
  animation: na-dev-widget-chevron-expand 0.16s ease both;
}
@keyframes na-dev-widget-chevron-collapse {
  from { transform: rotate(180deg); }
  to { transform: rotate(0deg); }
}
@keyframes na-dev-widget-chevron-expand {
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
}
.na-dev-widget__body { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.75rem; }
.na-dev-widget__subtitle { margin: 0; color: var(--na-muted); font-size: var(--na-font-size-sm); line-height: var(--na-line-height); }
.na-simulation__actions { display: flex; flex-direction: column; gap: 0.75rem; }
.na-simulation__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--na-btn-secondary-border);
  border-radius: 0.5rem;
  background: var(--na-btn-secondary-bg);
  color: var(--na-btn-secondary-text);
  font: inherit;
  font-size: var(--na-font-size-sm);
  font-weight: var(--na-font-weight-emphasis);
  line-height: 1.2;
  cursor: pointer;
  box-shadow: var(--na-btn-shadow);
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.na-simulation__btn:hover:not(:disabled) { background: var(--na-btn-secondary-hover); }
.na-simulation__btn:focus-visible {
  outline: 2px solid var(--na-btn-primary-bg);
  outline-offset: 2px;
}
.na-simulation__btn:disabled { opacity: 0.45; cursor: not-allowed; }
.na-simulation__group {
  padding: 0.75rem;
  border: 1px solid var(--na-widget-border);
  border-radius: calc(var(--na-widget-radius) * 0.75);
  background: var(--na-badge-muted-bg);
}
.na-simulation__grid { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
.na-simulation__btn--scenario { min-height: 2rem; padding: 0.375rem 0.75rem; }
.na-simulation__hint { margin: 0.75rem 0 0; color: var(--na-muted); font-size: var(--na-font-size-sm); }
.na-simulation__legend {
  margin: 0;
  font-size: var(--na-font-size-sm);
  font-weight: var(--na-font-weight-emphasis);
  color: var(--na-ink);
}
.na-simulation__status {
  margin: 0.75rem 0 0;
  padding: 0.625rem 0.75rem;
  border-radius: calc(var(--na-widget-radius) * 0.75);
  font-size: var(--na-font-size-sm);
  line-height: var(--na-line-height);
}
.na-simulation__status--loading {
  background: var(--na-sync-syncing-bg);
  color: var(--na-sync-syncing-text);
  border: 1px solid var(--na-sync-syncing-border);
}
.na-simulation__status--ok {
  background: var(--na-sync-queued-bg);
  color: var(--na-sync-queued-text);
  border: 1px solid var(--na-sync-queued-border);
}
.na-simulation__status--error {
  background: var(--na-sync-failed-bg);
  color: var(--na-sync-failed-text);
  border: 1px solid var(--na-sync-failed-border);
}
.na-simulation-events__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.na-simulation-events__title {
  margin: 0;
  font-size: var(--na-font-size-sm);
  font-weight: var(--na-font-weight-emphasis);
  color: var(--na-text);
}
.na-simulation-events__clear {
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--na-btn-secondary-border);
  border-radius: 0.375rem;
  background: var(--na-btn-secondary-bg);
  color: var(--na-btn-secondary-text);
  font: inherit;
  font-size: var(--na-font-size-sm);
  font-weight: var(--na-font-weight-emphasis);
  cursor: pointer;
}
.na-simulation-events__clear:hover { background: var(--na-btn-secondary-hover); }
.na-simulation-events {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 14rem;
  overflow: auto;
  padding: 0.75rem;
  border: 1px solid var(--na-border);
  border-radius: calc(var(--na-widget-radius) * 0.75);
  background: rgb(15 23 42 / 0.03);
}
.na-simulation-events__empty {
  margin: 0;
  color: var(--na-muted);
  font-size: var(--na-font-size-sm);
}
.na-simulation-events__item {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgb(148 163 184 / 0.25);
}
.na-simulation-events__item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}
.na-simulation-events__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.6rem;
}
.na-simulation-events__phase {
  display: inline-flex;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.na-simulation-events__phase--armed { background: #dbeafe; color: #1d4ed8; }
.na-simulation-events__phase--applied { background: #dcfce7; color: #15803d; }
.na-simulation-events__phase--consumed { background: #fef3c7; color: #b45309; }
.na-simulation-events__phase--triggered { background: #fee2e2; color: #b91c1c; }
.na-simulation-events__phase--failed { background: #fecaca; color: #991b1b; }
.na-simulation-events__scenario { font-weight: var(--na-font-weight-emphasis); color: var(--na-text); }
.na-simulation-events__context,
.na-simulation-events__status,
.na-simulation-events__time {
  color: var(--na-muted);
  font-size: 0.75rem;
}
.na-simulation-events__message,
.na-simulation-events__hint {
  margin: 0.35rem 0 0;
  color: var(--na-muted);
  font-size: var(--na-font-size-sm);
  line-height: var(--na-line-height);
}
.na-network-activity__toolbar { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: flex-start; }
.na-network-activity .na-dev-widget__body {
  max-height: min(42rem, 70vh);
  overflow-y: auto;
  padding-right: 0.25rem;
}
.na-network-activity__clear,
.na-network-activity__sort {
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--na-btn-secondary-border);
  border-radius: 0.375rem;
  background: var(--na-btn-secondary-bg);
  color: var(--na-btn-secondary-text);
  font: inherit;
  font-size: var(--na-font-size-sm);
  font-weight: var(--na-font-weight-emphasis);
  cursor: pointer;
}
.na-network-activity__clear:hover,
.na-network-activity__sort:hover { background: var(--na-btn-secondary-hover); }
.na-network-console {
  margin: 0;
  padding: 0.5rem 0.625rem;
  border-radius: calc(var(--na-widget-radius) * 0.75);
  background: #0f172a;
  color: #e2e8f0;
  font-family: var(--na-font-family-mono);
  font-size: 0.75rem;
  line-height: 1.5;
  max-height: 28rem;
  overflow: auto;
  box-shadow: inset 0 0 0 1px rgb(148 163 184 / 0.15);
}
.na-network-console__empty { margin: 0; color: #94a3b8; }
.na-network-console__exchange { padding: 0.45rem 0; border-bottom: 1px solid rgb(148 163 184 / 0.2); }
.na-network-console__exchange:last-child { border-bottom: none; }
.na-network-console__exchange--summary {
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border: 1px solid rgb(148 163 184 / 0.18);
  border-radius: 0.5rem;
  background: rgb(15 23 42 / 0.52);
}
.na-network-console__exchange--summary:last-child {
  margin-bottom: 0;
  border-bottom: 1px solid rgb(148 163 184 / 0.18);
}
.na-network-console__exchange--summary .na-network-console__exchange-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0;
  padding: 0.125rem 0.125rem 0;
  cursor: pointer;
  list-style: none;
}
.na-network-console__summary-details > summary::-webkit-details-marker {
  display: none;
}
.na-network-console__summary-details[open] > .na-network-console__exchange-head {
  margin-bottom: 0.75rem;
}
.na-network-console__summary-chevron {
  flex: 0 0 auto;
  width: 0.75rem;
  height: 0.75rem;
  margin-top: 0.35rem;
  color: #94a3b8;
  transform: rotate(0deg);
  transform-origin: center;
  transition: transform 0.16s ease, color 0.16s ease;
}
.na-network-console__summary-details[open] > .na-network-console__exchange-head .na-network-console__summary-chevron {
  transform: rotate(180deg);
}
.na-network-console__exchange--summary .na-network-console__exchange-head:hover .na-network-console__summary-chevron {
  color: #e2e8f0;
}
.na-network-console__exchange--nested {
  margin-left: calc(var(--na-network-depth, 1) * 0.75rem);
  padding-left: 0.75rem;
  border-left: 2px solid rgb(56 189 248 / 0.35);
}
.na-network-console__exchange-head { margin-bottom: 0.35rem; }
.na-network-console__meta { display: flex; flex: 1 1 auto; flex-wrap: wrap; align-items: baseline; gap: 0.25rem 0.5rem; }
.na-network-console__label { color: #38bdf8; font-weight: 700; }
.na-network-console__method {
  border-radius: 999px;
  padding: 0 0.35rem;
  font-weight: 700;
}
.na-network-console__method--get { color: #dbeafe; background: rgb(37 99 235 / 0.32); }
.na-network-console__method--post { color: #dcfce7; background: rgb(22 163 74 / 0.32); }
.na-network-console__method--put { color: #fef3c7; background: rgb(217 119 6 / 0.34); }
.na-network-console__method--patch { color: #f3e8ff; background: rgb(147 51 234 / 0.34); }
.na-network-console__method--delete { color: #fee2e2; background: rgb(220 38 38 / 0.34); }
.na-network-console__method--head,
.na-network-console__method--options { color: #ccfbf1; background: rgb(13 148 136 / 0.32); }
.na-network-console__method--other { color: #e2e8f0; background: rgb(100 116 139 / 0.34); }
.na-network-console__endpoint { color: #f8fafc; word-break: break-all; }
.na-network-console__verb { color: #f8fafc; word-break: break-all; }
.na-network-console__status { font-weight: 700; }
.na-network-console__status--ok { color: #4ade80; }
.na-network-console__status--warn { color: #fbbf24; }
.na-network-console__status--error { color: #f87171; }
.na-network-console__timestamp { color: #94a3b8; }
.na-network-console__timing { color: #94a3b8; }
.na-network-console__details,
.na-network-console-modal__close {
  flex: 0 0 auto;
  padding: 0.125rem 0.5rem;
  border: 1px solid rgb(148 163 184 / 0.45);
  border-radius: 0.375rem;
  background: rgb(30 41 59 / 0.85);
  color: #f8fafc;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}
.na-network-console__exchange--summary .na-network-console__details {
  display: none;
}
.na-network-console__summary-details[open] > .na-network-console__exchange-head .na-network-console__details {
  display: inline-flex;
}
.na-network-console__details:hover,
.na-network-console-modal__close:hover {
  background: rgb(51 65 85 / 0.95);
}
.na-network-console__summary-body {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
.na-network-console__exchange--summary .na-network-console__block {
  padding: 0.5rem;
  border: 1px solid rgb(148 163 184 / 0.12);
  border-radius: 0.4375rem;
  background: rgb(2 6 23 / 0.28);
}
.na-network-console__exchange-body { display: flex; flex-direction: column; gap: 0.5rem; }
.na-network-console__children { margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
.na-network-console__block-title {
  margin: 0 0 0.15rem;
  color: #94a3b8;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.na-network-console__pre {
  margin: 0;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  background: rgb(15 23 42 / 0.65);
  white-space: pre;
  word-break: normal;
  overflow-x: auto;
}
.na-network-console__pre--request { color: #cbd5e1; }
.na-network-console__pre--response { color: #bbf7d0; }
.na-network-console__pre--error { color: #fecaca; }
.na-network-console__tree {
  overflow-x: auto;
  color: #bbf7d0;
}
.na-network-console__tree-table {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}
.na-network-console__tree-key,
.na-network-console__tree-value,
.na-network-console__tree-empty {
  padding: 0.125rem 0.25rem;
  border-top: 1px solid rgb(148 163 184 / 0.12);
  vertical-align: top;
}
.na-network-console__tree-key {
  color: #93c5fd;
  font-weight: 700;
  text-align: left;
  white-space: nowrap;
}
.na-network-console__tree-value {
  color: #bbf7d0;
  white-space: nowrap;
}
.na-network-console__tree-empty,
.na-network-console__tree-primitive {
  color: #cbd5e1;
}
.na-network-console__tree-details {
  margin: 0;
}
.na-network-console__tree-summary {
  color: #fef08a;
  cursor: pointer;
  user-select: none;
}
.na-network-console__tree-details .na-network-console__tree-table {
  margin-top: 0.125rem;
  margin-left: 0.5rem;
  min-width: calc(100% - 0.5rem);
}
.na-network-console-modal {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgb(15 23 42 / 0.72);
}
.na-network-console-modal__dialog {
  width: min(56rem, 100%);
  max-height: min(42rem, calc(100vh - 2rem));
  display: flex;
  flex-direction: column;
  border-radius: var(--na-widget-radius);
  background: #020617;
  box-shadow: 0 1.5rem 4rem rgb(15 23 42 / 0.45);
  overflow: hidden;
}
.na-network-console-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgb(148 163 184 / 0.2);
}
.na-network-console-modal__title {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: var(--na-font-family-mono);
  font-size: 0.75rem;
}
.na-network-console--modal {
  border-radius: 0;
  max-height: none;
  flex: 1 1 auto;
}

.na-dev-tools-launcher-root {
  position: fixed;
  z-index: 99998;
  font-family: var(--na-font-family);
}
.na-dev-tools-launcher__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  border: 1px solid rgb(255 255 255 / 0.14);
  background: #171717;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 14px rgb(0 0 0 / 0.18);
}
.na-dev-tools-launcher__trigger:hover {
  background: #262626;
}
.na-dev-tools-launcher__trigger:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: 2px;
}
.na-dev-tools-launcher__menu {
  position: absolute;
  left: 0;
  bottom: calc(100% + 0.5rem);
  min-width: 13.75rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 10px 38px rgb(15 23 42 / 0.14);
}
.na-dev-tools-launcher__menu-item,
.na-dev-tools-launcher__menu-static {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 0;
  background: transparent;
  color: #111827;
  font-size: 0.875rem;
  text-align: left;
}
.na-dev-tools-launcher__menu-item {
  cursor: pointer;
}
.na-dev-tools-launcher__menu-item:hover {
  background: #f3f4f6;
}
.na-dev-tools-launcher__menu-label {
  font-weight: 500;
}
.na-dev-tools-launcher__menu-value {
  color: #6b7280;
  font-size: 0.8125rem;
}
.na-dev-tools-launcher__menu-divider {
  height: 1px;
  background: #e5e7eb;
}
.na-dev-tools-launcher__modal {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgb(15 23 42 / 0.42);
}
.na-dev-tools-launcher__modal-dialog {
  display: flex;
  flex-direction: column;
  width: min(60rem, 100%);
  max-height: min(85vh, 56rem);
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 24px 64px rgb(15 23 42 / 0.22);
}
.na-dev-tools-launcher__modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}
.na-dev-tools-launcher__modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
}
.na-dev-tools-launcher__modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 0.5rem;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
}
.na-dev-tools-launcher__modal-close:hover {
  background: #f3f4f6;
  color: #111827;
}
.na-dev-tools-launcher__modal-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1.25rem 1.25rem;
  overflow: auto;
}
.na-dev-tools-launcher__panel-title {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
}
.na-dev-tools-modal-panel .na-dev-widget__header,
.na-dev-tools-modal-panel .na-dev-widget__toggle {
  display: none;
}
.na-dev-tools-modal-panel .na-dev-widget__body {
  display: flex !important;
  margin-top: 0;
}
.na-dev-tools-modal-panel .na-dev-widget--collapsed .na-dev-widget__body {
  display: flex !important;
}
`.trim();
const STYLE_ID = "next-address-widget-styles";
export function injectWidgetStyles() {
    if (typeof document === "undefined")
        return;
    if (document.getElementById(STYLE_ID))
        return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = WIDGET_CSS;
    document.head.appendChild(el);
}
//# sourceMappingURL=widget-styles.js.map