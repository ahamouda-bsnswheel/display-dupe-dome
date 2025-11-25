import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, Phone, Mail } from "lucide-react";
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


  return (
    <div className="min-h-screen bg-background flex flex-col max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="text-base sm:text-lg font-medium">Profile</span>
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 sm:p-4 md:p-6 pb-8 max-w-2xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading employee details...</p>
            </div>
          ) : employeeData ? (
            <div className="space-y-6">
              {/* Employee Card */}
              <div className="bg-card rounded-2xl border-2 border-border p-4 sm:p-6">
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                    <AvatarImage src={blobUrl} alt={employeeData.name} />
                    <AvatarFallback className="bg-muted text-xl sm:text-2xl">
                      {employeeData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl sm:text-2xl font-semibold text-primary text-center px-4">
                    {employeeData.name}
                  </h2>
                  
                  {employeeData.work_phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{employeeData.work_phone}</span>
                    </div>
                  )}
                  
                  {employeeData.work_email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="text-sm sm:text-base break-all">{employeeData.work_email}</span>
                    </div>
                  )}
                  
                  <div className="w-full space-y-2 pt-4">
                    <div className="flex items-start gap-2">
                      <span className="text-foreground mt-1 flex-shrink-0">•</span>
                      <span className="text-sm sm:text-base text-foreground">{employeeData.job_title}</span>
                    </div>
                    
                    {Array.isArray(employeeData.department_id) && employeeData.department_id[1] && (
                      <div className="flex items-start gap-2">
                        <span className="text-foreground mt-1 flex-shrink-0">•</span>
                        <span className="text-sm sm:text-base text-foreground">{employeeData.department_id[1]}</span>
                      </div>
                    )}
                  </div>
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
