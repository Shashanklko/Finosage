from backend.app import app

# This file provides the WSGI entry point for Gunicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000) 