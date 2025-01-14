"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export function ExperienceStep() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "experience",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Experience</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ description: "" })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-4">
            <FormField
              control={control}
              name={`experience.${index}.description`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Experience {index + 1}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your work experience..."
                      {...field}
                    />
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
