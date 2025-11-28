// Image preloader that caches images in memory
const imageCache: Map<string, string> = new Map();
const loadingPromises: Map<string, Promise<string>> = new Map();

export const preloadImage = (src: string): Promise<string> => {
  // Return cached URL if already loaded
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
  }

  // Return existing promise if already loading
  if (loadingPromises.has(src)) {
    return loadingPromises.get(src)!;
  }

  // Create new loading promise
  const promise = new Promise<string>((resolve) => {
    fetch(src)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        imageCache.set(src, blobUrl);
        loadingPromises.delete(src);
        resolve(blobUrl);
      })
      .catch(() => {
        // Fallback to original src on error
        imageCache.set(src, src);
        loadingPromises.delete(src);
        resolve(src);
      });
  });

  loadingPromises.set(src, promise);
  return promise;
};

export const getPreloadedImage = (src: string): string | undefined => {
  return imageCache.get(src);
};

// Preload critical images at startup
export const preloadCriticalImages = () => {
  preloadImage("/images/competency-puzzle.png");
};
