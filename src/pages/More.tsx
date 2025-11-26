import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authStorage, getSecureImageUrl } from "@/lib/auth";
import { useAuthImage } from "@/hooks/use-auth-image";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  User, 
  LayoutGrid, 
  Globe, 
  BookOpen, 
  FileText, 
  LogOut,
  ChevronRight,
  ChevronLeft,
  Home,
  Grid3x3,
  Bell,
  MoreHorizontal
} from "lucide-react";

const More = () => {
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();
  const authData = authStorage.getAuthData();
  const employeeData = authStorage.getEmployeeData();
  
  const user = {
    name: employeeData?.name || "User",
    role: employeeData?.job_title || "Employee",
    image: getSecureImageUrl(employeeData?.image_url),
  };

  const { blobUrl: userImageUrl } = useAuthImage(user.image);

  const handleLogout = () => {
    authStorage.clearAuthData();
    navigate("/");
  };

  const menuItems = [
    { icon: User, label: t('more.myProfile'), onClick: () => navigate("/profile") },
    { icon: LayoutGrid, label: t('more.myDashboard'), onClick: () => navigate("/dashboard") },
    { icon: Globe, label: t('more.language'), onClick: () => navigate("/language") },
    { icon: BookOpen, label: t('more.myCourses'), onClick: () => {} },
    { icon: FileText, label: t('more.privacyPolicy'), onClick: () => {} },
    { icon: FileText, label: t('more.termsAndConditions'), onClick: () => {} },
  ];

  const ChevronIcon = language === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-background pb-20 max-w-screen-xl mx-auto">
      {/* Profile Section */}
      <div className="bg-card px-4 sm:px-6 md:px-8 py-6 sm:py-8 flex flex-col items-center">
        <Avatar className="h-24 w-24 sm:h-32 sm:w-32 mb-4">
          <AvatarImage src={userImageUrl} alt={user.name} />
          <AvatarFallback className="bg-muted text-xl sm:text-2xl">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-1 text-center px-4">{user.name}</h2>
        <p className="text-muted-foreground text-sm sm:text-base text-center">{user.role}</p>
      </div>

      {/* Menu Items */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
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
            <ChevronIcon className="h-5 w-5 text-primary" />
          </button>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 py-4 px-4 bg-card hover:bg-muted/50 transition-colors mt-4"
        >
          <LogOut className="h-6 w-6 text-destructive" />
          <span className="text-base font-medium text-destructive">{t('more.logOut')}</span>
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
