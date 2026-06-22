/**
 * Drizzle ORM schema — espejo del SQL en supabase/migrations/.
 * El SQL es la fuente de verdad para Supabase (RLS, triggers, FTS).
 */

import { sql } from 'drizzle-orm';
import {
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

// ============ ENUMS ============
export const userRole = pgEnum('user_role', ['candidate', 'employer', 'admin']);
export const jobStatus = pgEnum('job_status', [
  'draft',
  'published',
  'paused',
  'expired',
  'archived',
]);
export const jobType = pgEnum('job_type', [
  'full_time',
  'part_time',
  'contract',
  'internship',
  'freelance',
]);
export const workMode = pgEnum('work_mode', ['on_site', 'hybrid', 'remote']);
export const experienceLevel = pgEnum('experience_level', [
  'entry',
  'junior',
  'mid',
  'senior',
  'lead',
]);
export const applicationStatus = pgEnum('application_status', [
  'submitted',
  'reviewing',
  'shortlisted',
  'rejected',
  'hired',
]);
export const availabilityStatus = pgEnum('availability_status', [
  'open',
  'passive',
  'closed',
]);
export const processStage = pgEnum('process_stage', [
  'new',
  'contacted',
  'interview',
  'offer',
  'hired',
  'rejected',
]);
export const skillLevel = pgEnum('skill_level', ['basic', 'medium', 'advanced', 'expert']);
export const languageLevel = pgEnum('language_level', ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native']);
export const workModality = pgEnum('work_modality', ['on_site', 'remote', 'hybrid']);
export const alertFrequency = pgEnum('alert_frequency', ['off', 'daily', 'weekly', 'instant']);
export const notificationType = pgEnum('notification_type', [
  'message_received',
  'application_received',
  'application_status_changed',
  'process_stage_changed',
  'saved_search_match',
  'system',
]);

// ============ PROFILES ============
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  role: userRole('role').notNull().default('candidate'),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  location: text('location'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============ COMPANIES ============
export const companies = pgTable(
  'companies',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    website: text('website'),
    logoUrl: text('logo_url'),
    industry: text('industry'),
    size: text('size'),
    location: text('location'),
    verified: boolean('verified').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    ownerIdx: index('companies_owner_idx').on(table.ownerId),
  })
);

// ============ CANDIDATES (perfil de empleado, foco del marketplace) ============
export const candidates = pgTable(
  'candidates',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    profileId: uuid('profile_id')
      .notNull()
      .unique()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    slug: text('slug').unique(),
    isPublic: boolean('is_public').notNull().default(false),
    avatarUrl: text('avatar_url'),
    headline: text('headline'),
    bio: text('bio'),
    cvUrl: text('cv_url'),
    yearsExperience: integer('years_experience'),
    currentRole: text('current_role'),
    skills: text('skills').array(),
    desiredSalaryMin: integer('desired_salary_min'),
    desiredSalaryMax: integer('desired_salary_max'),
    openToRemote: boolean('open_to_remote').default(true),
    availability: availabilityStatus('availability').notNull().default('closed'),
    availableFrom: date('available_from'),
    linkedinUrl: text('linkedin_url'),
    githubUrl: text('github_url'),
    portfolioUrl: text('portfolio_url'),
    websiteUrl: text('website_url'),
    languages: jsonb('languages').default([]),
    education: jsonb('education').default([]),
    experience: jsonb('experience').default([]),
    locationLat: doublePrecision('location_lat'),
    locationLng: doublePrecision('location_lng'),
    locationCity: text('location_city'),
    locationCountry: text('location_country'),
    viewsCount: integer('views_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    publicIdx: index('candidates_public_idx').on(table.isPublic, table.availability),
    slugIdx: index('candidates_slug_idx').on(table.slug),
  })
);

// ============ JOBS ============
export const jobs = pgTable(
  'jobs',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    requirements: text('requirements'),
    benefits: text('benefits'),
    jobType: jobType('job_type').notNull(),
    workMode: workMode('work_mode').notNull(),
    experienceLevel: experienceLevel('experience_level'),
    location: text('location'),
    salaryMin: integer('salary_min'),
    salaryMax: integer('salary_max'),
    currency: text('currency').default('EUR'),
    skills: text('skills').array(),
    status: jobStatus('status').notNull().default('draft'),
    featured: boolean('featured').default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    viewsCount: integer('views_count').default(0),
    applicationsCount: integer('applications_count').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index('jobs_company_idx').on(table.companyId),
    statusIdx: index('jobs_status_idx').on(table.status, table.publishedAt),
  })
);

