import { EnvContext } from "@/libs/compass-web-utils";
import { useCallback, useContext } from "react";
import { useCurrentUser } from "./use-current-user";

interface UseSignOut {
  signOut: () => void;
}

export const useSignOut = (): UseSignOut => {
  const { revokeCurrentUser } = useCurrentUser();
  const { domain } = useContext(EnvContext);

  const signOut = useCallback(async () => {
    localStorage.removeItem("last-viewed-ruleset-id");
    revokeCurrentUser();
    window.location.href = domain;
  }, []);

  return {
    signOut,
  };
};
