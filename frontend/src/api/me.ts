import { CurrentUserResponseSchema, type CurrentUser } from "../schemas/user";
import { buildHeaders } from "./_headers";

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  const res = await fetch("/api/me", {
    credentials: "include",
    headers: buildHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch current user: ${res.status}`);
  }

  const json: unknown = await res.json();
  return CurrentUserResponseSchema.parse(json).data;
};
