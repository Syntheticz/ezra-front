"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { v4 as uuid } from "uuid";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { JobOptionalDefaultsWithRelations } from "@/lib/types";

import { Option } from "@/components/ui/auto-complete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createJobInformation, getCategories } from "@/lib/queries";
import { useMutation, useQuery } from "@tanstack/react-query";
import useDynamicToast from "../hooks/use-dynamic-toast";
import { useRouter } from "next/navigation";

export default function JobForm() {
  const jobID = uuid();
  const router = useRouter();

  const [priorityCategories, setPriorityCategories] = useState<Option[]>([]);

  const { data: categories, isLoading: isCategortLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await getCategories()).map((category) => ({
        value: category.id,
        label: category.name,
      })),
  });
  const form = useForm<JobOptionalDefaultsWithRelations>({
    defaultValues: {
      id: jobID,
      jobTitle: "",
      companyName: "",
      description: "",
      location: "",
      industryField: [{ id: uuid(), name: "" }],
      qualifications: [
        {
          id: uuid(),
          requirement: "",
          priority: false,
          QualificationCategory: [{ categoryId: "", qualificationId: uuid() }],
          possibleCredential: [
            { id: uuid(), credential: "", qualificationId: "" },
          ],
        },
      ],
      priorityCategories: [{ id: uuid() }],
    },
  });

  const { triggerToast } = useDynamicToast();
  const mutation = useMutation({
    mutationFn: createJobInformation,
    onSuccess: () => {
      // Handle successful mutation (e.g., refresh data, show a message)
      triggerToast("SUCCESS");
      setTimeout(() => window.location.reload(), 1000);
      router.push("/");
    },
    onError: (error) => {
      // Handle error
      console.log(error);
      triggerToast("ERROR");
      router.refresh();
    },
  });

  const {
    fields: industryFields,
    append: appendIndustry,
    remove: removeIndustry,
  } = useFieldArray({
    control: form.control,
    name: "industryField",
  });

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({
    control: form.control,
    name: "qualifications",
  });

  const {
    fields: priorityCategoryFields,
    append: appendPriorityCategory,
    remove: removePriorityCategory,
  } = useFieldArray({
    control: form.control,
    name: "priorityCategories",
  });

  const addIndustryField = () => {
    appendIndustry({ id: uuid(), name: "", jobId: jobID });
  };

  const removeIndustryField = (index: number) => {
    removeIndustry(index);
  };

  const removePriorityCategoryField = (index: number) => {
    removePriorityCategory(index);
  };

  const removeQualificationField = (index: number) => {
    removeQualification(index);
  };

  const addPriorityCategory = () => {
    appendPriorityCategory({ id: uuid(), jobId: jobID, categoryId: "" });
  };

  const addQualification = () => {
    const qualificationId = uuid();
    appendQualification({
      id: qualificationId,
      requirement: "",
      priority: false,
      QualificationCategory: [
        { categoryId: "", qualificationId: uuid(), id: uuid() },
      ],
      jobId: jobID,
      possibleCredential: [{ id: uuid(), credential: "", qualificationId }],
    });
  };

  useEffect(() => {
    if (categories) {
      setPriorityCategories(
        categories.filter(
          (item) =>
            !form
              .getValues()
              .priorityCategories.map((filterItem) => filterItem.categoryId)
              .includes(item.value)
        )
      );
    }
  }, [form.watch().priorityCategories]);

  useEffect(() => {
    if (categories) {
      setPriorityCategories(categories);
    }
  }, [categories]);

  const handleSubmit: SubmitHandler<JobOptionalDefaultsWithRelations> = (
    data
  ) => {
    mutation.mutate(data);
    // Here you would typically send the data to your backend
  };

  if (isCategortLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl space-y-6"
        >
          <h1 className="text-2xl font-bold mb-6">Create New Job</h1>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Web Developer" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose the sector related to the job, like &apos;IT,&apos;
                    &apos;Healthcare,&apos; or &apos;Finance&apos;.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <h1 className="text-xl font-bold mb-6">Industry</h1>

          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
            {industryFields.map((field, index) => (
              <div
                className="space-y-2 w-full flex items-end justify-between"
                key={field.id}
              >
                <FormField
                  control={form.control}
                  name={`industryField.${index}.name`}
                  render={({ field }) => (
                    <FormItem className=" w-full">
                      <FormLabel>Industry {index + 1}</FormLabel>
                      <FormControl className="">
                        <Input {...field} placeholder="Enter industry field" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {index < industryFields.length - 1 ? (
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    type="button"
                    onClick={() => removeIndustryField(index)}
                    className="ml-2 "
                  >
                    <Minus className="w-6 h-6" />
                  </Button>
                ) : (
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    type="button"
                    onClick={addIndustryField}
                    className="ml-2 "
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <h1 className="text-xl font-bold mb-6">Priority Category</h1>

          {categories && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
              {priorityCategoryFields.map((field, index) => (
                <div
                  className="space-y-2 w-full flex items-end justify-between"
                  key={field.id}
                >
                  <FormField
                    control={form.control}
                    name={`priorityCategories.${index}.categoryId`}
                    render={({ field }) => (
                      <FormItem className=" w-full">
                        <FormLabel>Category {index + 1}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorityCategories.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index < priorityCategoryFields.length - 1 ? (
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => removePriorityCategoryField(index)}
                      className="ml-2 "
                      type="button"
                    >
                      <Minus className="w-6 h-6" />
                    </Button>
                  ) : (
                    index < categories?.length - 1 && (
                      <Button
                        size={"icon"}
                        variant={"outline"}
                        onClick={addPriorityCategory}
                        className="ml-2 "
                        type="button"
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
          <h1 className="text-xl font-bold mb-6">Qualifications</h1>
          {categories &&
            qualificationFields.map((field, index) => (
              <QualificationsForm
                categories={categories}
                key={field.id}
                index={index}
                length={qualificationFields.length}
                onAdd={() => addQualification()}
                onRemove={() => removeQualificationField(index)}
              />
            ))}

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

interface QualificationsFormProps {
  onRemove: () => void;
  onAdd: () => void;
  index: number;
  length: number;
  categories: Option[];
}

function QualificationsForm({
  onRemove,
  onAdd,
  index,
  length,
  categories,
}: QualificationsFormProps) {
  const { control } = useFormContext();

  const { fields, remove, append } = useFieldArray({
    control,
    name: `qualifications.${index}.possibleCredential`,
  });

  const {
    fields: categoryFields,
    remove: removeCategoryField,
    append: appendCategoryField,
  } = useFieldArray({
    control,
    name: `qualifications.${index}.QualificationCategory`,
  });

  return (
    <div className="w-full grid  gap-4">
      <div className="space-y-2 w-full flex items-end justify-between">
        <FormField
          control={control}
          name={`qualifications.${index}.requirement`}
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>Qualification {index + 1}</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {index < length - 1 ? (
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => onRemove()}
            className="ml-2 "
            type="button"
          >
            <Minus className="w-6 h-6" />
          </Button>
        ) : (
          index < length && (
            <Button
              size={"icon"}
              variant={"outline"}
              onClick={() => onAdd()}
              className="ml-2 "
              type="button"
            >
              <Plus className="w-6 h-6" />
            </Button>
          )
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {categoryFields.map((field, categoryIndex) => (
          <QualificationCategory
            key={field.id}
            index={categoryIndex}
            categories={categories}
            length={categoryFields.length}
            qualificationIndex={index}
            onAdd={() => {
              appendCategoryField({
                categoryId: "",
                qualificationId: uuid(),
                id: uuid(),
              });
            }}
            onRemove={() => removeCategoryField(index)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {fields.map((field, possibleIndex) => (
          <PossibleCredentials
            key={field.id}
            index={possibleIndex}
            length={fields.length}
            qualificationIndex={index}
            onAdd={() => {
              append({ id: uuid(), credential: "", qualificationId: field.id });
            }}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </div>
  );
}

interface QualificationCategoryProps {
  onRemove: () => void;
  onAdd: () => void;
  index: number;
  qualificationIndex: number;
  length: number;
  categories: Option[];
}

function QualificationCategory({
  index,
  length,
  onAdd,
  onRemove,
  qualificationIndex,
  categories,
}: QualificationCategoryProps) {
  const { control } = useFormContext();

  return (
    <div className="flex items-end">
      <FormField
        control={control}
        name={`qualifications.${qualificationIndex}.QualificationCategory.${index}.categoryId`}
        render={({ field }) => (
          <FormItem className=" w-full">
            <FormLabel>Category {index + 1}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories &&
                  categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {index < length - 1 ? (
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => onRemove()}
          className="ml-2 "
          type="button"
        >
          <Minus className="w-6 h-6" />
        </Button>
      ) : (
        index < length && (
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => onAdd()}
            className="ml-2 "
            type="button"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )
      )}
    </div>
  );
}

interface PossibleCredentialsProps {
  onRemove: () => void;
  onAdd: () => void;
  index: number;
  qualificationIndex: number;
  length: number;
}

function PossibleCredentials({
  index,
  length,
  onAdd,
  onRemove,
  qualificationIndex,
}: PossibleCredentialsProps) {
  const { control } = useFormContext();
  return (
    <div className="w-full pl-12 gap-4">
      <div className="space-y-2 w-full flex items-end justify-between">
        <FormField
          control={control}
          name={`qualifications.${qualificationIndex}.possibleCredential.${index}.credential`}
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>Possible Credentials {index + 1}</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {index < length - 1 ? (
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => onRemove()}
            className="ml-2 "
            type="button"
          >
            <Minus className="w-6 h-6" />
          </Button>
        ) : (
          index < length && (
            <Button
              size={"icon"}
              variant={"outline"}
              onClick={() => onAdd()}
              className="ml-2 "
              type="button"
            >
              <Plus className="w-6 h-6" />
            </Button>
          )
        )}
      </div>
    </div>
  );
}
