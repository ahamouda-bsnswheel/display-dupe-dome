import { useState } from "react";
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
import { ListTodo } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NewTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (taskName: string) => void;
}

const NewTaskModal = ({ open, onOpenChange, onCreateTask }: NewTaskModalProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const [taskName, setTaskName] = useState("");

  const handleCreate = () => {
    if (taskName.trim()) {
      onCreateTask(taskName.trim());
      setTaskName("");
      onOpenChange(false);
    }
  };

  const handleDiscard = () => {
    setTaskName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="bg-primary/10 rounded-xl p-2">
              <ListTodo className="h-5 w-5 text-primary" />
            </div>
            {t("tasks.newTask")}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="taskName" className="text-sm font-medium">
            {t("tasks.taskName")}
          </Label>
          <Input
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder={t("tasks.enterTaskName")}
            className="mt-2"
            autoFocus
          />
        </div>

        <DialogFooter className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button
            variant="outline"
            onClick={handleDiscard}
            className="flex-1"
          >
            {t("projects.discard")}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!taskName.trim()}
            className="flex-1"
          >
            {t("tasks.createTask")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskModal;
