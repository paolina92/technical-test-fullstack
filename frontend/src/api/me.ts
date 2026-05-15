import Cookies from "js-cookie";

import { CurrentUserResponseSchema, type CurrentUser } from "../schemas/user";

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  const csrfToken = Cookies.get("technical-test-csrf-token");
  const bearerToken = Cookies.get("user-token");

  const res = await fetch("/api/me", {
    credentials: "include",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${bearerToken}`,
      ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch current user: ${res.status}`);
  }

  const json: unknown = await res.json();
  return CurrentUserResponseSchema.parse(json).data;
};
