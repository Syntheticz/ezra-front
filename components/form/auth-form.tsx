"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/lib/queries";
import { SubmitHandler, useForm } from "react-hook-form";
import { User } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import useDynamicToast from "../hooks/use-dynamic-toast";

interface AuthFormProps {
  type: "login" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<User>({
    defaultValues: {
      createdAt: new Date(Date.now()),
      email: "",
      password: "",
      role: "",
      updatedAt: new Date(Date.now()),
    },
  });

  const { triggerToast } = useDynamicToast();
  const { mutate } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      triggerToast("SUCCESS");
      router.refresh();
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

  const handleSubmit: SubmitHandler<User> = async (data) => {
    // Simulate successful auth and redirect
    if (type === "signup") {
      mutate(data);
    } else {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.ok) {
        router.push("/");
      }

      if (res?.error) {
        triggerToast("LOGINERROR");
      }
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl">
          {type === "login" ? "Login" : "Sign Up"}
        </CardTitle>
        <CardDescription>
          {type === "login"
            ? "Enter your credentials to access your account"
            : "Create a new account to get started"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder=""
                              {...field}
                              type={showPassword ? "text" : "password"}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">
              {type === "login" ? "Login" : "Sign Up"}
            </Button>
            <div className="text-center mt-4">
              {type === "login" ? (
                <p className="text-sm font-semibold text-gray-700">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-gray-800 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              ) : (
                <p className="text-sm font-semibold text-gray-700">
                  Already have an account?{" "}
                  <Link href="/login" className="text-gray-800 hover:underline">
                    Login
                  </Link>
                </p>
              )}
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
