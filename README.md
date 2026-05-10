# Technical Test for Frontend Developer - Application Tracking System

Welcome to the Frontend Developer Job Application Tracking System!

This application is a simplified job board.
An unregistered user is able to list all jobs and can apply to a job.
It provides a platform to manage job offers and track candidate information.

A registered user can create, edit, and delete job offers.
On each job offer, a registered user can see the list of candidates who have applied to the job.

## Repository Structure

This is a monorepo containing both frontend and backend:

- **Frontend (`/frontend`):** React 19 application with TypeScript
- **Backend (root):** Phoenix/Elixir REST API

## Installation

1. Clone the repository
2. Navigate to the project directory: `cd technical-test-fullstack`
3. Install language versions and dependencies:

   We suggest you use asdf (or another version manager) to manage Erlang, Elixir and Node versions.

   To install asdf, visit <http://asdf-vm.com/guide/getting-started.html>.

   Add the required plugins:

   ```bash
   asdf plugin add erlang https://github.com/asdf-vm/asdf-erlang.git
   asdf plugin add elixir https://github.com/asdf-vm/asdf-elixir.git
   asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
   ```

   Then install the versions specified in the `.tool-versions` file:

   ```bash
   asdf install
   ```

   You can now install the Elixir dependencies:

   ```bash
   mix deps.get
   ```

4. Set up the database and update the configuration in `config/dev.exs` or start a Docker container with the `docker-compose.yml` file included in the project.
5. Create and migrate the database: `mix ecto.setup`
6. Run the tests: `mix test`
7. Start the Phoenix server: `mix phx.server`
8. Frontend Setup:

   ```bash
   cd frontend
   corepack enable
   yarn install
   yarn dev  # Starts on http://localhost:5173
   ```

## Exercise

We are glad to introduce you to this technical test which will help us better understand your skills and competencies related to our tech stack. In this exercise, we will use our in-house built Applicant Tracking System (ATS) application developed with React and Phoenix Elixir.

The goal of this test is to simulate a real-world scenario where you will need to add a new feature to an existing application.
Your work will be evaluated based on your approach, your understanding of the problem and the quality of your code.

You need to implement a **Job search function** !

That new feature must allow all users to search for jobs. This should allow users to search using various parameters like job title, location, work mode, etc. You can extend this requirement to anything that makes sense for this project. You will have to implement the backend functionality (vibe coding only is ok!).

## Evaluation Criteria

**Frontend**

- React best practices and component architecture
- Proper use of hooks and state management
- Code organization and reusability
- UI/UX quality with welcome-ui
- Testing quality and coverage
- TypeScript usage and type safety
- Search functionality is done on the backend (vibe-code)

**Overall**

- Git commit history and messages
- Code documentation and comments
- Problem-solving approach
- Attention to requirements

## Notes

- Take your time and demonstrate your abilities
- Focus on code quality over quantity
- Don't hesitate to update the readme to explain your decisions and what you would have done if given more time
- Be transparent on LLM usage!
- If you run out of time, prioritize completing the required task over improving it
- You can add additional libraries if needed, but justify your choices

Happy coding and good luck!

---

# My implementation

Job search feature: free-text search on title/description plus filters on
location, contract type and work mode. State lives in the URL so a search
is shareable, refresh-safe, and back/forward works.

**Live demo (front + back local):** `yarn start` from the root, then
`http://localhost:5173`.

## Stack additions (front)

- **`@tanstack/react-query`** — handles the data fetching, the cache, and the loading / error states. The original `JobList` was doing all of this by hand with `useState` + `fetch` + `useEffect`.
- **`zod`** — checks at runtime that the data coming back from the API matches the expected shape. TypeScript only catches mismatches at compile time; if the backend changes, the page would crash later with an unclear error. Same idea for the values read from the URL.
- **`msw`** — lets the integration test fake the backend. The test decides what `/api/jobs` returns, without needing a real server.

## Backend

