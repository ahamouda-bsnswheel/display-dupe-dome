import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, Clock, Calendar, BookOpen, Home, Grid3x3, Bell, MoreHorizontal, LogOut, Wallet, MailCheck, FileText, FileCheck, Edit3, PieChart, BarChart3, Award, Gauge, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Modules = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const allModules = [
    {
      icon: Clock,
      title: t('dashboard.timeTracker'),
      color: "bg-slate-100",
      iconColor: "text-slate-600"
    },
    {
      icon: LogOut,
      title: t('dashboard.timeOff'),
      color: "bg-accent",
      iconColor: "text-slate-800"
    },
    {
      icon: BookOpen,
      title: t('dashboard.courses'),
      color: "bg-lime-100",
      iconColor: "text-lime-700"
    },
    {
      icon: Wallet,
      title: t('dashboard.expenses'),
      color: "bg-emerald-200",
      iconColor: "text-emerald-700"
    },
    {
      icon: MailCheck,
      title: t('dashboard.viewRequest'),
      color: "bg-purple-200",
      iconColor: "text-purple-700"
    },
    {
      icon: FileText,
      title: t('dashboard.documents'),
      color: "bg-yellow-200",
      iconColor: "text-yellow-700"
    },
    {
      icon: FileCheck,
      title: t('dashboard.signedDocuments'),
      color: "bg-amber-100",
      iconColor: "text-amber-700"
    },
    {
      icon: Calendar,
      title: t('dashboard.calendar'),
      color: "bg-gradient-to-br from-orange-300 via-rose-300 to-purple-300",
      iconColor: "text-white",
      customContent: "31"
    },
    {
      icon: Edit3,
      title: t('dashboard.toDo'),
      color: "bg-teal-200",
      iconColor: "text-teal-700"
    },
    {
      icon: PieChart,
      title: t('dashboard.timesheets'),
      color: "bg-blue-200",
      iconColor: "text-blue-700"
    },
    {
      icon: BarChart3,
      title: t('dashboard.surveys'),
      color: "bg-gradient-to-br from-blue-300 to-rose-300",
      iconColor: "text-white"
    },
    {
      icon: Award,
      title: t('dashboard.appraisals'),
      color: "bg-gradient-to-br from-orange-300 to-purple-400",
      iconColor: "text-white"
    },
    {
      icon: Gauge,
      title: t('dashboard.fleet'),
      color: "bg-purple-200",
      iconColor: "text-purple-700"
    }
  ];

  const filteredModules = allModules.filter(module => 
    module.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20 max-w-screen-xl mx-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{t('dashboard.modules')}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('dashboard.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-card rounded-xl border-border"
          />
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredModules.map((module, index) => (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col gap-3">
                <div className={`${module.color} rounded-2xl p-3 w-14 h-14 flex items-center justify-center`}>
                  {module.customContent ? (
                    <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-500 via-rose-500 to-purple-500 bg-clip-text">
                      {module.customContent}
                    </span>
                  ) : (
                    <module.icon className={`h-6 w-6 ${module.iconColor}`} />
                  )}
                </div>
                <span className="text-sm font-medium text-foreground leading-tight">{module.title}</span>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <Home className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary">
            <Grid3x3 className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/notifications")}>
            <Bell className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/more")}>
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Modules;
