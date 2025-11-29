import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import {
  ArrowLeft,
  Home,
  Grid3x3,
  Bell,
  MoreHorizontal,
  FolderKanban,
  Tag,
  CheckCircle2,
  ListTodo,
  Settings,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { authStorage } from "@/lib/auth";
import { format } from "date-fns";
import NewProjectModal from "@/components/NewProjectModal";
import { toast } from "@/hooks/use-toast";

interface Project {
  id: number;
  name: string;
  create_date: string;
  task_count: number;
  tasks_percentage_progress: string;
  stage_id: [number, string];
  tag_ids: [number, string][];
}

interface ProjectsResponse {
  projects: Project[];
  stages: [number, string][];
}

const Projects = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const [projects, setProjects] = useState<Project[]>([]);
  const [stages, setStages] = useState<[number, string][]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [stageSettingsOpen, setStageSettingsOpen] = useState(false);
  const [stageNameInput, setStageNameInput] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Get current active stage
  const currentStage = stages.find(s => s[0].toString() === activeTab);

  // Update stage name input when drawer opens or active tab changes
  useEffect(() => {
    if (stageSettingsOpen && currentStage) {
      setStageNameInput(currentStage[1]);
    }
  }, [stageSettingsOpen, currentStage]);

  const handleRenameStage = () => {
    if (!currentStage || !stageNameInput.trim()) return;
    // TODO: Connect to API
    toast({
      title: t("projects.stageRenamed"),
      description: stageNameInput,
    });
    setStageSettingsOpen(false);
  };

  const handleDeleteStage = () => {
    if (!currentStage) return;
    // TODO: Connect to API
    toast({
      title: t("projects.stageDeleted"),
      description: currentStage[1],
      variant: "destructive",
    });
    setDeleteConfirmOpen(false);
    setStageSettingsOpen(false);
    setActiveTab("all");
  };

  // Check if user is manager
  const authData = authStorage.getAuthData();
  const isManager = authData?.is_manager ?? false;

  const handleCreateProject = (projectName: string) => {
    // TODO: Connect to API endpoint to create project
    toast({
      title: t("projects.projectCreated"),
      description: projectName,
    });
    console.log("Creating project:", projectName);
  };

  useEffect(() => {
    const fetchProjects = async () => {
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
          const data: ProjectsResponse = await response.json();
          setProjects(data.projects || []);
          setStages(data.stages || []);
          // Set first stage as active tab if available
          if (data.stages && data.stages.length > 0) {
            setActiveTab("all");
          }
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getProjectsByStage = (stageId: number | "all") => {
    if (stageId === "all") return projects;
    return projects.filter((project) => project.stage_id[0] === stageId);
  };

  const parseProgress = (progressStr: string): number => {
    // Parse "8 / 45 (18%)" -> 18
    const match = progressStr.match(/\((\d+)%\)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const parseProgressFraction = (progressStr: string): { completed: number; total: number } => {
    // Parse "8 / 45 (18%)" -> { completed: 8, total: 45 }
    const match = progressStr.match(/(\d+)\s*\/\s*(\d+)/);
    return match ? { completed: parseInt(match[1], 10), total: parseInt(match[2], 10) } : { completed: 0, total: 0 };
  };

  const getStageColor = (stageName: string): string => {
    const lowerName = stageName.toLowerCase();
    if (lowerName.includes("done") || lowerName.includes("approved")) return "bg-success/10 text-success";
    if (lowerName.includes("progress")) return "bg-primary/10 text-primary";
    if (lowerName.includes("todo") || lowerName.includes("to do")) return "bg-accent/20 text-accent-foreground";
    if (lowerName.includes("cancel")) return "bg-destructive/10 text-destructive";
    if (lowerName.includes("approve")) return "bg-secondary/20 text-secondary-foreground";
    return "bg-muted text-muted-foreground";
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

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
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 max-w-screen-xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button variant="ghost" size="icon" onClick={() => navigate("/modules")}>
              <ArrowLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
            </Button>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <FolderKanban className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">{t("projects.title")}</h1>
            </div>
          </div>
          {isManager && (
            <Button 
              size="sm" 
              className={`gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
              onClick={() => setNewProjectModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              {t("projects.newProject")}
            </Button>
          )}
        </div>

        {/* New Project Modal */}
        <NewProjectModal
          open={newProjectModalOpen}
          onOpenChange={setNewProjectModalOpen}
          onCreateProject={handleCreateProject}
        />
      </header>

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
                  {t("projects.all")} ({projects.length})
                </TabsTrigger>
                {stages.map((stage) => {
                  const count = getProjectsByStage(stage[0]).length;
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
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            
            {/* Stage Settings Button - Only show when a specific stage is selected */}
            {activeTab !== "all" && isManager && (
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
                      <DrawerTitle>{t("projects.stageSettings")}</DrawerTitle>
                      <DrawerDescription>
                        {t("projects.stageSettingsDescription")}
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 space-y-6">
                      {/* Rename Section */}
                      <div className="space-y-3">
                        <Label htmlFor="stageName" className={isRTL ? "block text-right" : ""}>
                          {t("projects.stageName")}
                        </Label>
                        <Input
                          id="stageName"
                          value={stageNameInput}
                          onChange={(e) => setStageNameInput(e.target.value)}
                          placeholder={t("projects.stageNamePlaceholder")}
                          className={isRTL ? "text-right" : ""}
                        />
                        <Button 
                          onClick={handleRenameStage}
                          disabled={!stageNameInput.trim() || stageNameInput === currentStage?.[1]}
                          className="w-full"
                        >
                          {t("projects.saveChanges")}
                        </Button>
                      </div>

                      <Separator />

                      {/* Delete Section */}
                      <div className="space-y-3">
                        <div className={isRTL ? "text-right" : ""}>
                          <p className="text-sm font-medium text-destructive">{t("projects.dangerZone")}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t("projects.deleteStageWarning")}
                          </p>
                        </div>
                        <Button 
                          variant="destructive" 
                          className={`w-full gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          onClick={() => setDeleteConfirmOpen(true)}
                        >
                          <Trash2 className="h-4 w-4" />
                          {t("projects.deleteStage")}
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
                <AlertDialogTitle>{t("projects.deleteStageConfirmTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("projects.deleteStageConfirmMessage")} "{currentStage?.[1]}"
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteStage}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t("projects.deleteStage")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* All Projects Tab */}
          <TabsContent value="all" className="mt-0 space-y-4">
            {projects.length === 0 ? (
              <Card className="p-8 text-center">
                <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">{t("projects.noProjects")}</p>
              </Card>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isRTL={isRTL}
                  t={t}
                  parseProgress={parseProgress}
                  parseProgressFraction={parseProgressFraction}
                  getStageColor={getStageColor}
                  formatDate={formatDate}
                  isManager={isManager}
                />
              ))
            )}
          </TabsContent>

          {/* Stage-specific Tabs */}
          {stages.map((stage) => (
            <TabsContent key={stage[0]} value={stage[0].toString()} className="mt-0 space-y-4">
              {getProjectsByStage(stage[0]).length === 0 ? (
                <Card className="p-8 text-center">
                  <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">{t("projects.noProjectsInStage")}</p>
                </Card>
              ) : (
                getProjectsByStage(stage[0]).map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isRTL={isRTL}
                    t={t}
                    parseProgress={parseProgress}
                    parseProgressFraction={parseProgressFraction}
                    getStageColor={getStageColor}
                    formatDate={formatDate}
                    isManager={isManager}
                  />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <Home className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary" onClick={() => navigate("/modules")}>
            <Grid3x3 className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/notifications")}>
            <Bell className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/more")}>
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </div>
      </nav>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  isRTL: boolean;
  t: (key: string) => string;
  parseProgress: (str: string) => number;
  parseProgressFraction: (str: string) => { completed: number; total: number };
  getStageColor: (name: string) => string;
  formatDate: (date: string) => string;
  isManager: boolean;
}

const ProjectCard = ({
  project,
  isRTL,
  t,
  parseProgress,
  parseProgressFraction,
  getStageColor,
  formatDate,
  isManager,
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const progress = parseProgress(project.tasks_percentage_progress);
  const { completed, total } = parseProgressFraction(project.tasks_percentage_progress);

  const handleClick = () => {
    navigate(`/projects/${project.id}/${encodeURIComponent(project.name)}`);
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${project.id}/${encodeURIComponent(project.name)}/settings`);
  };

  return (
    <Card className="p-4 hover-lift transition-all duration-200 cursor-pointer" onClick={handleClick}>
      <div className={`flex flex-col gap-3 ${isRTL ? "text-right" : ""}`}>
        {/* Project Header */}
        <div className={`flex items-start justify-between gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="bg-primary/10 rounded-xl p-2.5">
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{project.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("projects.created")}: {formatDate(project.create_date)}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`${getStageColor(project.stage_id[1])} border-0 shrink-0`}>
            {project.stage_id[1]}
          </Badge>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className={`flex items-center justify-between text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className={`flex items-center gap-1.5 text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}>
              <ListTodo className="h-4 w-4" />
              {t("projects.tasks")}
            </span>
            <span className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="font-medium">{completed}</span>
              <span className="text-muted-foreground">/ {total}</span>
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className={`text-xs text-muted-foreground ${isRTL ? "text-left" : "text-right"}`}>
            {progress}% {t("projects.complete")}
          </p>
        </div>

        {/* Tags */}
        {project.tag_ids && project.tag_ids.length > 0 && (
          <div className={`flex items-center gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            {project.tag_ids.map((tag) => (
              <Badge
                key={tag[0]}
                variant="secondary"
                className="text-xs bg-secondary/20 text-secondary-foreground hover:bg-secondary/30"
              >
                {tag[1]}
              </Badge>
            ))}
          </div>
        )}

        {/* Settings Button - Manager Only */}
        {isManager && (
          <Button
            variant="outline"
            size="sm"
            className={`w-full mt-2 gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
            onClick={handleSettingsClick}
          >
            <Settings className="h-4 w-4" />
            {t("projects.settings")}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Projects;
