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
import { authStorage } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

interface Skill {
  name: string;
  level: string;
  category: string;
}

interface SkillType {
  id: number;
  name: string;
}

interface SkillOption {
  id: number;
  name: string;
}

interface SkillLevel {
  id: number;
  name: string;
}

interface AddSkillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: Skill;
  isEditMode?: boolean;
  employeeId?: number;
  onSuccess?: () => void;
}

export const AddSkillModal = ({ 
  open, 
  onOpenChange,
  editData,
  isEditMode = false,
  employeeId,
  onSuccess
}: AddSkillModalProps) => {
  const [skillTypeId, setSkillTypeId] = useState<string>("");
  const [skillId, setSkillId] = useState<string>("");
  const [skillLevelId, setSkillLevelId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic data from API
  const [skillTypes, setSkillTypes] = useState<SkillType[]>([]);
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Fetch skill types on mount
  useEffect(() => {
    const fetchSkillTypes = async () => {
      setLoadingTypes(true);
      try {
        const headers = authStorage.getAuthHeaders();
        const response = await fetch("https://bsnswheel.org/api/v1/skills_type", {
          method: "GET",
          headers,
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Skill types API response:", data);
          console.log("Setting skill types to:", data.results);
          setSkillTypes(data.results || []);
        }
      } catch (error) {
        console.error("Error fetching skill types:", error);
      } finally {
        setLoadingTypes(false);
      }
    };

    if (open) {
      fetchSkillTypes();
    }
  }, [open]);

  // Fetch skills and levels when skill type changes
  useEffect(() => {
    const fetchSkillsAndLevels = async () => {
      if (!skillTypeId) {
        setSkills([]);
        setSkillLevels([]);
        return;
      }

      setLoadingSkills(true);
      try {
        const headers = authStorage.getAuthHeaders();
        const response = await fetch(
          `https://bsnswheel.org/api/v1/skills/custom/${skillTypeId}`,
          {
            method: "PUT",
            headers,
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setSkills(data.skills || []);
          setSkillLevels(data.skill_levels || []);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchSkillsAndLevels();
    // Reset skill and level when type changes
    setSkillId("");
    setSkillLevelId("");
  }, [skillTypeId]);

  // Reset form when opening/closing
  useEffect(() => {
    if (!open) {
      setSkillTypeId("");
      setSkillId("");
      setSkillLevelId("");
      setSkills([]);
      setSkillLevels([]);
    }
  }, [open]);

  const handleSkillTypeChange = (value: string) => {
    setSkillTypeId(value);
  };

  const handleSave = async () => {
    if (!skillTypeId || !skillId || !skillLevelId || !employeeId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const headers = authStorage.getAuthHeaders();
      const params = new URLSearchParams({
        employee_id: employeeId.toString(),
        skill_id: skillId,
        skill_type_id: skillTypeId,
        skill_level_id: skillLevelId,
      });

      const response = await fetch(
        `https://bsnswheel.org/api/v1/employee_skills?${params.toString()}`,
        {
          method: "POST",
          headers,
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Skill added successfully",
        });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast({
          title: "Error",
          description: "Failed to add skill",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving skill:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <SheetTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Skill" : "Add Skill"}
          </SheetTitle>
        </SheetHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Skill Type */}
          <div className="space-y-2">
            <Label className="text-base font-normal text-foreground">
              Skill Type
            </Label>
            <Select value={skillTypeId} onValueChange={handleSkillTypeChange} disabled={loadingTypes}>
              <SelectTrigger className="h-14 rounded-xl border-border bg-background text-base">
                <SelectValue placeholder={loadingTypes ? "Loading..." : "Select Skill Type"} />
              </SelectTrigger>
              <SelectContent>
                {skillTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()} className="text-base">
                    {type.name}
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
              value={skillId}
              onValueChange={setSkillId}
              disabled={!skillTypeId || loadingSkills}
            >
              <SelectTrigger className="h-14 rounded-xl border-border bg-background text-base">
                <SelectValue placeholder={loadingSkills ? "Loading..." : "Select Skill"} />
              </SelectTrigger>
              <SelectContent>
                {skills.map((skill) => (
                  <SelectItem
                    key={skill.id}
                    value={skill.id.toString()}
                    className="text-base"
                  >
                    {skill.name}
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
              value={skillLevelId}
              onValueChange={setSkillLevelId}
              disabled={!skillId || loadingSkills}
            >
              <SelectTrigger className="h-14 rounded-xl border-border bg-background text-base">
                <SelectValue placeholder="Select Skill Level" />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id.toString()} className="text-base">
                    {level.name}
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
            disabled={isLoading || !skillTypeId || !skillId || !skillLevelId}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-base font-medium"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
