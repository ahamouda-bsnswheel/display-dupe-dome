import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Power, Plus, Edit, Trash2, Phone, Mail, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
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
  lineTypeId?: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const isRTL = language === 'ar';
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
  
  // Organization chart manager
  const [directManager, setDirectManager] = useState<any>(null);
  
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
  const { blobUrl: managerImageUrl } = useAuthImage(getSecureImageUrl(directManager?.image_url));

  // Helper function to format date ranges
  const formatDateRange = (startDate: string, endDate: string | boolean) => {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const endDateText = (typeof endDate === 'string') ? formatDate(endDate) : t('profile.current');
    return `${formatDate(startDate)} - ${endDateText}`;
  };

  // Fetch organization chart data to get direct manager
  const fetchOrgChartData = async () => {
    if (!employeeId) return;

    try {
      const headers = authStorage.getAuthHeaders();
      const response = await fetch(
        `https://bsnswheel.org/api/v1/org_chart/custom/${employeeId}`,
        {
          method: "PUT",
          headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Find the manager from the org chart data
        const manager = data.result?.find((emp: any) => emp.type === "manager");
        setDirectManager(manager);
      }
    } catch (error) {
      console.error("Error fetching org chart data:", error);
    }
  };

  // Fetch employee details for Resume tab
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
              title: line.description || "",
              companyName: line.name,
              lineTypeId: line.id,
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

  useEffect(() => {
    fetchEmployeeDetails();
    fetchOrgChartData();
  }, [employeeId]);

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
    <div className="min-h-screen bg-background flex flex-col max-w-screen-xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/more")}
          className="flex items-center gap-2 text-foreground"
        >
          {isRTL ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
          <span className="text-lg font-medium">{t('profile.title')}</span>
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
            <p className={`text-xs sm:text-sm text-white/90 mb-1 flex items-center gap-1.5 drop-shadow ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate max-w-[200px] sm:max-w-none">{user.employeeId}</span>
            </p>
            <p className={`text-xs sm:text-sm text-white/90 flex items-center gap-1.5 drop-shadow ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate max-w-[200px] sm:max-w-none">{user.email}</span>
            </p>
          </div>
          
          <div className="relative text-xs sm:text-sm space-y-1 bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 max-w-md mx-auto">
            <p className={`flex items-center gap-2 text-white ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <span>•</span>
              <span className="truncate">{user.position}</span>
            </p>
            <p className={`flex items-center gap-2 text-white ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
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
              {t('profile.resume')}
            </TabsTrigger>
            <TabsTrigger 
              value="work-info"
              className="flex-shrink-0 rounded-none border-b-2 border-transparent text-muted-foreground data-[state=active]:text-secondary data-[state=active]:border-secondary data-[state=active]:bg-gradient-to-t data-[state=active]:from-secondary/5 data-[state=active]:to-transparent px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all"
            >
              {t('profile.workInfo')}
            </TabsTrigger>
            <TabsTrigger 
              value="private-info"
              className="flex-shrink-0 rounded-none border-b-2 border-transparent text-muted-foreground data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:bg-gradient-to-t data-[state=active]:from-accent/5 data-[state=active]:to-transparent px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all"
            >
              {t('profile.privateInfo')}
            </TabsTrigger>
            <TabsTrigger 
              value="achievements"
              className="flex-shrink-0 rounded-none border-b-2 border-transparent text-muted-foreground data-[state=active]:text-coral data-[state=active]:border-coral data-[state=active]:bg-gradient-to-t data-[state=active]:from-coral/5 data-[state=active]:to-transparent px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all"
            >
              {t('profile.myAchievement')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 mt-0">
            {/* Competencies */}
            <div>
              <h3 className={`text-base font-semibold text-primary mb-3 ${isRTL ? 'text-right' : ''}`}>{t('profile.competencies')}</h3>
              <CompetencyPuzzle competencies={competencies} />
            </div>

            {/* Work Experience */}
            <div>
              <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className={`text-base font-semibold text-secondary ${isRTL ? 'text-right' : ''}`}>{t('profile.workExperience')}</h3>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 text-secondary hover:text-secondary/80"
                  onClick={() => setIsAddWorkExpOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {workExperience.map((exp, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg border border-primary/20">
                    <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                        <p className="text-sm text-secondary mb-1">{exp.dates}</p>
                        <p className="text-sm font-medium text-primary">{exp.title}</p>
                        {exp.companyName && (
                          <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                        )}
                      </div>
                      <div className={`flex gap-2 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                        <button 
                          onClick={() => handleEditWorkExp(exp, index)}
                          className="text-primary hover:text-primary/80"
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
              <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className={`text-base font-semibold text-primary ${isRTL ? 'text-right' : ''}`}>{t('profile.skills')}</h3>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 text-primary hover:text-primary/80"
                  onClick={() => setIsAddSkillOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-card p-4 rounded-lg border border-secondary/20">
                    <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                        <p className="text-sm font-medium text-secondary mb-1">{skill.name}</p>
                        <p className="text-sm text-primary">{skill.level}</p>
                        <p className="text-sm text-muted-foreground">{skill.category}</p>
                      </div>
                      <div className={`flex gap-2 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                        <button 
                          onClick={() => handleEditSkill(skill)}
                          className="text-secondary hover:text-secondary/80"
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

          <TabsContent value="work-info" className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 mt-0">
            {/* Private Contact */}
            <div>
              <h3 className={`text-base font-semibold text-primary mb-3 ${isRTL ? 'text-right' : ''}`}>{t('profile.privateContact')}</h3>
              <div className="bg-card p-4 rounded-lg border border-primary/20 space-y-4">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.workAddress')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.address_id && Array.isArray(employeeData.address_id)
                        ? employeeData.address_id[1] 
                        : "---"}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.workLocation')}</p>
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
              <h3 className={`text-base font-semibold text-secondary mb-3 ${isRTL ? 'text-right' : ''}`}>{t('profile.approvers')}</h3>
              <div className="bg-card p-4 rounded-lg border border-secondary/20 space-y-4">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.expenses')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.expense_manager_id && Array.isArray(employeeData.expense_manager_id)
                        ? employeeData.expense_manager_id[1]
                        : "---"}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.timeOff')}</p>
                    <p className="text-sm text-muted-foreground">---</p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.timeSheet')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.timesheet_manager_id && Array.isArray(employeeData.timesheet_manager_id)
                        ? employeeData.timesheet_manager_id[1]
                        : "---"}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.attendance')}</p>
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
              <h3 className={`text-base font-semibold text-primary mb-3 ${isRTL ? 'text-right' : ''}`}>{t('profile.schedule')}</h3>
              <div className="bg-card p-4 rounded-lg border border-primary/20 space-y-4">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.workingHours')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.resource_calendar_id && Array.isArray(employeeData.resource_calendar_id)
                        ? employeeData.resource_calendar_id[1]
                        : "---"}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.workLocationPlan')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.work_location_plan_id && Array.isArray(employeeData.work_location_plan_id)
                        ? employeeData.work_location_plan_id[1]
                        : "---"}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.timeZone')}</p>
                    <p className="text-sm text-muted-foreground">{employeeData?.tz || "---"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Planning Section */}
            <div>
              <h3 className={`text-base font-semibold text-secondary mb-3 ${isRTL ? 'text-right' : ''}`}>{t('profile.planning')}</h3>
              <div className="bg-card p-4 rounded-lg border border-secondary/20">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.roles')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.planning_role_ids && employeeData.planning_role_ids.length > 0
                        ? employeeData.planning_role_ids.join(", ")
                        : t('profile.noRoles')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Chart Section */}
            <div>
              <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className={`text-base font-semibold text-primary ${isRTL ? 'text-right' : ''}`}>{t('profile.organizationChart')}</h3>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-secondary hover:text-secondary/80"
                  onClick={() => navigate("/organization-chart")}
                >
                  {t('profile.seeAll')}
                </Button>
              </div>
              <div className="bg-card p-4 rounded-lg border border-primary/20">
                <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0 mt-1" />
                  <p className={`text-sm font-semibold text-primary ${isRTL ? 'text-right' : ''}`}>{t('profile.reportingStructure')}</p>
                </div>
                <div className={`space-y-3 ${isRTL ? 'mr-5' : 'ml-5'}`}>
                  {/* Show direct manager from org chart */}
                  {directManager && (
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={managerImageUrl} alt={directManager.name} />
                        <AvatarFallback className="bg-muted text-sm">
                          {directManager.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={isRTL ? 'text-right' : ''}>
                        <p className="text-sm font-medium text-foreground">{directManager.name}</p>
                        <p className="text-sm text-muted-foreground">{directManager.job || t('profile.manager')}</p>
                      </div>
                    </div>
                  )}
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userImageUrl} alt={user.name} />
                      <AvatarFallback className="bg-muted text-sm">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description Section */}
            <div>
              <h3 className={`text-base font-semibold text-secondary mb-3 ${isRTL ? 'text-right' : ''}`}>{t('profile.jobDescription')}</h3>
              <div className="bg-card p-4 rounded-lg border border-secondary/20">
                {employeeData?.job_description ? (
                  <div 
                    className={`text-sm text-foreground leading-relaxed prose prose-sm max-w-none ${isRTL ? 'text-right' : ''}`}
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(employeeData.job_description, {
                        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'span', 'div'],
                        ALLOWED_ATTR: ['class']
                      })
                    }}
                  />
                ) : (
                  <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>{t('profile.noJobDescription')}</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="private-info" className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 mt-0">
            {/* Private Contact */}
            <div>
              <h3 className={`text-base font-semibold text-primary mb-3 ${isRTL ? 'text-right' : ''}`}>{t('profile.privateContact')}</h3>
              <div className="bg-card p-4 rounded-lg border border-primary/20 space-y-4">
                <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0 mt-1" />
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="text-sm font-semibold text-primary">{t('profile.privateAddress')}</p>
                      <p className="text-sm text-muted-foreground">
                        {employeeData?.private_street || "---"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditPrivateContactOpen(true)}
                    className={`text-primary hover:text-primary/80 ${isRTL ? 'mr-2' : 'ml-2'}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.email')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.private_email || "---"}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.phone')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.private_phone || "---"}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.bankAccountNumber')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.bank_account_id || "---"}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.language')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.lang || "---"}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.homeWorkDistance')}</p>
                    <p className="text-sm text-muted-foreground">---</p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.privateCarPlate')}</p>
                    <p className="text-sm text-muted-foreground">---</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Family Status */}
            <div>
              <h3 className={`text-base font-semibold text-secondary mb-3 ${isRTL ? 'text-right' : ''}`}>{t('profile.familyStatus')}</h3>
              <div className="bg-card p-4 rounded-lg border border-secondary/20 space-y-4">
                <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0 mt-1" />
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="text-sm font-semibold text-primary">{t('profile.maritalStatus')}</p>
                      <p className="text-sm text-muted-foreground">
                        {employeeData?.marital 
                          ? employeeData.marital.charAt(0).toUpperCase() + employeeData.marital.slice(1)
                          : "---"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditFamilyStatusOpen(true)}
                    className={`text-secondary hover:text-secondary/80 ${isRTL ? 'mr-2' : 'ml-2'}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.numberOfChildren')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.children ?? "---"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency */}
            <div>
              <h3 className={`text-base font-semibold text-primary mb-3 ${isRTL ? 'text-right' : ''}`}>{t('profile.emergency')}</h3>
              <div className="bg-card p-4 rounded-lg border border-primary/20 space-y-4">
                <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0 mt-1" />
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="text-sm font-semibold text-primary">{t('profile.contactName')}</p>
                      <p className="text-sm text-muted-foreground">---</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditEmergencyOpen(true)}
                    className={`text-primary hover:text-primary/80 ${isRTL ? 'mr-2' : 'ml-2'}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.contactPhone')}</p>
                    <p className="text-sm text-muted-foreground">---</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className={`text-base font-semibold text-secondary mb-3 ${isRTL ? 'text-right' : ''}`}>{t('profile.education')}</h3>
              <div className="bg-card p-4 rounded-lg border border-secondary/20 space-y-4">
                <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0 mt-1" />
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="text-sm font-semibold text-primary">{t('profile.certificateLevel')}</p>
                      <p className="text-sm text-muted-foreground">
                        {employeeData?.certificate 
                          ? employeeData.certificate.charAt(0).toUpperCase() + employeeData.certificate.slice(1)
                          : "---"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditEducationOpen(true)}
                    className={`text-secondary hover:text-secondary/80 ${isRTL ? 'mr-2' : 'ml-2'}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.fieldOfStudy')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.study_field || "---"}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-sm font-semibold text-primary">{t('profile.school')}</p>
                    <p className="text-sm text-muted-foreground">
                      {employeeData?.study_school || "---"}
                    </p>
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
              <p className={`text-base font-semibold text-foreground ${isRTL ? 'text-right' : ''}`}>
                {t('profile.getLevelUp')} <span className="text-primary">{karmaValue}</span> {t('profile.xpToLevelUp')}
              </p>
            </div>

            {/* Badges Section */}
            <div>
              <h3 className={`text-lg font-semibold text-foreground mb-4 ${isRTL ? 'text-right' : ''}`}>{t('profile.badges')}</h3>
              <div className="space-y-3">
                {badges.length === 0 ? (
                  <p className={`text-center text-muted-foreground py-8 ${isRTL ? 'text-right' : ''}`}>{t('profile.noBadges')}</p>
                ) : (
                  badges.map((badge) => (
                    <div 
                      key={badge.id}
                     className={`bg-card p-4 rounded-lg border border-border flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <BadgeImage
                          imageUrl={getSecureImageUrl(badge.image_url) || ""}
                          alt={badge.name}
                          className="w-12 h-12"
                        />
                        <div className={isRTL ? 'text-right' : ''}>
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
        employeeId={employeeId}
        onSuccess={fetchEmployeeDetails}
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
          email: employeeData?.private_email || "",
          phone: employeeData?.private_phone || "",
        }}
      />

      {/* Edit Family Status Modal */}
      <EditFamilyStatusModal
        open={isEditFamilyStatusOpen}
        onOpenChange={setIsEditFamilyStatusOpen}
        defaultValues={{
          maritalStatus: employeeData?.marital || "",
          numberOfChildren: employeeData?.children?.toString() || "0",
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
          certificateLevel: employeeData?.certificate || "",
          fieldOfStudy: employeeData?.study_field || "",
          school: employeeData?.study_school || "",
        }}
      />
    </div>
  );
};

export default Profile;
