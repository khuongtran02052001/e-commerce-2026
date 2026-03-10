/**
 * Compatibility wrapper for legacy Sanity image objects.
 * Now supports plain URLs or REST image objects.
 */

type ImageSource =
  | string
  | {
      url?: string;
      imageUrl?: string;
      mainImageUrl?: string;
    }
  | null
  | undefined;

export const urlFor = (source: ImageSource) => {
  const url =
    typeof source === 'string'
      ? source
      : source?.url || source?.imageUrl || source?.mainImageUrl;

  return {
    url: () => url || '/placeholder.png',
  };
};