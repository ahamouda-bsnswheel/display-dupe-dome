import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authStorage } from "@/lib/auth";

const OrganizationChart = () => {
  const navigate = useNavigate();
  const employeeData = authStorage.getEmployeeData();
  
  const user = {
    name: employeeData?.name || "User",
    position: (employeeData as any)?.position || "Employee",
    image: employeeData?.image,
  };

  const roles = [
    {
      name: "Abdulkareem Essaied Shuia",
      position: "CHRO",
      image: "",
    },
    {
      name: user.name,
      position: user.position,
      image: user.image,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="text-lg font-medium">Organization Chart</span>
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Roles Section */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
              <h3 className="text-base font-semibold text-foreground">Roles</h3>
            </div>
            <div className="space-y-4 ml-5">
              {roles.map((role, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={role.image} alt={role.name} />
                    <AvatarFallback className="bg-muted">
                      {role.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{role.name}</p>
                    <p className="text-sm text-muted-foreground">{role.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrganizationChart;
