# AI Chatbot - Regex Explainer

## Description

This app is an AI Chatbot. The Regex Explainer is a bot that helps users paste a Regular Expression (Regex), and the bot translates what it does into plain English.

## Project Structure

- **Backend**: Django REST API server
- **Frontend**: React-based web interface

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm (Node Package Manager)
- pip (Python Package Manager)
- Git

## Clone the Repository

```bash
git clone <repository-url>
cd Quiz5
```

## Backend Setup

### Install Python Virtual Environment

```bash
cd backend
python -m venv myvenv
```

### Activate Virtual Environment

**On Windows (PowerShell):**

```powershell
myvenv\Scripts\Activate.ps1
```

**On Windows (Command Prompt):**

```cmd
myvenv\Scripts\activate.bat
```

**On macOS/Linux:**

```bash
source myvenv/bin/activate
```

### Install Backend Requirements

```bash
pip install -r requirements.txt
```

### Run the Backend Server

```bash
python manage.py migrate
python manage.py runserver
```

The backend will start on `http://localhost:8000`

## Frontend Setup

### Install Node Dependencies

```bash
cd frontend
npm install
```

### Run the Frontend Development Server

```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Running the Full Application

1. **Terminal 1 - Backend:**

   ```bash
   cd backend
   # Activate virtual environment (see instructions above)
   python manage.py runserver
   ```

2. **Terminal 2 - Frontend:**

   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build/` directory.

### Backend Production

See Django documentation for production deployment guidelines.

## Technologies Used

- **Frontend**: React, Redux, Bootstrap, CoreUI
- **Backend**: Django, Django REST Framework
- **Environment Variables**: python-dotenv, django-environ

## Additional Notes

- Make sure both the backend and frontend servers are running simultaneously for the app to work properly
- The frontend communicates with the backend API at `http://localhost:8000`
- For environment-specific configurations, check `.env` files in both backend and frontend directories
