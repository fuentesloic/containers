import { defineNuxtModule, addPlugin, createResolver, addTemplate } from "@nuxt/kit"
import { SupabaseClientOptions } from "@supabase/supabase-js"
import { fileURLToPath } from "url"
import defu from "defu"

interface RedirectOptions {
  login: string
  callback: string
  exclude?: string[]
}

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Supabase API URL
   * @type string
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  url?: string

  /**
   * Supabase client key
   * @type string
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  clientKey?: string

  /**
   * Supabase Service key
   * @type string
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  serviceKey?: string

  /**
   * Redirect automatically to login page if user is not authenticated
   * @default `true`
   * @type boolean
   */
  redirect?: boolean

  /**
   * Redirection options, set routes for login and callback redirect
   * @default
   * {
      login: '/login',
      callback: '/confirm',
      exclude: [],
    }
   * @type RedirectOptions
   */
  redirectOptions?: RedirectOptions

  cookie: {
    /**
     * Cookie prefix name, used for storing access and refresh tokens.
     * @default 'unlok'
     * @type string
     */
    name: string
    /**
     * Cookie options
     * @type CookieOptions
     * @docs https://nuxt.com/docs/api/composables/use-cookie#options
     */
    options: {
      maxAge: number
      sameSite: "lax"
      secure: boolean
    }
  }
  /**
   * Supabase Client options
   * @type object
   * @docs https://supabase.com/docs/reference/javascript/initializing#parameters
   */
  clientOptions?: SupabaseClientOptions<string>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "supabase",
    configKey: "supabase",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: [],
    },
    cookie: {
      name: "unlok",
      options: {
        maxAge: 60 * 60 * 8,
        sameSite: "lax",
        secure: true,
      },
    },
    clientOptions: {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    } as SupabaseClientOptions<string>,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url))
    if (!options.url || !options.clientKey || !options.serviceKey) {
      console.warn("supabase env variables missings verify your configuration")
    }

    // Public runtimeConfig
    nuxt.options.runtimeConfig.public.supabase = {
      url: options.url as string,
      clientKey: options.clientKey as string,
      cookie: options.cookie,
      // redirect: options.redirect,
      // redirectOptions: options.redirectOptions,
      // clientOptions: options.clientOptions,
    }

    addPlugin(resolve(runtimeDir, "plugins", "supabase.client"))
    addPlugin(resolve(runtimeDir, "plugins", "supabase.server"))

    nuxt.hook("imports:dirs", (dirs) => {
      dirs.push(resolve(runtimeDir, "composables"))
    })

    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(
        typeof nitroConfig.externals === "object" ? nitroConfig.externals : {},
        {
          inline: [resolve("./runtime")],
        },
      )
      nitroConfig.alias["#supabase/server"] = resolve("./runtime/server")
    })

    addTemplate({
      filename: "types/supabase.d.ts",
      getContents: () =>
        [
          "declare module '#supabase/server' {",
          `  const useSupabaseServer: typeof import('${resolve(
            "./runtime/server",
          )}').useSupabaseServer`,
          `  const useSupabaseAdmin: typeof import('${resolve(
            "./runtime/server",
          )}').useSupabaseAdmin`,
          "}",
        ].join("\n"),
    })

    nuxt.hook("prepare:types", (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, "types/supabase.d.ts") })
    })

    // Private runtimeConfig
    nuxt.options.runtimeConfig.supabase = {
      serviceKey: options.serviceKey as string,
    }
  },
})
