import { useNavigate } from "react-router-dom";
import { ChevronLeft, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authStorage, getSecureImageUrl } from "@/lib/auth";
import { useAuthImage } from "@/hooks/use-auth-image";

interface Employee {
  name: string;
  position: string;
  image?: string;
  hasPlaceholder?: boolean;
}

const OrganizationChart = () => {
  const navigate = useNavigate();
  const employeeData = authStorage.getEmployeeData();
  
  const user = {
    name: employeeData?.name || "User",
    position: employeeData?.job_title || "Employee",
    image: getSecureImageUrl(employeeData?.image_url),
  };

  const { blobUrl: userImageUrl } = useAuthImage(user.image);

  const ceo: Employee = {
    name: "Abdulkareem Essaied Shuia",
    position: "CHRO",
    image: "",
  };

  const employees: Employee[] = [
    {
      name: user.name,
      position: user.position,
      image: user.image,
    },
    {
      name: "Abdul Salam Ali Masoud Angam",
      position: "Administrative Office C...",
      hasPlaceholder: true,
    },
    {
      name: "Aisha Mukhtar Ibrahim Al-Hashani",
      position: "Administrative Office M...",
      hasPlaceholder: true,
    },
    {
      name: "Al-Hadi Nasr Khalifa Al-Hussan",
      position: "Administrative Office C...",
      hasPlaceholder: true,
    },
    {
      name: "Al-Moataz Billah Mohammed Abuduweij",
      position: "HR Policy & Compliance...",
      image: "",
    },
    {
      name: "Essam Nasr Khalifa Al-Halak",
      position: "Administrative Office C...",
      image: "",
    },
    {
      name: "Huda Adel Ali Al-Haddad",
      position: "Data Management Direc...",
      hasPlaceholder: true,
    },
    {
      name: "Laila Ali Abdulqader Bin Omran",
      position: "Data Management Spec...",
      image: "",
    },
    {
      name: "Mohamed Mostafa Fadl",
      position: "Data Management Secti...",
      image: "",
    },
    {
      name: "Mohammed Al-Sharif Asim Kurban",
      position: "Administrative Office S...",
      hasPlaceholder: true,
    },
    {
      name: "Mohannad Wagdy Suileiman Al-Tamzeeni",
      position: "Administrative Office S...",
      hasPlaceholder: true,
    },
    {
      name: "Muna Abdul Basit Al-Naas",
      position: "Data Management Spec...",
      hasPlaceholder: true,
    },
    {
      name: "Rafaa Abdul Razzaq bin Aluwa",
      position: "Administrative Office S...",
      image: "",
    },
    {
      name: "Taqwa Abdel Nasser Bin Nafi",
      position: "HR Policy & Compliance...",
      image: "",
    },
    {
      name: "Tehani Mansour Al-Ahrash",
      position: "Data Management Senio...",
      image: "",
    },
    {
      name: "Umm Al-Saad Al-Mahdi Futuraik",
      position: "Administrative Office S...",
      image: "",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="text-lg font-medium">Organization Chart</span>
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pb-8">
          {/* CEO/Top Level */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-card rounded-2xl border-2 border-border p-4 w-full max-w-[280px]">
              <div className="flex flex-col items-center">
                <Avatar className="h-16 w-16 mb-3">
                  <AvatarImage src={ceo.image} alt={ceo.name} />
                  <AvatarFallback className="bg-muted">
                    {ceo.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-semibold text-primary text-center mb-1">
                  {ceo.name}
                </p>
                <p className="text-xs text-muted-foreground text-center">{ceo.position}</p>
              </div>
            </div>
            
            {/* Connecting Line */}
            <div className="w-0.5 h-8 bg-border" />
          </div>

          {/* Employees Grid */}
          <div className="grid grid-cols-2 gap-4">
            {employees.map((employee, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-card rounded-2xl border-2 border-border p-4 w-full">
                  <div className="flex flex-col items-center">
                    {employee.hasPlaceholder ? (
                      <div className="h-16 w-16 mb-3 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-8 w-8 text-primary-foreground" />
                      </div>
                    ) : (
                      <Avatar className="h-16 w-16 mb-3">
                        <AvatarImage src={employee.image} alt={employee.name} />
                        <AvatarFallback className="bg-muted">
                          {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <p className="text-sm font-semibold text-primary text-center mb-1 leading-tight">
                      {employee.name}
                    </p>
                    <p className="text-xs text-muted-foreground text-center leading-tight">
                      {employee.position}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrganizationChart;
