import {
  JobsResponseSchema,
  type JobFilters,
  type JobsResponse,
} from "../schemas/job";
import { buildHeaders } from "./_headers";

export const getJobs = async (
  filters: JobFilters = {},
): Promise<JobsResponse> => {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.location) params.set("location", filters.location);
  if (filters.contract_type) params.set("contract_type", filters.contract_type);
  if (filters.work_mode) params.set("work_mode", filters.work_mode);

  const query = params.toString();
  const url = query ? `/api/jobs?${query}` : "/api/jobs";

  const res = await fetch(url, { headers: buildHeaders() });
  if (!res.ok) {
    throw new Error(`Failed to fetch jobs: ${res.status}`);
  }

  const json: unknown = await res.json();
  return JobsResponseSchema.parse(json);
};
