import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { authStorage } from "@/lib/auth";
import { toast } from "sonner";

interface Stage {
  id: number;
  name: string;
}

interface Assignee {
  id: number;
  name: string;
  image_url: string;
}

interface TimesheetEntry {
  id: number;
  name: string;
  date: string;
  unit_amount: number;
  employee_id: [number, string];
}

interface TaskData {
  deadline: string;
  allocatedHours: string;
  repeatEvery: string;
  description: string;
}

const TaskSettings = () => {
  const navigate = useNavigate();
  const { projectId, projectName, taskId, taskName } = useParams();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stages, setStages] = useState<Stage[]>([]);
  const [currentStageId, setCurrentStageId] = useState<number | null>(null);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState<TaskData>({
    deadline: "---",
    allocatedHours: "---",
    repeatEvery: "---",
    description: "---",
  });
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([]);

  // Fetch task data from API
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const apiKey = authStorage.getApiKey();
        const response = await fetch(`https://bsnswheel.org/api/v1/tasks/custom/${projectId}?task_id=${taskId}`, {
          method: "PUT",
          headers: {
            "x-api-key": apiKey || "",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Set stages
          const stagesData = (data.stages || []).map((s: [number, string]) => ({
            id: s[0],
            name: s[1],
          }));
          setStages(stagesData);
          
          // Find current task's data
          const task = data.tasks?.find((t: { id: number }) => t.id === Number(taskId));
          if (task) {
            setCurrentStageId(task.stage_id?.[0] || null);
            setAssignees(task.user_ids || []);
            
            // Set task details
            setTaskData({
              deadline: task.date_deadline || "---",
              allocatedHours: task.allocated_hours ? `${task.allocated_hours}` : "---",
              repeatEvery: task.repeat_interval ? `${task.repeat_interval} ${task.repeat_unit || ""}`.trim() : "---",
              description: task.description || "---",
            });
            
            // Set timesheet entries
            setTimesheetEntries(task.timesheet_ids || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch task data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [projectId, taskId]);

  const handleDeleteTask = () => {
    // TODO: Implement API call to delete task
    console.log("Deleting task:", taskId);
    setShowDeleteDialog(false);
    navigate(`/projects/${projectId}/${projectName}`);
  };

  const handleDeleteTimesheet = (id: number) => {
    // TODO: Implement API call to delete timesheet entry
    console.log("Deleting timesheet entry:", id);
    toast.success(t("taskSettings.timesheetDeleted"));
  };

  const decodedProjectName = projectName ? decodeURIComponent(projectName) : "";
  const decodedTaskName = taskName ? decodeURIComponent(taskName) : "";

  // Get current stage name
  const currentStageName = stages.find(s => s.id === currentStageId)?.name || "";

  return (
    <div className="min-h-screen bg-background pb-6 max-w-screen-xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => navigate(`/projects/${projectId}/${encodeURIComponent(decodedProjectName)}`)}
          >
            <ArrowLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
          </Button>
          <h1 className="text-xl font-semibold truncate max-w-[70vw] sm:max-w-[400px]">
            {decodedTaskName}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Task Stage Slider */}
        <div>
          <h2 className={`text-lg font-medium text-foreground mb-3 ${isRTL ? "text-right" : ""}`}>
            {t("taskSettings.taskStage")}
          </h2>
          {loading ? (
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

        {/* Assignees Section */}
        <div>
          <div className={`flex items-center justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <h2 className={`text-lg font-medium text-foreground ${isRTL ? "text-right" : ""}`}>
              {t("taskSettings.assignees")}
            </h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          <Card className="p-4">
            {assignees.length === 0 ? (
              <p className={`text-sm text-muted-foreground ${isRTL ? "text-right" : ""}`}>
                {t("taskSettings.noAssignees")}
              </p>
            ) : (
              <div className={`flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                {assignees.map((assignee) => (
                  <Badge key={assignee.id} variant="secondary" className="px-3 py-1.5 text-sm">
                    {assignee.name}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Status Section */}
        <div>
          <div className={`flex items-center justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <h2 className={`text-lg font-medium text-foreground ${isRTL ? "text-right" : ""}`}>
              {t("taskSettings.assigneeStatus")}
            </h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          <Card className="p-4">
            <div className="space-y-4">
              {/* Deadline */}
              <div className={`flex flex-col gap-1 pb-4 border-b border-border ${isRTL ? "text-right" : ""}`}>
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-foreground">{t("taskSettings.deadline")}</span>
                </div>
                <p className={`text-sm text-muted-foreground ${isRTL ? "mr-4" : "ml-4"}`}>{taskData.deadline || "---"}</p>
              </div>

              {/* Allocated Hours */}
              <div className={`flex flex-col gap-1 pb-4 border-b border-border ${isRTL ? "text-right" : ""}`}>
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-foreground">{t("taskSettings.allocatedHours")}</span>
                </div>
                <p className={`text-sm text-muted-foreground ${isRTL ? "mr-4" : "ml-4"}`}>{taskData.allocatedHours || "---"}</p>
              </div>

              {/* Repeat Every */}
              <div className={`flex flex-col gap-1 pb-4 border-b border-border ${isRTL ? "text-right" : ""}`}>
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-foreground">{t("taskSettings.repeatEvery")}</span>
                </div>
                <p className={`text-sm text-muted-foreground ${isRTL ? "mr-4" : "ml-4"}`}>{taskData.repeatEvery}</p>
              </div>

              {/* Description */}
              <div className={`flex flex-col gap-1 ${isRTL ? "text-right" : ""}`}>
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-foreground">{t("taskSettings.description")}</span>
                </div>
                <p className={`text-sm text-muted-foreground ${isRTL ? "mr-4" : "ml-4"}`}>{taskData.description}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Time Sheet Section */}
        <div>
          <div className={`flex items-center justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <h2 className={`text-lg font-medium text-foreground ${isRTL ? "text-right" : ""}`}>
              {t("taskSettings.timeSheet")}
            </h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          <Card className="p-4">
            <div className="space-y-4">
              {timesheetEntries.length === 0 ? (
                <p className={`text-sm text-muted-foreground text-center py-4 ${isRTL ? "text-right" : ""}`}>
                  {t("taskSettings.noTimesheet")}
                </p>
              ) : (
                timesheetEntries.map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className={`flex items-start justify-between ${index !== timesheetEntries.length - 1 ? "pb-4 border-b border-border" : ""} ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`flex flex-col gap-1 ${isRTL ? "text-right" : ""}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm font-semibold text-foreground">{entry.name}</span>
                      </div>
                      <p className={`text-sm text-muted-foreground ${isRTL ? "mr-4" : "ml-4"}`}>
                        {entry.date} - {entry.unit_amount}hr
                      </p>
                      <p className={`text-sm text-muted-foreground ${isRTL ? "mr-4" : "ml-4"}`}>
                        {entry.employee_id?.[1] || "---"}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteTimesheet(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

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
