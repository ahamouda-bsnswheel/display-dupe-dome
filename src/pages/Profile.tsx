import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Power, Plus, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authStorage } from "@/lib/auth";
import { CompetencyPuzzle } from "@/components/CompetencyPuzzle";
import { AddWorkExperienceModal } from "@/components/AddWorkExperienceModal";
import { DeleteWorkExperienceDialog } from "@/components/DeleteWorkExperienceDialog";
import { AddSkillModal } from "@/components/AddSkillModal";

interface WorkExperience {
  dates: string;
  title: string;
  companyName?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [isAddWorkExpOpen, setIsAddWorkExpOpen] = useState(false);
  const [isEditWorkExpOpen, setIsEditWorkExpOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkExp, setSelectedWorkExp] = useState<WorkExperience | null>(null);
  const [selectedWorkExpIndex, setSelectedWorkExpIndex] = useState<number | null>(null);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isEditSkillOpen, setIsEditSkillOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const employeeData = authStorage.getEmployeeData();
  
  const user = {
    name: employeeData?.name || "User",
    employeeId: "G-62519723",
    email: employeeData?.email || "user@example.com",
    position: (employeeData as any)?.position || "Employee",
    department: "Human Resource",
    image: employeeData?.image,
  };

  const handleLogout = () => {
    authStorage.clearAuthData();
    navigate("/");
  };

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([
    {
      dates: "01/06/2023 - 01/03/2025",
      title: "Quality control Coordinator",
      companyName: "Quality control Coordinator",
    },
    {
      dates: "01/01/2023 - 01/06/2023",
      title: "Manager Assistant",
      companyName: "---",
    },
  ]);

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

  const skills = [
    {
      name: "Arabic",
      level: "Expert (100%)",
      category: "Languages",
    },
    {
      name: "Communication",
      level: "L1 (26%)",
      category: "Marketing",
    },
    {
      name: "Digital advertising",
      level: "L1 (25%)",
      category: "Marketing",
    },
  ];

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
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="bg-muted text-xl">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-primary mb-1">{user.name}</h2>
            <p className="text-sm text-muted-foreground mb-1">{user.employeeId}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <span>📧</span> {user.email}
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
        <Tabs defaultValue="resume" className="w-full">
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
              <CompetencyPuzzle />
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
                        <button className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="work-info" className="p-4">
            <p className="text-muted-foreground">Work Info content coming soon...</p>
          </TabsContent>

          <TabsContent value="private-info" className="p-4">
            <p className="text-muted-foreground">Private Info content coming soon...</p>
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
    </div>
  );
};

export default Profile;
