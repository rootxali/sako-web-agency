# SAKO Error Monitoring Backend

A Python Flask-based error logging and monitoring service for the SAKO Agency website.

## Features

- **Error Logging**: Capture and store frontend errors with detailed information
- **Database Storage**: SQLite database with efficient indexing
- **Email Notifications**: Automatic email alerts for critical errors
- **REST API**: Full REST API for error management
- **Statistics**: Error analytics and reporting
- **CORS Support**: Cross-origin requests from frontend

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   - Copy `.env` and update the values:
     - Email settings for notifications (optional)
     - Server port and debug mode
     - CORS allowed origins

3. **Run the Server**
   ```bash
   python error_monitor.py
   ```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### POST /api/errors
Log a new error from the frontend.

**Request Body:**
```json
{
  "level": "ERROR",
  "message": "Something went wrong",
  "stackTrace": "Error stack trace...",
  "userAgent": "Browser info",
  "url": "https://sakooo.netlify.app/page",
  "userId": "optional-user-id",
  "ipAddress": "192.168.1.1",
  "browserInfo": {"name": "Chrome", "version": "91.0"},
  "additionalData": {"custom": "data"}
}
```

### GET /api/errors
Retrieve error logs with optional filtering.

**Query Parameters:**
- `limit`: Number of errors to return (default: 100)
- `offset`: Pagination offset (default: 0)
- `resolved`: Filter by resolved status (true/false)

### POST /api/errors/{id}/resolve
Mark an error as resolved.

**Request Body:**
```json
{
  "resolved_by": "admin-user"
}
```

### GET /api/errors/stats
Get error statistics and analytics.

### GET /health
Health check endpoint.

## Deployment

### Local Development
```bash
python error_monitor.py
```

### Production Deployment
Consider using:
- **Railway**: `railway deploy`
- **Heroku**: `git push heroku main`
- **Docker**: Build and run the included Dockerfile
- **VPS**: Use Gunicorn or uWSGI

### Environment Variables
Set these in your deployment platform:

```
PORT=5000
DEBUG=False
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
RECIPIENT_EMAILS=admin@sako.agency
ALLOWED_ORIGINS=https://sakooo.netlify.app
```

## Database

The service uses SQLite for data storage. The database file `error_logs.db` will be created automatically.

**Tables:**
- `error_logs`: Main error log table with all error information

**Indexes:**
- `idx_timestamp`: For time-based queries
- `idx_level`: For filtering by error level
- `idx_resolved`: For filtering resolved/unresolved errors

## Email Notifications

Configure SMTP settings in the `.env` file to enable email notifications for critical errors. The service will send alerts when errors with level "CRITICAL" or "ERROR" are logged.

## Frontend Integration

Add error logging to your Next.js application:

```typescript
// lib/errorLogger.ts
const ERROR_API_URL = process.env.NEXT_PUBLIC_ERROR_API_URL || 'http://localhost:5000/api/errors';

export const logError = async (error: Error, context?: any) => {
  try {
    await fetch(ERROR_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: 'ERROR',
        message: error.message,
        stackTrace: error.stackTrace,
        url: window.location.href,
        userAgent: navigator.userAgent,
        additionalData: context
      })
    });
  } catch (e) {
    console.error('Failed to log error:', e);
  }
};
```

## Monitoring

Check the `/health` endpoint for service status and the `/api/errors/stats` endpoint for error analytics.