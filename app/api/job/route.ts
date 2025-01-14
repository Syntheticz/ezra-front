import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface JobQualification {
  requirement: string;
  possible_credentials: string[];
  categories: string[];
  priority: boolean;
}

interface JobRole {
  id: string;
  job_title: string;
  industry_field: string[];
  priority_categories: string[];
  qualifications: JobQualification[];
}

interface ApplicantData {
  education: string[]; // Array of educational qualifications
  skills: string[]; // Array of skills
  experience: string[]; // Array of experience entries (empty in this case)
  certificates: string[]; // Array of certificates
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId") as string;
  const applicantId = searchParams.get("applicantId") as string;

  const applicant = await prisma.userInput.findFirst({
    where: { id: applicantId },
    include: {
      certificates: true,
      education: true,
      experience: true,
      skills: true,
    },
  });

  const job = await prisma.job.findFirst({
    where: { id: jobId },
    include: {
      industryField: true,
      priorityCategories: {
        include: {
          category: true,
        },
      },
      qualifications: {
        include: {
          category: true,
          possibleCredential: true,
          QualificationCategory: { include: { category: true } },
        },
      },
    },
  });

  if (!job || !applicant)
    return NextResponse.json({
      job: null,
      success: false,
    });

  const finalApplicant: ApplicantData = {
    certificates: applicant.certificates.map((item) => item.title),
    education: applicant.education.map((item) => item.degree),
    experience: applicant.experience.map((item) => item.description),
    skills: applicant.experience.map((item) => item.description),
  };

  const finaljob: JobRole = {
    id: job.id,
    industry_field: job.industryField.map((item) => item.name),
    job_title: job.jobTitle,
    priority_categories: job.priorityCategories.map(
      (item) => item.category.name
    ),
    qualifications: job.qualifications.map((item) => ({
      categories: item.QualificationCategory.map((item) => item.category.name),
      possible_credentials: item.possibleCredential.map(
        (credential) => credential.credential
      ),
      priority: item.priority,
      requirement: item.requirement,
    })),
  };
  try {
    return NextResponse.json({
      job: finaljob,
      finalApplicant: finalApplicant,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      job: null,
      success: false,
    });
  }
}

export type RegistrationInfoGETResponse = Awaited<
  ReturnType<typeof GET>
> extends NextResponse<infer T>
  ? T
  : never;
