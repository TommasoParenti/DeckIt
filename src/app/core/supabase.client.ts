import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Database } from '../core/models/database.types';

export const supabase = createClient<Database>(environment.SUPABASE_URL, environment.SUPABASE_KEY);