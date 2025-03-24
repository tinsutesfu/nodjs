import crypto from 'crypto';

// Middleware to verify Chapa webhook signature
const verifyWebhookSignature = (req, res, next) => {
  try {
    const signature = req.headers['x-chapa-signature'];
    const rawBody = req.body.toString(); // Get raw body
    
    // Generate HMAC signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.CHAPA_SECRET_KEY)
      .update(rawBody)
      .digest('hex');

    // Compare signatures
    if (signature !== generatedSignature) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    next(); // Proceed if valid
  } catch (error) {
    res.status(500).json({ error: "Signature verification failed" });
  }
};


export default verifyWebhookSignature;