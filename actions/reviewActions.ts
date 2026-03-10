'use server';

import { auth } from '@/lib/auth';
import { fetchServiceJsonServer } from '@/lib/restClient';

interface SubmitReviewData {
  productId: string;
  rating: number;
  title: string;
  content: string;
}

interface ReviewResponse {
  success: boolean;
  message: string;
  reviewId?: string;
  error?: string;
}

interface ProductReviewsData {
  reviews: Array<{
    id: string;
    rating: number;
    title: string;
    content: string;
    helpful: number;
    isVerifiedPurchase: boolean;
    createdAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
  }>;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    fiveStars: number;
    fourStars: number;
    threeStars: number;
    twoStars: number;
    oneStar: number;
  };
}

export async function submitReview(data: SubmitReviewData): Promise<ReviewResponse> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return { success: false, message: 'You must be logged in to submit a review' };
    }

    return await fetchServiceJsonServer<ReviewResponse>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
      accessToken: session.accessToken,
    });
  } catch (error: any) {
    console.error('submitReview error:', error);
    return {
      success: false,
      message: 'Failed to submit review',
      error: error?.response?.data?.message || error.message,
    };
  }
}

export async function getProductReviews(productId: string): Promise<ProductReviewsData | null> {
  try {
    const query = new URLSearchParams({ productId }).toString();
    return await fetchServiceJsonServer<ProductReviewsData>(`/reviews?${query}`);
  } catch (error) {
    console.error('getProductReviews error:', error);
    return null;
  }
}

export async function markReviewHelpful(reviewId: string): Promise<ReviewResponse> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return { success: false, message: 'You must be logged in' };
    }
    return await fetchServiceJsonServer<ReviewResponse>(`/reviews/${reviewId}/helpful`, {
      method: 'PATCH',
      accessToken: session.accessToken,
    });
  } catch (error: any) {
    console.error('markReviewHelpful error:', error);
    return {
      success: false,
      message: 'Failed to mark review',
      error: error?.response?.data?.message || error.message,
    };
  }
}

export async function canUserReviewProduct(productId: string): Promise<{
  canReview: boolean;
  hasAlreadyReviewed: boolean;
  hasPurchased: boolean;
}> {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return {
        canReview: false,
        hasAlreadyReviewed: false,
        hasPurchased: false,
      };
    }
    const query = new URLSearchParams({ productId }).toString();
    return await fetchServiceJsonServer(`/reviews/can-review?${query}`, {
      accessToken: session.accessToken,
    });
  } catch (error) {
    return {
      canReview: false,
      hasAlreadyReviewed: false,
      hasPurchased: false,
    };
  }
}

export async function approveReview(reviewId: string, adminEmail: string): Promise<ReviewResponse> {
  try {
    const session = await auth();
    return await fetchServiceJsonServer<ReviewResponse>('/admin/reviews', {
      method: 'PATCH',
      body: JSON.stringify({
        reviewId,
        action: 'approve',
        adminNotes: `Approved by ${adminEmail}`,
      }),
      accessToken: session?.accessToken,
    });
  } catch (error: any) {
    console.error('approveReview error:', error);
    return {
      success: false,
      message: 'Failed to approve review',
      error: error?.response?.data?.message || error.message,
    };
  }
}

export async function rejectReview(reviewId: string, adminNotes?: string): Promise<ReviewResponse> {
  try {
    const session = await auth();
    return await fetchServiceJsonServer<ReviewResponse>('/admin/reviews', {
      method: 'PATCH',
      body: JSON.stringify({
        reviewId,
        action: 'reject',
        adminNotes,
      }),
      accessToken: session?.accessToken,
    });
  } catch (error: any) {
    console.error('rejectReview error:', error);
    return {
      success: false,
      message: 'Failed to reject review',
      error: error?.response?.data?.message || error.message,
    };
  }
}

export async function getPendingReviews() {
  try {
    const session = await auth();
    const query = new URLSearchParams({ status: 'pending' }).toString();
    return await fetchServiceJsonServer(`/admin/reviews?${query}`, {
      accessToken: session?.accessToken,
    });
  } catch (error) {
    console.error('getPendingReviews error:', error);
    return [];
  }
}
