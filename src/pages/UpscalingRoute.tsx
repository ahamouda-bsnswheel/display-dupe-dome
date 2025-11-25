import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProficiencyLevel {
  id: string;
  title: string;
  description: string;
  behaviorIndicators: string[];
}

const proficiencyLevels: ProficiencyLevel[] = [
  {
    id: "beginner",
    title: "Beginner",
    description: "Individuals are beginning to develop psychological resilience skills, recognizing basic stressors, but require more guidance to form effective coping mechanisms.",
    behaviorIndicators: [
      "Recognizes basic stressors and understands their impact.",
      "Displays an initial awareness of personal emotional triggers.",
      "Follows basic stress management practices with guidance from experienced colleagues.",
      "Seeks assistance from experienced colleagues when challenged.",
    ],
  },
  {
    id: "developing",
    title: "Developing",
    description: "Individuals are actively developing their resilience capabilities and can handle moderate stress with some guidance.",
    behaviorIndicators: [
      "Identifies various stressors and their effects on performance.",
      "Demonstrates growing awareness of personal coping mechanisms.",
      "Applies stress management techniques with increasing confidence.",
      "Seeks feedback to improve resilience skills.",
    ],
  },
  {
    id: "competent",
    title: "Competent",
    description: "Individuals demonstrate solid resilience skills and can effectively manage stress in most situations.",
    behaviorIndicators: [
      "Successfully manages stress in various work situations.",
      "Applies appropriate coping strategies independently.",
      "Maintains composure during challenging circumstances.",
      "Supports colleagues in managing their stress.",
    ],
  },
  {
    id: "advanced",
    title: "Advanced",
    description: "Individuals show advanced resilience capabilities and serve as role models for others.",
    behaviorIndicators: [
      "Demonstrates exceptional stress management in complex situations.",
      "Mentors others in building resilience skills.",
      "Adapts quickly to significant organizational changes.",
      "Contributes to creating a resilient team culture.",
    ],
  },
  {
    id: "expert",
    title: "Expert",
    description: "Individuals exhibit mastery in resilience and lead organizational resilience initiatives.",
    behaviorIndicators: [
      "Leads by example in handling extreme pressure situations.",
      "Designs and implements resilience programs.",
      "Influences organizational culture towards greater resilience.",
      "Recognized as a subject matter expert in resilience.",
    ],
  },
  {
    id: "strategic",
    title: "Strategic",
    description: "Individuals operate at the highest level of resilience, shaping organizational strategy and culture.",
    behaviorIndicators: [
      "Shapes organizational resilience strategy and vision.",
      "Drives culture transformation towards resilience.",
      "Influences industry best practices in resilience.",
      "Creates sustainable resilience frameworks.",
    ],
  },
];

const UpscalingRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const competency = location.state?.competency;

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
          <Accordion type="single" collapsible defaultValue="beginner" className="space-y-2">
            {proficiencyLevels.map((level) => (
              <AccordionItem
                key={level.id}
                value={level.id}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                  <div className="text-left">
                    <p className="text-base font-semibold text-foreground">{level.title}</p>
                    <p className="text-sm text-muted-foreground">Proficiency Level</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4 pt-2">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                      <p className="text-sm text-foreground leading-relaxed">{level.description}</p>
                    </div>
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
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
};

export default UpscalingRoute;
