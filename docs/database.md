# OceanShield Database Design

## Users

Stores all registered users.

Fields

- id
- full_name
- email
- password_hash
- phone
- role
- created_at

Roles

- Citizen
- Volunteer
- Collector
- Admin

---

## Reports

Stores hazard reports submitted by citizens.

Fields

- id
- user_id
- title
- description
- hazard_type
- latitude
- longitude
- status
- severity
- confidence
- created_at

---

## Media

Stores uploaded images and videos.

Fields

- id
- report_id
- media_type
- media_url
- thumbnail_url

---

## AI Results

Stores AI analysis.

Fields

- id
- report_id
- detected_hazard
- confidence
- severity
- ai_summary
- detected_objects

---

## Public Intelligence

Stores government alerts, RSS feeds and public intelligence.

Fields

- id
- source
- title
- description
- latitude
- longitude
- confidence
- url
- published_at

---

## Alerts

Stores emergency alerts.

Fields

- id
- title
- description
- severity
- district
- created_at

---

## Volunteers

Stores volunteer assignments.

Fields

- id
- volunteer_id
- report_id
- status
- assigned_at

---

## Predictions

Stores AI prediction results.

Fields

- id
- district
- hazard
- probability
- generated_at