# Browse and Explore

**Related Requirements:** [Map Interface](../Requirements/map-interface.md), [Time Slider](../Requirements/time-slider.md), [Search Functionality](../Requirements/search-functionality.md)

## Use Cases

### UC-GU-001: View World Map with Satellite Imagery
- **As a** visitor
- **I want to** view a world map with satellite imagery, zoom in and out, and see pins representing uploaded photos
- **So that** I can explore the global collection of historical photos spatially

### UC-GU-002: Interactive Photo Pin Selection
- **As a** visitor  
- **I want to** click on a photo pin to view the image and then use a time rewind feature to see how that location looked in the past
- **So that** I can experience the historical transformation of specific locations

### UC-GU-003: Time-based Photo Filtering
- **As a** visitor
- **I want to** use the time slider to filter photos by decade or year across the entire map
- **So that** I can focus on specific historical periods

### UC-GU-004: Search and Discovery
- **As a** visitor
- **I want to** search by place name, title, or description, and open photo details
- **So that** I can find specific historical content or locations

## Acceptance Criteria
- Map loads with satellite imagery in under 2 seconds
- Photo pins are clustered appropriately based on zoom level
- Time rewind animation plays smoothly at 30+ FPS
- Search results return relevant matches within 500ms

## Related Use Cases
- [Upload Photos](02-upload-photos.md)
- [Manage Content](03-manage-content.md)
