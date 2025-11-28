import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { authStorage } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface ReviewActionsBannerProps {
  employeeId: string;
  employeeName: string;
}

export const ReviewActionsBanner = ({ employeeId, employeeName }: ReviewActionsBannerProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isRTL = language === "ar";

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = () => {
    setApproveDialogOpen(true);
  };

  const handleReject = () => {
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const confirmApprove = async () => {
    setIsApproving(true);
    try {
      const headers = authStorage.getAuthHeaders();
      const response = await fetch(
        `https://bsnswheel.org/api/v1/employees/${employeeId}?approval_state=approved`,
        {
          method: "PUT",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve employee");
      }

      toast({
        title: t("employee360.approveSuccess") || "Employee Approved",
        description: `${employeeName} ${t("employee360.hasBeenApproved") || "has been approved successfully."}`,
      });

      navigate("/employee-360");
    } catch (err) {
      console.error("Error approving employee:", err);
      toast({
        title: t("employee360.approveError") || "Error",
        description: t("employee360.approveErrorDescription") || "Failed to approve employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
      setApproveDialogOpen(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) return;

    setIsRejecting(true);
    try {
      const headers = authStorage.getAuthHeaders();
      const encodedReason = encodeURIComponent(rejectReason.trim());
      const response = await fetch(
        `https://bsnswheel.org/api/v1/employees/${employeeId}?approval_state=reject&reject_reason=${encodedReason}`,
        {
          method: "PUT",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject employee");
      }

      toast({
        title: t("employee360.rejectSuccess") || "Employee Rejected",
        description: `${employeeName} ${t("employee360.hasBeenRejected") || "has been rejected."}`,
      });

      navigate("/employee-360");
    } catch (err) {
      console.error("Error rejecting employee:", err);
      toast({
        title: t("employee360.rejectError") || "Error",
        description: t("employee360.rejectErrorDescription") || "Failed to reject employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
      setRejectDialogOpen(false);
      setRejectReason("");
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-4 py-3 shadow-lg" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-screen-xl mx-auto flex gap-3">
          <Button
            variant="default"
            className="flex-1"
            onClick={handleApprove}
          >
            <Check className="h-4 w-4 mr-2" />
            {t("employee360.approve") || "Approve"}
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleReject}
          >
            <X className="h-4 w-4 mr-2" />
            {t("employee360.reject") || "Reject"}
          </Button>
        </div>
      </div>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("employee360.confirmApprove") || "Confirm Approval"}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("employee360.confirmApproveDescription") || `Are you sure you want to approve ${employeeName}'s submission?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isApproving}>
              {t("common.cancel") || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} disabled={isApproving}>
              {isApproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("common.processing") || "Processing..."}
                </>
              ) : (
                t("employee360.approve") || "Approve"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("employee360.confirmReject") || "Confirm Rejection"}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("employee360.confirmRejectDescription") || `Please provide a reason for rejecting ${employeeName}'s submission.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder={t("employee360.rejectReasonPlaceholder") || "Enter rejection reason..."}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRejecting}>
              {t("common.cancel") || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              disabled={isRejecting || !rejectReason.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRejecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("common.processing") || "Processing..."}
                </>
              ) : (
                t("employee360.reject") || "Reject"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
