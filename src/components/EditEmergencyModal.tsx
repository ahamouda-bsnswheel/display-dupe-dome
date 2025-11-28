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
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface EditEmergencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: {
    contactName: string;
    contactPhone: string;
  };
  employeeId?: number;
  onSave?: (changes: { emergency_contact?: string; emergency_phone?: string }) => void;
  onSuccess?: () => void;
}

export const EditEmergencyModal = ({
  open,
  onOpenChange,
  defaultValues,
  employeeId,
  onSave,
  onSuccess,
}: EditEmergencyModalProps) => {
  const { t } = useLanguage();
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  useEffect(() => {
    if (defaultValues && open) {
      setContactName(defaultValues.contactName || "");
      setContactPhone(defaultValues.contactPhone || "");
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
    const changes: { emergency_contact?: string; emergency_phone?: string } = {};
    if (contactName !== (defaultValues?.contactName || "")) {
      changes.emergency_contact = contactName;
    }
    if (contactPhone !== (defaultValues?.contactPhone || "")) {
      changes.emergency_phone = contactPhone;
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
          <SheetTitle className="text-xl font-semibold">{t("profile.emergency")}</SheetTitle>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Emergency Contact */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t("profile.contactName")}
            </Label>
            <Input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder={t("profile.contactName")}
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Emergency Phone */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t("profile.contactPhone")}
            </Label>
            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              type="tel"
              placeholder={t("profile.contactPhone")}
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
