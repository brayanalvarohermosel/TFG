import { createClient } from '@supabase/supabase-js';

/** Supabase client singleton. The anon key is safe for client-side use (protected by Row Level Security). */
const supabaseUrl = 'https://hkbtqfdybypffdtewnon.supabase.co';
const supabaseKey = 'sb_publishable_RQkMjlRl0jCMlJlNM9T3ng_L3tAO9DS';

export const supabase = createClient(supabaseUrl, supabaseKey);
