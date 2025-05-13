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
      access_logs: {
        Row: {
          accessed_at: string
          created_at: string | null
          device: string
          id: string
          ip_address: string
          user_id: string | null
        }
        Insert: {
          accessed_at?: string
          created_at?: string | null
          device: string
          id?: string
          ip_address: string
          user_id?: string | null
        }
        Update: {
          accessed_at?: string
          created_at?: string | null
          device?: string
          id?: string
          ip_address?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ads: {
        Row: {
          code_snippet: string
          created_at: string | null
          id: string
          location: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          code_snippet: string
          created_at?: string | null
          id?: string
          location: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          code_snippet?: string
          created_at?: string | null
          id?: string
          location?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          api_key: string
          api_type: Database["public"]["Enums"]["api_type"]
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          api_key: string
          api_type: Database["public"]["Enums"]["api_type"]
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          api_key?: string
          api_type?: Database["public"]["Enums"]["api_type"]
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          client_id: string | null
          created_at: string | null
          end_time: string
          id: string
          notes: string | null
          provider_id: string | null
          service_id: string | null
          start_time: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          end_time: string
          id?: string
          notes?: string | null
          provider_id?: string | null
          service_id?: string | null
          start_time: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          provider_id?: string | null
          service_id?: string | null
          start_time?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string
          created_at: string | null
          email: string
          id: string
          last_purchase: string | null
          name: string
          phone: string
          total_orders: number | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          email: string
          id?: string
          last_purchase?: string | null
          name: string
          phone: string
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          email?: string
          id?: string
          last_purchase?: string | null
          name?: string
          phone?: string
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string | null
          game_url: string
          id: string
          is_active: boolean | null
          thumbnail_url: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          game_url: string
          id?: string
          is_active?: boolean | null
          thumbnail_url: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          game_url?: string
          id?: string
          is_active?: boolean | null
          thumbnail_url?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      image_history: {
        Row: {
          created_at: string | null
          id: string
          images: string[]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          images: string[]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          images?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mindmaps: {
        Row: {
          created_at: string
          edges: Json
          id: string
          is_public: boolean | null
          nodes: Json
          theme: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          edges: Json
          id?: string
          is_public?: boolean | null
          nodes: Json
          theme?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          edges?: Json
          id?: string
          is_public?: boolean | null
          nodes?: Json
          theme?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          downloads_remaining: number | null
          id: string
          order_id: string
          price_at_purchase: number
          product_id: string
        }
        Insert: {
          created_at?: string | null
          downloads_remaining?: number | null
          id?: string
          order_id: string
          price_at_purchase: number
          product_id: string
        }
        Update: {
          created_at?: string | null
          downloads_remaining?: number | null
          id?: string
          order_id?: string
          price_at_purchase?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          payment_intent_id: string | null
          payment_provider: string | null
          status: string
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_provider?: string | null
          status?: string
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_provider?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          category_id: string
          product_id: string
        }
        Insert: {
          category_id: string
          product_id: string
        }
        Update: {
          category_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_home_sections: {
        Row: {
          product_id: string
          section_name: string
        }
        Insert: {
          product_id: string
          section_name: string
        }
        Update: {
          product_id?: string
          section_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_home_sections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          access_control: string | null
          comments_enabled: boolean | null
          created_at: string | null
          creator_id: string | null
          description_full: string | null
          description_short: string | null
          display_order: number | null
          download_limit: number | null
          download_url: string | null
          id: string
          links_instructions: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          price: number
          published_at: string | null
          slug: string
          status: string
          support_info: string | null
          updated_at: string | null
        }
        Insert: {
          access_control?: string | null
          comments_enabled?: boolean | null
          created_at?: string | null
          creator_id?: string | null
          description_full?: string | null
          description_short?: string | null
          display_order?: number | null
          download_limit?: number | null
          download_url?: string | null
          id?: string
          links_instructions?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          price?: number
          published_at?: string | null
          slug: string
          status?: string
          support_info?: string | null
          updated_at?: string | null
        }
        Update: {
          access_control?: string | null
          comments_enabled?: boolean | null
          created_at?: string | null
          creator_id?: string | null
          description_full?: string | null
          description_short?: string | null
          display_order?: number | null
          download_limit?: number | null
          download_url?: string | null
          id?: string
          links_instructions?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          price?: number
          published_at?: string | null
          slug?: string
          status?: string
          support_info?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          credits: number
          device_id: string | null
          full_name: string
          id: string
          plan: string
          plan_expires_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credits?: number
          device_id?: string | null
          full_name: string
          id?: string
          plan?: string
          plan_expires_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credits?: number
          device_id?: string | null
          full_name?: string
          id?: string
          plan?: string
          plan_expires_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          author: string
          category: string
          created_at: string | null
          date: string
          demo_url: string
          description: string
          estimated_time: number
          features: string[]
          github_url: string | null
          id: string
          image_url: string
          live_url: string
          long_description: string
          tags: string[]
          technologies: string[]
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          author: string
          category: string
          created_at?: string | null
          date: string
          demo_url: string
          description: string
          estimated_time: number
          features?: string[]
          github_url?: string | null
          id?: string
          image_url: string
          live_url: string
          long_description: string
          tags?: string[]
          technologies?: string[]
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          author?: string
          category?: string
          created_at?: string | null
          date?: string
          demo_url?: string
          description?: string
          estimated_time?: number
          features?: string[]
          github_url?: string | null
          id?: string
          image_url?: string
          live_url?: string
          long_description?: string
          tags?: string[]
          technologies?: string[]
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      provider_profiles: {
        Row: {
          address: string | null
          bio: string | null
          created_at: string | null
          id: string
          photo_url: string | null
          profession: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          photo_url?: string | null
          profession: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          photo_url?: string | null
          profession?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          provider_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          provider_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          provider_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string | null
          current_period_end: string
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string | null
          user_email: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end: string
          id?: string
          plan_type: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string | null
          user_email: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string | null
          current_period_end?: string
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string | null
          user_email?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          plan: string
          starts_at: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          plan: string
          starts_at?: string
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          plan?: string
          starts_at?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_usage: {
        Row: {
          created_at: string | null
          id: string
          trial_user_id: string | null
          video_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          trial_user_id?: string | null
          video_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          trial_user_id?: string | null
          video_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_usage_trial_user_id_fkey"
            columns: ["trial_user_id"]
            isOneToOne: false
            referencedRelation: "trial_users"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_users: {
        Row: {
          browser: string
          created_at: string | null
          expires_at: string
          fingerprint: string
          id: string
          ip_address: string
          is_active: boolean | null
          os: string
        }
        Insert: {
          browser: string
          created_at?: string | null
          expires_at?: string
          fingerprint: string
          id?: string
          ip_address: string
          is_active?: boolean | null
          os: string
        }
        Update: {
          browser?: string
          created_at?: string | null
          expires_at?: string
          fingerprint?: string
          id?: string
          ip_address?: string
          is_active?: boolean | null
          os?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          daily_credits: number | null
          fingerprint: string | null
          first_name: string
          id: string
          ip_address: string | null
          last_name: string
          last_reset_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          daily_credits?: number | null
          fingerprint?: string | null
          first_name: string
          id: string
          ip_address?: string | null
          last_name: string
          last_reset_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          daily_credits?: number | null
          fingerprint?: string | null
          first_name?: string
          id?: string
          ip_address?: string | null
          last_name?: string
          last_reset_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_trial: {
        Args: { p_ip_address: string }
        Returns: boolean
      }
      check_device_exists: {
        Args: { p_fingerprint: string; p_ip_address: string }
        Returns: boolean
      }
      check_subscription_limits: {
        Args: { p_user_id: string; p_video_type: string }
        Returns: boolean
      }
      check_trial_limits: {
        Args: { trial_user_id: string; video_type: string }
        Returns: boolean
      }
      get_trial_usage_count: {
        Args: { p_trial_user_id: string; p_video_type: string }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      api_type: "chatgpt" | "gemini"
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      api_type: ["chatgpt", "gemini"],
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
