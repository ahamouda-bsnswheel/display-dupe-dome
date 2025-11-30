import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { authStorage, getSecureImageUrl } from "@/lib/auth";
import { useAuthImage } from "@/hooks/use-auth-image";
import { useNavigate } from "react-router-dom";
import { Search, Clock, Calendar, BookOpen, Home, Grid3x3, Bell, MoreHorizontal, ChevronRight, Camera } from "lucide-react";
import { QRScannerModal } from "@/components/QRScannerModal";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const authData = authStorage.getAuthData();
  const employeeData = authStorage.getEmployeeData();
  
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Load check-in state from localStorage
  useEffect(() => {
    const savedCheckInTime = localStorage.getItem("checkInTime");
    if (savedCheckInTime) {
      const time = parseInt(savedCheckInTime, 10);
      setCheckInTime(time);
      setIsCheckedIn(true);
      setElapsedTime(Math.floor((Date.now() - time) / 1000));
    }
  }, []);

  // Update timer every second
  useEffect(() => {
    if (isCheckedIn && checkInTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - checkInTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCheckedIn, checkInTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleCheckIn = useCallback(() => {
    const now = Date.now();
    setCheckInTime(now);
    setIsCheckedIn(true);
    setElapsedTime(0);
    localStorage.setItem("checkInTime", now.toString());
    toast({
      title: t('dashboard.checkedInToast'),
      description: t('dashboard.checkedInDesc'),
    });
  }, [toast, t]);

  const handleCheckOut = useCallback(() => {
    setIsCheckedIn(false);
    setCheckInTime(null);
    setElapsedTime(0);
    localStorage.removeItem("checkInTime");
    toast({
      title: t('dashboard.checkedOutToast'),
      description: t('dashboard.checkedOutDesc'),
    });
  }, [toast, t]);

  const handleQRScan = useCallback((qrCode: string) => {
    console.log("QR Code scanned:", qrCode);
    if (!isCheckedIn) {
      handleCheckIn();
    } else {
      handleCheckOut();
    }
  }, [isCheckedIn, handleCheckIn, handleCheckOut]);
  const user = {
    name: employeeData?.name || "User",
    email: employeeData?.work_email || "",
    image: getSecureImageUrl(employeeData?.image_url),
    jobTitle: employeeData?.job_title || "",
    department: employeeData?.department_id ? employeeData.department_id[1] : "",
    employeeId: authData?.employee_id,
    userId: authData?.user_id,
    isManager: authData?.is_manager || false
  };
  const {
    blobUrl: userImageUrl
  } = useAuthImage(user.image);
  const modules = [
    {
      icon: Clock,
      title: t('dashboard.timeTracker'),
      color: "bg-blue-50"
    },
    {
      icon: Calendar,
      title: t('dashboard.timeOff'),
      color: "bg-yellow-50"
    },
    {
      icon: BookOpen,
      title: t('dashboard.courses'),
      color: "bg-green-50"
    }
  ];
  const recentProjects = [{
    title: "Office Design",
    date: "2024-05-23 16:57:15.0699",
    icon: "🎨",
    color: "bg-orange-100"
  }, {
    title: "Research & Development",
    date: "2024-05-23 16:57:15.0699",
    icon: "🔬",
    color: "bg-orange-100"
  }];
  const ongoingTasks = [{
    title: "buy desck",
    assignee: "👤"
  }, {
    title: "welcoming new guests",
    assignee: "👤"
  }];
  const managerStats = [{
    label: t('dashboard.timeOffCount'),
    color: "bg-yellow-100 text-yellow-800"
  }, {
    label: t('dashboard.requestsCount'),
    color: "bg-purple-100 text-purple-800"
  }, {
    label: t('dashboard.expensesCount'),
    color: "bg-green-100 text-green-800"
  }, {
    label: t('dashboard.tasksCount'),
    color: "bg-blue-100 text-blue-800"
  }];
  return <div className="min-h-screen bg-background pb-20 w-full overflow-x-hidden">
      {/* Header */}
      <header className="relative bg-gradient-hero px-4 sm:px-6 py-6 sm:py-8 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-md"></div>
              <Avatar className="relative h-10 w-10 sm:h-12 sm:w-12 border-2 border-white/50 shadow-lg">
                <AvatarImage src={userImageUrl} alt={user.name} />
                <AvatarFallback className="bg-white/90 text-primary font-bold text-sm sm:text-base">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-white/80">{t('dashboard.hello')}</p>
              <p className="font-bold text-white drop-shadow-md text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{user.name}!</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Manager Stats */}
        {user.isManager && <>
            <h2 className="text-lg font-semibold">{t('dashboard.dashboard')}</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {managerStats.map((stat, index) => <Badge key={index} className={`${stat.color} whitespace-nowrap text-xs px-3 py-1`}>
                  {stat.label}
                </Badge>)}
            </div>
          </>}

        {/* Attendance Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">{t('dashboard.attendance')}</h2>
          </div>
          
          {/* Quick Check-In */}
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-2xl p-3 w-12 h-12 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-base">{t('dashboard.quickCheckIn')}</p>
                  <p className="text-sm text-muted-foreground">{t('dashboard.scanQR')}</p>
                </div>
              </div>
              <Button 
                size="icon" 
                className="bg-primary hover:bg-primary/90 rounded-full h-12 w-12"
                onClick={() => setIsQRScannerOpen(true)}
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Today's Hours */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm text-muted-foreground">{t('dashboard.todaysHours')}</h3>
              <Badge 
                variant="secondary" 
                className={isCheckedIn ? "bg-success/20 text-success" : "bg-muted text-foreground"}
              >
                {isCheckedIn ? t('dashboard.checkedIn') : t('dashboard.notStarted')}
              </Badge>
            </div>
            
            <div className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              {formatTime(elapsedTime)}
            </div>
            
            <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
              {isCheckedIn && (
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                  style={{ width: `${Math.min((elapsedTime / (9 * 3600)) * 100, 100)}%` }}
                />
              )}
            </div>
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-lg py-6 rounded-2xl"
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
            >
              <Clock className="h-5 w-5 mr-2" />
              {isCheckedIn ? t('dashboard.checkOut') : t('dashboard.checkIn')}
            </Button>
            
            <p className="text-sm text-muted-foreground text-center mt-4">
              {t('dashboard.shift')}
            </p>
          </Card>
        </section>

        {/* Modules (Employee) or Ongoing Tasks (Manager) */}
        {!user.isManager ? <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold">{t('dashboard.modules')}</h2>
              <Button variant="link" className="text-primary text-sm p-0" onClick={() => navigate("/modules")}>
                {t('dashboard.seeAll')}
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {modules.map((module, index) => <button key={index} className="flex flex-col items-center gap-2">
                  <div className={`${module.color} rounded-2xl p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center`}>
                    <module.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <span className="text-xs text-center leading-tight">{module.title}</span>
                </button>)}
            </div>
          </section> : <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold">{t('dashboard.ongoingTasks')}</h2>
              <Button variant="link" className="text-primary text-sm p-0">
                {t('dashboard.seeAll')}
              </Button>
            </div>
            <div className="space-y-3">
              {ongoingTasks.map((task, index) => <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{task.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{task.assignee}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Card>)}
            </div>
          </section>}

        {/* Recent Projects (Employee only) */}
        {!user.isManager && <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold">{t('dashboard.recentProjects')}</h2>
              <Button variant="link" className="text-primary text-sm p-0">
                {t('dashboard.seeAll')}
              </Button>
            </div>
            <div className="space-y-3">
              {recentProjects.map((project, index) => <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${project.color} rounded-full p-2 w-10 h-10 flex items-center justify-center text-lg`}>
                        {project.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{project.title}</p>
                        <p className="text-xs text-muted-foreground">{project.date}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>)}
            </div>
          </section>}

        {/* Welcome Message (Manager only) */}
        {user.isManager && <div className="text-center py-8">
            <p className="text-lg font-semibold">{t('dashboard.welcome')} {user.name}!</p>
          </div>}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Button variant="ghost" size="icon" className="text-primary">
            <Home className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/modules")}>
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

      {/* QR Scanner Modal */}
      <QRScannerModal 
        open={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleQRScan}
      />
    </div>;
};
export default Dashboard;