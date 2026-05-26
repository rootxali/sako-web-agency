# SAKO Agency - Error Handling & Monitoring System

This comprehensive error handling system provides robust error monitoring, logging, and notification capabilities for the SAKO Agency website.

## 🏗️ Architecture

### Frontend (Next.js)
- **Error Boundary**: React error boundaries to catch component errors
- **Global Error Handler**: Catches unhandled errors and promise rejections
- **Error Logger**: Utility to send errors to the Python backend
- **API Error Logging**: Automatic error logging in API routes

### Backend (Python Flask)
- **Error Monitor Service**: Flask application for error logging and management
- **Database**: SQLite with efficient indexing for error storage
- **Email Notifications**: SMTP-based alerts for critical errors
- **REST API**: Full CRUD operations for error management

## 🚀 Quick Start

### 1. Start the Error Monitoring Backend

```bash
# Option 1: Use the startup script
python run_backend.py

# Option 2: Manual setup
cd backend
pip install -r requirements.txt
python error_monitor.py
```

The backend will start on `http://localhost:5000`.

### 2. Start the Next.js Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`.

### 3. Test Error Logging

Visit your website and check the backend logs at `http://localhost:5000/api/errors/stats`.

## 📊 Features

### Frontend Error Handling
- ✅ React Error Boundaries with user-friendly fallbacks
- ✅ Global error handlers for unhandled errors
- ✅ Automatic error logging to backend
- ✅ Component-level error isolation
- ✅ Browser information collection

### Backend Error Monitoring
- ✅ RESTful API for error management
- ✅ SQLite database with optimized queries
- ✅ Email notifications for critical errors
- ✅ Error statistics and analytics
- ✅ CORS support for frontend integration

### API Endpoints

#### Log Errors
```http
POST /api/errors
Content-Type: application/json

{
  "level": "ERROR",
  "message": "Something went wrong",
  "stackTrace": "Error stack trace...",
  "url": "https://sakooo.netlify.app/page",
  "userAgent": "Browser info",
  "additionalData": {"custom": "data"}
}
```

#### Get Errors
```http
GET /api/errors?limit=100&offset=0&resolved=false
```

#### Resolve Error
```http
POST /api/errors/{id}/resolve
Content-Type: application/json

{
  "resolved_by": "admin-user"
}
```

#### Get Statistics
```http
GET /api/errors/stats
```

#### Health Check
```http
GET /health
```

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Server
PORT=5000
DEBUG=False

# Email Notifications (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
RECIPIENT_EMAILS=admin@sako.agency,dev@sako.agency

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://sakooo.netlify.app
```

### Frontend Environment Variables

Update `.env`:

```env
NEXT_PUBLIC_ERROR_API_URL=http://localhost:5000/api/errors
```

## 🚀 Deployment

### Backend Deployment Options

#### Railway
1. Connect your GitHub repo
2. Set environment variables
3. Deploy automatically

#### Heroku
```bash
git push heroku main
```

#### Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "error_monitor.py"]
```

### Frontend Deployment

The error handling is already integrated into your Next.js app. Just deploy as usual:

```bash
npm run build
npm run export  # for static export
```

Update the `NEXT_PUBLIC_ERROR_API_URL` environment variable in your deployment platform to point to your backend URL.

## 📈 Monitoring & Analytics

### Error Dashboard
Access error statistics at `/api/errors/stats`:

```json
{
  "success": true,
  "stats": {
    "total_errors": 150,
    "unresolved_errors": 12,
    "recent_errors": 5,
    "errors_by_level": {
      "ERROR": 89,
      "WARNING": 45,
      "CRITICAL": 16
    }
  }
}
```

### Log Analysis
View recent errors at `/api/errors?limit=50&resolved=false`

## 🛠️ Development

### Adding Error Logging to Components

```tsx
import { logError, useErrorHandler } from '@/lib/errorLogger';

function MyComponent() {
  const handleError = useErrorHandler();

  const riskyOperation = async () => {
    try {
      // Some operation that might fail
      await fetch('/api/something');
    } catch (error) {
      handleError(error, {
        component: 'MyComponent',
        action: 'riskyOperation'
      });
    }
  };

  return <div>...</div>;
}
```

### Custom Error Boundaries

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

function MyPage() {
  return (
    <ErrorBoundary componentName="MyPage">
      <MyComplexComponent />
    </ErrorBoundary>
  );
}
```

## 🔒 Security Considerations

- Error logs may contain sensitive information
- Implement proper access controls for the backend API
- Use HTTPS in production
- Sanitize error data before storage
- Regular log rotation and cleanup

## 📝 Error Types

- **CRITICAL**: System-breaking errors, immediate attention required
- **ERROR**: Functional errors that affect user experience
- **WARNING**: Non-critical issues that should be monitored
- **INFO**: Informational messages for debugging

## 🐛 Troubleshooting

### Backend Won't Start
- Check Python version (3.8+ required)
- Verify all dependencies are installed
- Check port 5000 is available
- Review `.env` configuration

### Errors Not Logging
- Verify `NEXT_PUBLIC_ERROR_API_URL` is set correctly
- Check CORS configuration in backend
- Ensure backend is running and accessible
- Check browser network tab for failed requests

### Email Notifications Not Working
- Verify SMTP credentials in `.env`
- Check Gmail app passwords for Gmail accounts
- Review spam folder
- Check SMTP server settings

## 🤝 Contributing

1. Test error scenarios thoroughly
2. Add appropriate error logging to new features
3. Update documentation for configuration changes
4. Follow existing code patterns and error handling conventions

## 📞 Support

For issues with the error monitoring system:
1. Check the backend logs: `tail -f backend/error_monitor.log`
2. Verify API connectivity: `curl http://localhost:5000/health`
3. Review error statistics: `curl http://localhost:5000/api/errors/stats`

---

**Made with ❤️ for SAKO Agency**