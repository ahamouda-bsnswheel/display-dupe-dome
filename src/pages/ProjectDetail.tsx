import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, ListTodo, Plus, Settings2, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { authStorage, getSecureImageUrl } from "@/lib/auth";
import { format } from "date-fns";
import { useAuthImage } from "@/hooks/use-auth-image";
import NewTaskModal from "@/components/NewTaskModal";
import { toast } from "@/hooks/use-toast";

interface TaskUser {
  id: number;
  name: string;
  image_url: string;
}

interface Task {
  id: number;
  name: string;
  tag_ids: [number, string][];
  create_date: string;
  project_id: [number, string];
  stage_id: [number, string];
  user_ids: TaskUser[];
}

interface TasksResponse {
  tasks: Task[];
  stages: [number, string][];
}

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { projectId, projectName } = useParams();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stages, setStages] = useState<[number, string][]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [stageSettingsOpen, setStageSettingsOpen] = useState(false);
  const [stageNameInput, setStageNameInput] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [newStageDrawerOpen, setNewStageDrawerOpen] = useState(false);
  const [newStageName, setNewStageName] = useState("");

  // Check if user is manager
  const authData = authStorage.getAuthData();
  const isManager = authData?.is_manager ?? false;

  // Get current active stage
  const currentStage = stages.find(s => s[0].toString() === activeTab);

  // Update stage name input when drawer opens or active tab changes
  useEffect(() => {
    if (stageSettingsOpen && currentStage) {
      setStageNameInput(currentStage[1]);
    }
  }, [stageSettingsOpen, currentStage]);

  // Reset new stage name when drawer closes
  useEffect(() => {
    if (!newStageDrawerOpen) {
      setNewStageName("");
    }
  }, [newStageDrawerOpen]);

  const handleRenameStage = () => {
    if (!currentStage || !stageNameInput.trim()) return;
    // TODO: Connect to API
    toast({
      title: t("tasks.stageRenamed"),
      description: stageNameInput,
    });
    setStageSettingsOpen(false);
  };

  const handleDeleteStage = () => {
    if (!currentStage) return;
    // TODO: Connect to API
    toast({
      title: t("tasks.stageDeleted"),
      description: currentStage[1],
      variant: "destructive",
    });
    setDeleteConfirmOpen(false);
    setStageSettingsOpen(false);
    setActiveTab("all");
  };

  const handleAddStage = () => {
    if (!newStageName.trim()) return;
    // TODO: Connect to API
    toast({
      title: t("tasks.stageCreated"),
      description: newStageName,
    });
    setNewStageDrawerOpen(false);
    setNewStageName("");
  };

  const handleCreateTask = (taskName: string) => {
    // TODO: Connect to API endpoint to create task
    toast({
      title: t("tasks.taskCreated"),
      description: taskName,
    });
    console.log("Creating task:", taskName);
  };

  useEffect(() => {
    const fetchTasks = async () => {
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
          const data: TasksResponse = await response.json();
          setTasks(data.tasks || []);
          setStages(data.stages || []);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  const getTasksByStage = (stageId: number | "all") => {
    if (stageId === "all") return tasks;
    return tasks.filter((task) => task.stage_id[0] === stageId);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "yyyy-MM-dd HH:mm:ss");
    } catch {
      return dateStr;
    }
  };

  const decodedProjectName = projectName ? decodeURIComponent(projectName) : t("projectDetail.title");

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 max-w-screen-xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
        <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
        </header>
        <main className="px-4 py-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 max-w-screen-xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 min-w-0 flex-1 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => navigate("/projects")}
            >
              <ArrowLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
            </Button>
            <h1 className="text-xl font-semibold truncate max-w-[60vw] sm:max-w-[300px]">{decodedProjectName}</h1>
          </div>
          <Button 
            size="sm" 
            className={`gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
            onClick={() => setNewTaskModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            {t("tasks.newTask")}
          </Button>
        </div>
      </header>

      {/* New Task Modal */}
      <NewTaskModal
        open={newTaskModalOpen}
        onOpenChange={setNewTaskModalOpen}
        onCreateTask={handleCreateTask}
      />

      {/* Main Content */}
      <main className="px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Scrollable Tabs with Stage Actions */}
          <div className={`flex items-center gap-2 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            <ScrollArea className="flex-1 whitespace-nowrap">
              <TabsList className={`inline-flex h-auto p-1 bg-muted/50 ${isRTL ? "flex-row-reverse" : ""}`}>
                <TabsTrigger
                  value="all"
                  className="px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                >
                  {t("projectDetail.all")} ({tasks.length})
                </TabsTrigger>
                {stages.map((stage) => {
                  const count = getTasksByStage(stage[0]).length;
                  return (
                    <TabsTrigger
                      key={stage[0]}
                      value={stage[0].toString()}
                      className="px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
                    >
                      {stage[1]} ({count})
                    </TabsTrigger>
                  );
                })}
                {/* Add Stage Button */}
                <button
                  type="button"
                  onClick={() => setNewStageDrawerOpen(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border-2 border-dashed border-primary/40 text-primary hover:border-primary hover:bg-primary/10 transition-colors ${isRTL ? "mr-1" : "ml-1"}`}
                >
                  + {t("tasks.stage")}
                </button>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* New Stage Drawer */}
            <Drawer open={newStageDrawerOpen} onOpenChange={setNewStageDrawerOpen}>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader className={isRTL ? "text-right" : ""}>
                    <DrawerTitle>{t("tasks.addNewStage")}</DrawerTitle>
                    <DrawerDescription>
                      {t("tasks.addNewStageDescription")}
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="newTaskStageName" className={isRTL ? "block text-right" : ""}>
                        {t("tasks.stageName")}
                      </Label>
                      <Input
                        id="newTaskStageName"
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        placeholder={t("tasks.stageNamePlaceholder")}
                        className={isRTL ? "text-right" : ""}
                      />
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button 
                      onClick={handleAddStage}
                      disabled={!newStageName.trim()}
                      className={`gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <Plus className="h-4 w-4" />
                      {t("tasks.addStage")}
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="outline">{t("common.cancel")}</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>

            {/* Stage Settings Button - Only show when a specific stage is selected */}
            {activeTab !== "all" && (
              <Drawer open={stageSettingsOpen} onOpenChange={setStageSettingsOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className={isRTL ? "text-right" : ""}>
                      <DrawerTitle>{t("tasks.stageSettings")}</DrawerTitle>
                      <DrawerDescription>
                        {t("tasks.stageSettingsDescription")}
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 space-y-6">
                      {/* Rename Section */}
                      <div className="space-y-3">
                        <Label htmlFor="taskStageName" className={isRTL ? "block text-right" : ""}>
                          {t("tasks.stageName")}
                        </Label>
                        <Input
                          id="taskStageName"
                          value={stageNameInput}
                          onChange={(e) => setStageNameInput(e.target.value)}
                          placeholder={t("tasks.stageNamePlaceholder")}
                          className={isRTL ? "text-right" : ""}
                        />
                        <Button 
                          onClick={handleRenameStage}
                          disabled={!stageNameInput.trim() || stageNameInput === currentStage?.[1]}
                          className="w-full"
                        >
                          {t("tasks.saveChanges")}
                        </Button>
                      </div>

                      <Separator />

                      {/* Delete Section */}
                      <div className="space-y-3">
                        <div className={isRTL ? "text-right" : ""}>
                          <p className="text-sm font-medium text-destructive">{t("tasks.dangerZone")}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t("tasks.deleteStageWarning")}
                          </p>
                        </div>
                        <Button 
                          variant="destructive" 
                          className={`w-full gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          onClick={() => setDeleteConfirmOpen(true)}
                        >
                          <Trash2 className="h-4 w-4" />
                          {t("tasks.deleteStage")}
                        </Button>
                      </div>
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">{t("common.cancel")}</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            )}
          </div>

          {/* Delete Stage Confirmation Dialog */}
          <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("tasks.deleteStageConfirmTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("tasks.deleteStageConfirmMessage")} "{currentStage?.[1]}"
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteStage}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t("tasks.deleteStage")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* All Tasks Tab */}
          <TabsContent value="all" className="mt-0 space-y-0">
            {tasks.length === 0 ? (
              <Card className="p-8 text-center">
                <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">{t("projectDetail.noTasks")}</p>
              </Card>
            ) : (
              <div className="divide-y divide-border">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isRTL={isRTL}
                    formatDate={formatDate}
                    projectId={projectId || ""}
                    projectName={decodedProjectName}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Stage-specific Tabs */}
          {stages.map((stage) => (
            <TabsContent key={stage[0]} value={stage[0].toString()} className="mt-0 space-y-0">
              {getTasksByStage(stage[0]).length === 0 ? (
                <Card className="p-8 text-center">
                  <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">{t("projectDetail.noTasksInStage")}</p>
                </Card>
              ) : (
                <div className="divide-y divide-border">
                  {getTasksByStage(stage[0]).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isRTL={isRTL}
                      formatDate={formatDate}
                      projectId={projectId || ""}
                      projectName={decodedProjectName}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  isRTL: boolean;
  formatDate: (date: string) => string;
  projectId: string;
  projectName: string;
}

const TaskCard = ({ task, isRTL, formatDate, projectId, projectName }: TaskCardProps) => {
  const navigate = useNavigate();
  // Get contributor names
  const contributorNames = task.user_ids.map(user => user.name).join(", ");
  const taskProjectName = task.project_id[1];

  const handleClick = () => {
    navigate(`/projects/${projectId}/${encodeURIComponent(projectName)}/task/${task.id}/${encodeURIComponent(task.name)}/settings`);
  };

  return (
    <div 
      className={`py-4 cursor-pointer hover:bg-muted/30 transition-colors ${isRTL ? "text-right" : ""}`}
      onClick={handleClick}
    >
      <div className={`flex items-start justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{task.name}</h3>
          <p className="text-sm text-muted-foreground mb-1">
            {taskProjectName}{contributorNames ? `, ${contributorNames}` : ""}
          </p>
          <p className="text-sm text-muted-foreground">{formatDate(task.create_date)}</p>
          
          {/* Tags */}
          {task.tag_ids && task.tag_ids.length > 0 && (
            <div className={`flex items-center gap-2 flex-wrap mt-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              {task.tag_ids.map((tag) => (
                <Badge
                  key={tag[0]}
                  variant="secondary"
                  className="text-xs bg-secondary/20 text-secondary-foreground"
                >
                  {tag[1]}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {/* User Avatars */}
        {task.user_ids && task.user_ids.length > 0 && (
          <div className={`flex -space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
            {task.user_ids.slice(0, 3).map((user) => (
              <UserAvatar key={user.id} user={user} />
            ))}
            {task.user_ids.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                +{task.user_ids.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface UserAvatarProps {
  user: TaskUser;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  const secureUrl = getSecureImageUrl(user.image_url);
  const { blobUrl } = useAuthImage(secureUrl);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar className="w-8 h-8 border-2 border-background">
      <AvatarImage src={blobUrl || undefined} alt={user.name} />
      <AvatarFallback className="text-xs bg-primary/10 text-primary">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProjectDetail;
