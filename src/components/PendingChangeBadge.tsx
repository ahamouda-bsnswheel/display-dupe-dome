import { useLanguage } from "@/contexts/LanguageContext";

interface PendingChangeBadgeProps {
  isRTL?: boolean;
}

export const PendingChangeBadge = ({ isRTL }: PendingChangeBadgeProps) => {
  const { t } = useLanguage();
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 ${isRTL ? "mr-2" : "ml-2"}`}>
      {t("profile.modified")}
    </span>
  );
};
