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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          candidate_id: string
          cover_letter: string | null
          created_at: string
          cv_url: string | null
          id: string
          job_id: string
          match_score: number | null
          notes: string | null
          status: Database["public"]["Enums"]["application_status"]
        }
        Insert: {
          candidate_id: string
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          id?: string
          job_id: string
          match_score?: number | null
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
        }
        Update: {
          candidate_id?: string
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          id?: string
          job_id?: string
          match_score?: number | null
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_users: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_users_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_journey: {
        Row: {
          candidate_id: string
          close_note: string | null
          close_reason:
            | Database["public"]["Enums"]["journey_close_reason"]
            | null
          closed_at: string | null
          closed_stage: Database["public"]["Enums"]["journey_stage"] | null
          created_at: string
          current_stage: Database["public"]["Enums"]["journey_stage"]
          destination_city: string | null
          doc_contract: boolean
          doc_criminal_record: boolean
          doc_dni: boolean
          doc_medical: boolean
          doc_passport: boolean
          doc_precontract: boolean
          doc_social_security: boolean
          employer_company: string | null
          id: string
          inc_arrival_date: string | null
          inc_effective_start: string | null
          inc_flight_confirmed: boolean
          inc_housing_coordinated: boolean
          inc_travel_date: string | null
          mig_file_submitted: boolean
          mig_resolution: boolean
          mig_visa_approved: boolean
          mig_visa_started: boolean
          notes: string | null
          outcome: Database["public"]["Enums"]["journey_outcome"]
          position: string | null
          replaces_journey_id: string | null
          salary: number | null
          stage_message: string | null
          stage_updated_at: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          candidate_id: string
          close_note?: string | null
          close_reason?:
            | Database["public"]["Enums"]["journey_close_reason"]
            | null
          closed_at?: string | null
          closed_stage?: Database["public"]["Enums"]["journey_stage"] | null
          created_at?: string
          current_stage?: Database["public"]["Enums"]["journey_stage"]
          destination_city?: string | null
          doc_contract?: boolean
          doc_criminal_record?: boolean
          doc_dni?: boolean
          doc_medical?: boolean
          doc_passport?: boolean
          doc_precontract?: boolean
          doc_social_security?: boolean
          employer_company?: string | null
          id?: string
          inc_arrival_date?: string | null
          inc_effective_start?: string | null
          inc_flight_confirmed?: boolean
          inc_housing_coordinated?: boolean
          inc_travel_date?: string | null
          mig_file_submitted?: boolean
          mig_resolution?: boolean
          mig_visa_approved?: boolean
          mig_visa_started?: boolean
          notes?: string | null
          outcome?: Database["public"]["Enums"]["journey_outcome"]
          position?: string | null
          replaces_journey_id?: string | null
          salary?: number | null
          stage_message?: string | null
          stage_updated_at?: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          close_note?: string | null
          close_reason?:
            | Database["public"]["Enums"]["journey_close_reason"]
            | null
          closed_at?: string | null
          closed_stage?: Database["public"]["Enums"]["journey_stage"] | null
          created_at?: string
          current_stage?: Database["public"]["Enums"]["journey_stage"]
          destination_city?: string | null
          doc_contract?: boolean
          doc_criminal_record?: boolean
          doc_dni?: boolean
          doc_medical?: boolean
          doc_passport?: boolean
          doc_precontract?: boolean
          doc_social_security?: boolean
          employer_company?: string | null
          id?: string
          inc_arrival_date?: string | null
          inc_effective_start?: string | null
          inc_flight_confirmed?: boolean
          inc_housing_coordinated?: boolean
          inc_travel_date?: string | null
          mig_file_submitted?: boolean
          mig_resolution?: boolean
          mig_visa_approved?: boolean
          mig_visa_started?: boolean
          notes?: string | null
          outcome?: Database["public"]["Enums"]["journey_outcome"]
          position?: string | null
          replaces_journey_id?: string | null
          salary?: number | null
          stage_message?: string | null
          stage_updated_at?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_journey_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_journey_replaces_journey_id_fkey"
            columns: ["replaces_journey_id"]
            isOneToOne: false
            referencedRelation: "candidate_journey"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_languages: {
        Row: {
          candidate_id: string
          code: string
          id: string
          level: Database["public"]["Enums"]["language_level"]
        }
        Insert: {
          candidate_id: string
          code: string
          id?: string
          level: Database["public"]["Enums"]["language_level"]
        }
        Update: {
          candidate_id?: string
          code?: string
          id?: string
          level?: Database["public"]["Enums"]["language_level"]
        }
        Relationships: [
          {
            foreignKeyName: "candidate_languages_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_notes: {
        Row: {
          body: string
          candidate_id: string
          created_at: string
          employer_id: string
          id: string
          updated_at: string
        }
        Insert: {
          body: string
          candidate_id: string
          created_at?: string
          employer_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          body?: string
          candidate_id?: string
          created_at?: string
          employer_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_notes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_notes_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_ratings: {
        Row: {
          body: string | null
          candidate_id: string
          created_at: string
          employer_id: string
          id: string
          score: number
        }
        Insert: {
          body?: string | null
          candidate_id: string
          created_at?: string
          employer_id: string
          id?: string
          score: number
        }
        Update: {
          body?: string | null
          candidate_id?: string
          created_at?: string
          employer_id?: string
          id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "candidate_ratings_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_ratings_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_skills: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          level: Database["public"]["Enums"]["skill_level"]
          skill: string
          years: number | null
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["skill_level"]
          skill: string
          years?: number | null
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["skill_level"]
          skill?: string
          years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_skills_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_tags: {
        Row: {
          candidate_id: string
          color: string | null
          created_at: string
          employer_id: string
          id: string
          label: string
        }
        Insert: {
          candidate_id: string
          color?: string | null
          created_at?: string
          employer_id: string
          id?: string
          label: string
        }
        Update: {
          candidate_id?: string
          color?: string | null
          created_at?: string
          employer_id?: string
          id?: string
          label?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_tags_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_tags_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          availability: Database["public"]["Enums"]["availability_status"]
          available_from: string | null
          avatar_url: string | null
          bio: string | null
          commute_radius_km: number | null
          country_of_origin: string | null
          created_at: string
          current_role: string | null
          cv_url: string | null
          date_of_birth: string | null
          desired_salary_max: number | null
          desired_salary_min: number | null
          document_number: string | null
          document_type: string | null
          education: Json | null
          email: string | null
          embedding: string | null
          experience: Json | null
          full_name: string | null
          github_url: string | null
          has_nie: boolean | null
          has_tie: boolean | null
          headline: string | null
          homologation:
            | Database["public"]["Enums"]["homologation_status"]
            | null
          id: string
          intro_video_url: string | null
          is_imported: boolean
          is_public: boolean
          languages: Json | null
          linkedin_url: string | null
          location_city: string | null
          location_country: string | null
          location_lat: number | null
          location_lng: number | null
          modality: Database["public"]["Enums"]["work_modality"] | null
          open_to_relocate: boolean | null
          open_to_remote: boolean | null
          phone: string | null
          portfolio_url: string | null
          preferred_locations: string[] | null
          profile_id: string | null
          recruitment_source: string | null
          search_vector: unknown
          skills: string[] | null
          slug: string | null
          spanish: Database["public"]["Enums"]["spanish_level"] | null
          start_availability: string | null
          updated_at: string
          verified: boolean | null
          views_count: number
          website_url: string | null
          willing_to_relocate: boolean | null
          work_permit: Database["public"]["Enums"]["work_permit_status"] | null
          years_experience: number | null
          years_in_spain: number | null
        }
        Insert: {
          availability?: Database["public"]["Enums"]["availability_status"]
          available_from?: string | null
          avatar_url?: string | null
          bio?: string | null
          commute_radius_km?: number | null
          country_of_origin?: string | null
          created_at?: string
          current_role?: string | null
          cv_url?: string | null
          date_of_birth?: string | null
          desired_salary_max?: number | null
          desired_salary_min?: number | null
          document_number?: string | null
          document_type?: string | null
          education?: Json | null
          email?: string | null
          embedding?: string | null
          experience?: Json | null
          full_name?: string | null
          github_url?: string | null
          has_nie?: boolean | null
          has_tie?: boolean | null
          headline?: string | null
          homologation?:
            | Database["public"]["Enums"]["homologation_status"]
            | null
          id?: string
          intro_video_url?: string | null
          is_imported?: boolean
          is_public?: boolean
          languages?: Json | null
          linkedin_url?: string | null
          location_city?: string | null
          location_country?: string | null
          location_lat?: number | null
          location_lng?: number | null
          modality?: Database["public"]["Enums"]["work_modality"] | null
          open_to_relocate?: boolean | null
          open_to_remote?: boolean | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_locations?: string[] | null
          profile_id?: string | null
          recruitment_source?: string | null
          search_vector?: unknown
          skills?: string[] | null
          slug?: string | null
          spanish?: Database["public"]["Enums"]["spanish_level"] | null
          start_availability?: string | null
          updated_at?: string
          verified?: boolean | null
          views_count?: number
          website_url?: string | null
          willing_to_relocate?: boolean | null
          work_permit?: Database["public"]["Enums"]["work_permit_status"] | null
          years_experience?: number | null
          years_in_spain?: number | null
        }
        Update: {
          availability?: Database["public"]["Enums"]["availability_status"]
          available_from?: string | null
          avatar_url?: string | null
          bio?: string | null
          commute_radius_km?: number | null
          country_of_origin?: string | null
          created_at?: string
          current_role?: string | null
          cv_url?: string | null
          date_of_birth?: string | null
          desired_salary_max?: number | null
          desired_salary_min?: number | null
          document_number?: string | null
          document_type?: string | null
          education?: Json | null
          email?: string | null
          embedding?: string | null
          experience?: Json | null
          full_name?: string | null
          github_url?: string | null
          has_nie?: boolean | null
          has_tie?: boolean | null
          headline?: string | null
          homologation?:
            | Database["public"]["Enums"]["homologation_status"]
            | null
          id?: string
          intro_video_url?: string | null
          is_imported?: boolean
          is_public?: boolean
          languages?: Json | null
          linkedin_url?: string | null
          location_city?: string | null
          location_country?: string | null
          location_lat?: number | null
          location_lng?: number | null
          modality?: Database["public"]["Enums"]["work_modality"] | null
          open_to_relocate?: boolean | null
          open_to_remote?: boolean | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_locations?: string[] | null
          profile_id?: string | null
          recruitment_source?: string | null
          search_vector?: unknown
          skills?: string[] | null
          slug?: string | null
          spanish?: Database["public"]["Enums"]["spanish_level"] | null
          start_availability?: string | null
          updated_at?: string
          verified?: boolean | null
          views_count?: number
          website_url?: string | null
          willing_to_relocate?: boolean | null
          work_permit?: Database["public"]["Enums"]["work_permit_status"] | null
          years_experience?: number | null
          years_in_spain?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address_province: string | null
          billing_address: string | null
          billing_email: string | null
          billing_tax_id: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_role: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          id: string
          industry: string | null
          legal_name: string | null
          location: string | null
          logo_url: string | null
          name: string
          owner_id: string
          size: string | null
          slug: string
          tax_id: string | null
          verified: boolean
          website: string | null
        }
        Insert: {
          address_province?: string | null
          billing_address?: string | null
          billing_email?: string | null
          billing_tax_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_role?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          industry?: string | null
          legal_name?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          owner_id: string
          size?: string | null
          slug: string
          tax_id?: string | null
          verified?: boolean
          website?: string | null
        }
        Update: {
          address_province?: string | null
          billing_address?: string | null
          billing_email?: string | null
          billing_tax_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_role?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          industry?: string | null
          legal_name?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          owner_id?: string
          size?: string | null
          slug?: string
          tax_id?: string | null
          verified?: boolean
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_reviews: {
        Row: {
          body: string | null
          candidate_id: string
          company_id: string
          created_at: string
          id: string
          is_public: boolean
          score: number
        }
        Insert: {
          body?: string | null
          candidate_id: string
          company_id: string
          created_at?: string
          id?: string
          is_public?: boolean
          score: number
        }
        Update: {
          body?: string | null
          candidate_id?: string
          company_id?: string
          created_at?: string
          id?: string
          is_public?: boolean
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_reviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          handled: boolean
          handled_at: string | null
          handled_by: string | null
          id: string
          message: string
          name: string
          phone: string | null
          role: string
          sector: string | null
          source_path: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          handled?: boolean
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
          role: string
          sector?: string | null
          source_path?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          handled?: boolean
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          role?: string
          sector?: string | null
          source_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          reason: Database["public"]["Enums"]["report_reason"]
          reporter_id: string | null
          resolution_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["report_target"]
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          reason: Database["public"]["Enums"]["report_reason"]
          reporter_id?: string | null
          resolution_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["report_target"]
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["report_reason"]
          reporter_id?: string | null
          resolution_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id?: string
          target_type?: Database["public"]["Enums"]["report_target"]
        }
        Relationships: [
          {
            foreignKeyName: "content_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          candidate_id: string
          created_at: string
          employer_id: string
          id: string
          last_message_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          employer_id: string
          id?: string
          last_message_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          employer_id?: string
          id?: string
          last_message_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      device_tokens: {
        Row: {
          created_at: string
          environment: string | null
          id: string
          platform: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          environment?: string | null
          id?: string
          platform: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          environment?: string | null
          id?: string
          platform?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expediente_observations: {
        Row: {
          body: string
          category: Database["public"]["Enums"]["observation_category"]
          created_at: string
          created_by: string | null
          id: string
          is_pinned: boolean
          journey_id: string
          updated_at: string
        }
        Insert: {
          body: string
          category?: Database["public"]["Enums"]["observation_category"]
          created_at?: string
          created_by?: string | null
          id?: string
          is_pinned?: boolean
          journey_id: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: Database["public"]["Enums"]["observation_category"]
          created_at?: string
          created_by?: string | null
          id?: string
          is_pinned?: boolean
          journey_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expediente_observations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expediente_observations_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "candidate_journey"
            referencedColumns: ["id"]
          },
        ]
      }
      expediente_payments: {
        Row: {
          amount: number
          concept: Database["public"]["Enums"]["payment_concept"]
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          due_date: string | null
          id: string
          journey_id: string
          paid_at: string | null
          payment_method: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          concept?: Database["public"]["Enums"]["payment_concept"]
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          due_date?: string | null
          id?: string
          journey_id: string
          paid_at?: string | null
          payment_method?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          concept?: Database["public"]["Enums"]["payment_concept"]
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          due_date?: string | null
          id?: string
          journey_id?: string
          paid_at?: string | null
          payment_method?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expediente_payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expediente_payments_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "candidate_journey"
            referencedColumns: ["id"]
          },
        ]
      }
      expediente_receipts: {
        Row: {
          created_at: string
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          journey_id: string
          payment_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          journey_id: string
          payment_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          journey_id?: string
          payment_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expediente_receipts_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "candidate_journey"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expediente_receipts_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "expediente_payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expediente_receipts_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          candidate_id: string
          created_at: string
          employer_id: string
          id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          employer_id: string
          id?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          employer_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_alerts: {
        Row: {
          active: boolean | null
          candidate_id: string
          filters: Json | null
          frequency: string | null
          id: string
          last_sent_at: string | null
          query: string | null
        }
        Insert: {
          active?: boolean | null
          candidate_id: string
          filters?: Json | null
          frequency?: string | null
          id?: string
          last_sent_at?: string | null
          query?: string | null
        }
        Update: {
          active?: boolean | null
          candidate_id?: string
          filters?: Json | null
          frequency?: string | null
          id?: string
          last_sent_at?: string | null
          query?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_alerts_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      job_views: {
        Row: {
          created_at: string
          id: string
          job_id: string
          viewer_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          viewer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_views_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          applications_count: number | null
          benefits: string | null
          company_id: string
          created_at: string
          currency: string | null
          description: string
          embedding: string | null
          experience_level:
            | Database["public"]["Enums"]["experience_level"]
            | null
          expires_at: string | null
          featured: boolean | null
          id: string
          job_type: Database["public"]["Enums"]["job_type"]
          location: string | null
          published_at: string | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          search_vector: unknown
          skills: string[] | null
          slug: string
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string
          views_count: number | null
          work_mode: Database["public"]["Enums"]["work_mode"]
        }
        Insert: {
          applications_count?: number | null
          benefits?: string | null
          company_id: string
          created_at?: string
          currency?: string | null
          description: string
          embedding?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          expires_at?: string | null
          featured?: boolean | null
          id?: string
          job_type: Database["public"]["Enums"]["job_type"]
          location?: string | null
          published_at?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          search_vector?: unknown
          skills?: string[] | null
          slug: string
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string
          views_count?: number | null
          work_mode: Database["public"]["Enums"]["work_mode"]
        }
        Update: {
          applications_count?: number | null
          benefits?: string | null
          company_id?: string
          created_at?: string
          currency?: string | null
          description?: string
          embedding?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          expires_at?: string | null
          featured?: boolean | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: string | null
          published_at?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          search_vector?: unknown
          skills?: string[] | null
          slug?: string
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string
          views_count?: number | null
          work_mode?: Database["public"]["Enums"]["work_mode"]
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_stage_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          journey_id: string
          notes: string | null
          stage: Database["public"]["Enums"]["journey_stage"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          journey_id: string
          notes?: string | null
          stage: Database["public"]["Enums"]["journey_stage"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          journey_id?: string
          notes?: string | null
          stage?: Database["public"]["Enums"]["journey_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "journey_stage_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_stage_history_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "candidate_journey"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          body: string
          created_at: string
          employer_id: string
          id: string
          name: string
        }
        Insert: {
          body: string
          created_at?: string
          employer_id: string
          id?: string
          name: string
        }
        Update: {
          body?: string
          created_at?: string
          employer_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
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
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          channel: string
          enabled: boolean
          id: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          channel: string
          enabled?: boolean
          id?: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          channel?: string
          enabled?: boolean
          id?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          payload: Json
          read_at: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload?: Json
          read_at?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          read_at?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          color: string | null
          created_at: string
          employer_id: string
          id: string
          is_terminal: boolean | null
          name: string
          position: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          employer_id: string
          id?: string
          is_terminal?: boolean | null
          name: string
          position?: number
        }
        Update: {
          color?: string | null
          created_at?: string
          employer_id?: string
          id?: string
          is_terminal?: boolean | null
          name?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          job_id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          job_id: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          alert_frequency: Database["public"]["Enums"]["alert_frequency"]
          created_at: string
          filters: Json
          id: string
          last_alert_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          alert_frequency?: Database["public"]["Enums"]["alert_frequency"]
          created_at?: string
          filters: Json
          id?: string
          last_alert_at?: string | null
          name: string
          user_id: string
        }
        Update: {
          alert_frequency?: Database["public"]["Enums"]["alert_frequency"]
          created_at?: string
          filters?: Json
          id?: string
          last_alert_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      selection_processes: {
        Row: {
          candidate_id: string
          company_id: string | null
          created_at: string
          employer_id: string
          id: string
          job_id: string | null
          notes: string | null
          stage: Database["public"]["Enums"]["process_stage"]
          updated_at: string
        }
        Insert: {
          candidate_id: string
          company_id?: string | null
          created_at?: string
          employer_id: string
          id?: string
          job_id?: string | null
          notes?: string | null
          stage?: Database["public"]["Enums"]["process_stage"]
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          company_id?: string | null
          created_at?: string
          employer_id?: string
          id?: string
          job_id?: string | null
          notes?: string | null
          stage?: Database["public"]["Enums"]["process_stage"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "selection_processes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selection_processes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selection_processes_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selection_processes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      compute_match_score: {
        Args: { p_candidate_id: string; p_job_id: string }
        Returns: number
      }
      is_blocked_between: { Args: { a: string; b: string }; Returns: boolean }
      profile_completeness: {
        Args: { p_candidate_id: string }
        Returns: number
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      alert_frequency: "off" | "daily" | "weekly" | "instant"
      application_status:
        | "submitted"
        | "reviewing"
        | "shortlisted"
        | "rejected"
        | "hired"
      availability_status: "open" | "passive" | "closed"
      experience_level: "entry" | "junior" | "mid" | "senior" | "lead"
      homologation_status:
        | "verified"
        | "in_progress"
        | "not_required"
        | "not_started"
        | "not_specified"
      job_status: "draft" | "published" | "paused" | "expired" | "archived"
      job_type:
        | "full_time"
        | "part_time"
        | "contract"
        | "internship"
        | "freelance"
      journey_close_reason:
        | "renuncia_candidato"
        | "denegacion_extranjeria"
        | "denegacion_visado"
        | "empresa_retira"
        | "documentacion_incompleta"
        | "no_supera_medico"
        | "perdida_contacto"
        | "no_incorporacion"
        | "baja_temprana"
        | "otro"
      journey_outcome: "en_curso" | "incorporado" | "cerrado"
      journey_stage:
        | "seleccionado"
        | "inicio_proceso"
        | "expediente_presentado"
        | "revision_administrativa"
        | "evaluacion_expediente"
        | "coordinacion_incorporacion"
        | "esperando_resolucion"
        | "resolucion_favorable"
        | "gestion_consular"
        | "preparando_viaje"
        | "bienvenido"
      language_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "native"
      notification_type:
        | "message_received"
        | "application_received"
        | "application_status_changed"
        | "process_stage_changed"
        | "saved_search_match"
        | "system"
      observation_category:
        | "administrativo"
        | "comercial"
        | "legal"
        | "operativo"
        | "incidencia"
        | "general"
      payment_concept:
        | "tasa_extranjeria"
        | "honorarios_migria"
        | "tasa_consular"
        | "seguro_medico"
        | "vuelo"
        | "alojamiento"
        | "otros"
      payment_status: "pendiente" | "parcial" | "completado" | "reembolsado"
      process_stage:
        | "new"
        | "contacted"
        | "interview"
        | "offer"
        | "hired"
        | "rejected"
      report_reason:
        | "spam"
        | "fraude"
        | "contenido_ofensivo"
        | "acoso"
        | "datos_falsos"
        | "suplantacion"
        | "otro"
      report_status: "abierta" | "en_revision" | "resuelta" | "descartada"
      report_target:
        | "candidate_profile"
        | "job"
        | "company"
        | "message"
        | "conversation"
      skill_level: "basic" | "medium" | "advanced" | "expert"
      spanish_level: "native" | "C2" | "C1" | "B2" | "B1" | "A2" | "A1"
      user_role: "candidate" | "employer" | "admin"
      work_modality: "on_site" | "remote" | "hybrid"
      work_mode: "on_site" | "hybrid" | "remote"
      work_permit_status:
        | "eu_citizen"
        | "permanent"
        | "temporary"
        | "in_application"
        | "needs_sponsorship"
        | "not_specified"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_frequency: ["off", "daily", "weekly", "instant"],
      application_status: [
        "submitted",
        "reviewing",
        "shortlisted",
        "rejected",
        "hired",
      ],
      availability_status: ["open", "passive", "closed"],
      experience_level: ["entry", "junior", "mid", "senior", "lead"],
      homologation_status: [
        "verified",
        "in_progress",
        "not_required",
        "not_started",
        "not_specified",
      ],
      job_status: ["draft", "published", "paused", "expired", "archived"],
      job_type: [
        "full_time",
        "part_time",
        "contract",
        "internship",
        "freelance",
      ],
      journey_close_reason: [
        "renuncia_candidato",
        "denegacion_extranjeria",
        "denegacion_visado",
        "empresa_retira",
        "documentacion_incompleta",
        "no_supera_medico",
        "perdida_contacto",
        "no_incorporacion",
        "baja_temprana",
        "otro",
      ],
      journey_outcome: ["en_curso", "incorporado", "cerrado"],
      journey_stage: [
        "seleccionado",
        "inicio_proceso",
        "expediente_presentado",
        "revision_administrativa",
        "evaluacion_expediente",
        "coordinacion_incorporacion",
        "esperando_resolucion",
        "resolucion_favorable",
        "gestion_consular",
        "preparando_viaje",
        "bienvenido",
      ],
      language_level: ["A1", "A2", "B1", "B2", "C1", "C2", "native"],
      notification_type: [
        "message_received",
        "application_received",
        "application_status_changed",
        "process_stage_changed",
        "saved_search_match",
        "system",
      ],
      observation_category: [
        "administrativo",
        "comercial",
        "legal",
        "operativo",
        "incidencia",
        "general",
      ],
      payment_concept: [
        "tasa_extranjeria",
        "honorarios_migria",
        "tasa_consular",
        "seguro_medico",
        "vuelo",
        "alojamiento",
        "otros",
      ],
      payment_status: ["pendiente", "parcial", "completado", "reembolsado"],
      process_stage: [
        "new",
        "contacted",
        "interview",
        "offer",
        "hired",
        "rejected",
      ],
      report_reason: [
        "spam",
        "fraude",
        "contenido_ofensivo",
        "acoso",
        "datos_falsos",
        "suplantacion",
        "otro",
      ],
      report_status: ["abierta", "en_revision", "resuelta", "descartada"],
      report_target: [
        "candidate_profile",
        "job",
        "company",
        "message",
        "conversation",
      ],
      skill_level: ["basic", "medium", "advanced", "expert"],
      spanish_level: ["native", "C2", "C1", "B2", "B1", "A2", "A1"],
      user_role: ["candidate", "employer", "admin"],
      work_modality: ["on_site", "remote", "hybrid"],
      work_mode: ["on_site", "hybrid", "remote"],
      work_permit_status: [
        "eu_citizen",
        "permanent",
        "temporary",
        "in_application",
        "needs_sponsorship",
        "not_specified",
      ],
    },
  },
} as const
