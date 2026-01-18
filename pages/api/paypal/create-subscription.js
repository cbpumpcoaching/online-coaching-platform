export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_PLAN_ID, PAYPAL_BASE_URL } = process.env;

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET || !PAYPAL_PLAN_ID || !PAYPAL_BASE_URL) {
      return res.status(500).json({
        error: "Missing PayPal env vars on Vercel",
        env: {
          PAYPAL_CLIENT_ID: !!PAYPAL_CLIENT_ID,
          PAYPAL_SECRET: !!PAYPAL_SECRET,
          PAYPAL_PLAN_ID: !!PAYPAL_PLAN_ID,
          PAYPAL_BASE_URL: !!PAYPAL_BASE_URL,
        },
      });
    }

    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    const appUrl = `${proto}://${host}`;

    // ---- TOKEN ----
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

    const tokenRes = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "Accept-Language": "en_US",
        "User-Agent": "CBPUMP-Vercel-Server",
        "Cache-Control": "no-cache",
      },
      body: "grant_type=client_credentials",
    });

    const tokenText = await tokenRes.text();

    // If PayPal returns HTML again, show it clearly
    if (!tokenRes.ok) {
      // Try JSON first
      try {
        const tokenJson = JSON.parse(tokenText);
        return res.status(tokenRes.status).json({
          error: "PayPal token request failed",
          details: tokenJson,
        });
      } catch {
        return res.status(tokenRes.status).json({
          error: "PayPal token request failed (non-JSON response)",
          status: tokenRes.status,
          body: tokenText.slice(0, 400),
          hint:
            "This usually means PAYPAL_BASE_URL is wrong OR the client id/secret do not match the sandbox app.",
        });
      }
    }

    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch {
      return res.status(500).json({
        error: "PayPal token response was not JSON",
        status: tokenRes.status,
        body: tokenText.slice(0, 400),
      });
    }

    const accessToken = tokenData.access_token;

    // ---- CREATE SUBSCRIPTION ----
    const subRes = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "CBPUMP-Vercel-Server",
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

    if (!subRes.ok) {
      try {
        const subJson = JSON.parse(subText);
        return res.status(subRes.status).json({
          error: "PayPal subscription creation failed",
          details: subJson,
        });
      } catch {
        return res.status(subRes.status).json({
          error: "PayPal subscription creation failed (non-JSON response)",
          status: subRes.status,
          body: subText.slice(0, 400),
        });
      }
    }

    let subData;
    try {
      subData = JSON.parse(subText);
    } catch {
      return res.status(500).json({
        error: "PayPal create subscription response was not JSON",
        status: subRes.status,
        body: subText.slice(0, 400),
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
