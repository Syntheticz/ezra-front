"use server";

import { prisma } from "./prisma";
import {
  JobOptionalDefaultsWithRelations,
  UserInputDefaultsWithRelations,
} from "./types";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

const HASH_VALUE = 10;

export async function getCategories() {
  return prisma.category.findMany();
}

export async function updateUserRole(data: { email: string; role: string }) {
  const user = await prisma.user.update({
    where: { email: data.email },
    data: {
      role: data.role,
    },
  });
  return user;
}

export async function verifyUser(id: string) {
  await prisma.userInput.update({
    where: { id },
    data: { isVerified: true },
  });
}

export async function createUser(data: User) {
  const password = await bcrypt.hash(data.password, HASH_VALUE);
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser)
    throw new Error("There is already an existing user with this email.");

  await prisma.user.create({
    data: { ...data, password: password },
  });
}

export async function fetchJobsFromScores(applicantId: string) {
  const scoredJobs = await prisma.score.findMany({
    where: { userInputId: applicantId },
    include: {
      job: {
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
      },
    },
  });

  // Get IDs of scored jobs
  const scoredJobIds = scoredJobs.map((scoredJob) => scoredJob.job.id);

  let combinedJobs;

  if (scoredJobs.length === 0) {
    // No scored jobs, fetch all as non-scored jobs
    const nonScoredJobs = await prisma.job.findMany({
      include: {
        industryField: true,
        Score: true,
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
    combinedJobs = nonScoredJobs.map((item) => ({
      job: item,
      score: 0,
      id: item.id,
    }));
  } else {
    // Fetch non-scored jobs and combine
    const nonScoredJobs = await prisma.job.findMany({
      where: {
        id: { notIn: scoredJobIds },
      },
      include: {
        industryField: true,
        Score: true,
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

    // Map non-scored jobs with default score of 0
    const nonScoredJobsWithScore = nonScoredJobs.map((item) => ({
      job: item,
      score: 0,
      id: item.id,
    }));

    // Combine scored and non-scored jobs
    combinedJobs = [
      ...scoredJobs.map((item) => ({
        job: item.job,
        score: item.score,
        id: item.job.id,
      })),
      ...nonScoredJobsWithScore,
    ];
  }

  return combinedJobs;
}

export async function evaluateJobForApplicant(applicantId: string) {
  const rawJobs = await prisma.job.findMany({
    select: { id: true },
  });
  const data: Array<{ id: string; score: number }> = [];

  const jobIds = rawJobs.map((item) => item.id);
  for (let index = 0; index < jobIds.length; index++) {
    const job = jobIds[index];
    const link = `http://0.0.0.0:5000/api?jobId=${job}&applicantId=${applicantId}`;
    const response = await fetch(link);
    const jsonData = await response.json();
    if (!jsonData) throw new Error("There were no data found!");

    const existingRecord = await prisma.score.findFirst({
      where: {
        userInputId: applicantId,
        jobId: jsonData.id,
      },
    });

    if (!existingRecord) {
      await prisma.score.create({
        data: {
          score: Math.round(jsonData.score),
          jobId: jsonData.id,
          userInputId: applicantId,
        },
      });
      data.push(jsonData);
    }
  }

  return data;
}

export async function createJobInformation(
  data: JobOptionalDefaultsWithRelations
) {
  await prisma.$transaction(async (tx) => {
    const job = await tx.job.create({
      data: {
        postedDate: new Date(Date.now()),

        jobTitle: data.jobTitle,
        industryField: {
          createMany: { data: data.industryField || [] },
        },

        priorityCategories: {
          createMany: { data: data.priorityCategories },
        },
      },
    });

    await tx.qualification.createManyAndReturn({
      data: data.qualifications.map((qualification) => ({
        id: qualification.id,
        requirement: qualification.requirement,
        jobId: job.id,
        priority: qualification.priority,
      })),
    });

    for (const qualification of data.qualifications) {
      const possibleCredential = qualification.possibleCredential;
      const categories = qualification.QualificationCategory;

      for (const category of categories) {
        await tx.qualificationCategory.create({
          data: {
            categoryId: category.categoryId,
            qualificationId: qualification.id || "",
          },
        });
      }

      for (const credential of possibleCredential) {
        await tx.possibleCredential.create({
          data: {
            credential: credential.credential || "",
            qualificationId: qualification.id || "",
          },
        });
      }
    }
  });
}

export async function getJobInformation() {
  return prisma.job.findMany({
    include: {
      industryField: true,
      qualifications: {
        include: {
          possibleCredential: true,
          QualificationCategory: {
            include: { category: true },
          },
        },
      },
      priorityCategories: true,
    },
  });
}

export async function getJobInformationById(id: string) {
  return prisma.job.findUnique({
    where: {
      id,
    },
    include: {
      industryField: true,
      qualifications: {
        include: {
          possibleCredential: true,
        },
      },
      priorityCategories: true,
    },
  });
}

export async function updateJobInformation(
  data: JobOptionalDefaultsWithRelations
) {
  await prisma.job.update({
    where: {
      id: data.id,
    },
    data: {
      jobTitle: data.jobTitle,

      industryField: {
        connect: data.industryField?.map((field) => ({ id: field.id })),
      },
      qualifications: {
        connect: data.qualifications.map((qualification) => ({
          id: qualification.id,
        })),
      },
      priorityCategories: {
        connect: data.priorityCategories.map((category) => ({
          id: category.id,
        })),
      },
    },
  });
}

export async function deleteJobInformation(id: string) {
  await prisma.job.delete({
    where: {
      id,
    },
  });
}

export async function fetchUserInputIDbyEmail(email: string) {
  const id = await prisma.user.findUnique({
    where: { email },
    select: { UserInput: { select: { id: true } } },
  });

  return id?.UserInput?.id || "";
}

export async function createUserInputInformation(
  data: UserInputDefaultsWithRelations
) {
  const session = await auth();
  prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { email: session?.user.email },
    });
    if (!user) throw new Error("There is no user found! Contact Support.");
    await tx.userInput.create({
      data: {
        firstName: data.firstName,
        createdAt: new Date(Date.now()),
        middleName: data.middleName,
        lastName: data.lastName,
        userId: user.id,
        education: {
          createMany: {
            data: data.education,
          },
        },
        skills: {
          createMany: {
            data: data.skills,
          },
        },
        experience: {
          createMany: {
            data: data.experience,
          },
        },
        certificates: {
          createMany: { data: data.certificates },
        },
      },
    });
  });
}
