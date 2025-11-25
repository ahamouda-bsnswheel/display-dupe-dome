import { useState, useEffect } from 'react';
import { authStorage } from '@/lib/auth';

export const useAuthImage = (imageUrl: string | undefined) => {
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setBlobUrl(undefined);
      return;
    }

    let objectUrl: string | undefined;
    const controller = new AbortController();

    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const headers = authStorage.getAuthHeaders();
        
        const response = await fetch(imageUrl, {
          headers,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err);
          console.error('Error fetching auth image:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();

    // Cleanup function to revoke the object URL
    return () => {
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageUrl]);

  return { blobUrl, isLoading, error };
};
