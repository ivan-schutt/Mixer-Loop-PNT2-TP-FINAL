import { createClient } from '@supabase/supabase-js';

const supabaseUrl = EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = EXPO_PUBLIC_SUPABASE_ANON_KEY 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
