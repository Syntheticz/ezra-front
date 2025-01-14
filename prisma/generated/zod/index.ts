import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','password','role','createdAt','updatedAt']);

export const AccountScalarFieldEnumSchema = z.enum(['userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state','createdAt','updatedAt']);

export const SessionScalarFieldEnumSchema = z.enum(['sessionToken','userId','expires','createdAt','updatedAt']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);

export const AuthenticatorScalarFieldEnumSchema = z.enum(['credentialID','userId','providerAccountId','credentialPublicKey','counter','credentialDeviceType','credentialBackedUp','transports']);

export const JobScalarFieldEnumSchema = z.enum(['id','jobTitle','description','postedDate','location']);

export const IndustryFieldScalarFieldEnumSchema = z.enum(['id','name','jobId']);

export const QualificationScalarFieldEnumSchema = z.enum(['id','requirement','priority','jobId']);

export const PriorityCategoryScalarFieldEnumSchema = z.enum(['id','categoryId','jobId']);

export const PossibleCredentialScalarFieldEnumSchema = z.enum(['id','credential','qualificationId']);

export const CategoryScalarFieldEnumSchema = z.enum(['id','name']);

export const UserInputScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','firstName','middleName','lastName','isVerified','userId']);

export const EducationScalarFieldEnumSchema = z.enum(['id','degree','userInputId']);

export const SkillScalarFieldEnumSchema = z.enum(['id','name','userInputId']);

export const ExperienceScalarFieldEnumSchema = z.enum(['id','description','userInputId']);

export const CertificateScalarFieldEnumSchema = z.enum(['id','title','userInputId']);

export const ScoreScalarFieldEnumSchema = z.enum(['id','score','jobId','userInputId']);

export const QualificationCategoryScalarFieldEnumSchema = z.enum(['id','qualificationId','categoryId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
  password: z.string(),
  role: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

// USER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Account = z.infer<typeof AccountSchema>

// ACCOUNT OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const AccountOptionalDefaultsSchema = AccountSchema.merge(z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type AccountOptionalDefaults = z.infer<typeof AccountOptionalDefaultsSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

// SESSION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const SessionOptionalDefaultsSchema = SessionSchema.merge(z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type SessionOptionalDefaults = z.infer<typeof SessionOptionalDefaultsSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

// VERIFICATION TOKEN OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const VerificationTokenOptionalDefaultsSchema = VerificationTokenSchema.merge(z.object({
}))

export type VerificationTokenOptionalDefaults = z.infer<typeof VerificationTokenOptionalDefaultsSchema>

/////////////////////////////////////////
// AUTHENTICATOR SCHEMA
/////////////////////////////////////////

export const AuthenticatorSchema = z.object({
  credentialID: z.string(),
  userId: z.string(),
  providerAccountId: z.string(),
  credentialPublicKey: z.string(),
  counter: z.number().int(),
  credentialDeviceType: z.string(),
  credentialBackedUp: z.boolean(),
  transports: z.string().nullable(),
})

export type Authenticator = z.infer<typeof AuthenticatorSchema>

// AUTHENTICATOR OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const AuthenticatorOptionalDefaultsSchema = AuthenticatorSchema.merge(z.object({
}))

export type AuthenticatorOptionalDefaults = z.infer<typeof AuthenticatorOptionalDefaultsSchema>

/////////////////////////////////////////
// JOB SCHEMA
/////////////////////////////////////////

export const JobSchema = z.object({
  id: z.string().uuid(),
  jobTitle: z.string(),
  description: z.string().nullable(),
  postedDate: z.coerce.date(),
  location: z.string().nullable(),
})

export type Job = z.infer<typeof JobSchema>

// JOB OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const JobOptionalDefaultsSchema = JobSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type JobOptionalDefaults = z.infer<typeof JobOptionalDefaultsSchema>

/////////////////////////////////////////
// INDUSTRY FIELD SCHEMA
/////////////////////////////////////////

export const IndustryFieldSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  jobId: z.string(),
})

export type IndustryField = z.infer<typeof IndustryFieldSchema>

// INDUSTRY FIELD OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const IndustryFieldOptionalDefaultsSchema = IndustryFieldSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type IndustryFieldOptionalDefaults = z.infer<typeof IndustryFieldOptionalDefaultsSchema>

/////////////////////////////////////////
// QUALIFICATION SCHEMA
/////////////////////////////////////////

export const QualificationSchema = z.object({
  id: z.string().uuid(),
  requirement: z.string(),
  priority: z.boolean(),
  jobId: z.string(),
})

export type Qualification = z.infer<typeof QualificationSchema>

