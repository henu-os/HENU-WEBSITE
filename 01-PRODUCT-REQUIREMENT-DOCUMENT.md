# HENU Website — Product Requirement Document

| | |
|---|---|
| **Document** | `01-PRODUCT-REQUIREMENT-DOCUMENT.md` |
| **Status** | Draft v1 for product review |
| **Scope** | The new official HENU website (technology ecosystem website) |
| **Next documents** | Design system, content/copy strategy, technical architecture, delivery plan |

**Conventions used in this document**

- `[REQUIRES CONFIRMATION]` marks any fact, capability, claim, status or decision about HENU that is uncertain and must be verified by a HENU owner before it is published or built against.
- This document defines *what, who, why and what not*. It contains no code, no UI screen design, no visual-system decisions and no implementation tickets.
- "Evidence" means something real and verifiable. Where evidence does not yet exist, the site must say less, not invent more.

---

## 1. Executive Summary

HENU is a technology company and product ecosystem. Its portfolio, as currently understood, includes HENU OS (a developer-friendly Linux-based operating system), HENU PA (a voice-powered personal assistant integrated with HENU OS), HENU AI (an AI model/platform built around multiple LLM capabilities), HENU IDE (an AI-assisted developer environment), and HENU Services (technology and digital services for clients). The exact status, maturity and public availability of each item is `[REQUIRES CONFIRMATION]`.

The new website must present HENU as a **serious technology ecosystem**, not as a small agency portfolio and not as a single-product landing page. It must let a new visitor understand within seconds what HENU is, what it builds, why it is different, and what to do next, while supporting four distinct visitor journeys: **product visitors, developers/technical visitors, business clients, and partners/ecosystem observers**.

The website has one defining design constraint: **credibility must be earned through evidence, not asserted through adjectives.** Every claim, metric, client reference, certification or capability on the site must be real, sourced and owned by someone inside HENU.

The first release (V1) is deliberately focused: a strong homepage, flagship HENU OS presence, a clear product ecosystem view, a coherent services offering, proof of work where it genuinely exists, a trustworthy download/release experience (or an honest "coming soon" equivalent), documentation entry points, and differentiated contact paths. Heavy infrastructure (full CMS, RBAC, client portals, telemetry dashboards) is explicitly deferred.

---

## 2. Product Vision

**Vision statement (working):** The HENU website is the single authoritative home of the HENU ecosystem. It explains what HENU is, makes each product and service understandable on its own terms, shows how they relate, proves capability with real evidence, and routes every visitor to the next meaningful action.

**What the website is**

- The official front door of HENU as a technology company and ecosystem.
- A product-led website where HENU OS is the flagship but not the only story.
- A trust-building surface for developers, clients and partners.
- A foundation that can absorb new products, services, releases, articles, case studies and documentation without redesign.

**What the website is not**

- Not a one-page HENU OS landing page.
- Not a generic web-development agency site.
- Not a Linux distribution template.
- Not a marketing brochure full of unsupported superlatives.
- Not a documentation platform, a blog engine or a CMS product in V1.

**Longer-term intent**

The site should look and behave like the website of the technology ecosystem HENU intends to become, while remaining honest about what HENU is *today*. The gap between ambition and current reality must be handled through restraint and clear status labelling (for example: Available, Beta, In development, Coming soon), never through overstatement. `[REQUIRES CONFIRMATION: current status of each product]`

---

## 3. Product Goal

### 3.1 The single most important job

> **Enable a new visitor to understand what HENU is and quickly reach the specific product, service or technical resource relevant to them, with enough evidence to trust HENU and an obvious next action.**

### 3.2 What a new visitor must be able to understand

| # | Question | Where answered first | Where answered in depth |
|---|----------|---------------------|-------------------------|
| 1 | What is HENU? | Homepage opening | About, Technology |
| 2 | What does HENU build? | Homepage opening / ecosystem view | Products, Services |
| 3 | Why is HENU different? | Homepage differentiation | HENU OS, Technology, About |
| 4 | What products exist? | Homepage ecosystem view | Products hub, product pages |
| 5 | What services are available? | Homepage services signal | Services hub, service pages |
| 6 | Why should I trust HENU? | Homepage proof | Case studies, releases, docs, About |
| 7 | Which product/service is relevant to me? | Audience-aware routing on homepage | Hubs and navigation |
| 8 | What should I do next? | Contextual primary CTA on every page | Journey-specific pages |

### 3.3 Supported journeys (no single funnel)

**Product visitor**
Discover HENU → Explore product → Understand capability → Evaluate → Try / download / contact

**Developer / technical visitor**
Discover technology → Explore technical capability → Documentation / resources → Product → Developer action (download, GitHub, docs)

**Business / client visitor**
Understand HENU → Identify relevant service → Understand approach → Review proof → Enquire

**Partner / ecosystem visitor**
Understand HENU → Explore products and capabilities → Understand the company → Partnership / contact

Each journey must have an obvious next action at every major step, and no journey should require passing through another journey's content.

### 3.4 Goal hierarchy

1. **Comprehension** — the visitor correctly understands what HENU is.
2. **Routing** — the visitor finds the right product, service or resource.
3. **Trust** — the visitor sees evidence rather than claims.
4. **Action** — the visitor takes a contextual next step (explore, download, read docs, enquire, contact).

---

## 4. Website Positioning

### 4.1 Positioning statement (working, for validation)

HENU is a technology company building a connected ecosystem of products — a developer-friendly Linux-based operating system, a voice-powered assistant, an AI platform and an AI-assisted development environment — and applying the same engineering capability to build technology for clients. `[REQUIRES CONFIRMATION: accuracy and wording of each product description]`

### 4.2 What the site must communicate

Technology, product thinking, engineering capability, innovation, AI, developer orientation, reliability, modern design, seriousness and originality.

### 4.3 What HENU must not be positioned as

| Avoid | Why |
|-------|-----|
| A generic web-development agency | Collapses HENU into an interchangeable commodity and hides its products |
| A generic IT company | No memorable identity |
| A template-based digital agency | Undermines product credibility |
| A Linux distribution with no broader ecosystem | Hides the ecosystem and services dimension |
| A flashy startup with no substance | Destroys developer and enterprise trust |

### 4.4 Balance of qualities

**Technology + Product + Human clarity + Credibility + Conversion.** If any one dominates, the site fails: technology without clarity alienates; conversion without credibility feels like an agency funnel; product without ecosystem looks like a distro page.

### 4.5 Taglines — evaluation

The two known taglines should be evaluated, not blindly adopted.

| Tagline | Assessment | Recommended role |
|---------|-----------|------------------|
| "HENU turns ideas into reality." | Service- and builder-oriented. Works well when speaking to prospective clients. Weak as an ecosystem or product statement because it describes any builder and says nothing about what HENU builds. | **Supporting line**, primarily in Services contexts and closing/CTA moments. Not the primary homepage statement. |
| "One Vision. Infinite Possibilities." | Evocative but abstract. "Infinite" is an unsubstantiable claim and the line explains nothing about the company or products. | **Brand or secondary line**, possibly in footer or about/brand contexts. Should not carry the homepage's explanatory burden. Consider reframing. |

The primary homepage statement should be **descriptive and specific** (what HENU is and builds), with taglines used for tone and memorability rather than comprehension. The final wording belongs to the content/copy workstream. `[REQUIRES CONFIRMATION: whether either tagline is contractually or brand-mandated]`

### 4.6 Company vs. product branding

The website must make the relationship between **HENU (company/ecosystem)** and **HENU OS (flagship product)** unambiguous, so visitors never wonder whether they are on "the OS website" or "the company website". `[REQUIRES CONFIRMATION: final brand architecture]` (see Open Product Decisions)

---

## 5. Target Audiences

### 5.1 Priority hierarchy

| Priority | Audience | Role on the homepage |
|----------|----------|---------------------|
| **P1** | A. Technology / product users | Primary framing: HENU as a product ecosystem led by HENU OS |
| **P1** | B. Developers / technical users | Equal first-tier weight through technology credibility and clear developer entry points |
| **P2** | C. Business / organization clients | Strong, clearly signposted second-level path (Services); not the homepage's primary framing |
| **P3** | D. Secondary audiences (partners, investors, community, students, media, existing users) | Served by dedicated pages and footer-level paths, not by homepage space |

**Rationale.** The homepage's primary job is to establish HENU as a technology/product company. If the homepage leads with services, HENU reads as an agency and loses the product-ecosystem positioning that is its main differentiator. Clients are best served by a distinct, high-clarity Services journey reachable from the homepage and the main navigation. Whether services are in fact HENU's primary revenue driver, and whether that should alter this hierarchy, is a business decision. `[REQUIRES CONFIRMATION: primary homepage audience and revenue priority]`

