export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_user_deletion_guide: {
        Row: {
          content: string
          created_at: string | null
          example_usage: string | null
          id: number
          section: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          example_usage?: string | null
          id?: number
          section: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          example_usage?: string | null
          id?: number
          section?: string
          title?: string
        }
        Relationships: []
      }
      amenities: {
        Row: {
          created_at: string
          is_active: boolean
          key: string
          label: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          key: string
          label: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          is_active?: boolean
          key?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          created_at: string
          end_date: string
          id: string
          property_id: string
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          property_id: string
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          property_id?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_slots_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_slots_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_slots_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "availability_slots_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
        ]
      }
      bookings: {
        Row: {
          checked_in_at: string | null
          checked_out_at: string | null
          created_at: string
          credits_spent: number
          end_date: string
          guest_id: string
          host_credits_awarded: boolean | null
          host_credits_awarded_at: string | null
          host_id: string
          id: string
          property_id: string
          start_date: string
          status: string
          swap_request_id: string
          total_nights: number
          updated_at: string
        }
        Insert: {
          checked_in_at?: string | null
          checked_out_at?: string | null
          created_at?: string
          credits_spent: number
          end_date: string
          guest_id: string
          host_credits_awarded?: boolean | null
          host_credits_awarded_at?: string | null
          host_id: string
          id?: string
          property_id: string
          start_date: string
          status?: string
          swap_request_id: string
          total_nights: number
          updated_at?: string
        }
        Update: {
          checked_in_at?: string | null
          checked_out_at?: string | null
          created_at?: string
          credits_spent?: number
          end_date?: string
          guest_id?: string
          host_credits_awarded?: boolean | null
          host_credits_awarded_at?: string | null
          host_id?: string
          id?: string
          property_id?: string
          start_date?: string
          status?: string
          swap_request_id?: string
          total_nights?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "bookings_swap_request_id_fkey"
            columns: ["swap_request_id"]
            isOneToOne: false
            referencedRelation: "active_swap_requests_with_credits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_swap_request_id_fkey"
            columns: ["swap_request_id"]
            isOneToOne: false
            referencedRelation: "swap_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_swap_request_id_fkey"
            columns: ["swap_request_id"]
            isOneToOne: false
            referencedRelation: "swap_requests_with_expiry"
            referencedColumns: ["id"]
          },
        ]
      }
      cache_refresh_queue: {
        Row: {
          created_at: string | null
          id: string
          last_refresh: string | null
          needs_refresh: boolean | null
          table_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_refresh?: string | null
          needs_refresh?: boolean | null
          table_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_refresh?: string | null
          needs_refresh?: boolean | null
          table_name?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          is_archived: boolean
          last_message_at: string | null
          swap_request_id: string | null
          updated_at: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_archived?: boolean
          last_message_at?: string | null
          swap_request_id?: string | null
          updated_at?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_archived?: boolean
          last_message_at?: string | null
          swap_request_id?: string | null
          updated_at?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversations_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          description: string
          id: string
          processed_at: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          description: string
          id?: string
          processed_at?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          description?: string
          id?: string
          processed_at?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      developer_notes: {
        Row: {
          created_at: string | null
          id: string
          note: string
          topic: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          note: string
          topic: string
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string
          topic?: string
        }
        Relationships: []
      }
      featured_destinations: {
        Row: {
          city: string
          country: string
          created_at: string | null
          custom_description: string | null
          custom_image_url: string | null
          destination_name: string | null
          display_order: number
          featured_at: string | null
          featured_by: string | null
          highlight_color: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          city: string
          country: string
          created_at?: string | null
          custom_description?: string | null
          custom_image_url?: string | null
          destination_name?: string | null
          display_order?: number
          featured_at?: string | null
          featured_by?: string | null
          highlight_color?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          custom_description?: string | null
          custom_image_url?: string | null
          destination_name?: string | null
          display_order?: number
          featured_at?: string | null
          featured_by?: string | null
          highlight_color?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_destinations_featured_by_fkey"
            columns: ["featured_by"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      featured_properties: {
        Row: {
          created_at: string | null
          featured_at: string | null
          featured_by: string | null
          id: string
          is_active: boolean | null
          position: number
          property_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          featured_at?: string | null
          featured_by?: string | null
          id?: string
          is_active?: boolean | null
          position?: number
          property_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          featured_at?: string | null
          featured_by?: string | null
          id?: string
          is_active?: boolean | null
          position?: number
          property_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_properties_featured_by_fkey"
            columns: ["featured_by"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "featured_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "featured_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
        ]
      }
      image_variants: {
        Row: {
          created_at: string | null
          file_size_bytes: number | null
          height: number | null
          id: string
          image_url: string
          mime_type: string | null
          original_image_id: string | null
          variant_type: string
          width: number | null
        }
        Insert: {
          created_at?: string | null
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          image_url: string
          mime_type?: string | null
          original_image_id?: string | null
          variant_type: string
          width?: number | null
        }
        Update: {
          created_at?: string | null
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          image_url?: string
          mime_type?: string | null
          original_image_id?: string | null
          variant_type?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "image_variants_original_image_id_fkey"
            columns: ["original_image_id"]
            isOneToOne: false
            referencedRelation: "property_images"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      nearby_activities: {
        Row: {
          address: string | null
          business_status: string | null
          category: string
          created_at: string | null
          distance_meters: number | null
          google_url: string | null
          id: string
          last_updated_from_google: string | null
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          phone: string | null
          photos: string[] | null
          place_id: string | null
          price_level: number | null
          property_id: string | null
          rating: number | null
          types: string[] | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          business_status?: string | null
          category: string
          created_at?: string | null
          distance_meters?: number | null
          google_url?: string | null
          id?: string
          last_updated_from_google?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          phone?: string | null
          photos?: string[] | null
          place_id?: string | null
          price_level?: number | null
          property_id?: string | null
          rating?: number | null
          types?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          business_status?: string | null
          category?: string
          created_at?: string | null
          distance_meters?: number | null
          google_url?: string | null
          id?: string
          last_updated_from_google?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          photos?: string[] | null
          place_id?: string | null
          price_level?: number | null
          property_id?: string | null
          rating?: number | null
          types?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nearby_activities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nearby_activities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nearby_activities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nearby_activities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "nearby_activities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          destination_city: string | null
          email: string
          first_name: string | null
          id: string
          ip_address: string | null
          klaviyo_profile_id: string | null
          klaviyo_sent: boolean | null
          klaviyo_sent_at: string | null
          landing_page_source: string
          last_name: string | null
          metadata: Json | null
          referrer: string | null
          status: string | null
          updated_at: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string | null
          destination_city?: string | null
          email: string
          first_name?: string | null
          id?: string
          ip_address?: string | null
          klaviyo_profile_id?: string | null
          klaviyo_sent?: boolean | null
          klaviyo_sent_at?: string | null
          landing_page_source?: string
          last_name?: string | null
          metadata?: Json | null
          referrer?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string | null
          destination_city?: string | null
          email?: string
          first_name?: string | null
          id?: string
          ip_address?: string | null
          klaviyo_profile_id?: string | null
          klaviyo_sent?: boolean | null
          klaviyo_sent_at?: string | null
          landing_page_source?: string
          last_name?: string | null
          metadata?: Json | null
          referrer?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string | null
          enabled: boolean
          id: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          idempotency_key: string | null
          read_at: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          idempotency_key?: string | null
          read_at?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          idempotency_key?: string | null
          read_at?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      onboarding_bypass_list: {
        Row: {
          created_at: string | null
          created_by: string | null
          reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_bypass_list_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "onboarding_bypass_list_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      past_swaps: {
        Row: {
          checkout_completed_at: string
          created_at: string
          credits_used: number
          end_date: string
          guest_id: string
          host_id: string
          id: string
          original_swap_request_id: string
          property_id: string
          review_enabled_at: string
          start_date: string
          total_nights: number
        }
        Insert: {
          checkout_completed_at: string
          created_at?: string
          credits_used: number
          end_date: string
          guest_id: string
          host_id: string
          id?: string
          original_swap_request_id: string
          property_id: string
          review_enabled_at: string
          start_date: string
          total_nights: number
        }
        Update: {
          checkout_completed_at?: string
          created_at?: string
          credits_used?: number
          end_date?: string
          guest_id?: string
          host_id?: string
          id?: string
          original_swap_request_id?: string
          property_id?: string
          review_enabled_at?: string
          start_date?: string
          total_nights?: number
        }
        Relationships: [
          {
            foreignKeyName: "past_swaps_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "past_swaps_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "past_swaps_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "past_swaps_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "past_swaps_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "past_swaps_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "past_swaps_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
        ]
      }
      phone_verification_codes: {
        Row: {
          attempts: number | null
          code: string
          created_at: string | null
          expires_at: string
          id: string
          max_attempts: number | null
          phone_number: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number | null
          code: string
          created_at?: string | null
          expires_at?: string
          id?: string
          max_attempts?: number | null
          phone_number: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number | null
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          max_attempts?: number | null
          phone_number?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phone_verification_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          credits: number
          email: string | null
          first_name: string | null
          gender: string | null
          id: string
          job_title: string | null
          klaviyo_list_id: string | null
          klaviyo_profile_id: string | null
          klaviyo_sent: boolean | null
          klaviyo_sent_at: string | null
          landing_page_source: string | null
          last_name: string | null
          onboarding_completed: boolean | null
          onboarding_source: string | null
          phone_number: string | null
          phone_verified: boolean | null
          phone_verified_at: string | null
          referral_code: string | null
          referred_by: string | null
          registration_completed_at: string | null
          registration_credits_awarded: boolean | null
          registration_credits_awarded_at: string | null
          registration_step: string | null
          social_media: string | null
          total_referrals: number | null
          updated_at: string
          user_id: string
          user_type: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          verification_completed_at: string | null
          verification_metadata: Json | null
          verification_method: string | null
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          address?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          credits?: number
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          job_title?: string | null
          klaviyo_list_id?: string | null
          klaviyo_profile_id?: string | null
          klaviyo_sent?: boolean | null
          klaviyo_sent_at?: string | null
          landing_page_source?: string | null
          last_name?: string | null
          onboarding_completed?: boolean | null
          onboarding_source?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          referral_code?: string | null
          referred_by?: string | null
          registration_completed_at?: string | null
          registration_credits_awarded?: boolean | null
          registration_credits_awarded_at?: string | null
          registration_step?: string | null
          social_media?: string | null
          total_referrals?: number | null
          updated_at?: string
          user_id: string
          user_type?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          verification_completed_at?: string | null
          verification_metadata?: Json | null
          verification_method?: string | null
          verified?: boolean | null
          verified_at?: string | null
        }
        Update: {
          address?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          credits?: number
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          job_title?: string | null
          klaviyo_list_id?: string | null
          klaviyo_profile_id?: string | null
          klaviyo_sent?: boolean | null
          klaviyo_sent_at?: string | null
          landing_page_source?: string | null
          last_name?: string | null
          onboarding_completed?: boolean | null
          onboarding_source?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          referral_code?: string | null
          referred_by?: string | null
          registration_completed_at?: string | null
          registration_credits_awarded?: boolean | null
          registration_credits_awarded_at?: string | null
          registration_step?: string | null
          social_media?: string | null
          total_referrals?: number | null
          updated_at?: string
          user_id?: string
          user_type?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          verification_completed_at?: string | null
          verification_metadata?: Json | null
          verification_method?: string | null
          verified?: boolean | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          bathrooms: number | null
          bedrooms: number | null
          children_friendly: boolean
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          general_area: string | null
          id: string
          is_visible: boolean
          latitude: number | null
          longitude: number | null
          main_image_url: string | null
          pets_friendly: boolean
          property_type: string
          rejection_reason: string | null
          square_metres: number | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          children_friendly?: boolean
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          general_area?: string | null
          id?: string
          is_visible?: boolean
          latitude?: number | null
          longitude?: number | null
          main_image_url?: string | null
          pets_friendly?: boolean
          property_type: string
          rejection_reason?: string | null
          square_metres?: number | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          children_friendly?: boolean
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          general_area?: string | null
          id?: string
          is_visible?: boolean
          latitude?: number | null
          longitude?: number | null
          main_image_url?: string | null
          pets_friendly?: boolean
          property_type?: string
          rejection_reason?: string | null
          square_metres?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      property_amenities: {
        Row: {
          amenity_key: string
          created_at: string
          id: string
          property_id: string
        }
        Insert: {
          amenity_key: string
          created_at?: string
          id?: string
          property_id: string
        }
        Update: {
          amenity_key?: string
          created_at?: string
          id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_property_amenity_known"
            columns: ["amenity_key"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
        ]
      }
      property_beds: {
        Row: {
          created_at: string
          double_beds: number
          id: string
          property_id: string
          room_number: number
          single_beds: number
        }
        Insert: {
          created_at?: string
          double_beds?: number
          id?: string
          property_id: string
          room_number: number
          single_beds?: number
        }
        Update: {
          created_at?: string
          double_beds?: number
          id?: string
          property_id?: string
          room_number?: number
          single_beds?: number
        }
        Relationships: [
          {
            foreignKeyName: "property_beds_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_beds_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_beds_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_beds_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "property_beds_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
        ]
      }
      property_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_main: boolean
          property_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_main?: boolean
          property_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_main?: boolean
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
        ]
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string | null
          referred_bonus_credited: boolean | null
          referred_email: string | null
          referred_user_id: string | null
          referrer_bonus_credited: boolean | null
          referrer_id: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string | null
          referred_bonus_credited?: boolean | null
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_bonus_credited?: boolean | null
          referrer_id: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string | null
          referred_bonus_credited?: boolean | null
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_bonus_credited?: boolean | null
          referrer_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          overall_rating: number | null
          past_swap_id: string
          rating_accuracy: number
          rating_cleaning: number
          rating_communication: number
          review_text: string | null
          reviewed_user_id: string
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          overall_rating?: number | null
          past_swap_id: string
          rating_accuracy: number
          rating_cleaning: number
          rating_communication: number
          review_text?: string | null
          reviewed_user_id: string
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          overall_rating?: number | null
          past_swap_id?: string
          rating_accuracy?: number
          rating_cleaning?: number
          rating_communication?: number
          review_text?: string | null
          reviewed_user_id?: string
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_past_swap_id_fkey"
            columns: ["past_swap_id"]
            isOneToOne: true
            referencedRelation: "past_swaps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewed_user_id_fkey"
            columns: ["reviewed_user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      swap_requests: {
        Row: {
          created_at: string
          credits_deducted: number | null
          credits_refunded: boolean | null
          credits_refunded_at: string | null
          expires_at: string | null
          guest_id: string
          host_id: string
          host_message: string | null
          id: string
          property_id: string
          requested_end_date: string | null
          requested_start_date: string | null
          slot_id: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits_deducted?: number | null
          credits_refunded?: boolean | null
          credits_refunded_at?: string | null
          expires_at?: string | null
          guest_id: string
          host_id: string
          host_message?: string | null
          id?: string
          property_id: string
          requested_end_date?: string | null
          requested_start_date?: string | null
          slot_id?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits_deducted?: number | null
          credits_refunded?: boolean | null
          credits_refunded_at?: string | null
          expires_at?: string | null
          guest_id?: string
          host_id?: string
          host_message?: string | null
          id?: string
          property_id?: string
          requested_end_date?: string | null
          requested_start_date?: string | null
          slot_id?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "swap_requests_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "swap_requests_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "swap_requests_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "availability_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      test_phone_numbers: {
        Row: {
          created_at: string | null
          description: string | null
          phone_number: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          phone_number: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          phone_number?: string
        }
        Relationships: []
      }
      top_destination: {
        Row: {
          city: string
          country: string
          created_at: string | null
          created_by: string | null
          description: string | null
          destination_image: string | null
          destination_name: string
          display_order: number | null
          id: string
          is_featured: boolean | null
          popularity_score: number | null
          tags: string[] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          city: string
          country: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          destination_image?: string | null
          destination_name: string
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          popularity_score?: number | null
          tags?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          destination_image?: string | null
          destination_name?: string
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          popularity_score?: number | null
          tags?: string[] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "top_destination_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "top_destination_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_deletion_log: {
        Row: {
          cleanup_completed: boolean | null
          created_at: string | null
          deleted_at: string | null
          deleted_user_id: string
          id: string
        }
        Insert: {
          cleanup_completed?: boolean | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_user_id: string
          id?: string
        }
        Update: {
          cleanup_completed?: boolean | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_user_id?: string
          id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "user_favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_slots: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          slot: unknown
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          slot: unknown
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          slot?: unknown
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_slots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_verifications: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
          veriff_verification_id: string | null
          verification_data: Json | null
          verification_method: string | null
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          veriff_verification_id?: string | null
          verification_data?: Json | null
          verification_method?: string | null
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          veriff_verification_id?: string | null
          verification_data?: Json | null
          verification_method?: string | null
          verified?: boolean
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      veriff_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          decision_payload: Json | null
          id: string
          session_id: string
          session_token: string
          session_url: string
          status: string
          updated_at: string | null
          user_id: string
          vendor_data: string
          verification_result: Json | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          decision_payload?: Json | null
          id?: string
          session_id: string
          session_token: string
          session_url: string
          status?: string
          updated_at?: string | null
          user_id: string
          vendor_data: string
          verification_result?: Json | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          decision_payload?: Json | null
          id?: string
          session_id?: string
          session_token?: string
          session_url?: string
          status?: string
          updated_at?: string | null
          user_id?: string
          vendor_data?: string
          verification_result?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "veriff_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      verification_sessions: {
        Row: {
          callback_url: string | null
          completed_at: string | null
          created_at: string
          id: string
          person_data: Json | null
          status: string
          updated_at: string
          user_id: string
          veriff_session_id: string
          veriff_url: string | null
          verification_data: Json | null
        }
        Insert: {
          callback_url?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          person_data?: Json | null
          status?: string
          updated_at?: string
          user_id: string
          veriff_session_id: string
          veriff_url?: string | null
          verification_data?: Json | null
        }
        Update: {
          callback_url?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          person_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
          veriff_session_id?: string
          veriff_url?: string | null
          verification_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      active_swap_requests_with_credits: {
        Row: {
          created_at: string | null
          credits_deducted: number | null
          credits_refunded: boolean | null
          credits_refunded_at: string | null
          effective_status: string | null
          expires_at: string | null
          guest_current_credits: number | null
          guest_id: string | null
          host_current_credits: number | null
          host_id: string | null
          host_message: string | null
          hours_until_expiry: number | null
          id: string | null
          property_city: string | null
          property_id: string | null
          property_title: string | null
          requested_end_date: string | null
          requested_start_date: string | null
          slot_id: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swap_requests_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "swap_requests_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "swap_requests_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "availability_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_status_check: {
        Row: {
          approval_status: string | null
          email: string | null
          onboarding_completed: boolean | null
          registration_step: string | null
          suggested_redirect: string | null
          user_id: string | null
          user_type: string | null
        }
        Relationships: []
      }
      booking_history_with_credits: {
        Row: {
          checked_in_at: string | null
          checked_out_at: string | null
          created_at: string | null
          credits_spent: number | null
          end_date: string | null
          guest_current_credits: number | null
          guest_id: string | null
          host_credits_awarded: boolean | null
          host_credits_awarded_at: string | null
          host_current_credits: number | null
          host_id: string | null
          id: string | null
          property_address: string | null
          property_city: string | null
          property_id: string | null
          property_title: string | null
          request_created_at: string | null
          request_expired_at: string | null
          start_date: string | null
          status: string | null
          swap_request_id: string | null
          total_nights: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "bookings_swap_request_id_fkey"
            columns: ["swap_request_id"]
            isOneToOne: false
            referencedRelation: "active_swap_requests_with_credits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_swap_request_id_fkey"
            columns: ["swap_request_id"]
            isOneToOne: false
            referencedRelation: "swap_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_swap_request_id_fkey"
            columns: ["swap_request_id"]
            isOneToOne: false
            referencedRelation: "swap_requests_with_expiry"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_admin_stats: {
        Row: {
          destinations_with_images: number | null
          featured_destinations: number | null
          total_destinations: number | null
          unique_cities: number | null
          unique_countries: number | null
        }
        Relationships: []
      }
      featured_destinations_with_images: {
        Row: {
          city: string | null
          country: string | null
          description: string | null
          destination_image: string | null
          destination_name: string | null
          display_order: number | null
          id: string | null
          popularity_score: number | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          description?: string | null
          destination_image?: string | null
          destination_name?: string | null
          display_order?: number | null
          id?: string | null
          popularity_score?: number | null
        }
        Update: {
          city?: string | null
          country?: string | null
          description?: string | null
          destination_image?: string | null
          destination_name?: string | null
          display_order?: number | null
          id?: string | null
          popularity_score?: number | null
        }
        Relationships: []
      }
      klaviyo_sync_status: {
        Row: {
          completed_onboarding: number | null
          from_founders_intro: number | null
          has_source: number | null
          organic_users: number | null
          pending_sync: number | null
          sent_to_klaviyo: number | null
          total_users: number | null
        }
        Relationships: []
      }
      profile_with_avatar: {
        Row: {
          address: string | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          auth_email: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          credits: number | null
          display_avatar_url: string | null
          email: string | null
          first_name: string | null
          gender: string | null
          id: string | null
          job_title: string | null
          klaviyo_list_id: string | null
          klaviyo_profile_id: string | null
          klaviyo_sent: boolean | null
          klaviyo_sent_at: string | null
          landing_page_source: string | null
          last_name: string | null
          onboarding_completed: boolean | null
          onboarding_source: string | null
          phone_number: string | null
          phone_verified: boolean | null
          phone_verified_at: string | null
          referral_code: string | null
          referred_by: string | null
          registration_completed_at: string | null
          registration_credits_awarded: boolean | null
          registration_credits_awarded_at: string | null
          registration_step: string | null
          social_media: string | null
          total_referrals: number | null
          updated_at: string | null
          user_id: string | null
          user_type: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          verification_completed_at: string | null
          verification_metadata: Json | null
          verification_method: string | null
          verified: boolean | null
          verified_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      properties_complete: {
        Row: {
          address: string | null
          amenities: string[] | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          avatar_url: string | null
          bathrooms: number | null
          bedrooms: number | null
          children_friendly: boolean | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          featured_position: number | null
          first_name: string | null
          general_area: string | null
          id: string | null
          images: Json | null
          is_featured: boolean | null
          is_visible: boolean | null
          last_name: string | null
          latitude: number | null
          longitude: number | null
          main_image_url: string | null
          pets_friendly: boolean | null
          phone_number: string | null
          property_type: string | null
          rejection_reason: string | null
          square_metres: number | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      properties_public: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          bathrooms: number | null
          bedrooms: number | null
          children_friendly: boolean | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          general_area: string | null
          id: string | null
          latitude: number | null
          longitude: number | null
          main_image_url: string | null
          pets_friendly: boolean | null
          property_type: string | null
          square_metres: number | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          children_friendly?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          general_area?: string | null
          id?: string | null
          latitude?: number | null
          longitude?: number | null
          main_image_url?: string | null
          pets_friendly?: boolean | null
          property_type?: string | null
          square_metres?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          children_friendly?: boolean | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          general_area?: string | null
          id?: string | null
          latitude?: number | null
          longitude?: number | null
          main_image_url?: string | null
          pets_friendly?: boolean | null
          property_type?: string | null
          square_metres?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      property_duplicates: {
        Row: {
          addresses: string[] | null
          first_name: string | null
          last_name: string | null
          property_count: number | null
          property_ids: string[] | null
          titles: string[] | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      property_image_status: {
        Row: {
          approval_status: string | null
          has_main_url: boolean | null
          main_images: number | null
          property_id: string | null
          status: string | null
          title: string | null
          total_images: number | null
        }
        Relationships: []
      }
      property_nearby_activities: {
        Row: {
          activities: Json | null
          property_address: string | null
          property_id: string | null
          property_latitude: number | null
          property_longitude: number | null
          property_title: string | null
        }
        Relationships: []
      }
      swap_requests_with_expiry: {
        Row: {
          created_at: string | null
          days_remaining: number | null
          expires_at: string | null
          expiry_status: string | null
          guest_id: string | null
          host_id: string | null
          host_message: string | null
          hours_remaining: number | null
          id: string | null
          is_expired: boolean | null
          property_id: string | null
          requested_end_date: string | null
          requested_start_date: string | null
          slot_id: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days_remaining?: never
          expires_at?: string | null
          expiry_status?: never
          guest_id?: string | null
          host_id?: string | null
          host_message?: string | null
          hours_remaining?: never
          id?: string | null
          is_expired?: never
          property_id?: string | null
          requested_end_date?: string | null
          requested_start_date?: string | null
          slot_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days_remaining?: never
          expires_at?: string | null
          expiry_status?: never
          guest_id?: string | null
          host_id?: string | null
          host_message?: string | null
          hours_remaining?: never
          id?: string | null
          is_expired?: never
          property_id?: string | null
          requested_end_date?: string | null
          requested_start_date?: string | null
          slot_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swap_requests_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "swap_requests_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_image_status"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "swap_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_nearby_activities"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "swap_requests_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "availability_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      top_destinations: {
        Row: {
          avg_bedrooms: number | null
          avg_square_metres: number | null
          center_lat: number | null
          center_lng: number | null
          city: string | null
          country: string | null
          destination: string | null
          destination_image: string | null
          host_count: number | null
          max_lat: number | null
          max_lng: number | null
          min_lat: number | null
          min_lng: number | null
          property_count: number | null
        }
        Relationships: []
      }
      user_credit_audit: {
        Row: {
          approval_status: string | null
          created_at: string | null
          credit_status: string | null
          credits: number | null
          email: string | null
          expected_credits: number | null
          registration_credits_awarded: boolean | null
          updated_at: string | null
          was_referred: boolean | null
        }
        Relationships: []
      }
      user_credit_summaries: {
        Row: {
          credits_in_pending_requests: number | null
          current_credits: number | null
          registration_credits_awarded: boolean | null
          registration_credits_awarded_at: string | null
          total_bookings_as_guest: number | null
          total_bookings_as_host: number | null
          total_earned: number | null
          total_spent: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_onboarding_status: {
        Row: {
          approval_status: string | null
          credits: number | null
          email: string | null
          first_name: string | null
          last_name: string | null
          needs_onboarding: boolean | null
          onboarding_completed: boolean | null
          phone_verified: boolean | null
          registration_step: string | null
          user_id: string | null
          user_type: string | null
          verified: boolean | null
        }
        Insert: {
          approval_status?: string | null
          credits?: number | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          needs_onboarding?: never
          onboarding_completed?: boolean | null
          phone_verified?: boolean | null
          registration_step?: string | null
          user_id?: string | null
          user_type?: string | null
          verified?: boolean | null
        }
        Update: {
          approval_status?: string | null
          credits?: number | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          needs_onboarding?: never
          onboarding_completed?: boolean | null
          phone_verified?: boolean | null
          registration_step?: string | null
          user_id?: string | null
          user_type?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "auth_status_check"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Functions: {
      add_availability_slot: {
        Args: {
          p_end_date: string
          p_property_id: string
          p_start_date: string
        }
        Returns: string
      }
      add_nearby_activity: {
        Args: {
          p_address: string
          p_category: string
          p_latitude: number
          p_longitude: number
          p_name: string
          p_phone?: string
          p_property_id: string
          p_rating?: number
          p_website?: string
        }
        Returns: string
      }
      admin_add_featured_destination: {
        Args: {
          p_city: string
          p_country: string
          p_custom_description?: string
          p_custom_image_url?: string
          p_display_order?: number
          p_highlight_color?: string
        }
        Returns: string
      }
      admin_can_view_user_overview: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      admin_delete_property_safe: {
        Args: { property_id: string }
        Returns: Json
      }
      admin_delete_user_completely: {
        Args: { target_user_id: string }
        Returns: Json
      }
      admin_trigger_user_cleanup: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      admin_user_deletion_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      admin_verify_phone: {
        Args: { p_phone_number: string; p_user_id: string }
        Returns: Json
      }
      advance_registration_step: {
        Args: { p_data?: Json; p_new_step: string; p_user_id: string }
        Returns: Json
      }
      approve_user: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      approve_user_account: {
        Args: { p_approved_by?: string; p_user_id: string }
        Returns: Json
      }
      assign_phone_to_user: {
        Args: { p_phone_number: string; p_user_id: string }
        Returns: Json
      }
      assign_test_phone_number: {
        Args: { p_phone_number: string; p_user_id: string }
        Returns: undefined
      }
      audit_onboarding_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          count: number
          description: string
          fix_query: string
          issue_type: string
        }[]
      }
      auto_complete_bookings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      auto_refresh_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      bulk_update_destination_images: {
        Args: { updates: Json }
        Returns: Json
      }
      calculate_distance_meters: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      calculate_nights: {
        Args: { end_date: string; start_date: string }
        Returns: number
      }
      calculate_overall_rating: {
        Args: { acc: number; clean: number; comm: number }
        Returns: number
      }
      can_access_sensitive_profile_data: {
        Args: { profile_user_id: string }
        Returns: boolean
      }
      can_delete_all_availability_slots: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      can_leave_review: {
        Args: { past_swap_uuid: string }
        Returns: boolean
      }
      can_make_booking: {
        Args: {
          end_date_param: string
          guest_user_id: string
          property_id_param: string
          start_date_param: string
        }
        Returns: boolean
      }
      can_user_access_message: {
        Args: { conversation_uuid: string; user_uuid: string }
        Returns: boolean
      }
      can_user_perform_action: {
        Args: { action_type: string; user_uuid: string }
        Returns: boolean
      }
      can_view_full_profile: {
        Args: { profile_user_id: string; requesting_user_id: string }
        Returns: boolean
      }
      can_view_private_profile: {
        Args: { profile_user_id: string; requesting_user_id: string }
        Returns: boolean
      }
      can_view_public_profile: {
        Args: { profile_user_id: string; requesting_user_id: string }
        Returns: boolean
      }
      check_all_overlaps: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          details: string
          status: string
          table_name: string
        }[]
      }
      check_approval_eligibility: {
        Args: { p_user_id: string }
        Returns: Json
      }
      check_my_context: {
        Args: Record<PropertyKey, never>
        Returns: {
          my_user_id: string
          properties_i_own: number
          properties_i_should_see: number
          total_properties: number
        }[]
      }
      check_orphaned_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      check_performance_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          metric_value: string
          recommendation: string
          status: string
        }[]
      }
      check_phone_availability: {
        Args: { p_current_user_id?: string; p_phone_number: string }
        Returns: Json
      }
      check_property_delete_permission: {
        Args: { property_id: string }
        Returns: Json
      }
      check_user_login_attempt: {
        Args: { email_input: string }
        Returns: Json
      }
      check_user_onboarding_status: {
        Args: { user_email?: string }
        Returns: Json
      }
      check_user_registration_status: {
        Args: { p_email?: string; p_user_id?: string }
        Returns: {
          email: string
          issues: string[]
          recommendations: string[]
          status: string
          user_id: string
        }[]
      }
      cleanup_declined_swaps: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      cleanup_deleted_users: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      cleanup_expired_verification_codes: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_sample_properties: {
        Args: Record<PropertyKey, never>
        Returns: {
          deleted_count: number
          deleted_properties: string[]
        }[]
      }
      cleanup_user_data_by_id: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      clear_test_phone_before_signup: {
        Args: { p_phone_number: string }
        Returns: Json
      }
      complete_booking: {
        Args: { booking_uuid: string }
        Returns: boolean
      }
      complete_onboarding_flow: {
        Args:
          | {
              p_first_name?: string
              p_last_name?: string
              p_phone?: string
              p_user_id: string
            }
          | {
              p_phone_number?: string
              p_skip_phone?: boolean
              p_user_id: string
            }
        Returns: Json
      }
      complete_phone_onboarding: {
        Args: { p_phone_number: string; p_user_id: string }
        Returns: Json
      }
      complete_referral_signup: {
        Args: { referred_user_id: string }
        Returns: Json
      }
      complete_user_onboarding: {
        Args: { p_user_id: string }
        Returns: Json
      }
      complete_user_registration: {
        Args: { p_phone_number?: string; p_user_id: string }
        Returns: boolean
      }
      complete_user_verification: {
        Args: {
          p_user_id: string
          p_veriff_verification_id: string
          p_verification_data: Json
        }
        Returns: undefined
      }
      create_notification: {
        Args: {
          idempotency_key?: string
          notification_body: string
          notification_data?: Json
          notification_title: string
          notification_type: string
          recipient_user_id: string
        }
        Returns: string
      }
      create_referral_invitation: {
        Args: { p_referred_email?: string; p_referrer_id: string }
        Returns: Json
      }
      create_review: {
        Args: {
          accuracy_rating: number
          cleaning_rating: number
          communication_rating: number
          past_swap_uuid: string
          review_text_param?: string
        }
        Returns: string
      }
      create_swap_request_notification: {
        Args:
          | {
              guest_user_id: string
              host_user_id: string
              property_id: string
              request_type: string
              swap_request_id: string
            }
          | { request_id: string }
        Returns: string
      }
      create_verification_session: {
        Args: {
          p_person_data?: Json
          p_veriff_session_id: string
          p_veriff_url: string
        }
        Returns: string
      }
      current_user_is_verified: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      debug_property_visibility: {
        Args: Record<PropertyKey, never>
        Returns: {
          current_user_id: string
          is_own_property: boolean
          property_id: string
          property_owner_id: string
          property_title: string
          should_be_visible: boolean
        }[]
      }
      delete_availability_slot: {
        Args: { slot_uuid: string }
        Returns: Json
      }
      delete_availability_slot_safe: {
        Args: { confirm_deletion?: boolean; slot_uuid: string }
        Returns: Json
      }
      delete_user_for_edge_function: {
        Args: { bypass_checks?: boolean; target_user_id: string }
        Returns: Json
      }
      dev_complete_user_onboarding: {
        Args: { p_phone_number?: string; p_user_id: string }
        Returns: Json
      }
      diagnose_property_images: {
        Args: { p_property_id?: string }
        Returns: {
          has_main_image: boolean
          issue: string
          main_image_position: number
          owner_email: string
          property_id: string
          property_title: string
          recommendation: string
          total_images: number
        }[]
      }
      edge_delete_user_safely: {
        Args: { target_user_id: string }
        Returns: Json
      }
      expire_old_swap_requests: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      expire_pending_swap_requests: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      expire_swap_requests_job: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      extend_swap_request_expiry: {
        Args: { additional_hours?: number; request_id: string }
        Returns: Json
      }
      find_slow_queries: {
        Args: { duration_threshold?: unknown }
        Returns: {
          calls: number
          max_time: number
          mean_time: number
          query: string
          total_time: number
        }[]
      }
      fix_existing_user_credits: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      fix_missing_user_profiles: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      force_complete_onboarding: {
        Args: { target_user_id: string }
        Returns: Json
      }
      gbt_bit_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bpchar_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bytea_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_inet_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_numeric_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_text_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_timetz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_tstz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      generate_avatar_url: {
        Args: { file_extension?: string; user_uuid: string }
        Returns: string
      }
      generate_referral_code: {
        Args: { user_id: string }
        Returns: string
      }
      generate_user_referral_code: {
        Args: { p_first_name: string; p_user_id: string }
        Returns: string
      }
      generate_verification_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      geocode_address: {
        Args: { address_text: string }
        Returns: Json
      }
      get_admin_redirect_only: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_admin_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_all_available_properties: {
        Args: Record<PropertyKey, never>
        Returns: {
          bathrooms: number
          bedrooms: number
          city: string
          country: string
          created_at: string
          id: string
          main_image_url: string
          owner_avatar_url: string
          owner_first_name: string
          title: string
        }[]
      }
      get_all_properties_for_map: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_all_properties_listing: {
        Args:
          | Record<PropertyKey, never>
          | {
              exclude_featured?: boolean
              exclude_latest_members?: boolean
              limit_count?: number
              offset_count?: number
            }
        Returns: {
          address: string
          amenity_count: number
          avatar_url: string
          avg_rating: number
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          created_at: string
          description: string
          first_name: string
          image_count: number
          is_available: boolean
          main_image_url: string
          pets_friendly: boolean
          property_id: string
          property_type: string
          review_count: number
          square_metres: number
          title: string
          user_id: string
          username: string
        }[]
      }
      get_all_properties_no_filter: {
        Args: Record<PropertyKey, never>
        Returns: {
          amenities: string[]
          avatar_url: string
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          created_at: string
          description: string
          first_name: string
          general_area: string
          id: string
          images: Json[]
          last_name: string
          latitude: number
          longitude: number
          main_image_url: string
          pets_friendly: boolean
          property_type: string
          square_metres: number
          title: string
          updated_at: string
          user_id: string
          username: string
        }[]
      }
      get_all_properties_simple: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          main_image_url: string
          title: string
          user_id: string
        }[]
      }
      get_avatar_url: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_cached_properties: {
        Args: {
          exclude_own?: boolean
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          amenities: string[]
          avatar_url: string
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          created_at: string
          description: string
          first_name: string
          general_area: string
          id: string
          images: Json[]
          last_name: string
          latitude: number
          longitude: number
          main_image_url: string
          pets_friendly: boolean
          property_type: string
          square_metres: number
          title: string
          updated_at: string
          user_id: string
          username: string
        }[]
      }
      get_cached_properties_by_city: {
        Args: {
          exclude_own?: boolean
          limit_count?: number
          offset_count?: number
          search_city: string
        }
        Returns: {
          amenities: string[]
          avatar_url: string
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          created_at: string
          description: string
          first_name: string
          general_area: string
          id: string
          images: Json[]
          last_name: string
          latitude: number
          longitude: number
          main_image_url: string
          pets_friendly: boolean
          property_type: string
          square_metres: number
          title: string
          updated_at: string
          user_id: string
          username: string
        }[]
      }
      get_cached_property_by_id: {
        Args: { property_id: string }
        Returns: {
          amenities: string[]
          avatar_url: string
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          created_at: string
          description: string
          first_name: string
          general_area: string
          id: string
          images: Json[]
          last_name: string
          latitude: number
          longitude: number
          main_image_url: string
          pets_friendly: boolean
          property_type: string
          square_metres: number
          title: string
          updated_at: string
          user_id: string
          username: string
        }[]
      }
      get_credits_page_data: {
        Args: { p_user_id?: string }
        Returns: {
          credits: number
          is_admin: boolean
          referral_code: string
          referral_link: string
          share_message: string
          total_referrals: number
          user_email: string
          user_name: string
        }[]
      }
      get_credits_system_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_current_user_access: {
        Args: Record<PropertyKey, never>
        Returns: {
          approval_status: string
          can_access_full_app: boolean
          is_admin: boolean
          onboarding_completed: boolean
          user_type: string
        }[]
      }
      get_expiring_swap_requests: {
        Args: { hours_ahead?: number }
        Returns: {
          created_at: string
          expires_at: string
          guest_id: string
          host_id: string
          hours_until_expiry: number
          id: string
          property_id: string
        }[]
      }
      get_featured_destinations: {
        Args: { limit_count?: number }
        Returns: {
          available_properties: number
          avg_bedrooms: number
          avg_square_metres: number
          city: string
          country: string
          custom_description: string
          custom_image_url: string
          destination_id: string
          destination_name: string
          display_order: number
          featured_at: string
          highlight_color: string
          property_count: number
          sample_images: string[]
        }[]
      }
      get_featured_properties: {
        Args: Record<PropertyKey, never> | { limit_count?: number }
        Returns: {
          amenity_count: number
          avg_rating: number
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          description: string
          featured_at: string
          featured_position: number
          is_available: boolean
          main_image_url: string
          owner_avatar_url: string
          owner_username: string
          pets_friendly: boolean
          property_id: string
          property_type: string
          review_count: number
          square_metres: number
          title: string
        }[]
      }
      get_homepage_properties: {
        Args: {
          exclude_own?: boolean
          filter_bedrooms?: number
          filter_city?: string
          filter_country?: string
          filter_pets?: boolean
          page_offset?: number
          page_size?: number
        }
        Returns: {
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          created_at: string
          id: string
          medium_image_url: string
          owner_avatar: string
          owner_name: string
          pets_friendly: boolean
          property_type: string
          thumbnail_url: string
          title: string
          verified: boolean
        }[]
      }
      get_homepage_properties_cards: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          bathrooms: number
          bedrooms: number
          city: string
          country: string
          created_at: string
          first_name: string
          id: string
          image_count: number
          main_image_url: string
          title: string
        }[]
      }
      get_landing_page_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_latest_members_properties: {
        Args:
          | Record<PropertyKey, never>
          | { days_back?: number; limit_count?: number }
        Returns: {
          avatar_url: string
          bathrooms: number
          bedrooms: number
          city: string
          country: string
          created_at: string
          first_name: string
          id: string
          image_count: number
          main_image_url: string
          title: string
        }[]
      }
      get_map_coordinates: {
        Args: { property_id: string }
        Returns: Json
      }
      get_nearby_activities: {
        Args: { p_category?: string; p_property_id: string }
        Returns: {
          address: string
          category: string
          distance_meters: number
          google_url: string
          id: string
          latitude: number
          longitude: number
          name: string
          opening_hours: Json
          phone: string
          photos: string[]
          price_level: number
          rating: number
          website: string
        }[]
      }
      get_newsletter_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_notifications: {
        Args: {
          limit_count?: number
          offset_count?: number
          unread_only?: boolean
        }
        Returns: {
          body: string
          created_at: string
          data: Json
          id: string
          is_read: boolean
          read_at: string
          title: string
          type: string
        }[]
      }
      get_optimized_image_url: {
        Args: {
          format?: string
          height?: number
          original_url: string
          quality?: number
          width?: number
        }
        Returns: string
      }
      get_or_create_conversation: {
        Args: { swap_request?: string; user1: string; user2: string }
        Returns: string
      }
      get_pending_automation_tasks: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_pending_klaviyo_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          first_name: string
          landing_page_source: string
          last_name: string
          onboarding_completed: boolean
          phone_number: string
          referral_code: string
          user_id: string
          utm_campaign: string
          utm_medium: string
          utm_source: string
        }[]
      }
      get_pending_newsletter_klaviyo: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          destination_city: string
          email: string
          first_name: string
          id: string
          landing_page_source: string
          last_name: string
          utm_campaign: string
          utm_medium: string
          utm_source: string
        }[]
      }
      get_properties_for_display: {
        Args:
          | Record<PropertyKey, never>
          | {
              exclude_own_properties?: boolean
              limit_count?: number
              offset_count?: number
            }
        Returns: {
          bathrooms: number
          bedrooms: number
          city: string
          country: string
          created_at: string
          id: string
          main_image_url: string
          owner_avatar_url: string
          owner_first_name: string
          title: string
        }[]
      }
      get_properties_for_homepage: {
        Args: Record<PropertyKey, never>
        Returns: {
          bathrooms: number
          bedrooms: number
          city: string
          country: string
          created_at: string
          id: string
          main_image_url: string
          owner_avatar_url: string
          owner_first_name: string
          title: string
        }[]
      }
      get_properties_homepage: {
        Args: { limit_count?: number; offset_count?: number }
        Returns: {
          avatar_url: string
          bathrooms: number
          bedrooms: number
          city: string
          country: string
          created_at: string
          first_name: string
          id: string
          image_count: number
          main_image_url: string
          title: string
        }[]
      }
      get_properties_lightning_fast: {
        Args: { p_user_id?: string }
        Returns: {
          amenities: Json
          approval_status: string
          approved_at: string
          availability: Json
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          created_at: string
          description: string
          general_area: string
          id: string
          images: Json
          is_favorited: boolean
          is_visible: boolean
          latitude: number
          longitude: number
          main_image_url: string
          owner_avatar: string
          owner_name: string
          owner_type: string
          pets_friendly: boolean
          property_type: string
          square_metres: number
          title: string
          updated_at: string
          user_id: string
        }[]
      }
      get_properties_listing_count: {
        Args: { exclude_featured?: boolean; exclude_latest_members?: boolean }
        Returns: number
      }
      get_properties_optimized: {
        Args:
          | {
              exclude_own?: boolean
              filter_city?: string
              filter_country?: string
              limit_count?: number
              offset_count?: number
            }
          | {
              filter_city?: string
              filter_country?: string
              limit_count?: number
              offset_count?: number
            }
        Returns: {
          address: string
          amenities: string[]
          avatar_url: string
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          description: string
          first_name: string
          id: string
          images: Json
          last_name: string
          latitude: number
          longitude: number
          main_image_url: string
          pets_friendly: boolean
          property_type: string
          square_metres: number
          title: string
          user_id: string
          username: string
          verified: boolean
        }[]
      }
      get_properties_public: {
        Args: Record<PropertyKey, never>
        Returns: {
          amenities: Json
          availability: Json
          bathrooms: number
          bedrooms: number
          city: string
          country: string
          created_at: string
          description: string
          id: string
          images: Json
          main_image_url: string
          owner_name: string
          property_type: string
          square_metres: number
          title: string
        }[]
      }
      get_properties_with_full_details: {
        Args: Record<PropertyKey, never>
        Returns: {
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          created_at: string
          description: string
          id: string
          latitude: number
          longitude: number
          main_image_url: string
          owner_avatar_url: string
          owner_bio: string
          owner_first_name: string
          owner_last_name: string
          pets_friendly: boolean
          square_metres: number
          title: string
        }[]
      }
      get_property_coordinates: {
        Args: { property_id: string }
        Returns: Json
      }
      get_property_images_batch: {
        Args: { property_ids: string[] }
        Returns: {
          created_at: string
          image_url: string
          is_main: boolean
          property_id: string
        }[]
      }
      get_property_listings: {
        Args: { p_user_id?: string }
        Returns: {
          approval_status: string
          approved_at: string
          approved_by: string
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          created_at: string
          description: string
          general_area: string
          id: string
          latitude: number
          longitude: number
          main_image_url: string
          pets_friendly: boolean
          property_type: string
          square_metres: number
          title: string
          updated_at: string
          user_id: string
        }[]
      }
      get_property_listings_for_browsing: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string | null
          amenities: string[] | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          avatar_url: string | null
          bathrooms: number | null
          bedrooms: number | null
          children_friendly: boolean | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          featured_position: number | null
          first_name: string | null
          general_area: string | null
          id: string | null
          images: Json | null
          is_featured: boolean | null
          is_visible: boolean | null
          last_name: string | null
          latitude: number | null
          longitude: number | null
          main_image_url: string | null
          pets_friendly: boolean | null
          phone_number: string | null
          property_type: string | null
          rejection_reason: string | null
          square_metres: number | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }[]
      }
      get_property_location_data: {
        Args: { property_id: string }
        Returns: Json
      }
      get_property_map_data: {
        Args: { property_id?: string }
        Returns: {
          address: string
          bathrooms: number
          bedrooms: number
          city: string
          country: string
          id: string
          latitude: number
          longitude: number
          main_image_url: string
          property_type: string
          thumbnail_url: string
          title: string
        }[]
      }
      get_property_with_neighborhood: {
        Args: { property_id: string }
        Returns: {
          nearby_places: Json
          property: Json
        }[]
      }
      get_public_profile_safe: {
        Args: { target_user_id: string }
        Returns: Json
      }
      get_public_property_listings: {
        Args: Record<PropertyKey, never>
        Returns: {
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          main_image_url: string
          owner_avatar_url: string
          owner_first_name: string
          pets_friendly: boolean
          square_metres: number
          title: string
        }[]
      }
      get_referral_domain: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_referral_link: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_referral_stats: {
        Args: { user_uuid: string }
        Returns: Json
      }
      get_referrer_from_slug: {
        Args: { slug: string }
        Returns: Json
      }
      get_registration_status: {
        Args: { p_user_id?: string }
        Returns: Json
      }
      get_review_system_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_swap_request_with_expiry: {
        Args: { request_id: string }
        Returns: {
          created_at: string
          expires_at: string
          guest_id: string
          host_id: string
          host_message: string
          hours_remaining: number
          id: string
          is_expired: boolean
          property_id: string
          status: string
          type: string
          updated_at: string
        }[]
      }
      get_top_destinations: {
        Args: { limit_count?: number }
        Returns: {
          available_properties: number
          avg_bedrooms: number
          avg_square_metres: number
          center_lat: number
          center_lng: number
          city: string
          country: string
          destination: string
          destination_image: string
          host_count: number
          property_count: number
        }[]
      }
      get_unread_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_availability_slots: {
        Args: { property_uuid?: string }
        Returns: {
          created_at: string
          end_date: string
          has_accepted_requests: boolean
          has_pending_requests: boolean
          property_id: string
          property_title: string
          slot_id: string
          start_date: string
          total_requests: number
        }[]
      }
      get_user_average_ratings: {
        Args: { user_uuid: string }
        Returns: {
          accuracy_avg: number
          average_rating: number
          cleaning_avg: number
          communication_avg: number
          total_reviews: number
        }[]
      }
      get_user_credit_summary: {
        Args: { user_id_param: string }
        Returns: {
          current_credits: number
          recent_transactions: Json
          registration_bonus_received: boolean
          total_earned: number
          total_spent: number
        }[]
      }
      get_user_deletion_history: {
        Args: { limit_count?: number }
        Returns: {
          cleanup_completed: boolean
          created_at: string
          deleted_at: string
          deleted_user_id: string
          id: string
        }[]
      }
      get_user_favorites: {
        Args: { p_user_id?: string }
        Returns: {
          favorited_at: string
          id: string
          property_bathrooms: number
          property_bedrooms: number
          property_city: string
          property_country: string
          property_id: string
          property_main_image_url: string
          property_title: string
        }[]
      }
      get_user_notifications_optimized: {
        Args: { limit_count?: number; unread_only?: boolean; user_uuid: string }
        Returns: {
          body: string
          created_at: string
          data: Json
          notification_id: string
          read_at: string
          title: string
          type: string
        }[]
      }
      get_user_profile_data: {
        Args: { target_user_id: string }
        Returns: Json
      }
      get_user_properties: {
        Args: { p_user_id?: string }
        Returns: {
          address: string
          approval_status: string
          availability_slots_count: number
          bathrooms: number
          bedrooms: number
          children_friendly: boolean
          city: string
          country: string
          created_at: string
          description: string
          has_coordinates: boolean
          id: string
          image_count: number
          main_image_url: string
          pets_friendly: boolean
          property_type: string
          square_metres: number
          title: string
          updated_at: string
        }[]
      }
      get_user_referral_info: {
        Args: { p_user_id?: string }
        Returns: Json
      }
      get_user_referral_link: {
        Args: { p_user_id?: string }
        Returns: {
          credits: number
          full_link: string
          referral_code: string
          total_referrals: number
        }[]
      }
      get_user_referrals_safe: {
        Args: { user_uuid: string }
        Returns: {
          completed_at: string
          created_at: string
          id: string
          referred_user_exists: boolean
          status: string
        }[]
      }
      get_user_reviews: {
        Args: { limit_count?: number; user_uuid: string }
        Returns: {
          created_at: string
          id: string
          overall_rating: number
          rating_accuracy: number
          rating_cleaning: number
          rating_communication: number
          review_text: string
          reviewer_avatar_url: string
          reviewer_first_name: string
          reviewer_last_name: string
          swap_end_date: string
          swap_start_date: string
        }[]
      }
      get_user_status: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_user_status_bulletproof: {
        Args: { user_uuid: string }
        Returns: Json
      }
      get_user_status_fast: {
        Args: { user_uuid: string }
        Returns: Json
      }
      get_user_status_immediate: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_user_swap_requests_optimized: {
        Args: { filter_type?: string; user_uuid: string }
        Returns: {
          created_at: string
          expires_at: string
          guest_id: string
          guest_name: string
          host_id: string
          host_name: string
          property_id: string
          property_image: string
          property_title: string
          requested_end_date: string
          requested_start_date: string
          slot_id: string
          status: string
          swap_id: string
          swap_type: string
        }[]
      }
      get_user_verification_status: {
        Args: { p_user_id: string }
        Returns: Json
      }
      handle_avatar_upload: {
        Args: { p_file_path: string; p_user_id: string }
        Returns: Json
      }
      handle_test_phone_signup: {
        Args: { p_phone_number: string; p_user_id?: string }
        Returns: Json
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_admin_cached: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_admin_instant: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_conversation_participant: {
        Args: { conversation_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_own_property: {
        Args: { property_id: string }
        Returns: boolean
      }
      is_property_favorited: {
        Args: { p_property_id: string; p_user_id?: string }
        Returns: boolean
      }
      is_slot_available: {
        Args: {
          p_end_date: string
          p_exclude_slot_id?: string
          p_property_id: string
          p_start_date: string
        }
        Returns: boolean
      }
      is_test_phone_number: {
        Args: { phone: string }
        Returns: boolean
      }
      is_user_approved: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_user_in_conversation: {
        Args: { conversation_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_user_verified: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      mark_all_notifications_read: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      mark_as_test_phone: {
        Args: { p_phone_number: string }
        Returns: undefined
      }
      mark_klaviyo_sent: {
        Args: { p_user_ids: string[] }
        Returns: number
      }
      mark_notification_read: {
        Args: { is_read?: boolean; notification_id: string }
        Returns: boolean
      }
      mark_onboarding_complete: {
        Args: { p_skip_email_verification?: boolean; p_user_id: string }
        Returns: Json
      }
      move_completed_bookings_to_past_swaps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      normalize_phone_number: {
        Args: { phone: string }
        Returns: string
      }
      preview_user_deletion_impact: {
        Args: { target_user_id: string }
        Returns: Json
      }
      process_past_swaps_automation: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      process_referral_signup: {
        Args:
          | {
              p_new_user_email: string
              p_new_user_id: string
              p_referral_code: string
            }
          | {
              p_new_user_email: string
              p_new_user_id: string
              p_referral_code: string
            }
          | { referred_email: string; referrer_id: string }
        Returns: Json
      }
      property_has_coordinates: {
        Args: { property_id: string }
        Returns: boolean
      }
      public_check_phone_availability: {
        Args: { p_phone_number: string }
        Returns: Json
      }
      refresh_avatar_cache: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      refresh_nearby_activities_from_google: {
        Args: { p_force_refresh?: boolean; p_property_id: string }
        Returns: Json
      }
      refresh_property_listing_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_property_listing_view: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_top_destinations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reject_user: {
        Args: { reason?: string; user_uuid: string }
        Returns: undefined
      }
      request_phone_verification: {
        Args: { p_phone_number: string }
        Returns: Json
      }
      reset_klaviyo_status: {
        Args: { input_user_id: string }
        Returns: number
      }
      reset_newsletter_klaviyo_status: {
        Args: { subscriber_email: string }
        Returns: number
      }
      run_credits_system_maintenance: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      safe_delete_user: {
        Args: { confirmation_text?: string; target_user_id: string }
        Returns: Json
      }
      schedule_verification_cleanup: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      search_properties_fast: {
        Args: {
          limit_count?: number
          max_bedrooms?: number
          min_bedrooms?: number
          offset_count?: number
          search_city?: string
          search_country?: string
        }
        Returns: {
          avatar_url: string
          bathrooms: number
          bedrooms: number
          city: string
          country: string
          first_name: string
          id: string
          main_image_url: string
          title: string
          username: string
        }[]
      }
      send_user_to_klaviyo: {
        Args: { p_user_id: string }
        Returns: Json
      }
      service_role_delete_user: {
        Args: { target_user_id: string }
        Returns: Json
      }
      set_property_main_image: {
        Args: { p_image_id: string; p_property_id: string }
        Returns: boolean
      }
      should_show_onboarding: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      skip_user_onboarding: {
        Args: { user_email: string }
        Returns: Json
      }
      sync_all_pending_klaviyo_users: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      sync_user_verification_statuses: {
        Args: Record<PropertyKey, never>
        Returns: {
          changes_made: string[]
          email: string
          user_id: string
        }[]
      }
      test_avatar_display: {
        Args: { p_email?: string }
        Returns: {
          avatar_exists: boolean
          avatar_url: string
          file_size: number
          last_updated: string
          status: string
          test_url: string
        }[]
      }
      test_deletion_system: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      test_map_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      test_property_visibility: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      test_user_deletion_system: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      toggle_favorite: {
        Args: { p_property_id: string }
        Returns: Json
      }
      update_availability_slot: {
        Args: { p_end_date: string; p_slot_id: string; p_start_date: string }
        Returns: boolean
      }
      update_avatar_url: {
        Args: { p_file_extension?: string; p_user_id: string }
        Returns: string
      }
      update_destination_image: {
        Args: { destination_id: string; new_image_url: string }
        Returns: Json
      }
      update_missing_main_images: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_signup_attempt: {
        Args: { email_input: string }
        Returns: Json
      }
      validate_user_flow: {
        Args: Record<PropertyKey, never>
        Returns: {
          affected_users: number
          description: string
          issue_type: string
          recommendation: string
        }[]
      }
      verify_phone_code: {
        Args: { p_code: string; p_phone_number: string }
        Returns: Json
      }
      verify_user_phone: {
        Args: { phone_number?: string; target_user_id?: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
