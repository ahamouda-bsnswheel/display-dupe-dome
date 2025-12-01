import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Grid3x3, Bell, MoreHorizontal } from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Home, path: "/dashboard", label: "Home" },
    { icon: Grid3x3, path: "/modules", label: "Modules" },
    { icon: Bell, path: "/notifications", label: "Notifications" },
    { icon: MoreHorizontal, path: "/more", label: "More" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 safe-area-bottom z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="icon"
            className={currentPath === item.path ? "text-primary" : ""}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-6 w-6" />
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
