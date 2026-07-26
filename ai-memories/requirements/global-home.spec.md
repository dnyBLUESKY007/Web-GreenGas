# Global Shell and Homepage Specification

## Problem Statement

The current global shell exposes six navigation items, includes a duplicate Contact Us button, and uses page-specific browser titles. The homepage does not contain all requested discovery sections and its post-hero introduction is not the approved company copy.

## Solution

Create a responsive eight-item global navigation, align the brand near the viewport's left edge, preserve legacy entry points, and recompose the homepage around the approved company introduction and the new product, industry, case, partner, news, technical-support, and company content.

## Functional Requirements

### Global Header

- Show navigation in this exact order: Home, About Us, Product Navigation, Industry Applications, Technical Support, Case Center, News Center, Contact Us.
- Increase desktop navigation type size from the current presentation while preserving fit at supported desktop widths.
- Remove the duplicate desktop Contact Us button.
- Position the brand near the viewport left edge with a deliberate safe margin rather than the centered content container edge.
- Preserve a complete and keyboard-usable mobile menu with all eight destinations.
- Preserve the existing mobile language and scroll-to-top controls unless a confirmed accessibility conflict requires adjustment.

### Metadata and Compatibility

- Set every browser tab title to `GREENGAS 格灵空调` after page initialization.
- Keep page-specific meta descriptions and social descriptions.
- Redirect the legacy solutions destination to Product Navigation under root and configured base-path deployments.
- Redirect the legacy FAQ destination to the FAQ anchor on Contact Us under root and configured base-path deployments; opening the Contact page without locating the FAQ section is insufficient.
- Preserve base-path-safe internal URLs.

### Homepage Content Order

1. Four-slide hero carousel.
2. Approved first paragraph of the company description.
3. Product Navigation preview.
4. Industry Applications preview.
5. Case Center preview.
6. Partner showcase.
7. News Center preview.
8. Technical Support and service preview.
9. Company and contact summary.

### Homepage Presentation

- Keep the existing four hero images unless a later material request supplies approved replacements.
- Replace the post-hero paragraph with the exact approved Chinese first paragraph and machine-translated English and Russian equivalents.
- Use the Product Navigation data and links rather than maintaining a second hard-coded product list.
- Present Industry Applications as image or icon cards with a short application statement.
- Present cases using verified case data where available. Example cases must retain their visible status label.
- Present partner logos in a grouped grid or controlled carousel inspired by the reference layout. Do not hotlink reference-site logos.
- Present news with a featured visual plus date, category, title, and short summary.
- Ensure homepage previews link to their complete destination pages.

## Content Rules

- Homepage facts follow the shared source priority.
- Partner names and logos require GREENGAS source material or an Example Placeholder label.
- Do not present numeric capability claims unless supported by an approved source.
- Avoid duplicating long detail-page copy on the homepage.

## Acceptance Criteria

- The header displays all eight items in the approved order on desktop and mobile.
- The brand is visibly aligned near the viewport left edge.
- The duplicate Contact Us button is absent.
- Navigation remains usable at 1024 and 1440 pixels and switches cleanly to the mobile pattern at smaller widths.
- Every page's browser title resolves to `GREENGAS 格灵空调`.
- Legacy solutions and FAQ URLs reach the approved replacement destinations.
- The homepage follows the approved section order and uses the approved first company paragraph.
- Product, industry, case, partner, and news previews use shared structured content and working links.
- Chinese, English, and Russian render without clipped controls or unreadable overlap.
- The production build passes.

## Dependencies

- Full homepage assembly depends on the product, industry, technical-support, case, news, partner, and company slices.
- Header, title, and route compatibility can be completed independently.

## Out of Scope

- Replacing all four hero images without approved assets.
- Creating unverified partner relationships.
- Production deployment.
