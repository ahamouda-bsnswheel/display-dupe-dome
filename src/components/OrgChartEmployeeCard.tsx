import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthImage } from "@/hooks/use-auth-image";
import { useNavigate } from "react-router-dom";

interface OrgChartEmployeeCardProps {
  employeeId: string;
  name: string;
  position: string;
  imageUrl?: string;
  isCurrentUser?: boolean;
}

export const OrgChartEmployeeCard = ({ 
  employeeId,
  name, 
  position, 
  imageUrl,
  isCurrentUser = false 
}: OrgChartEmployeeCardProps) => {
  const { blobUrl } = useAuthImage(imageUrl);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => navigate(`/employee/${employeeId}`)}
        className="bg-card rounded-2xl border-2 border-border p-4 w-full hover:border-primary/50 transition-colors"
      >
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
      </button>
    </div>
  );
};
