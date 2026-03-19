'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { submitReviewAPI } from '@/lib/reviewAPI';
import { Loader2, Star, StarIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface ReviewSidebarProps {
  productId: string;
  productName: string;
  isVerifiedPurchase?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

const ReviewSidebar = React.memo(
  ({
    productId,
    productName,
    isVerifiedPurchase,
    isOpen,
    onClose,
    onReviewSubmitted,
  }: ReviewSidebarProps) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = useCallback(() => {
      setRating(0);
      setHoverRating(0);
      setTitle('');
      setContent('');
    }, []);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
          toast.error('Please select a rating');
          return;
        }

        if (title.trim().length < 5) {
          toast.error('Title must be at least 5 characters');
          return;
        }

        if (content.trim().length < 20) {
          toast.error('Review must be at least 20 characters');
          return;
        }

        setIsSubmitting(true);

        try {
          const result = await submitReviewAPI({
            productId,
            rating,
            title: title.trim(),
            content: content.trim(),
          });

          if (result.success) {
            toast.success(result.message);
            resetForm();
            onClose();
            if (onReviewSubmitted) {
              onReviewSubmitted();
            }
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error('Failed to submit review. Please try again.');
          console.error('Error submitting review:', error);
        } finally {
          setIsSubmitting(false);
        }
      },
      [rating, title, content, productId, onClose, onReviewSubmitted, resetForm],
    );

    const handleRatingClick = useCallback((value: number) => {
      setRating(value);
    }, []);

    const handleRatingHover = useCallback((value: number) => {
      setHoverRating(value);
    }, []);

    const handleRatingLeave = useCallback(() => {
      setHoverRating(0);
    }, []);

    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (!open && !isSubmitting) {
          onClose();
          // Reset form when closing
          setTimeout(resetForm, 300);
        }
      },
      [isSubmitting, onClose, resetForm],
    );

    const titleLength = title.length;
    const contentLength = content.length;
    const isTitleValid = titleLength >= 5;
    const isContentValid = contentLength >= 20;

    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-shop_dark_green">
              <Star className="w-5 h-5" />
              Write a Review
            </SheetTitle>
            <SheetDescription className="text-left">
              Share your experience with <span className="font-semibold">{productName}</span>
            </SheetDescription>
            {isVerifiedPurchase && (
              <div className="mt-2 rounded-md border border-shop_light_green/18 bg-shop_light_pink/55 p-3">
                <p className="text-sm font-medium text-shop_dark_green">
                  ✓ This will be marked as a verified purchase
                </p>
              </div>
            )}
          </SheetHeader>

          <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-180px)] mt-6">
            <div className="flex-1 space-y-6 overflow-y-auto px-4">
              {/* Rating Section */}
              <div className="space-y-3">
                <Label htmlFor="rating" className="text-base font-semibold text-shop_dark_green">
                  Your Rating <span className="text-[#cf6f93]">*</span>
                </Label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingClick(value)}
                        onMouseEnter={() => handleRatingHover(value)}
                        onMouseLeave={handleRatingLeave}
                        className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-shop_light_green focus:ring-offset-2 rounded"
                        aria-label={`Rate ${value} stars`}
                        disabled={isSubmitting}
                      >
                        <StarIcon
                          size={40}
                          className={`${
                            value <= (hoverRating || rating)
                              ? 'text-shop_light_green fill-shop_light_green'
                              : 'text-shop_light_green/30'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-shop_light_pink/70">
                        <div
                          className="h-full bg-shop_light_green transition-all duration-300"
                          style={{ width: `${(rating / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-shop_dark_green min-w-[80px]">
                        {rating} {rating === 1 ? 'star' : 'stars'}
                      </span>
                    </div>
                  )}
                  {rating === 0 && (
                    <p className="text-sm text-dark-text">Click to rate this product</p>
                  )}
                </div>
              </div>

              {/* Title Section */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold text-shop_dark_green">
                  Review Title <span className="text-[#cf6f93]">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Sum up your experience in a few words"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  required
                  disabled={isSubmitting}
                  className={`border-shop_light_green/20 focus:border-shop_light_green ${
                    titleLength > 0 && !isTitleValid ? 'border-[#edbfd2]' : ''
                  }`}
                />
                <div className="flex items-center justify-between">
                  <p
                    className={`text-xs ${
                      titleLength > 0 && !isTitleValid
                        ? 'text-[#c56a8f]'
                        : titleLength >= 5
                          ? 'text-shop_dark_green'
                          : 'text-dark-text'
                    }`}
                  >
                    {titleLength < 5
                      ? `${5 - titleLength} more characters needed`
                      : '✓ Title looks good'}
                  </p>
                  <p className="text-xs text-dark-text">{titleLength}/100</p>
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-base font-semibold text-shop_dark_green">
                  Your Review <span className="text-[#cf6f93]">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Tell us more about your experience with this product... What did you like? What could be improved?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={1000}
                  rows={8}
                  required
                  disabled={isSubmitting}
                  className={`resize-none border-shop_light_green/20 focus:border-shop_light_green ${
                    contentLength > 0 && !isContentValid ? 'border-[#edbfd2]' : ''
                  }`}
                />
                <div className="flex items-center justify-between">
                  <p
                    className={`text-xs ${
                      contentLength > 0 && !isContentValid
                        ? 'text-[#c56a8f]'
                        : contentLength >= 20
                          ? 'text-shop_dark_green'
                          : 'text-dark-text'
                    }`}
                  >
                    {contentLength < 20
                      ? `${20 - contentLength} more characters needed`
                      : '✓ Review is detailed enough'}
                  </p>
                  <p className="text-xs text-dark-text">{contentLength}/1000</p>
                </div>
              </div>

              {/* Guidelines */}
              <div className="space-y-2 rounded-md border border-shop_light_blue/35 bg-shop_light_blue/35 p-4">
                <h4 className="text-sm font-semibold text-shop_dark_blue">Review Guidelines</h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-shop_dark_blue">
                  <li>Be honest and constructive in your feedback</li>
                  <li>Focus on your experience with the product</li>
                  <li>Your review will be published after admin approval</li>
                  <li>Avoid offensive language or personal attacks</li>
                </ul>
              </div>
            </div>

            {/* Footer with Actions */}
            <SheetFooter className="mt-6 pt-6 border-t flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || rating === 0 || !isTitleValid || !isContentValid}
                  className="w-full sm:flex-1 text-white disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    );
  },
);

ReviewSidebar.displayName = 'ReviewSidebar';

export default ReviewSidebar;
