import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

// ES module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_your_test_key';
const stripe = new Stripe(stripeSecretKey);

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", "https://lpanxnvmcqjpeszjofpl.supabase.co", "https://api.stripe.com"]
    }
  }
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(compression());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Stripe Payment API routes
const stripeRouter = express.Router();

// Create payment intent
stripeRouter.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency,
      payment_method_types: ['card']
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle Stripe webhook events
stripeRouter.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      // Update order status in your database
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
});

// Chat API routes for the live chat feature
const chatRouter = express.Router();

// Get chat history
chatRouter.get('/history', (req, res) => {
  // This would typically fetch from a database
  res.json([
    { 
      id: 1, 
      sender: 'user', 
      message: 'Hello, I need help with my order', 
      timestamp: new Date(Date.now() - 60000 * 30).toISOString() 
    },
    { 
      id: 2, 
      sender: 'agent', 
      message: 'Hi there! I\'d be happy to help. Could you please provide your order number?', 
      timestamp: new Date(Date.now() - 60000 * 28).toISOString() 
    },
    { 
      id: 3, 
      sender: 'user', 
      message: 'It\'s #12345', 
      timestamp: new Date(Date.now() - 60000 * 26).toISOString() 
    }
  ]);
});

// Send a new message
chatRouter.post('/message', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  // In a real app, this would store the message in a database
  // and potentially trigger a notification to a support agent
  
  // For demo purposes, we'll just echo back a response
  const response = {
    id: Date.now(),
    sender: 'user',
    message,
    timestamp: new Date().toISOString()
  };
  
  res.json(response);
});

// Mount API routers
app.use('/api/stripe', stripeRouter);
app.use('/api/chat', chatRouter);

// Product API routes
const apiRouter = express.Router();

// Get products
apiRouter.get('/products', (req, res) => {
  // This could be replaced with actual database queries if needed
  // For now, we'll return a 501 to indicate it should use Supabase directly
  res.status(501).json({ 
    error: 'Not implemented - use Supabase client directly', 
    message: 'This server is configured to only serve the static frontend. API requests should go directly to Supabase.'
  });
});

// Add more API endpoints as needed

// Mount API router
app.use('/api', apiRouter);

// For all other requests, serve the Vue app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
});