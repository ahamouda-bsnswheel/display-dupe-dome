import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const isRTL = language === 'ar';

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ];

  const handleLanguageSelect = (code: string) => {
    if (code !== language) {
      toggleLanguage();
    }
  };

  const BackIcon = isRTL ? ChevronRight : ChevronLeft;

  return (
    <div className="min-h-screen bg-background pb-6 max-w-screen-xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-card px-4 sm:px-6 py-4 flex items-center gap-3 border-b border-border sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <BackIcon className="h-6 w-6" />
        </Button>
        <h1 className={`text-xl font-semibold ${isRTL ? 'text-right' : 'text-left'} flex-1`}>
          {t('more.language')}
        </h1>
      </div>

      {/* Language Options */}
      <div className="px-4 sm:px-6 py-6">
        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full flex items-center justify-between py-4 px-4 bg-card hover:bg-muted/50 transition-colors rounded-lg border ${
                language === lang.code ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                <span className="text-base font-medium">{lang.nativeName}</span>
                <span className="text-sm text-muted-foreground">{lang.name}</span>
              </div>
              {language === lang.code && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
