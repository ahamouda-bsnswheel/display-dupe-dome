import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authStorage } from "@/lib/auth";
import { Eye, EyeOff, Globe } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("oidhaym@noc.ly");
  const [password, setPassword] = useState("123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://bsnswheel.org/api/v1/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: email,
          password: password,
          player_id: "f0d27a08-34c3-4611-9e49-250c691ca53f",
          device_type: 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        authStorage.setAuthData(data);
        
        try {
          const employeeResponse = await fetch(
            `https://bsnswheel.org/api/v1/employees/${data.employee_id}?context={"lang": "ar_001"}`,
            {
              headers: {
                "Authorization": data["x-api-key"],
              },
            }
          );
          
          if (employeeResponse.ok) {
            const employeeData = await employeeResponse.json();
            authStorage.setEmployeeData(employeeData);
          }
        } catch (error) {
          console.error("Failed to fetch employee data:", error);
        }
        
        toast({
          title: "Success",
          description: "Login successful!",
        });
        
        navigate("/dashboard");
      } else {
        toast({
          title: "Error",
          description: data.message || "Login failed. Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-end mb-12">
          <button className="flex items-center gap-2 text-primary text-sm font-medium">
            English
            <Globe className="w-4 h-4" />
          </button>
        </div>

        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Welcome to NOC
          </h1>
          <p className="text-muted-foreground text-sm">
            Empowering Efficiency, Ensuring Reliability
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-normal text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Mfadel@Noc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 text-base bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-normal text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="•••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 text-base bg-white pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-start">
            <a href="#" className="text-primary text-sm hover:underline font-medium">
              Forget Password?
            </a>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-base font-semibold rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
