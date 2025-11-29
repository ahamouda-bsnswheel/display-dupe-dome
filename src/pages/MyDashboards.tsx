import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { authStorage } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, LayoutDashboard, Loader2 } from "lucide-react";

interface Dashboard {
  id: number;
  name: string;
}

interface DashboardsResponse {
  results: Dashboard[];
  total: number;
  offset: number;
  limit: number;
  version: string;
  model: string;
}

const MyDashboards = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://bsnswheel.org/api/v1/dashboards", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authStorage.getAuthHeaders(),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboards");
        }

        const data: DashboardsResponse = await response.json();
        setDashboards(data.results || []);
      } catch (err) {
        console.error("Error fetching dashboards:", err);
        setError(t("myDashboards.error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboards();
  }, [t]);

  const handleDashboardClick = (dashboard: Dashboard) => {
    // Will implement dashboard detail view later
    console.log("Dashboard clicked:", dashboard);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3">
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/more")}
            className="shrink-0"
          >
            <BackIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{t("myDashboards.title")}</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-muted-foreground">
            {error}
          </div>
        ) : dashboards.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t("myDashboards.noDashboards")}
          </div>
        ) : (
          dashboards.map((dashboard) => (
            <Card 
              key={dashboard.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleDashboardClick(dashboard)}
            >
              <CardContent className={`p-4 flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                  <h3 className="font-medium text-foreground">{dashboard.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("myDashboards.dashboardId")}: {dashboard.id}
                  </p>
                </div>
                {isRTL ? (
                  <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyDashboards;
