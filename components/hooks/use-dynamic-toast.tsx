"use client";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, CircleAlert, CircleX, Loader2 } from "lucide-react";

type ToastType =
  | "SUCCESS"
  | "ERROR"
  | "EMPTYFIELDS"
  | "LOGINERROR"
  | "NOPERMISSION"
  | "LOADING"
  | "SUCCESSREPORT";

export default function useDynamicToast() {
  const { toast } = useToast();

  // Function to trigger success toast
  const triggerToast = (type: ToastType, percentage?: number) => {
    if (type === "SUCCESS") {
      toast({
        action: (
          <div className="w-full flex items-center h-10 gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium first-letter:capitalize">
              Action executed successfully.
            </span>
          </div>
        ),
      });
    } else if (type === "ERROR") {
      toast({
        action: (
          <div className="w-full flex items-center h-10 gap-2">
            <CircleX className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium first-letter:capitalize">
              There was an error. Please contact support.
            </span>
          </div>
        ),
      });
    } else if (type === "EMPTYFIELDS") {
      toast({
        action: (
          <div className="w-full flex items-center h-10 gap-2">
            <CircleAlert className="h-6 w-6 text-orange-600" />
            <span className="first-letter:capitalize">
              There are empty fields.
            </span>
          </div>
        ),
      });
    } else if (type === "LOGINERROR") {
      toast({
        action: (
          <div className="w-full flex items-center h-10 gap-2">
            <CircleX className="h-5 w-5 text-red-500" />
            <span className="first-letter:capitalize">
              Wrong username or password!
            </span>
          </div>
        ),
      });
    } else if (type === "NOPERMISSION") {
      toast({
        action: (
          <div className="w-full flex items-center h-10 gap-2">
            <CircleX className="h-5 w-5 text-red-500" />
            <span className="first-letter:capitalize">
              You do not have permission to do this!
            </span>
          </div>
        ),
      });
    } else if (type === "LOADING") {
      toast({
        action: (
          <div className="flex flex-col space-y-2 w-full max-w-xs">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-medium">Generating Report</span>
            </div>
            <Progress value={percentage} className="w-full" />
            <span className="text-xs text-muted-foreground self-end">
              {percentage}% complete
            </span>
          </div>
        ),
      });
    } else if (type === "SUCCESSREPORT") {
      toast({
        action: (
          <div className="w-full flex items-center h-10 gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium first-letter:capitalize">
              Report generated, download will start shortly.
            </span>
          </div>
        ),
      });
    }
  };

  return { triggerToast };
}
