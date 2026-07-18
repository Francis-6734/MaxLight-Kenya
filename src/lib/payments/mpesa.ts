/**
 * M-Pesa Daraja (Safaricom) STK Push integration.
 *
 * This is structurally complete and ready to go live the moment real
 * credentials are added to `.env` — until then, every function throws
 * `PaymentNotConfiguredError`, which callers should catch and surface as a
 * friendly "payments aren't set up yet" message rather than a crash.
 *
 * Get credentials (sandbox first): https://developer.safaricom.co.ke
 */

export class PaymentNotConfiguredError extends Error {
  constructor(provider: string) {
    super(`${provider} is not configured. Add the required environment variables to enable it.`);
    this.name = "PaymentNotConfiguredError";
  }
}

interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  callbackUrl: string;
  baseUrl: string;
}

function getConfig(): MpesaConfig {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  if (!consumerKey || !consumerSecret || !shortcode || !passkey || !callbackUrl) {
    throw new PaymentNotConfiguredError("M-Pesa");
  }

  const env = process.env.MPESA_ENV ?? "sandbox";
  const baseUrl = env === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

  return { consumerKey, consumerSecret, shortcode, passkey, callbackUrl, baseUrl };
}

async function getAccessToken(config: MpesaConfig): Promise<string> {
  const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
  const res = await fetch(`${config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) throw new Error(`M-Pesa auth failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

function daraTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export interface StkPushRequest {
  /** Kenyan phone number in 2547XXXXXXXX format */
  phoneNumber: string;
  /** Amount in whole KES */
  amount: number;
  /** Shows up on the customer's STK prompt */
  accountReference: string;
  transactionDesc: string;
}

export interface StkPushResponse {
  merchantRequestId: string;
  checkoutRequestId: string;
  responseDescription: string;
}

export async function initiateStkPush(req: StkPushRequest): Promise<StkPushResponse> {
  const config = getConfig();
  const token = await getAccessToken(config);
  const timestamp = daraTimestamp();
  const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString("base64");

  const res = await fetch(`${config.baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(req.amount),
      PartyA: req.phoneNumber,
      PartyB: config.shortcode,
      PhoneNumber: req.phoneNumber,
      CallBackURL: config.callbackUrl,
      AccountReference: req.accountReference,
      TransactionDesc: req.transactionDesc,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`M-Pesa STK push failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseDescription: string;
  };

  return {
    merchantRequestId: data.MerchantRequestID,
    checkoutRequestId: data.CheckoutRequestID,
    responseDescription: data.ResponseDescription,
  };
}

/** Shape of the payload Safaricom POSTs to MPESA_CALLBACK_URL after STK push resolves. */
export interface MpesaCallbackPayload {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: { Name: string; Value?: string | number }[];
      };
    };
  };
}

export function isMpesaConfigured(): boolean {
  try {
    getConfig();
    return true;
  } catch {
    return false;
  }
}
