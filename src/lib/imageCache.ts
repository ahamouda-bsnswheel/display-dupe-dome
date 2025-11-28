// Simple image preload cache to prevent re-downloading on SPA navigation
const imageCache = new Map<string, HTMLImageElement>();

export const preloadImage = (src: string): Promise<void> => {
  if (imageCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
};

export const isImageCached = (src: string): boolean => {
  return imageCache.has(src);
};

// Preload critical images at app startup
export const preloadCriticalImages = (): void => {
  preloadImage("/images/competency-puzzle.png");
};
