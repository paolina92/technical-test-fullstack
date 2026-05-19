import Cookies from "js-cookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../api/me";

export function useCurrentUser() {
  const hasBearerToken = Boolean(Cookies.get("user-token"));
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    enabled: hasBearerToken,
  });

  const clear = () => {
    queryClient.removeQueries({ queryKey: ["me"] });
  };

  return { user: user ?? null, hasBearerToken, clear };
}
