import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthImage } from "@/hooks/use-auth-image";

interface Employee {
  id: string;
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  imageUrl?: string;
}

// Employee card component to handle individual image loading
const EmployeeCard = ({ employee, onClick }: { employee: Employee; onClick: () => void }) => {
  const { blobUrl } = useAuthImage(employee.imageUrl);
  
  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-card"
      onClick={onClick}
    >
      <div className="flex gap-4">
        <Avatar className="h-24 w-24 shrink-0 border-4 border-slate-800">
          <AvatarImage src={blobUrl} alt={employee.name} className="object-cover" />
          <AvatarFallback className="bg-slate-800 text-primary text-2xl">
            {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <h3 className="font-semibold text-foreground text-lg leading-tight mb-1">
            {employee.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-3">
            {employee.jobTitle}
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span>{employee.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Employee360 = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock data - will be replaced with API integration
  const employees: Employee[] = [
    {
      id: "882",
      name: "Abdul Salam Ali Masoud Angam",
      jobTitle: "Administrative Office Coordinator",
      email: "Aengam@noc.ly",
      phone: "925595195",
    },
    {
      id: "891",
      name: "Abdulkareem Essaied Shuia",
      jobTitle: "CHRO",
      email: "ashuia@noc.ly",
      phone: "912192636",
    },
    {
      id: "892",
      name: "Aisha Mukhtar Ibrahim Al-Hashani",
      jobTitle: "Administrative Office Manager",
      email: "aelhashani@noc.ly",
      phone: "927586697",
    },
    {
      id: "893",
      name: "Al-Hadi Nasr Khalifa Al-Hussan",
      jobTitle: "Administrative Office Coordinator",
      email: "aelhsan@noc.ly",
      phone: "925047673",
    },
    {
      id: "894",
      name: "Al-Moataz Billah Mohammed Abuduweij",
      jobTitle: "HR Policy & Compliance Specialist",
      email: "aaboudweeh@noc.ly",
      phone: "912427790",
    },
    {
      id: "895",
      name: "Essam Nasr Khalifa Al-Halak",
      jobTitle: "Administrative Office Coordinator",
      email: "ealhalak@noc.ly",
      phone: "912345678",
    },
  ];

  const handleEmployeeClick = (employeeId: string) => {
    navigate(`/employee/${employeeId}`);
  };

  return (
    <div className="min-h-screen bg-background max-w-screen-xl mx-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/modules")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">{t('employee360.title')}</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Employee List */}
      <main className="px-4 py-4 space-y-3">
        {employees.map((employee) => (
          <EmployeeCard 
            key={employee.id} 
            employee={employee} 
            onClick={() => handleEmployeeClick(employee.id)}
          />
        ))}
      </main>
    </div>
  );
};

export default Employee360;
