import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Star, Calendar, Clock, Users, Tag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ProjectSettings = () => {
  const navigate = useNavigate();
  const { projectId, projectName } = useParams();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const [activeTab, setActiveTab] = useState("description");

  // Placeholder data - will be populated from API later
  const [projectData] = useState({
    name: decodeURIComponent(projectName || ""),
    taskName: "Tasks",
    customer: "",
    tags: [],
    type: "other",
    projectManager: "",
    plannedDateStart: "",
    plannedDateEnd: "",
    allocatedHours: "00:00",
    description: "",
  });

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
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <h1 className="text-xl font-semibold truncate max-w-[250px]">
              {decodeURIComponent(projectName || t("projectSettings.title"))}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Project Info Grid */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label className="text-muted-foreground min-w-[120px]">
                  {t("projectSettings.nameOfTasks")}
                </Label>
                <Input
                  value={projectData.taskName}
                  readOnly
                  className="bg-muted/50"
                />
              </div>

              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label className="text-muted-foreground min-w-[120px]">
                  {t("projectSettings.customer")}
                </Label>
                <Input
                  value={projectData.customer}
                  readOnly
                  placeholder={t("projectSettings.customerPlaceholder")}
                  className="bg-muted/50"
                />
              </div>

              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label className="text-muted-foreground min-w-[120px]">
                  <Tag className="h-4 w-4 inline mr-1" />
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
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label className="text-muted-foreground min-w-[120px]">
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

              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label className="text-muted-foreground min-w-[120px]">
                  <Users className="h-4 w-4 inline mr-1" />
                  {t("projectSettings.projectManager")}
                </Label>
                <Input
                  value={projectData.projectManager}
                  readOnly
                  placeholder={t("projectSettings.projectManagerPlaceholder")}
                  className="bg-muted/50"
                />
              </div>

              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label className="text-muted-foreground min-w-[120px]">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  {t("projectSettings.plannedDate")}
                </Label>
                <div className={`flex items-center gap-2 flex-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Input
                    type="date"
                    value={projectData.plannedDateStart}
                    readOnly
                    className="bg-muted/50 flex-1"
                  />
                  <span className="text-muted-foreground">→</span>
                  <Input
                    type="date"
                    value={projectData.plannedDateEnd}
                    readOnly
                    className="bg-muted/50 flex-1"
                  />
                </div>
              </div>

              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label className="text-muted-foreground min-w-[120px]">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {t("projectSettings.allocatedHours")}
                </Label>
                <Input
                  value={projectData.allocatedHours}
                  readOnly
                  className="bg-muted/50 w-24"
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
      </main>
    </div>
  );
};

export default ProjectSettings;
