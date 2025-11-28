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

interface EditPrivateContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: {
    email: string;
    phone: string;
  };
  employeeId?: number;
  onSave?: (changes: { private_email?: string; private_phone?: string }) => void;
  onSuccess?: () => void;
}

export const EditPrivateContactModal = ({
  open,
  onOpenChange,
  defaultValues,
  employeeId,
  onSave,
  onSuccess,
}: EditPrivateContactModalProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (defaultValues && open) {
      setEmail(defaultValues.email || "");
      setPhone(defaultValues.phone || "");
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
    const changes: { private_email?: string; private_phone?: string } = {};
    if (email !== (defaultValues?.email || "")) {
      changes.private_email = email;
    }
    if (phone !== (defaultValues?.phone || "")) {
      changes.private_phone = phone;
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
          <SheetTitle className="text-xl font-semibold">{t("profile.privateContact")}</SheetTitle>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Private Email */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t("profile.email")}
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={t("profile.email")}
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Private Phone */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t("profile.phone")}
            </Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder={t("profile.phone")}
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