// ============ APPLICATIONS ============
export const applications = pgTable(
  'applications',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    jobId: uuid('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    candidateId: uuid('candidate_id')
      .notNull()
      .references(() => candidates.id, { onDelete: 'cascade' }),
    coverLetter: text('cover_letter'),
    cvUrl: text('cv_url'),
    status: applicationStatus('status').notNull().default('submitted'),
    matchScore: doublePrecision('match_score'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    jobCandidateUnique: unique('job_candidate_unique').on(table.jobId, table.candidateId),
  })
);

// ============ SAVED JOBS ============
export const savedJobs = pgTable(
  'saved_jobs',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    candidateId: uuid('candidate_id')
      .notNull()
      .references(() => candidates.id, { onDelete: 'cascade' }),
    jobId: uuid('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    candidateJobUnique: unique('candidate_job_unique').on(table.candidateId, table.jobId),
  })
);

// ============ JOB ALERTS ============
export const jobAlerts = pgTable('job_alerts', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  candidateId: uuid('candidate_id')
    .notNull()
    .references(() => candidates.id, { onDelete: 'cascade' }),
  query: text('query'),
  filters: jsonb('filters'),
  frequency: text('frequency').default('daily'),
  active: boolean('active').default(true),
  lastSentAt: timestamp('last_sent_at', { withTimezone: true }),
});

// ============ FAVORITES (empleador → candidato) ============
export const favorites = pgTable(
  'favorites',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    employerId: uuid('employer_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    candidateId: uuid('candidate_id')
      .notNull()
      .references(() => candidates.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    unq: unique('employer_candidate_unique').on(table.employerId, table.candidateId),
  })
);

// ============ CANDIDATE NOTES ============
export const candidateNotes = pgTable('candidate_notes', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  employerId: uuid('employer_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  candidateId: uuid('candidate_id')
    .notNull()
    .references(() => candidates.id, { onDelete: 'cascade' }),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============ CANDIDATE TAGS ============
export const candidateTags = pgTable(
  'candidate_tags',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    employerId: uuid('employer_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    candidateId: uuid('candidate_id')
      .notNull()
      .references(() => candidates.id, { onDelete: 'cascade' }),
    label: text('label').notNull(),
    color: text('color').default('zinc'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    unq: unique('tag_unique').on(table.employerId, table.candidateId, table.label),
  })
);

// ============ SELECTION PROCESSES (kanban del empleador) ============
export const selectionProcesses = pgTable(
  'selection_processes',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    employerId: uuid('employer_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    companyId: uuid('company_id').references(() => companies.id, {
      onDelete: 'set null',
    }),
    jobId: uuid('job_id').references(() => jobs.id, { onDelete: 'set null' }),
    candidateId: uuid('candidate_id')
      .notNull()
      .references(() => candidates.id, { onDelete: 'cascade' }),
    stage: processStage('stage').notNull().default('new'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    stageIdx: index('processes_stage_idx').on(table.employerId, table.stage),
    unq: unique('process_unique').on(table.employerId, table.candidateId, table.jobId),
  })
);

// ============ CONVERSATIONS / MESSAGES ============
export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    employerId: uuid('employer_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    candidateId: uuid('candidate_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    unq: unique('conversation_unique').on(table.employerId, table.candidateId),
  })
);

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    senderId: uuid('sender_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    body: text('body').notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    convIdx: index('messages_conv_idx').on(table.conversationId, table.createdAt),
  })
);

// ============ CANDIDATE SKILLS (con nivel) ============
export const candidateSkills = pgTable(
  'candidate_skills',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    candidateId: uuid('candidate_id')
      .notNull()
      .references(() => candidates.id, { onDelete: 'cascade' }),
    skill: text('skill').notNull(),
    level: skillLevel('level').notNull().default('medium'),
    years: integer('years'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    unq: unique('candidate_skill_unique').on(table.candidateId, table.skill),
  })
);

// ============ CANDIDATE LANGUAGES (MCER) ============
export const candidateLanguages = pgTable(
  'candidate_languages',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    candidateId: uuid('candidate_id')
      .notNull()
      .references(() => candidates.id, { onDelete: 'cascade' }),
    code: text('code').notNull(),
    level: languageLevel('level').notNull(),
  },
  (table) => ({
    unq: unique('candidate_lang_unique').on(table.candidateId, table.code),
  })
);

