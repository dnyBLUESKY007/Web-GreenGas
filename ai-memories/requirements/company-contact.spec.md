# About Us and Contact Us Specification

## Problem Statement

The current About Us content is shorter than the approved company description and does not consistently express the requested management philosophy, product breadth, industry experience, and domestic/international project history. FAQ is a separate destination even though stakeholders want it to lead directly into contact information. Contact details also require final stakeholder confirmation.

## Solution

Rebuild About Us around the approved four-paragraph company description and supporting company evidence. Merge FAQ into Contact Us with FAQ first, followed by direct contact information. Preserve the old FAQ URL through a compatibility redirect, and track all unconfirmed contact fields as Pending Replacement.

## Functional Requirements

### About Us

- Display the complete approved four-paragraph Chinese company description.
- Provide machine-translated English and Russian versions for the first release.
- Present the management philosophy: technology, energy saving, quality, and service.
- Present supported product breadth without inventing final model data.
- Present key industries supported by approved company material.
- Present domestic and international experience without converting market coverage into unverified named cases.
- Retain or improve access to team, development history, certifications, and customer/industry evidence.
- Use approved GREENGAS company, team, factory, production, testing, and certificate images where available.

### FAQ

- Present the six supplied questions and answers before contact information.
- Preserve the provided answer structure, including numbered answers where supplied.
- Provide accessible expand/collapse behavior if an accordion is used.
- Supply Chinese, English, and Russian content.

### Contact Information

- Display approved contact channels grouped clearly by type.
- Support phone, landline, email, address, WeChat, WhatsApp, working hours, and after-sales contact when supplied and approved.
- Do not infer missing channels from competitor websites.
- Do not display an online message form; the stakeholder cancelled this functionality on 2026-07-31.
- Link the legacy FAQ destination to the FAQ section on this page.

## Content Rules

- The stakeholder-provided company description has priority over archive, legacy-site, and current-site wording.
- The stakeholder confirmed on 2026-07-27 that `ISO140001` was a typo; use `ISO14001` in current public Chinese, English, and Russian copy while leaving source archives unchanged.
- Certification display must use supplied GREENGAS evidence, not reference-site examples.
- Contact values are Verified Content only after stakeholder confirmation or match with a higher-priority approved source.

## Acceptance Criteria

- About Us includes the complete approved company description in Chinese and complete machine-translated English and Russian versions.
- The management philosophy and supported industries are visible and understandable.
- Domestic and international coverage claims remain faithful to the approved description.
- Contact Us displays all six supplied FAQ items before contact information.
- FAQ interaction is keyboard usable and exposes expanded state accessibly if collapsible.
- Contact channels use approved values and Pending Replacement is tracked for missing values.
- Contact Us contains no online message form or delivery claim.
- The legacy FAQ URL reaches the FAQ section.
- Pages remain usable at all representative widths and in all three languages.
- The production build passes.

## Dependencies

- The material inventory identifies approved company, certificate, and contact assets.
- Global route work supplies the Contact Us anchor and legacy redirect.

## Out of Scope

- Verifying the validity or current status of ISO certificates as part of this requirement set.
- Creating new certification claims.
- A server-side contact backend.
