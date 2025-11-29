import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Calendar, Clock, Users, Tag, Trash2, FolderKanban, Save, Pencil, Layers, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { authStorage } from "@/lib/auth";
import { toast } from "sonner";

interface Stage {
  id: number;
  name: string;
}

const ProjectSettings = () => {
  const navigate = useNavigate();
  const { projectId, projectName } = useParams();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const [activeTab, setActiveTab] = useState("description");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stages, setStages] = useState<Stage[]>([]);
  const [currentStageId, setCurrentStageId] = useState<number | null>(null);
  const [loadingStages, setLoadingStages] = useState(true);

  // Get logged-in manager name
  const employeeData = authStorage.getEmployeeData();
  const managerName = employeeData?.name || "";

  // Fetch stages from API
  useEffect(() => {
    const fetchStages = async () => {
      try {
        const apiKey = authStorage.getApiKey();
        const response = await fetch("https://bsnswheel.org/api/v1/projects/custom", {
          method: "PUT",
          headers: {
            "x-api-key": apiKey || "",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const stagesData = (data.stages || []).map((s: [number, string]) => ({
            id: s[0],
            name: s[1],
          }));
          setStages(stagesData);
          
          // Find current project's stage
          const project = data.projects?.find((p: { id: number }) => p.id === Number(projectId));
          if (project) {
            setCurrentStageId(project.stage_id[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch stages:", error);
      } finally {
        setLoadingStages(false);
      }
    };

    fetchStages();
  }, [projectId]);

  // Placeholder data - will be populated from API later
  const [projectData, setProjectData] = useState({
    name: decodeURIComponent(projectName || ""),
    taskName: "Tasks",
    customer: "",
    tags: [],
    type: "other",
    projectManager: managerName,
    plannedDateStart: "",
    plannedDateEnd: "",
    allocatedHours: "00:00",
    description: "",
  });

  const handleDeleteProject = () => {
    // TODO: Implement API call to delete project
    console.log("Deleting project:", projectId);
    setShowDeleteDialog(false);
    navigate("/projects");
  };

  const handleSaveProject = () => {
    // TODO: Implement API call to save project
    console.log("Saving project:", projectData);
    toast.success(t("projectSettings.saveSuccess"));
  };

  return (
    <div className="min-h-screen bg-background pb-6 max-w-screen-xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/projects")}
            >
              <ArrowLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
            </Button>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <FolderKanban className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold truncate max-w-[200px]">
                {t("projectSettings.title")}
              </h1>
            </div>
          </div>
          <Button 
            onClick={handleSaveProject}
            className={`gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Save className="h-4 w-4" />
            {t("projectSettings.save")}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Project Name Edit - Prominent Section */}
        <Card className="p-5 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <div className={`flex flex-col gap-3 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="bg-primary/10 rounded-lg p-2">
                <Pencil className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label className="text-base font-semibold text-foreground">
                  {t("projectSettings.projectName")}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t("projectSettings.projectNameHint")}
                </p>
              </div>
            </div>
            <Input
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              placeholder={t("projectSettings.projectNamePlaceholder")}
              className="text-lg font-medium h-12 border-primary/30 focus:border-primary"
            />
          </div>
        </Card>

        {/* Project Stage Slider */}
        <Card className="p-5">
          <div className={`flex flex-col gap-4 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="bg-secondary/10 rounded-lg p-2">
                <Layers className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <Label className="text-base font-semibold text-foreground">
                  {t("projectSettings.projectStage")}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t("projectSettings.projectStageHint")}
                </p>
              </div>
            </div>

            {loadingStages ? (
              <div className="h-20 bg-muted/50 rounded-xl animate-pulse" />
            ) : (
              <div className="relative">
                {/* Stage Track */}
                <div className="relative pt-8 pb-4">
                  {/* Progress Line Background */}
                  <div className="absolute top-[52px] left-0 right-0 h-1 bg-muted rounded-full" />
                  
                  {/* Progress Line Active */}
                  {currentStageId && stages.length > 0 && (
                    <div 
                      className="absolute top-[52px] left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500"
                      style={{ 
                        width: `${((stages.findIndex(s => s.id === currentStageId) + 1) / stages.length) * 100}%` 
                      }}
                    />
                  )}

                  {/* Stage Points */}
                  <div className={`flex justify-between relative ${isRTL ? "flex-row-reverse" : ""}`}>
                    {stages.map((stage, index) => {
                      const isActive = stage.id === currentStageId;
                      const isPast = currentStageId ? stages.findIndex(s => s.id === currentStageId) >= index : false;
                      
                      return (
                        <button
                          key={stage.id}
                          onClick={() => setCurrentStageId(stage.id)}
                          className={`flex flex-col items-center gap-2 group transition-all duration-300 ${
                            isRTL ? "flex-col-reverse" : ""
                          }`}
                        >
                          {/* Stage Label */}
                          <span 
                            className={`text-xs font-medium px-2 py-1 rounded-full transition-all duration-300 max-w-[70px] sm:max-w-none truncate ${
                              isActive 
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                                : isPast 
                                  ? "text-foreground bg-muted"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {stage.name}
                          </span>
                          
                          {/* Stage Dot */}
                          <div 
                            className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isActive 
                                ? "bg-primary shadow-lg shadow-primary/40 scale-110" 
                                : isPast 
                                  ? "bg-secondary/80" 
                                  : "bg-muted border-2 border-border group-hover:border-primary/50"
                            }`}
                          >
                            {isPast && (
                              <Check className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-white"}`} />
                            )}
                            
                            {/* Ripple Effect on Active */}
                            {isActive && (
                              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Project Info Grid */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className={`flex flex-col gap-2 ${isRTL ? "text-right" : ""}`}>
                <Label className="text-muted-foreground text-sm">
                  {t("projectSettings.nameOfTasks")}
                </Label>
                <Input
                  value={projectData.taskName}
                  readOnly
                  className="bg-muted/50"
                />
              </div>

              <div className={`flex flex-col gap-2 ${isRTL ? "text-right" : ""}`}>
                <Label className="text-muted-foreground text-sm">
                  {t("projectSettings.customer")}
                </Label>
                <Input
                  value={projectData.customer}
                  readOnly
                  placeholder={t("projectSettings.customerPlaceholder")}
                  className="bg-muted/50"
                />
              </div>

              <div className={`flex flex-col gap-2 ${isRTL ? "text-right" : ""}`}>
                <Label className={`text-muted-foreground text-sm flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Tag className="h-4 w-4" />
                  {t("projectSettings.tags")}
                </Label>
                <Input
                  value=""
                  readOnly
                  placeholder={t("projectSettings.tagsPlaceholder")}
                  className="bg-muted/50"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className={`flex flex-col gap-2 ${isRTL ? "text-right" : ""}`}>
                <Label className="text-muted-foreground text-sm">
                  {t("projectSettings.type")}
                </Label>
                <RadioGroup
                  value={projectData.type}
                  className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                  disabled
                >
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <RadioGroupItem value="training" id="training" />
                    <Label htmlFor="training" className="text-sm">
                      {t("projectSettings.training")}
                    </Label>
                  </div>
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="text-sm">
                      {t("projectSettings.other")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className={`flex flex-col gap-2 ${isRTL ? "text-right" : ""}`}>
                <Label className={`text-muted-foreground text-sm flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Users className="h-4 w-4" />
                  {t("projectSettings.projectManager")}
                </Label>
                <Input
                  value={projectData.projectManager}
                  readOnly
                  placeholder={t("projectSettings.projectManagerPlaceholder")}
                  className="bg-muted/50"
                />
              </div>

              <div className={`flex flex-col gap-2 ${isRTL ? "text-right" : ""}`}>
                <Label className={`text-muted-foreground text-sm flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Calendar className="h-4 w-4" />
                  {t("projectSettings.plannedDate")}
                </Label>
                <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
                  <Input
                    type="date"
                    value={projectData.plannedDateStart}
                    readOnly
                    className="bg-muted/50 flex-1"
                  />
                  <span className="text-muted-foreground text-center hidden sm:block">→</span>
                  <Input
                    type="date"
                    value={projectData.plannedDateEnd}
                    readOnly
                    className="bg-muted/50 flex-1"
                  />
                </div>
              </div>

              <div className={`flex flex-col gap-2 ${isRTL ? "text-right" : ""}`}>
                <Label className={`text-muted-foreground text-sm flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Clock className="h-4 w-4" />
                  {t("projectSettings.allocatedHours")}
                </Label>
                <Input
                  value={projectData.allocatedHours}
                  readOnly
                  className="bg-muted/50"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`bg-muted/50 ${isRTL ? "flex-row-reverse" : ""}`}>
            <TabsTrigger value="description" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t("projectSettings.description")}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t("projectSettings.settings")}
            </TabsTrigger>
            <TabsTrigger value="budget" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t("projectSettings.budgetInfo")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <Card className="p-4">
              <Textarea
                placeholder={t("projectSettings.descriptionPlaceholder")}
                value={projectData.description}
                readOnly
                className="min-h-[200px] bg-muted/50"
              />
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                {t("projectSettings.settingsPlaceholder")}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="mt-4">
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                {t("projectSettings.budgetPlaceholder")}
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Project Section */}
        <Card className="p-4 border-destructive/30">
          <div className={`flex flex-col gap-3 ${isRTL ? "text-right" : ""}`}>
            <h3 className="font-semibold text-destructive">{t("projectSettings.dangerZone")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("projectSettings.deleteWarning")}
            </p>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className={`w-full gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Trash2 className="h-4 w-4" />
                  {t("projectSettings.deleteProject")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("projectSettings.deleteConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("projectSettings.deleteConfirmMessage")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive hover:bg-destructive/90">
                    {t("projectSettings.deleteProject")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ProjectSettings;
