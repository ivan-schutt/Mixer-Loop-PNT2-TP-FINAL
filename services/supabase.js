import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rsavyhrqfdpjviikufad.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzYXZ5aHJxZmRwanZpaWt1ZmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMDgzNzQsImV4cCI6MjA2NTc4NDM3NH0.VfDnajVtInOctfHkvrAmnnTgwuTW7v56b17Fh7FrjjQ' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);