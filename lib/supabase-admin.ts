import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Admin client — server only (API routes). Bypasses RLS via the service-role
// key. The `server-only` import makes any accidental client-side import a
// build error, and keeping it out of `lib/supabase.ts` ensures client
// components that use the anon client never evaluate this createClient call.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
