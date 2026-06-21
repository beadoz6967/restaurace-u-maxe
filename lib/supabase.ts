import { createClient } from '@supabase/supabase-js'

// TODO: initialize the Supabase client with values from env in a later step
//   NEXT_PUBLIC_SUPABASE_URL · NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient('', '')
