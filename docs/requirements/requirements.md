⸻

📄 Requirements Overview

Version: 1.0 (draft)
Date: 19 September 2025
Prepared by: Chris Aldworth

⸻

1. Product Direction Alignment
- Support all devices and modern browsers. Minimum: evergreen browsers (Chrome, Safari, Firefox, Edge) + recent iOS/Android WebView. Legacy support policy TBD.
- Uploads require an authenticated account. Anonymous browsing allowed; guest uploads not permitted.
- Licenses: TBD. Decision to be finalized; UI to collect license once policy set.
- Offline/PWA: Not supported initially.

⸻

2. Functional Requirements
- Authentication & Accounts
  - Email/password and social login (Google, Facebook) acceptable. MFA optional (future).
  - Email verification required before first upload.
  - Role-based access: General User, Admin.

- Uploads & Metadata
  - Single and batch upload with progress and retry.
  - Required fields: photo, location pin, capture date (year; month optional), alt text.
  - Confidence fields for date and location (exact/approximate/circa).
  - EXIF-assisted auto-fill when present; user confirmation required.

- Exploration
  - Map with clustering, time slider, search (place/title/description/year), filters (decade, tags, license TBD).
  - Photo detail with metadata and map links.

- Sharing
  - Shareable links preserving filters and map state.

⸻

3. Admin Capabilities
- Admin portal with full control over users, uploads, and content.
- User management: view, search, edit roles, deactivate/reactivate, password reset links.
- Content moderation: review queue, takedown/restore, audit trail, reports triage.
- Upload management: curate, edit metadata, bulk actions.
- Access control: manage admin users, enforce permissions.

⸻

4. Non-Functional Requirements
- Performance: Map/timeline initial load < 2s (10k pins); interactions < 500ms P95.
- Security: HTTPS, JWT/OAuth2, rate limiting, file validation, malware scanning.
- Accessibility: WCAG 2.1 AA; keyboard navigation for map/time slider; alt text required.
- Compliance: GDPR; data export/delete; DMCA process. COPPA: no under-13 accounts.
- Scalability: 100k+ images target; CDN-backed assets; server-side clustering.

⸻

5. Open Decisions
- License framework (e.g., All rights reserved, CC options) and display rules.
- Minimum browser versions and any graceful degradation.
- Extent of CSV/bulk import in MVP vs. phase 2.

⸻
