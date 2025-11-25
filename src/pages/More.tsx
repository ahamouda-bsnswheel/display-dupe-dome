import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authStorage } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  LayoutGrid, 
  Globe, 
  BookOpen, 
  FileText, 
  LogOut,
  ChevronRight,
  Home,
  Grid3x3,
  Bell,
  MoreHorizontal
} from "lucide-react";

const More = () => {
  const navigate = useNavigate();
  const authData = authStorage.getAuthData();
  const employeeData = authStorage.getEmployeeData();
  
  const user = {
    name: employeeData?.name || "User",
    role: (employeeData as any)?.position || "Employee",
    image: employeeData?.image,
  };

  const handleLogout = () => {
    authStorage.clearAuthData();
    navigate("/");
  };

  const menuItems = [
    { icon: User, label: "My Profile", onClick: () => {} },
    { icon: LayoutGrid, label: "My Dashboard", onClick: () => navigate("/dashboard") },
    { icon: Globe, label: "Language", onClick: () => {} },
    { icon: BookOpen, label: "My Courses", onClick: () => {} },
    { icon: FileText, label: "Privacy Policy", onClick: () => {} },
    { icon: FileText, label: "Terms And Conditions", onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Section */}
      <div className="bg-card px-6 py-8 flex flex-col items-center">
        <Avatar className="h-32 w-32 mb-4">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback className="bg-muted text-2xl">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-semibold text-primary mb-1">{user.name}</h2>
        <p className="text-muted-foreground">{user.role}</p>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-6">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full flex items-center justify-between py-4 px-4 bg-card hover:bg-muted/50 transition-colors border-b border-border"
          >
            <div className="flex items-center gap-4">
              <item.icon className="h-6 w-6 text-foreground" />
              <span className="text-base font-medium">{item.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-primary" />
          </button>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 py-4 px-4 bg-card hover:bg-muted/50 transition-colors mt-4"
        >
          <LogOut className="h-6 w-6 text-destructive" />
          <span className="text-base font-medium text-destructive">Log Out</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Grid3x3 className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary">
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default More;
