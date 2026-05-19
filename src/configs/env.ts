const env = {
  BASE_URL: import.meta.env.VITE_BASE_URL as string,
  API_TOKEN: import.meta.env.VITE_API_TOKEN as string,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string,
  SUPABASE_TOKEN: import.meta.env.VITE_SUPABASE_TOKEN as string,
  CHECKIN_BASE_URL: import.meta.env.VITE_CHECKIN_BASE_URL as string,
  CHECKIN_API_TOKEN: import.meta.env.VITE_CHECKIN_API_TOKEN as string,
};

export { env };
