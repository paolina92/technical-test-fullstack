import Cookies from "js-cookie";

// Centralizes auth header construction for every api/ function.
// - Always includes Accept: application/json.
// - Adds Authorization: Bearer <token> if the user-token cookie exists.

export const buildHeaders = (
  extra: Record<string, string> = {},
): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...extra,
  };

  const bearer = Cookies.get("user-token");
  if (bearer) headers["Authorization"] = `Bearer ${bearer}`;

  return headers;
};