// ============ SAVED SEARCHES ============
export const savedSearches = pgTable('saved_searches', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  filters: jsonb('filters').notNull(),
  alertFrequency: alertFrequency('alert_frequency').notNull().default('off'),
  lastAlertAt: timestamp('last_alert_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============ NOTIFICATIONS ============
export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    type: notificationType('type').notNull(),
    payload: jsonb('payload').notNull().default({}),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    unreadIdx: index('notifications_unread_idx').on(table.userId, table.readAt),
  })
);

export const notificationPreferences = pgTable(
  'notification_preferences',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    type: notificationType('type').notNull(),
    channel: text('channel').notNull(),
    enabled: boolean('enabled').notNull().default(true),
  },
  (table) => ({
    unq: unique('notif_pref_unique').on(table.userId, table.type, table.channel),
  })
);

// ============ MESSAGE TEMPLATES ============
export const messageTemplates = pgTable('message_templates', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  employerId: uuid('employer_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============ PIPELINE STAGES configurables ============
export const pipelineStages = pgTable(
  'pipeline_stages',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    employerId: uuid('employer_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    color: text('color').default('zinc'),
    position: integer('position').notNull().default(0),
    isTerminal: boolean('is_terminal').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    unq: unique('stage_unique').on(table.employerId, table.name),
  })
);

// ============ RATINGS / REVIEWS ============
export const candidateRatings = pgTable(
  'candidate_ratings',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    employerId: uuid('employer_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    candidateId: uuid('candidate_id')
      .notNull()
      .references(() => candidates.id, { onDelete: 'cascade' }),
    score: integer('score').notNull(),
    body: text('body'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    unq: unique('rating_unique').on(table.employerId, table.candidateId),
  })
);

export const companyReviews = pgTable(
  'company_reviews',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    candidateId: uuid('candidate_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    score: integer('score').notNull(),
    body: text('body'),
    isPublic: boolean('is_public').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    unq: unique('review_unique').on(table.candidateId, table.companyId),
  })
);

