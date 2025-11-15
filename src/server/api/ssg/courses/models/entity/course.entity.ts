import { z } from "zod";
import { deepNullableOptional } from "../../../lib/zod";

/* ---------------------------- Reusable Schemas ---------------------------- */

const MetaSchema = z.object({
  createBy: z.string(),
  updateBy: z.string(),
  createDate: z.string(),
  updateDate: z.string(),
});

const FeeSchema = z.object({
  id: z.number(),
  meta: MetaSchema,
  feeType: z.string(),
  feeUpdateDate: z.number(),
  feeTypeEffectiveDate: z.number(),
});

const CourseVacancySchema = z.object({
  code: z.string(),
  description: z.string(),
});

const ScheduleInfoTypeSchema = z.object({
  code: z.string(),
  description: z.string(),
});

const RunSchema = z.object({
  id: z.number(),
  room: z.string(),
  unit: z.string(),
  block: z.string(),
  floor: z.string(),
  street: z.string(),
  deleted: z.boolean(),
  building: z.string(),
  intakeSize: z.number(),
  postalCode: z.string(),
  scheduleInfo: z.string(),
  courseEndDate: z.coerce.string(),
  courseVacancy: CourseVacancySchema,
  modeOfTraining: z.string(),
  courseStartDate: z.number(),
  organizationKey: z.string(),
  referenceNumber: z.string(),
  courseAdminEmail: z.string(),
  scheduleInfoType: ScheduleInfoTypeSchema,
  wheelChairAccess: z.boolean(),
  registrationClosingDate: z.number(),
  registrationOpeningDate: z.number(),
});

const TagSchema = z.object({
  text: z.string(),
  count: z.number(),
});

const StatusSchema = z.object({
  code: z.string(),
  description: z.string(),
});

const BundleSchema = z.object({
  code: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string(),
  referenceNumber: z.string(),
});

const ClusterSchema = z.object({
  code: z.string(),
  description: z.string(),
});

const ModuleSchema = z.object({
  title: z.string(),
  referenceNumber: z.string(),
});

const RatingSchema = z.object({
  average: z.number(),
  starsRating: z.number(),
});

const OutcomeSchema = z.object({
  meta: MetaSchema,
  overallOutcome: RatingSchema,
  numberOfRespondents: z.number(),
});

const QualitySchema = z.object({
  meta: MetaSchema,
  overallQuality: RatingSchema,
  numberOfRespondents: z.number(),
});

const SectorSchema = z.object({
  code: z.string(),
  description: z.string(),
});

const SupportPeriodSchema = z.object({
  to: z.coerce.string(),
  from: z.coerce.string(),
  taggingCode: z.string(),
  taggingDescription: z.string(),
});

const SupportSchema = z.object({
  meta: MetaSchema,
  period: SupportPeriodSchema,
  deleted: z.boolean(),
  support: z.string(),
  category: z.string(),
  detailsId: z.number(),
  effectiveDate: z.number(),
  referenceNumber: z.string(),
});

const BrochureSchema = z.object({
  id: z.number(),
  url: z.string(),
  name: z.string(),
  organizationKey: z.string(),
});

const CategorySchema = z.object({
  code: z.string(),
  description: z.string(),
});

const JobRoleSchema = z.object({
  code: z.string(),
  title: z.string(),
  typeId: z.number(),
  sectorUri: z.string(),
  jobRoleUri: z.string(),
  sectorCode: z.string(),
  salaryRange: z.string(),
  sectorDescription: z.string(),
});

const TaggingSchema = z.object({
  code: z.string(),
  description: z.string(),
});

const ContactPersonSchema = z.object({
  id: z.string(),
  meta: MetaSchema,
  role: z.string(),
  email: z.object({
    full: z.string(),
    atSign: z.string(),
    domain: z.string(),
    localPart: z.string(),
  }),
  fullName: z.string(),
  telephone: z.object({
    number: z.number(),
    areaCode: z.number(),
    countryCode: z.number(),
    internationalPrefix: z.string(),
  }),
  salutation: z.string(),
  designation: z.string(),
});

const ProgrammeTypeSchema = z.object({
  code: z.number(),
  description: z.string(),
});

