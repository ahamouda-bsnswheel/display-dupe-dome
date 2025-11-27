import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { authStorage } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

interface EditEducationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: {
    certificateLevel: string;
    fieldOfStudy: string;
    school: string;
  };
  employeeId?: number;
  onSuccess?: () => void;
}

export const EditEducationModal = ({
  open,
  onOpenChange,
  defaultValues,
  employeeId,
  onSuccess,
}: EditEducationModalProps) => {
  const { t } = useLanguage();
  const [certificateLevel, setCertificateLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [school, setSchool] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const certificateOptions = [
    { value: "graduate", label: t('profile.certificateLevel.graduate') || "Graduate" },
    { value: "bachelor", label: t('profile.certificateLevel.bachelor') || "Bachelor" },
    { value: "master", label: t('profile.certificateLevel.master') || "Master" },
    { value: "doctor", label: t('profile.certificateLevel.doctor') || "Doctor" },
  ];

  useEffect(() => {
    if (defaultValues && open) {
      setCertificateLevel(defaultValues.certificateLevel?.toLowerCase() || "");
      setFieldOfStudy(defaultValues.fieldOfStudy || "");
      setSchool(defaultValues.school || "");
    }
  }, [defaultValues, open]);

  const handleSave = async () => {
    if (!employeeId) {
      toast({
        title: "Error",
        description: "Employee ID not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const headers = authStorage.getAuthHeaders();
      const params = new URLSearchParams();
      
      if (certificateLevel) params.append("certificate", certificateLevel);
      if (fieldOfStudy) params.append("study_field", fieldOfStudy);
      if (school) params.append("study_school", school);

      const response = await fetch(
        `https://bsnswheel.org/api/v1/employees/${employeeId}?${params.toString()}`,
        {
          method: "PUT",
          headers,
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Education updated successfully",
        });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast({
          title: "Error",
          description: "Failed to update education",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating education:", error);
      toast({
        title: "Error",
        description: "Failed to update education",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          <SheetTitle className="text-xl font-semibold">{t('profile.education') || "Education"}</SheetTitle>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Certificate Level */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t('profile.certificateLevel') || "Certificate Level"}
            </Label>
            <Select value={certificateLevel} onValueChange={setCertificateLevel}>
              <SelectTrigger className="h-14 rounded-xl border-border bg-background text-base">
                <SelectValue placeholder={t('profile.certificateLevel') || "Select Certificate Level"} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {certificateOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-base"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field of Study */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t('profile.fieldOfStudy') || "Field of Study"}
            </Label>
            <Input
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder={t('profile.fieldOfStudy') || "Enter Field of Study"}
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* School */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t('profile.school') || "School"}
            </Label>
            <Input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder={t('profile.school') || "Enter School"}
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="px-6 pb-6">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-base font-medium"
          >
            {isLoading ? "Saving..." : (t('common.save') || "Save")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
