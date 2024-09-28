import { SupabaseClient, createClient } from "@supabase/supabase-js"
import type { H3Event } from "h3"

export const useSupabaseServer = async <T>(event: H3Event): Promise<SupabaseClient<T>> => {
  const {
    public: {
      supabase: {
        url,
        clientKey,
        cookie: { name },
      },
    },
  } = useRuntimeConfig()

  let supabaseClient = event.context._supabaseServer as SupabaseClient<T>

  if (!supabaseClient) {
    supabaseClient = createClient<T>(url, clientKey, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: false,
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    event.context._supabaseServer = supabaseClient
  }

  // check for authorized session
  const { data } = await supabaseClient.auth.getSession()
  if (data?.session?.user?.aud !== "authenticated") {
    // create a session from cookies
    const accessToken = getCookie(event, `${name}-access-token`)
    const refreshToken = getCookie(event, `${name}-refresh-token`)

    if (!accessToken || !refreshToken) return supabaseClient

    // Set session from cookies
    await supabaseClient.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    })
  }

  return supabaseClient as SupabaseClient<T>
}
