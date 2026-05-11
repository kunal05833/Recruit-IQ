# ⚡ AI Recruitment Platform — Production-Grade Backend

A fully upgraded, **industry-level** Spring Boot backend for an AI-powered recruitment platform.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Spring Boot 3.2.5 |
| **Security** | Spring Security + JWT + Refresh Tokens |
| **ORM** | Spring Data JPA + Hibernate |
| **Database** | MySQL 8.0 |
| **AI/LLM** | Groq API (LLaMA 3) / OpenAI compatible |
| **Real-time** | WebSocket (STOMP + SockJS) |
| **Email** | Spring Mail + Gmail SMTP |
| **PDF Parsing** | Apache PDFBox 3.0 |
| **API Docs** | Swagger / OpenAPI 3 (Springdoc) |
| **Containerization** | Docker + Docker Compose |
| **Testing** | JUnit 5 + Mockito |

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Clone and configure
cp .env.example .env
# Edit .env with your values (DB password, JWT secret, Groq API key)

# 2. Start everything
docker-compose up --build

# App: http://localhost:8080
# Swagger: http://localhost:8080/swagger-ui.html
```

### Option 2: Local Development

```bash
# 1. Create MySQL database
mysql -u root -p -e "CREATE DATABASE ai_recruitment_db;"

# 2. Configure environment
cp .env.example .env
# Edit .env — set DB_PASSWORD, JWT_SECRET, OPENAI_API_KEY

# 3. Run
./mvnw spring-boot:run

# Or build JAR:
./mvnw clean package -DskipTests
java -jar target/ai-recruitment-platform-1.0.0.jar
```

---

## 🔑 Environment Variables

All sensitive config is driven by environment variables. See `.env.example` for the full list.

**Critical variables:**

| Variable | Description | Example |
|---|---|---|
| `DB_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/ai_recruitment_db` |
| `DB_PASSWORD` | MySQL password | `yourpassword` |
| `JWT_SECRET` | ≥64 character random string | `your-super-secret-64-char-key...` |
| `OPENAI_API_KEY` | Groq or OpenAI key | `gsk_...` |
| `OPENAI_API_URL` | AI API base URL | `https://api.groq.com/openai/v1` |

> ⚠️ **Never commit your `.env` file.** It's in `.gitignore`.

---

## 📡 API Overview

Swagger UI: **http://localhost:8080/swagger-ui.html**

### Auth Endpoints
```
POST   /api/auth/register        → Register CANDIDATE or RECRUITER
POST   /api/auth/login           → Login (returns accessToken + refreshToken)
POST   /api/auth/refresh         → Refresh access token
POST   /api/auth/logout          → Revoke refresh tokens
PUT    /api/auth/change-password → Change password
```

### Job Endpoints
```
GET    /api/jobs                  → List jobs (paginated, ?page=0&size=10)
GET    /api/jobs/search           → Search by keyword
GET    /api/jobs/filter           → Filter by location, jobType
GET    /api/jobs/{id}             → Get job by ID
POST   /api/jobs                  → [RECRUITER] Post new job
PUT    /api/jobs/{id}             → [RECRUITER] Update job
DELETE /api/jobs/{id}             → [RECRUITER] Deactivate job
GET    /api/jobs/my-postings      → [RECRUITER] My posted jobs
```

### Resume Endpoints
```
POST   /api/resume/upload         → [CANDIDATE] Upload + parse PDF resume
GET    /api/resume/download/{id}  → [RECRUITER] Download candidate resume
GET    /api/resume/view/{id}      → [RECRUITER] View inline
```

### Profile Endpoints
```
POST   /api/profile/confirm       → [CANDIDATE] Save profile after resume review
GET    /api/profile/me            → [CANDIDATE] Get my profile
```

### Application Endpoints
```
POST   /api/applications/apply           → [CANDIDATE] Apply for job
GET    /api/applications/my              → [CANDIDATE] My applications (paginated)
DELETE /api/applications/{id}/withdraw   → [CANDIDATE] Withdraw application
GET    /api/applications/job/{id}        → [RECRUITER] Applications for a job (paginated)
GET    /api/applications/job/{id}/shortlisted → [RECRUITER] Shortlisted candidates
GET    /api/applications/job/{id}/stats  → [RECRUITER] Application statistics
PUT    /api/applications/{id}/status     → [RECRUITER] Update status
PUT    /api/applications/{id}/shortlist  → [RECRUITER] Quick shortlist
```

### AI Matching
```
POST   /api/ai/match/{jobId}             → [CANDIDATE] Match with job
GET    /api/ai/match/job/{id}/ranking    → [RECRUITER] Ranked candidates
```

### AI Interview
```
POST   /api/ai/interview/generate/{jobId} → [CANDIDATE] Generate questions
GET    /api/ai/interview/questions/{jobId}→ [CANDIDATE] Get questions
POST   /api/ai/interview/answer           → [CANDIDATE] Submit + evaluate answer
```

