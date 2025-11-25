import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteWorkExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeleteWorkExperienceDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: DeleteWorkExperienceDialogProps) => {
  const handleDelete = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-2xl p-0 gap-0">
        <div className="p-6 pb-4">
          <AlertDialogTitle className="sr-only">Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base text-muted-foreground">
            Are you sure you want to delete this?
          </AlertDialogDescription>
        </div>
        
        <div className="flex flex-col gap-2 p-4">
          <Button
            onClick={handleDelete}
            className="w-full h-14 rounded-xl bg-transparent text-destructive hover:bg-destructive/10 text-base font-semibold"
            variant="ghost"
          >
            Delete
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full h-14 rounded-xl bg-transparent text-primary hover:bg-primary/10 text-base font-semibold"
            variant="ghost"
          >
            Cancel
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
