import os
import sys
import subprocess
import time
import socket
import webbrowser
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

def is_port_in_use(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.8)
        return s.connect_ex((host, port)) == 0

def main():
    print("=" * 65)
    print("   MULTILINGUAL STUDENT QUERY & RESPONSE ROUTING SYSTEM")
    print("=" * 65)
    print("Checking services...")

    # 1. Start Backend if not already running on port 8000
    backend_proc = None
    if is_port_in_use(8000):
        print("✓ Backend is already running on http://127.0.0.1:8000")
    else:
        print("Starting FastAPI Backend on http://127.0.0.1:8000 ...")
        cmd_backend = [
            sys.executable,
            "-m",
            "uvicorn",
            "main:app",
            "--reload",
            "--host",
            "127.0.0.1",
            "--port",
            "8000"
        ]
        backend_proc = subprocess.Popen(cmd_backend, cwd=str(BACKEND_DIR))
        # Wait up to 5 seconds for backend to become available
        for _ in range(10):
            if is_port_in_use(8000):
                print("✓ Backend successfully started!")
                break
            time.sleep(0.5)

    # 2. Start Frontend if not already running on port 5173
    frontend_proc = None
    if is_port_in_use(5173):
        print("✓ Frontend is already running on http://localhost:5173")
    else:
        print("Starting React Frontend on http://localhost:5173 ...")
        npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
        frontend_proc = subprocess.Popen([npm_cmd, "run", "dev"], cwd=str(FRONTEND_DIR))
        # Wait up to 10 seconds for frontend to become available
        for _ in range(20):
            if is_port_in_use(5173):
                print("✓ Frontend successfully started!")
                break
            time.sleep(0.5)

    print("\n" + "=" * 65)
    print("   ALL SERVICES ARE LIVE AND RUNNING!")
    print("   👉 FRONTEND PORTAL LINK : http://localhost:5173")
    print("   👉 BACKEND API DOCS LINK: http://127.0.0.1:8000/docs")
    print("=" * 65 + "\n")

    # Automatically open the browser
    time.sleep(1)
    webbrowser.open("http://localhost:5173")
    print("Opened http://localhost:5173 in your default browser.\n")
    print("Press Ctrl + C in this terminal anytime to stop.\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping application servers...")
        if backend_proc:
            backend_proc.terminate()
        if frontend_proc:
            frontend_proc.terminate()
        print("Servers stopped cleanly.")

if __name__ == "__main__":
    main()
