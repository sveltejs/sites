import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env['SUPABASE_URL'];
const SUPABASE_KEY = process.env['SUPABASE_KEY'];

export const client = createClient(SUPABASE_URL, SUPABASE_KEY, { fetch });
