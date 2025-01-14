"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoStep } from "@/components/steps/personal-info";
import { EducationStep } from "@/components/steps/education";
import { SkillsStep } from "@/components/steps/skills";
import { ExperienceStep } from "@/components/steps/experience";
import { CertificatesStep } from "@/components/steps/certificates";
import {
  ClipboardList,
  GraduationCap,
  User,
  Briefcase,
  Award,
} from "lucide-react";
import { UserInputDefaultsWithRelations } from "@/lib/types";
import { createUserInputInformation } from "@/lib/queries";
import useDynamicToast from "@/components/hooks/use-dynamic-toast";
import { useSession } from "next-auth/react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("personal");
  const router = useRouter();
  const { triggerToast } = useDynamicToast();

  const form = useForm<UserInputDefaultsWithRelations>({
    defaultValues: {
      firstName: "",
      createdAt: new Date(Date.now()),
      middleName: "",
      lastName: "",
      education: [],
      skills: [],
      experience: [],
      certificates: [],
    },
  });

  const session = useSession();

  const mutation = useMutation({
    mutationFn: createUserInputInformation,
    onSuccess: () => {
      triggerToast("SUCCESS");
      router.refresh();
      setTimeout(() => window.location.reload(), 1000);
      session.update({
        user: {
          ...session.data?.user,
          hasData: true,
        },
      });
      router.push("/verification");
    },
    onError: (error) => {
      console.error(error);
      triggerToast("ERROR");
      router.refresh();
    },
  });

  console.log(session);
  const onSubmit: SubmitHandler<UserInputDefaultsWithRelations> = async (
    data
  ) => {
    mutation.mutate(data);
  };

  const tabs = [
    { value: "personal", icon: User, label: "Personal" },
    { value: "education", icon: GraduationCap, label: "Education" },
    { value: "skills", icon: ClipboardList, label: "Skills" },
    { value: "experience", icon: Briefcase, label: "Experience" },
    { value: "certificates", icon: Award, label: "Certificates" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-center py-2">User Information</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 h-auto">
              {tabs.map(({ value, icon: Icon, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex flex-col items-center justify-center py-2 px-1 sm:px-2 h-16 sm:h-20"
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span className="text-xs sm:text-sm">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-6">
              <TabsContent value="personal">
                <PersonalInfoStep />
              </TabsContent>
              <TabsContent value="education">
                <EducationStep />
              </TabsContent>
              <TabsContent value="skills">
                <SkillsStep />
              </TabsContent>
              <TabsContent value="experience">
                <ExperienceStep />
              </TabsContent>
              <TabsContent value="certificates">
                <CertificatesStep />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const currentIndex = tabs.findIndex(
                  (tab) => tab.value === activeTab
                );
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1].value);
                }
              }}
              disabled={activeTab === "personal"}
            >
              Previous
            </Button>
            {activeTab === "certificates" ? (
              <Button type="submit">Submit</Button>
            ) : (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const currentIndex = tabs.findIndex(
                    (tab) => tab.value === activeTab
                  );
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1].value);
                  }
                }}
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
