import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

interface TimesheetEntry {
  id: number;
  name: string;
  date: string;
  unit_amount: number;
  employee_id: [number, string];
}

interface TimesheetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; date: string; unit_amount: number }) => Promise<void>;
  mode: "add" | "edit";
  initialData?: TimesheetEntry | null;
  isLoading?: boolean;
}

const TimesheetModal = ({
  open,
  onOpenChange,
  onSubmit,
  mode,
  initialData,
  isLoading = false,
}: TimesheetModalProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setName(initialData.name || "");
        setDate(initialData.date || "");
        setHours(initialData.unit_amount?.toString() || "");
      } else {
        setName("");
        setDate(new Date().toISOString().split("T")[0]);
        setHours("");
      }
    }
  }, [open, mode, initialData]);

  const handleSubmit = async () => {
    if (!name.trim() || !date || !hours) return;
    
    await onSubmit({
      name: name.trim(),
      date,
      unit_amount: parseFloat(hours),
    });
  };

  const isValid = name.trim() && date && hours && parseFloat(hours) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right" : ""}>
            {mode === "add" ? t("taskSettings.addTimesheet") : t("taskSettings.editTimesheet")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className={isRTL ? "text-right" : ""}>
              {t("taskSettings.timesheetName")}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("taskSettings.timesheetNamePlaceholder")}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date" className={isRTL ? "text-right" : ""}>
              {t("taskSettings.timesheetDate")}
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hours" className={isRTL ? "text-right" : ""}>
              {t("taskSettings.timesheetHours")}
            </Label>
            <Input
              id="hours"
              type="number"
              step="0.5"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="1.5"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.saving")}
              </>
            ) : (
              t("common.save")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimesheetModal;
