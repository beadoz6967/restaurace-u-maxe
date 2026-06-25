import { createClient } from '@supabase/supabase-js'

// Anon client — safe for the browser (kitchen display, realtime).
// The service-role/admin client lives in `lib/supabase-admin.ts` so that
// importing this module from a client component never evaluates (and crashes
// on) the missing service-role key.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
