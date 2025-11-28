import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
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
  onSave?: (changes: { certificate?: string; study_field?: string; study_school?: string }) => void;
  onSuccess?: () => void;
}

export const EditEducationModal = ({
  open,
  onOpenChange,
  defaultValues,
  employeeId,
  onSave,
  onSuccess,
}: EditEducationModalProps) => {
  const { t } = useLanguage();
  const [certificateLevel, setCertificateLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [school, setSchool] = useState("");

  const certificateOptions = [
    { value: "graduate", label: t("profile.certificateLevel.graduate") || "Graduate" },
    { value: "bachelor", label: t("profile.certificateLevel.bachelor") || "Bachelor" },
    { value: "master", label: t("profile.certificateLevel.master") || "Master" },
    { value: "doctor", label: t("profile.certificateLevel.doctor") || "Doctor" },
    { value: "other", label: t("profile.certificateLevel.other") || "Other" },
  ];

  useEffect(() => {
    if (defaultValues && open) {
      setCertificateLevel(defaultValues.certificateLevel?.toLowerCase() || "");
      setFieldOfStudy(defaultValues.fieldOfStudy || "");
      setSchool(defaultValues.school || "");
    }
  }, [defaultValues, open]);

  const handleSave = () => {
    if (!employeeId) {
      toast({
        title: t("common.error"),
        description: "Employee ID not found",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage via callback instead of API
    const changes: { certificate?: string; study_field?: string; study_school?: string } = {};
    if (certificateLevel !== (defaultValues?.certificateLevel?.toLowerCase() || "")) {
      changes.certificate = certificateLevel;
    }
    if (fieldOfStudy !== (defaultValues?.fieldOfStudy || "")) {
      changes.study_field = fieldOfStudy;
    }
    if (school !== (defaultValues?.school || "")) {
      changes.study_school = school;
    }

    if (Object.keys(changes).length > 0) {
      onSave?.(changes);
      toast({
        title: t("common.success"),
        description: t("profile.changesSaved"),
      });
    }

    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0 flex flex-col">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-12 h-1 bg-foreground/20 rounded-full" />
        </div>

        {/* Header */}
        <SheetHeader className="px-6 pb-4">
          <SheetTitle className="text-xl font-semibold">{t("profile.education") || "Education"}</SheetTitle>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Certificate Level */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t("profile.certificateLevel") || "Certificate Level"}
            </Label>
            <Select value={certificateLevel} onValueChange={setCertificateLevel}>
              <SelectTrigger className="h-14 rounded-xl border-border bg-background text-base">
                <SelectValue placeholder={t("profile.certificateLevel") || "Select Certificate Level"} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {certificateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-base">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field of Study */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t("profile.fieldOfStudy") || "Field of Study"}
            </Label>
            <Input
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder={t("profile.fieldOfStudy") || "Enter Field of Study"}
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* School */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">{t("profile.school") || "School"}</Label>
            <Input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder={t("profile.school") || "Enter School"}
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="px-6 pb-6">
          <Button
            onClick={handleSave}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-base font-medium"
          >
            {t("common.save") || "Save"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
