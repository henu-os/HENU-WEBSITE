/**
 * HENU Site Configuration
 * Primary navigation strictly adheres to Document 04 §0, §9:
 * 1. Home
 * 2. Services
 * 3. Products
 * 4. Portfolio
 * 5. About Us
 * 6. Contact Us
 */

export const siteConfig = {
  name: "HENU",
  legalName: "HENU OS Pvt Ltd",
  description: "Official HENU Ecosystem — Technology, Operating System, AI and Engineering.",
  url: "https://henu.org",
  links: {
    calendly: "https://calendly.com/henuos",
  },
  primaryNavigation: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Products", href: "/products" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ] as const,
  products: [
    {
      slug: "henu-os",
      name: "HENU OS",
      tagline: "The Flagship Developer-Centric Operating System",
      status: "in_development",
      hueKey: "os",
    },
    {
      slug: "henu-ai",
      name: "HENU AI",
      tagline: "Intelligent Foundation & Multimodal Reasoning Platform",
      status: "in_development",
      hueKey: "ai",
    },
    {
      slug: "henu-pa",
      name: "HENU PA",
      tagline: "Voice-Powered Personal Assistant Integrated with HENU OS",
      status: "in_development",
      hueKey: "pa",
    },
    {
      slug: "henu-ide",
      name: "HENU IDE",
      tagline: "AI-Augmented Developer Environment",
      status: "in_development",
      hueKey: "ide",
    },
  ] as const,
};
