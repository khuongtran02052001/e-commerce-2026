'use client';
/**
 * Legacy compatibility:
 * supports both REST `image.url` and old Sanity image object via `urlFor`.
 * Remove Sanity branch when all product images are normalized to URL strings.
 */
import { urlFor } from '@/lib/image';
import { IProductImageMock } from '@/mock-data';
// import { urlFor } from '@/sanity/lib/image';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
  images?: IProductImageMock[];
  isStock?: number;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [active, setActive] = useState(images[0]);
  const resolveImageSrc = (image?: IProductImageMock) => {
    if (!image) return '';
    if (image.url) return image.url;
    return urlFor(image).url();
  };
  return (
    <div className="w-full space-y-2 md:space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={active?.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-h-[550px] min-h-[450px] border border-dark-color/10 rounded-md group overflow-hidden"
        >
          <Image
            src={resolveImageSrc(active)}
            alt="productImage"
            width={700}
            height={700}
            priority
            className={`w-full h-96 max-h-[550px] min-h-[500px] object-contain group-hover:scale-110 hoverEffect rounded-md ${
              isStock === 0 ? 'opacity-50' : ''
            }`}
          />
        </motion.div>
      </AnimatePresence>
      <div className="grid grid-cols-6 gap-2 h-20 md:h-24">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setActive(image)}
            className={`border rounded-md overflow-hidden ${
              active.id === image.id ? 'ring-1 ring-dark-color' : ''
            }`}
          >
            <Image
              src={resolveImageSrc(image)}
              alt={`Thumbnail ${image.id}`}
              width={100}
              height={100}
              className="w-full h-auto object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageView;
