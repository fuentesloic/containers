import { User } from "@supabase/supabase-js"
import type { H3Event } from "h3"
import { useSupabaseServer } from "./useSupabaseServer"
import { createError } from "h3"

export const useSupabaseUserServer = async (event: H3Event): Promise<User | null> => {
  const client = await useSupabaseServer(event)

  const {
    data: { user: supabaseUser },
    error,
  } = await client.auth.getUser()
  if (error) {
    throw createError({ statusMessage: error?.message })
  }

  return error ? null : supabaseUser
}
