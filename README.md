# Finosage - Financial Knowledge Base Chatbot

A web-based chatbot that provides information about financial terms and concepts..

## Features

- Interactive chat interface
- Comprehensive financial knowledge base
- Real-time responses
- Follow-up question suggestions
- Mobile-responsive design

## Prerequisites

- Docker and Docker Compose
- Git

## Deployment Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finosage.git
cd finosage
```

2. Make the deployment script executable:
```bash
chmod +x deploy.sh
```

3. Run the deployment script:
```bash
./deploy.sh
```

4. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:8000

## Development

### Local Development

1. Start the backend server:
```bash
cd backend
python -m uvicorn main:app --reload
```

2. Start the frontend server:
```bash
cd frontend
# Use your preferred static file server
```

## Project Structure

```
finosage/
├── backend/           # FastAPI backend
├── frontend/          # Frontend static files
├── docker-compose.yml # Docker Compose configuration
├── deploy.sh         # Deployment script
└── README.md         # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 
