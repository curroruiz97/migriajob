/**
 * Tipos generados de la base de datos Supabase del proyecto MigriaJob
 * (project_id: pagxshxrvkoeyjwzxqrl).
 *
 * Para regenerar tras cambios en el schema (requiere login o
 * SUPABASE_ACCESS_TOKEN; NO uses `>` para sobrescribir este archivo, usa un
 * temporal y revísalo antes):
 *   npx supabase login
 *   npx supabase gen types typescript --project-id pagxshxrvkoeyjwzxqrl > lib/supabase/types.new.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" }
  public: {
    Tables: {
      applications: {
        Row: {
          candidate_id: string; cover_letter: string | null; created_at: string;
          cv_url: string | null; id: string; job_id: string;
          match_score: number | null; notes: string | null;
          status: Database["public"]["Enums"]["application_status"]
        }
        Insert: {
          candidate_id: string; cover_letter?: string | null; created_at?: string;
          cv_url?: string | null; id?: string; job_id: string;
          match_score?: number | null; notes?: string | null;
          status?: Database["public"]["Enums"]["application_status"]
        }
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>
        Relationships: []
      }
      candidate_journey: {
        Row: {
          id: string; candidate_id: string; start_date: string | null; position: string | null
          employer_company: string | null; salary: number | null; destination_city: string | null
          doc_dni: boolean; doc_passport: boolean; doc_criminal_record: boolean; doc_medical: boolean
          doc_precontract: boolean; doc_contract: boolean; doc_social_security: boolean
          mig_file_submitted: boolean; mig_resolution: boolean; mig_visa_started: boolean; mig_visa_approved: boolean
          inc_flight_confirmed: boolean; inc_housing_coordinated: boolean
          inc_travel_date: string | null; inc_arrival_date: string | null; inc_effective_start: string | null
          notes: string | null; created_at: string; updated_at: string
          current_stage: Database["public"]["Enums"]["journey_stage"]
          stage_updated_at: string; stage_message: string | null
        }
        Insert: {
          id?: string; candidate_id: string; start_date?: string | null; position?: string | null
          employer_company?: string | null; salary?: number | null; destination_city?: string | null
          doc_dni?: boolean; doc_passport?: boolean; doc_criminal_record?: boolean; doc_medical?: boolean
          doc_precontract?: boolean; doc_contract?: boolean; doc_social_security?: boolean
          mig_file_submitted?: boolean; mig_resolution?: boolean; mig_visa_started?: boolean; mig_visa_approved?: boolean
          inc_flight_confirmed?: boolean; inc_housing_coordinated?: boolean
          inc_travel_date?: string | null; inc_arrival_date?: string | null; inc_effective_start?: string | null
          notes?: string | null; created_at?: string; updated_at?: string
          current_stage?: Database["public"]["Enums"]["journey_stage"]
          stage_updated_at?: string; stage_message?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["candidate_journey"]["Insert"]>
        Relationships: []
      }
      journey_stage_history: {
        Row: { id: string; journey_id: string; stage: Database["public"]["Enums"]["journey_stage"]; notes: string | null; changed_by: string | null; created_at: string }
        Insert: { id?: string; journey_id: string; stage: Database["public"]["Enums"]["journey_stage"]; notes?: string | null; changed_by?: string | null; created_at?: string }
        Update: Partial<Database["public"]["Tables"]["journey_stage_history"]["Insert"]>
        Relationships: []
      }
      expediente_payments: {
        Row: { id: string; journey_id: string; concept: Database["public"]["Enums"]["payment_concept"]; description: string | null; amount: number; currency: string; status: Database["public"]["Enums"]["payment_status"]; due_date: string | null; paid_at: string | null; payment_method: string | null; reference_number: string | null; created_by: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; journey_id: string; concept?: Database["public"]["Enums"]["payment_concept"]; description?: string | null; amount: number; currency?: string; status?: Database["public"]["Enums"]["payment_status"]; due_date?: string | null; paid_at?: string | null; payment_method?: string | null; reference_number?: string | null; created_by?: string | null; created_at?: string; updated_at?: string }
        Update: Partial<Database["public"]["Tables"]["expediente_payments"]["Insert"]>
        Relationships: []
      }
      expediente_receipts: {
        Row: { id: string; journey_id: string; payment_id: string | null; file_name: string; file_url: string; file_type: string | null; file_size: number | null; description: string | null; uploaded_by: string | null; created_at: string }
        Insert: { id?: string; journey_id: string; payment_id?: string | null; file_name: string; file_url: string; file_type?: string | null; file_size?: number | null; description?: string | null; uploaded_by?: string | null; created_at?: string }
        Update: Partial<Database["public"]["Tables"]["expediente_receipts"]["Insert"]>
        Relationships: []
      }
      expediente_observations: {
        Row: { id: string; journey_id: string; category: Database["public"]["Enums"]["observation_category"]; body: string; is_pinned: boolean; created_by: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; journey_id: string; category?: Database["public"]["Enums"]["observation_category"]; body: string; is_pinned?: boolean; created_by?: string | null; created_at?: string; updated_at?: string }
        Update: Partial<Database["public"]["Tables"]["expediente_observations"]["Insert"]>
        Relationships: []
      }
      candidate_languages: {
        Row: { candidate_id: string; code: string; id: string; level: Database["public"]["Enums"]["language_level"] }
        Insert: { candidate_id: string; code: string; id?: string; level: Database["public"]["Enums"]["language_level"] }
        Update: Partial<Database["public"]["Tables"]["candidate_languages"]["Insert"]>
        Relationships: []
      }
      candidate_notes: {
        Row: { body: string; candidate_id: string; created_at: string; employer_id: string; id: string; updated_at: string }
        Insert: { body: string; candidate_id: string; created_at?: string; employer_id: string; id?: string; updated_at?: string }
        Update: Partial<Database["public"]["Tables"]["candidate_notes"]["Insert"]>
        Relationships: []
      }
      candidate_ratings: {
        Row: { body: string | null; candidate_id: string; created_at: string; employer_id: string; id: string; score: number }
        Insert: { body?: string | null; candidate_id: string; created_at?: string; employer_id: string; id?: string; score: number }
        Update: Partial<Database["public"]["Tables"]["candidate_ratings"]["Insert"]>
        Relationships: []
      }
      candidate_skills: {
        Row: { candidate_id: string; created_at: string; id: string; level: Database["public"]["Enums"]["skill_level"]; skill: string; years: number | null }
        Insert: { candidate_id: string; created_at?: string; id?: string; level?: Database["public"]["Enums"]["skill_level"]; skill: string; years?: number | null }
        Update: Partial<Database["public"]["Tables"]["candidate_skills"]["Insert"]>
        Relationships: []
      }
      candidate_tags: {
        Row: { candidate_id: string; color: string | null; created_at: string; employer_id: string; id: string; label: string }
        Insert: { candidate_id: string; color?: string | null; created_at?: string; employer_id: string; id?: string; label: string }
        Update: Partial<Database["public"]["Tables"]["candidate_tags"]["Insert"]>
        Relationships: []
      }
      candidates: {
        Row: {
          availability: Database["public"]["Enums"]["availability_status"]
          available_from: string | null; avatar_url: string | null; bio: string | null
          commute_radius_km: number | null; country_of_origin: string | null
          created_at: string; current_role: string | null
          cv_url: string | null; desired_salary_max: number | null; desired_salary_min: number | null
          education: Json | null; embedding: string | null; experience: Json | null
          github_url: string | null; has_nie: boolean | null; has_tie: boolean | null
          headline: string | null
          homologation: Database["public"]["Enums"]["homologation_status"] | null
          document_number: string | null; document_type: string | null
          email: string | null; full_name: string | null
          id: string
          intro_video_url: string | null; is_imported: boolean; is_public: boolean; languages: Json | null
          linkedin_url: string | null; location_city: string | null; location_country: string | null
          location_lat: number | null; location_lng: number | null
          modality: Database["public"]["Enums"]["work_modality"] | null
          open_to_relocate: boolean | null; open_to_remote: boolean | null
          phone: string | null; portfolio_url: string | null; profile_id: string | null
          recruitment_source: string | null
          search_vector: unknown; skills: string[] | null; slug: string | null
          spanish: Database["public"]["Enums"]["spanish_level"] | null
          updated_at: string; verified: boolean | null
          views_count: number; website_url: string | null
          work_permit: Database["public"]["Enums"]["work_permit_status"] | null
          years_experience: number | null; years_in_spain: number | null
          date_of_birth: string | null; preferred_locations: string[] | null
          willing_to_relocate: boolean | null; start_availability: string | null
        }
        Insert: {
          availability?: Database["public"]["Enums"]["availability_status"]
          available_from?: string | null; avatar_url?: string | null; bio?: string | null
          commute_radius_km?: number | null; created_at?: string; current_role?: string | null
          cv_url?: string | null; desired_salary_max?: number | null; desired_salary_min?: number | null
          education?: Json | null; embedding?: string | null; experience?: Json | null
          document_number?: string | null; document_type?: string | null
          email?: string | null; full_name?: string | null
          github_url?: string | null; headline?: string | null; id?: string
          intro_video_url?: string | null; is_imported?: boolean; is_public?: boolean; languages?: Json | null
          linkedin_url?: string | null; location_city?: string | null; location_country?: string | null
          location_lat?: number | null; location_lng?: number | null
          modality?: Database["public"]["Enums"]["work_modality"] | null
          open_to_remote?: boolean | null; phone?: string | null; portfolio_url?: string | null; profile_id?: string | null
          recruitment_source?: string | null
          search_vector?: unknown; skills?: string[] | null; slug?: string | null
          updated_at?: string; views_count?: number; website_url?: string | null; years_experience?: number | null
          country_of_origin?: string | null; has_nie?: boolean | null; has_tie?: boolean | null
          homologation?: Database["public"]["Enums"]["homologation_status"] | null
          open_to_relocate?: boolean | null
          spanish?: Database["public"]["Enums"]["spanish_level"] | null
          verified?: boolean | null
          work_permit?: Database["public"]["Enums"]["work_permit_status"] | null
          years_in_spain?: number | null; date_of_birth?: string | null
          preferred_locations?: string[] | null; willing_to_relocate?: boolean | null
          start_availability?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["candidates"]["Insert"]>
        Relationships: []
      }
      device_tokens: {
        Row: { id: string; user_id: string; token: string; platform: string; environment: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; token: string; platform: string; environment?: string | null; created_at?: string; updated_at?: string }
        Update: Partial<Database["public"]["Tables"]["device_tokens"]["Insert"]>
        Relationships: []
      }
      companies: {
        Row: { created_at: string; description: string | null; id: string; industry: string | null; location: string | null; logo_url: string | null; name: string; owner_id: string; size: string | null; slug: string; verified: boolean; website: string | null; legal_name: string | null; tax_id: string | null; founded_year: number | null; contact_name: string | null; contact_email: string | null; contact_phone: string | null; cover_image_url: string | null; billing_email: string | null; billing_address: string | null; billing_tax_id: string | null; contact_role: string | null; address_province: string | null }
        Insert: { created_at?: string; description?: string | null; id?: string; industry?: string | null; location?: string | null; logo_url?: string | null; name: string; owner_id: string; size?: string | null; slug: string; verified?: boolean; website?: string | null; legal_name?: string | null; tax_id?: string | null; founded_year?: number | null; contact_name?: string | null; contact_email?: string | null; contact_phone?: string | null; cover_image_url?: string | null; billing_email?: string | null; billing_address?: string | null; billing_tax_id?: string | null; contact_role?: string | null; address_province?: string | null }
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>
        Relationships: []
      }
      company_reviews: {
        Row: { body: string | null; candidate_id: string; company_id: string; created_at: string; id: string; is_public: boolean; score: number }
        Insert: { body?: string | null; candidate_id: string; company_id: string; created_at?: string; id?: string; is_public?: boolean; score: number }
        Update: Partial<Database["public"]["Tables"]["company_reviews"]["Insert"]>
        Relationships: []
      }
      conversations: {
        Row: { candidate_id: string; created_at: string; employer_id: string; id: string; last_message_at: string }
        Insert: { candidate_id: string; created_at?: string; employer_id: string; id?: string; last_message_at?: string }
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>
        Relationships: []
      }
      favorites: {
        Row: { candidate_id: string; created_at: string; employer_id: string; id: string }
        Insert: { candidate_id: string; created_at?: string; employer_id: string; id?: string }
        Update: Partial<Database["public"]["Tables"]["favorites"]["Insert"]>
        Relationships: []
      }
      job_alerts: {
        Row: { active: boolean | null; candidate_id: string; filters: Json | null; frequency: string | null; id: string; last_sent_at: string | null; query: string | null }
        Insert: { active?: boolean | null; candidate_id: string; filters?: Json | null; frequency?: string | null; id?: string; last_sent_at?: string | null; query?: string | null }
        Update: Partial<Database["public"]["Tables"]["job_alerts"]["Insert"]>
        Relationships: []
      }
      job_views: {
        Row: { created_at: string; id: string; job_id: string; viewer_id: string | null }
        Insert: { created_at?: string; id?: string; job_id: string; viewer_id?: string | null }
        Update: Partial<Database["public"]["Tables"]["job_views"]["Insert"]>
        Relationships: []
      }
      jobs: {
        Row: { applications_count: number | null; benefits: string | null; company_id: string; created_at: string; currency: string | null; description: string; embedding: string | null; experience_level: Database["public"]["Enums"]["experience_level"] | null; expires_at: string | null; featured: boolean | null; id: string; job_type: Database["public"]["Enums"]["job_type"]; location: string | null; published_at: string | null; requirements: string | null; salary_max: number | null; salary_min: number | null; search_vector: unknown; skills: string[] | null; slug: string; status: Database["public"]["Enums"]["job_status"]; title: string; updated_at: string; views_count: number | null; work_mode: Database["public"]["Enums"]["work_mode"]; category: string | null; country: string | null; start_date: string | null }
        Insert: { applications_count?: number | null; benefits?: string | null; company_id: string; created_at?: string; currency?: string | null; description: string; embedding?: string | null; experience_level?: Database["public"]["Enums"]["experience_level"] | null; expires_at?: string | null; featured?: boolean | null; id?: string; job_type: Database["public"]["Enums"]["job_type"]; location?: string | null; published_at?: string | null; requirements?: string | null; salary_max?: number | null; salary_min?: number | null; search_vector?: unknown; skills?: string[] | null; slug: string; status?: Database["public"]["Enums"]["job_status"]; title: string; updated_at?: string; views_count?: number | null; work_mode: Database["public"]["Enums"]["work_mode"]; category?: string | null; country?: string | null; start_date?: string | null }
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>
        Relationships: []
      }
      message_templates: {
        Row: { body: string; created_at: string; employer_id: string; id: string; name: string }
        Insert: { body: string; created_at?: string; employer_id: string; id?: string; name: string }
        Update: Partial<Database["public"]["Tables"]["message_templates"]["Insert"]>
        Relationships: []
      }
      messages: {
        Row: { body: string; conversation_id: string; created_at: string; id: string; read_at: string | null; sender_id: string }
        Insert: { body: string; conversation_id: string; created_at?: string; id?: string; read_at?: string | null; sender_id: string }
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>
        Relationships: []
      }
      notification_preferences: {
        Row: { channel: string; enabled: boolean; id: string; type: Database["public"]["Enums"]["notification_type"]; user_id: string }
        Insert: { channel: string; enabled?: boolean; id?: string; type: Database["public"]["Enums"]["notification_type"]; user_id: string }
        Update: Partial<Database["public"]["Tables"]["notification_preferences"]["Insert"]>
        Relationships: []
      }
      notifications: {
        Row: { created_at: string; id: string; payload: Json; read_at: string | null; type: Database["public"]["Enums"]["notification_type"]; user_id: string }
        Insert: { created_at?: string; id?: string; payload?: Json; read_at?: string | null; type: Database["public"]["Enums"]["notification_type"]; user_id: string }
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>
        Relationships: []
      }
      pipeline_stages: {
        Row: { color: string | null; created_at: string; employer_id: string; id: string; is_terminal: boolean | null; name: string; position: number }
        Insert: { color?: string | null; created_at?: string; employer_id: string; id?: string; is_terminal?: boolean | null; name: string; position?: number }
        Update: Partial<Database["public"]["Tables"]["pipeline_stages"]["Insert"]>
        Relationships: []
      }
      profiles: {
        Row: { avatar_url: string | null; created_at: string; full_name: string | null; id: string; location: string | null; phone: string | null; role: Database["public"]["Enums"]["user_role"]; updated_at: string }
        Insert: { avatar_url?: string | null; created_at?: string; full_name?: string | null; id: string; location?: string | null; phone?: string | null; role?: Database["public"]["Enums"]["user_role"]; updated_at?: string }
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
        Relationships: []
      }
      saved_jobs: {
        Row: { candidate_id: string; created_at: string; id: string; job_id: string }
        Insert: { candidate_id: string; created_at?: string; id?: string; job_id: string }
        Update: Partial<Database["public"]["Tables"]["saved_jobs"]["Insert"]>
        Relationships: []
      }
      saved_searches: {
        Row: { alert_frequency: Database["public"]["Enums"]["alert_frequency"]; created_at: string; filters: Json; id: string; last_alert_at: string | null; name: string; user_id: string }
        Insert: { alert_frequency?: Database["public"]["Enums"]["alert_frequency"]; created_at?: string; filters: Json; id?: string; last_alert_at?: string | null; name: string; user_id: string }
        Update: Partial<Database["public"]["Tables"]["saved_searches"]["Insert"]>
        Relationships: []
      }
      selection_processes: {
        Row: { candidate_id: string; company_id: string | null; created_at: string; employer_id: string; id: string; job_id: string | null; notes: string | null; stage: Database["public"]["Enums"]["process_stage"]; updated_at: string }
        Insert: { candidate_id: string; company_id?: string | null; created_at?: string; employer_id: string; id?: string; job_id?: string | null; notes?: string | null; stage?: Database["public"]["Enums"]["process_stage"]; updated_at?: string }
        Update: Partial<Database["public"]["Tables"]["selection_processes"]["Insert"]>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      auth_role: { Args: never; Returns: Database["public"]["Enums"]["user_role"] }
      compute_match_score: { Args: { p_candidate_id: string; p_job_id: string }; Returns: number }
      profile_completeness: { Args: { p_candidate_id: string }; Returns: number }
    }
    Enums: {
      alert_frequency: "off" | "daily" | "weekly" | "instant"
      application_status: "submitted" | "reviewing" | "shortlisted" | "rejected" | "hired"
      availability_status: "open" | "passive" | "closed"
      experience_level: "entry" | "junior" | "mid" | "senior" | "lead"
      homologation_status: "verified" | "in_progress" | "not_required" | "not_started" | "not_specified"
      job_status: "draft" | "published" | "paused" | "expired" | "archived"
      job_type: "full_time" | "part_time" | "contract" | "internship" | "freelance"
      language_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "native"
      spanish_level: "native" | "C2" | "C1" | "B2" | "B1" | "A2" | "A1"
      work_permit_status: "eu_citizen" | "permanent" | "temporary" | "in_application" | "needs_sponsorship" | "not_specified"
      notification_type: "message_received" | "application_received" | "application_status_changed" | "process_stage_changed" | "saved_search_match" | "system"
      process_stage: "new" | "contacted" | "interview" | "offer" | "hired" | "rejected"
      skill_level: "basic" | "medium" | "advanced" | "expert"
      user_role: "candidate" | "employer" | "admin"
      work_modality: "on_site" | "remote" | "hybrid"
      work_mode: "on_site" | "hybrid" | "remote"
      journey_stage: "seleccionado" | "inicio_proceso" | "expediente_presentado" | "revision_administrativa" | "evaluacion_expediente" | "coordinacion_incorporacion" | "esperando_resolucion" | "resolucion_favorable" | "gestion_consular" | "preparando_viaje" | "bienvenido"
      payment_status: "pendiente" | "parcial" | "completado" | "reembolsado"
      payment_concept: "tasa_extranjeria" | "honorarios_migria" | "tasa_consular" | "seguro_medico" | "vuelo" | "alojamiento" | "otros"
      observation_category: "administrativo" | "comercial" | "legal" | "operativo" | "incidencia" | "general"
    }
    CompositeTypes: Record<string, never>
  }
}
