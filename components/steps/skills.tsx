"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export function SkillsStep() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "skills",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skills</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "" })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-4">
            <FormField
              control={control}
              name={`skills.${index}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Skill {index + 1}</FormLabel>
                  <FormControl>
                    <Input placeholder="JavaScript" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
