/**
 * HENU Database Types (matches schema in supabase/migrations/00001_initial_schema.sql)
 * Strictly conforms to Supabase JS v2 Database type contract.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          role: "admin" | "manager" | "viewer";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          role?: "admin" | "manager" | "viewer";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          role?: "admin" | "manager" | "viewer";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_email: string;
          action: string;
          entity_type: string;
          entity_id: string;
          summary: string;
          metadata: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_email: string;
          action: string;
          entity_type: string;
          entity_id: string;
          summary: string;
          metadata?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          summary?: string;
          metadata?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          storage_key: string;
          original_filename: string;
          media_type: "image/png" | "image/jpeg" | "image/webp" | "image/svg+xml";
          byte_size: number;
          width: number | null;
          height: number | null;
          alt_text: string | null;
          is_decorative: boolean;
          focal_point: Json | null;
          variants: Json | null;
          uploaded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          storage_key: string;
          original_filename: string;
          media_type: "image/png" | "image/jpeg" | "image/webp" | "image/svg+xml";
          byte_size: number;
          width?: number | null;
          height?: number | null;
          alt_text?: string | null;
          is_decorative?: boolean;
          focal_point?: Json | null;
          variants?: Json | null;
          uploaded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          storage_key?: string;
          original_filename?: string;
          media_type?: "image/png" | "image/jpeg" | "image/webp" | "image/svg+xml";
          byte_size?: number;
          width?: number | null;
          height?: number | null;
          alt_text?: string | null;
          is_decorative?: boolean;
          focal_point?: Json | null;
          variants?: Json | null;
          uploaded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: "default";
          organization_name: string;
          contact_email: string;
          calendly_url: string;
          header_cta_label: string;
          footer_text: string;
          social_links: Json | null;
          seo_defaults: Json | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: "default";
          organization_name?: string;
          contact_email?: string;
          calendly_url?: string;
          header_cta_label?: string;
          footer_text?: string;
          social_links?: Json | null;
          seo_defaults?: Json | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: "default";
          organization_name?: string;
          contact_email?: string;
          calendly_url?: string;
          header_cta_label?: string;
          footer_text?: string;
          social_links?: Json | null;
          seo_defaults?: Json | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      service_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          category_id: string;
          slug: string;
          name: string;
          summary: string;
          status: "draft" | "published" | "archived";
          requires_disclaimer: boolean;
          disclaimer_block: string | null;
          problem_block: Json | null;
          capability_block: Json | null;
          approach_block: Json | null;
          solution_block: Json | null;
          outcome_block: Json | null;
          faq_items: Json | null;
          display_order: number;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          slug: string;
          name: string;
          summary: string;
          status?: "draft" | "published" | "archived";
          requires_disclaimer?: boolean;
          disclaimer_block?: string | null;
          problem_block?: Json | null;
          capability_block?: Json | null;
          approach_block?: Json | null;
          solution_block?: Json | null;
          outcome_block?: Json | null;
          faq_items?: Json | null;
          display_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          deleted_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          slug?: string;
          name?: string;
          summary?: string;
          status?: "draft" | "published" | "archived";
          requires_disclaimer?: boolean;
          disclaimer_block?: string | null;
          problem_block?: Json | null;
          capability_block?: Json | null;
          approach_block?: Json | null;
          solution_block?: Json | null;
          outcome_block?: Json | null;
          faq_items?: Json | null;
          display_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          deleted_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string;
          status: "draft" | "published" | "archived";
          status_label: "available" | "beta" | "in_development" | "coming_soon";
          hue_key: "os" | "ai" | "pa" | "ide";
          template_variant: string;
          summary: string;
          description_blocks: Json | null;
          capabilities: Json | null;
          signature_module_content: Json | null;
          primary_cta_type: "explore" | "download" | "waitlist" | "demo" | "enquire";
          primary_cta_target: string;
          cover_media_id: string | null;
          display_order: number;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          tagline: string;
          status?: "draft" | "published" | "archived";
          status_label?: "available" | "beta" | "in_development" | "coming_soon";
          hue_key: "os" | "ai" | "pa" | "ide";
          template_variant?: string;
          summary: string;
          description_blocks?: Json | null;
          capabilities?: Json | null;
          signature_module_content?: Json | null;
          primary_cta_type?: "explore" | "download" | "waitlist" | "demo" | "enquire";
          primary_cta_target?: string;
          cover_media_id?: string | null;
          display_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          deleted_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          tagline?: string;
          status?: "draft" | "published" | "archived";
          status_label?: "available" | "beta" | "in_development" | "coming_soon";
          hue_key?: "os" | "ai" | "pa" | "ide";
          template_variant?: string;
          summary?: string;
          description_blocks?: Json | null;
          capabilities?: Json | null;
          signature_module_content?: Json | null;
          primary_cta_type?: "explore" | "download" | "waitlist" | "demo" | "enquire";
          primary_cta_target?: string;
          cover_media_id?: string | null;
          display_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          deleted_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      portfolio_projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string;
          status: "draft" | "published" | "archived";
          project_status: "live" | "in_development" | "internal";
          is_featured: boolean;
          display_order: number;
          period_year: string | null;
          external_url: string | null;
          client_permission_status: "granted" | "internal_review" | "pending" | "denied";
          category_slug: string | null;
          technologies: Json | null;
          related_service_ids: Json | null;
          related_product_ids: Json | null;
          story_blocks: Json | null;
          metrics: Json | null;
          cover_media_id: string | null;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary: string;
          status?: "draft" | "published" | "archived";
          project_status?: "live" | "in_development" | "internal";
          is_featured?: boolean;
          display_order?: number;
          period_year?: string | null;
          external_url?: string | null;
          client_permission_status?: "granted" | "internal_review" | "pending" | "denied";
          category_slug?: string | null;
          technologies?: Json | null;
          related_service_ids?: Json | null;
          related_product_ids?: Json | null;
          story_blocks?: Json | null;
          metrics?: Json | null;
          cover_media_id?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          deleted_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          summary?: string;
          status?: "draft" | "published" | "archived";
          project_status?: "live" | "in_development" | "internal";
          is_featured?: boolean;
          display_order?: number;
          period_year?: string | null;
          external_url?: string | null;
          client_permission_status?: "granted" | "internal_review" | "pending" | "denied";
          category_slug?: string | null;
          technologies?: Json | null;
          related_service_ids?: Json | null;
          related_product_ids?: Json | null;
          story_blocks?: Json | null;
          metrics?: Json | null;
          cover_media_id?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          deleted_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      technologies: {
        Row: {
          id: string;
          slug: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      project_media: {
        Row: {
          id: string;
          project_id: string;
          media_id: string;
          display_order: number;
          caption: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          media_id: string;
          display_order?: number;
          caption?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          media_id?: string;
          display_order?: number;
          caption?: string | null;
        };
        Relationships: [];
      };
      home_content: {
        Row: {
          id: "default";
          hero_statement: string;
          hero_supporting_line: string;
          hero_primary_cta_label: string;
          hero_primary_cta_target: string;
          hero_secondary_cta_label: string;
          hero_secondary_cta_target: string;
          flagship_headline: string;
          flagship_summary: string;
          services_intro: string;
          about_teaser: string;
          featured_product_ids: Json | null;
          featured_project_ids: Json | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: "default";
          hero_statement: string;
          hero_supporting_line: string;
          hero_primary_cta_label?: string;
          hero_primary_cta_target?: string;
          hero_secondary_cta_label?: string;
          hero_secondary_cta_target?: string;
          flagship_headline?: string;
          flagship_summary: string;
          services_intro: string;
          about_teaser: string;
          featured_product_ids?: Json | null;
          featured_project_ids?: Json | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: "default";
          hero_statement?: string;
          hero_supporting_line?: string;
          hero_primary_cta_label?: string;
          hero_primary_cta_target?: string;
          hero_secondary_cta_label?: string;
          hero_secondary_cta_target?: string;
          flagship_headline?: string;
          flagship_summary?: string;
          services_intro?: string;
          about_teaser?: string;
          featured_product_ids?: Json | null;
          featured_project_ids?: Json | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      about_content: {
        Row: {
          id: "default";
          vision_statement: string;
          mission_statement: string;
          chapters: Json | null;
          timeline_entries: Json | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: "default";
          vision_statement: string;
          mission_statement: string;
          chapters?: Json | null;
          timeline_entries?: Json | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: "default";
          vision_statement?: string;
          mission_statement?: string;
          chapters?: Json | null;
          timeline_entries?: Json | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      enquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          organisation: string | null;
          interest_type: "service" | "product" | "general" | "partnership";
          interest_ref: string | null;
          message: string;
          status: "new" | "in_progress" | "resolved" | "spam";
          internal_notes: string | null;
          source_page: string | null;
          notification_status: "pending" | "sent" | "failed";
          notification_error: string | null;
          notified_at: string | null;
          consent_recorded_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          organisation?: string | null;
          interest_type?: "service" | "product" | "general" | "partnership";
          interest_ref?: string | null;
          message: string;
          status?: "new" | "in_progress" | "resolved" | "spam";
          internal_notes?: string | null;
          source_page?: string | null;
          notification_status?: "pending" | "sent" | "failed";
          notification_error?: string | null;
          notified_at?: string | null;
          consent_recorded_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          organisation?: string | null;
          interest_type?: "service" | "product" | "general" | "partnership";
          interest_ref?: string | null;
          message?: string;
          status?: "new" | "in_progress" | "resolved" | "spam";
          internal_notes?: string | null;
          source_page?: string | null;
          notification_status?: "pending" | "sent" | "failed";
          notification_error?: string | null;
          notified_at?: string | null;
          consent_recorded_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      slug_redirects: {
        Row: {
          id: string;
          entity_type: "product" | "service" | "project";
          old_slug: string;
          new_slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_type: "product" | "service" | "project";
          old_slug: string;
          new_slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          entity_type?: "product" | "service" | "project";
          old_slug?: string;
          new_slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
