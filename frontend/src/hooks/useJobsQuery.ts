import { useQuery } from "@tanstack/react-query";

import { getJobs } from "../api/jobs";
import type { JobFilters } from "../schemas/job";

export function useJobsQuery(filters: JobFilters) {
  const query = useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => getJobs(filters),
    placeholderData: (prev) => prev,
  });

  return {
    jobs: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
  };
}
