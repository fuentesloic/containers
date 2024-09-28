import { SupabaseClient } from "@supabase/supabase-js"

export default function useSupabaseClient<T>() {
  return useNuxtApp().$supabase?.client as SupabaseClient<T>
}
