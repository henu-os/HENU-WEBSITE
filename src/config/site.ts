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
  legalName: "HENU OS Private Limited",
  description: "Official HENU Ecosystem — Technology, Operating System, AI and Engineering.",
  url: "https://henu.org",
  links: {
    calendly: "https://calendly.com/henuos",
  },
  contact: {
    name: "HENU OS Private Limited",
    phone: "+91 80941 00513",
    email: "henuospvtltd@gmail.com",
    address: "Tirth - 2, SHREE RAM RESIDENCY, B-1204, Road, beside Divine Life International School Road, Narolgam, Ahmedabad, Gujarat 382405",
    mapsUrl: "https://www.google.com/maps/place/HENU+OS+Private+Limited/@22.9774577,72.5855018,17z/data=!3m1!4b1!4m6!3m5!1s0x395e8f0066d7ad97:0x7aee46093c189516!8m2!3d22.9774577!4d72.5855018!16s%2Fg%2F11w7f_y0s2",
    googleSearchUrl: "https://www.google.com/search?q=henu+os+private+limited+ahmedabad",
  },
  primaryNavigation: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Products", href: "/products" },
    { label: "Quick Buy", href: "/quick-buy" },
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
