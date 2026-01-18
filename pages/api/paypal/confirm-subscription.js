async function getAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_BASE_URL } = process.env;

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));

  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { subscriptionId } = req.body;
    if (!subscriptionId) {
      return res.status(400).json({ error: "Missing subscriptionId" });
    }

    const accessToken = await getAccessToken();

    const paypalRes = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const data = await paypalRes.json();

    if (!paypalRes.ok) {
      return res
        .status(paypalRes.status)
        .json({ error: "PayPal verification failed", details: data });
    }

    if (data.status !== "ACTIVE") {
      return res.status(400).json({
        error: "Subscription not active",
        status: data.status,
      });
    }

    // ✅ Later: save to DB
    return res.status(200).json({
      ok: true,
      subscriptionId: data.id,
      status: data.status,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: String(err),
    });
  }
}
