import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Competency {
  id: string;
  name: string;
  jobLevel: string;
  progress: number;
  position: { top: string; right: string; width: string; height: string };
}

interface ApiCompetency {
  id: number;
  code: string;
  competency_id: string;
  job_level_id: string;
  progress: number;
}

interface CompetencyPuzzleProps {
  competencies?: ApiCompetency[];
}

const positionMap: Record<string, { top: string; right: string; width: string; height: string }> = {
  PSR: { top: "0", right: "25%", width: "25%", height: "25%" },
  CRT: { top: "0", right: "0", width: "25%", height: "25%" },
  COM: { top: "25%", right: "25%", width: "25%", height: "25%" },
  ACC: { top: "25%", right: "0", width: "25%", height: "25%" },
};

export const CompetencyPuzzle = ({ competencies: apiCompetencies = [] }: CompetencyPuzzleProps) => {
  // Map API data to component format, merging with position data
  const competencies: Competency[] = apiCompetencies.map((comp) => ({
    id: comp.code.toLowerCase(),
    name: comp.competency_id,
    jobLevel: comp.job_level_id,
    progress: comp.progress,
    position: positionMap[comp.code] || { top: "0", right: "0", width: "25%", height: "25%" },
  }));
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
        <img src="/images/competency-puzzle.png" alt="Competency Puzzle" className="w-full h-auto block" />
        {competencies.map((comp) => (
          <button
            key={comp.id}
            onClick={() => setSelectedCompetency(comp)}
            className="absolute cursor-pointer hover:bg-white/10 transition-colors"
            style={{
              top: comp.position.top,
              right: comp.position.right,
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
            <DialogTitle className="text-base">Competency - {selectedCompetency?.name}</DialogTitle>
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
            <Button onClick={handleUpscalingRoute} className="w-full bg-primary hover:bg-primary/90">
              Upscaling Route
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
