import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JobList } from "./pages/JobList";
import { JobDetail } from "./pages/JobDetail";
import { CreateJob } from "./pages/CreateJob";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { SignOut } from "./pages/SignOut";
import { Apply } from "./pages/Apply";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { makeQueryClient } from "./lib/queryClient";

import "./index.css";

export const App = () => {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />

          <Route path="/" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/jobs/:jobId/apply" element={<Apply />} />
          <Route
            path="/jobs/new"
            element={
              <ProtectedRoute>
                <CreateJob />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
