import {
  CertificateOptionalDefaults,
  EducationOptionalDefaults,
  ExperienceOptionalDefaults,
  IndustryFieldOptionalDefaults,
  JobOptionalDefaults,
  PossibleCredentialOptionalDefaults,
  PriorityCategoryOptionalDefaults,
  QualificationCategoryOptionalDefaults,
  QualificationOptionalDefaults,
  ScoreOptionalDefaults,
  SkillOptionalDefaults,
  UserInputOptionalDefaults,
} from "@/prisma/generated/zod";

export interface qualificationsOptionalDefaultsWithRelations
  extends QualificationOptionalDefaults {
  possibleCredential: PossibleCredentialOptionalDefaults[];
  QualificationCategory: QualificationCategoryOptionalDefaults[];
}

export interface JobOptionalDefaultsWithRelations extends JobOptionalDefaults {
  jobTitle: string;
  industryField: IndustryFieldOptionalDefaults[]?;
  qualifications: qualificationsOptionalDefaultsWithRelations[];
  priorityCategories: PriorityCategoryOptionalDefaults[];
}

export interface UserInputDefaultsWithRelations
  extends UserInputOptionalDefaults {
  education: EducationOptionalDefaults[];
  skills: SkillOptionalDefaults[];
  experience: ExperienceOptionalDefaults[];
  certificates: CertificateOptionalDefaults[];
  Score: ScoreOptionalDefaults[]?;
}

export interface JobCardProps {
  id: string;
  company_name: string;
  company_address: string;
  job_title: string;
  industry_field: string;
  description: string;
  qualifications: Array<{ requirement: string; categories: string[] }>;
  score: number;
}
