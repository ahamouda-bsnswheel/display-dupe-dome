import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Skill {
  name: string;
  level: string;
  category: string;
}

interface AddSkillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: Skill;
  isEditMode?: boolean;
}

const SKILLS_DATA = {
  Interpersonal: {
    skills: [
      "Adaptability",
      "Communication",
      "Conflict Management",
      "Critical Thinking",
      "Leadership",
      "Self-Education",
      "Report Writing",
      "Problem Solving",
      "Team building",
      "Mentoring",
      "Searching",
    ],
    levels: ["Expert", "Professional", "Intermediate", "Elementary", "Beginner"],
  },
  Languages: {
    skills: ["Arabic", "Bengali", "English", "Filipino", "German"],
    levels: ["Expert", "Professional", "Intermediate", "Elementary", "Beginner"],
  },
  Marketing: {
    skills: ["Communication", "Digital advertising", "Public Speaking"],
    levels: ["L4", "L3", "L2", "L1"],
  },
  Technical: {
    skills: [
      "Agile and Scrum methodologies",
      "Project Management",
      "Power BI",
      "Statistical Analysis (Excel, Power BI)",
      "ICDL",
      "Excel",
      "Digital Archiving",
      "KPI Tracking & Performance Analysis",
      "SAP data entry",
      "Microsoft Office",
      "Translation",
    ],
    levels: ["Expert", "Professional", "Intermediate", "Elementary", "Beginner"],
  },
};

export const AddSkillModal = ({ 
  open, 
  onOpenChange,
  editData,
  isEditMode = false 
}: AddSkillModalProps) => {
  const [skillType, setSkillType] = useState<string>("");
  const [skill, setSkill] = useState<string>("");
  const [skillLevel, setSkillLevel] = useState<string>("");

  // Pre-fill data when in edit mode
  useEffect(() => {
    if (isEditMode && editData) {
      setSkillType(editData.category);
      setSkill(editData.name);
      // Extract level from "Expert (100%)" format
      const levelMatch = editData.level.match(/^([^(]+)/);
      if (levelMatch) {
        setSkillLevel(levelMatch[1].trim());
      }
    } else {
      // Reset form when opening in add mode
      setSkillType("");
      setSkill("");
      setSkillLevel("");
    }
  }, [isEditMode, editData, open]);

  const skillTypes = Object.keys(SKILLS_DATA);
  const availableSkills = skillType
    ? SKILLS_DATA[skillType as keyof typeof SKILLS_DATA].skills
    : [];
  const availableLevels = skillType
    ? SKILLS_DATA[skillType as keyof typeof SKILLS_DATA].levels
    : [];

  const handleSkillTypeChange = (value: string) => {
    setSkillType(value);
    setSkill(""); // Reset skill when type changes
    setSkillLevel(""); // Reset level when type changes
  };

  const handleSave = () => {
    // TODO: Implement save logic
    console.log({
      skillType,
      skill,
      skillLevel,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-3xl p-0 flex flex-col"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-12 h-1 bg-foreground/20 rounded-full" />
        </div>

        {/* Header */}
        <SheetHeader className="px-6 pb-4">
          <SheetTitle className="text-xl font-semibold">Skill</SheetTitle>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Skill Type */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Skill Type
            </Label>
            <Select value={skillType} onValueChange={handleSkillTypeChange}>
              <SelectTrigger className="h-14 rounded-xl border-border bg-background text-base">
                <SelectValue placeholder="Enter Skill Type" />
              </SelectTrigger>
              <SelectContent>
                {skillTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-base">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skill */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Skill
            </Label>
            <Select
              value={skill}
              onValueChange={setSkill}
              disabled={!skillType}
            >
              <SelectTrigger className="h-14 rounded-xl border-border bg-background text-base">
                <SelectValue placeholder="Enter Skill" />
              </SelectTrigger>
              <SelectContent>
                {availableSkills.map((skillOption) => (
                  <SelectItem
                    key={skillOption}
                    value={skillOption}
                    className="text-base"
                  >
                    {skillOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skill Level */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Skill Level
            </Label>
            <Select
              value={skillLevel}
              onValueChange={setSkillLevel}
              disabled={!skill}
            >
              <SelectTrigger className="h-14 rounded-xl border-border bg-background text-base">
                <SelectValue placeholder="Enter Skill Level" />
              </SelectTrigger>
              <SelectContent>
                {availableLevels.map((level) => (
                  <SelectItem key={level} value={level} className="text-base">
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Save Button */}
        <div className="px-6 pb-6">
          <Button
            onClick={handleSave}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-base font-medium"
          >
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
