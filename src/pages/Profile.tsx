import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Power, Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authStorage, getSecureImageUrl } from "@/lib/auth";
import { useAuthImage } from "@/hooks/use-auth-image";
import { CompetencyPuzzle } from "@/components/CompetencyPuzzle";
import { AddWorkExperienceModal } from "@/components/AddWorkExperienceModal";
import { DeleteWorkExperienceDialog } from "@/components/DeleteWorkExperienceDialog";
import { AddSkillModal } from "@/components/AddSkillModal";
import { EditPrivateContactModal } from "@/components/EditPrivateContactModal";
import { EditFamilyStatusModal } from "@/components/EditFamilyStatusModal";
import { EditEmergencyModal } from "@/components/EditEmergencyModal";
import { EditEducationModal } from "@/components/EditEducationModal";

interface WorkExperience {
  id?: number;
  dates: string;
  title: string;
  companyName?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "resume";
  const [isAddWorkExpOpen, setIsAddWorkExpOpen] = useState(false);
  const [isEditWorkExpOpen, setIsEditWorkExpOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkExp, setSelectedWorkExp] = useState<WorkExperience | null>(null);
  const [selectedWorkExpIndex, setSelectedWorkExpIndex] = useState<number | null>(null);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isEditSkillOpen, setIsEditSkillOpen] = useState(false);
  const [isDeleteSkillDialogOpen, setIsDeleteSkillDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number | null>(null);
  
  // Private Info modals
  const [isEditPrivateContactOpen, setIsEditPrivateContactOpen] = useState(false);
  const [isEditFamilyStatusOpen, setIsEditFamilyStatusOpen] = useState(false);
  const [isEditEmergencyOpen, setIsEditEmergencyOpen] = useState(false);
  const [isEditEducationOpen, setIsEditEducationOpen] = useState(false);
  
  const employeeData = authStorage.getEmployeeData();
  const employeeId = employeeData?.id;
  
  const user = {
    name: employeeData?.name || "User",
    employeeId: employeeData?.work_phone || "N/A",
    email: employeeData?.work_email || "user@example.com",
    position: employeeData?.job_title || "Employee",
    department: employeeData?.department_id ? employeeData.department_id[1] : "Human Resource",
    image: getSecureImageUrl(employeeData?.image_url),
  };

  const { blobUrl: userImageUrl } = useAuthImage(user.image);

  // Fetch employee details for Resume tab
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!employeeId) return;

      try {
        const headers = authStorage.getAuthHeaders();
        const response = await fetch(
          `https://bsnswheel.org/api/v1/employee_details/custom/${employeeId}`,
          {
            method: "PUT",
            headers,
          }
        );

        if (response.ok) {
          const data = await response.json();
          
          // Populate work experience from resumes
          if (data.resumes && data.resumes.length > 0) {
            const workExpResume = data.resumes.find((r: any) => r.type === "Work Experience");
            if (workExpResume && workExpResume.lines) {
              const formattedWorkExp = workExpResume.lines.map((line: any) => ({
                id: line.id,
                dates: formatDateRange(line.date_start, line.date_end),
                title: line.name,
                companyName: line.description || "---",
              }));
              setWorkExperience(formattedWorkExp);
            }
          }

          // Populate skills
          if (data.skills && data.skills.length > 0) {
            const formattedSkills = data.skills.map((skill: any) => ({
              id: skill.id,
              name: skill.skill_id[1],
              level: `${skill.skill_level_id[1]} (${skill.level_progress}%)`,
              category: skill.skill_type_id[1],
            }));
            setSkills(formattedSkills);
          }

          // Populate competencies
          if (data.competencies && data.competencies.length > 0) {
            setCompetencies(data.competencies);
          }
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  // Helper function to format date ranges
  const formatDateRange = (startDate: string, endDate: string) => {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const handleLogout = () => {
    authStorage.clearAuthData();
    navigate("/");
  };

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);

  const handleEditWorkExp = (exp: WorkExperience, index: number) => {
    setSelectedWorkExp(exp);
    setSelectedWorkExpIndex(index);
    setIsEditWorkExpOpen(true);
  };

  const handleDeleteWorkExp = (index: number) => {
    setSelectedWorkExpIndex(index);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteWorkExp = () => {
    if (selectedWorkExpIndex !== null) {
      setWorkExperience(workExperience.filter((_, i) => i !== selectedWorkExpIndex));
      setSelectedWorkExpIndex(null);
    }
  };

  const handleEditSkill = (skill: any) => {
    setSelectedSkill(skill);
    setIsEditSkillOpen(true);
  };

  const handleDeleteSkill = (index: number) => {
    setSelectedSkillIndex(index);
    setIsDeleteSkillDialogOpen(true);
  };

  const confirmDeleteSkill = () => {
    if (selectedSkillIndex !== null) {
      setSkills(skills.filter((_, i) => i !== selectedSkillIndex));
      setSelectedSkillIndex(null);
    }
  };

  const [skills, setSkills] = useState([]);
  const [competencies, setCompetencies] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/more")}
          className="flex items-center gap-2 text-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="text-lg font-medium">Profile</span>
        </button>
        <button onClick={handleLogout}>
          <Power className="h-6 w-6 text-destructive" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        {/* User Info Section */}
        <div className="bg-card px-6 py-6">
          <div className="flex flex-col items-center mb-4">
            <Avatar className="h-24 w-24 mb-3">
              <AvatarImage src={userImageUrl} alt={user.name} />
              <AvatarFallback className="bg-muted text-xl">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-primary mb-1">{user.name}</h2>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
              <Phone className="h-4 w-4" />
              {user.employeeId}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
          </div>
          
          <div className="text-sm space-y-1">
            <p className="flex items-center gap-2">
              <span className="text-foreground">•</span>
              <span className="text-foreground">{user.position}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-foreground">•</span>
              <span className="text-foreground">{user.department}</span>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setSearchParams({ tab: value })}
          className="w-full"
        >
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="resume" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              Resume
            </TabsTrigger>
            <TabsTrigger 
              value="work-info"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              Work Info
            </TabsTrigger>
            <TabsTrigger 
              value="private-info"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              Private Info
            </TabsTrigger>
            <TabsTrigger 
              value="achievements"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              My Achievement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="p-4 space-y-6 mt-0">
            {/* Competencies */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Competencies</h3>
              <CompetencyPuzzle competencies={competencies} />
            </div>

            {/* Work Experience */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">Work Experience</h3>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6"
                  onClick={() => setIsAddWorkExpOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {workExperience.map((exp, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">{exp.dates}</p>
                        <p className="text-sm font-medium text-foreground">{exp.title}</p>
                        {exp.companyName && (
                          <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button 
                          onClick={() => handleEditWorkExp(exp, index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteWorkExp(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">Skills</h3>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6"
                  onClick={() => setIsAddSkillOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground mb-1">{skill.name}</p>
                        <p className="text-sm text-muted-foreground">{skill.level}</p>
                        <p className="text-sm text-muted-foreground">{skill.category}</p>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button 
                          onClick={() => handleEditSkill(skill)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSkill(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="work-info" className="p-4 space-y-6 mt-0">
            {/* Private Contact */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Private Contact</h3>
              <div className="bg-card p-4 rounded-lg border border-border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Work Address</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.address_id && Array.isArray(employeeData.address_id)
                        ? employeeData.address_id[1] 
                        : "---"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Work Location</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.work_location_id && Array.isArray(employeeData.work_location_id)
                        ? employeeData.work_location_id[1]
                        : "---"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Approvers */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Approvers</h3>
              <div className="bg-card p-4 rounded-lg border border-border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Expenses</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.expense_manager_id && Array.isArray(employeeData.expense_manager_id)
                        ? employeeData.expense_manager_id[1]
                        : "---"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Time Off</p>
                    <p className="text-sm text-muted-foreground">---</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Time Sheet</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.timesheet_manager_id && Array.isArray(employeeData.timesheet_manager_id)
                        ? employeeData.timesheet_manager_id[1]
                        : "---"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Attendance</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.attendance_manager_id && Array.isArray(employeeData.attendance_manager_id)
                        ? employeeData.attendance_manager_id[1]
                        : "---"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Schedule</h3>
              <div className="bg-card p-4 rounded-lg border border-border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Working Hours</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.resource_calendar_id && Array.isArray(employeeData.resource_calendar_id)
                        ? employeeData.resource_calendar_id[1]
                        : "---"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Work Location Plan</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.work_location_plan_id && Array.isArray(employeeData.work_location_plan_id)
                        ? employeeData.work_location_plan_id[1]
                        : "---"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Time Zone</p>
                    <p className="text-sm text-muted-foreground">{employeeData?.tz || "---"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Planning Section */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Planning</h3>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Roles</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.planning_role_ids && employeeData.planning_role_ids.length > 0
                        ? employeeData.planning_role_ids.join(", ")
                        : "No Roles"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Chart Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">Organization Chart</h3>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-primary"
                  onClick={() => navigate("/organization-chart")}
                >
                  See All
                </Button>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                  <p className="text-sm font-semibold text-foreground">Roles</p>
                </div>
                <div className="space-y-3 ml-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt="Abdulkareem Essaied Shuia" />
                      <AvatarFallback className="bg-muted text-sm">AE</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">Abdulkareem Essaied Shuia</p>
                      <p className="text-sm text-muted-foreground">CHRO</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userImageUrl} alt={user.name} />
                      <AvatarFallback className="bg-muted text-sm">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description Section */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Job Description</h3>
              <div className="bg-card p-4 rounded-lg border border-border space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2">Job Summary:</h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    The Administrative Office Specialist is responsible for providing high-level administrative, clerical, and operational support to the office or department, ensuring efficient day-to-day operations. This role serves as a central point of contact, manages vital information flow, and performs specialized administrative duties that require a high degree of confidentiality, organization, and problem-solving skills.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2">Key Responsibilities:</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">1. Administrative and Clerical Support:</p>
                    <p className="text-sm text-foreground ml-4">
                      • <span className="font-medium">Correspondence Management:</span> Manage incoming and outgoing communications, including answering and directing phone calls.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="private-info" className="p-4 space-y-6 mt-0">
            {/* Private Contact */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Private Contact</h3>
              <div className="bg-card p-4 rounded-lg border border-border space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Private Address</p>
                      <p className="text-sm text-muted-foreground">
                        {employeeData?.private_street || "---"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditPrivateContactOpen(true)}
                    className="text-muted-foreground hover:text-foreground ml-2"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.private_email || "---"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.private_phone || "---"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Bank Account Number</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.bank_account_id && Array.isArray(employeeData.bank_account_id)
                        ? employeeData.bank_account_id[1]
                        : "---"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Language</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.lang || "---"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Home Work Distance</p>
                    <p className="text-sm text-muted-foreground">---</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Private Car Plate</p>
                    <p className="text-sm text-muted-foreground">---</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Family Status */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Family Status</h3>
              <div className="bg-card p-4 rounded-lg border border-border space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Marital Status</p>
                      <p className="text-sm text-muted-foreground">
                        {employeeData?.marital 
                          ? employeeData.marital.charAt(0).toUpperCase() + employeeData.marital.slice(1)
                          : "---"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditFamilyStatusOpen(true)}
                    className="text-muted-foreground hover:text-foreground ml-2"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Number of Children</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.children ?? "---"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Emergency</h3>
              <div className="bg-card p-4 rounded-lg border border-border space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Contact Name</p>
                      <p className="text-sm text-muted-foreground">---</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditEmergencyOpen(true)}
                    className="text-muted-foreground hover:text-foreground ml-2"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Contact Phone</p>
                    <p className="text-sm text-muted-foreground">---</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Education</h3>
              <div className="bg-card p-4 rounded-lg border border-border space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Certificate Level</p>
                      <p className="text-sm text-muted-foreground">Bachelor</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditEducationOpen(true)}
                    className="text-muted-foreground hover:text-foreground ml-2"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Field of Study</p>
                    <p className="text-sm text-muted-foreground">محاسبة</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">School</p>
                    <p className="text-sm text-muted-foreground">---</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="p-4">
            <p className="text-muted-foreground">My Achievement content coming soon...</p>
          </TabsContent>
        </Tabs>
      </ScrollArea>

      {/* Add Work Experience Modal */}
      <AddWorkExperienceModal 
        open={isAddWorkExpOpen}
        onOpenChange={setIsAddWorkExpOpen}
      />

      {/* Edit Work Experience Modal */}
      <AddWorkExperienceModal 
        open={isEditWorkExpOpen}
        onOpenChange={setIsEditWorkExpOpen}
        editData={selectedWorkExp || undefined}
        isEditMode={true}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteWorkExperienceDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteWorkExp}
      />

      {/* Add Skill Modal */}
      <AddSkillModal 
        open={isAddSkillOpen}
        onOpenChange={setIsAddSkillOpen}
      />

      {/* Edit Skill Modal */}
      <AddSkillModal 
        open={isEditSkillOpen}
        onOpenChange={setIsEditSkillOpen}
        editData={selectedSkill}
        isEditMode={true}
      />

      {/* Delete Skill Confirmation Dialog */}
      <DeleteWorkExperienceDialog
        open={isDeleteSkillDialogOpen}
        onOpenChange={setIsDeleteSkillDialogOpen}
        onConfirm={confirmDeleteSkill}
      />

      {/* Edit Private Contact Modal */}
      <EditPrivateContactModal
        open={isEditPrivateContactOpen}
        onOpenChange={setIsEditPrivateContactOpen}
        defaultValues={{
          email: user.email,
          phone: "926319723",
        }}
      />

      {/* Edit Family Status Modal */}
      <EditFamilyStatusModal
        open={isEditFamilyStatusOpen}
        onOpenChange={setIsEditFamilyStatusOpen}
        defaultValues={{
          maritalStatus: "Single",
          numberOfChildren: "0",
        }}
      />

      {/* Edit Emergency Modal */}
      <EditEmergencyModal
        open={isEditEmergencyOpen}
        onOpenChange={setIsEditEmergencyOpen}
        defaultValues={{
          contactName: "",
          contactPhone: "",
        }}
      />

      {/* Edit Education Modal */}
      <EditEducationModal
        open={isEditEducationOpen}
        onOpenChange={setIsEditEducationOpen}
        defaultValues={{
          certificateLevel: "Bachelor",
          fieldOfStudy: "محاسبة",
          school: "",
        }}
      />
    </div>
  );
};

export default Profile;
