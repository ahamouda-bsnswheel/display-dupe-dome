import { useNavigate } from "react-router-dom";
import { ChevronLeft, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authStorage, getSecureImageUrl } from "@/lib/auth";
import { useAuthImage } from "@/hooks/use-auth-image";

interface Employee {
  name: string;
  position: string;
  image?: string;
}

const OrganizationChart = () => {
  const navigate = useNavigate();
  const employeeData = authStorage.getEmployeeData();
  
  const user = {
    name: employeeData?.name || "User",
    position: employeeData?.job_title || "Employee",
    image: getSecureImageUrl(employeeData?.image_url),
  };

  const { blobUrl: userImageUrl } = useAuthImage(user.image);

  // Build organizational hierarchy from employee data
  const managers: Employee[] = [];
  
  // Add attendance manager if available
  if (employeeData?.attendance_manager_id && Array.isArray(employeeData.attendance_manager_id)) {
    managers.push({
      name: employeeData.attendance_manager_id[1],
      position: "Manager",
      image: "",
    });
  }
  
  // Add expense manager if different from attendance manager
  if (employeeData?.expense_manager_id && Array.isArray(employeeData.expense_manager_id)) {
    const expenseManagerName = employeeData.expense_manager_id[1];
    if (!managers.find(m => m.name === expenseManagerName)) {
      managers.push({
        name: expenseManagerName,
        position: "Expense Manager",
        image: "",
      });
    }
  }
  
  // Add timesheet manager if different from others
  if (employeeData?.timesheet_manager_id && Array.isArray(employeeData.timesheet_manager_id)) {
    const timesheetManagerName = employeeData.timesheet_manager_id[1];
    if (!managers.find(m => m.name === timesheetManagerName)) {
      managers.push({
        name: timesheetManagerName,
        position: "Timesheet Manager",
        image: "",
      });
    }
  }

  const employees: Employee[] = [
    ...managers,
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
        <div className="p-4 pb-8">
          {/* Department Head / Top Manager */}
          {managers.length > 0 && (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="bg-card rounded-2xl border-2 border-border p-4 w-full max-w-[280px]">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-16 w-16 mb-3">
                      <AvatarImage src={managers[0].image} alt={managers[0].name} />
                      <AvatarFallback className="bg-muted">
                        {managers[0].name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-semibold text-primary text-center mb-1">
                      {managers[0].name}
                    </p>
                    <p className="text-xs text-muted-foreground text-center">{managers[0].position}</p>
                  </div>
                </div>
                
                {/* Connecting Line */}
                <div className="w-0.5 h-8 bg-border" />
              </div>
            </>
          )}

          {/* Team Members Grid */}
          <div className="grid grid-cols-2 gap-4">
            {employees.slice(managers.length > 0 ? 1 : 0).map((employee, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-card rounded-2xl border-2 border-border p-4 w-full">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-16 w-16 mb-3">
                      <AvatarImage src={employee.name === user.name ? userImageUrl : employee.image} alt={employee.name} />
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
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrganizationChart;
