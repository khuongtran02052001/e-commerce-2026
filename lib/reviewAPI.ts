// Client-side API service for reviews
import { fetchService } from '@/lib/restClient';

export interface SubmitReviewData {
  productId: string;
  rating: number;
  title: string;
  content: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  reviewId?: string;
  error?: string;
}

export interface ProductReviewsData {
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
      profileImage?: {
        asset: {
          url: string;
        };
      };
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

// Submit a new review
export async function submitReviewAPI(data: SubmitReviewData): Promise<ReviewResponse> {
  try {
    const response = await fetchService('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Failed to submit review',
      };
    }

    return result;
  } catch (error) {
    console.error('Error submitting review:', error);
    return {
      success: false,
      message: 'Failed to submit review. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Get reviews for a product
export async function getProductReviewsAPI(productId: string): Promise<ProductReviewsData | null> {
  try {
    const response = await fetchService(`/reviews?productId=${productId}`);

    if (!response.ok) {
      console.error('Failed to fetch reviews');
      return null;
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return null;
  }
}

// Mark a review as helpful
export async function markReviewHelpfulAPI(reviewId: string): Promise<ReviewResponse> {
  try {
    const response = await fetchService(`/reviews/${reviewId}/helpful`, { method: 'PATCH' });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Failed to update review',
      };
    }

    return result;
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    return {
      success: false,
      message: 'Failed to update review',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
