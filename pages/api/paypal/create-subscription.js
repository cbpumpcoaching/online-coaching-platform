export default async function handler(req, res) {
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

    // 1) Check env vars clearly
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET || !PAYPAL_PLAN_ID || !PAYPAL_BASE_URL) {
      return res.status(500).json({
        error: "Missing env vars on the server (Vercel)",
        env: {
          PAYPAL_CLIENT_ID: !!PAYPAL_CLIENT_ID,
          PAYPAL_SECRET: !!PAYPAL_SECRET,
          PAYPAL_PLAN_ID: !!PAYPAL_PLAN_ID,
          PAYPAL_BASE_URL: !!PAYPAL_BASE_URL,
          NEXT_PUBLIC_APP_URL: !!NEXT_PUBLIC_APP_URL,
        },
      });
    }

    const appUrl =
      NEXT_PUBLIC_APP_URL ||
      (req.headers["x-forwarded-proto"]
        ? `${req.headers["x-forwarded-proto"]}://${req.headers.host}`
        : `https://${req.headers.host}`);

    // 2) Get PayPal access token
    const basicAuth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

    const tokenRes = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenText = await tokenRes.text();
    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch {
      return res.status(500).json({
        error: "PayPal token response was not JSON",
        status: tokenRes.status,
        body: tokenText.slice(0, 500),
      });
    }

    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json({
        error: "PayPal token request failed",
        details: tokenData,
      });
    }

    const accessToken = tokenData.access_token;

    // 3) Create subscription
    const subRes = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `cbpump-${Date.now()}`,
      },
      body: JSON.stringify({
        plan_id: PAYPAL_PLAN_ID,
        application_context: {
          brand_name: "CBPUMP",
          locale: "en-GB",
          user_action: "SUBSCRIBE_NOW",
          shipping_preference: "NO_SHIPPING",
          return_url: `${appUrl}/paypal/success`,
          cancel_url: `${appUrl}/paypal/cancel`,
        },
      }),
    });

    const subText = await subRes.text();
    let subData;
    try {
      subData = JSON.parse(subText);
    } catch {
      return res.status(500).json({
        error: "PayPal create subscription response was not JSON",
        status: subRes.status,
        body: subText.slice(0, 500),
      });
    }

    if (!subRes.ok) {
      return res.status(subRes.status).json({
        error: "PayPal subscription creation failed",
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
      error: "Server crashed (catch block)",
      details: String(err),
    });
  }
}
