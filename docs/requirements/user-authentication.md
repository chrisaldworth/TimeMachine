# User Authentication

**Related Use Cases:** [User Registration and Login](../UseCases/GeneralUser/02-upload-photos.md#uc-gu-005), [Admin Portal Access](../UseCases/Admin/01-admin-portal-access.md#uc-ad-001)

## Functional Requirements

### REQ-AUTH-001: User Registration
- Users must be able to register with email and password
- Social login via Google and Facebook must be supported
- Email verification is required before first upload
- Password must meet minimum security requirements

### REQ-AUTH-002: User Login
- Users can log in with email/password or social credentials
- Session management with secure tokens
- Optional "Remember Me" functionality
- Account lockout after failed login attempts

### REQ-AUTH-003: Anonymous Access
- Anonymous users can browse and view photos
- Anonymous users cannot upload content
- No personal data collection for anonymous users

## Non-Functional Requirements
- Authentication must be HTTPS-only
- Session tokens must expire after inactivity
- Multi-factor authentication available for admin accounts
- Password reset via secure email links

## Acceptance Criteria
- Registration completes in under 30 seconds
- Login succeeds within 2 seconds
- Email verification links expire after 24 hours
- Failed login attempts are rate-limited
