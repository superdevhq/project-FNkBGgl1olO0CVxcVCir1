
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pgkleewonozwccbfycrb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBna2xlZXdvbm96d2NjYmZ5Y3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NDc3MDQsImV4cCI6MjA1NzAyMzcwNH0.NMQpVHbiXPWDGEgQ480BpNg_4GRvPhdXa0k9DEUe0IA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
