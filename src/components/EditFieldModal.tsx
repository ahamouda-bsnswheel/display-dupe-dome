import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Field {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  validation?: z.ZodTypeAny;
}

interface EditFieldModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: Field[];
  onSave?: (data: Record<string, string>) => void;
}

export function EditFieldModal({
  open,
  onOpenChange,
  title,
  fields,
  onSave,
}: EditFieldModalProps) {
  const { toast } = useToast();
  
  // Build dynamic schema
  const schemaObject: Record<string, z.ZodTypeAny> = {};
  const defaultValues: Record<string, string> = {};
  
  fields.forEach(field => {
    if (field.validation) {
      schemaObject[field.name] = field.validation;
    } else {
      schemaObject[field.name] = z.string().trim();
    }
    defaultValues[field.name] = field.defaultValue || "";
  });
  
  const formSchema = z.object(schemaObject);
  
  const form = useForm<Record<string, string>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (data: Record<string, string>) => {
    if (onSave) {
      onSave(data);
    }
    toast({
      title: "Success",
      description: `${title} updated successfully`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-sm opacity-70 hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        {...formField}
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
