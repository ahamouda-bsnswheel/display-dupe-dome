import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthImage } from "@/hooks/use-auth-image";

interface OrgChartEmployeeCardProps {
  name: string;
  position: string;
  imageUrl?: string;
  isCurrentUser?: boolean;
}

export const OrgChartEmployeeCard = ({ 
  name, 
  position, 
  imageUrl,
  isCurrentUser = false 
}: OrgChartEmployeeCardProps) => {
  const { blobUrl } = useAuthImage(imageUrl);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-card rounded-2xl border-2 border-border p-4 w-full">
        <div className="flex flex-col items-center">
          <Avatar className="h-16 w-16 mb-3">
            <AvatarImage src={blobUrl} alt={name} />
            <AvatarFallback className="bg-muted">
              {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-semibold text-primary text-center mb-1 leading-tight">
            {name}
          </p>
          <p className="text-xs text-muted-foreground text-center leading-tight">
            {position}
          </p>
        </div>
      </div>
    </div>
  );
};