### 5.2 Audience profiles

#### A. Technology / Product Users

| Dimension | Definition |
|-----------|-----------|
| Who | People discovering HENU OS, HENU PA, HENU AI, HENU IDE and related products |
| What they want | To understand what each product does, whether it is for them, and how to try it |
| Problem they are solving | Finding an operating system / assistant / AI tool that fits their needs, and judging whether it is real and trustworthy |
| Information needed | What it is, who it is for, capabilities, ecosystem relationship, system requirements, maturity/status, how to get it |
| Likely objections | "Is this real or vapourware?", "Is it stable?", "Will it run on my hardware?", "What happens to my data?", "Is anyone maintaining this?" |
| Desired action | Explore the product, download/try it, read documentation, or join a waitlist/community |
| Pages that serve them | Home, HENU OS, Products hub, product pages, Downloads, Documentation entry, FAQ |

#### B. Developers / Technical Users

| Dimension | Definition |
|-----------|-----------|
| Who | Developers, engineers, Linux users, AI enthusiasts, technical professionals, potential contributors |
| What they want | Technical substance: architecture, capabilities, tooling, documentation, source/repository access |
| Problem they are solving | Deciding whether HENU technology is technically credible and worth adopting or contributing to |
| Information needed | Technical overview, base/foundation, supported hardware, developer workflow, documentation, release history, repositories, security approach |
| Likely objections | "Marketing without substance", "No docs", "Closed and opaque", "Abandoned project", "No upgrade/security story" |
| Desired action | Read documentation, view releases, access repositories, try the product, engage with the community |
| Pages that serve them | Technology, HENU OS (technical sections), Documentation, Downloads/Releases, Security, GitHub/community links |

#### C. Business / Organization Clients

| Dimension | Definition |
|-----------|-----------|
| Who | Companies seeking software development, AI automation, web development, mobile applications and digital solutions |
| What they want | A capable partner with a clear approach and evidence of delivery |
| Problem they are solving | Reducing the risk of choosing the wrong vendor for a technology project |
| Information needed | Services offered, how HENU works, relevant experience, deliverables, evidence of results, how to start |
| Likely objections | "Another interchangeable agency", "No proof", "Unclear process", "Unclear pricing/engagement model", "Can they handle my scale?" |
| Desired action | Start an enquiry / discuss a project / request a proposal |
| Pages that serve them | Services hub, service pages, Work/Case studies, About, Contact (project enquiry) |

#### D. Secondary audiences

| Audience | Primary need | Served by | Action |
|----------|-------------|-----------|--------|
| Potential partners | Understand ecosystem and company seriousness | About, Technology, Products, Contact (partnership) | Partnership enquiry |
| Investors / ecosystem observers | Understand vision, traction, direction | About, Products, Insights (company updates) | General enquiry `[REQUIRES CONFIRMATION: whether investor content is publicly desired]` |
| Open-source / community users | Find repositories, contribution paths, discussion | Documentation, Technology, community links | Visit repositories / community |
| Students / learners | Learn how things work | Documentation, Insights (tutorials), FAQ | Read / explore |
| Media / technology researchers | Accurate facts, assets, contacts | About, Contact (media), fact sheet `[Future]` | Contact press |
| Existing HENU users | Updates, support, docs, downloads | Downloads, Documentation, Support contact, release notes | Get update / support |

### 5.3 Rule on the homepage

The homepage must **not** give all audiences equal space. It should orient visitors, establish HENU, and route. Depth for each audience lives on its dedicated pages.

---

## 6. User Problems

Each problem is expressed as **Problem → Consequence → Website response.**

| # | Problem | Consequence | Website response |
|---|---------|-------------|------------------|
| 1 | Visitors don't immediately understand what HENU is | Fast bounce; no product or service ever discovered | A specific, descriptive opening statement and a visible map of what HENU builds, above all decorative content |
| 2 | Multiple products create confusion about how they relate | Visitors see unrelated items; ecosystem value is lost | An explicit ecosystem relationship view, plus a consistent "how this fits with other HENU products" element on every product page |
| 3 | Visitors can't tell if HENU is an OS company, software company, AI company or service company | Wrong mental model; wrong audience served | Clear company-level framing: HENU builds products and applies the same engineering to client work; status labels on everything |
| 4 | Developers need technical credibility | Developers leave if substance isn't visible quickly | A dedicated Technology area, accessible documentation, release history and repository links, without forcing it on non-technical visitors |
| 5 | Business clients need confidence and proof | Enquiries don't happen, or go to competitors | Process transparency, problem-led service pages and real case studies |
| 6 | Product users need clear capabilities | Visitors cannot decide whether a product fits them | Product pages that explain problem, solution, experience and capability rather than feature lists |
| 7 | Visitors need obvious next actions | Interest dies without conversion | One clear primary action per major page, matched to the page's intent |
| 8 | Large amounts of information overwhelm | Cognitive overload; shallow understanding | Progressive disclosure: homepage → product → docs → release; services → case study |
| 9 | Technical language alienates non-technical users | Product users and clients disengage | Plain-language layer first, technical depth available on demand |
| 10 | Generic agency websites look interchangeable | HENU is forgettable and mistaken for an agency | An original HENU identity, product-led structure and evidence-led credibility |
| 11 | Visitors suspect hype | Trust erosion | No unsupported superlatives; claims tied to evidence; honest status labels |

**Rule:** no problem statement or page copy may rely on sweeping claims such as "existing operating systems are bad" or "HENU solves everything". Any comparative claim must be supportable by evidence before it is published.

---

## 7. HENU Differentiation

### 7.1 Ranking method

Differentiators are ranked by how **memorable, defensible and evidence-supportable** they are, not by how impressive they sound. Rankings below are working hypotheses that depend on the real state of each product. `[REQUIRES CONFIRMATION: validate each ranking against actual product maturity]`

### 7.2 Ranking

| Rank | Item | Classification | Reasoning |
|------|------|---------------|-----------|
| 1 | **A connected ecosystem anchored by HENU OS** (OS + voice assistant + AI + IDE designed to work together) | **Core differentiator** | Few companies present an operating system, an assistant, an AI platform and a developer environment as one coherent system. It is memorable, hard to copy quickly and gives every product page a shared story. It is credible only to the extent the integration is real, so the site must show it concretely. |
| 2 | **Voice-first computing (HENU PA integrated into HENU OS)** | **Strong differentiator** | A concrete, experience-level distinction that non-technical users can grasp. Depends on demonstrable behaviour; a demo or video would be strong proof. |
| 3 | **Developer orientation (Linux foundation, HENU IDE, technical documentation)** | **Strong differentiator** | Defines who the products are built for and gives developers a reason to care. Strengthened considerably by real documentation and repositories. |
| 4 | **Product + service combination (HENU builds its own products and builds for clients)** | **Supporting differentiator** | Gives services credibility ("we build real technology") and products credibility ("tested in real work"). Valuable, but not a reason to choose HENU on its own. Must not blur product and service messaging. |
| 5 | **AI integration across the ecosystem / HENU AI** | **Supporting differentiator** | AI is now widely claimed, so on its own it is not distinctive. Its value is as the capability that powers the ecosystem. Claims must be specific (what it does) rather than generic. |
| 6 | **Custom technology development / AI automation (as services)** | **Proof point** | Demonstrates capability; credibility comes from case studies, not slogans. |
| 7 | **Multilingual capabilities** | **Proof point / feature** `[REQUIRES CONFIRMATION: which languages, in which products]` | Potentially strong in some markets; becomes a differentiator only if it is real and specific. |
| 8 | **Linux ecosystem** | **Proof point (and foundation)** | Signals technical credibility to developers but is shared with many projects; not unique. |
| 9 | **Software products (generic)** | **Feature rather than differentiator** | Having products is table stakes unless the products themselves are distinctive. |

### 7.3 Implications for the website

- The memorable reason to choose HENU is the **ecosystem story** led by HENU OS and voice-first computing, supported by developer orientation. This is the thread the homepage must carry.
- The site must not present twenty feature bullets. It must communicate **one coherent idea** with a small number of specific, evidenced supports.
- Proof points and features belong inside product and technology pages, not in the homepage's headline.
- If the ecosystem integration is not yet demonstrable, the site must describe it as direction/roadmap and label it accordingly rather than present it as shipped reality.

---

## 8. Product Principles

These principles govern every later document (design, content, engineering).

