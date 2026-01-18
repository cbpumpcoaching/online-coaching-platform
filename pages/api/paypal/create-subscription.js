export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      PAYPAL_CLIENT_ID,
      PAYPAL_SECRET,
      PAYPAL_PLAN_ID,
      PAYPAL_BASE_URL,
      NEXT_PUBLIC_APP_URL,
    } = process.env;

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET || !PAYPAL_PLAN_ID || !PAYPAL_BASE_URL) {
      return res.status(500).json({
        error: "Missing PayPal environment variables",
        details: {
          hasClientId: !!PAYPAL_CLIENT_ID,
          hasSecret: !!PAYPAL_SECRET,
          hasPlanId: !!PAYPAL_PLAN_ID,
          hasBaseUrl: !!PAYPAL_BASE_URL,
        },
      });
    }

    const appUrl =
      NEXT_PUBLIC_APP_URL ||
      (req.headers["x-forwarded-proto"]
        ? `${req.headers["x-forwarded-proto"]}://${req.headers.host}`
        : `https://${req.headers.host}`);

    // 1) Get access token
    const basicAuth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

    const tokenRes = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json({
        error: "Failed to get PayPal access token",
        details: tokenData,
      });
    }

    const accessToken = tokenData.access_token;

    // 2) Create subscription
    const returnUrl = `${appUrl}/paypal/success`;
    const cancelUrl = `${appUrl}/paypal/cancel`;

    const subRes = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        // idempotency header (safe)
        "PayPal-Request-Id": `cbpump-${Date.now()}`,
      },
      body: JSON.stringify({
        plan_id: PAYPAL_PLAN_ID,
        application_context: {
          brand_name: "CBPUMP",
          locale: "en-GB",
          user_action: "SUBSCRIBE_NOW",
          shipping_preference: "NO_SHIPPING",
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      }),
    });

    const subData = await subRes.json();

    if (!subRes.ok) {
      return res.status(subRes.status).json({
        error: "Failed to create PayPal subscription",
        details: subData,
      });
    }

    const approvalUrl = subData.links?.find((l) => l.rel === "approve")?.href;

    if (!approvalUrl) {
      return res.status(500).json({
        error: "No approval URL returned from PayPal",
        details: subData,
      });
    }

    return res.status(200).json({
      subscriptionId: subData.id,
      approvalUrl,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: String(err),
    });
  }
}
