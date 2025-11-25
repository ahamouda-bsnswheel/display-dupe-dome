import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { authStorage } from "@/lib/auth";

interface ProficiencyLevel {
  id: number;
  title: string;
  description: string;
  behaviorIndicators: string[];
  isCurrentLevel: boolean;
}

const UpscalingRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const competency = location.state?.competency;
  const [proficiencyLevels, setProficiencyLevels] = useState<ProficiencyLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const employeeData = authStorage.getEmployeeData();
  const employeeId = employeeData?.id;

  // Parse behavior indicators from API string format
  const parseBehaviorIndicators = (indicatorsString: string): string[] => {
    if (!indicatorsString) return [];
    return indicatorsString
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('•'))
      .map(line => line.substring(1).trim())
      .filter(line => line.length > 0);
  };

  useEffect(() => {
    const fetchUpscalingRoute = async () => {
      if (!employeeId || !competency) {
        setIsLoading(false);
        return;
      }

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
          
          // Find the matching competency by ID or name
          const matchingCompetency = data.competencies?.find(
            (comp: any) => comp.code === competency.id.toUpperCase() || 
                          comp.competency_id === competency.name
          );

          if (matchingCompetency && matchingCompetency.upscaling_route) {
            const formattedLevels = matchingCompetency.upscaling_route.map((level: any) => ({
              id: level.id,
              title: level.level,
              description: level.description,
              behaviorIndicators: parseBehaviorIndicators(level.behavior_indicators),
              isCurrentLevel: level.is_current_level,
            }));
            setProficiencyLevels(formattedLevels);
          }
        }
      } catch (error) {
        console.error("Error fetching upscaling route:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpscalingRoute();
  }, [employeeId, competency]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="text-lg font-medium">
            Upscaling Route - {competency?.name || "Competency"}
          </span>
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : proficiencyLevels.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No upscaling route data available</div>
          ) : (
            <Accordion type="single" collapsible defaultValue={proficiencyLevels[0]?.id.toString()} className="space-y-2">
              {proficiencyLevels.map((level) => (
                <AccordionItem
                  key={level.id}
                  value={level.id.toString()}
                  className={`bg-card border rounded-lg overflow-hidden ${
                    level.isCurrentLevel ? 'border-primary' : 'border-border'
                  }`}
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                    <div className="text-left">
                      <p className="text-base font-semibold text-foreground">
                        {level.title}
                        {level.isCurrentLevel && (
                          <span className="ml-2 text-xs text-primary">(Current Level)</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">Proficiency Level</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 pt-2">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                        <p className="text-sm text-foreground leading-relaxed">{level.description}</p>
                      </div>
                      {level.behaviorIndicators.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Behavior Indicators</h4>
                          <ul className="space-y-2">
                            {level.behaviorIndicators.map((indicator, index) => (
                              <li key={index} className="text-sm text-foreground flex gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{indicator}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UpscalingRoute;
