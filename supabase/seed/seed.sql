-- ==============================================================================
-- HENU OFFICIAL WEBSITE — seed.sql
-- Baseline seed data for development and testing
-- Only authentic, confirmed baseline slots (Document 01 §8, 04 §10, 05 §4)
-- ==============================================================================

-- Site Settings
INSERT INTO public.site_settings (id, organization_name, contact_email, calendly_url, header_cta_label, footer_text)
VALUES (
    'default',
    'HENU OS Pvt Ltd',
    'contact@henu.org',
    'https://calendly.com/henuos',
    'Start an enquiry',
    'HENU — Technology, Operating System & AI Ecosystem.'
) ON CONFLICT (id) DO NOTHING;

-- Service Categories (Catalogue taxonomy)
INSERT INTO public.service_categories (id, slug, name, description, display_order)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'engineering', 'Core Engineering & Systems', 'Operating systems, distributed architectures, and platform engineering.', 1),
    ('c2222222-2222-2222-2222-222222222222', 'ai-solutions', 'AI & Intelligent Platforms', 'Model deployment, reasoning pipelines, and applied intelligence.', 2),
    ('c3333333-3333-3333-3333-333333333333', 'digital-product', 'Digital Product & Interface', 'Full-stack application development and systems-grade UI/UX.', 3),
    ('c4444444-4444-4444-4444-444444444444', 'startup-advisory', 'Startup & Advisory Services', 'Architecture review, technology strategy, and ecosystem guidance.', 4)
ON CONFLICT (id) DO NOTHING;

-- Products Baseline (Document 05 §4.3)
INSERT INTO public.products (id, slug, name, tagline, status, status_label, hue_key, template_variant, summary, primary_cta_type, primary_cta_target, display_order)
VALUES
    (
        'p1111111-1111-1111-1111-111111111111',
        'henu-os',
        'HENU OS',
        'The Flagship Developer-Centric Operating System',
        'published',
        'in_development',
        'os',
        'os-environment',
        'A refined, high-performance Linux-based operating system engineered for builders, engineers, and researchers.',
        'explore',
        '/products/henu-os',
        1
    ),
    (
        'p2222222-2222-2222-2222-222222222222',
        'henu-ai',
        'HENU AI',
        'Foundation & Multimodal Reasoning Platform',
        'published',
        'in_development',
        'ai',
        'ai-capabilities',
        'High-context multimodal reasoning and intelligent platform infrastructure built for enterprise and system workloads.',
        'explore',
        '/products/henu-ai',
        2
    ),
    (
        'p3333333-3333-3333-3333-333333333333',
        'henu-pa',
        'HENU PA',
        'Voice-Powered Personal Assistant',
        'published',
        'in_development',
        'pa',
        'pa-conversation',
        'Voice-first personal assistant integrated deeply into HENU OS for streamlined workflows and developer productivity.',
        'explore',
        '/products/henu-pa',
        3
    ),
    (
        'p4444444-4444-4444-4444-444444444444',
        'henu-ide',
        'HENU IDE',
        'AI-Augmented Developer Environment',
        'published',
        'in_development',
        'ide',
        'ide-workflow',
        'An intelligent, context-aware development environment natively aligned with HENU OS and HENU AI.',
        'explore',
        '/products/henu-ide',
        4
    )
ON CONFLICT (id) DO NOTHING;

-- Home Content Baseline
INSERT INTO public.home_content (id, hero_statement, hero_supporting_line, flagship_summary, services_intro, about_teaser)
VALUES (
    'default',
    'Architecting the Next Era of Computing & Intelligent Systems.',
    'HENU builds an interconnected ecosystem spanning operating systems, artificial intelligence, and developer environments.',
    'HENU OS is our flagship operating system, providing a secure, performant foundation designed for developers and technical creators.',
    'We apply our engineering rigor, systems thinking, and AI capabilities to build transformative solutions for partners worldwide.',
    'Founded on the belief that software should be deliberate, dignified, and enduring. Learn about our philosophy and journey.'
) ON CONFLICT (id) DO NOTHING;

-- About Content Baseline
INSERT INTO public.about_content (id, vision_statement, mission_statement)
VALUES (
    'default',
    'A unified computing universe where hardware, operating system, and intelligence cohere into a seamless human tool.',
    'To engineer resilient, human-centered technology that expands developer freedom and technological agency.'
) ON CONFLICT (id) DO NOTHING;
