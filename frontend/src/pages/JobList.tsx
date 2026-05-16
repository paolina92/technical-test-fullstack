import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "welcome-ui/Button";
import { Loader } from "welcome-ui/Loader";
import { Text } from "welcome-ui/Text";

import { logout } from "../api/logout";
import { AuthHeader } from "../components/AuthHeader";
import { JobCard } from "../components/JobCard";
import { JobSearchBar } from "../components/JobSearchBar";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useJobFilters } from "../hooks/useJobFilters";
import { useJobsQuery } from "../hooks/useJobsQuery";

export const JobList = () => {
  const navigate = useNavigate();
  const { user, hasBearerToken, clear: clearUser } = useCurrentUser();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore logout errors, still clear local state
    }
    clearUser();
    navigate("/signin");
  };

  // Search: local input mirrors typing instantly, debounced value drives
  // the URL sync and the query so the network does not fire on every keystroke.
  const { filters, setFilter, clear } = useJobFilters();
  const [qInput, setQInput] = useState(filters.q ?? "");
  const debouncedQ = useDebouncedValue(qInput);

  const [locationInput, setLocationInput] = useState(filters.location ?? "");
  const debouncedLocation = useDebouncedValue(locationInput);

  useEffect(() => {
    setFilter("q", debouncedQ || undefined);
  }, [debouncedQ, setFilter]);

  useEffect(() => {
    setFilter("location", debouncedLocation || undefined);
  }, [debouncedLocation, setFilter]);

  const effectiveFilters = {
    ...filters,
    q: debouncedQ || undefined,
    location: debouncedLocation || undefined,
  };
  const { jobs, isLoading, isError, isFetching } =
    useJobsQuery(effectiveFilters);

  // Hide drafts from unauthenticated users. This is a client-side guard;
  // a proper fix belongs on the backend (filter status=published in the
  // public scope). See README "Trade-offs" for the follow-up plan.
  const visibleJobs = user ? jobs : jobs.filter((j) => j.status !== "draft");

  const handleClear = () => {
    setQInput("");
    setLocationInput("");
    clear();
  };

  return (
    <div className="p-xl max-w-1200 my-0 mx-auto">
      <title>Job Listings — ATS</title>
      <div className="flex items-center justify-between mb-lg">
        <Text variant="heading-xl">Job Listings</Text>
        <AuthHeader
          hasBearerToken={hasBearerToken}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      <JobSearchBar
        filters={filters}
        qInput={qInput}
        onQChange={setQInput}
        locationInput={locationInput}
        onLocationChange={setLocationInput}
        setFilter={setFilter}
        clear={handleClear}
      />

      {isLoading ? (
        <div className="flex justify-center py-xl">
          <Loader />
        </div>
      ) : isError ? (
        <Text color="red">Failed to load jobs. Please try again.</Text>
      ) : (
        <>
          <div
            className="flex items-center justify-between mb-md"
            aria-live="polite"
          >
            <Text variant="body-sm">
              {visibleJobs.length === 0
                ? "No jobs match your filters"
                : `${visibleJobs.length} job${visibleJobs.length > 1 ? "s" : ""}`}
              {isFetching && " · refreshing..."}
            </Text>
            {user && (
              <Button as={Link} to="/jobs/new" size="sm">
                Create a new job
              </Button>
            )}
          </div>

          {visibleJobs.length === 0 ? (
            <div className="text-center py-xl">
              <Text variant="body-sm">
                Try clearing some filters or changing your search.
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              {visibleJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
