# Contact Information Gaps

- **Date:** 2026-07-26
- **Related issue:** GitHub #5
- **Status:** Pending Replacement

The Contact Us page currently displays only the locale-specific channels introduced from the stakeholder requirements in commit `e2cb983`: Chinese email and mobile phone, plus English/Russian email and WhatsApp.

The following fields remain unconfirmed and must not be published until the stakeholder supplies or approves their values:

- Company street address
- Landline
- WeChat account or QR code
- Working hours and time zone
- Dedicated after-sales phone or email
- Whether the existing channels should be available in additional locales

EmailJS service, template, and public client configuration are tracked separately by GitHub #17. Until that integration is configured, the message form remains visible but cannot send.