Vibe-coded as the brief allowed. `GET /api/jobs` was extended with optional filters (`q`, `location`, `contract_type`, `work_mode`). Full contract documented in [`docs/API.md`](docs/API.md).

## Architecture

- `src/api/jobs.ts` — calls `/api/jobs`, validates the response with Zod, throws an error if the request fails or the data does not match the expected shape
- `src/schemas/job.ts` — single source of truth for Job, response and filter shapes
- `src/hooks/` — `useJobsQuery` (TanStack wrapper), `useJobFilters` (URL state), `useDebouncedValue`, `useCurrentUser` (cookie + `/api/me`)
- `src/components/` — `JobSearchBar`, `JobCard`, `AuthHeader` (UI only, no logic, easy to test on their own)
- `src/pages/JobList.tsx` — orchestrator (~110 lines, was 190 before the refactoring)
- `src/mocks/` — MSW handlers for the integration test

## Test strategy

- **Unit (`useDebouncedValue.test.ts`)** — pure logic with `vi.useFakeTimers`.
- **Integration (`JobList.integration.test.tsx`)** — full pipeline: render → MSW intercepts `/api/jobs` → user types → debounce fires → URL syncs → query refetches → filtered results show. One test covers the user interaction.

I focused the tests on the search flow because that is the feature being delivered, but I am not satisfied with the coverage. See the trade-offs below for what I would add with more time.

## Trade-offs assumed

- **Test coverage is thin.** Only one unit test (the debounce hook) and one integration test (the search flow on `JobList`). In an ideal world I would add: a unit test on every hook (`useJobFilters`, `useJobsQuery`, `useCurrentUser`), unit tests on `JobSearchBar` for each filter interaction, integration tests for the empty / error / loading states on `JobList`, and one Playwright e2e on the main user flow (search jobs, see results). The shape is right; only the volume is missing.
- **Drafts hidden client-side, not backend-side.** Quick guard in `JobList`. The right fix is to filter `status=published` on the backend side. I ran out of time to do it on the backend.
- **No e2e (Playwright)** — install + browser overhead too costly on a 2h budget. The integration test gives most of the e2e signal at a fraction of the cost.
- **Location is a free text input**, not a `Select` — I don't have a `/api/locations` endpoint to fetch distinct values.
- **No autocomplete/combobox** for the search field — proper combobox a11y is ~30-45 min and the brief did not require it.
- **Backend in vibe-code mode** as the brief allows — no Elixir tests for the new filter logic, the existing 47 still pass.
- **profession_id is `nullable`** in the Zod schema because the create form lets you skip it; better long-term would be to require it on creation.

## Improvements with more time

- Move draft filtering to the backend (proper visibility model).
- Add Playwright e2e on the search happy path.
- **Mutation testing with Stryker** to measure test quality (not just coverage). Coverage tells you a line ran; mutation testing tells you whether the assertion would catch a real bug.
- Auto-doc the API with `phoenix_swagger` (OpenAPI).
- Pagination on `/api/jobs` once the dataset grows past trivial.
- `axe` accessibility checks in CI.

## A11y notes

- Each filter is a `Field` (welcome-ui) so labels are properly associated with their controls.
- Result count is wrapped in `aria-live="polite"` so screen readers announce changes after each search.
- The search input is `type="search"` (native semantic + browser clear button).
- Tab order is logical: search → location → contract → mode → clear → results.

## AI usage (transparency)

Built with help from Claude (Anthropic).

- **Frontend** — fully owned. Architecture, trade-offs, and every decision are mine. Claude was used to accelerate scaffolding, surface alternatives I would not have considered alone, and challenge defaults. Each commit was reviewed and validated before landing; the commit history reflects an incremental, atomic, review-driven workflow.
- **Backend** — vibe coded, as the brief explicitly allows. My focus on the back was limited to a clean API contract (documented in `docs/API.md`) and working endpoints; I did not optimise the implementation.