1. **Clarity before decoration.** If a visual treatment reduces comprehension, it loses.
2. **Product before hype.** Show what exists and works; describe ambition as ambition.
3. **Evidence before unsupported claims.** Superlatives ("best", "revolutionary", "world-class", "fastest", "most powerful", "industry-leading") are prohibited unless substantiated.
4. **Motion communicates, not distracts.** Motion must clarify structure, state or cause-and-effect.
5. **Every major page has a clear purpose.** A page that cannot state its purpose does not ship.
6. **Every CTA has an identifiable user intent.** No generic "Learn more" scattered everywhere.
7. **The design system is consistent.** Consistency is HENU's product language.
8. **Components are reusable without making every page identical.** Pages follow shared patterns but express their own story.
9. **Technical depth is available without overwhelming non-technical visitors.** Progressive disclosure.
10. **Mobile is first-class.** Not a reduced version of desktop.
11. **Accessibility is part of quality.** Not a final audit.
12. **Performance is part of design.** A slow page is a badly designed page.
13. **The site must feel like HENU.** Not like a technology template.
14. **No section exists merely because competitors have one.** Every section earns its place with a purpose.
15. **Design for expansion, not for hypotheticals.** New products, services, releases, articles and case studies must be addable without redesign; infrastructure for imaginary future content must not be built in V1.
16. **Never invent evidence.** No fabricated numbers, clients, logos, certifications, testimonials or capabilities.

---

## 9. Information Architecture

### 9.1 Architectural principles

- **Clarity over page count.** Fewer, stronger pages beat many thin ones.
- **Products and Services are different intents** and are never combined into one generic collection.
- **Marketing, documentation and download/release content are separate concerns** with separate pages and clear links between them.
- **Progressive disclosure:** Home → Product → Documentation → Release/Download; Services → Service → Case study.
- **Relationships are explicit:** HENU (ecosystem) → HENU OS (flagship) → other products → services → technology → proof → resources → content.

### 9.2 Page inventory and V1 classification

| Page | Required for | Notes |
|------|-------------|-------|
| Home | **V1** | Strategic entry point |
| HENU OS (flagship page) | **V1** | Dedicated flagship experience |
| Products (hub) | **V1** | Ecosystem view, not a card grid |
| Individual product pages (HENU PA, HENU AI, HENU IDE, others) | **V1** for launch-ready products only; others V1.1 | `[REQUIRES CONFIRMATION: which products are launch-ready]` |
| Services (hub) | **V1** | Unified, categorised |
| Individual service pages | **V1** for validated core services; others V1.1 | `[REQUIRES CONFIRMATION: services to list]` |
| Technology / Capabilities | **V1** | Technical credibility |
| About HENU | **V1** | Company credibility |
| Work / Case studies | **V1** only if real, shareable work exists; otherwise V1.1 | Never fabricate |
| Downloads & Releases | **V1** if a public release exists; otherwise a status/waitlist page | `[REQUIRES CONFIRMATION: release readiness]` |
| Documentation entry | **V1 (entry point + essentials)**; full system V1.1/Future | See Section 16 |
| Contact (multi-intent) | **V1** | See Section 18 |
| FAQ | **V1** (compact, real questions only) | May be distributed across pages |
| Privacy Policy | **V1** | Legal requirement `[REQUIRES CONFIRMATION: legal review]` |
| Terms | **V1** | Legal requirement `[REQUIRES CONFIRMATION: legal review]` |
| Security / responsible disclosure | **V1.1** (V1 if software is publicly distributed) | See page definition |
| Insights (blog/news/release notes) | **V1.1** | Created only when there is content with a purpose |

### 9.3 Page definitions

Each definition states purpose, target audience, primary user intent, primary CTA, secondary CTA, what belongs, what does not belong, and phase.

#### Home

- **Purpose:** Establish HENU's identity and route visitors to the right journey.
- **Audience:** All, prioritised P1 (product/technical), then P2 (clients).
- **Primary intent:** "What is this company, and is it relevant to me?"
- **Primary CTA:** Explore HENU OS / Explore the ecosystem (final selection depends on homepage audience decision).
- **Secondary CTA:** Discuss a Project (clients); Documentation (developers).
- **Belongs:** Identity statement, what HENU builds, differentiation, flagship, ecosystem view, services signal, proof, technology signal, relevant work, contextual CTA.
- **Does NOT belong:** Product specifications, long service descriptions, documentation, full case studies, full release information, blog archives.
- **Phase:** V1

#### HENU OS

- **Purpose:** Flagship product page establishing HENU OS as a serious technology.
- **Audience:** Product users, developers.
- **Primary intent:** "What is HENU OS and is it for me?"
- **Primary CTA:** Download / Get HENU OS (state-dependent: Download, Join waitlist, or Explore).
- **Secondary CTA:** Read Documentation.
- **Belongs:** Product story, who it is for, capabilities, voice interaction, ecosystem relationships, developer experience, privacy/security philosophy (supportable only), system requirements summary, links to Releases, Docs and community.
- **Does NOT belong:** Full installation guide, complete release history, full API/config reference, services marketing.
- **Phase:** V1

#### Products (hub)

- **Purpose:** Present the HENU ecosystem and how products relate.
- **Audience:** Product users, partners.
- **Primary intent:** "What products does HENU have and how do they fit together?"
- **Primary CTA:** Open the relevant product.
- **Secondary CTA:** Contact HENU.
- **Belongs:** Ecosystem relationship, product status, audience per product, entry to each product.
- **Does NOT belong:** Service offerings, deep product detail, technical docs.
- **Phase:** V1

#### Individual product pages (HENU PA, HENU AI, HENU IDE, others)

- **Purpose:** Explain one product in depth.
- **Audience:** Product users, developers.
- **Primary intent:** "What does this product do and should I use it?"
- **Primary CTA:** Product-specific (Explore, Try, Download, Join waitlist, Request demo) `[REQUIRES CONFIRMATION per product]`.
- **Secondary CTA:** Documentation (where it exists) / Contact.
- **Belongs:** Why it exists, problem, solution, experience, capabilities, ecosystem relationship, evidence, next action.
- **Does NOT belong:** Detailed documentation, release archives, unrelated services content.
- **Phase:** V1 for launch-ready products; V1.1 otherwise.

#### Services (hub)

- **Purpose:** Present HENU's services as the applied engineering side of a technology company.
- **Audience:** Business clients.
- **Primary intent:** "Can HENU solve my problem?"
- **Primary CTA:** Discuss a Project.
- **Secondary CTA:** View relevant work.
- **Belongs:** Service categories framed by customer problem, HENU approach, process overview, proof signals.
- **Does NOT belong:** Product marketing, technology logo walls, full pricing (unless confirmed).
- **Phase:** V1

#### Individual service pages

- **Purpose:** Explain one service category as a solution to a customer problem.
- **Audience:** Business clients.
- **Primary intent:** "Is this the right partner for this need?"
- **Primary CTA:** Start an Enquiry / Request a Proposal.
- **Secondary CTA:** View related case study.
- **Belongs:** Customer problem, HENU approach, solution, technology, deliverables, process, evidence, CTA.
- **Does NOT belong:** A bare technology list, unsupported claims, unrelated product content.
- **Phase:** V1 for validated services; V1.1 otherwise.

#### Technology / Capabilities

- **Purpose:** Demonstrate engineering depth and show how HENU's technology fits together.
- **Audience:** Developers, partners, technical clients.
- **Primary intent:** "Is HENU technically credible?"
- **Primary CTA:** Documentation / Developer Resources.
- **Secondary CTA:** GitHub (where public) / Contact.
- **Belongs:** Technology philosophy, core capabilities, how HENU OS/PA/AI/IDE share foundations, engineering approach.
- **Does NOT belong:** Logo walls without context, product marketing duplicates, unverifiable benchmarks.
- **Phase:** V1

#### About HENU

- **Purpose:** Establish the company behind the ecosystem.
- **Audience:** Clients, partners, investors, media, developers.
- **Primary intent:** "Who is HENU and are they credible?"
- **Primary CTA:** Contact HENU.
- **Secondary CTA:** Explore HENU.
- **Belongs:** What HENU is and why it exists, history/timeline (only verified), team/expertise `[REQUIRES CONFIRMATION]`, values operationalised through behaviour, where HENU is based `[REQUIRES CONFIRMATION]`.
- **Does NOT belong:** Invented milestones, generic values slogans, unverifiable statistics.
- **Phase:** V1

#### Work / Case Studies

- **Purpose:** Provide evidence that HENU can solve meaningful problems.
- **Audience:** Business clients, partners.
- **Primary intent:** "Has HENU done this before, and how well?"
- **Primary CTA:** Start an Enquiry.
- **Secondary CTA:** View related service.
- **Belongs:** Case studies (Challenge → Context → Approach → Solution → Technology → Outcome → Evidence), product stories.
- **Does NOT belong:** Generic portfolio grids, thumbnails with no context, invented outcomes.
- **Phase:** V1 if real shareable work exists; otherwise V1.1 `[REQUIRES CONFIRMATION: which case studies can be public]`

