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
import { FolderKanban } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (projectName: string) => void;
}

const NewProjectModal = ({ open, onOpenChange, onCreateProject }: NewProjectModalProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const [projectName, setProjectName] = useState("");

  const handleCreate = () => {
    if (projectName.trim()) {
      onCreateProject(projectName.trim());
      setProjectName("");
      onOpenChange(false);
    }
  };

  const handleDiscard = () => {
    setProjectName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="bg-primary/10 rounded-xl p-2">
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>
            {t("projects.newProject")}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="projectName" className="text-sm font-medium">
            {t("projectSettings.projectName")}
          </Label>
          <Input
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder={t("projects.enterProjectName")}
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
            disabled={!projectName.trim()}
            className="flex-1"
          >
            {t("projects.createProject")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
