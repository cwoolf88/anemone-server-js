import type {
  AddressPayload,
  ContactChangeKind,
  ContactChangeWebhookEvent,
  ContactUpdateRequest,
  ContactUpdateReviewedEvent,
} from "./types.js";

/** Scalar contact fields on Anemone update and webhook payloads. */
export type AnemoneScalarContactField =
  | "email"
  | "phone"
  | "firstName"
  | "lastName"
  | "middleInitial";

/** Address fields nested under `address` / `previousAddress`. */
export type AnemoneAddressField =
  | "line1"
  | "line2"
  | "city"
  | "region"
  | "postalCode"
  | "countryCode"
  | "label";

/** Dot path for a Anemone contact field (e.g. `address.line1`). */
export type AnemoneContactPath =
  | AnemoneScalarContactField
  | `address.${AnemoneAddressField}`
  | `previousAddress.${AnemoneAddressField}`;

/** Contact fields carried on primary update and webhook payloads. */
export type PrimaryContactFields = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  middleInitial?: string;
  address?: AddressPayload;
  previousAddress?: AddressPayload;
};

/**
 * Maps each Anemone contact field to the merchant app's property name.
 * Keys use Anemone names (`line1`, `address.city`, …); values are merchant keys.
 */
export type ContactPropertyRenameMap = Partial<Record<AnemoneContactPath, string>>;

/**
 * Bidirectional mapping between merchant contact records and Anemone fields.
 *
 * - `rename` — automatic property renames for defined keys
 * - `set` — merchant → primary (merged on top of `rename`)
 * - `get` — primary → merchant (merged on top of `rename`)
 */
export type ContactInfoMapping<
  MerchantContact extends Record<string, unknown> = Record<string, unknown>,
> = {
  rename?: ContactPropertyRenameMap;
  /** Merchant record → Anemone contact fields. */
  set?: (merchant: MerchantContact) => PrimaryContactFields | void;
  /** Anemone contact fields → partial merchant record. */
  get?: (primary: PrimaryContactFields) => Partial<MerchantContact> | void;
};

export type BuildContactUpdateFromMerchantInput<
  MerchantContact extends Record<string, unknown> = Record<string, unknown>,
> = {
  externalUserId: ContactUpdateRequest["externalUserId"];
  kind: ContactChangeKind;
  merchant: MerchantContact;
  mapping?: ContactInfoMapping<MerchantContact>;
  /** When set, included on address updates for fuzzy matching in primary. */
  previousMerchant?: MerchantContact;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function readMerchantValue(merchant: Record<string, unknown>, key: string): unknown {
  return merchant[key];
}

function writeMerchantValue(
  merchant: Record<string, unknown>,
  key: string,
  value: unknown,
): void {
  if (value === undefined) return;
  merchant[key] = value;
}

function setNestedPrimaryValue(
  target: PrimaryContactFields,
  path: AnemoneContactPath,
  value: unknown,
): void {
  if (value === undefined) return;
  if (typeof value !== "string") return;

  if (!path.includes(".")) {
    (target as Record<string, string | undefined>)[path] = value;
    return;
  }

  const [root, field] = path.split(".") as [
    "address" | "previousAddress",
    AnemoneAddressField,
  ];
  const bucket = target[root] ?? {};
  bucket[field] = value;
  target[root] = bucket;
}

function readNestedPrimaryValue(
  source: PrimaryContactFields,
  path: AnemoneContactPath,
): string | undefined {
  if (!path.includes(".")) {
    const v = source[path as AnemoneScalarContactField];
    return typeof v === "string" ? v : undefined;
  }
  const [root, field] = path.split(".") as [
    "address" | "previousAddress",
    AnemoneAddressField,
  ];
  const bucket = source[root];
  if (!bucket) return undefined;
  const v = bucket[field];
  return typeof v === "string" ? v : undefined;
}

function mergePrimaryFields(
  base: PrimaryContactFields,
  patch: PrimaryContactFields,
): PrimaryContactFields {
  return {
    ...base,
    ...patch,
    address: patch.address ? { ...base.address, ...patch.address } : base.address,
    previousAddress: patch.previousAddress
      ? { ...base.previousAddress, ...patch.previousAddress }
      : base.previousAddress,
  };
}

function applyRenameToPrimary(
  merchant: Record<string, unknown>,
  rename: ContactPropertyRenameMap,
): PrimaryContactFields {
  const out: PrimaryContactFields = {};
  for (const [primaryPath, merchantKey] of Object.entries(rename)) {
    if (!merchantKey) continue;
    const value = readMerchantValue(merchant, merchantKey);
    setNestedPrimaryValue(out, primaryPath as AnemoneContactPath, value);
  }
  return out;
}

function applyRenameToMerchant(
  primary: PrimaryContactFields,
  rename: ContactPropertyRenameMap,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [primaryPath, merchantKey] of Object.entries(rename)) {
    if (!merchantKey) continue;
    const value = readNestedPrimaryValue(primary, primaryPath as AnemoneContactPath);
    writeMerchantValue(out, merchantKey, value);
  }
  return out;
}

