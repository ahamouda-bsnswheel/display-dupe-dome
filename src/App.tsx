import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import Notifications from "./pages/Notifications";
import More from "./pages/More";
import Profile from "./pages/Profile";
import OrganizationChart from "./pages/OrganizationChart";
import EmployeeDetail from "./pages/EmployeeDetail";
import UpscalingRoute from "./pages/UpscalingRoute";
import LanguageSelection from "./pages/LanguageSelection";
import Employee360 from "./pages/Employee360";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/more" element={<ProtectedRoute><More /></ProtectedRoute>} />
            <Route path="/language" element={<ProtectedRoute><LanguageSelection /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/organization-chart" element={<ProtectedRoute><OrganizationChart /></ProtectedRoute>} />
            <Route path="/employee/:employeeId" element={<ProtectedRoute><EmployeeDetail /></ProtectedRoute>} />
            <Route path="/employee/:employeeId/review" element={<ProtectedRoute><Profile readOnly /></ProtectedRoute>} />
            <Route path="/upscaling-route/:competencyId" element={<ProtectedRoute><UpscalingRoute /></ProtectedRoute>} />
            <Route path="/employee-360" element={<ProtectedRoute><Employee360 /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
