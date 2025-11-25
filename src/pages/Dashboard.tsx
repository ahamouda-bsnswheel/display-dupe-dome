import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { authStorage, getSecureImageUrl } from "@/lib/auth";
import { useAuthImage } from "@/hooks/use-auth-image";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Clock, 
  Calendar, 
  BookOpen, 
  Home, 
  Grid3x3, 
  Bell, 
  MoreHorizontal,
  ChevronRight
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const authData = authStorage.getAuthData();
  const employeeData = authStorage.getEmployeeData();
  
  const user = {
    name: employeeData?.name || "User",
    email: employeeData?.work_email || "",
    image: getSecureImageUrl(employeeData?.image_url),
    jobTitle: employeeData?.job_title || "",
    department: employeeData?.department_id ? employeeData.department_id[1] : "",
    employeeId: authData?.employee_id,
    userId: authData?.user_id,
    isManager: authData?.is_manager || false,
  };

  const { blobUrl: userImageUrl } = useAuthImage(user.image);

  const modules = [
    { icon: Clock, title: "Time Tracker", color: "bg-blue-50" },
    { icon: Calendar, title: "Time Off", color: "bg-yellow-50" },
    { icon: BookOpen, title: "Courses", color: "bg-green-50" },
  ];

  const recentProjects = [
    { 
      title: "Office Design", 
      date: "2024-05-23 16:57:15.0699",
      icon: "🎨",
      color: "bg-orange-100"
    },
    { 
      title: "Research & Development", 
      date: "2024-05-23 16:57:15.0699",
      icon: "🔬",
      color: "bg-orange-100"
    },
  ];

  const ongoingTasks = [
    { title: "buy desck", assignee: "👤" },
    { title: "welcoming new guests", assignee: "👤" },
  ];

  const managerStats = [
    { label: "4 Time Off", color: "bg-yellow-100 text-yellow-800" },
    { label: "0 Requests", color: "bg-purple-100 text-purple-800" },
    { label: "16 Expenses", color: "bg-green-100 text-green-800" },
    { label: "18 Tasks", color: "bg-blue-100 text-blue-800" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 max-w-screen-xl mx-auto">
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
              <p className="text-xs sm:text-sm text-white/80">Hello,</p>
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
        {user.isManager && (
          <>
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {managerStats.map((stat, index) => (
                <Badge key={index} className={`${stat.color} whitespace-nowrap text-xs px-3 py-1`}>
                  {stat.label}
                </Badge>
              ))}
            </div>
          </>
        )}

        {/* Today Attendance */}
        <section>
          <h2 className="text-base font-semibold mb-3">Today Attendance</h2>
          <Card className="p-4">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold bg-blue-50 rounded-lg px-4 py-2">00</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-blue-50 rounded-lg px-4 py-2">00</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-blue-50 rounded-lg px-4 py-2">00</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mb-4">
              GENERAL 09:00 AM TO 06:00 PM
            </p>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Check In
            </Button>
          </Card>
        </section>

        {/* Modules (Employee) or Ongoing Tasks (Manager) */}
        {!user.isManager ? (
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold">Modules</h2>
              <Button variant="link" className="text-primary text-sm p-0">
                See All
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {modules.map((module, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`${module.color} rounded-2xl p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center`}>
                    <module.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <span className="text-xs text-center leading-tight">{module.title}</span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold">Ongoing Tasks</h2>
              <Button variant="link" className="text-primary text-sm p-0">
                See All
              </Button>
            </div>
            <div className="space-y-3">
              {ongoingTasks.map((task, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{task.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{task.assignee}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Recent Projects (Employee only) */}
        {!user.isManager && (
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold">Recent Projects</h2>
              <Button variant="link" className="text-primary text-sm p-0">
                See All
              </Button>
            </div>
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <Card key={index} className="p-4">
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
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Welcome Message (Manager only) */}
        {user.isManager && (
          <div className="text-center py-8">
            <p className="text-lg font-semibold">Welcome {user.name}!</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Button variant="ghost" size="icon" className="text-primary">
            <Home className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Grid3x3 className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/more")}
          >
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;