/** Extract normalized contact fields from a verified webhook or review event. */
export function primaryContactFieldsFromEvent(
  event: ContactChangeWebhookEvent | ContactUpdateReviewedEvent,
): PrimaryContactFields {
  return {
    email: event.email,
    phone: event.phone,
    firstName: event.firstName,
    lastName: event.lastName,
    address: event.address,
  };
}

/**
 * Map a merchant contact record to Anemone contact fields.
 * Applies `rename`, then merges the result of `set` when provided.
 */
export function mapMerchantContactToPrimary<
  MerchantContact extends Record<string, unknown> = Record<string, unknown>,
>(
  merchant: MerchantContact,
  mapping?: ContactInfoMapping<MerchantContact>,
): PrimaryContactFields {
  let out: PrimaryContactFields = {};
  if (mapping?.rename) {
    out = applyRenameToPrimary(merchant, mapping.rename);
  }
  if (mapping?.set) {
    const custom = mapping.set(merchant);
    if (custom) {
      out = mergePrimaryFields(out, custom);
    }
  }
  return out;
}

/**
 * Map Anemone contact fields to a partial merchant contact record.
 * Applies `rename`, then merges the result of `get` when provided.
 */
export function mapPrimaryContactToMerchant<
  MerchantContact extends Record<string, unknown> = Record<string, unknown>,
>(
  primary: PrimaryContactFields,
  mapping?: ContactInfoMapping<MerchantContact>,
): Partial<MerchantContact> {
  let out: Record<string, unknown> = {};
  if (mapping?.rename) {
    out = applyRenameToMerchant(primary, mapping.rename);
  }
  if (mapping?.get) {
    const custom = mapping.get(primary);
    if (custom && isRecord(custom)) {
      out = { ...out, ...custom };
    }
  }
  return out as Partial<MerchantContact>;
}

/** Map a verified webhook or review event into merchant contact fields. */
export function mapContactEventToMerchant<
  MerchantContact extends Record<string, unknown> = Record<string, unknown>,
>(
  event: ContactChangeWebhookEvent | ContactUpdateReviewedEvent,
  mapping?: ContactInfoMapping<MerchantContact>,
): Partial<MerchantContact> {
  return mapPrimaryContactToMerchant(primaryContactFieldsFromEvent(event), mapping);
}

/**
 * Build a {@link ContactUpdateRequest} from a merchant record and optional mapping.
 */
export function buildContactUpdateFromMerchant<
  MerchantContact extends Record<string, unknown> = Record<string, unknown>,
>(input: BuildContactUpdateFromMerchantInput<MerchantContact>): ContactUpdateRequest {
  const fields = mapMerchantContactToPrimary(input.merchant, input.mapping);
  const body: ContactUpdateRequest = {
    externalUserId: input.externalUserId,
    kind: input.kind,
  };

  if (fields.email !== undefined) body.email = fields.email;
  if (fields.phone !== undefined) body.phone = fields.phone;
  if (fields.firstName !== undefined) body.firstName = fields.firstName;
  if (fields.lastName !== undefined) body.lastName = fields.lastName;
  if (fields.middleInitial !== undefined) body.middleInitial = fields.middleInitial;
  if (fields.address) body.address = fields.address;

  if (input.previousMerchant && input.kind === "address") {
    const previous = mapMerchantContactToPrimary(input.previousMerchant, input.mapping);
    if (previous.address) {
      body.previousAddress = previous.address;
    }
  }

  return body;
}
