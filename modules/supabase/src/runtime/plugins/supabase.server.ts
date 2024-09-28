import { defineNuxtPlugin, useRuntimeConfig, useCookie } from "#imports"
import { createClient } from "@supabase/supabase-js"

export default defineNuxtPlugin({
  name: "supabase",
  enforce: "pre",
  async setup() {
    const {
      public: {
        supabase: {
          url,
          clientKey,
          cookie: { name },
        },
      },
    } = useRuntimeConfig()
    const accessToken = useCookie(`${name}-access-token`).value
    const refreshToken = useCookie(`${name}-refresh-token`).value

    const supabaseClient = createClient(url, clientKey, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: false,
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    // Set user & session server side
    if (accessToken && refreshToken) {
      const { data } = await supabaseClient.auth.setSession({
        refresh_token: refreshToken,
        access_token: accessToken,
      })
      if (data?.user) {
        useSupabaseUser().value = data.user
      }
    }

    return {
      provide: {
        supabase: {
          client: supabaseClient,
        },
      },
    }
  },
})
