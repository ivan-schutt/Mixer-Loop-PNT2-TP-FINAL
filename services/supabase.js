import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bzwlhdyyornbzinhsfbt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6d2xoZHl5b3JuYnppbmhzZmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODk5MjcsImV4cCI6MjA2NTI2NTkyN30.1GJbMi86AqLeLa8dFqP6uyMNNzc5g3YkMqOqqJO6D9s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);