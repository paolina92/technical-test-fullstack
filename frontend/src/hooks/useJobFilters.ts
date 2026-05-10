import { useSearchParams } from "react-router-dom";

import { JobFiltersSchema, type JobFilters } from "../schemas/job";

const FILTER_KEYS = ["q", "location", "contract_type", "work_mode"] as const;

// Keeps the search filters in the URL: shareable links, browser back/forward
// works, and a refresh does not lose the user's filters.
export function useJobFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const raw = Object.fromEntries(
    FILTER_KEYS.map((k) => [k, searchParams.get(k) ?? undefined]),
  );
  const parsed = JobFiltersSchema.safeParse(raw);
  const filters: JobFilters = parsed.success ? parsed.data : {};

  const setFilter = (key: keyof JobFilters, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const clear = () => {
    const next = new URLSearchParams(searchParams);
    FILTER_KEYS.forEach((k) => next.delete(k));
    setSearchParams(next, { replace: true });
  };

  return { filters, setFilter, clear };
}