### AI Analytics
```
GET    /api/ai/analytics/dashboard        → [CANDIDATE] My analytics dashboard
GET    /api/ai/analytics/job/{id}/ranking → [RECRUITER] Candidate performance ranking
```

### Notifications
```
GET    /api/notifications            → All notifications
GET    /api/notifications/recent     → Last 20 (for dropdown)
GET    /api/notifications/unread-count → Badge count
PUT    /api/notifications/{id}/read  → Mark one as read
PUT    /api/notifications/read-all   → Mark all as read
```

### WebSocket (Real-time)
```
WS: ws://localhost:8080/ws/notifications (STOMP over SockJS)
Subscribe to: /topic/notifications/{userId}         → New notifications
Subscribe to: /topic/notifications/{userId}/count   → Unread count updates
```

---

## 🔐 Authentication Flow

```
1. POST /api/auth/login
   Response: { accessToken, refreshToken, expiresIn: 86400000 }

2. Use accessToken in all requests:
   Authorization: Bearer <accessToken>

3. When accessToken expires (24h), refresh:
   POST /api/auth/refresh { refreshToken }
   → New accessToken + new refreshToken (rotation)

4. Logout:
   POST /api/auth/logout → refreshToken revoked server-side
```

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Controllers (REST)                     │
│  AuthController  JobController  ApplicationController   │
│  AI*Controllers  NotificationController                  │
├─────────────────────────────────────────────────────────┤
│                     Services                             │
│  AuthService  JobService  JobApplicationService         │
│  ResumeService  ProfileService  RefreshTokenService     │
│  AIInterviewService  JobMatchingService  AIAnalytics     │
│  NotificationService  EmailNotificationService          │
├─────────────────────────────────────────────────────────┤
│                   Repositories (JPA)                     │
│  UserRepo  JobRepo  ApplicationRepo  ProfileRepo        │
│  MatchScoreRepo  InterviewQ/ARepo  NotificationRepo     │
│  RefreshTokenRepo                                        │
├─────────────────────────────────────────────────────────┤
│                   Infrastructure                         │
│  MySQL  WebSocket (STOMP)  Email (SMTP)  Groq AI API    │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 Running Tests

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=AuthServiceTest
./mvnw test -Dtest=JobServiceTest
./mvnw test -Dtest=JobMatchingServiceTest

# Test with coverage report
./mvnw test jacoco:report
# Report: target/site/jacoco/index.html
```

---

## 🐳 Docker

```bash
# Build image
docker build -t ai-recruitment-platform:1.0.0 .

# Run with compose (includes MySQL)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down

# Stop and remove volumes (wipes DB)
docker-compose down -v
```

---

## 🔧 Key Improvements from Original

| Area | Original | Upgraded |
|---|---|---|
| **API Response** | Raw entity/map | `ApiResponse<T>` wrapper |
| **Pagination** | None | `PagedResponse<T>` with page/size/sort |
| **Exceptions** | All `RuntimeException` | Typed hierarchy (404/409/403/422/503) |
| **JWT** | No refresh token | Access + Refresh + Rotation |
| **Passwords** | BCrypt strength 10 (default) | BCrypt strength 12 |
| **Config** | Hardcoded secrets | `.env` + `application.yml` |
| **Swagger** | None | Full OpenAPI 3 with JWT auth |
| **Docker** | None | Dockerfile + docker-compose |
| **Tests** | None | 3 service test classes, 20+ tests |
| **Role security** | No `@PreAuthorize` | Strict per-endpoint role guards |
| **Job CRUD** | Create + read only | Full CRUD with soft delete |
| **Job search** | None | Search + filter + pagination |
| **AI feedback** | Score only | Strengths + improvements + score |
| **Logging** | Minimal | Structured SLF4J across all layers |
| **CORS** | Hardcoded origins | From environment variable |
| **SecurityUtil** | Duplicated in every controller | Single shared helper |

---

## 📌 Further Recommendations

1. **Redis Caching** — Cache job listings and match scores to reduce DB load
2. **Rate Limiting** — Add `bucket4j` or API Gateway rate limiting to auth endpoints
3. **Spring Profiles** — Separate `application-dev.yml`, `application-prod.yml`, `application-test.yml`
4. **Cloud Storage (S3)** — Replace local disk storage for resumes with AWS S3 or Cloudinary
5. **Flyway Migrations** — Replace `ddl-auto: update` with versioned SQL migrations
6. **Spring Actuator + Prometheus** — Full observability stack with Grafana dashboards
7. **Integration Tests** — Add `@SpringBootTest` integration tests with `Testcontainers` (MySQL)
8. **CI/CD Pipeline** — Add GitHub Actions workflow for build, test, and deploy
