import { createClient } from '@supabase/supabase-js';
import { env } from '../env.mjs';

const supabaseUrl = env.supabaseUrl
const supabaseAnonKey = env.supabaseAnonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey);