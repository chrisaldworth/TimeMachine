# User Account Management

**Related Requirements:** [User Management](../Requirements/user-management.md), [Audit Logging](../Requirements/audit-logging.md)

## Use Cases

### UC-AD-003: View and Search User Accounts
- **As an** admin
- **I want to** view, search, and filter all user accounts
- **So that** I can monitor user activity and manage accounts effectively

### UC-AD-004: Edit User Details
- **As an** admin
- **I want to** edit user details, reset passwords (via email link), deactivate/reactivate accounts
- **So that** I can provide user support and manage account issues

### UC-AD-005: View User Activity
- **As an** admin
- **I want to** view user activity (uploads, reports) with an audit trail
- **So that** I can understand user behavior and investigate issues

## Acceptance Criteria
- User search returns results within 500ms
- Password reset emails are sent immediately
- Account deactivation removes access within 5 minutes
- All admin actions on user accounts are logged with timestamps

## Related Use Cases
- [Admin Portal Access](01-admin-portal-access.md)
- [Content Moderation](03-content-moderation.md)