const WSQFrameworkSchema = z.object({
  wsqFrameworkCode: z.string(),
  competencyStandardCode: z.string(),
  wsqFrameworkDescription: z.string(),
  competencyStandardDescription: z.string(),
});

/* --------------------- Complex Sub-schemas for Provider ------------------- */

const ProviderAddressSchema = z.object({
  id: z.number(),
  uen: z.string(),
  meta: MetaSchema,
  unit: z.string(),
  block: z.string(),
  floor: z.string(),
  street: z.string(),
  typeId: z.number(),
  building: z.string(),
  postalCode: z.string(),
});

const ProviderTelephoneSchema = z.object({
  id: z.number(),
  uen: z.string(),
  meta: MetaSchema,
  typeId: z.string(),
  telephone: z.object({
    number: z.number(),
    areaCode: z.number(),
    countryCode: z.number(),
    internationalPrefix: z.string(),
  }),
});

const ForeignAddressSchema = z.object({
  id: z.number(),
  uen: z.string(),
  meta: MetaSchema,
  typeId: z.string(),
  address1: z.string(),
  address2: z.string(),
  countryCode: z.string(),
});

const ProviderOutcomeArea = z.object({
  meta: MetaSchema,
  average: z.number(),
  starsRating: z.number(),
  areaOfTraining: z.string(),
  numberOfRespondents: z.number(),
});

const ProviderOutcomeSchema = z.object({
  meta: MetaSchema,
  outcomeAreas: z.array(ProviderOutcomeArea),
  overallOutcome: RatingSchema,
  numberOfRespondents: z.number(),
});

const ProviderQualityAreaSchema = z.object({
  meta: MetaSchema,
  starsRating: z.number(),
  averageRating: z.number(),
  areaOfTraining: z.string(),
  numberOfRespondents: z.number(),
});

const ProviderQualitySchema = z.object({
  qualityAreas: z.array(ProviderQualityAreaSchema),
  overallQuality: RatingSchema,
  numberOfRespondents: z.number(),
});

const TrainingProviderSchema = z.object({
  uen: z.string(),
  code: z.string(),
  meta: MetaSchema,
  name: z.string(),
  ssic: z.object({
    primaryCode: z.string(),
    secondaryCode: z.string(),
  }),
  type: z.string(),
  email: z.string(),
  value: z.string(),
  active: z.boolean(),
  vision: z.string(),
  aboutUs: z.string(),
  address: z.array(ProviderAddressSchema),
  deleted: z.boolean(),
  mission: z.string(),
  outcome: ProviderOutcomeSchema,
  quality: ProviderQualitySchema,
  "3rdParty": z.boolean(),
  tripartite: z.boolean(),
  websiteUrl: z.string(),
  brandmessage: z.string(),
  logoFilename: z.string(),
  notification: z.object({
    jobPostExpired: z.boolean(),
    applicationReceived: z.boolean(),
  }),
  contactNumber: z.array(ProviderTelephoneSchema),
  bannerFilename: z.string(),
  foreignAddress: ForeignAddressSchema,
  socialMediaURL: z.string(),
  numberOfEmployees: z.number(),
  yearOfEstablishment: z.number(),
  employerBrandMessage: z.string(),
  emailSubscriptionCode: z.string(),
  acraRegistrationStatus: z.string(),
  supportingGovermentAgency: z.string(),
  registrationTypeDescription: z.string(),
  employmentAgencyLicenseNumber: z.string(),
});

/* ---------------------------- Statistics Schema --------------------------- */

const StatisticsSummarySchema = z.object({
  pageViewCount: z.number(),
  courseClaimCount: z.number(),
  courseReferenceNumber: z.string(),
});

/* ------------------------ Core Course Schema ------------------------ */

