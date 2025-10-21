require('dotenv').config();

async function processPayment(req, res, next) {
  try {
    // Extract payment details from the request body
    const { amount, currency = 'usd' } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    }

    // Check if we have a valid stripe key
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_')) {
      console.warn('Stripe not configured. Using mock payment processing for development.');
      
      // Mock payment processing for development
      req.paymentInfo = {
        transactionId: `mock_txn_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: currency,
        status: 'succeeded',
        clientSecret: `mock_client_secret_${Date.now()}`,
      };
      
      return next();
    }

    // Initialize Stripe only when we have a valid key
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // Create a payment intent using the Stripe API (more secure than charges)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: currency,
      // In a real application, you would attach customer details and use a payment method
      // rather than a deprecated token
      description: 'Payment for order',
      metadata: { integration_check: 'accept_a_payment' }
    });

    // Check if the payment intent was created successfully
    if (paymentIntent) {
      // Attach payment information to the request object
      req.paymentInfo = {
        transactionId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret,
      };

      // Call the next middleware or route handler
      next();
    } else {
      // Payment intent creation failed
      res.status(400).json({ error: 'Payment intent creation failed' });
    }
  } catch (error) {
    // Handle any errors that occur during the payment process
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment processing error', details: error.message });
  }
}

module.exports = { processPayment };