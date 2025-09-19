# Manage Content

**Related Requirements:** [User Authentication](../Requirements/user-authentication.md), [Content Management](../Requirements/content-management.md)

## Use Cases

### UC-GU-009: View and Edit Uploads
- **As a** user
- **I want to** view my uploads, edit metadata (title, description, tags, date/location confidence), and delete/unpublish
- **So that** I can maintain control over my contributed content

### UC-GU-010: Remove Own Photos
- **As a** user
- **I want to** permanently remove photos that I have uploaded from the platform
- **So that** I can maintain full ownership and control over my content

### UC-GU-011: View Public Attribution
- **As a** user
- **I want to** see the public page for each photo with my attribution
- **So that** I can verify how my content appears to other users

## Acceptance Criteria
- Users can only edit/delete their own photos
- Deletion is permanent and irreversible
- Attribution is clearly displayed on public photo pages
- Metadata editing preserves photo location and date information

## Related Use Cases
- [Upload Photos](02-upload-photos.md)
- [Sharing and Discovery](04-sharing-discovery.md)
