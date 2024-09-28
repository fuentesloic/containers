import type { H3Event } from "h3"
import { SupabaseClient, createClient } from "@supabase/supabase-js"

export const useSupabaseAdmin = <T>(event: H3Event): SupabaseClient<T> => {
  const {
    supabase: { serviceKey },
    public: {
      supabase: { url },
    },
  } = useRuntimeConfig()

  if (!event.context._supabaseServerAdmin) {
    const client = createClient(url, serviceKey, {
      auth: {
        detectSessionInUrl: false,
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    event.context._supabaseServerAdmin = client
  }

  return event.context._supabaseServerAdmin as SupabaseClient<T>
}
