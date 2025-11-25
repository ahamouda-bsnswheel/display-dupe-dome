import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authStorage, getSecureImageUrl } from "@/lib/auth";
import { useAuthImage } from "@/hooks/use-auth-image";

interface OrgChartEmployee {
  id: number;
  name: string;
  job_title: string;
  image_url: string;
  parent_id: number | null;
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
  
  const user = {
    name: employeeData?.name || "User",
    position: employeeData?.job_title || "Employee",
    image: getSecureImageUrl(employeeData?.image_url),
  };

  const { blobUrl: userImageUrl } = useAuthImage(user.image);

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
            method: "GET",
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
        setOrgChartData(data || []);
      } catch (error) {
        console.error("Error fetching organization chart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgChart();
  }, [employeeData?.id]);

  // Build organizational hierarchy from org chart data
  const topLevel = orgChartData.find(emp => emp.parent_id === null);
  const subordinates = orgChartData.filter(emp => emp.parent_id !== null);

  const employees: Employee[] = subordinates.map(emp => ({
    name: emp.name,
    position: emp.job_title,
    image: getSecureImageUrl(emp.image_url),
  }));

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
        <div className="p-4 pb-8">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading organization chart...</p>
            </div>
          ) : (
            <>
              {/* Top Level / Manager */}
              {topLevel && (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="bg-card rounded-2xl border-2 border-border p-4 w-full max-w-[280px]">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-3">
                          <AvatarImage src={getSecureImageUrl(topLevel.image_url)} alt={topLevel.name} />
                          <AvatarFallback className="bg-muted">
                            {topLevel.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold text-primary text-center mb-1">
                          {topLevel.name}
                        </p>
                        <p className="text-xs text-muted-foreground text-center">{topLevel.job_title}</p>
                      </div>
                    </div>
                    
                    {/* Connecting Line */}
                    {employees.length > 0 && <div className="w-0.5 h-8 bg-border" />}
                  </div>
                </>
              )}

              {/* Team Members Grid */}
              {employees.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {employees.map((employee, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="bg-card rounded-2xl border-2 border-border p-4 w-full">
                        <div className="flex flex-col items-center">
                          <Avatar className="h-16 w-16 mb-3">
                            <AvatarImage 
                              src={employee.name === user.name ? userImageUrl : employee.image} 
                              alt={employee.name} 
                            />
                            <AvatarFallback className="bg-muted">
                              {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-semibold text-primary text-center mb-1 leading-tight">
                            {employee.name}
                          </p>
                          <p className="text-xs text-muted-foreground text-center leading-tight">
                            {employee.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
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
