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

export function CertificatesStep() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "certificates",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Certificates</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ title: "" })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Certificate
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-4">
            <FormField
              control={control}
              name={`certificates.${index}.title`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Certificate {index + 1}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="AWS Certified Solutions Architect"
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
