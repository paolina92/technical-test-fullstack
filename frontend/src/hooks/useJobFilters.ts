import { useCallback } from "react";
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

  const setFilter = useCallback(
    (key: keyof JobFilters, value: string | undefined) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === undefined || value === "") {
            next.delete(key);
          } else {
            next.set(key, value);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clear = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        FILTER_KEYS.forEach((k) => next.delete(k));
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  return { filters, setFilter, clear };
}
