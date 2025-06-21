# Concept Clarifier - Flask Web Application

Your AI Learning Partner - Now as a modern web application with Flask API backend.

## Features

- **Modern Web Interface**: Clean, responsive chatbot interface
- **Flask API Backend**: RESTful API for chat interactions
- **Real-time Chat**: Interactive conversation with AI tutor
- **Conversation History**: Maintains context throughout the session
- **Mobile Responsive**: Works seamlessly on all devices
- **Educational Focus**: AI tutor designed to encourage learning and critical thinking

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+ (for development)

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements-flask.txt
```

2. Create a `.env` file and add your Groq API key:
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

3. Run the Flask application:
```bash
python app.py
```

The Flask API will be available at `http://localhost:5000`

### Frontend Development

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The development server will be available at `http://localhost:5173`

### Production Build

1. Build the frontend:
```bash
npm run build
```

2. The Flask app will serve the built files from the `dist` folder

## API Endpoints

- `GET /` - Serves the web application
- `POST /api/chat` - Chat with the AI tutor
- `GET /api/health` - Health check endpoint

## Usage

1. Open the web application in your browser
2. Type your question in the input field
3. Press Enter or click the send button
4. The AI tutor will respond with explanations and guidance
5. Continue the conversation to deepen your understanding

## Technology Stack

- **Backend**: Flask, LangChain, ChatGroq
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build Tool**: Vite
- **AI Model**: Llama 3.1 via Groq API

## Original Streamlit Version

The original Streamlit version is available at: https://conceptclarifier-genai.streamlit.app/