const CourseSchema = z.object({
  url: z.string(),
  fees: z.array(FeeSchema),
  meta: MetaSchema,
  runs: z.array(RunSchema),
  tags: z.array(TagSchema),
  view: z.object({
    code: z.string(),
    description: z.string(),
  }),
  title: z.string(),
  status: StatusSchema,
  tpCode: z.string(),
  bundles: z.array(BundleSchema),
  cluster: ClusterSchema,
  content: z.string(),
  modules: z.array(ModuleSchema),
  newFlag: z.boolean(),
  outcome: OutcomeSchema,
  quality: QualitySchema,
  sectors: z.array(SectorSchema),
  seoName: z.string(),
  support: z.array(SupportSchema),
  brochure: BrochureSchema,
  category: CategorySchema,
  jobRoles: z.array(JobRoleSchema),
  taggings: z.array(TaggingSchema),
  videoUrl: z.string(),
  jobLevels: z.array(
    z.object({
      code: z.number(),
      description: z.string(),
    }),
  ),
  objective: z.string(),
  deleteFlag: z.boolean(),
  enquiryUrl: z.string(),
  examinable: z.string(),
  feeSubsidy: z.number(),
  description: z.string(),
  disbursedTo: z.string(),
  facultyName: z.string(),
  initiatives: z.string(),
  popularFlag: z.boolean(),
  redirectUrl: z.boolean(),
  featuredFlag: z.boolean(),
  masterSource: z.string(),
  tileImageURL: z.string(),
  uniqueSkills: z.array(
    z.object({
      type: z.string(),
      tgsId: z.string(),
      title: z.string(),
      skillTag: z.string(),
      seaSource: z.string(),
    }),
  ),
  attributeTags: z.array(
    z.object({
      code: z.number(),
      type: z.string(),
      description: z.string(),
    }),
  ),
  contactPerson: z.array(ContactPersonSchema),
  programmeType: ProgrammeTypeSchema,
  wsqFrameworks: z.array(WSQFrameworkSchema),
  detailImageURL: z.string(),
  specialisation: z.string(),
  areaOfTrainings: z.array(
    z.object({
      code: z.string(),
      description: z.string(),
    }),
  ),
  eduOfTargetAuds: z.array(
    z.object({
      code: z.string(),
      description: z.string(),
    }),
  ),
  fieldOfStudies1: z.array(
    z.object({
      code: z.string(),
      description: z.string(),
    }),
  ),
  fieldOfStudies2: z.array(
    z.object({
      code: z.string(),
      description: z.string(),
    }),
  ),
  learningPathway: z.string(),
  modeOfTrainings: z.array(
    z.object({
      code: z.string(),
      description: z.string(),
    }),
  ),
  petOrganization: z.boolean(),
  referenceNumber: z.string(),
  registrationUrl: z.string(),
  displayImageName: z.string(),
  entryRequirement: z.string(),
  skillsFrameworks: z.array(z.any()), // Could be detailed further if needed
  trainingProvider: TrainingProviderSchema,
  statisticsSummary: StatisticsSummarySchema,
  methodOfDeliveries: z.array(
    z.object({
      code: z.string(),
      description: z.string(),
    }),
  ),
  locationOfTrainings: z.array(
    z.object({
      code: z.number(),
      description: z.string(),
    }),
  ),
  numberOfTrainingDay: z.number(),
  redirectRegisterUrl: z.boolean(),
  mediumOfInstructions: z.array(
    z.object({
      code: z.string(),
      description: z.string(),
    }),
  ),
  targetTrainingGroups: z.array(
    z.object({
      code: z.number(),
      description: z.string(),
    }),
  ),
  qualificationAttained: z.object({
    code: z.string(),
    description: z.string(),
  }),
  trainingProviderAlias: z.string(),
  lengthOfCourseDuration: z.number(),
  publicFundingIndicator: z.object({
    code: z.string(),
    description: z.string(),
  }),
  shownCourseDescription: z.boolean(),
  targetWorkforceSegment: z.object({
    code: z.string(),
    description: z.string(),
  }),
  externalReferenceNumber: z.string(),
  totalTrainingDurationHour: z.number(),
  minimumEducationRequirements: z.object({
    code: z.string(),
    description: z.string(),
  }),
  skillsConnectReferenceNumber: z.string(),
  totalCostOfTrainingPerTrainee: z.number(),
  skillsFutureCreditReferenceNumber: z.number(),
});

/* ---------------------------- Root Response ---------------------------- */

export const GetAllCoursesApiResponse = deepNullableOptional(
  z.object({
    data: z.object({
      meta: z.object({
        total: z.number(),
      }),
      courses: z.array(CourseSchema),
    }),
    status: z.number(),
  }),
);
