// import { sendOrderStatusNotification } from '@/lib/notificationService';
// import { fetchServiceJsonServer } from '@/lib/restClient';
// import stripe from '@/lib/stripe';
// import { headers } from 'next/headers';
// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';

import { NextRequest } from 'next/server';

// export async function POST(req: NextRequest) {
//   const body = await req.text();
//   const headersList = await headers();
//   const sig = headersList.get('stripe-signature');

//   if (!sig) {
//     return NextResponse.json({ error: 'No signature' }, { status: 400 });
//   }

//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
//   if (!webhookSecret) {
//     return NextResponse.json({ error: 'Stripe webhook secret is not set' }, { status: 400 });
//   }

//   let event: Stripe.Event;
//   try {
//     event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
//   } catch (error) {
//     console.error('Webhook signature verification failed:', error);
//     return NextResponse.json({ error: `Webhook Error: ${error}` }, { status: 400 });
//   }

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object as Stripe.Checkout.Session;
//     const orderId = session.metadata?.orderId;

//     if (!orderId) {
//       return NextResponse.json({ error: 'No orderId found in session metadata' }, { status: 400 });
//     }

//     const accessToken = process.env.SERVICE_SYSTEM_WEBHOOK_TOKEN;
//     if (!accessToken) {
//       console.warn('Missing SERVICE_SYSTEM_WEBHOOK_TOKEN; skipping order update.');
//       return NextResponse.json({ received: true, skipped: true });
//     }

//     try {
//       const result = await fetchServiceJsonServer<{ success: boolean; message?: string }>(
//         `/orders/${orderId}/pay-now`,
//         {
//           method: 'POST',
//           body: JSON.stringify({
//             paymentStatus: 'paid',
//             stripeSessionId: session.id,
//           }),
//           accessToken,
//         },
//       );

//       if (result?.success) {
//         await sendOrderStatusNotification({
//           userEmail: session.customer_details?.email || '',
//           orderNumber: session.metadata?.orderNumber || orderId,
//           orderId,
//           status: 'paid',
//         });
//       }
//     } catch (error) {
//       console.error('Error updating order from webhook:', error);
//       return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
//     }
//   }

//   return NextResponse.json({ received: true });
// }

export async function POST(req: NextRequest) {}