#### Downloads & Releases

- **Purpose:** Provide a trustworthy technical distribution experience (see Section 17).
- **Audience:** Product users, developers, existing users.
- **Primary intent:** "Get the correct, verified version and install it."
- **Primary CTA:** Download (state-aware).
- **Secondary CTA:** Installation guide / Release notes.
- **Belongs:** Current stable version, release date, channel, architecture, requirements, size, checksums, release notes, previous releases, installation and upgrade pointers.
- **Does NOT belong:** Marketing narrative, product positioning, services content.
- **Phase:** V1 (or a "coming soon / waitlist" variant) `[REQUIRES CONFIRMATION]`

#### Documentation entry

- **Purpose:** Route learners and developers into documentation and set expectations for it.
- **Audience:** Developers, existing users, students.
- **Primary intent:** "How do I install, use or build with this?"
- **Primary CTA:** Getting Started.
- **Secondary CTA:** Release Notes / Community.
- **Belongs:** Category map, getting started, installation, product docs entry points, troubleshooting.
- **Does NOT belong:** Marketing copy, sales content.
- **Phase:** V1 (entry + essentials); expanded system V1.1/Future

#### Contact

- **Purpose:** Route enquiries by intent (see Section 18).
- **Audience:** All.
- **Primary intent:** "I want to talk to HENU about something specific."
- **Primary CTA:** Intent-specific submit action.
- **Secondary CTA:** Alternative contact channels.
- **Belongs:** Intent selection, minimal forms, response expectations, channels.
- **Does NOT belong:** Marketing content, long forms for simple intents.
- **Phase:** V1

#### FAQ

- **Purpose:** Remove genuine objections that prevent action.
- **Audience:** All.
- **Primary intent:** "Answer my specific doubt."
- **Primary CTA:** Next relevant action (Download, Docs, Enquire).
- **Secondary CTA:** Contact.
- **Belongs:** Only real questions, such as: What is HENU OS? Who is it for? What hardware does it support? How do I install it? Is it free/open source (where applicable)? How does HENU PA work? How can I request a service? What technologies does HENU work with?
- **Does NOT belong:** Fabricated questions, marketing disguised as FAQ.
- **Phase:** V1 (compact; may be embedded in relevant pages rather than a single page)

#### Privacy Policy / Terms

- **Purpose:** Legal clarity and trust.
- **Audience:** All.
- **Primary intent:** "What happens to my data / what are the rules?"
- **Primary CTA:** None (informational); contact for privacy requests.
- **Belongs:** Accurate data practices matching what the site and any forms actually do.
- **Does NOT belong:** Boilerplate that contradicts actual behaviour.
- **Phase:** V1 `[REQUIRES CONFIRMATION: legal review]`

#### Security / Responsible Disclosure

- **Purpose:** Give researchers a responsible way to report vulnerabilities and show HENU takes security seriously.
- **Audience:** Developers, security researchers, clients.
- **Primary intent:** "How do I report a vulnerability? How does HENU treat security?"
- **Primary CTA:** Report a vulnerability.
- **Secondary CTA:** Security practices / Documentation.
- **Belongs:** Disclosure process and contact, supported versions, practices that are genuinely in place.
- **Does NOT belong:** Security claims or certifications that are not real.
- **Phase:** V1.1 (move to V1 if HENU OS is publicly distributed at launch) `[REQUIRES CONFIRMATION]`

#### Insights (blog / news / release notes)

- **Purpose:** Publish useful content (product announcements, release notes, technical and AI insights, tutorials, company updates).
- **Audience:** Developers, product users, clients, media.
- **Primary intent:** "What's new, and how do I learn more?"
- **Primary CTA:** Read; relevant product/doc action in context.
- **Secondary CTA:** Subscribe/follow `[Future]`.
- **Belongs:** Content with a purpose and an owner.
- **Does NOT belong:** Filler content created because "technology sites have blogs".
- **Phase:** V1.1; launches only with real content and a publishing owner.

---

## 10. Homepage Requirements

### 10.1 Role

The homepage is a **strategic entry point**, not a stack of sections. Its role is to orient, establish identity and route. It must not try to explain everything.

### 10.2 What the first few seconds must communicate

Within the first viewport and first scroll, a visitor must be able to answer:

1. **What is HENU?** (a technology company and ecosystem)
2. **What does HENU build?** (named products and the existence of services)
3. **Why should I care?** (the core differentiator)
4. **What should I explore next?** (a clear primary action and visible routes)

### 10.3 Recommended sequence (with reasoning)

The suggested journey was evaluated against user psychology and conversion logic. The recommended sequence is:

| Order | Block | Purpose | Reasoning |
|------|-------|---------|-----------|
| 1 | **Identity and positioning** | State what HENU is and builds, with a primary action | Comprehension must precede persuasion; prevents bounce |
| 2 | **Core differentiator** (the ecosystem idea) | Give a memorable reason to care | The single thread that makes the rest coherent |
| 3 | **Flagship: HENU OS** | Anchor the ecosystem in a concrete product | A tangible product converts attention into interest sooner than an abstract ecosystem |
| 4 | **Product ecosystem** | Show how products relate | Moves from one product to the system |
| 5 | **Proof / credibility (first pass)** | Early evidence that this is real | Trust must arrive before asking for investment of attention in services or technology. Evidence is moved earlier than the original sequence suggested. |
| 6 | **Technology / capability** | Technical credibility for developers | Reassures P1-technical audience; links out to depth |
| 7 | **Services** | Present applied capability to prospective clients | Positioned *after* the product story so HENU is not read as an agency; signposted earlier in navigation for clients who want it directly |
| 8 | **Relevant work / case studies** | Evidence for the services claim | Immediately after services where it is most persuasive |
| 9 | **Process / methodology** | Reduce client uncertainty | Belongs mainly on Services; the homepage carries only a brief signal |
| 10 | **Insights / resources** | Show an active, maintained ecosystem | Include only if there is real content (V1.1) |
| 11 | **Closing contextual CTA** | Next action by intent | Ends with intent-based paths rather than one generic CTA |

**Differences from the original suggested sequence:** proof is moved earlier; process is demoted to a signal on the homepage (full treatment sits on Services); insights are conditional on real content. The final order must be validated through design and content work and, once data exists, through observed attention and conversion. This is a recommended hierarchy, not a locked layout.

### 10.4 Homepage requirements

- A specific, descriptive identity statement (not a purely abstract tagline).
- A clear primary action and a visible route for developers and for clients.
- A representation of the ecosystem that shows relationships, not an unrelated product card grid.
- Real evidence only; no invented numbers, logos or testimonials.
- Services signposted without dominating the product story.
- Progressive disclosure: link out to depth rather than reproducing it.
- Fast and usable on mobile as the primary reference experience.

### 10.5 Homepage must not

- Explain everything.
- Give every audience equal space.
- Reproduce patterns from competitor/reference websites (see Section 21 of the originality requirement, reflected in Section 8).
- Use a generic "Learn more" for all CTAs.

---

## 11. HENU OS Experience

### 11.1 Role

HENU OS is HENU's flagship technology and should carry strong prominence across the site, while remaining one product within a broader ecosystem.

### 11.2 What the experience must communicate

| Topic | Requirement | Confirmation |
|------|-------------|--------------|
| What HENU OS is | A clear, plain-language description plus technical description | `[REQUIRES CONFIRMATION]` |
| Who it is for | Specific target users | `[REQUIRES CONFIRMATION]` |
| Why it exists | The problem it addresses | `[REQUIRES CONFIRMATION]` |
| Core capabilities | Specific, verified capabilities | `[REQUIRES CONFIRMATION]` |
| Voice interaction | How voice works in the OS, shown not merely claimed | `[REQUIRES CONFIRMATION]` |
| HENU PA relationship | How the assistant integrates with the OS | `[REQUIRES CONFIRMATION]` |
| HENU AI relationship | What role AI models play | `[REQUIRES CONFIRMATION]` |
| HENU IDE relationship | How the developer environment fits | `[REQUIRES CONFIRMATION]` |
| Developer experience | What developers can do on it | `[REQUIRES CONFIRMATION]` |
| Privacy/security philosophy | Only supportable statements | `[REQUIRES CONFIRMATION]` |
| System requirements | Accurate hardware/architecture requirements | `[REQUIRES CONFIRMATION]` |
| Releases | Version, channel, history | `[REQUIRES CONFIRMATION]` |
| Download | A trustworthy download path | `[REQUIRES CONFIRMATION]` |
| Documentation | Links to installation and usage docs | `[REQUIRES CONFIRMATION]` |
| Community / support | Where to get help | `[REQUIRES CONFIRMATION]` |

