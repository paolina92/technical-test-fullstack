import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export type CurrentUser = { id: string; email: string };

export function useCurrentUser() {
  const [hasBearerToken, setHasBearerToken] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const csrfToken = Cookies.get("technical-test-csrf-token");
    const bearerToken = Cookies.get("user-token");
    setHasBearerToken(Boolean(bearerToken));

    if (!bearerToken) return;

    (async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${bearerToken}`,
            ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
          },
        });

        if (res.ok) {
          const body = await res.json().catch(() => ({}));
          setUser(body?.data ?? null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    })();
  }, []);

  const clear = () => {
    setUser(null);
    setHasBearerToken(false);
  };

  return { user, hasBearerToken, clear };
}
