"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { updateUserRole } from "@/lib/queries";
import { signOut, useSession } from "next-auth/react";
import useDynamicToast from "./hooks/use-dynamic-toast";

export default function NewUser() {
  const router = useRouter();
  const session = useSession();

  const { triggerToast } = useDynamicToast();
  const { mutate } = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (data) => {
      triggerToast("SUCCESS");
      console.log(data);
      session.update({
        user: {
          ...session.data?.user,
          role: data.role,
        },
      });
      setTimeout(() => window.location.reload(), 1000);
    },
    onError: (error) => {
      console.log(error);
      triggerToast("ERROR");
    },
  });

  async function handleEmployee() {
    mutate({ email: session.data?.user.email || "", role: "employee" });
    router.push("/");
  }

  async function handleEmployer() {
    mutate({ email: session.data?.user.email || "", role: "employer" });
    router.push("/");
  }

  async function handleLogOut() {
    signOut();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Button className="fixed top-4 right-4 " onClick={handleLogOut}>
        Log Out
      </Button>
      <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-center text-gray-800">
        Welcome to Our Platform
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8 max-w-2xl">
        We&apos;re here to connect talented individuals with great
        opportunities. Choose your path to get started.
      </p>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>I&apos;m an Employee</CardTitle>
            <CardDescription>
              Find your dream job and advance your career
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleEmployee} className="w-full">
              Explore Jobs
            </Button>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>I&apos;m an Employer</CardTitle>
            <CardDescription>
              Post jobs and find the perfect candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleEmployer} className="w-full">
              Post a Job
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
