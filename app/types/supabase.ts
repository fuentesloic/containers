export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      containers: {
        Row: {
          aiPriorityScore: number
          carrierId: string
          consignee: string
          containerStatus: string | null
          contentsDescription: string
          createdAt: string | null
          destination: string
          hsCode: string
          id: string
          packageType: string
          pickupPlanId: string | null
          pickupStatus: string | null
          priorityLevel: string
          quantity: number
          shipper: string
          updatedAt: string | null
          weightKg: number
        }
        Insert: {
          aiPriorityScore: number
          carrierId: string
          consignee: string
          containerStatus?: string | null
          contentsDescription: string
          createdAt?: string | null
          destination: string
          hsCode: string
          id?: string
          packageType: string
          pickupPlanId?: string | null
          pickupStatus?: string | null
          priorityLevel: string
          quantity: number
          shipper: string
          updatedAt?: string | null
          weightKg: number
        }
        Update: {
          aiPriorityScore?: number
          carrierId?: string
          consignee?: string
          containerStatus?: string | null
          contentsDescription?: string
          createdAt?: string | null
          destination?: string
          hsCode?: string
          id?: string
          packageType?: string
          pickupPlanId?: string | null
          pickupStatus?: string | null
          priorityLevel?: string
          quantity?: number
          shipper?: string
          updatedAt?: string | null
          weightKg?: number
        }
        Relationships: []
      }
    }
    Views: {
      containers_dashboard_view: {
        Row: {
          containers_delivered: number | null
          high_score_normal_priority_not_scanned: number | null
          high_score_normal_priority_scanned_or_ready: number | null
          priorityLevel: string | null
          ready_for_pickup_unassigned: number | null
          total_containers_by_priority: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
