# Regex Explainer — AI Chatbot Platform

A full-stack web application where authenticated users can paste any Regular Expression and receive a plain-English explanation powered by Google Gemini. The interface mirrors the ChatGPT layout with a persistent sidebar, conversation history, and per-user session isolation.

---

## What It Does

**Topic:** The Regex Explainer
The bot accepts a Regular Expression pattern from the user and breaks it down into clear, human-readable English — explaining each component (character classes, quantifiers, anchors, groups, flags, etc.) and providing match examples.

**Guardrail:** The bot only explains provided regex patterns. It refuses to write new patterns, debug broken regex, or assist with anything outside of regex explanation.

---

## Tech Stack

| Layer    | Technology                                            |
| -------- | ----------------------------------------------------- |
| Backend  | Django 5.x, Django REST Framework, SimpleJWT          |
| AI       | Google Gemini (`gemini-2.0-flash` via google-genai)   |
| Auth     | JWT (access + refresh tokens, stored in localStorage) |
| Frontend | React 19, Redux Toolkit, Axios, React Router v7       |
| Styling  | Custom CSS (ChatGPT-inspired dark theme)              |
| Database | SQLite (development)                                  |

---

## Project Structure

```
Quiz05/
├── README.md
├── backend/
│   ├── .env                        # Environment variables
│   ├── requirements.txt
│   ├── manage.py
│   ├── backend/                    # Django project config (base_app)
│   │   ├── settings.py
│   │   ├── urls.py                 # Root: /admin/, /api/v1/
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── base_app/
│   │   └── urls.py                 # Routes auth + conversations under /api/v1/
│   ├── authentication/
│   │   ├── serializers.py          # RegisterSerializer, MyTokenObtainPairSerializer
│   │   ├── views.py                # register_view, MyTokenObtainPairView
│   │   └── urls.py                 # /signup/, /signin/, /token/refresh/
│   └── conversations/
│       ├── models.py               # Conversation, Message
│       ├── serializers.py          # ConversationSerializer, MessageSerializer
│       ├── views.py                # chat_view, conversation_list_view, conversation_detail_view
│       └── urls.py
└── frontend/
    ├── package.json
    └── src/
        ├── App.js                  # Routes: /, /login, /register
        ├── index.js
        ├── index.css               # Full dark-theme CSS
        ├── store.js                # Redux store (configureStore)
        ├── slices/
        │   ├── authSlice.js        # loginUser, registerUser, logout
        │   └── conversationSlice.js# fetchConversations, sendMessage, etc.
        ├── screens/
        │   ├── LoginScreen.jsx
        │   ├── RegisterScreen.js
        │   └── HomeScreen.jsx      # Full ChatGPT-like layout
        └── components/
            ├── FormComponent.js    # Reusable form wrapper
            ├── Loader.js           # Animated dot loader
            ├── Message.js          # Chat message bubble (user + assistant)
            ├── ConversationItem.js # Sidebar conversation entry
            └── EmptyState.js       # Welcome screen with example prompts
```

---

## API Endpoints

| Method | Endpoint                      | Auth     | Description                        |
| ------ | ----------------------------- | -------- | ---------------------------------- |
| POST   | `/api/v1/auth/signup/`        | Public   | Register a new user                |
| POST   | `/api/v1/auth/signin/`        | Public   | Obtain JWT access + refresh tokens |
| POST   | `/api/v1/auth/token/refresh/` | Public   | Refresh access token               |
| POST   | `/api/v1/conversation/`       | Required | Send message, get AI reply         |
| GET    | `/api/v1/conversations/`      | Required | List all conversations for user    |
| GET    | `/api/v1/conversations/<id>/` | Required | Get conversation with messages     |

---

## Setup & Running

### Prerequisites

- Python 3.10+
- Node.js 18+
- A Google Gemini API key

---

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configure environment variables** — edit `backend/.env`:

```
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
GEMINI_API_KEY=your-google-gemini-api-key
```

```bash
# Create and apply migrations, then start server
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://localhost:8000`

---

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`

---

## Running the Full Application

Open two terminals:

**Terminal 1 — Backend:**

```bash
cd backend
venv\Scripts\activate      # or source venv/bin/activate on macOS/Linux
python manage.py runserver
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm start
```

Then open `http://localhost:3000` in your browser.

---

## Usage

1. **Register** at `/register` with a username and password.
2. **Sign in** at `/login`.
3. On the home screen, paste a regex pattern into the input and press Enter or click Send.
4. The AI explains the regex in plain English.
5. Conversations are saved and listed in the left sidebar.
6. Click any previous conversation to reload its full message history.
7. Use **New chat** to start a fresh session.
8. Click the logout icon at the bottom of the sidebar to sign out.

---

## Data Models

**Conversation**

- `_id` — auto-increment primary key
- `title` — first 60 characters of the first message
- `user` — FK to Django's built-in `User`
- `created_at`, `updated_at`

**Message**

- `conversation` — FK to `Conversation`
- `role` — `user` or `assistant`
- `content` — message body
- `created_at`
