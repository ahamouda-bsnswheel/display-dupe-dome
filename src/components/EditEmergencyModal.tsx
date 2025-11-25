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

interface EditEmergencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: {
    contactName: string;
    contactPhone: string;
  };
}

export const EditEmergencyModal = ({
  open,
  onOpenChange,
  defaultValues,
}: EditEmergencyModalProps) => {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  useEffect(() => {
    if (defaultValues) {
      setContactName(defaultValues.contactName);
      setContactPhone(defaultValues.contactPhone);
    }
  }, [defaultValues, open]);

  const handleSave = () => {
    console.log({ contactName, contactPhone });
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
          <SheetTitle className="text-xl font-semibold">Emergency</SheetTitle>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Emergency Contact */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Emergency Contact
            </Label>
            <Input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Enter Emergency Contact"
              className="h-14 rounded-xl border-border bg-background text-base placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Emergency Phone */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Emergency Phone
            </Label>
            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              type="tel"
              placeholder="Enter Emergency Phone"
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
