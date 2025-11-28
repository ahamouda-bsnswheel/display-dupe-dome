import { useState } from "react";
import { AlertCircle, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { authStorage } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { PendingProfileChanges } from "@/hooks/use-pending-profile-changes";

interface PendingChangesBannerProps {
  pendingChanges: PendingProfileChanges;
  employeeId?: number;
  onSubmitSuccess: () => void;
  isRTL?: boolean;
}

export const PendingChangesBanner = ({
  pendingChanges,
  employeeId,
  onSubmitSuccess,
  isRTL,
}: PendingChangesBannerProps) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!employeeId) {
      toast({
        title: t("common.error"),
        description: "Employee ID not found",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const headers = authStorage.getAuthHeaders();
      const params = new URLSearchParams();
      
      // Add approval_state
      params.append("approval_state", "submitted");
      
      // Add all pending changes
      Object.entries(pendingChanges).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value);
        }
      });

      const response = await fetch(
        `https://bsnswheel.org/api/v1/employees/${employeeId}?${params.toString()}`,
        {
          method: "PUT",
          headers,
        }
      );

      if (response.ok) {
        toast({
          title: t("common.success"),
          description: t("profile.submittedForReview"),
        });
        onSubmitSuccess();
      } else {
        toast({
          title: t("common.error"),
          description: t("profile.submitFailed"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting changes:", error);
      toast({
        title: t("common.error"),
        description: t("profile.submitFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Alert className={`border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 ${isRTL ? "text-right" : ""}`}>
      <AlertCircle className={`h-4 w-4 text-amber-500 ${isRTL ? "ml-2" : ""}`} />
      <div className={`flex items-center justify-between w-full ${isRTL ? "flex-row-reverse pr-6" : "pl-6"}`}>
        <AlertDescription className="text-amber-700 dark:text-amber-400 flex-1">
          {t("profile.changesMade")}
        </AlertDescription>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`bg-amber-600 hover:bg-amber-700 text-white gap-1.5 ${isRTL ? "flex-row-reverse mr-3" : "ml-3"}`}
        >
          <Send className="h-3.5 w-3.5" />
          {isSubmitting ? t("common.submitting") : t("common.submit")}
        </Button>
      </div>
    </Alert>
  );
};
