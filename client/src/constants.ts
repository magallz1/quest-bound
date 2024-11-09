const stage = import.meta.env.VITE_ENV ?? 'dev';
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
export const SUPABASE_HOST = import.meta.env.VITE_SUPABASE_HOST;
export const DDDICE_KEY = import.meta.env.VITE_DDDICE_KEY;
export const COMPASS_KEY = import.meta.env.VITE_COMPASS_API_KEY;

export const API_ENDPOINT = (() => {
  switch (stage) {
    case 'prod':
      return 'https://api.questbound.com';
    case 'local':
      return 'http://localhost:8000';
    default:
      return `https://${stage}.api.questbound.com`;
  }
})();

export const GRAPH_QL_ENDPOINT = `${API_ENDPOINT}/graphql`;
export const METRICS_ENDPOINT = `${API_ENDPOINT}/metrics`;
export const EMAIL_API_ENDPOINT = `${API_ENDPOINT}/emails`;
export const CHECKOUT_ENDPOINT = `${API_ENDPOINT}/checkout`;
export const MANAGE_ENDPOINT = `${API_ENDPOINT}/manage`;
export const SIGNUP_ENDPOINT = `${API_ENDPOINT}/signup`;

export const DOMAIN =
  stage === 'prod'
    ? 'https://questbound.com'
    : window.location.origin.includes('localhost')
      ? 'http://localhost:5173'
      : `https://${stage}.questbound.com`;
