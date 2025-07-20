# DkNex API Documentation

## Overview

The DkNex API provides a comprehensive set of endpoints for managing forms, user authentication, analytics, and more. All endpoints return JSON responses and use standard HTTP status codes.

**Base URL**: `https://dknex.vercel.app/api`

## Authentication

Most endpoints require authentication via NextAuth.js. Include the session cookie in your requests.

### Authentication Flow

1. **Register**: `POST /api/auth/register`
2. **Sign In**: `POST /api/auth/signin`
3. **2FA Setup**: `POST /api/auth/2fa/setup`
4. **2FA Verify**: `POST /api/auth/2fa/verify`

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response** (400):
```json
{
  "error": "Validation failed",
  "validationErrors": {
    "email": ["Invalid email address"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

#### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Profile Management

#### Get Profile
```http
GET /api/profile
```

**Response** (200):
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://example.com/avatar.jpg",
    "twoFactorEnabled": false
  }
}
```

#### Update Profile
```http
PUT /api/profile
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### Form Management

#### Create Form
```http
POST /api/forms
Content-Type: application/json

{
  "title": "Customer Feedback Form",
  "description": "Help us improve our service",
  "fields": [
    {
      "id": "field_1",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "validation": {
        "minLength": 2,
        "maxLength": 50
      }
    }
  ],
  "settings": {
    "allowMultipleSubmissions": false,
    "requireAuthentication": true
  }
}
```

**Response** (201):
```json
{
  "success": true,
  "form": {
    "id": "form_id",
    "title": "Customer Feedback Form",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Forms
```http
GET /api/forms?page=1&limit=10&search=feedback
```

**Response** (200):
```json
{
  "forms": [
    {
      "id": "form_id",
      "title": "Customer Feedback Form",
      "description": "Help us improve our service",
      "submissionsCount": 25,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Get Form by ID
```http
GET /api/forms/{formId}
```

**Response** (200):
```json
{
  "form": {
    "id": "form_id",
    "title": "Customer Feedback Form",
    "description": "Help us improve our service",
    "fields": [...],
    "settings": {...},
    "analytics": {
      "totalSubmissions": 25,
      "completionRate": 0.85,
      "averageTime": 120
    }
  }
}
```

### Submissions

#### Submit Form
```http
POST /api/forms/{formId}/submit
Content-Type: application/json

{
  "responses": {
    "field_1": "John Doe",
    "field_2": "Great service!",
    "field_3": "5"
  },
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.1",
    "submittedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Response** (201):
```json
{
  "success": true,
  "submissionId": "submission_id",
  "message": "Form submitted successfully"
}
```

#### Get Submissions
```http
GET /api/forms/{formId}/submissions?page=1&limit=20
```

**Response** (200):
```json
{
  "submissions": [
    {
      "id": "submission_id",
      "responses": {...},
      "metadata": {...},
      "submittedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2
  }
}
```

### Analytics

#### Get Form Analytics
```http
GET /api/analytics/forms/{formId}
```

**Response** (200):
```json
{
  "analytics": {
    "overview": {
      "totalSubmissions": 1250,
      "completionRate": 0.87,
      "averageTime": 145,
      "uniqueVisitors": 890
    },
    "trends": {
      "daily": [...],
      "weekly": [...],
      "monthly": [...]
    },
    "fieldAnalytics": [
      {
        "fieldId": "field_1",
        "completionRate": 0.95,
        "averageTime": 12,
        "errorRate": 0.02
      }
    ]
  }
}
```

#### Export Data
```http
GET /api/analytics/export/{formId}?format=csv&dateFrom=2024-01-01&dateTo=2024-01-31
```

**Response** (200):
```
Content-Type: text/csv
Content-Disposition: attachment; filename="form_submissions.csv"

Name,Email,Rating,Feedback,Submitted At
John Doe,john@example.com,5,Great service!,2024-01-01T10:30:00Z
...
```

### Notifications

#### Get Notifications
```http
GET /api/notifications?page=1&limit=20&unreadOnly=false
```

**Response** (200):
```json
{
  "notifications": [
    {
      "id": "notification_id",
      "title": "New Form Submission",
      "message": "You received a new submission for 'Customer Feedback Form'",
      "type": "submission",
      "read": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

#### Mark Notification as Read
```http
PATCH /api/notifications/{notificationId}/read
```

**Response** (200):
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### File Upload

#### Upload File
```http
POST /api/upload
Content-Type: multipart/form-data

file: [binary file data]
```

**Response** (200):
```json
{
  "success": true,
  "url": "https://storage.example.com/files/uploaded_file.jpg",
  "filename": "uploaded_file.jpg",
  "size": 1024000
}
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message",
  "details": "Additional error details",
  "code": "ERROR_CODE"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Validation Errors

When validation fails, the response includes detailed field-specific errors:

```json
{
  "error": "Validation failed",
  "validationErrors": {
    "email": ["Invalid email format"],
    "password": [
      "Password must be at least 8 characters",
      "Password must contain at least one uppercase letter"
    ]
  }
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **Form submission**: 10 requests per minute
- **General API**: 100 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Security

### CORS
The API supports CORS for cross-origin requests from authorized domains.

### Content Security Policy
All responses include strict CSP headers to prevent XSS attacks.

### Input Sanitization
All user inputs are sanitized and validated to prevent injection attacks.

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @dknex/api-client
```

```typescript
import { DkNexClient } from '@dknex/api-client';

const client = new DkNexClient({
  baseUrl: 'https://dknex.vercel.app/api',
  apiKey: 'your-api-key'
});

// Create a form
const form = await client.forms.create({
  title: 'My Form',
  fields: [...]
});
```

### Python
```bash
pip install dknex-python
```

```python
from dknex import DkNexClient

client = DkNexClient(api_key='your-api-key')

# Get forms
forms = client.forms.list()
```

## Webhooks

Configure webhooks to receive real-time notifications:

```http
POST /api/webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["form.submitted", "form.updated"],
  "secret": "webhook_secret"
}
```

### Webhook Events

- `form.created` - New form created
- `form.updated` - Form updated
- `form.deleted` - Form deleted
- `submission.received` - New form submission
- `user.registered` - New user registration

### Webhook Payload Example
```json
{
  "event": "submission.received",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "formId": "form_id",
    "submissionId": "submission_id",
    "responses": {...}
  }
}
```

## Support

For API support and questions:
- **Documentation**: [https://docs.dknex.com](https://docs.dknex.com)
- **Email**: api-support@dknex.com
- **Discord**: [https://discord.gg/dknex](https://discord.gg/dknex) 