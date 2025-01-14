"use client";
import { useEffect, useState } from "react";
import { JobCard } from "./cards/job-card";
import { Input } from "@/components/ui/input";
import { JobCardProps } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  evaluateJobForApplicant,
  fetchJobsFromScores,
  fetchUserInputIDbyEmail,
} from "@/lib/queries";
import { useSession } from "next-auth/react";
import { Navbar } from "./ui/navbar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useDynamicToast from "./hooks/use-dynamic-toast";
import Loading from "./data-fetch-loader";

export function JobRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  //Data fetching
  const { data, isLoading: isDataLoading } = useQuery({
    queryKey: ["users", session.data?.user.email],
    queryFn: async () => {
      const id = await fetchUserInputIDbyEmail(session.data?.user.email || "");
      return await fetchJobsFromScores(id);
    },
  });
  const [jobs, setJobs] = useState<JobCardProps[]>([]);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter((job) =>
    job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { triggerToast } = useDynamicToast();

  const handleEvaluate = async () => {
    setIsLoading(true);
    if (session.data?.user.role === "employee") {
      if (session.data?.user.isVerified) {
        const id = await fetchUserInputIDbyEmail(
          session.data?.user.email || ""
        );
        await evaluateJobForApplicant(id);
        triggerToast("SUCCESS");
        setIsLoading(false);
      } else {
        setIsLoading(false);

        router.push("/user/add");
      }
    } else {
      router.push("/job/add");
    }
  };

  useEffect(() => {
    if (!data) return;
    console.log(data);
    setJobs(
      data
        .map((item) => ({
          id: item.job.id,
          company_name: item.job.companyName,
          company_address: item.job.location || "",
          job_title: item.job.jobTitle,
          industry_field:
            item.job.industryField.length === 0
              ? ""
              : item.job.industryField[0].name,
          description: item.job.description || "",
          qualifications: item.job.qualifications.map((item) => ({
            requirement: item.requirement,
            categories: item.category.map((category) => category.name),
          })),
          score: item.score,
        }))
        .sort((a, b) => b.score - a.score)
    );
  }, [data]);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-6">
          Discover exciting opportunities tailored just for you.
        </p>
        <div className="flex justify-center mb-12">
          <Button
            className="text-lg px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleEvaluate}
            disabled={isLoading}
          >
            {session.data?.user.role === "employer" && "Post a Job"}
            {session.data?.user.role === "employee"
              ? !isLoading && "employee"
                ? "Evaluate now"
                : "Evaluating..."
              : ""}
          </Button>
        </div>

        <Input
          type="text"
          placeholder="Search jobs or companies..."
          className="mb-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="space-y-8">
          {isDataLoading && <Loading />}
          {!isDataLoading
            ? filteredJobs.map((job) => <JobCard key={job.id} {...job} />)
            : null}
        </div>
      </div>
    </div>
  );
}
