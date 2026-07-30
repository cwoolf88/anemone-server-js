/**
 * User identifier on the 3rd-party system. Never send anemone internal user IDs here.
 *
 * For browser connect/disconnect URLs, mint an opaque token via POST /api/v1/direct-connect-tokens, or sign
 * with encodeExternalUserId (api key prefix + user id only — no tenant id).
 * For REST/webhooks, pass your product's raw user id; primary resolves tenant from your API key.
 */
export type ExternalUserId = string;

/** Contact change categories; extend as primary adds channels. */
export type ContactChangeKind =
  | "address"
  | "phone"
  | "name"
  | "email";

export interface AddressPayload {
  line1?: string;
  line2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  countryCode?: string;
  /** Opaque label from primary (e.g. "home", "billing") */
  label?: string;
}

/** Webhook/request envelope from anemone → 3rd party. */
export type OutboundWebhookEvent =
  | ContactChangeWebhookEvent
  | ContactUpdateReviewedEvent
  | AutoConnectMatchRequestEvent;

export interface ContactChangeWebhookEvent {
  /** Event name for routing/versioning */
  event: "contact.changed";
  /** ISO 8601 when primary emitted the event */
  occurredAt: string;
  /** 3rd-party user id; primary resolves connection server-side */
  externalUserId: ExternalUserId;
  /** What changed; future kinds reuse this envelope */
  kind: ContactChangeKind;
  /** Present when kind === "address"; other kinds add their own payloads later */
  address?: AddressPayload;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  /** Primary may include correlation / audit ids */
  correlationId?: string;
}

/**
 * Fired (to the origin tenant) when a non-certified contact update is approved
 * or rejected in anemone.
 */
export type ContactUpdateReviewStatus = "approved" | "rejected";

export interface ContactUpdateReviewedEvent {
  event: "contact.update.reviewed";
  occurredAt: string;
  externalUserId: ExternalUserId;
  kind: ContactChangeKind;
  status: ContactUpdateReviewStatus;
  /** Echo of the end-user’s decision; included for observability. */
  correlationId?: string;
  address?: AddressPayload;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export interface AutoConnectMatchRequestEvent {
  event: "account.email_match.requested";
  occurredAt: string;
  /** Verified Anemone email. Use only to check for an existing tenant account. */
  email: string;
  /** Primary-generated audit/correlation id for this one lookup. */
  correlationId: string;
}

export interface AutoConnectMatchResponseBody {
  matched: boolean;
  /** Required when matched is true. Tenant-side stable user identifier to link. */
  externalUserId?: ExternalUserId;
}

/** Result of verifying a raw `contact.changed` body */
export type VerifiedWebhookPayload = ContactChangeWebhookEvent;

/** `contact.changed` and `contact.update.reviewed` (same signing scheme) */
export type AnyVerifiedWebhookPayload = OutboundWebhookEvent;

/** Update sent from 3rd party → primary */
export interface ContactUpdateRequest {
  externalUserId: ExternalUserId;
  kind: ContactChangeKind;
  address?: AddressPayload;
  /**
   * Optional previous address from the tenant system. Primary can use this to
   * fuzzy-match which saved Anemone address should be updated; it does not
   * replace `address`, which remains the requested new value/patch.
   */
  previousAddress?: AddressPayload;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
}

/**
 * Primary indicates whether the change was applied globally or needs end-user review.
 * Exact strings should match anemone API contract.
 */
export type ContactUpdateProcessingStatus =
  | "processed_globally"
  | "pending_user_review"
  | "rejected";

export interface ContactUpdateResponseBody {
  status: ContactUpdateProcessingStatus;
  /** Human-readable detail when rejected or pending */
  message?: string;
  correlationId?: string;
}

export interface ContactUpdateQueueResponseBody {
  status: "queued";
  queueId?: string;
  message?: string;
  correlationId?: string;
}

export type ContactSaveResult =
  | ContactUpdateResponseBody
  | ContactUpdateQueueResponseBody;

/** Tenant is inferred from the Bearer API key — body may be empty. */
export type TenantConnectRequest = Record<string, never>;

/** Tenant is inferred from the Bearer API key — body may be empty. */
export type TenantDisconnectRequest = Record<string, never>;

export type TenantConnectionStatus = "connected" | "disconnected";

export interface TenantConnectionResponseBody {
  status: TenantConnectionStatus;
  message?: string;
  correlationId?: string;
}

export interface TenantAutoConnectRequest {
  /** Verified email from the tenant-side account currently signed into your app. */
  email: string;
  /** Tenant-side stable user identifier to link when the email matches exactly one Anemone user. */
  externalUserId: ExternalUserId;
}

export type TenantAutoConnectStatus = "connected" | "not_found" | "disabled";

export interface TenantAutoConnectResponseBody {
  status: TenantAutoConnectStatus;
  matched: boolean;
  connected: boolean;
  autoConnected: boolean;
  externalUserId?: ExternalUserId;
  created?: boolean;
  message?: string;
  correlationId?: string;
}

export interface MintDirectConnectTokenRequest {
  externalUserId: ExternalUserId;
}

export interface MintDirectConnectTokenResponseBody {
  linkToken: string;
  expiresAt: string;
}

/** Tenant-side demo account removed — hide the link from Anemone UIs. */
export interface MarkTenantExternalUserDeletedRequest {
  externalUserId: ExternalUserId;
}

export interface MarkTenantExternalUserDeletedResponseBody {
  status: "deleted" | "not_found";
  message?: string;
  correlationId?: string;
}

/** Active 24-hour address-change security hold on anemone. */
export type AddressChangeHoldStatus = {
  id: string;
  reason: string;
  reasonLabel: string;
  clientIp: string | null;
  clientLocationLabel: string | null;
  pausedUntil: string;
  reverifiedAt: string | null;
  isBlocking: boolean;
  requiresReverification: boolean;
  waitingForCooldown: boolean;
  tenantId: string | null;
  contactQueueId: string | null;
};

export type AddressChangeSecurityBlockCode =
  | "address_changes_paused"
  | "suspicious_ip_hold_created";

export interface SimulateAddressChangeSecurityEventRequest {
  externalUserId: ExternalUserId;
}

export type SimulateAddressChangeSecurityEventStatus = "hold_created" | "already_paused";

export interface SimulateAddressChangeSecurityEventResponse {
  status: SimulateAddressChangeSecurityEventStatus;
  code: AddressChangeSecurityBlockCode;
  message: string;
  hold: AddressChangeHoldStatus;
}

/** Who should fail on the next address/contact sync attempt. */
export type AddressUpdateFailureSource = "merchant" | "anemone";

export interface SimulateFailedAddressUpdateRequest {
  externalUserId: ExternalUserId;
  source: AddressUpdateFailureSource;
}

export interface SimulateFailedAddressUpdateResponse {
  status: "armed";
  source: AddressUpdateFailureSource;
  message: string;
}

import type { IntegrationSimulationScenario } from "./simulation-scenarios.js";

export type { IntegrationSimulationScenario };

export interface ArmIntegrationSimulationRequest {
  externalUserId: ExternalUserId;
  scenario: IntegrationSimulationScenario;
}

export type ArmIntegrationSimulationResponse =
  | {
      status: "armed";
      scenario: IntegrationSimulationScenario;
      message: string;
      hint: string;
    }
  | {
      status: "applied";
      scenario: "security_hold";
      message: string;
      hold: AddressChangeHoldStatus;
    };
