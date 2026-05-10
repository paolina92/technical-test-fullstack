import { z } from "zod";

export const ContractTypeSchema = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "TEMPORARY",
  "FREELANCE",
  "INTERNSHIP",
  "APPRENTICESHIP",
  "VIE",
]);
export type ContractType = z.infer<typeof ContractTypeSchema>;

export const WorkModeSchema = z.enum(["onsite", "remote", "hybrid"]);
export type WorkMode = z.infer<typeof WorkModeSchema>;

export const JobStatusSchema = z.enum([
  "draft",
  "published",
  "filled",
  "archived",
  "cancelled",
]);
export type JobStatus = z.infer<typeof JobStatusSchema>;

export const JobSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  contract_type: ContractTypeSchema,
  office: z.string(),
  status: JobStatusSchema,
  work_mode: WorkModeSchema,
  profession_id: z.number().nullable(),
  inserted_at: z.string(),
  updated_at: z.string(),
});
export type Job = z.infer<typeof JobSchema>;

export const JobsResponseSchema = z.object({
  data: z.array(JobSchema),
});
export type JobsResponse = z.infer<typeof JobsResponseSchema>;

export const JobFiltersSchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  contract_type: ContractTypeSchema.optional(),
  work_mode: WorkModeSchema.optional(),
});
export type JobFilters = z.infer<typeof JobFiltersSchema>;
