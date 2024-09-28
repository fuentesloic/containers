import { defineNuxtPlugin, useRuntimeConfig, useCookie } from "#imports"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import type { CookieOptions } from "nuxt/app"

export default defineNuxtPlugin({
  name: "supabase",
  enforce: "pre",
  async setup() {
    const {
      public: {
        supabase: {
          clientKey,
          url,
          cookie: { name, options },
        },
      },
    } = useRuntimeConfig()
    const user = useSupabaseUser()

    const supabaseClient = createClient<Database>(url, clientKey, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })

    // // Handle auth event client side
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        if (JSON.stringify(user.value) !== JSON.stringify(session.user)) {
          user.value = session.user
        }
      } else {
        user.value = null
      }

      const _options = options as CookieOptions

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        useCookie(`${name}-access-token`, _options).value = session?.access_token
        useCookie(`${name}-refresh-token`, _options).value = session?.refresh_token
        if (session?.provider_refresh_token)
          useCookie(`${name}-provider-refresh-token`, _options).value =
            session.provider_refresh_token
      }
      if (event === "SIGNED_OUT") {
        useCookie(`${name}-access-token`, _options).value = null
        useCookie(`${name}-refresh-token`, _options).value = null
      }
    })

    return {
      provide: {
        supabase: {
          client: supabaseClient,
        },
      },
    }
  },
})
