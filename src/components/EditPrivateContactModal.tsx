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
    privateAddress: string;
    email: string;
    phone: string;
    bankAccountNumber: string;
    homeWorkDistance: string;
    privateCarPlate: string;
  };
  employeeId?: number;
  onSave?: (changes: {
    private_street?: string;
    private_email?: string;
    private_phone?: string;
    bank_account_id?: string;
    km_home_work?: string;
    private_car_plate?: string;
  }) => void;
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
  const [privateAddress, setPrivateAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [homeWorkDistance, setHomeWorkDistance] = useState("");
  const [privateCarPlate, setPrivateCarPlate] = useState("");

  useEffect(() => {
    if (defaultValues && open) {
      setPrivateAddress(defaultValues.privateAddress || "");
      setEmail(defaultValues.email || "");
      setPhone(defaultValues.phone || "");
      setBankAccountNumber(defaultValues.bankAccountNumber || "");
      setHomeWorkDistance(defaultValues.homeWorkDistance || "");
      setPrivateCarPlate(defaultValues.privateCarPlate || "");
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
    const changes: {
      private_street?: string;
      private_email?: string;
      private_phone?: string;
      bank_account_id?: string;
      km_home_work?: string;
      private_car_plate?: string;
    } = {};

    if (privateAddress !== (defaultValues?.privateAddress || "")) {
      changes.private_street = privateAddress;
    }
    if (email !== (defaultValues?.email || "")) {
      changes.private_email = email;
    }
    if (phone !== (defaultValues?.phone || "")) {
      changes.private_phone = phone;
    }
    if (bankAccountNumber !== (defaultValues?.bankAccountNumber || "")) {
      changes.bank_account_id = bankAccountNumber;
    }
    if (homeWorkDistance !== (defaultValues?.homeWorkDistance || "")) {
      changes.km_home_work = homeWorkDistance;
    }
    if (privateCarPlate !== (defaultValues?.privateCarPlate || "")) {
      changes.private_car_plate = privateCarPlate;
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
          {/* Private Address */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t("profile.privateAddress")}
            </Label>
            <Input
              value={privateAddress}
              onChange={(e) => setPrivateAddress(e.target.value)}
              type="text"
              placeholder={t("profile.enterPrivateAddress")}
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Private Email */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t("profile.privateEmail")}
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
              {t("profile.privatePhone")}
            </Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder={t("profile.phone")}
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Bank Account Number */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t("profile.bankAccountNumber")}
            </Label>
            <Input
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              type="text"
              placeholder={t("profile.enterBankAccountNumber")}
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Home Work Distance */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t("profile.homeWorkDistance")}
            </Label>
            <Input
              value={homeWorkDistance}
              onChange={(e) => setHomeWorkDistance(e.target.value)}
              type="text"
              placeholder={t("profile.enterHomeWorkDistance")}
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Private Car Plate */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t("profile.privateCarPlate")}
            </Label>
            <Input
              value={privateCarPlate}
              onChange={(e) => setPrivateCarPlate(e.target.value)}
              type="text"
              placeholder={t("profile.enterPrivateCarPlate")}
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
