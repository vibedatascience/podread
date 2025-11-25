import Stripe from 'stripe';

// Only initialize Stripe if we have the secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
    ? new Stripe(stripeSecretKey, { apiVersion: '2025-11-17.clover' })
    : null as unknown as Stripe;

export const PRICE_ID = process.env.STRIPE_PRICE_ID || '';
