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

interface EditEducationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: {
    certificateLevel: string;
    fieldOfStudy: string;
    school: string;
  };
}

export const EditEducationModal = ({
  open,
  onOpenChange,
  defaultValues,
}: EditEducationModalProps) => {
  const [certificateLevel, setCertificateLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [school, setSchool] = useState("");

  useEffect(() => {
    if (defaultValues) {
      setCertificateLevel(defaultValues.certificateLevel);
      setFieldOfStudy(defaultValues.fieldOfStudy);
      setSchool(defaultValues.school);
    }
  }, [defaultValues, open]);

  const handleSave = () => {
    console.log({ certificateLevel, fieldOfStudy, school });
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
        <SheetHeader className="px-6 pb-4">
          <SheetTitle className="text-xl font-semibold">Education</SheetTitle>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Certificate Level */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Certificate Level
            </Label>
            <Input
              value={certificateLevel}
              onChange={(e) => setCertificateLevel(e.target.value)}
              placeholder="Enter Certificate Level"
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Field of Study */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Field of Study
            </Label>
            <Input
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder="Enter Field of Study"
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* School */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              School
            </Label>
            <Input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Enter School"
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
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
