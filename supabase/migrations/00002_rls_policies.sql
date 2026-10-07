-- ==============================================================================
-- HENU OFFICIAL WEBSITE — 00002_rls_policies.sql
-- Comprehensive Row-Level Security (RLS) Baseline (Document 03 §22, §23)
-- Deny-By-Default on ALL tables. Least privilege.
-- ==============================================================================

-- 1. Enable RLS on every table
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slug_redirects ENABLE ROW LEVEL SECURITY;

-- 2. Revoke all default table grants from public roles (anon and authenticated)
REVOKE ALL ON public.admin_profiles FROM anon, authenticated;
REVOKE ALL ON public.audit_logs FROM anon, authenticated;
REVOKE ALL ON public.media_assets FROM anon, authenticated;
REVOKE ALL ON public.site_settings FROM anon, authenticated;
REVOKE ALL ON public.service_categories FROM anon, authenticated;
REVOKE ALL ON public.services FROM anon, authenticated;
REVOKE ALL ON public.products FROM anon, authenticated;
REVOKE ALL ON public.product_relationships FROM anon, authenticated;
REVOKE ALL ON public.project_categories FROM anon, authenticated;
REVOKE ALL ON public.technologies FROM anon, authenticated;
REVOKE ALL ON public.portfolio_projects FROM anon, authenticated;
REVOKE ALL ON public.project_media FROM anon, authenticated;
REVOKE ALL ON public.home_content FROM anon, authenticated;
REVOKE ALL ON public.about_content FROM anon, authenticated;
REVOKE ALL ON public.enquiries FROM anon, authenticated;
REVOKE ALL ON public.slug_redirects FROM anon, authenticated;

-- Helper function: Check if current auth user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND is_active = true
      AND role = 'admin'
  );
$$;

-- ==============================================================================
-- 3. POLICIES: PUBLIC ACCESS (Anon & Authenticated)
-- ==============================================================================

-- Public Enquiry Intake: INSERT ONLY (Cannot read or modify any enquiries)
GRANT INSERT ON public.enquiries TO anon, authenticated;
CREATE POLICY "Public can submit enquiries"
  ON public.enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Public Read-Only for Published Content
GRANT SELECT ON public.services TO anon, authenticated;
CREATE POLICY "Public can read published services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND deleted_at IS NULL);

GRANT SELECT ON public.service_categories TO anon, authenticated;
CREATE POLICY "Public can read service categories"
  ON public.service_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.products TO anon, authenticated;
CREATE POLICY "Public can read published products"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND deleted_at IS NULL);

GRANT SELECT ON public.product_relationships TO anon, authenticated;
CREATE POLICY "Public can read product relationships"
  ON public.product_relationships
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.portfolio_projects TO anon, authenticated;
CREATE POLICY "Public can read published portfolio projects"
  ON public.portfolio_projects
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND deleted_at IS NULL);

GRANT SELECT ON public.project_categories TO anon, authenticated;
CREATE POLICY "Public can read project categories"
  ON public.project_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.technologies TO anon, authenticated;
CREATE POLICY "Public can read technologies"
  ON public.technologies
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.project_media TO anon, authenticated;
CREATE POLICY "Public can read project media"
  ON public.project_media
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.home_content TO anon, authenticated;
CREATE POLICY "Public can read home content"
  ON public.home_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.about_content TO anon, authenticated;
CREATE POLICY "Public can read about content"
  ON public.about_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.site_settings TO anon, authenticated;
CREATE POLICY "Public can read site settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.media_assets TO anon, authenticated;
CREATE POLICY "Public can read media assets"
  ON public.media_assets
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.slug_redirects TO anon, authenticated;
CREATE POLICY "Public can read slug redirects"
  ON public.slug_redirects
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ==============================================================================
-- 4. POLICIES: ADMIN ACCESS (Authenticated Active Admin Only)
-- ==============================================================================

-- Grants for authenticated users (further constrained by RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Admin profiles: Admin can read self and other admins
CREATE POLICY "Admin full access on admin_profiles"
  ON public.admin_profiles
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Enquiries: Admin can read and update status
CREATE POLICY "Admin full access on enquiries"
  ON public.enquiries
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Content tables: Admin full CRUD
CREATE POLICY "Admin full access on services"
  ON public.services FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on service_categories"
  ON public.service_categories FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on products"
  ON public.products FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on product_relationships"
  ON public.product_relationships FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on portfolio_projects"
  ON public.portfolio_projects FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on project_categories"
  ON public.project_categories FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on technologies"
  ON public.technologies FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on project_media"
  ON public.project_media FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on home_content"
  ON public.home_content FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on about_content"
  ON public.about_content FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on site_settings"
  ON public.site_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on media_assets"
  ON public.media_assets FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on slug_redirects"
  ON public.slug_redirects FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Audit logs: Admin can read, append only (NO update, NO delete)
CREATE POLICY "Admin read audit_logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin insert audit_logs"
  ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());