// QUALIFICATION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const QualificationOptionalDefaultsSchema = QualificationSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type QualificationOptionalDefaults = z.infer<typeof QualificationOptionalDefaultsSchema>

/////////////////////////////////////////
// PRIORITY CATEGORY SCHEMA
/////////////////////////////////////////

export const PriorityCategorySchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string(),
  jobId: z.string(),
})

export type PriorityCategory = z.infer<typeof PriorityCategorySchema>

// PRIORITY CATEGORY OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const PriorityCategoryOptionalDefaultsSchema = PriorityCategorySchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type PriorityCategoryOptionalDefaults = z.infer<typeof PriorityCategoryOptionalDefaultsSchema>

/////////////////////////////////////////
// POSSIBLE CREDENTIAL SCHEMA
/////////////////////////////////////////

export const PossibleCredentialSchema = z.object({
  id: z.string().uuid(),
  credential: z.string(),
  qualificationId: z.string(),
})

export type PossibleCredential = z.infer<typeof PossibleCredentialSchema>

// POSSIBLE CREDENTIAL OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const PossibleCredentialOptionalDefaultsSchema = PossibleCredentialSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type PossibleCredentialOptionalDefaults = z.infer<typeof PossibleCredentialOptionalDefaultsSchema>

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export type Category = z.infer<typeof CategorySchema>

// CATEGORY OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CategoryOptionalDefaultsSchema = CategorySchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type CategoryOptionalDefaults = z.infer<typeof CategoryOptionalDefaultsSchema>

/////////////////////////////////////////
// USER INPUT SCHEMA
/////////////////////////////////////////

export const UserInputSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  isVerified: z.boolean(),
  userId: z.string().nullable(),
})

export type UserInput = z.infer<typeof UserInputSchema>

// USER INPUT OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const UserInputOptionalDefaultsSchema = UserInputSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isVerified: z.boolean().optional(),
}))

export type UserInputOptionalDefaults = z.infer<typeof UserInputOptionalDefaultsSchema>

/////////////////////////////////////////
// EDUCATION SCHEMA
/////////////////////////////////////////

export const EducationSchema = z.object({
  id: z.string().uuid(),
  degree: z.string(),
  userInputId: z.string(),
})

export type Education = z.infer<typeof EducationSchema>

// EDUCATION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const EducationOptionalDefaultsSchema = EducationSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type EducationOptionalDefaults = z.infer<typeof EducationOptionalDefaultsSchema>

/////////////////////////////////////////
// SKILL SCHEMA
/////////////////////////////////////////

export const SkillSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  userInputId: z.string(),
})

export type Skill = z.infer<typeof SkillSchema>

// SKILL OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const SkillOptionalDefaultsSchema = SkillSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type SkillOptionalDefaults = z.infer<typeof SkillOptionalDefaultsSchema>

/////////////////////////////////////////
// EXPERIENCE SCHEMA
/////////////////////////////////////////

export const ExperienceSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  userInputId: z.string(),
})

export type Experience = z.infer<typeof ExperienceSchema>

// EXPERIENCE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ExperienceOptionalDefaultsSchema = ExperienceSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type ExperienceOptionalDefaults = z.infer<typeof ExperienceOptionalDefaultsSchema>

/////////////////////////////////////////
// CERTIFICATE SCHEMA
/////////////////////////////////////////

export const CertificateSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  userInputId: z.string(),
})

export type Certificate = z.infer<typeof CertificateSchema>

// CERTIFICATE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CertificateOptionalDefaultsSchema = CertificateSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type CertificateOptionalDefaults = z.infer<typeof CertificateOptionalDefaultsSchema>

/////////////////////////////////////////
// SCORE SCHEMA
/////////////////////////////////////////

export const ScoreSchema = z.object({
  id: z.string().uuid(),
  score: z.number().int(),
  jobId: z.string(),
  userInputId: z.string(),
})

export type Score = z.infer<typeof ScoreSchema>

// SCORE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ScoreOptionalDefaultsSchema = ScoreSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type ScoreOptionalDefaults = z.infer<typeof ScoreOptionalDefaultsSchema>

/////////////////////////////////////////
// QUALIFICATION CATEGORY SCHEMA
/////////////////////////////////////////

export const QualificationCategorySchema = z.object({
  id: z.string().uuid(),
  qualificationId: z.string(),
  categoryId: z.string(),
})

export type QualificationCategory = z.infer<typeof QualificationCategorySchema>

// QUALIFICATION CATEGORY OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const QualificationCategoryOptionalDefaultsSchema = QualificationCategorySchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type QualificationCategoryOptionalDefaults = z.infer<typeof QualificationCategoryOptionalDefaultsSchema>
