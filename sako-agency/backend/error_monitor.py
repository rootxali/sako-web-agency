#!/usr/bin/env python3
"""
SAKO Agency Error Monitoring Backend
A Python-based error logging and monitoring service
"""

import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from pathlib import Path
from dataclasses import dataclass, asdict
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from contextlib import contextmanager
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@dataclass
class ErrorLog:
    """Error log data structure"""
    id: Optional[int] = None
    timestamp: str = ""
    level: str = "ERROR"
    message: str = ""
    stack_trace: str = ""
    user_agent: str = ""
    url: str = ""
    user_id: Optional[str] = None
    ip_address: str = ""
    browser_info: Dict[str, Any] = None
    additional_data: Dict[str, Any] = None
    resolved: bool = False
    resolved_at: Optional[str] = None
    resolved_by: Optional[str] = None

class DatabaseManager:
    """SQLite database manager for error logs"""

    def __init__(self, db_path: str = "error_logs.db"):
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        """Initialize database tables"""
        with self.get_connection() as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS error_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    level TEXT NOT NULL,
                    message TEXT NOT NULL,
                    stack_trace TEXT,
                    user_agent TEXT,
                    url TEXT,
                    user_id TEXT,
                    ip_address TEXT,
                    browser_info TEXT,
                    additional_data TEXT,
                    resolved BOOLEAN DEFAULT FALSE,
                    resolved_at TEXT,
                    resolved_by TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            ''')

            # Create indexes for better performance
            conn.execute('CREATE INDEX IF NOT EXISTS idx_timestamp ON error_logs(timestamp)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_level ON error_logs(level)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_resolved ON error_logs(resolved)')
            conn.commit()

    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()

    def save_error(self, error: ErrorLog) -> int:
        """Save error log to database"""
        with self.get_connection() as conn:
            cursor = conn.execute('''
                INSERT INTO error_logs
                (timestamp, level, message, stack_trace, user_agent, url,
                 user_id, ip_address, browser_info, additional_data,
                 resolved, resolved_at, resolved_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                error.timestamp,
                error.level,
                error.message,
                error.stack_trace,
                error.user_agent,
                error.url,
                error.user_id,
                error.ip_address,
                json.dumps(error.browser_info) if error.browser_info else None,
                json.dumps(error.additional_data) if error.additional_data else None,
                error.resolved,
                error.resolved_at,
                error.resolved_by
            ))
            conn.commit()
            return cursor.lastrowid

    def get_errors(self, limit: int = 100, offset: int = 0,
                   resolved: Optional[bool] = None) -> List[Dict]:
        """Get error logs with optional filtering"""
        with self.get_connection() as conn:
            query = "SELECT * FROM error_logs WHERE 1=1"
            params = []

            if resolved is not None:
                query += " AND resolved = ?"
                params.append(resolved)

            query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?"
            params.extend([limit, offset])

            cursor = conn.execute(query, params)
            rows = cursor.fetchall()

            return [dict(row) for row in rows]

    def resolve_error(self, error_id: int, resolved_by: str) -> bool:
        """Mark an error as resolved"""
        with self.get_connection() as conn:
            cursor = conn.execute('''
                UPDATE error_logs
                SET resolved = TRUE, resolved_at = ?, resolved_by = ?
                WHERE id = ?
            ''', (datetime.now().isoformat(), resolved_by, error_id))
            conn.commit()
            return cursor.rowcount > 0

    def get_error_stats(self) -> Dict[str, Any]:
        """Get error statistics"""
        with self.get_connection() as conn:
            # Total errors
            total = conn.execute("SELECT COUNT(*) FROM error_logs").fetchone()[0]

            # Unresolved errors
            unresolved = conn.execute(
                "SELECT COUNT(*) FROM error_logs WHERE resolved = FALSE"
            ).fetchone()[0]

            # Errors by level
            levels = conn.execute("""
                SELECT level, COUNT(*) as count
                FROM error_logs
                GROUP BY level
                ORDER BY count DESC
            """).fetchall()

            # Recent errors (last 24 hours)
            yesterday = (datetime.now() - timedelta(days=1)).isoformat()
            recent = conn.execute(
                "SELECT COUNT(*) FROM error_logs WHERE timestamp > ?",
                (yesterday,)
            ).fetchone()[0]

            return {
                "total_errors": total,
                "unresolved_errors": unresolved,
                "recent_errors": recent,
                "errors_by_level": dict(levels)
            }

class EmailNotifier:
    """Email notification system for critical errors"""

    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.sender_email = os.getenv("SENDER_EMAIL")
        self.sender_password = os.getenv("SENDER_PASSWORD")
        self.recipient_emails = os.getenv("RECIPIENT_EMAILS", "").split(",")

    def send_notification(self, error: ErrorLog):
        """Send email notification for critical errors"""
        if not all([self.sender_email, self.sender_password, self.recipient_emails]):
            logging.warning("Email configuration incomplete, skipping notification")
            return

        try:
            msg = MIMEMultipart()
            msg['From'] = self.sender_email
            msg['To'] = ", ".join(self.recipient_emails)
            msg['Subject'] = f"🚨 Critical Error: {error.message[:50]}..."

            body = f"""
Critical Error Detected

Time: {error.timestamp}
Level: {error.level}
Message: {error.message}
URL: {error.url}
User Agent: {error.user_agent}
IP: {error.ip_address}

Stack Trace:
{error.stack_trace}

Please check the error monitoring dashboard for more details.
            """

            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)
            text = msg.as_string()
            server.sendmail(self.sender_email, self.recipient_emails, text)
            server.quit()

            logging.info(f"Error notification sent to {self.recipient_emails}")

        except Exception as e:
            logging.error(f"Failed to send error notification: {e}")

