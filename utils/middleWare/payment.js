const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY'); // Replace with your actual secret key

async function processPayment(req, res, next) {
  try {
    // Extract payment details from the request body
    const { amount, currency, token } = req.body;

    // Create a charge using the Stripe API
    const charge = await stripe.charges.create({
      amount: amount,
      currency: currency,
      source: token, // Token obtained from Stripe.js or similar
      description: 'Payment for your service',
    });

    // Check if the charge was successful
    if (charge.status === 'succeeded') {
      // Payment was successful, you can store transaction details in your database
      req.paymentInfo = {
        transactionId: charge.id,
        amount: charge.amount,
        currency: charge.currency,
        status: charge.status,
      };

      // Call the next middleware or route handler
      next();
    } else {
      // Payment failed
      res.status(400).json({ error: 'Payment failed', details: charge.failure_message });
    }
  } catch (error) {
    // Handle any errors that occur during the payment process
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment processing error', details: error.message });
  }
}

module.exports = { processPayment };