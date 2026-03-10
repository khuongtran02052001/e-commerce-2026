'use client';

 import { memo, useState } from 'react';

 interface Props {
   src?: string;
   alt?: string;
   className?: string;
 }

 const FALLBACK_SRC = '/images/placeholder.webp';

 const ProductImage = memo(({ src, alt, className }: Props) => {
   const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_SRC);

   return (
     <img
       src={currentSrc || FALLBACK_SRC}
       onError={() => setCurrentSrc(FALLBACK_SRC)}
       className={className}
       alt={alt || 'Product image'}
       loading="lazy"
     />
   );
 });

 ProductImage.displayName = 'ProductImage';

 export default ProductImage;
