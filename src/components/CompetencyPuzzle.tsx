import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import puzzleImage from "@/assets/competency-puzzle.png";

interface Competency {
  id: string;
  name: string;
  jobLevel: string;
  progress: number;
  position: { top: string; left: string; width: string; height: string };
}

const competencies: Competency[] = [
  {
    id: "resilience",
    name: "Psychological Resilience",
    jobLevel: "Competent",
    progress: 0,
    position: { top: "2%", left: "34%", width: "30%", height: "23%" },
  },
  {
    id: "critical-thinking",
    name: "Critical Thinking",
    jobLevel: "Developing",
    progress: 35,
    position: { top: "2%", left: "66%", width: "33%", height: "23%" },
  },
  {
    id: "communication",
    name: "Communication",
    jobLevel: "Advanced",
    progress: 60,
    position: { top: "26%", left: "34%", width: "32%", height: "22%" },
  },
  {
    id: "accountability",
    name: "Accountability",
    jobLevel: "Competent",
    progress: 45,
    position: { top: "26%", left: "67%", width: "32%", height: "22%" },
  },
];

export const CompetencyPuzzle = () => {
  const [selectedCompetency, setSelectedCompetency] = useState<Competency | null>(null);
  const navigate = useNavigate();

  const handleUpscalingRoute = () => {
    if (selectedCompetency) {
      navigate(`/upscaling-route/${selectedCompetency.id}`, {
        state: { competency: selectedCompetency },
      });
    }
  };

  return (
    <>
      <div className="relative w-full max-w-sm mx-auto rounded-lg overflow-hidden">
        <img 
          src={puzzleImage} 
          alt="Competency Puzzle" 
          className="w-full h-auto block"
        />
        {competencies.map((comp) => (
          <button
            key={comp.id}
            onClick={() => setSelectedCompetency(comp)}
            className="absolute cursor-pointer hover:bg-white/10 transition-colors"
            style={{
              top: comp.position.top,
              left: comp.position.left,
              width: comp.position.width,
              height: comp.position.height,
            }}
            aria-label={comp.name}
          />
        ))}
      </div>

      <Dialog open={!!selectedCompetency} onOpenChange={() => setSelectedCompetency(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              Competency - {selectedCompetency?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Job Level: {selectedCompetency?.jobLevel}</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">Progress:</p>
                <p className="text-sm font-semibold text-foreground">{selectedCompetency?.progress}%</p>
              </div>
            </div>
            <Button 
              onClick={handleUpscalingRoute}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Upscaling Route
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
