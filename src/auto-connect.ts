import { parseWebhookEvent, verifyWebhookSignature } from "./webhook.js";

export const AUTO_CONNECT_MATCH_PATH = "/api/next-address/auto-connect/match";

export type AutoConnectMatchHandlerOptions = {
  webhookSecret: string;
  findExternalUserIdByEmail: (email: string) => string | null | Promise<string | null>;
};

function toHeaderRecord(headers: Headers): Record<string, string | string[] | undefined> {
  const out: Record<string, string | string[] | undefined> = {};
  headers.forEach((value, key) => {
    out[key.toLowerCase()] = value;
  });
  return out;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Standard tenant endpoint handler for NextAddress-initiated email matching.
 *
 * Mount this at {@link AUTO_CONNECT_MATCH_PATH}. The tenant only supplies the
 * local lookup from verified email to its stable external user id.
 */
export async function handleAutoConnectMatchRequest(
  request: Request,
  options: AutoConnectMatchHandlerOptions,
): Promise<Response> {
  const secret = options.webhookSecret.trim();
  if (!secret) {
    return json({ error: "webhookSecret is required" }, 500);
  }

  const raw = await request.text();
  try {
    verifyWebhookSignature(raw, toHeaderRecord(request.headers), secret, {
      toleranceSeconds: 300,
    });
  } catch {
    return new Response("Invalid webhook", { status: 401 });
  }

  const event = parseWebhookEvent(raw);
  if (event.event !== "account.email_match.requested") {
    return json({ error: "Unsupported event" }, 422);
  }

  const externalUserId = await options.findExternalUserIdByEmail(event.email);
  if (!externalUserId) {
    return json({ matched: false });
  }

  return json({ matched: true, externalUserId });
}
