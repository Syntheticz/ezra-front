"use client";

import { Card, CardContent } from "@/components/ui/card";
import { JobCardProps } from "@/lib/types";
import { useSession } from "next-auth/react";

export function JobCard({ description, title, location, score }: JobCardProps) {
  const session = useSession();
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-3">{location}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        {session.data?.user.role === "employee" && (
          <p className="text-sm text-muted-foreground">
            Suitability : {score === 0 ? "Not yet evaluated" : score}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
