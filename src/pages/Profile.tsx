import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Power, Plus, Edit, Trash2, Phone, Mail, Check } from "lucide-react";
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
import { BadgeImage } from "@/components/BadgeImage";
import DOMPurify from "dompurify";

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

          // Populate badges
          if (data.badges && data.badges.length > 0) {
            setBadges(data.badges);
          }

          // Populate karma value
          if (data.ranks && data.ranks.karma_value !== undefined) {
            setKarmaValue(data.ranks.karma_value);
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
  const [badges, setBadges] = useState<any[]>([]);
  const [karmaValue, setKarmaValue] = useState(0);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
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
        <div className="relative bg-gradient-hero px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
          
          <div className="relative flex flex-col items-center mb-4">
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-gradient-hero rounded-full blur-xl opacity-60 animate-pulse"></div>
              <Avatar className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 border-4 border-white/30 shadow-2xl">
                <AvatarImage src={userImageUrl} alt={user.name} />
                <AvatarFallback className="bg-white/90 text-primary text-lg sm:text-xl md:text-2xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-lg text-center px-4">{user.name}</h2>
            <p className="text-xs sm:text-sm text-white/90 mb-1 flex items-center gap-1.5 drop-shadow">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate max-w-[200px] sm:max-w-none">{user.employeeId}</span>
            </p>
            <p className="text-xs sm:text-sm text-white/90 flex items-center gap-1.5 drop-shadow">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate max-w-[200px] sm:max-w-none">{user.email}</span>
            </p>
          </div>
          
          <div className="relative text-xs sm:text-sm space-y-1 bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 max-w-md mx-auto">
            <p className="flex items-center gap-2 text-white">
              <span>•</span>
              <span className="truncate">{user.position}</span>
            </p>
            <p className="flex items-center gap-2 text-white">
              <span>•</span>
              <span className="truncate">{user.department}</span>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setSearchParams({ tab: value })}
          className="w-full"
        >
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto overflow-x-auto flex-nowrap">
            <TabsTrigger 
              value="resume" 
              className="flex-shrink-0 rounded-none border-b-2 border-transparent text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary/5 data-[state=active]:to-transparent px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all"
            >
              Resume
            </TabsTrigger>
            <TabsTrigger 
              value="work-info"
              className="flex-shrink-0 rounded-none border-b-2 border-transparent text-muted-foreground data-[state=active]:text-secondary data-[state=active]:border-secondary data-[state=active]:bg-gradient-to-t data-[state=active]:from-secondary/5 data-[state=active]:to-transparent px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all"
            >
              Work Info
            </TabsTrigger>
            <TabsTrigger 
              value="private-info"
              className="flex-shrink-0 rounded-none border-b-2 border-transparent text-muted-foreground data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:bg-gradient-to-t data-[state=active]:from-accent/5 data-[state=active]:to-transparent px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all"
            >
              Private Info
            </TabsTrigger>
            <TabsTrigger 
              value="achievements"
              className="flex-shrink-0 rounded-none border-b-2 border-transparent text-muted-foreground data-[state=active]:text-coral data-[state=active]:border-coral data-[state=active]:bg-gradient-to-t data-[state=active]:from-coral/5 data-[state=active]:to-transparent px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all"
            >
              My Achievement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 mt-0">
            {/* Competencies */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse"></div>
                <h3 className="text-base font-bold bg-gradient-primary bg-clip-text text-transparent">Competencies</h3>
              </div>
              <CompetencyPuzzle competencies={competencies} />
            </div>

            {/* Work Experience */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-secondary animate-pulse"></div>
                  <h3 className="text-base font-bold bg-gradient-secondary bg-clip-text text-transparent">Work Experience</h3>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 hover:bg-secondary/10 hover:text-secondary transition-colors"
                  onClick={() => setIsAddWorkExpOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {workExperience.map((exp, index) => (
                  <div key={index} className="glass hover-lift bg-card/50 backdrop-blur p-4 rounded-xl border border-secondary/20 shadow-lg shadow-secondary/5 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-secondary mb-1.5">{exp.dates}</p>
                        <p className="text-sm font-semibold text-foreground mb-1">{exp.title}</p>
                        {exp.companyName && (
                          <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button 
                          onClick={() => handleEditWorkExp(exp, index)}
                          className="text-muted-foreground hover:text-secondary transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteWorkExp(index)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
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
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-accent animate-pulse"></div>
                  <h3 className="text-base font-bold bg-gradient-accent bg-clip-text text-transparent">Skills</h3>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 hover:bg-accent/10 hover:text-accent transition-colors"
                  onClick={() => setIsAddSkillOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="glass hover-lift bg-card/50 backdrop-blur p-4 rounded-xl border border-accent/20 shadow-lg shadow-accent/5 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground mb-1">{skill.name}</p>
                        <p className="text-xs font-medium text-accent">{skill.level}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{skill.category}</p>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button 
                          onClick={() => handleEditSkill(skill)}
                          className="text-muted-foreground hover:text-accent transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSkill(index)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
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

          <TabsContent value="work-info" className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 mt-0">
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
                  <p className="text-sm font-semibold text-foreground">Reporting Structure</p>
                </div>
                <div className="space-y-3 ml-5">
                  {/* Show managers if available */}
                  {employeeData?.attendance_manager_id && Array.isArray(employeeData.attendance_manager_id) && (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={employeeData.attendance_manager_id[1]} />
                        <AvatarFallback className="bg-muted text-sm">
                          {employeeData.attendance_manager_id[1].split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{employeeData.attendance_manager_id[1]}</p>
                        <p className="text-sm text-muted-foreground">Manager</p>
                      </div>
                    </div>
                  )}
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
              <div className="bg-card p-4 rounded-lg border border-border">
                {employeeData?.job_description ? (
                  <div 
                    className="text-sm text-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(employeeData.job_description, {
                        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'span', 'div'],
                        ALLOWED_ATTR: ['class']
                      })
                    }}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No job description available</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="private-info" className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 mt-0">
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

          <TabsContent value="achievements" className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">{/* User Level Section */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-48 h-48 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-xl" />
                <Avatar className="relative w-48 h-48 ring-4 ring-primary/20">
                  <AvatarImage 
                    src={userImageUrl} 
                    alt={user.name}
                  />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className="text-base font-semibold text-foreground">
                Get <span className="text-primary">{karmaValue}</span> xp to level up!
              </p>
            </div>

            {/* Badges Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Badges</h3>
              <div className="space-y-3">
                {badges.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No badges earned yet</p>
                ) : (
                  badges.map((badge) => (
                    <div 
                      key={badge.id}
                      className="bg-card p-4 rounded-lg border border-border flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <BadgeImage
                          imageUrl={getSecureImageUrl(badge.image_url) || ""}
                          alt={badge.name}
                          className="w-12 h-12"
                        />
                        <div>
                          <p className="text-base font-semibold text-foreground">{badge.name}</p>
                          {badge.description && (
                            <p className="text-sm text-muted-foreground">{badge.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
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
