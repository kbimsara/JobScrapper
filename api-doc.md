# Job Finder API Documentation

This document outlines the available REST API endpoints exposed by the `job-search-service` backend. It is intended to serve as a reference for developing client applications (e.g., an Android app) and provides details on how to interact with the system.

## Base URL
All API requests should be prefixed with the base URL of the service (e.g., `http://localhost:4000`).
Most routes are under the `/api/v1/` prefix.

## Authentication
Most endpoints require an `Authorization` header with a Bearer token matching the `SERVICE_API_KEY` configured on the backend.
```http
Authorization: Bearer <SERVICE_API_KEY>
```

---

## Health Check

### `GET /api/health`
- **Description:** Checks if the API is running and healthy. This route does not require authentication.
- **Response:** `{ "status": "ok" }`

---

## Job Roles (`/api/v1/job-roles`)
Manages the roles/keywords the system searches for when scraping jobs.

### `GET /api/v1/job-roles`
- **Description:** Retrieves a list of all configured job roles, sorted by creation date.
- **Usage:** Use this to display the list of active job searches.

### `GET /api/v1/job-roles/:id`
- **Description:** Retrieves details for a specific job role by its ID.

### `POST /api/v1/job-roles`
- **Description:** Creates a new job role.
- **Body:**
  ```json
  {
    "name": "Software Engineer",
    "keywords": ["react", "node"],
    "locations": ["Remote", "New York"],
    "enabled": true
  }
  ```
- **Usage:** Used to add a new role for the scraper to target.

### `PUT /api/v1/job-roles/:id`
- **Description:** Updates an existing job role.
- **Body:** Any of the fields from the POST request.

### `DELETE /api/v1/job-roles/:id`
- **Description:** Deletes a specific job role.

---

## Jobs (`/api/v1/jobs`)
Manages the scraped job listings.

### `GET /api/v1/jobs`
- **Description:** Retrieves a paginated list of job posts with optional filtering and sorting.
- **Query Parameters:**
  - `page` (number): Page number (default: 1).
  - `limit` (number): Number of items per page (default: 20, max: 50).
  - `q` (string): Search query to filter by title or company name.
  - `type` (string): Filter by employment type (e.g., Full-time, Contract).
  - `startDate` (string/date): Filter jobs posted on or after this date.
  - `endDate` (string/date): Filter jobs posted on or before this date.
  - `sort` (string): Sort order for `postedAt` (`asc` or `desc`).
- **Usage:** Used to display job feeds in the mobile app, with support for searching, filtering, and pagination.

### `DELETE /api/v1/jobs`
- **Description:** Clears/deletes all job posts from the database.

---

## Settings (`/api/v1/settings`)
Manages system configurations such as scraper intervals and notification settings.

### `GET /api/v1/settings/scraper`
- **Description:** Retrieves the current settings for the background scraper worker (e.g., sync interval, status).

### `PUT /api/v1/settings/scraper`
- **Description:** Updates the scraper settings.
- **Body:** `{ "syncIntervalMinutes": 60 }`

### `POST /api/v1/settings/scraper/run`
- **Description:** Manually triggers a background sync/scraper run.
- **Usage:** Can be used to provide a "Sync Now" button in the app.

### `GET /api/v1/settings/notifications`
- **Description:** Retrieves settings for configured notification channels (e.g., Telegram, Email).

### `PUT /api/v1/settings/notifications`
- **Description:** Updates configuration for a specific notification channel.
- **Body:**
  ```json
  {
    "channel": "telegram",
    "enabled": true,
    "config": { ... }
  }
  ```

---

## Blocked Companies (`/api/v1/settings/blocked-companies`)
Manages companies to ignore during scraping.

### `GET /api/v1/settings/blocked-companies`
- **Description:** Retrieves a list of all blocked companies.

### `POST /api/v1/settings/blocked-companies`
- **Description:** Blocks a new company.
- **Body:** `{ "name": "Company Name", "reason": "Spammy listings" }`

### `DELETE /api/v1/settings/blocked-companies/:id`
- **Description:** Removes a company from the blocked list by ID.

---

## Notifications (`/api/v1/notifications`)
Manages notification delivery logs.

### `GET /api/v1/notifications`
- **Description:** Retrieves a paginated history of notification deliveries (sent alerts).
- **Query Parameters:** `page`, `limit`.

### `DELETE /api/v1/notifications`
- **Description:** Clears all notification delivery logs.

---

## Dashboard (`/api/v1/dashboard`)

### `GET /api/v1/dashboard`
- **Description:** Aggregates statistics and recent activity for the main dashboard view.
- **Response Data:**
  - `stats`: Counts for active job roles, total jobs received, notifications sent, and failed notifications.
  - `scraperHealth`: Current status and last sync time of the scraper.
  - `recentJobs`: List of the 5 most recently scraped jobs.
  - `recentNotifications`: List of the 5 most recent notification attempts.
- **Usage:** Ideal for a home/overview screen in the Android app to show a summary of the system's status.
