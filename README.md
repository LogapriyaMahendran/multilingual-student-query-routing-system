# Multilingual Student Query Intent & Response Routing System

An intelligent, AI-powered college inquiry management portal that enables students to submit academic and campus questions in multiple Indian regional languages—**English, Tamil (தமிழ்), Hindi (हिन्दी), Malayalam (മലയാളം), Telugu (తెలుగు), and Kannada (ಕನ್ನಡ)**. 

---

### 🌐 Live Production Links

* **Live Web Application (Frontend):**  
  👉 **[https://multilingual-student-query-routing.onrender.com/](https://multilingual-student-query-routing.onrender.com/)**

* **Live API Backend Service:**  
  👉 **[https://multilingual-student-query-routing-system.onrender.com/](https://multilingual-student-query-routing-system.onrender.com/)**

* **Live Interactive Swagger API Docs:**  
  👉 **[https://multilingual-student-query-routing-system.onrender.com/docs](https://multilingual-student-query-routing-system.onrender.com/docs)** 

The system automatically detects the student's language, classifies their intent using a trained Multilingual Naive Bayes NLP model with a domain-specific fallback engine, and routes the query directly to the designated college office (e.g., Examination Cell, Accounts Department, Scholarship Office, IT Support).

---

## 🎯 Project Objectives

1. **Eliminate Language Barriers**: Allow students to communicate in their native mother tongue without hesitation.
2. **Automate Query Classification**: Accurately predict query intent across 8 standard college domains using machine learning.
3. **Instant Department Dispatch**: Route inquiries to the correct department within milliseconds with transparent routing rationales.
4. **SLA & Audit Tracking**: Provide a full lifecycle audit trail (Submitted &rarr; Assigned &rarr; In Progress &rarr; Resolved &rarr; Reopened).
5. **Campus Telemetry**: Equip administrators and department staff with real-time analytics on inquiry volume, resolution speeds, and language adoption.

---

## 🌟 Key Features

* **Multi-Script Unicode Support**: Native rendering and processing for Tamil (தமிழ்), Hindi (हिन्दी), Malayalam (മലയാളം), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), and English.
* **Trained NLP Intent Classifier**: Scikit-Learn pipeline (`TfidfVectorizer` with `char_wb` n-grams + `MultinomialNB`) with real confidence scores (98%–99%).
* **Semantic Urgency Detection**: Automatically flags tickets as **Urgent**, **High**, **Medium**, or **Low** based on lexical urgency markers.
* **Intelligent Disambiguation Routing**:
  * Tuition fees & dues &rarr; **Accounts Department**
  * Merit & government aid &rarr; **Scholarship Office**
  * Campus bus routes & passes &rarr; **Transport Office**
  * Hostel rooms & mess &rarr; **Hostel Administration**
  * Hall tickets & exams &rarr; **Examination Cell**
  * Wi-Fi & LMS portal &rarr; **IT Support**
  * Degree & Bonafide certificates &rarr; **Certificate & Verification Section**
* **Role-Based Portals**:
  * **Student Portal**: Interactive submission, live pre-check sandbox, real-time ticket tracking, and notification bell.
  * **Department Staff Portal**: Queue filtered strictly to assigned department, response thread in student's language, status changer.
  * **Admin Command Center**: Chart.js analytics (Intent distribution, Language breakdown, Department load radar), user management, and CSV report export.
* **Theme Customization**: Clean collegiate white & deep-blue aesthetic with an optional Dark Mode toggle.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router 6, Chart.js, react-chartjs-2, Lucide React, Axios |
| **Backend** | Python 3.10+ / 3.14, FastAPI, SQLAlchemy ORM, Pydantic, PyJWT, Bcrypt, Uvicorn |
| **AI & NLP** | Scikit-Learn (TF-IDF + Multinomial Naive Bayes), Unicode Script Block Analysis |
| **Database** | SQLite (development) / PostgreSQL (production) with SQLAlchemy ORM |
| **Deployment** | Vercel (Frontend SPA) + Render (FastAPI Web Service) |

---

## 📁 Project Structure

```text
Student Query/
├── backend/
│   ├── models/             # SQLAlchemy ORM models (User, Query, Response, History, Notification)
│   ├── schemas/            # Pydantic validation schemas
│   ├── routers/            # FastAPI route handlers (auth, queries, staff, admin, notifications)
│   ├── services/           # Business logic (auth_service, nlp_service, routing_service, notification_service)
│   ├── middleware/         # JWT authentication & role-based authorization dependencies
│   ├── config.py           # Application settings & environment parsing
│   ├── database.py         # SQLAlchemy engine & session dependency
│   ├── init_db.py          # Database schema creator & seed data generator
│   ├── main.py             # FastAPI entry point with CORS & lifespan events
│   ├── requirements.txt    # Python dependencies
│   ├── test_api_flows.py   # Comprehensive automated end-to-end test suite
│   ├── .env.example        # Backend environment variables template
│   └── student_query.db    # Development SQLite database (git-ignored)
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components (StatusBadge, PriorityBadge, NotificationModal)
│   │   ├── context/        # AuthContext & Theme state management
│   │   ├── layouts/        # DashboardLayout with responsive sidebar & Navbar
│   │   ├── pages/          # 12 application pages (Landing, Login, Register, Dashboards, etc.)
│   │   ├── services/       # Axios API client with JWT interceptor
│   │   ├── utils/          # Formatting & color helpers
│   │   ├── App.jsx         # Client-side router with role-based route guards
│   │   ├── index.css       # Collegiate theme with regional fonts & dark mode
│   │   └── main.jsx        # React root mount
│   ├── package.json        # Frontend dependencies & scripts
│   ├── vite.config.js      # Vite build configuration
│   ├── vercel.json         # Vercel SPA client routing rewrites
│   └── .env.example        # Frontend environment variables template
├── .vscode/
│   └── tasks.json          # 1-click VS Code task runner
├── .gitignore              # Git ignore rules for secrets, dependencies, and databases
├── render.yaml             # Render deployment blueprint specification
├── run.py                  # One-command dual server launcher
├── start.bat               # Windows double-click starter script
└── README.md               # Documentation & setup guide
```

---

## 🚀 Installation & Local Execution

### Prerequisites
* Python 3.10+ (tested with Python 3.14)
* Node.js 18+ and npm

---

### Option A: The One-Command Run (Fastest)

From the project root folder:
```powershell
python run.py
```
This automatically initializes the database, starts the backend on port `8000`, starts the frontend on port `5173`, and opens the application in your browser at `http://localhost:5173`.

---

### Option B: Running Services Separately in VS Code

#### 1. Backend Setup:
```powershell
cd backend
pip install -r requirements.txt
python init_db.py
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
* Backend API: `http://127.0.0.1:8000`
* Swagger API Documentation: `http://127.0.0.1:8000/docs`

#### 2. Frontend Setup (in a separate terminal):
```powershell
cd frontend
npm install
npm run dev
```
* Frontend Application: `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default (Development) |
|---|---|---|
| `PROJECT_NAME` | Portal title | `Multilingual Student Query Intent & Response Routing System` |
| `DATABASE_URL` | SQLAlchemy connection string | `sqlite:///./student_query.db` |
| `JWT_SECRET_KEY` | Secret key for JWT signing | `min-32-chars-secret-key-change-in-production` |
| `JWT_ALGORITHM` | Algorithm for token encoding | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `1440` (24 hours) |
| `CORS_ORIGIN_REGEX` | Allowed CORS origins regex | `https?://.*` |

### Frontend (`frontend/.env`)
| Variable | Description | Default (Development) |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://127.0.0.1:8000` |

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Department / Year |
|---|---|---|---|
| **Student** | `priya.student@college.edu` | `Student@123` | Computer Science (3rd Year) |
| **Student 2** | `rahul.student@college.edu` | `Student@123` | Information Technology (2nd Year) |
| **Exam Staff** | `exam.staff@college.edu` | `Staff@123` | Examination Cell |
| **Accounts Staff** | `accounts.staff@college.edu` | `Staff@123` | Accounts Department |
| **IT Staff** | `it.staff@college.edu` | `Staff@123` | IT Support |
| **Administrator** | `admin@college.edu` | `Admin@123` | Administration |

*The login page also provides 1-click demo buttons that pre-fill and submit these credentials instantly.*

---

## 🧪 Automated Testing

Run the automated test suite to verify authentication, multilingual NLP classification, department routing, staff responses, and analytics:

```powershell
cd backend
python test_api_flows.py
```

---

## ☁️ Production Deployment Guide

### 1. Deploying Backend to Render
1. Create a free account at [render.com](https://render.com).
2. Click **New +** &rarr; **Web Service**.
3. Connect your GitHub repository: `https://github.com/LogapriyaMahendran/multilingual-student-query-routing-system`.
4. Configure the settings:
   * **Root Directory**: `backend`
   * **Runtime**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   * `JWT_SECRET_KEY`: *(Generate a secure 32+ character random string)*
   * `DATABASE_URL`: `sqlite:///./student_query.db` *(or Render PostgreSQL)*
   * `CORS_ORIGIN_REGEX`: `https?://.*`
6. Click **Deploy Web Service** and note your public URL:  
   `https://<your-backend-name>.onrender.com`

---

### 2. Deploying Frontend to Vercel
1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New...** &rarr; **Project**.
3. Import the GitHub repository: `multilingual-student-query-routing-system`.
4. Configure the settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Add Environment Variable:
   * `VITE_API_URL`: `https://<your-backend-name>.onrender.com` *(from Render step above)*
6. Click **Deploy**. Vercel will output your live URL:  
   `https://<your-frontend-name>.vercel.app`
