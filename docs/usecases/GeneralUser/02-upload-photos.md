# Upload Photos

**Related Requirements:** [User Authentication](../Requirements/user-authentication.md), [Photo Upload](../Requirements/photo-upload.md), [Map Interface](../Requirements/map-interface.md)

## Use Cases

### UC-GU-005: User Registration and Login
- **As a** new user
- **I want to** register, verify email, and log in
- **So that** I can access upload functionality and manage my content

### UC-GU-006: Upload Photos with Metadata
- **As a** logged-in user
- **I want to** upload single or multiple photos, place a map pin, specify which 10-year period the photo was taken (e.g., 1920-1929, 1950-1959), provide alt text, and publish
- **So that** I can contribute historical photos to the community archive

### UC-GU-007: Drag and Drop Photo Placement
- **As an** uploader
- **I want to** drag and drop a photo directly onto the map at the location where it was taken to automatically set the location pin
- **So that** I can quickly and accurately place photos on the map

### UC-GU-008: EXIF Data Review
- **As an** uploader
- **I want to** review EXIF-suggested date/location and confirm or override it
- **So that** I can ensure accurate metadata for my photos

## Acceptance Criteria
- Email verification required before first upload
- 10-year period selection is mandatory (e.g., 1920-1929, 1950-1959)
- Drag and drop functionality works on all supported browsers
- EXIF data is clearly displayed for user confirmation
- Upload progress is shown for batch operations

## Related Use Cases
- [Browse and Explore](01-browse-explore.md)
- [Manage Content](03-manage-content.md)