### 11.3 Separation of concerns

HENU OS content is divided across three distinct layers and must **not** be forced into one page:

| Layer | Purpose | Lives in |
|-------|---------|---------|
| **Marketing information** | Persuade and orient: why HENU OS, who it is for, what it feels like | HENU OS page |
| **Technical documentation** | Teach: installation, configuration, usage, troubleshooting | Documentation |
| **Download / release information** | Distribute and verify: versions, checksums, requirements, release notes | Downloads & Releases |

Each layer links to the others contextually (for example, HENU OS page → Download; Download → Installation docs; Docs → Release notes).

### 11.4 Evidence expectations

HENU OS should be supported by whatever real evidence exists: a demonstration (video or recorded session), actual screenshots of the real system, release history, documentation, and repositories. Representative illustration must not be passed off as real product footage. `[REQUIRES CONFIRMATION: availability of real demonstration assets]`

---

## 12. Product Ecosystem

### 12.1 Products in scope

HENU OS, HENU PA, HENU AI, HENU IDE, and other HENU software/products where appropriate. `[REQUIRES CONFIRMATION: complete and accurate product list and status]`

### 12.2 Ecosystem relationships (working hypothesis)

| Product | Role in ecosystem | Relationship |
|---------|------------------|-------------|
| HENU OS | Foundation and flagship; the environment users live in | Hosts the others |
| HENU PA | Voice interface to the system | Integrated with HENU OS |
| HENU AI | Intelligence layer built around multiple LLM capabilities | Powers assistant and other intelligent behaviours `[REQUIRES CONFIRMATION]` |
| HENU IDE | Developer environment with AI assistance | Used to build on/for the ecosystem `[REQUIRES CONFIRMATION]` |

The precise dependencies (for example, whether HENU PA runs outside HENU OS, or whether HENU AI is available independently) `[REQUIRES CONFIRMATION]`.

### 12.3 Presentation requirements

- Products must not appear as unrelated items in a uniform card grid.
- The ecosystem hub must show relationships (what depends on what, and what works together).
- Every product page includes an "ecosystem relationship" element explaining how it connects to the other products.
- Each product carries an honest status label (for example Available, Beta, In development, Coming soon).
- Where a product can be used independently, say so; where it depends on another, say so.
- A visitor arriving at any product page must be able to move laterally to related products without returning to the hub.

### 12.4 Product page requirement

Product pages must avoid the "Logo → Name → 3 bullets → Learn More" pattern. Each should communicate:

**Why it exists → Problem → Solution → Experience → Capabilities → Ecosystem relationship → Evidence → Next action**

The exact structure may vary by product, depending on maturity and available evidence.

---

## 13. Services

### 13.1 Role

Services are an intentional part of the website, presented as the **applied engineering capability of a technology company**, not as an unrelated freelance directory.

### 13.2 Evaluation of the current service list

The service list provided is: Website Development, Backend Development, Mobile App Development, AI Automation, Graphic Design, Digital Marketing & Ads, Legal Service, Funding Solution, and other validated HENU services.

Not all of these sit comfortably under a single technology positioning. A recommended categorisation:

| Category | Services | Fit with technology positioning |
|----------|---------|-------------------------------|
| **Software & Product Engineering** | Website Development, Backend Development, Mobile App Development | Strong fit; HENU's core engineering capability |
| **AI & Automation** | AI Automation (and related AI solutions, building on HENU AI where applicable) | Strong fit; connects directly to the product ecosystem |
| **Brand & Growth** | Graphic Design, Digital Marketing & Ads | Moderate fit; supports technology delivery but risks making HENU look like a generalist agency if prominent |
| **Business Solutions** | Legal Service, Funding Solution | Weak fit with technology positioning; carries regulatory/credibility implications and may dilute the brand |

**Recommendation:** Lead with Software & Product Engineering and AI & Automation. Present Brand & Growth as supporting capability. Do **not** place Legal Service and Funding Solution alongside engineering services in the public primary structure without a deliberate decision. They may be presented separately as business support, handled under a distinct entity or surface, or omitted from the public site. `[REQUIRES CONFIRMATION: whether legal and funding services are offered by HENU itself, whether they are regulated, who delivers them, and whether they should be publicly listed]`

### 13.3 Services architecture requirements

- A Services hub framing offerings by the customer problem, not by technology.
- Individual service pages for validated, in-scope services.
- A shared, honest description of HENU's real process (see 13.5).
- Case studies linked from relevant services, when real ones exist.
- Clear enquiry entry points with intent-appropriate CTAs.

### 13.4 Service definition template

Each service must be documented with these fields before it is built (owner: HENU business/delivery lead `[REQUIRES CONFIRMATION]`):

| Field | Question |
|-------|---------|
| Customer problem | What problem does the client have? |
| HENU solution | How does HENU solve it? |
| Deliverables | What does the client receive? |
| Ideal customer | Who is this for (and not for)? |
| Technology / capability | What expertise supports it? |
| Process | How does HENU deliver it? |
| Proof | What evidence exists (case study, product, reference)? |
| CTA | What is the right next action? |

Service pages must follow: **Customer problem → HENU approach → Solution → Technology → Deliverables → Process → Evidence → CTA.** A service page that is only a technology list (for example React, Next.js, Node.js, PostgreSQL, AWS) is not acceptable. Technology supports the story; it is not the story.

### 13.5 Process

Where useful, the site explains how HENU works to reduce client uncertainty. A candidate staging (Understand → Plan → Design → Build → Test → Launch → Improve) must **not** be adopted by default. The published process must represent HENU's actual workflow. `[REQUIRES CONFIRMATION: real HENU delivery process]`

### 13.6 Product vs. service separation

Product and service messaging must remain distinct: separate navigation entries, separate CTAs, separate pages. The two sides reinforce each other through explicit, intentional cross-references (for example, "built on the same engineering as HENU's products"), not by being merged into one catalogue.

---

## 14. Projects & Case Studies

### 14.1 Decision

HENU should have a **Work** area built around **case studies and product stories**, not a default portfolio grid.

