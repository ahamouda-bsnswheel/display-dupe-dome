import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Search, Home, Grid3x3, Bell, MoreHorizontal, MessageCircle, Umbrella, Award } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Notifications = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const mockNotifications = [
    {
      id: 1,
      type: "appraisal",
      icon: MessageCircle,
      iconBg: "bg-gradient-to-br from-purple-400 to-purple-600",
      title: t('notifications.appraisalToFill'),
      description: t('notifications.appraisalDesc'),
      timestamp: "15 Days ago"
    },
    {
      id: 2,
      type: "appraisal",
      icon: MessageCircle,
      iconBg: "bg-gradient-to-br from-purple-400 to-purple-600",
      title: t('notifications.appraisalFor'),
      name: "Abdulkareem Alsayed Shuia",
      description: t('notifications.appraisalDesc'),
      timestamp: "15 Days ago"
    },
    {
      id: 3,
      type: "leave",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Osama1",
      title: t('notifications.annualLeaveRequest'),
      name: "Osama Ali Omran Duhaim",
      timestamp: "23 Days ago"
    },
    {
      id: 4,
      type: "leave",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Osama2",
      title: t('notifications.annualLeaveRequest'),
      name: "Osama Ali Omran Duhaim",
      timestamp: "23 Days ago"
    },
    {
      id: 5,
      type: "leave",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Osama3",
      title: t('notifications.annualLeaveRequest'),
      name: "Osama Ali Omran Duhaim",
      timestamp: "36 Days ago"
    },
    {
      id: 6,
      type: "leave",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Osama4",
      title: t('notifications.annualLeaveRequest'),
      name: "Osama Ali Omran Duhaim",
      timestamp: "36 Days ago"
    }
  ];

  const mockModules = [
    {
      id: 1,
      name: t('notifications.timeOff'),
      icon: Umbrella,
      iconBg: "bg-gradient-to-br from-orange-400 via-blue-400 to-purple-400",
      approveCount: 1,
      todayCount: 0,
      futureCount: 1
    },
    {
      id: 2,
      name: t('notifications.employeeAppraisal'),
      icon: Award,
      iconBg: "bg-gradient-to-br from-purple-400 via-orange-400 to-yellow-400",
      approveCount: 2,
      todayCount: 0,
      futureCount: 0
    }
  ];

  const filteredModules = mockModules.filter(module => 
    module.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20 max-w-screen-xl mx-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">{t('notifications.title')}</h1>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="notifications" 
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 text-base"
          >
            {t('notifications.notificationsTab')}
          </TabsTrigger>
          <TabsTrigger 
            value="modules" 
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 text-base"
          >
            {t('notifications.modulesTab')}
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="px-4 py-4 space-y-3 mt-0">
          {mockNotifications.map((notification) => (
            <Card key={notification.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex gap-4">
                {notification.type === "appraisal" ? (
                  <div className={`${notification.iconBg} rounded-full p-3 h-14 w-14 flex items-center justify-center flex-shrink-0`}>
                    <notification.icon className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <Avatar className="h-14 w-14 flex-shrink-0">
                    <AvatarImage src={notification.avatar} />
                    <AvatarFallback>
                      {notification.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 leading-tight">
                    {notification.title}
                    {notification.name && (
                      <span className="font-normal"> {notification.name}</span>
                    )}
                  </h3>
                  {notification.description && (
                    <p className="text-sm text-foreground mb-2 leading-tight">
                      {notification.description}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="px-4 py-4 space-y-4 mt-0">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('dashboard.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card rounded-xl border-border"
            />
          </div>

          {/* Modules List */}
          <div className="space-y-3">
            {filteredModules.map((module) => (
              <Card key={module.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`${module.iconBg} rounded-2xl p-3 h-14 w-14 flex items-center justify-center flex-shrink-0`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {module.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        <span className="font-medium text-foreground">{module.approveCount}</span> {t('notifications.approve')}{' '}
                        <span className="font-medium text-foreground">{module.todayCount}</span> {t('notifications.today')}
                      </span>
                      <span>
                        <span className="font-medium text-foreground">{module.futureCount}</span> {t('notifications.future')}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <Home className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/modules")}>
            <Grid3x3 className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary">
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

export default Notifications;
