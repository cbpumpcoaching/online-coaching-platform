export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Placeholder response
  // Next step: connect real PayPal subscription API
  return res.status(200).json({
    subscriptionID: "CBPUMP_PAYPAL_SUBSCRIPTION_PLACEHOLDER",
  });
}
