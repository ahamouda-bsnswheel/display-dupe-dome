import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Calendar, Clock, Users, Tag, Trash2, ListTodo, Save, Pencil, Layers } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { authStorage } from "@/lib/auth";
import { toast } from "sonner";

interface Stage {
  id: number;
  name: string;
}

const TaskSettings = () => {
  const navigate = useNavigate();
  const { projectId, projectName, taskId, taskName } = useParams();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const [activeTab, setActiveTab] = useState("description");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stages, setStages] = useState<Stage[]>([]);
  const [currentStageId, setCurrentStageId] = useState<number | null>(null);
  const [loadingStages, setLoadingStages] = useState(true);

  // Get logged-in user name
  const employeeData = authStorage.getEmployeeData();
  const assigneeName = employeeData?.name || "";

  // Fetch stages from API
  useEffect(() => {
    const fetchStages = async () => {
      try {
        const apiKey = authStorage.getApiKey();
        const response = await fetch(`https://bsnswheel.org/api/v1/tasks/custom/${projectId}`, {
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
          
          // Find current task's stage
          const task = data.tasks?.find((t: { id: number }) => t.id === Number(taskId));
          if (task) {
            setCurrentStageId(task.stage_id[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch stages:", error);
      } finally {
        setLoadingStages(false);
      }
    };

    fetchStages();
  }, [projectId, taskId]);

  // Placeholder data - will be populated from API later
  const [taskData, setTaskData] = useState({
    name: decodeURIComponent(taskName || ""),
    assignees: assigneeName,
    tags: [],
    deadline: "",
    plannedHours: "00:00",
    description: "",
  });

  const handleDeleteTask = () => {
    // TODO: Implement API call to delete task
    console.log("Deleting task:", taskId);
    setShowDeleteDialog(false);
    navigate(`/projects/${projectId}/${projectName}`);
  };

  const handleSaveTask = () => {
    // TODO: Implement API call to save task
    console.log("Saving task:", taskData);
    toast.success(t("taskSettings.saveSuccess"));
  };

  const decodedProjectName = projectName ? decodeURIComponent(projectName) : "";
  const decodedTaskName = taskName ? decodeURIComponent(taskName) : "";

  return (
    <div className="min-h-screen bg-background pb-6 max-w-screen-xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/projects/${projectId}/${encodeURIComponent(decodedProjectName)}`)}
            >
              <ArrowLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
            </Button>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <ListTodo className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold truncate max-w-[200px]">
                {t("taskSettings.title")}
              </h1>
            </div>
          </div>
          <Button 
            onClick={handleSaveTask}
            className={`gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Save className="h-4 w-4" />
            {t("taskSettings.save")}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Task Name Edit - Prominent Section */}
        <Card className="p-5 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <div className={`flex flex-col gap-3 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="bg-primary/10 rounded-lg p-2">
                <Pencil className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label className="text-base font-semibold text-foreground">
                  {t("taskSettings.taskName")}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t("taskSettings.taskNameHint")}
                </p>
              </div>
            </div>
            <Input
              value={taskData.name}
              onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
              placeholder={t("taskSettings.taskNamePlaceholder")}
              className="text-lg font-medium h-12 border-primary/30 focus:border-primary"
            />
          </div>
        </Card>

        {/* Task Stage Slider */}
        <Card className="p-5">
          <div className={`flex flex-col gap-4 ${isRTL ? "text-right" : ""}`}>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="bg-secondary/10 rounded-lg p-2">
                <Layers className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <Label className="text-base font-semibold text-foreground">
                  {t("taskSettings.taskStage")}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t("taskSettings.taskStageHint")}
                </p>
              </div>
            </div>

            {loadingStages ? (
              <div className="h-12 bg-muted/50 rounded-xl animate-pulse" />
            ) : (
              <ScrollArea className="w-full">
                <div className={`flex gap-2 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  {stages.map((stage) => {
                    const isActive = stage.id === currentStageId;
                    
                    return (
                      <button
                        key={stage.id}
                        onClick={() => setCurrentStageId(stage.id)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105" 
                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {stage.name}
                      </button>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </div>
        </Card>

        {/* Task Info Grid */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className={`flex flex-col gap-2 ${isRTL ? "text-right" : ""}`}>
                <Label className={`text-muted-foreground text-sm flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Users className="h-4 w-4" />
                  {t("taskSettings.assignees")}
                </Label>
                <Input
                  value={taskData.assignees}
                  readOnly
                  placeholder={t("taskSettings.assigneesPlaceholder")}
                  className="bg-muted/50"
                />
              </div>

              <div className={`flex flex-col gap-2 ${isRTL ? "text-right" : ""}`}>
                <Label className={`text-muted-foreground text-sm flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Tag className="h-4 w-4" />
                  {t("taskSettings.tags")}
                </Label>
                <Input
                  value=""
                  readOnly
                  placeholder={t("taskSettings.tagsPlaceholder")}
                  className="bg-muted/50"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className={`flex flex-col gap-2 ${isRTL ? "text-right" : ""}`}>
                <Label className={`text-muted-foreground text-sm flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Calendar className="h-4 w-4" />
                  {t("taskSettings.deadline")}
                </Label>
                <Input
                  type="date"
                  value={taskData.deadline}
                  readOnly
                  className="bg-muted/50"
                />
              </div>

              <div className={`flex flex-col gap-2 ${isRTL ? "text-right" : ""}`}>
                <Label className={`text-muted-foreground text-sm flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Clock className="h-4 w-4" />
                  {t("taskSettings.plannedHours")}
                </Label>
                <Input
                  value={taskData.plannedHours}
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
              {t("taskSettings.description")}
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t("taskSettings.activity")}
            </TabsTrigger>
            <TabsTrigger value="timesheet" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t("taskSettings.timesheet")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <Card className="p-4">
              <Textarea
                placeholder={t("taskSettings.descriptionPlaceholder")}
                value={taskData.description}
                readOnly
                className="min-h-[200px] bg-muted/50"
              />
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                {t("taskSettings.activityPlaceholder")}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="timesheet" className="mt-4">
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                {t("taskSettings.timesheetPlaceholder")}
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Task Section */}
        <Card className="p-4 border-destructive/30">
          <div className={`flex flex-col gap-3 ${isRTL ? "text-right" : ""}`}>
            <h3 className="font-semibold text-destructive">{t("taskSettings.dangerZone")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("taskSettings.deleteWarning")}
            </p>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className={`w-full gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Trash2 className="h-4 w-4" />
                  {t("taskSettings.deleteTask")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("taskSettings.deleteConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("taskSettings.deleteConfirmMessage")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive hover:bg-destructive/90">
                    {t("taskSettings.deleteTask")}
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

export default TaskSettings;
