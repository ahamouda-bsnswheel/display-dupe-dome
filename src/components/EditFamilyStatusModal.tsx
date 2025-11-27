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

interface EditFamilyStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: {
    maritalStatus: string;
    numberOfChildren: string;
  };
  employeeId?: number;
  onSuccess?: () => void;
}

export const EditFamilyStatusModal = ({
  open,
  onOpenChange,
  defaultValues,
  employeeId,
  onSuccess,
}: EditFamilyStatusModalProps) => {
  const { t } = useLanguage();
  const [maritalStatus, setMaritalStatus] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const maritalOptions = [
    { value: "single", label: t('profile.maritalStatus.single') || "Single" },
    { value: "married", label: t('profile.maritalStatus.married') || "Married" },
    { value: "cohabitant", label: t('profile.maritalStatus.cohabitant') || "Legal Cohabitant" },
    { value: "widower", label: t('profile.maritalStatus.widower') || "Widower" },
    { value: "divorced", label: t('profile.maritalStatus.divorced') || "Divorced" },
  ];

  useEffect(() => {
    if (defaultValues && open) {
      setMaritalStatus(defaultValues.maritalStatus?.toLowerCase() || "");
      setNumberOfChildren(defaultValues.numberOfChildren || "");
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
      
      if (maritalStatus) params.append("marital", maritalStatus);
      params.append("children", numberOfChildren || "0");

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
          description: "Marital status updated successfully",
        });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast({
          title: "Error",
          description: "Failed to update marital status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating marital status:", error);
      toast({
        title: "Error",
        description: "Failed to update marital status",
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
          <SheetTitle className="text-xl font-semibold">{t('profile.maritalStatus.title') || "Marital Status"}</SheetTitle>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Marital Status */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t('profile.maritalStatus.title') || "Marital Status"}
            </Label>
            <Select value={maritalStatus} onValueChange={setMaritalStatus}>
              <SelectTrigger className="h-14 rounded-xl border-border bg-background text-base">
                <SelectValue placeholder={t('profile.maritalStatus.title') || "Select Marital Status"} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {maritalOptions.map((option) => (
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

          {/* Number of Children */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              {t('profile.numberOfChildren') || "Number of Children"}
            </Label>
            <Input
              value={numberOfChildren}
              onChange={(e) => setNumberOfChildren(e.target.value)}
              type="number"
              min="0"
              placeholder={t('profile.numberOfChildren') || "Enter Number of Children"}
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
            {isLoading ? (t('common.saving') || "Saving...") : (t('common.save') || "Save")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
