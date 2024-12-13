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
      content_sources: {
        Row: {
          citation: string | null
          created_at: string
          created_by: string
          file_path: string | null
          file_type: string | null
          id: string
          last_crawled_at: string | null
          metadata: Json | null
          page_content: string | null
          page_metadata: Json | null
          page_title: string | null
          source_type: string
          status: string | null
          title: string
          url: string | null
          work_type: Database["public"]["Enums"]["creativework_type"] | null
        }
        Insert: {
          citation?: string | null
          created_at?: string
          created_by: string
          file_path?: string | null
          file_type?: string | null
          id?: string
          last_crawled_at?: string | null
          metadata?: Json | null
          page_content?: string | null
          page_metadata?: Json | null
          page_title?: string | null
          source_type: string
          status?: string | null
          title: string
          url?: string | null
          work_type?: Database["public"]["Enums"]["creativework_type"] | null
        }
        Update: {
          citation?: string | null
          created_at?: string
          created_by?: string
          file_path?: string | null
          file_type?: string | null
          id?: string
          last_crawled_at?: string | null
          metadata?: Json | null
          page_content?: string | null
          page_metadata?: Json | null
          page_title?: string | null
          source_type?: string
          status?: string | null
          title?: string
          url?: string | null
          work_type?: Database["public"]["Enums"]["creativework_type"] | null
        }
        Relationships: []
      }
      oauth_accounts: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string | null
          id: string
          provider: Database["public"]["Enums"]["auth_provider"]
          provider_account_id: string
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at?: string | null
          id?: string
          provider: Database["public"]["Enums"]["auth_provider"]
          provider_account_id: string
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          provider?: Database["public"]["Enums"]["auth_provider"]
          provider_account_id?: string
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      page_versions: {
        Row: {
          changes_detected: Json | null
          content: string | null
          content_hash: string
          crawled_at: string
          id: string
          metadata: Json | null
          normalized_content: string | null
          page_id: string
        }
        Insert: {
          changes_detected?: Json | null
          content?: string | null
          content_hash: string
          crawled_at?: string
          id?: string
          metadata?: Json | null
          normalized_content?: string | null
          page_id: string
        }
        Update: {
          changes_detected?: Json | null
          content?: string | null
          content_hash?: string
          crawled_at?: string
          id?: string
          metadata?: Json | null
          normalized_content?: string | null
          page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_versions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          depth: number | null
          id: string
          last_crawled_at: string | null
          last_hash: string | null
          metadata: Json | null
          parent_url: string | null
          status: string | null
          title: string | null
          updated_at: string
          url: string
          website_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          depth?: number | null
          id?: string
          last_crawled_at?: string | null
          last_hash?: string | null
          metadata?: Json | null
          parent_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          url: string
          website_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          depth?: number | null
          id?: string
          last_crawled_at?: string | null
          last_hash?: string | null
          metadata?: Json | null
          parent_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          url?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_page_queue: {
        Row: {
          attempts: number
          created_at: string
          error: string | null
          id: string
          page_number: number
          processed_at: string | null
          source_id: string
          status: Database["public"]["Enums"]["pdf_page_status"]
        }
        Insert: {
          attempts?: number
          created_at?: string
          error?: string | null
          id?: string
          page_number: number
          processed_at?: string | null
          source_id: string
          status?: Database["public"]["Enums"]["pdf_page_status"]
        }
        Update: {
          attempts?: number
          created_at?: string
          error?: string | null
          id?: string
          page_number?: number
          processed_at?: string | null
          source_id?: string
          status?: Database["public"]["Enums"]["pdf_page_status"]
        }
        Relationships: [
          {
            foreignKeyName: "pdf_page_queue_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "content_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          full_name: string | null
          id: string
          profile_photo_url: string | null
          role: string | null
          theme_preference: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id: string
          profile_photo_url?: string | null
          role?: string | null
          theme_preference?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id?: string
          profile_photo_url?: string | null
          role?: string | null
          theme_preference?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      series: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          featured: boolean | null
          id: string
          metadata: Json | null
          series_type: Database["public"]["Enums"]["series_type"]
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          featured?: boolean | null
          id?: string
          metadata?: Json | null
          series_type?: Database["public"]["Enums"]["series_type"]
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          metadata?: Json | null
          series_type?: Database["public"]["Enums"]["series_type"]
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      series_items: {
        Row: {
          content: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          metadata: Json | null
          position: number
          series_id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          metadata?: Json | null
          position: number
          series_id: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          position?: number
          series_id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_items_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      web_crawler_queue: {
        Row: {
          attempts: number
          created_at: string
          error: string | null
          id: string
          last_attempt_at: string | null
          source_id: string
          status: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          error?: string | null
          id?: string
          last_attempt_at?: string | null
          source_id: string
          status?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          error?: string | null
          id?: string
          last_attempt_at?: string | null
          source_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "web_crawler_queue_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "content_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      websites: {
        Row: {
          auth_config: Json | null
          crawl_delay: number | null
          created_at: string
          domain: string
          dynamic_rendering: boolean | null
          id: string
          max_depth: number | null
          metadata: Json | null
          robots_txt: string | null
          source_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          auth_config?: Json | null
          crawl_delay?: number | null
          created_at?: string
          domain: string
          dynamic_rendering?: boolean | null
          id?: string
          max_depth?: number | null
          metadata?: Json | null
          robots_txt?: string | null
          source_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          auth_config?: Json | null
          crawl_delay?: number | null
          created_at?: string
          domain?: string
          dynamic_rendering?: boolean | null
          id?: string
          max_depth?: number | null
          metadata?: Json | null
          robots_txt?: string | null
          source_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "websites_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "content_sources"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      auth_provider: "github"
      creativework_type:
        | "Article"
        | "Book"
        | "Chapter"
        | "Claim"
        | "Collection"
        | "CreativeWorkSeries"
        | "Dataset"
        | "DigitalDocument"
        | "Drawing"
        | "VisualArtwork"
        | "Episode"
        | "LearningResource"
        | "Manuscript"
        | "Map"
        | "MediaObject"
        | "Quotation"
        | "Review"
        | "SheetMusic"
        | "SpecialAnnouncement"
        | "Statement"
        | "WebPage"
        | "WebSite"
      pdf_page_status: "pending" | "processing" | "completed" | "failed"
      series_type:
        | "weekly_lesson"
        | "biographical"
        | "doctrinal_development"
        | "comparative_religion"
        | "historical_analysis"
        | "other"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