class ErrorMonitor:
    """Main error monitoring service"""

    def __init__(self):
        self.db = DatabaseManager()
        self.email_notifier = EmailNotifier()
        self.setup_logging()

    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('error_monitor.log'),
                logging.StreamHandler()
            ]
        )

    def log_error(self, error_data: Dict[str, Any]) -> Dict[str, Any]:
        """Log an error from the frontend"""
        try:
            error = ErrorLog(
                timestamp=datetime.now().isoformat(),
                level=error_data.get('level', 'ERROR'),
                message=error_data.get('message', 'Unknown error'),
                stack_trace=error_data.get('stackTrace', ''),
                user_agent=error_data.get('userAgent', ''),
                url=error_data.get('url', ''),
                user_id=error_data.get('userId'),
                ip_address=error_data.get('ipAddress', ''),
                browser_info=error_data.get('browserInfo', {}),
                additional_data=error_data.get('additionalData', {})
            )

            error_id = self.db.save_error(error)

            # Send email notification for critical errors
            if error.level in ['CRITICAL', 'ERROR']:
                threading.Thread(
                    target=self.email_notifier.send_notification,
                    args=(error,),
                    daemon=True
                ).start()

            logging.info(f"Error logged: {error.message[:100]}...")

            return {
                "success": True,
                "error_id": error_id,
                "message": "Error logged successfully"
            }

        except Exception as e:
            logging.error(f"Failed to log error: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    def get_errors(self, limit: int = 100, offset: int = 0,
                   resolved: Optional[bool] = None) -> Dict[str, Any]:
        """Get error logs"""
        try:
            errors = self.db.get_errors(limit, offset, resolved)
            return {
                "success": True,
                "errors": errors,
                "total": len(errors)
            }
        except Exception as e:
            logging.error(f"Failed to get errors: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    def resolve_error(self, error_id: int, resolved_by: str) -> Dict[str, Any]:
        """Mark an error as resolved"""
        try:
            success = self.db.resolve_error(error_id, resolved_by)
            return {
                "success": success,
                "message": "Error resolved" if success else "Error not found"
            }
        except Exception as e:
            logging.error(f"Failed to resolve error: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    def get_stats(self) -> Dict[str, Any]:
        """Get error statistics"""
        try:
            stats = self.db.get_error_stats()
            return {
                "success": True,
                "stats": stats
            }
        except Exception as e:
            logging.error(f"Failed to get stats: {e}")
            return {
                "success": False,
                "error": str(e)
            }

# Flask Application
app = Flask(__name__)
CORS(app)

monitor = ErrorMonitor()

@app.route('/api/errors', methods=['POST'])
def log_error():
    """Log an error from the frontend"""
    try:
        error_data = request.get_json()
        if not error_data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        result = monitor.log_error(error_data)
        status_code = 200 if result["success"] else 500
        return jsonify(result), status_code

    except Exception as e:
        logging.error(f"Error in log_error endpoint: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/errors', methods=['GET'])
def get_errors():
    """Get error logs"""
    try:
        limit = int(request.args.get('limit', 100))
        offset = int(request.args.get('offset', 0))
        resolved = request.args.get('resolved')
        resolved = resolved.lower() == 'true' if resolved else None

        result = monitor.get_errors(limit, offset, resolved)
        return jsonify(result)

    except Exception as e:
        logging.error(f"Error in get_errors endpoint: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/errors/<int:error_id>/resolve', methods=['POST'])
def resolve_error(error_id):
    """Mark an error as resolved"""
    try:
        data = request.get_json() or {}
        resolved_by = data.get('resolved_by', 'system')

        result = monitor.resolve_error(error_id, resolved_by)
        status_code = 200 if result["success"] else 404
        return jsonify(result), status_code

    except Exception as e:
        logging.error(f"Error in resolve_error endpoint: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/errors/stats', methods=['GET'])
def get_stats():
    """Get error statistics"""
    try:
        result = monitor.get_stats()
        return jsonify(result)

    except Exception as e:
        logging.error(f"Error in get_stats endpoint: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "SAKO Error Monitor"
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'

    print("🚀 Starting SAKO Error Monitoring Backend...")
    print(f"📊 Database: {monitor.db.db_path}")
    print(f"📧 Email notifications: {'Enabled' if monitor.email_notifier.sender_email else 'Disabled'}")
    print(f"🌐 Server running on port {port}")

    app.run(host='0.0.0.0', port=port, debug=debug)