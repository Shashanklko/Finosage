#!/bin/bash
cd backend
exec uvicorn main:app --host 0.0.0.0 --port $PORT
