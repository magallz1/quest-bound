import { makeVar } from "@apollo/client/core/index.js";
import { useReactiveVar } from "@apollo/client/react/index.js";
import { useEffect, useState } from "react";

const tokenVar = makeVar<string | null>(null);

/**
 * For non-auth use cases, this simply returns the user ID set in local storage. When the server is
 * set to not require authentication, it expects the user ID passed as an auth token.
 *
 * For auth use cases, you'll want to pull a token from cookies depending on your auth strategy.
 */
export const useSessionToken = () => {
  const token = useReactiveVar(tokenVar);

  useEffect(() => {
    const existingToken = localStorage.getItem("questbound-user-id");
    if (existingToken) {
      tokenVar(existingToken);
    }
  }, []);

  const setToken = (_token: string | null) => {
    tokenVar(_token);

    if (_token) {
      localStorage.setItem("questbound-user-id", _token);
    } else {
      localStorage.removeItem("questbound-user-id");
    }
  };

  return {
    token,
    setToken,
    session: null,
  };
};
