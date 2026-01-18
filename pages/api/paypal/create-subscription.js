// /pages/api/paypal/create-subscription.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_PLAN_ID, PAYPAL_BASE_URL } = process.env;

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET || !PAYPAL_PLAN_ID || !PAYPAL_BASE_URL) {
      return res.status(500).json({ error: "Missing PayPal env vars" });
    }

    // 1) Get access token
    const basicAuth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

    const tokenResp = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenResp.json();
    if (!tokenResp.ok) {
      return res.status(tokenResp.status).json({ error: "Token error", details: tokenData });
    }

    const accessToken = tokenData.access_token;

    // 2) Create subscription
    // You can customize subscriber / application_context. Keep it simple first.
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || // optional if you add it
      (req.headers["x-forwarded-proto"] ? `${req.headers["x-forwarded-proto"]}://${req.headers.host}` : `https://${req.headers.host}`);

    const returnUrl = `${baseUrl}/paypal/success`;
    const cancelUrl = `${baseUrl}/paypal/cancel`;

    const subResp = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `cbpump-${Date.now()}`, // idempotency key
      },
      body: JSON.stringify({
        plan_id: PAYPAL_PLAN_ID,
        application_context: {
          brand_name: "CBPUMP",
          locale: "en-GB",
          shipping_preference: "NO_SHIPPING",
          user_action: "SUBSCRIBE_NOW",
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      }),
    });

    const subData = await subResp.json();
    if (!subResp.ok) {
      return res.status(subResp.status).json({ error: "Create subscription error", details: subData });
    }

    const approvalLink = subData.links?.find((l) => l.rel === "approve")?.href;

    if (!approvalLink) {
      return res.status(500).json({ error: "No approval link returned", details: subData });
    }

    return res.status(200).json({
      id: subData.id,
      status: subData.status,
      approvalUrl: approvalLink,
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}
