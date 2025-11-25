import { useAuthImage } from "@/hooks/use-auth-image";
import { Skeleton } from "@/components/ui/skeleton";

interface BadgeImageProps {
  imageUrl: string;
  alt: string;
  className?: string;
}

export const BadgeImage = ({ imageUrl, alt, className = "" }: BadgeImageProps) => {
  const { blobUrl, isLoading } = useAuthImage(imageUrl);

  if (isLoading) {
    return <Skeleton className={`rounded-full ${className}`} />;
  }

  if (!blobUrl) {
    // Fallback to a default badge icon
    return (
      <div className={`rounded-full bg-primary/10 flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 rounded-full bg-primary/80" />
      </div>
    );
  }

  return (
    <img 
      src={blobUrl} 
      alt={alt}
      className={`rounded-full object-cover ${className}`}
    />
  );
};
