/**
 * Error Logger Utility for SAKO Agency
 * Logs errors to the Python backend service
 */

import React from 'react';

const ERROR_API_URL = process.env.NEXT_PUBLIC_ERROR_API_URL || 'http://localhost:5000/api/errors';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
}

export interface ErrorLogData {
  level: 'ERROR' | 'WARNING' | 'INFO' | 'CRITICAL';
  message: string;
  stackTrace?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  ipAddress?: string;
  browserInfo?: Record<string, unknown>;
  additionalData?: Record<string, unknown>;
}

/**
 * Log an error to the backend service
 */
export const logError = async (
  error: Error | string,
  context?: ErrorContext
): Promise<void> => {
  try {
    const errorMessage = error instanceof Error ? error.message : error;
    const stackTrace = error instanceof Error ? error.stack : undefined;

    const errorData: ErrorLogData = {
      ...context,
      level: 'ERROR',
      message: errorMessage,
      stackTrace,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      browserInfo: typeof navigator !== 'undefined' ? getBrowserInfo() : undefined,
      additionalData: { ...context?.additionalData },
    };

    const response = await fetch(ERROR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    });

    if (!response.ok) {
      console.warn('Failed to log error to backend:', response.statusText);
    }
  } catch (e) {
    // Fallback: log to console if backend logging fails
    console.error('Error logging failed:', e);
    console.error('Original error:', error);
  }
};

/**
 * Log a warning to the backend service
 */
export const logWarning = async (
  message: string,
  context?: ErrorContext
): Promise<void> => {
  try {
    const errorData: ErrorLogData = {
      ...context,
      level: 'WARNING',
      message,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      browserInfo: typeof navigator !== 'undefined' ? getBrowserInfo() : undefined,
      additionalData: { ...context?.additionalData },
    };

    await fetch(ERROR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    });
  } catch (e) {
    console.warn('Failed to log warning to backend:', e);
  }
};

/**
 * Get browser information
 */
const getBrowserInfo = (): Record<string, unknown> => {
  if (typeof navigator === 'undefined') return {};

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
    },
  };
};

/**
 * Global error handler for unhandled errors
 */
export const setupGlobalErrorHandler = (): void => {
  if (typeof window === 'undefined') return;

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      {
        component: 'Global',
        action: 'unhandledrejection',
        additionalData: { type: 'promise_rejection' }
      }
    );
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    logError(
      event.error || new Error(event.message),
      {
        component: 'Global',
        action: 'uncaughterror',
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          type: 'javascript_error'
        }
      }
    );
  });
};

/**
 * Higher-order component for error boundary logging
 */
export function withErrorLogging<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const WithErrorLogging = class extends React.Component<P, { hasError: boolean }> {
    static displayName?: string;
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

     
    static getDerivedStateFromError(_error: Error) {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      logError(error, {
        component: componentName || Component.name,
        action: 'component_error',
        additionalData: {
          errorInfo,
          componentStack: errorInfo.componentStack,
          type: 'react_error_boundary'
        }
      });
    }

    render() {
      if (this.state.hasError) {
        return React.createElement('div', { className: 'error-fallback' },
          React.createElement('h2', null, 'Something went wrong'),
          React.createElement('p', null, 'Please refresh the page or contact support if the problem persists.')
        );
      }

      return React.createElement(Component, this.props);
    }
  };

  WithErrorLogging.displayName = `WithErrorLogging(${componentName || Component.displayName || Component.name || 'Component'})`;
  return WithErrorLogging;
};