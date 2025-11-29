import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, ListTodo, Tag, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { authStorage, getSecureImageUrl } from "@/lib/auth";
import { format } from "date-fns";
import { useAuthImage } from "@/hooks/use-auth-image";

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
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
          </Button>
          <h1 className="text-xl font-semibold truncate">{decodedProjectName}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Scrollable Tabs */}
          <ScrollArea className="w-full whitespace-nowrap mb-6">
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
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

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
}

const TaskCard = ({ task, isRTL, formatDate }: TaskCardProps) => {
  // Get contributor names
  const contributorNames = task.user_ids.map(user => user.name).join(", ");
  const projectName = task.project_id[1];

  return (
    <div className={`py-4 ${isRTL ? "text-right" : ""}`}>
      <div className={`flex items-start justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{task.name}</h3>
          <p className="text-sm text-muted-foreground mb-1">
            {projectName}{contributorNames ? `, ${contributorNames}` : ""}
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
