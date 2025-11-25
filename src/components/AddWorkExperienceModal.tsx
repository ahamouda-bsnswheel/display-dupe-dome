import { useState } from "react";
import { X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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

interface AddWorkExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const resumeTypes = [
  "Trainings",
  "Work Experience",
  "Education",
  "Side Projects",
  "Study",
  "Internal Certification",
  "Completed Internal Training",
];

export const AddWorkExperienceModal = ({
  open,
  onOpenChange,
}: AddWorkExperienceModalProps) => {
  const [resumeType, setResumeType] = useState<string>("");
  const [companyName, setCompanyName] = useState("");
  const [titleOfEmployee, setTitleOfEmployee] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleSave = () => {
    // TODO: Implement save logic
    console.log({
      resumeType,
      companyName,
      titleOfEmployee,
      startDate,
      endDate,
    });
    onOpenChange(false);
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
        <SheetHeader className="px-6 pb-4 flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-xl font-semibold">Resume</SheetTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Resume Type */}
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
                  <SelectItem key={type} value={type} className="text-base">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Company Name
            </Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter Company Name"
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Title of employee */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Title of employee
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
              Start Date
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
              End Date
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
