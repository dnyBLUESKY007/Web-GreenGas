# Technical Support, Case Center, and News Center Specification

## Problem Statement

GREENGAS technical files are supplied in archives but are not indexed or available through a dedicated public page. Cases are scattered between homepage content, solutions content, and legacy archives, with some current records containing example facts. News already has a basic list/detail implementation but must align with the official legacy content and the new homepage presentation.

## Solution

Create a technical-support library backed by approved OSS files, rebuild cases as a status-aware map/list/detail experience, and audit the news list/detail content against approved GREENGAS sources. Reuse structured data and generic detail templates so future material updates remain content work rather than page redesign.

## Functional Requirements

### Material Inventory

- Ensure supplied archives are fully downloaded before extraction.
- Extract source files to a non-versioned material workspace.
- Index each relevant item by source path, proposed public title, content type, language, related product or industry, publication status, and replacement need.
- Treat archive presence as discovery only, not as publication approval.
- Capture unreadable, duplicate, corrupted, or ambiguously named files in the material report.

### Technical Support

- Organize public material into categories supported by the inventory, such as technical manuals, product samples, installation guidance, commissioning, maintenance, fault guidance, pre-sales selection, and after-sales support.
- Show title, category, related product, language, file type, version or date when available, and download action.
- Host approved public files in OSS.
- Provide empty and not-yet-available states without broken downloads.
- Clearly mark example document entries.

### Case Center

- Migrate the available official GREENGAS case archive before retaining or adding example records.
- Provide filters appropriate to available data, such as industry and region.
- Provide cards with project title, industry, region, equipment summary, image, content status, and detail link.
- Provide a generic case-detail page with project context, challenge, delivered equipment or response, result where known, image gallery, and related cases.
- Provide a clear not-found state for unknown case identifiers.
- Add a world map with a legend and two distinct point types:
  - Verified Case Point for identifiable projects.
  - Market Coverage Point for country or region statements without a specific case.
- Use only the geographic precision supported by the source.
- Link map points and visible case cards where applicable.

### News Center

- Audit current news records against the official legacy GREENGAS archive.
- Preserve company and industry categories.
- Present list cards with date, category, image, title, summary, and detail action.
- Preserve the generic detail-page approach and not-found state.
- Supply homepage-ready featured news data without maintaining a separate duplicate news source.

## Data and Content Rules

- Technical files, cases, and news use stable identifiers.
- Case data distinguishes content status and map-point type.
- Market coverage language must not imply an identifiable completed project.
- Example cases and documents remain visibly labelled in lists, maps, and details.
- News dates and claims must match the selected approved source.
- Competitor assets and content are prohibited.

## Acceptance Criteria

- The material inventory identifies relevant source files and outstanding publication decisions.
- Technical Support displays categorized metadata and only working approved OSS download links.
- Case Center provides a usable list, filters, generic detail pages, and not-found recovery.
- The world map provides a visible legend and distinguishable verified-case and market-coverage points.
- Map points use honest country, province, or city precision.
- Existing official GREENGAS case archive content is preferred over current invented examples.
- News list and detail content is traceable to approved GREENGAS sources.
- Homepage news can consume the same structured records.
- All three destinations support Chinese, English, and Russian without layout failure.
- The production build passes.

## Dependencies

- The material inventory blocks final technical downloads, final case data, partner assets, and parts of the news audit.
- Case map work depends on stable case identifiers and geographic fields from the Case Center slice.
- Homepage assembly depends on stable case and news preview data.

## Out of Scope

- Publishing every file found in an archive.
- Fabricating exact project coordinates.
- A full geographic-information system or third-party map API.
- A news CMS or editorial backend.
