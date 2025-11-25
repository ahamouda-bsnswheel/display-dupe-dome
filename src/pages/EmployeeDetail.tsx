import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authStorage, getSecureImageUrl } from "@/lib/auth";
import { useAuthImage } from "@/hooks/use-auth-image";
import { EmployeeData } from "@/types/employee";

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { blobUrl } = useAuthImage(getSecureImageUrl(employeeData?.image_url));

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!employeeId) return;

      try {
        const apiKey = authStorage.getApiKey();
        if (!apiKey) {
          console.error("No API key found");
          return;
        }

        const response = await fetch(
          `https://bsnswheel.org/api/v1/employees/${employeeId}`,
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
        console.log("Employee data:", data);
        setEmployeeData(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  const InfoRow = ({ label, value }: { label: string; value: string | number | boolean }) => (
    <div className="flex justify-between items-start py-3 border-b border-border">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground font-medium text-right">{value || "—"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="text-lg font-medium">Employee Details</span>
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pb-8">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading employee details...</p>
            </div>
          ) : employeeData ? (
            <div className="space-y-6">
              {/* Employee Card */}
              <div className="bg-card rounded-2xl border-2 border-border p-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={blobUrl} alt={employeeData.name} />
                    <AvatarFallback className="bg-muted text-lg">
                      {employeeData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold text-foreground text-center mb-2">
                    {employeeData.name}
                  </h2>
                  <p className="text-sm text-muted-foreground text-center">
                    {employeeData.job_title}
                  </p>
                </div>

                <div className="space-y-0">
                  <InfoRow 
                    label="Department" 
                    value={Array.isArray(employeeData.department_id) ? employeeData.department_id[1] : "—"} 
                  />
                  <InfoRow 
                    label="Work Location" 
                    value={Array.isArray(employeeData.work_location_id) ? employeeData.work_location_id[1] : "—"} 
                  />
                  <InfoRow 
                    label="Work Email" 
                    value={employeeData.work_email || "—"} 
                  />
                  <InfoRow 
                    label="Work Phone" 
                    value={employeeData.work_phone || "—"} 
                  />
                  <InfoRow 
                    label="Mobile Phone" 
                    value={employeeData.mobile_phone || "—"} 
                  />
                  <InfoRow 
                    label="Manager" 
                    value={employeeData.is_manager ? "Yes" : "No"} 
                  />
                  <InfoRow 
                    label="Attendance Manager" 
                    value={Array.isArray(employeeData.attendance_manager_id) ? employeeData.attendance_manager_id[1] : "—"} 
                  />
                  <InfoRow 
                    label="Marital Status" 
                    value={employeeData.marital || "—"} 
                  />
                  <InfoRow 
                    label="Children" 
                    value={employeeData.children || 0} 
                  />
                  <InfoRow 
                    label="Certificate" 
                    value={employeeData.certificate || "—"} 
                  />
                  <InfoRow 
                    label="Study Field" 
                    value={employeeData.study_field || "—"} 
                  />
                  <InfoRow 
                    label="Study School" 
                    value={employeeData.study_school || "—"} 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Employee not found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EmployeeDetail;
