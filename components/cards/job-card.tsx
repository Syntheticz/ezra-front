"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCardProps } from "@/lib/types";

export function JobCard({
  id,
  company_name,
  company_address,
  job_title,
  industry_field,
  description,
  qualifications,
  score,
}: JobCardProps) {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <CardHeader className="bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-primary">
            {job_title}
          </CardTitle>
          <Badge variant="secondary" className="text-xs font-normal">
            {industry_field}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>{company_name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">
              {score > 0 ? `${score.toFixed(1)}/100` : "N/A"}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{company_address}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Key Qualifications:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            {qualifications.slice(0, 3).map((qual, index) => (
              <li key={index} className="flex items-start space-x-2">
                {qual.categories.includes("Education") ? (
                  <GraduationCap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <Briefcase className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                <span className="line-clamp-2">{qual.requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4">
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
}
