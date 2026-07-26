# Product Navigation and Industry Applications Specification

## Problem Statement

The current website combines scenarios, cases, and product content in a broad solutions destination. Visitors cannot browse a clear product catalogue or move from an industry challenge to recommended equipment and relevant experience. Final product data is incomplete, so the first version must provide a useful framework without misrepresenting example content as verified commercial data.

## Solution

Create separate Product Navigation and Industry Applications destinations. Product Navigation provides series discovery, product cards, and a generic detail structure. Industry Applications provides industry-specific challenges, solution approaches, recommended product types, and related cases. Both use shared structured data and explicit content status.

## Functional Requirements

### Product Navigation

- Provide product-series navigation suitable for at least the legacy GREENGAS groups: central air-conditioning hosts, unit systems, terminals, and components.
- Allow the final taxonomy to be replaced from approved archive material without redesigning page components.
- Display product cards with name, series, image, short description, content status, and detail link.
- Provide a reusable product-detail page that supports:
  - Product name and series.
  - Product images.
  - Summary and application description.
  - Feature list.
  - Technical parameter table.
  - Related industry applications.
  - Downloadable technical material.
  - Inquiry call-to-action.
- Provide a clear not-found state for unknown product identifiers.
- Label example model names, parameter values, images, and downloads as Example Placeholders.

### Industry Applications

- Provide an overview grid with industry image or icon, name, and short summary.
- Initial categories should be derived from approved GREENGAS material, including steel, chemical processing, power, pharmaceutical, defence, and specialized facilities where supported.
- Provide an industry detail presentation containing:
  - Operating environment.
  - Common cooling challenge.
  - GREENGAS response.
  - Recommended equipment types.
  - Related cases.
- Permit category refinement when the material inventory identifies a more accurate GREENGAS taxonomy.
- Do not copy the competitor's industry claims or named customers.

## Data and Content Rules

- Every product and industry record carries a stable identifier and content status.
- Product parameters are Verified Content only when supported by an approved source.
- Example Placeholder parameter values must be visibly marked at the table or section level.
- Product and industry images use the established OSS asset workflow.
- Internal links remain base-path safe.
- Chinese, English, and Russian fields are available for page-level copy and structured records.

## Acceptance Criteria

- Product Navigation is reachable from the primary navigation and presents series plus product cards.
- At least one product opens in the reusable detail template.
- Unknown product identifiers show a clear recovery path.
- Example Placeholder product data is visibly distinguishable from Verified Content.
- Industry Applications is reachable from the primary navigation and presents the approved initial categories.
- Each industry presentation includes challenge, response, recommended equipment types, and related-case space.
- Product and industry cross-links work in all three languages.
- Layouts remain usable at 320, 390, 768, 1024, and 1440 pixels.
- The production build passes.

## Dependencies

- The material inventory supplies the first approved taxonomy and identifies replacement assets.
- Global route and navigation work supplies the final destinations.
- Related-case links depend on stable case identifiers, but the industry framework may ship with marked example links first.

## Out of Scope

- Automated product sizing or selection.
- Final model coverage before approved product material is available.
- Quotation, pricing, inventory, or ordering.
- Competitor product data or images.
