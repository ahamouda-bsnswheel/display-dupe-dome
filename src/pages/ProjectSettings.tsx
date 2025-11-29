import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Calendar, Clock, Users, Tag, Trash2, FolderKanban } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { authStorage } from "@/lib/auth";

const ProjectSettings = () => {
  const navigate = useNavigate();
  const { projectId, projectName } = useParams();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const [activeTab, setActiveTab] = useState("description");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get logged-in manager name
  const employeeData = authStorage.getEmployeeData();
  const managerName = employeeData?.name || "";

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

  return (
    <div className="min-h-screen bg-background pb-6 max-w-screen-xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
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
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <FolderKanban className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold truncate max-w-[250px]">
              {t("projectSettings.title")}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Project Name Edit */}
        <Card className="p-4">
          <div className={`flex flex-col gap-2 ${isRTL ? "text-right" : ""}`}>
            <Label className="text-muted-foreground">
              {t("projectSettings.projectName")}
            </Label>
            <Input
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              placeholder={t("projectSettings.projectNamePlaceholder")}
            />
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
