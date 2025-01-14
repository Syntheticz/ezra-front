import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import { promises as fs } from "fs";
import { v4 as uuid } from "uuid";
import path from "path";
const categories = [
  "education",
  "skills",
  "experience",
  "certificates",
  "others",
];

async function seedCategories(categorues: string[]) {
  await prisma.category.createMany({
    data: categorues.map((category) => ({
      name: category,
    })),
  });
}

async function seedJobs() {
  const usersPath = path.join(process.cwd(), "/prisma/seed/dataset.json");
  const file = await fs.readFile(usersPath, "utf-8");
  const rawData = JSON.parse(file);
  const data = rawData.job_roles;
  const categories = await prisma.category.findMany();
  const categoryRecord: Record<string, string> = categories.reduce(
    (acc, item) => {
      acc[item.name.toLowerCase()] = item.id;
      return acc;
    },
    {} as Record<string, string>
  );

  for (let i = 0; i < data.length; i++) {
    const job = data[i];
    await prisma.$transaction(async (tx) => {
      const employer = job.employer[0];
      const jobInfo = await prisma.job.create({
        data: {
          jobTitle: job.job_title,
          postedDate: new Date(Date.now()),
          companyName: job.company_name,
          Employer: {
            create: {
              name: employer.name,
              contactNumber: employer.contact,
              email: employer.email,
            },
          },
          description: job.description,
          industryField: {
            connectOrCreate: {
              where: { name: job.industry_field },
              create: { name: job.industry_field },
            },
          },
          location: job.company_address,
          priorityCategories: {
            createMany: {
              data: job.priority_categories.map((item: string) => ({
                categoryId: categoryRecord[item.toLowerCase()],
              })),
            },
          },
        },
      });

      const qualifications = job.qualifications.map((qualification: any) => ({
        ...qualification,
        id: uuid(),
      }));

      const qualificationsData = await tx.qualification.createManyAndReturn({
        data: qualifications.map((qualification: any) => ({
          id: qualification.id,
          requirement: qualification.requirement,
          jobId: jobInfo.id,
          priority: qualification.priority,
        })),
      });

      for (const qualification of qualifications) {
        const possibleCredential = qualification.possible_credentials;
        const categories = qualification.categories;

        for (const credential of possibleCredential) {
          await tx.possibleCredential.create({
            data: {
              credential: credential || "",
              qualificationId:
                qualificationsData.find((item) => item.id === qualification.id)
                  ?.id || "",
            },
          });
        }

        for (const category of categories) {
          await tx.qualificationCategory.create({
            data: {
              categoryId: categoryRecord[category.toLowerCase()],
              qualificationId: qualification.id || "",
            },
          });
        }
      }
    });
  }
}

async function main() {
  await seedCategories(categories);
  console.log("Categories seeded successfully.");

  await seedJobs();
  console.log("Jobs seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