// ============ JOB VIEWS ============
export const jobViews = pgTable('job_views', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  jobId: uuid('job_id')
    .notNull()
    .references(() => jobs.id, { onDelete: 'cascade' }),
  viewerId: uuid('viewer_id').references(() => profiles.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============ JOURNEY STAGES ============
export const journeyStage = pgEnum('journey_stage', [
  'seleccionado',
  'inicio_proceso',
  'expediente_presentado',
  'revision_administrativa',
  'evaluacion_expediente',
  'coordinacion_incorporacion',
  'esperando_resolucion',
  'resolucion_favorable',
  'gestion_consular',
  'preparando_viaje',
  'bienvenido',
]);

export const candidateJourney = pgTable('candidate_journey', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  candidateId: uuid('candidate_id')
    .notNull()
    .unique()
    .references(() => candidates.id, { onDelete: 'cascade' }),
  startDate: date('start_date'),
  position: text('position'),
  employerCompany: text('employer_company'),
  salary: integer('salary'),
  destinationCity: text('destination_city'),
  docDni: boolean('doc_dni').notNull().default(false),
  docPassport: boolean('doc_passport').notNull().default(false),
  docCriminalRecord: boolean('doc_criminal_record').notNull().default(false),
  docMedical: boolean('doc_medical').notNull().default(false),
  docPrecontract: boolean('doc_precontract').notNull().default(false),
  docContract: boolean('doc_contract').notNull().default(false),
  docSocialSecurity: boolean('doc_social_security').notNull().default(false),
  migFileSubmitted: boolean('mig_file_submitted').notNull().default(false),
  migResolution: boolean('mig_resolution').notNull().default(false),
  migVisaStarted: boolean('mig_visa_started').notNull().default(false),
  migVisaApproved: boolean('mig_visa_approved').notNull().default(false),
  incFlightConfirmed: boolean('inc_flight_confirmed').notNull().default(false),
  incHousingCoordinated: boolean('inc_housing_coordinated').notNull().default(false),
  incTravelDate: date('inc_travel_date'),
  incArrivalDate: date('inc_arrival_date'),
  incEffectiveStart: date('inc_effective_start'),
  notes: text('notes'),
  currentStage: journeyStage('current_stage').notNull().default('seleccionado'),
  stageUpdatedAt: timestamp('stage_updated_at', { withTimezone: true }).notNull().defaultNow(),
  stageMessage: text('stage_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const journeyStageHistory = pgTable(
  'journey_stage_history',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    journeyId: uuid('journey_id')
      .notNull()
      .references(() => candidateJourney.id, { onDelete: 'cascade' }),
    stage: journeyStage('stage').notNull(),
    notes: text('notes'),
    changedBy: uuid('changed_by').references(() => profiles.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    journeyIdx: index('journey_stage_history_journey_idx').on(table.journeyId, table.createdAt),
  })
);

// ============ INTERNAL CONTROL (Migria admin) ============
export const paymentStatus = pgEnum('payment_status', ['pendiente', 'parcial', 'completado', 'reembolsado']);
export const paymentConcept = pgEnum('payment_concept', [
  'tasa_extranjeria', 'honorarios_migria', 'tasa_consular', 'seguro_medico', 'vuelo', 'alojamiento', 'otros',
]);
export const observationCategory = pgEnum('observation_category', [
  'administrativo', 'comercial', 'legal', 'operativo', 'incidencia', 'general',
]);

export const expedientePayments = pgTable(
  'expediente_payments',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    journeyId: uuid('journey_id')
      .notNull()
      .references(() => candidateJourney.id, { onDelete: 'cascade' }),
    concept: paymentConcept('concept').notNull().default('otros'),
    description: text('description'),
    amount: doublePrecision('amount').notNull(),
    currency: text('currency').notNull().default('EUR'),
    status: paymentStatus('status').notNull().default('pendiente'),
    dueDate: date('due_date'),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    paymentMethod: text('payment_method'),
    referenceNumber: text('reference_number'),
    createdBy: uuid('created_by').references(() => profiles.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    journeyIdx: index('expediente_payments_journey_idx').on(table.journeyId),
  })
);

export const expedienteReceipts = pgTable(
  'expediente_receipts',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    journeyId: uuid('journey_id')
      .notNull()
      .references(() => candidateJourney.id, { onDelete: 'cascade' }),
    paymentId: uuid('payment_id').references(() => expedientePayments.id, { onDelete: 'set null' }),
    fileName: text('file_name').notNull(),
    fileUrl: text('file_url').notNull(),
    fileType: text('file_type'),
    fileSize: integer('file_size'),
    description: text('description'),
    uploadedBy: uuid('uploaded_by').references(() => profiles.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    journeyIdx: index('expediente_receipts_journey_idx').on(table.journeyId),
  })
);

export const expedienteObservations = pgTable(
  'expediente_observations',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    journeyId: uuid('journey_id')
      .notNull()
      .references(() => candidateJourney.id, { onDelete: 'cascade' }),
    category: observationCategory('category').notNull().default('general'),
    body: text('body').notNull(),
    isPinned: boolean('is_pinned').notNull().default(false),
    createdBy: uuid('created_by').references(() => profiles.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    journeyIdx: index('expediente_observations_journey_idx').on(table.journeyId),
  })
);

// ============ TIPOS INFERIDOS ============
export type Profile = typeof profiles.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type Candidate = typeof candidates.$inferSelect;
export type NewCandidate = typeof candidates.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type CandidateNote = typeof candidateNotes.$inferSelect;
export type CandidateTag = typeof candidateTags.$inferSelect;
export type SelectionProcess = typeof selectionProcesses.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type CandidateSkill = typeof candidateSkills.$inferSelect;
export type CandidateLanguage = typeof candidateLanguages.$inferSelect;
export type SavedSearch = typeof savedSearches.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type MessageTemplate = typeof messageTemplates.$inferSelect;
export type PipelineStage = typeof pipelineStages.$inferSelect;
export type CandidateRating = typeof candidateRatings.$inferSelect;
export type CompanyReview = typeof companyReviews.$inferSelect;
export type CandidateJourney = typeof candidateJourney.$inferSelect;
export type JourneyStageHistoryRow = typeof journeyStageHistory.$inferSelect;
export type ExpedientePayment = typeof expedientePayments.$inferSelect;
export type ExpedienteReceipt = typeof expedienteReceipts.$inferSelect;
export type ExpedienteObservation = typeof expedienteObservations.$inferSelect;
