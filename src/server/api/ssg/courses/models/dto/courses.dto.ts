import z from "zod";

const taggingCodeValues = [
  "1",
  "2",
  "40",
  "30011",
  "30012",
  "30013",
  "30021",
  "30022",
  "30031",
  "30032",
  "30033",
  "30041",
  "30042",
  "30043",
  "30051",
  "30052",
  "30053",
  "30061",
  "30062",
  "30063",
  "30071",
  "30072",
  "30073",
  "30081",
  "30082",
  "30083",
  "9001",
  "9002",
  "FULL",
] as const;

const taggingCodeSchema = z.enum(taggingCodeValues);

const courseSupportEndDateSchema = z
  .string()
  .regex(/^\d{8}$/, "courseSupportEndDate must be in YYYYMMDD format")
  .optional();

const retrieveTypeSchema = z.enum(["FULL", "DELTA"]);

const lastUpdateDateSchema = z
  .string()
  .regex(/^\d{8}$/, "lastUpdateDate must be in YYYYMMDD format");

export const GetAllCoursesRequestDto = z
  .object({
    pageSize: z.coerce.number().int().positive().default(10),
    page: z.coerce.number().int().default(0),
    keyword: z.string().min(3, "Keyword must be at least 3 characters").optional(),
    taggingCodes: z
      .union([
        taggingCodeSchema,
        z.array(taggingCodeSchema),
        z
          .string()
          .transform((val) => {
            if (val === "FULL") return "FULL";
            const codes = val.split(",").map((code) => code.trim());
            return codes.length === 1 ? codes[0] : codes;
          })
          .pipe(z.union([taggingCodeSchema, z.array(taggingCodeSchema).min(1)])),
      ])
      .optional(),
    courseSupportEndDate: courseSupportEndDateSchema,
    retrieveType: retrieveTypeSchema.optional(),
    lastUpdateDate: lastUpdateDateSchema.optional(),
  })
  .refine(
    (data) => {
      const hasKeyword = data.keyword !== undefined && data.keyword !== "";
      const hasTaggingCodes =
        data.taggingCodes !== undefined &&
        (Array.isArray(data.taggingCodes) ? data.taggingCodes.length > 0 : true);
      return !(hasKeyword && hasTaggingCodes);
    },
    {
      message: "Keyword and taggingCodes cannot be used together in the same query",
    },
  )
  .refine(
    (data) => {
      const hasTaggingCodes =
        data.taggingCodes !== undefined &&
        (Array.isArray(data.taggingCodes) ? data.taggingCodes.length > 0 : true);
      if (hasTaggingCodes) {
        return data.retrieveType !== undefined;
      }
      return true;
    },
    {
      message: "retrieveType is mandatory when taggingCodes is provided",
      path: ["retrieveType"],
    },
  )
  .refine(
    (data) => {
      if (data.retrieveType === "DELTA") {
        return data.lastUpdateDate !== undefined;
      }
      return true;
    },
    {
      message: "lastUpdateDate is mandatory when retrieveType is DELTA",
      path: ["lastUpdateDate"],
    },
  );
