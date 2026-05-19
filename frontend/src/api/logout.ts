import Cookies from "js-cookie";

import { buildHeaders } from "./_headers";

export const logout = async (): Promise<void> => {
  const res = await fetch("/api/logout", {
    method: "DELETE",
    headers: buildHeaders(),
  });

  if (!res.ok) {
    throw new Error("Sign out failed");
  }

  Cookies.remove("user-token");

  return;
};
