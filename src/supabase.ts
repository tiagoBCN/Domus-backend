import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Supabase URL e Publishable Key não encontrados no ambiente.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
