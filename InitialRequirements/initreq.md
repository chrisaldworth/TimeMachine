⸻

📄 Product Specification Document

Product Name: Rewind the Map
Version: 1.0
Date: 3 August 2025
Prepared by: Chris Aldworth

⸻

1. 🎯 Product Overview

Rewind the Map is a web-based platform that enables users to upload historical photos of locations around the world, tag them to specific places on a map, and explore changes over time. Through an interactive time slider and spatial interface, users can “rewind” locations to see what they looked like in the past — creating a shared, user-generated archive of global history.

⸻

2. 🧑‍💻 Target Users
	•	Amateur historians and archivists
	•	Photographers and collectors of vintage photos
	•	Schools, museums, and educational institutions
	•	Tourists and nostalgia-seekers
	•	Local history enthusiasts

⸻

3. 🔑 Key Features

3.1. User Accounts & Authentication
	•	Email + password registration
	•	Social login via Google and Facebook
	•	Optional anonymous browsing (read-only)

3.2. Photo Upload and Metadata
	•	Users can upload one or more photos at a time
	•	Required fields:
	•	Photo file
	•	Approximate location (pin on map)
	•	Approximate date (year, optionally month)
	•	Optional:
	•	Title
	•	Description
	•	Tags (e.g., “railway”, “street”, “school”)
	•	Images are previewed before submission
	•	Geo-tag extraction (from EXIF data) if available

3.3. Interactive World Map
	•	Zoomable, pannable map of the world
	•	Markers represent uploaded photos
	•	Cluster markers to improve performance
	•	Clicking a marker opens a photo detail view

3.4. Time Rewind Function
	•	Interactive time slider (e.g., 1850–present)
	•	Dragging slider filters visible photos by capture date
	•	“Play” function to animate rewind/forward of the map
	•	Display timeline counts per decade or year

3.5. Search & Filters
	•	Search by:
	•	Place name
	•	Photo title or description
	•	Year or decade
	•	Filters:
	•	Time range
	•	Tags (if implemented)
	•	Photo age (e.g., “pre-1950”, “1950–2000”)

3.6. Photo Detail Page
	•	Large view of the image
	•	Metadata: date, location, uploader name (optional), description
	•	“View on map” and “View in timeline” buttons
	•	Optional: similar photos nearby / from same decade

3.7. Community Features (Phase 2)
	•	Comment on photos
	•	Like / favorite photos
	•	Report inappropriate content
	•	Follow other users or subscribe to places

⸻

4. 🧱 Non-Functional Requirements

Category	Requirement
Performance	Map and timeline must load in under 2 seconds with up to 10,000 photo pins.
Scalability	Architecture should support growth to 100,000+ images.
Security	HTTPS, image scanning, user moderation, secure login (OAuth2/JWT).
Usability	Simple and intuitive UI; responsive for mobile and tablet use.
Accessibility	WCAG 2.1 AA compliant: alt text, keyboard navigation, etc.
Legal Compliance	GDPR, copyright declarations, moderation dashboard for admin.


⸻

5. 🧰 Tech Stack (Proposed)

Layer	Technology
Frontend	React.js or Vue.js
Map Engine	Mapbox GL JS or Leaflet.js
Backend	Node.js (Express) or Django
Database	PostgreSQL with PostGIS
Storage	AWS S3 for image hosting
Auth	Firebase Auth or Auth0
Hosting	Vercel, Netlify, or AWS EC2


⸻

6. 🛠 MVP Scope (Minimum Viable Product)
	•	Map interface with pins
	•	Time slider with date filtering
	•	User upload (photo, location, year)
	•	Search by place and year
	•	User registration/login
	•	View photos and basic metadata

⸻

7. 🧪 Future Enhancements (Not in MVP)
	•	Then/Now comparison slider
	•	User profiles & collections
	•	AI image enhancement (denoising, colorization)
	•	Bulk upload with CSV
	•	Educational partner tools (e.g., class timelines)