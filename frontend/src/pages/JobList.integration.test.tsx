import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { server } from "../mocks/server";
import { JobList } from "./JobList";

const backendJob = {
  id: 1,
  title: "Dev Backend",
  description: "Backend role",
  contract_type: "FULL_TIME",
  office: "Paris",
  status: "published",
  work_mode: "onsite",
  profession_id: 1,
  inserted_at: "2026-01-01T00:00:00",
  updated_at: "2026-01-01T00:00:00",
};

const reactJob = {
  id: 2,
  title: "Senior React Frontend",
  description: "Frontend role",
  contract_type: "FULL_TIME",
  office: "Paris",
  status: "published",
  work_mode: "remote",
  profession_id: 2,
  inserted_at: "2026-01-01T00:00:00",
  updated_at: "2026-01-01T00:00:00",
};

function renderJobList() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <JobList />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("JobList (integration)", () => {
  it("renders the jobs from the API and filters them when the user types", async () => {
    server.use(
      http.get("/api/jobs", ({ request }) => {
        const q = new URL(request.url).searchParams.get("q");
        if (q && q.toLowerCase().includes("react")) {
          return HttpResponse.json({ data: [reactJob] });
        }
        return HttpResponse.json({ data: [backendJob, reactJob] });
      }),
    );

    renderJobList();

    expect(await screen.findByText("Dev Backend")).toBeInTheDocument();
    expect(screen.getByText("Senior React Frontend")).toBeInTheDocument();

    await userEvent.type(
      screen.getByPlaceholderText("Search by title or description"),
      "react",
    );

    await waitFor(
      () => {
        expect(screen.queryByText("Dev Backend")).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
    expect(screen.getByText("Senior React Frontend")).toBeInTheDocument();
  });
});
