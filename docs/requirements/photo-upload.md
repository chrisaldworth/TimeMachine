# Photo Upload

**Related Use Cases:** [Upload Photos with Metadata](../UseCases/GeneralUser/02-upload-photos.md#uc-gu-006), [EXIF Data Review](../UseCases/GeneralUser/02-upload-photos.md#uc-gu-008)

## Functional Requirements

### REQ-UPLOAD-001: File Upload
- Support for JPEG, PNG, TIFF formats
- Maximum file size: 25MB per photo
- Batch upload with progress indicators
- Drag and drop interface

### REQ-UPLOAD-002: Required Metadata
- Photo file (required)
- Location pin on map (required)
- 10-year period selection (required)
- Alt text for accessibility (required)

### REQ-UPLOAD-003: Optional Metadata
- Title and description
- Tags for categorization
- Date confidence level (exact/approximate/circa)
- Location confidence level (exact/approximate)

### REQ-UPLOAD-004: EXIF Processing
- Extract date and location from EXIF when available
- Present EXIF data for user confirmation
- Allow user to override EXIF suggestions
- Strip sensitive EXIF data on request

## Non-Functional Requirements
- Upload progress shown for batch operations
- Retry mechanism for failed uploads
- Image preprocessing for multiple sizes
- Virus/malware scanning

## Acceptance Criteria
- 10-photo batch upload completes in under 2 minutes
- EXIF data is clearly displayed for review
- Failed uploads can be retried individually
- Image variants generated automatically