| Type | Include? | Reasoning |
|------|---------|-----------|
| Case studies (client work) | **Yes**, where permission and real outcomes exist | Primary evidence for services |
| Product stories (how HENU's own products came to be) | **Yes**, V1.1 where meaningful | Reinforces product credibility and the product-plus-service combination |
| Projects (lightweight entries) | **Conditional** | Acceptable only if they carry context, not as bare thumbnails |
| Generic portfolio grid | **No** by default | Communicates "things we made", not "evidence that HENU can solve meaningful problems" |

### 14.2 Difference in intent

- **"Here are things we made"** — a list of outputs; weak evidence; interchangeable with any agency.
- **"Here is evidence that HENU can solve meaningful problems"** — specific problem, specific approach, specific result; persuasive to clients and credible to partners.

### 14.3 Case study structure

**Challenge → Context → Approach → Solution → Technology → Outcome → Evidence.**

Outcomes should be:

- Measured, with source and owner, where verified metrics exist.
- Qualitative where measurable outcomes are unavailable. No metric may be invented.
- Approved by the client where the client is named. `[REQUIRES CONFIRMATION: client permission, NDAs]`

### 14.4 V1 stance

Launch with the number of case studies HENU can genuinely substantiate. Zero or one strong case study is better than a padded grid. If none can be shown at launch, the Work area should be deferred (V1.1) and proof should come from products, releases, technology and documentation instead. `[REQUIRES CONFIRMATION: which case studies can be publicly shown]`

---

## 15. Technology & Capabilities

### 15.1 Purpose

Technology & Capabilities is the area where HENU demonstrates engineering depth to developers and technical decision-makers. It explains how HENU's technologies fit together without becoming a logo wall.

### 15.2 Requirements

- Describe HENU's technology philosophy and the capabilities that cut across products (for example, voice interaction, AI/LLM integration, developer tooling, Linux foundation) `[REQUIRES CONFIRMATION: accurate capability list]`.
- Show how HENU OS, HENU PA, HENU AI and HENU IDE share technical foundations, where true.
- Link capabilities to products, documentation, repositories and releases.
- Present only technologies HENU genuinely uses, with context for why.
- Describe engineering practice (testing, release, security) only where it is real. `[REQUIRES CONFIRMATION]`
- Remain readable for non-technical visitors through a plain-language summary before technical depth.

### 15.3 Exclusions

- Technology logo walls with no context.
- Benchmarks or performance claims without source and method.
- Duplicated product marketing.

---

## 16. Documentation

### 16.1 Hosting options

| Option | Strengths | Weaknesses |
|--------|----------|-----------|
| Inside the main website | Strong SEO continuity, consistent brand, simple for V1 | Can couple docs and marketing release cycles; limited docs-specific features |
| Dedicated route on the main domain | Shared brand with clearer separation of purpose | Requires clean separation to avoid marketing/docs mixing |
| Separate documentation application/domain | Best for docs tooling, versioning, search | Brand disconnect risk; extra operational overhead |

### 16.2 Recommendation (for decision)

For V1, provide a **documentation entry point and essential content (Getting Started, Installation, HENU OS basics, Troubleshooting, FAQ, Release Notes)** under a **dedicated route on the main site**, structured so it can later move to a dedicated documentation system without breaking links. A full docs platform is V1.1/Future depending on content volume. `[REQUIRES CONFIRMATION: Open Product Decision]`

### 16.3 Conceptual information architecture

- Getting Started
- Installation
- HENU OS
- HENU PA
- HENU AI
- HENU IDE
- Developer Guide
- Configuration
- Troubleshooting
- FAQ
- Release Notes
- API / technical references where applicable

Only categories with real content are published; empty categories must not appear.

### 16.4 Requirements

- Documentation is clearly separated from marketing content, in tone, structure and navigation.
- Every product page links into its documentation; every documentation section links back to the product and to the relevant release.
- Documentation should be searchable once it exceeds a manageable size. `[Future]`
- Documentation must state which product version it applies to.
- Content ownership and update responsibility must be defined. `[REQUIRES CONFIRMATION]`

---

## 17. Downloads & Releases

### 17.1 Role

A required strategic area for HENU OS. The download experience must be designed as a trust and verification experience, not as a link to an unexplained file.

### 17.2 Information to support (eventual)

| Information | Notes |
|-------------|------|
| Current stable version | Clearly highlighted |
| Release date | Visible |
| Release channel | For example stable / beta / nightly, if used `[REQUIRES CONFIRMATION]` |
| Architecture | Supported CPU architectures `[REQUIRES CONFIRMATION]` |
| System requirements | Minimum and recommended `[REQUIRES CONFIRMATION]` |
| ISO / file size | Visible before download |
| Download | Primary action |
| Checksums (for example SHA-256) | Visible and verifiable |
| Signatures | If HENU signs releases `[REQUIRES CONFIRMATION]` |
| Release notes | Per release |
| Previous releases | Archive |
| Installation guide | Linked |
| Upgrade information | Linked |

### 17.3 Distribution options

| Option | Considerations |
|--------|---------------|
| Direct hosting from the website infrastructure | Simple, but poor at large files and traffic spikes |
| Object storage + CDN | Scalable, cost-effective and resilient for large ISO files; recommended direction for evaluation |
| Mirrors / third-party hosting / torrent | Increases availability and resilience; requires checksum/signature integrity |
| Source repository releases | Useful for developer audiences; may complement the main path |

The recommendation to evaluate is **object storage with CDN, with checksums (and signatures if available) published alongside**, but the final decision belongs to technical architecture. `[REQUIRES CONFIRMATION: Open Product Decision]`

### 17.4 Requirements

- Release information is owned data, not hand-edited copy; a single source of truth drives Home/OS/Download displays so versions cannot disagree.
- Failed downloads must surface clear recovery guidance.
- Verification guidance (how to check the checksum) must be provided.
- If no public release exists at launch, the page must be honest: status, waitlist or notification, not a dead download button.
- Download analytics are `[Future]` unless needed to measure the V1 success metric; any measurement must respect privacy commitments.

---

## 18. Contact & Conversion

### 18.1 Principle

There is no single "Contact Us". Conversion paths are distinguished by intent, with each intent producing an appropriately light interaction.

### 18.2 Intent matrix

| Intent | Appropriate action | V1 form needed? | Notes |
|--------|-------------------|-----------------|-------|
| Download HENU OS | Download page (or waitlist) | No form unless waitlist | Not a contact form |
| Explore products | Navigation, product pages | No | |
| Request a service / start a project | Project enquiry | **Yes** | Core business conversion |
| Ask a technical question | Link to documentation/community/support channel; fallback email/form | Lightweight | Route to docs first |
| Partnership | Short partnership enquiry | **Yes (simple)** | Could share a general form with a type selector |
| General enquiry | General contact | **Yes** | |
| Support | Support channel/docs | Defer dedicated form to V1.1; provide channel | `[REQUIRES CONFIRMATION: support model]` |
| Media | Contact address | No form | |

### 18.3 Form requirements

- Ask only for what is needed to respond. Project enquiry: name, email, short description of the need; optional fields clearly marked as optional.
- Clear acknowledgement and expected response time (only if HENU can honour it). `[REQUIRES CONFIRMATION]`
- Spam protection that does not harm accessibility.
- Graceful failure states and no lost user input.
- Consent and privacy notice consistent with the Privacy Policy.
- Enquiries must be delivered to a defined owner and tracked; unmonitored forms are worse than no form.

### 18.4 CTA principles

Different contexts use different actions:

- **Product:** Explore, Download, Read Documentation, View Release, Try.
- **Services:** Discuss a Project, Request a Proposal, Start an Enquiry.
- **Technical:** Documentation, GitHub, Developer Resources.
- **General:** Contact HENU, Explore HENU.

Every major page has exactly one clear primary action.

---

## 19. Trust & Credibility

### 19.1 Principle

Credibility is created through evidence, not adjectives. Prohibited unless substantiated: "best", "revolutionary", "world-class", "fastest", "most powerful", "industry-leading".

### 19.2 Evidence sources and status

| Proof mechanism | Use on site | Status |
|-----------------|------------|--------|
| Products launched | Product pages, Home | `[REQUIRES CONFIRMATION]` |
| Release history | Downloads, HENU OS | `[REQUIRES CONFIRMATION]` |
| Technology stack | Technology | `[REQUIRES CONFIRMATION]` |
| Real projects | Work | `[REQUIRES CONFIRMATION]` |
| Client information where permitted | Work, Services | `[REQUIRES CONFIRMATION: permissions]` |
| Testimonials (legitimate) | Services, Work | `[REQUIRES CONFIRMATION]` |
| Certifications (genuine) | About, Security | `[REQUIRES CONFIRMATION]` |
| Open-source repositories | Technology, Docs | `[REQUIRES CONFIRMATION]` |
| Product usage | Products | `[REQUIRES CONFIRMATION]` |
| Engineering methodology | Technology, Services | `[REQUIRES CONFIRMATION]` |
| Security practices | Security | `[REQUIRES CONFIRMATION]` |
| Team expertise | About | `[REQUIRES CONFIRMATION]` |
| Timeline / history | About | `[REQUIRES CONFIRMATION]` |
| Demonstrations | HENU OS, product pages | `[REQUIRES CONFIRMATION]` |

### 19.3 Never invent

Client counts, revenue, countries served, uptime, ratings, certifications, performance percentages, user counts, project counts, testimonials, logos or partnerships.

### 19.4 Metric governance

Every metric displayed on the site must have:

1. A **source** (where the number comes from).
2. An **internal owner** (who is accountable for its accuracy).
3. A **review date** or update mechanism.

A metric that cannot meet these conditions does not appear.

### 19.5 Honest status labelling

Where something is early, in development or planned, label it. Honesty about stage is itself a credibility signal and prevents reputational damage.

---

## 20. Admin & Content Management

### 20.1 Principle

Do not assume every content type needs an administrative interface. Choose the lightest management model that keeps content accurate and maintainable.

### 20.2 Content-type decisions

| Content type | Recommended V1 model | Later model | Notes |
|--------------|---------------------|-------------|-------|
| Contact enquiries | **Database-backed** (stored and routed to an owner) | Admin-managed view | Needs reliable storage and notification; may be satisfied by delivery plus persistence without a full admin UI |
| Products | **Static** (managed in the codebase/content files) | CMS-managed | Few products; changes are infrequent |
| Services | **Static** | CMS-managed | Few services; changes are infrequent |
| Projects / case studies | **Static** | CMS-managed | Low volume, high editorial care |
| Blog / insights posts | **Static (file-based content)** in V1.1 | CMS-managed if frequency justifies | Introduce a CMS only if publishing frequency demands it |
| Downloads / releases | **Static structured data (single source of truth)** in V1; **Admin-managed** later | Admin-managed with checksum/size automation | Highest risk of inconsistency; data structure should be designed early even if no admin UI exists |
| Documentation metadata | **Static** | Docs platform | Tied to docs hosting decision |
| Testimonials | **Static** | CMS-managed | Only legitimate, permissioned items |
| Site configuration | **Static** | Admin-managed | |

### 20.3 Scope decisions

- A full admin dashboard at launch is **not required** unless the Open Product Decisions determine otherwise.
- A CMS is not required in V1; defer until content volume and editor needs justify it.
- RBAC is **Future** scope unless explicitly required.
- The one area that should be treated as structured data from the start is **release information**, because consistency and correctness matter most there.
- Enquiries must have a defined handling workflow regardless of admin tooling.

`[REQUIRES CONFIRMATION: who edits content, how often, and whether non-developers must publish without engineering help]`

---

## 21. Non-Functional Requirements

### 21.1 Reliability

- **Error states:** Meaningful error pages and component-level errors; no blank or broken screens.
- **Loading states:** Visible, non-jarring loading behaviour for any asynchronous content.
- **Empty states:** Defined behaviour where content may be absent (for example, no releases, no case studies yet).
- **Form failures:** Clear messaging, preserved input, retry path, and a fallback contact method.
- **Download failures:** Clear recovery guidance, alternative mirrors/links if available, and checksum verification help.
- **Graceful degradation:** Core content and navigation remain usable if scripts, media or third-party services fail.

### 21.2 Maintainability

- Content structure supports adding products, services, releases, articles, case studies and documentation without redesign.
- The structure should not require speculative infrastructure for content that does not yet exist.

### 21.3 Security and privacy (website-level)

- Secure transport and standard web security hygiene.
- Minimal data collection; clear privacy disclosure.
- Responsible handling of enquiry data.
- Third-party scripts limited and justified.
- Detailed security requirements belong in the technical architecture document.

### 21.4 Browser and device support

Modern evergreen browsers and common mobile browsers. Exact support matrix `[REQUIRES CONFIRMATION]`.

---

## 22. SEO Requirements

- **Metadata:** Unique, accurate titles and descriptions per page.
- **Open Graph / social previews:** Meaningful share previews for key pages.
- **Structured data:** Where useful (for example Organization, SoftwareApplication, Article, FAQ where it matches visible content).
- **Canonical URLs:** Defined to avoid duplicates.
- **Sitemap and robots:** Maintained and accurate.
- **Semantic content:** Meaningful headings and content hierarchy.
- **Search-friendly architecture:** Clean, stable, human-readable URLs; internal linking between related products, services, docs and releases.
- **Brand disambiguation:** Search visibility for "HENU" plus product names should be considered, since the name may be shared with unrelated entities. `[REQUIRES CONFIRMATION: current search landscape]`
- **Content intent:** Pages should target real user questions (for example "what is HENU OS", "HENU OS download"), not keyword stuffing.
- **Indexing policy:** Decide which pages are indexed (for example avoid indexing thin or placeholder pages).

---

## 23. Accessibility Requirements

Accessibility is part of quality. The target conformance level is **WCAG 2.2 AA** `[REQUIRES CONFIRMATION: target level]`.

- **Keyboard navigation:** All interactive elements reachable and operable by keyboard; logical focus order.
- **Semantic HTML:** Correct landmarks, headings and form semantics.
- **Screen-reader support:** Meaningful labels, alternative text for meaningful images, accessible names for controls, meaningful announcements for dynamic changes.
- **Colour contrast:** Meets contrast requirements in all themes and states.
- **Focus states:** Always visible and distinct.
- **Reduced motion:** Honour reduced-motion preferences; essential information never conveyed only through animation.
- **Forms:** Labels, helpful validation, error identification and recovery.
- **Media:** Captions/transcripts for video demos where applicable.
- **Don't rely on colour alone** to convey meaning (for example status labels).
- **Touch targets:** Adequate size and spacing on mobile.

---

## 24. Responsive Requirements

The website must be fully usable and well composed across:

| Class | Expectation |
|-------|------------|
| **Mobile** | First-class experience; primary actions reachable, no horizontal scrolling, readable text, navigation that exposes all journeys |
| **Tablet** | Appropriate use of space; not a stretched mobile or squeezed desktop |
| **Laptop** | Baseline desktop experience |
| **Large desktop** | Controlled content widths; layout does not feel empty or lose hierarchy |
| **Ultra-wide** | Contained composition; backgrounds and media scale sensibly |

Additional requirements:

- Orientation changes handled gracefully.
- Text scaling and zoom supported without breaking layout.
- Tables, code snippets, checksums and technical content remain readable on small screens.
- Interactions do not depend on hover alone.
- The download page and enquiry forms are explicitly tested on mobile.

---

## 25. Performance Requirements

Performance is part of design.

- **Fast first load:** Priority on above-the-fold content and critical rendering path.
- **Core Web Vitals:** Good scores for loading, interactivity and visual stability. Numeric targets are **to be established** against a baseline and Google's published thresholds `[REQUIRES CONFIRMATION]`.
- **Optimised assets:** Compressed, appropriately sized images and media; efficient fonts.
- **Minimal unnecessary client-side JavaScript:** Ship only what the page needs; prefer server-rendered or static content for informational pages.
- **Responsive images:** Appropriate sizes and formats per device.
- **Caching / CDN strategy:** Static assets and large downloads delivered through caching/CDN; cache behaviour defined for release data.
- **Media discipline:** Video and heavy visuals loaded on demand, never blocking first meaningful content.
- **Motion budget:** Animation must not degrade performance on mid-range mobile devices.
- **Third-party scripts:** Added only with justification and measured impact.
- **Performance as acceptance criterion:** A page that fails agreed performance thresholds is not considered complete.

---

## 26. V1 / V1.1 / Future Scope

### 26.1 Scope matrix

| Capability | V1 | V1.1 | Future | Notes |
|-----------|:--:|:----:|:------:|-------|
| Home | ✔ | | | |
| HENU OS flagship page | ✔ | | | |
| Products hub | ✔ | | | |
| Product pages (launch-ready products) | ✔ | | | Others follow in V1.1 |
| Product pages (remaining products) | | ✔ | | |
| Services hub | ✔ | | | |
| Core service pages (validated) | ✔ | | | |
| Additional service pages | | ✔ | | |
| Technology / Capabilities | ✔ | | | |
| About HENU | ✔ | | | |
| Case studies | ✔* | ✔ | | *Only if real, permitted work exists |
| Downloads & Releases (or honest status page) | ✔ | | | |
| Release data as single source of truth | ✔ | | | |
| Documentation entry + essentials | ✔ | | | |
| Expanded documentation | | ✔ | | |
| Dedicated documentation platform with search/versioning | | | ✔ | Depends on hosting decision |
| Contact with intent routing (project, general, partnership) | ✔ | | | |
| Dedicated support form/system | | ✔ | | |
| FAQ (real questions) | ✔ | | | |
| Privacy Policy, Terms | ✔ | | | Subject to legal review |
| Security / responsible disclosure | | ✔ | | V1 if OS is publicly distributed |
| Insights (blog/news/release notes) | | ✔ | | Only with real content and an owner |
| SEO foundations, accessibility, performance baseline | ✔ | | | |
| Contact enquiry storage and notification | ✔ | | | |
| Basic admin view of enquiries | | ✔ | | Only if required |
| Simple content-managed publishing (CMS) | | | ✔ | When volume justifies |
| Admin dashboard (broad) | | | ✔ | Pending Open Product Decision |
| Full RBAC | | | ✔ | Explicit future scope |
| Client portal | | | ✔ | |
| Community portal | | | ✔ | |
| Developer API portal | | | ✔ | |
| Advanced documentation system | | | ✔ | |
| Product telemetry | | | ✔ | Privacy implications |
| Download analytics | | ✔ / ✔ | ✔ | Basic measurement may be V1.1; advanced later |
| Personalised dashboards | | | ✔ | |
| AI-powered website assistant | | | ✔ | Only if it adds genuine value |
| Interactive HENU OS preview | | | ✔ | Strong candidate once product is stable |
| Product configurator | | | ✔ | |
| Multilingual website | | | ✔ | `[REQUIRES CONFIRMATION: language needs]` |

### 26.2 Scope discipline

- A future idea does not enter V1 because it is attractive. It must be required for the V1 goals in Section 3.
- V1 must be shippable without any Future item.
- Anything in V1 that depends on unconfirmed facts (product readiness, case studies, legal copy) is conditional and must follow the confirmation outcome.

---

## 27. Success Metrics

### 27.1 Principle

Metrics must have a defined measurement method and owner. No numeric targets are set without rationale. Where baselines are unknown, targets are **to be established** after launch.

### 27.2 Metrics

| Goal | Metric | How measured | Target |
|------|--------|-------------|--------|
| Comprehension | Visitors correctly describe what HENU is | Qualitative testing / short on-site feedback or moderated review | To be established |
| Routing | Share of visitors reaching a relevant product/service/docs page from the homepage | Navigation analytics | To be established |
| Product interest | Product page engagement (depth, return to docs/download) | Analytics | To be established |
| HENU OS conversion | Download or waitlist conversion from HENU OS page | Event tracking | To be established |
| Download success | Download completion rate; checksum guidance usage | Download telemetry/CDN logs (privacy-respecting) | To be established |
| Service conversion | Project enquiry conversion rate | Form analytics | To be established |
| Enquiry quality | Share of enquiries that are relevant/qualified | Manual review by business owner | To be established |
| Contact reliability | Form completion and error rates | Form analytics | To be established |
| Documentation engagement | Docs entry to Getting Started progression | Analytics | To be established |
| Exit behaviour | Exit/bounce patterns on key pages (interpreted with caution) | Analytics | To be established |
| Performance | Core Web Vitals (field data) | Field monitoring | Good thresholds per published standards; baseline to be established |
| Mobile performance | Mobile CWV and mobile conversion | Field monitoring | To be established |
| Search visibility | Branded and category query impressions/clicks | Search console | To be established |
| Credibility | Share of claims with an owner and source | Content audit | 100% of published metrics must have source and owner (policy, not a forecast) |

### 27.3 Governance

- A named owner for analytics and for reporting. `[REQUIRES CONFIRMATION]`
- A review cadence after launch (for example 30/60/90 days) to set the targets that are currently "to be established".
- Privacy-respecting measurement consistent with the Privacy Policy.

---

## 28. Risks & Mitigations

| # | Risk | Impact | Mitigation |
|---|------|--------|-----------|
| 1 | Too many products confuse visitors | Fragmented understanding | Ecosystem framing, one flagship, status labels, relationship views |
| 2 | Product and service messaging mix | HENU reads as an agency or as unfocused | Separate navigation, pages and CTAs; deliberate cross-references only |
| 3 | Homepage overload | Cognitive overload, lower conversion | Progressive disclosure; homepage routes, not explains |
| 4 | Excessive animation | Slow, distracting, inaccessible | Motion budget, reduced-motion support, communication-only motion principle |
| 5 | Over-engineering admin infrastructure | Delay and complexity | Static-first content model, explicit deferral of CMS/RBAC |
| 6 | Building a CMS too early | Wasted effort | Introduce only when content volume and editors justify |
| 7 | Weak differentiation | Forgettable positioning | Lead with the ecosystem story; validate differentiators against reality |
| 8 | Unsupported marketing claims | Loss of trust, reputational damage | Evidence policy, metric ownership, review gate before publishing |
| 9 | Poor mobile experience | Lost visitors | Mobile as first-class, explicit mobile testing of key flows |
| 10 | Slow, media-heavy pages | Poor Core Web Vitals, SEO and conversion loss | Performance budget, on-demand media, asset optimisation |
| 11 | Download architecture as an afterthought | Fragile releases, trust damage, bandwidth cost | Treat downloads as a strategic area; release data as a single source of truth; evaluate CDN/object storage early |
| 12 | Documentation disconnected from product pages | Dead ends for developers and users | Cross-linking requirements, shared ownership |
| 13 | Design too similar to competitors/reference sites | Loss of identity; originality failure | Originality requirement, independent design-system evaluation, review for pattern similarity |
| 14 | Appealing equally to every audience | Diluted message | Audience hierarchy, dedicated pages per journey |
| 15 | Launching with content HENU cannot substantiate | Credibility harm | `[REQUIRES CONFIRMATION]` gates; omit rather than invent; honest status labels |
| 16 | Services portfolio feels like an unrelated freelance list | Brand dilution | Categorisation, problem-led pages, conditional listing of Legal/Funding services |
| 17 | Enquiries lost or unanswered | Missed revenue, poor reputation | Defined owner, storage plus notification, response expectations only if achievable |
| 18 | Content ownership unclear after launch | Stale or inaccurate site | Named owners per content type; review cadence |
| 19 | Legal and privacy gaps | Compliance exposure | Legal review of Privacy/Terms and data handling |
| 20 | Brand confusion between HENU company and HENU OS | Unclear identity | Resolve brand architecture early (Open Product Decisions) |

---

## 29. Open Product Decisions

Only decisions that genuinely require an answer are listed. Each should have an owner and a decision date before the next documents are finalised.

| # | Decision | Why it matters | Depends on / affects |
|---|----------|---------------|---------------------|
| 1 | **Exact primary homepage audience** (product/technical first, or client first?) | Determines homepage hierarchy and primary CTA | Section 5, Section 10 |
| 2 | **Final relationship between HENU (company) and HENU OS branding** | Prevents "OS site vs. company site" confusion; affects navigation, naming, URLs | Section 4.6, Section 9 |
| 3 | **Which products are launch-ready** and their public status labels | Determines product pages, ecosystem claims and CTAs | Sections 11, 12 |
| 4 | **Which services should be publicly listed** (especially Legal Service, Funding Solution, Graphic Design, Digital Marketing & Ads) | Determines brand coherence and regulatory exposure | Section 13 |
| 5 | **Which case studies can be publicly shown** (permissions, NDAs) | Determines whether Work is V1 | Section 14 |
| 6 | **Which metrics and claims can be verified**, and who owns them | Gates all proof content | Section 19 |
| 7 | **Download hosting/distribution strategy** (CDN/object storage, mirrors, repository releases) | Affects cost, reliability, trust and release workflow | Section 17 |
| 8 | **Is a public release available at launch?** (Download vs. waitlist/coming soon) | Defines the HENU OS primary CTA | Sections 11, 17 |
| 9 | **Whether documentation is hosted within the main site** (route vs. separate application/domain) | Affects SEO, brand continuity, tooling and ownership | Section 16 |
| 10 | **Whether a CMS is needed in V1** and who publishes content | Affects architecture and scope | Section 20 |
| 11 | **Whether an admin dashboard is needed at launch** (beyond enquiry handling) | Affects scope and timeline | Section 20 |
| 12 | **HENU's real delivery process** for client work | Required for authentic process content | Section 13.5 |
| 13 | **Open-source status** of HENU products and which repositories are public | Affects developer credibility, CTAs (GitHub), FAQ ("is it free/open source") | Sections 15, 16 |
| 14 | **Support model** (channels, expectations, ownership) | Affects Contact and Docs | Section 18 |
| 15 | **Target accessibility conformance level and browser support matrix** | Sets quality gates | Sections 21, 23 |
| 16 | **Multilingual website need** at launch | Affects architecture and content workload | Section 26 |
| 17 | **Tagline decisions** (which taglines remain, and in what role) | Affects copy and brand | Section 4.5 |
| 18 | **Legal review** of Privacy, Terms and enquiry data handling | Compliance | Section 9 |

---

## 30. Final Product Definition

**The HENU website is the official, evidence-led home of the HENU technology ecosystem.**

It exists to let a new visitor understand, within seconds, what HENU is and builds; to connect them to the right product, service or technical resource; to demonstrate, through real products, releases, documentation and work, that HENU is a serious technology company; and to give every visitor a clear next action appropriate to their intent.

**It is built around:**

- A **core idea**: a connected ecosystem led by HENU OS, with voice-first computing and developer orientation as its strongest supports.
- A **structure** that treats Products, Services, Technology, Documentation, Downloads, Work and Contact as distinct intents with distinct journeys.
- A **credibility model**: real evidence, owned metrics, honest status labels; no invented proof.
- **Quality**: original identity, accessible, fast, mobile-first.

**It includes in V1:** Home, HENU OS, Products, launch-ready product pages, Services and validated service pages, Technology, About, an honest and trustworthy Downloads & Releases experience, documentation entry and essentials, intent-based Contact, a compact FAQ, and legal pages, with case studies included only if real and permitted.

**It deliberately excludes from V1:** a full CMS, full RBAC, client or community portals, a developer API portal, advanced documentation platform, telemetry, personalisation, AI website assistant, interactive OS preview, product configurator, and any content created purely because competitors have it.

**It is not:** a generic agency site, a single-product landing page, a Linux template, a flashy site without substance, a clone of any reference website, or a repository of unsupported claims.

**Its measure of success** is not whether it looks technically impressive, but whether visitors leave understanding HENU, trusting HENU, and knowing exactly what to do next.

> **Guiding principle:** Build a website that makes HENU look like the serious technology ecosystem it intends to become, not merely a website that looks technically impressive.

---

*End of document. All items marked `[REQUIRES CONFIRMATION]` must be resolved by an accountable HENU owner before the dependent content is published or built.*
