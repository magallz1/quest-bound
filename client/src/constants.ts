// These keys are not used when running locally.
export const SUPABASE_KEY = 'not-used';
export const SUPABASE_HOST = 'not-used';
export const COMPASS_KEY = 'not-used';

// export const API_ENDPOINT = 'http://localhost:8000';
// export const DOMAIN = 'http://localhost:5173';

// 1) Declare the global runtime config object
declare global {
  interface Window {
    _env_?: {
      VITE_API_ENDPOINT?: string;
      VITE_DOMAIN?:       string;
    };
  }
}

// 2) Helper to read runtime override → build‑time → default
function getEnvVar(key: 'VITE_API_ENDPOINT' | 'VITE_DOMAIN', fallback: string): string {
  return window._env_?.[key]        // from /env.js generated at container start
    ?? import.meta.env[key]         // baked in by Vite at build time
    ?? fallback;                    // ultimate fallback
}

// 3) Export endpoints using the loader
export const API_ENDPOINT: string = getEnvVar(
  'VITE_API_ENDPOINT',
  'http://localhost:8000'
);
export const DOMAIN: string = getEnvVar(
  'VITE_DOMAIN',
  'localhost:5173'
);

export const GRAPH_QL_ENDPOINT = `${API_ENDPOINT}/graphql`;
export const METRICS_ENDPOINT = `${API_ENDPOINT}/metrics`;
export const EMAIL_API_ENDPOINT = `${API_ENDPOINT}/emails`;
export const CHECKOUT_ENDPOINT = `${API_ENDPOINT}/checkout`;
export const MANAGE_ENDPOINT = `${API_ENDPOINT}/manage`;
export const SIGNUP_ENDPOINT = `${API_ENDPOINT}/signup`;
