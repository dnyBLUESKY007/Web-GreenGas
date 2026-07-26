# GREENGAS Website Restructure PRD

## Problem Statement

The current GREENGAS website does not provide the navigation or page structure required for the company's product, industry, technical-support, case, news, and contact content. Product and industry information are mixed under a broad solutions page, cases do not have a dedicated map/list/detail experience, technical material has no public library, and FAQ is separated from the contact journey.

The homepage also lacks the requested company introduction, industry presentation, partner showcase, and news presentation. Some current product and project records are examples that can be mistaken for verified business facts. Stakeholders need a structure that can launch with clearly labelled example placeholders and then accept final material without redesigning the pages.

## Solution

Restructure the static multilingual website around eight primary destinations: Home, About Us, Product Navigation, Industry Applications, Technical Support, Case Center, News Center, and Contact Us.

Build reusable, JSON-driven list and detail structures for products and cases; create a layered world map for verified cases and market coverage; build a technical-material library backed by approved OSS downloads; refresh the homepage using the new section data; and merge FAQ into Contact Us. Preserve useful legacy URLs through compatibility redirects.

All public content must carry an explicit status. Verified Content may be presented as fact. Example Placeholders may be used to complete the first-version framework, but they must be visibly identified and tracked for replacement.

## User Stories

1. As a visitor, I want to see eight clear navigation destinations, so that I can quickly choose the type of information I need.
2. As a visitor, I want larger navigation text, so that the menu is easier to scan.
3. As a visitor, I want the GREENGAS brand aligned at the left edge of the header, so that the header has a clear visual anchor.
4. As a visitor, I want each browser tab to display `GREENGAS 格灵空调`, so that the brand remains consistent across pages.
5. As a mobile visitor, I want all eight destinations available in the mobile menu, so that desktop and mobile navigation are equivalent.
6. As a returning visitor with an old solutions link, I want to reach the replacement product area, so that legacy bookmarks do not become dead ends.
7. As a returning visitor with an old FAQ link, I want to reach the FAQ section on Contact Us, so that legacy bookmarks continue to help me.
8. As a homepage visitor, I want to read the approved first paragraph of the company description below the hero, so that I understand the company immediately.
9. As a homepage visitor, I want to browse products, industries, cases, partners, and news from the homepage, so that I can evaluate GREENGAS without searching through the menu.
10. As a prospective buyer, I want to browse product series and product cards, so that I can identify potentially relevant equipment.
11. As a prospective buyer, I want a consistent product-detail structure, so that final model data and downloads can be added without changing the interaction.
12. As a prospective buyer, I want example product content clearly labelled, so that I do not mistake placeholder specifications for a commercial offer.
13. As an industry visitor, I want to see operating challenges, recommended equipment types, and related cases, so that I can judge solution relevance.
14. As an engineer, I want technical materials grouped by purpose and product, so that I can find manuals and support documents efficiently.
15. As an engineer, I want downloads to show title, language, type, and version where available, so that I know what I am opening.
16. As a buyer, I want to view cases on a world map and in a filterable list, so that I can understand geographic and industry experience.
17. As a buyer, I want verified case points visually separated from market coverage points, so that I can distinguish project evidence from broader company statements.
18. As a visitor, I want case detail pages, so that I can read the available project context and equipment information.
19. As a visitor, I want current and archived company and industry news, so that I can review GREENGAS activity and technical information.
20. As a visitor, I want FAQ before contact information, so that common questions are answered before I make an inquiry.
21. As a visitor, I want direct phone, email, and other approved contact methods, so that I can choose the most suitable channel.
22. As a Chinese, English, or Russian visitor, I want the same information architecture in my language, so that language switching does not remove core functionality.
23. As a content coordinator, I want every placeholder and missing asset captured in a daily material request list, so that I can obtain replacements from the responsible team.
24. As a content coordinator, I want source conflicts resolved by an agreed priority, so that website facts are not selected arbitrarily.
25. As a maintainer, I want list content stored as structured data, so that content replacement does not require redesigning components.
26. As a maintainer, I want each implementation ticket small enough for one session, so that work can be delegated and completed predictably.
27. As a release owner, I want implementation and production deployment separated, so that completed slices can be reviewed together before release.

## Implementation Decisions

- Keep the existing Vite multi-page application, TypeScript DOM components, SCSS, JSON-driven content, self-built i18n, base-path support, and OSS asset workflow.
- Use the eight confirmed navigation destinations and remove the duplicate right-side Contact Us call-to-action from the desktop header.
- Keep the public browser title constant as `GREENGAS 格灵空调`; page-specific descriptions and social metadata may remain distinct.
- Split the existing solutions content between Product Navigation and Industry Applications. Preserve the legacy solutions URL with a compatibility redirect to Product Navigation.
- Merge FAQ into Contact Us and preserve the legacy FAQ URL with a compatibility redirect to the FAQ anchor.
- Define content as Verified Content, Example Placeholder, or Pending Replacement. Example Placeholders must have a visible label in every context where they appear.
- Use the source-priority order defined in `CONTEXT.md`. Reference sites are presentation references only.
- Provide Chinese, English, and Russian for all new navigation and core page content. Machine translation is acceptable for the first English and Russian versions.
- Provide Product Navigation as a category page plus a reusable generic product-detail page.
- Provide Case Center as a layered world map, filterable list, and reusable generic case-detail page.
- Represent geography at an honest precision. A country- or province-level point must not imply an unverified city or site.
- Host approved public technical files in OSS and keep their metadata and URLs in structured website data.
- Keep EmailJS delivery as a separate credential-blocked ticket. It is not required for this release; until configured, the form must not claim successful delivery.
- Complete implementation slices without automatically deploying them. All implementation issues included in this release must pass the production build and their page-behavior checks before a release-candidate ticket can be created. Deploy only through a separately approved release ticket.
- Record daily progress, remaining requirements, placeholders, and requested source material throughout implementation.

## Testing Decisions

- Use the production build as the shared automated verification seam. Every implementation issue must pass `npm run build`.
- Test externally observable page behavior rather than internal DOM helper implementation.
- Verify navigation labels, active state, legacy redirects, page titles, language switching, links, images, downloads, filters, map interactions, and detail-page not-found behavior.
- Verify layouts at representative widths of 320, 390, 768, 1024, and 1440 pixels.
- Include Russian long-label checks because it is the highest navigation and card overflow risk.
- Verify that Example Placeholders are visibly marked and that market coverage points cannot be interpreted as verified projects.
- Verify there are no direct hotlinks to competitor website assets.
- Do not introduce a new automated browser test framework as part of this project.

## Out of Scope

- A CMS or administrator backend.
- Automated product sizing or equipment selection.
- E-commerce, quotation calculation, customer accounts, or order management.
- A framework migration to React, Vue, Astro, or Next.js.
- Copying competitor copy, images, product claims, parameters, or customer lists.
- Claiming certification validity beyond supplied and approved facts.
- Publishing archive files solely because they exist in a supplied archive.
- Exact project coordinates where only a country or region is known.
- Automatic production deployment from each implementation issue.
- EmailJS credential creation or account administration.

## Further Notes

- The supplied company description currently contains `ISO140001`. The material coordinator must confirm whether this should be `ISO14001`; the implementation must not silently change formal stakeholder copy before confirmation.
- The existing project includes archived GREENGAS news and case content that should take priority over invented replacements.
- The supplied archives are now fully local under `ignored/source-archives/` and extracted by archive name under `ignored/extracted/`. In particular, `全资料.rar` is available at `ignored/source-archives/全资料.rar` and its contents at `ignored/extracted/全资料/`.
