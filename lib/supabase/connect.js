import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SECRET_KEY

// This client uses the service role key and bypasses RLS.
// ONLY import and use this client on the server side (APIs, Server Actions).
export const supabase = createClient(supabaseUrl, supabaseKey)
