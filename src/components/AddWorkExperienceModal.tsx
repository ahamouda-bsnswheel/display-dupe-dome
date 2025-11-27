import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { authStorage } from "@/lib/auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface WorkExperience {
  id?: number;
  dates: string;
  title: string;
  companyName?: string;
  lineTypeId?: number;
}

interface ResumeType {
  id: number;
  name: string;
}

interface AddWorkExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: WorkExperience;
  isEditMode?: boolean;
  employeeId?: number;
  onSuccess?: () => void;
  resumeTypes?: ResumeType[];
}

export const AddWorkExperienceModal = ({
  open,
  onOpenChange,
  editData,
  isEditMode = false,
  employeeId,
  onSuccess,
  resumeTypes = [],
}: AddWorkExperienceModalProps) => {
  const { toast } = useToast();
  const [resumeType, setResumeType] = useState<string>("");
  const [companyName, setCompanyName] = useState("");
  const [titleOfEmployee, setTitleOfEmployee] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Reset form when modal opens in add mode
  useEffect(() => {
    if (open && !isEditMode) {
      setResumeType("");
      setCompanyName("");
      setTitleOfEmployee("");
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [open, isEditMode]);

  // Pre-fill data when in edit mode
  useEffect(() => {
    if (isEditMode && editData) {
      setCompanyName(editData.companyName || "");
      setTitleOfEmployee(editData.title || "");
      
      // Parse dates from "DD/MM/YYYY - DD/MM/YYYY" or "DD/MM/YYYY - Current" format
      const dates = editData.dates.split(" - ");
      if (dates.length === 2) {
        const [startStr, endStr] = dates;
        const [startDay, startMonth, startYear] = startStr.split("/");
        
        setStartDate(new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay)));
        
        // Only parse end date if it's not "Current" or "حالياً"
        if (endStr && endStr !== "Current" && endStr !== "حالياً") {
          const [endDay, endMonth, endYear] = endStr.split("/");
          setEndDate(new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay)));
        } else {
          setEndDate(undefined);
        }
      }
    }
  }, [isEditMode, editData]);

  const handleSave = async () => {
    const authData = authStorage.getAuthData();
    const userId = authData?.user_id;

    // Handle ADD mode
    if (!isEditMode) {
      const selectedResumeType = resumeTypes.find(rt => rt.id.toString() === resumeType);
      
      if (!resumeType || !companyName || !startDate || !employeeId || !userId) {
        const missingFields = [] as string[];
        if (!resumeType) missingFields.push("Resume Type");
        if (!companyName) missingFields.push("Company Name");
        if (!startDate) missingFields.push("Start Date");
        
        toast({
          title: "Missing Information",
          description: `Please fill in all required fields: ${missingFields.join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      try {
        const headers = authStorage.getAuthHeaders();
        
        // Build query parameters
        const params = new URLSearchParams();
        params.append("employee_id", employeeId.toString());
        params.append("name", companyName);
        params.append("date_start", format(startDate, "yyyy-MM-dd"));
        if (endDate) {
          params.append("date_end", format(endDate, "yyyy-MM-dd"));
        }
        if (titleOfEmployee) {
          params.append("description", titleOfEmployee);
        }
        if (selectedResumeType?.id) {
          params.append("line_type_id", selectedResumeType.id.toString());
        }

        const response = await fetch(
          `https://bsnswheel.org/api/v1/employee_resume?${params.toString()}`,
          {
            method: "POST",
            headers: {
              ...headers,
            },
          }
        );

        if (response.ok) {
          toast({
            title: "Success",
            description: "Work experience added successfully",
          });
          onOpenChange(false);
          onSuccess?.();
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast({
            title: "Error",
            description: errorData.message || "Failed to add work experience",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error adding work experience:", error);
        toast({
          title: "Error",
          description: "An error occurred while adding work experience",
          variant: "destructive",
        });
      }
      return;
    }

    // EDIT mode - Validation
    console.log("Validation check:", {
      companyName,
      startDate,
      employeeId,
      userId,
      editDataId: editData?.id,
      lineTypeId: editData?.lineTypeId,
    });

    if (!companyName || !startDate || !employeeId || !userId || !editData?.id || !editData?.lineTypeId) {
      const missingFields = [] as string[];
      if (!companyName) missingFields.push("Company Name");
      if (!startDate) missingFields.push("Start Date");
      if (!employeeId) missingFields.push("Employee ID");
      if (!userId) missingFields.push("User ID");
      if (!editData?.id) missingFields.push("Work Experience ID");
      if (!editData?.lineTypeId) missingFields.push("Line Type ID");
      
      console.error("Missing required fields:", missingFields);
      
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const headers = authStorage.getAuthHeaders();
      const body = {
        employee_id: employeeId.toString(),
        name: companyName,
        date_start: format(startDate, "yyyy-MM-dd"),
        date_end: endDate ? format(endDate, "yyyy-MM-dd") : null,
        description: titleOfEmployee || null,
        line_type_id: editData.lineTypeId,
      };

      const response = await fetch(
        `https://bsnswheel.org/api/v1/employee_resume/${employeeId}`,
        {
          method: "PUT",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Work experience updated successfully",
        });
        onOpenChange(false);
        onSuccess?.();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error",
          description: errorData.message || "Failed to update work experience",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating work experience:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating work experience",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-3xl p-0 flex flex-col"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-12 h-1 bg-foreground/20 rounded-full" />
        </div>

        {/* Header */}
        <SheetHeader className="px-6 pb-4">
          <SheetTitle className="text-xl font-semibold">Resume</SheetTitle>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Resume Type - Only show in add mode */}
          {!isEditMode && (
            <div className="space-y-2">
              <Label className="text-base font-normal text-foreground">
                Resume Type
              </Label>
              <Select value={resumeType} onValueChange={setResumeType}>
                <SelectTrigger className="h-14 rounded-xl border-border bg-background text-base">
                  <SelectValue placeholder="Enter Resume Type" />
                </SelectTrigger>
                <SelectContent>
                  {resumeTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()} className="text-base">
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Company Name */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter Company Name"
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
              required
            />
          </div>

          {/* Title of employee */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Title of employee <span className="text-muted-foreground text-sm">(Optional)</span>
            </Label>
            <Input
              value={titleOfEmployee}
              onChange={(e) => setTitleOfEmployee(e.target.value)}
              placeholder="Enter Title of employee"
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Start Date <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-14 rounded-xl border-border bg-background text-base justify-start text-left font-normal",
                    !startDate && "text-muted-foreground/50"
                  )}
                >
                  {startDate ? (
                    format(startDate, "dd/MM/yyyy")
                  ) : (
                    <span>Enter Start Date</span>
                  )}
                  <CalendarIcon className="ml-auto h-5 w-5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              End Date <span className="text-muted-foreground text-sm">(Optional)</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-14 rounded-xl border-border bg-background text-base justify-start text-left font-normal",
                    !endDate && "text-muted-foreground/50"
                  )}
                >
                  {endDate ? (
                    format(endDate, "dd/MM/yyyy")
                  ) : (
                    <span>Enter End Date</span>
                  )}
                  <CalendarIcon className="ml-auto h-5 w-5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Save Button */}
        <div className="px-6 pb-6">
          <Button
            onClick={handleSave}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-base font-medium"
          >
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
