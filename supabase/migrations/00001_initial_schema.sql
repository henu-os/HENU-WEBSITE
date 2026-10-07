-- ==============================================================================
-- HENU OFFICIAL WEBSITE — 00001_initial_schema.sql
-- Comprehensive database schema for HENU ecosystem (Documents 02 §7, 05 §4)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Admin Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Audit Logs (Append-Only)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    actor_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    summary TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Media Assets
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_key TEXT NOT NULL UNIQUE,
    original_filename TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image/png', 'image/jpeg', 'image/webp', 'image/svg+xml')),
    byte_size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    is_decorative BOOLEAN NOT NULL DEFAULT false,
    focal_point JSONB DEFAULT '{"x": 0.5, "y": 0.5}'::jsonb,
    variants JSONB DEFAULT '{}'::jsonb,
    uploaded_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Site Settings (Singleton)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default' CHECK (id = 'default'),
    organization_name TEXT NOT NULL DEFAULT 'HENU OS Pvt Ltd',
    contact_email TEXT NOT NULL DEFAULT 'contact@henu.org',
    calendly_url TEXT NOT NULL DEFAULT 'https://calendly.com/henuos',
    header_cta_label TEXT NOT NULL DEFAULT 'Start an enquiry',
    footer_text TEXT NOT NULL DEFAULT 'HENU — Technology, Operating System & AI Ecosystem.',
    social_links JSONB DEFAULT '[]'::jsonb,
    seo_defaults JSONB DEFAULT '{}'::jsonb,
    updated_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Service Categories
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Services (Informational only — strictly NO pricing columns)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE RESTRICT,
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    name TEXT NOT NULL,
    summary TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    requires_disclaimer BOOLEAN NOT NULL DEFAULT false,
    disclaimer_block TEXT,
    problem_block JSONB,
    capability_block JSONB,
    approach_block JSONB,
    solution_block JSONB,
    outcome_block JSONB,
    faq_items JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    status_label TEXT NOT NULL DEFAULT 'in_development' CHECK (status_label IN ('available', 'beta', 'in_development', 'coming_soon')),
    hue_key TEXT NOT NULL CHECK (hue_key IN ('os', 'ai', 'pa', 'ide')),
    template_variant TEXT NOT NULL DEFAULT 'standard',
    summary TEXT NOT NULL,
    description_blocks JSONB DEFAULT '[]'::jsonb,
    capabilities JSONB DEFAULT '[]'::jsonb,
    signature_module_content JSONB DEFAULT '{}'::jsonb,
    primary_cta_type TEXT NOT NULL DEFAULT 'explore' CHECK (primary_cta_type IN ('explore', 'download', 'waitlist', 'demo', 'enquire')),
    primary_cta_target TEXT NOT NULL DEFAULT '/contact',
    cover_media_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Product Relationships (Ecosystem graph)
CREATE TABLE IF NOT EXISTS public.product_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    target_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_product_relationship UNIQUE (source_product_id, target_product_id, relationship_type)
);

-- 9. Project Categories & Technologies (Portfolio Vocabularies)
CREATE TABLE IF NOT EXISTS public.project_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Portfolio Projects
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    project_status TEXT NOT NULL DEFAULT 'live' CHECK (project_status IN ('live', 'in_development', 'internal')),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    period_year TEXT,
    external_url TEXT,
    client_permission_status TEXT NOT NULL DEFAULT 'internal_review',
    category_slug TEXT,
    technologies JSONB DEFAULT '[]'::jsonb,
    related_service_ids JSONB DEFAULT '[]'::jsonb,
    related_product_ids JSONB DEFAULT '[]'::jsonb,
    story_blocks JSONB DEFAULT '[]'::jsonb,
    metrics JSONB DEFAULT '[]'::jsonb,
    cover_media_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
    seo_title TEXT,
    seo_description TEXT,
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Project Media Join
CREATE TABLE IF NOT EXISTS public.project_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL DEFAULT 0,
    caption TEXT,
    CONSTRAINT unique_project_media UNIQUE (project_id, media_id)
);

-- 12. Home Content (Singleton)
CREATE TABLE IF NOT EXISTS public.home_content (
    id TEXT PRIMARY KEY DEFAULT 'default' CHECK (id = 'default'),
    hero_statement TEXT NOT NULL,
    hero_supporting_line TEXT NOT NULL,
    hero_primary_cta_label TEXT NOT NULL DEFAULT 'Explore the ecosystem',
    hero_primary_cta_target TEXT NOT NULL DEFAULT '/products',
    hero_secondary_cta_label TEXT NOT NULL DEFAULT 'Start an enquiry',
    hero_secondary_cta_target TEXT NOT NULL DEFAULT '/contact',
    flagship_headline TEXT NOT NULL DEFAULT 'HENU OS',
    flagship_summary TEXT NOT NULL,
    services_intro TEXT NOT NULL,
    about_teaser TEXT NOT NULL,
    featured_product_ids JSONB DEFAULT '[]'::jsonb,
    featured_project_ids JSONB DEFAULT '[]'::jsonb,
    updated_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. About Content (Singleton)
CREATE TABLE IF NOT EXISTS public.about_content (
    id TEXT PRIMARY KEY DEFAULT 'default' CHECK (id = 'default'),
    vision_statement TEXT NOT NULL,
    mission_statement TEXT NOT NULL,
    chapters JSONB DEFAULT '[]'::jsonb,
    timeline_entries JSONB DEFAULT '[]'::jsonb,
    updated_by UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Enquiries (Hardened Intake Pipeline — Document 03 §38, 05 §4.3)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    organisation TEXT CHECK (char_length(organisation) <= 120),
    interest_type TEXT NOT NULL DEFAULT 'general' CHECK (interest_type IN ('service', 'product', 'general', 'partnership')),
    interest_ref TEXT CHECK (char_length(interest_ref) <= 100),
    message TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 5000),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'spam')),
    internal_notes TEXT,
    source_page TEXT,
    notification_status TEXT NOT NULL DEFAULT 'pending' CHECK (notification_status IN ('pending', 'sent', 'failed')),
    notification_error TEXT,
    notified_at TIMESTAMPTZ,
    consent_recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Slug Redirects (Automatic Redirect Engine on slug changes)
CREATE TABLE IF NOT EXISTS public.slug_redirects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('product', 'service', 'project')),
    old_slug TEXT NOT NULL,
    new_slug TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_old_slug_per_type UNIQUE (entity_type, old_slug)
);
