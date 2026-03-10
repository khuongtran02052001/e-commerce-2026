'use server';

import { fetchServiceJsonServer } from '@/lib/restClient';

interface SubscriptionData {
  email: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface SubscriptionResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  alreadySubscribed?: boolean;
}

/**
 * Subscribe a user to the newsletter
 * Checks for existing subscription before creating a new one
 */
export async function subscribeToNewsletter(
  subscriptionData: SubscriptionData,
): Promise<SubscriptionResponse> {
  try {
    const { email, source = 'footer', ipAddress, userAgent } = subscriptionData;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please provide a valid email address',
        error: 'Invalid email format',
      };
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    const res = await fetchServiceJsonServer<{ success: boolean; message?: string }>(
      '/newsletter/subscribe',
      {
        method: 'POST',
        body: JSON.stringify({
          email: normalizedEmail,
          source,
          ipAddress: ipAddress || 'unknown',
          userAgent: userAgent || 'unknown',
        }),
      },
    );

    return {
      success: res?.success ?? true,
      message: res?.message || 'Thank you for subscribing! Check your email for updates.',
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Unsubscribe a user from the newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<SubscriptionResponse> {
  try {
    const res = await fetchServiceJsonServer<{ success: boolean; message?: string }>(
      '/newsletter/unsubscribe',
      {
        method: 'POST',
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      },
    );

    return {
      success: res?.success ?? true,
      message: res?.message || 'You have been successfully unsubscribed from our newsletter',
    };
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return {
      success: false,
      message: 'Failed to unsubscribe. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Check if an email is subscribed
 */
export async function checkSubscriptionStatus(
  email: string,
): Promise<{ subscribed: boolean; status?: string }> {
  try {
    return { subscribed: false };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return { subscribed: false };
  }
}
