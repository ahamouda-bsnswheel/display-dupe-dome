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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";

interface EditFamilyStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: {
    maritalStatus: string;
    numberOfChildren: string;
  };
}

export const EditFamilyStatusModal = ({
  open,
  onOpenChange,
  defaultValues,
}: EditFamilyStatusModalProps) => {
  const { t } = useLanguage();
  const [maritalStatus, setMaritalStatus] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState("");

  const maritalStatusOptions = [
    { value: "single", label: t("profile.single") },
    { value: "married", label: t("profile.married") },
    { value: "widower", label: t("profile.widower") },
    { value: "divorced", label: t("profile.divorced") },
  ];

  useEffect(() => {
    if (defaultValues) {
      setMaritalStatus(defaultValues.maritalStatus);
      setNumberOfChildren(defaultValues.numberOfChildren);
    }
  }, [defaultValues, open]);

  const handleSave = () => {
    console.log({ maritalStatus, numberOfChildren });
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
          <SheetTitle className="text-xl font-semibold">Family Status</SheetTitle>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Marital Status */}
          <div className="space-y-4">
            <Label className="text-base font-normal text-foreground">
              {t("profile.maritalStatus")}
            </Label>
            <RadioGroup
              value={maritalStatus}
              onValueChange={setMaritalStatus}
              className="space-y-3"
            >
              {maritalStatusOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center justify-between py-3"
                >
                  <Label
                    htmlFor={option.value}
                    className="text-base font-normal text-foreground cursor-pointer flex-1"
                  >
                    {option.label}
                  </Label>
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="h-6 w-6"
                  />
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Number of Children */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t("profile.numberOfChildren")}
            </Label>
            <Input
              value={numberOfChildren}
              onChange={(e) => setNumberOfChildren(e.target.value)}
              type="number"
              min="0"
              placeholder={t("profile.enterNumberOfChildren")}
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
            {t("common.save")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
