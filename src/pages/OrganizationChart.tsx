import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authStorage, getSecureImageUrl } from "@/lib/auth";
import { useAuthImage } from "@/hooks/use-auth-image";
import { OrgChartEmployeeCard } from "@/components/OrgChartEmployeeCard";

interface OrgChartEmployee {
  id: string;
  name: string;
  job: string;
  type: string;
  level: number;
  image_url: string;
}

interface Employee {
  name: string;
  position: string;
  image?: string;
}

const OrganizationChart = () => {
  const navigate = useNavigate();
  const employeeData = authStorage.getEmployeeData();
  const [orgChartData, setOrgChartData] = useState<OrgChartEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hook for manager image
  const managerImageUrl = orgChartData.find(emp => emp.type === "manager")?.image_url;
  const { blobUrl: managerBlobUrl } = useAuthImage(getSecureImageUrl(managerImageUrl));

  useEffect(() => {
    const fetchOrgChart = async () => {
      if (!employeeData?.id) return;

      try {
        const apiKey = authStorage.getApiKey();
        if (!apiKey) {
          console.error("No API key found");
          return;
        }

        const response = await fetch(
          `https://bsnswheel.org/api/v1/org_chart/custom/${employeeData.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Organization chart data:", data);
        setOrgChartData(data.result || []);
      } catch (error) {
        console.error("Error fetching organization chart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgChart();
  }, [employeeData?.id]);

  // Build organizational hierarchy from org chart data
  const manager = orgChartData.find(emp => emp.type === "manager");
  const currentUser = orgChartData.find(emp => emp.type === "self");
  const teamMembers = orgChartData.filter(emp => emp.type === "sama");

  const employees: Employee[] = [
    ...(currentUser ? [{
      name: currentUser.name,
      position: currentUser.job.trim(),
      image: getSecureImageUrl(currentUser.image_url),
    }] : []),
    ...teamMembers.map(emp => ({
      name: emp.name,
      position: emp.job.trim(),
      image: getSecureImageUrl(emp.image_url),
    }))
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="text-base sm:text-lg font-medium">Organization Chart</span>
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 sm:p-4 md:p-6 pb-8">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading organization chart...</p>
            </div>
          ) : (
            <>
              {/* Top Level / Manager */}
              {manager && (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="bg-card rounded-2xl border-2 border-border p-4 w-full max-w-[280px]">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-3">
                          <AvatarImage src={managerBlobUrl} alt={manager.name} />
                          <AvatarFallback className="bg-muted">
                            {manager.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold text-primary text-center mb-1">
                          {manager.name}
                        </p>
                        <p className="text-xs text-muted-foreground text-center">{manager.job.trim()}</p>
                      </div>
                    </div>
                    
                    {/* Connecting Line */}
                    {employees.length > 0 && <div className="w-0.5 h-8 bg-border" />}
                  </div>
                </>
              )}

              {/* Team Members Grid */}
              {employees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {employees.map((employee) => {
                    const empData = orgChartData.find(e => e.name === employee.name);
                    return (
                      <OrgChartEmployeeCard
                        key={empData?.id || employee.name}
                        employeeId={empData?.id || ''}
                        name={employee.name}
                        position={employee.position}
                        imageUrl={employee.image}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No team members found</p>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrganizationChart;
