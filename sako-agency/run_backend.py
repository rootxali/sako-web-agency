#!/usr/bin/env python3
"""
SAKO Error Monitor - Startup Script
Run this script to start the error monitoring backend service
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    """Main startup function"""
    print("🚀 Starting SAKO Error Monitoring Backend...")

    # Check if we're in the backend directory
    backend_dir = Path(__file__).parent / "backend"
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        sys.exit(1)

    # Change to backend directory
    os.chdir(backend_dir)

    # Check if requirements.txt exists
    requirements_file = backend_dir / "requirements.txt"
    if requirements_file.exists():
        print("📦 Installing dependencies...")
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
            print("✅ Dependencies installed successfully")
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies")
            sys.exit(1)

    # Check if .env exists
    env_file = backend_dir / ".env"
    if not env_file.exists():
        print("⚠️  .env file not found. Using default configuration.")

    # Start the server
    print("🌐 Starting Flask server...")
    try:
        subprocess.run([sys.executable, "error_monitor.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()