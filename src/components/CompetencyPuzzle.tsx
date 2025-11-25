import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Competency {
  id: string;
  name: string;
  color: string;
  jobLevel: string;
  progress: number;
}

const competencies: Competency[] = [
  {
    id: "resilience",
    name: "Psychological Resilience",
    color: "bg-[#6B9F4A]",
    jobLevel: "Competent",
    progress: 0,
  },
  {
    id: "critical-thinking",
    name: "Critical Thinking",
    color: "bg-[#D4A929]",
    jobLevel: "Developing",
    progress: 35,
  },
  {
    id: "communication",
    name: "Communication",
    color: "bg-[#1565A6]",
    jobLevel: "Advanced",
    progress: 60,
  },
  {
    id: "accountability",
    name: "Accountability",
    color: "bg-[#3BA19A]",
    jobLevel: "Competent",
    progress: 45,
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
      <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
        {competencies.map((comp, index) => (
          <button
            key={comp.id}
            onClick={() => setSelectedCompetency(comp)}
            className={`${comp.color} p-4 min-h-[100px] flex items-center justify-center text-white text-sm font-medium text-center relative transition-opacity hover:opacity-90`}
            style={{
              clipPath: getPuzzleClipPath(index),
            }}
          >
            <span className="relative z-10">{comp.name}</span>
          </button>
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

// Helper function to create puzzle piece shapes
function getPuzzleClipPath(index: number): string {
  const puzzleShapes = [
    "polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%)",
    "polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 15%)",
    "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)",
    "polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 85%)",
  ];
  return puzzleShapes[index] || "none";
}
