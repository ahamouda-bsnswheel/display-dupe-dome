import { useState } from "react";
import { AlertCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { authStorage } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { PendingProfileChanges } from "@/hooks/use-pending-profile-changes";

interface PendingChangesBannerProps {
  pendingChanges: PendingProfileChanges;
  employeeId?: number;
  onSubmitSuccess: () => void;
  onClearChanges: () => void;
  isRTL?: boolean;
}

export const PendingChangesBanner = ({
  pendingChanges,
  employeeId,
  onSubmitSuccess,
  onClearChanges,
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

  const handleClear = () => {
    onClearChanges();
    toast({
      title: t("common.success"),
      description: t("profile.changesCleared"),
    });
  };

  return (
    <div 
      className={`sticky top-0 z-50 bg-amber-500 text-white px-4 py-3 shadow-lg ${isRTL ? "text-right" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={`flex items-center justify-between gap-3 max-w-screen-xl mx-auto ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className={`flex items-center gap-2 flex-1 min-w-0 ${isRTL ? "flex-row-reverse" : ""}`}>
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium truncate">
            {t("profile.changesMade")}
          </span>
        </div>
        <div className={`flex items-center gap-2 flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClear}
            className={`text-white hover:bg-white/20 gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <X className="h-3.5 w-3.5" />
            {t("common.clear")}
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`bg-white text-amber-600 hover:bg-white/90 gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Send className="h-3.5 w-3.5" />
            {isSubmitting ? t("common.submitting") : t("common.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
};
