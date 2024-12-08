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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
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
