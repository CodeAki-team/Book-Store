import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://qgctoqjyvnmsbjnbhplo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY3RvcWp5dm5tc2JqbmJocGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTc4MjMsImV4cCI6MjA1OTk3MzgyM30.Ei5NFmU3el5VYFcZgilC7vNRhofWoc8K6UXjFbiQDYI";

export const supabase = createClient(supabaseUrl, supabaseKey);
