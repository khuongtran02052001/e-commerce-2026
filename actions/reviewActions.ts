'use server';

import { auth } from '@/lib/auth';
import axiosClient from '@/lib/axiosClient';

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
    if (!session?.user?.email) {
      return { success: false, message: 'You must be logged in to submit a review' };
    }

    const res = await axiosClient.post('/reviews', {
      ...data,
      userEmail: session.user.email,
    });

    return res.data;
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
    const res = await axiosClient.get(`/reviews/product/${productId}`);
    return res.data;
  } catch (error) {
    console.error('getProductReviews error:', error);
    return null;
  }
}

export async function markReviewHelpful(reviewId: string): Promise<ReviewResponse> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: 'You must be logged in' };
    }

    const res = await axiosClient.patch(`/reviews/${reviewId}/helpful`, {
      userEmail: session.user.email,
    });

    return res.data;
  } catch (error: any) {
    console.error('markReviewHelpful error:', error);
    return {
      success: false,
      message: 'Failed to mark review',
      error: error?.response?.data?.message || error.message,
    };
  }
}

export async function canUserReviewProduct(productId: string) {
  try {
    const session = await auth();

    const email = session?.user?.email ?? null;

    const res = await axiosClient.get(`/reviews/can-review/${productId}`, {
      params: { email },
    });

    return res.data;
  } catch (error) {
    console.error('canUserReviewProduct error:', error);
    return {
      canReview: false,
      hasAlreadyReviewed: false,
      hasPurchased: false,
    };
  }
}

export async function approveReview(reviewId: string, adminEmail: string): Promise<ReviewResponse> {
  try {
    const res = await axiosClient.patch(`/reviews/${reviewId}/approve`, {
      adminEmail,
    });
    return res.data;
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
    const res = await axiosClient.patch(`/reviews/${reviewId}/reject`, {
      adminNotes,
    });
    return res.data;
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
    const res = await axiosClient.get('/reviews/pending');
    return res.data;
  } catch (error) {
    console.error('getPendingReviews error:', error);
    return [];
  }
}
