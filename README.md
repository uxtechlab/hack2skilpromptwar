# AuraCare Clinic AI Assistant (Hackathon Submission)

A complete, production-ready AI-powered Patient Assistant and Clinic Dashboard built for healthcare, dental, skin, hair, and laser aesthetic clinics. 

---

## 🌟 Project Overview

**AuraCare Clinic AI Assistant** is a smart digital assistant designed to streamline patient operations. It helps patients identify clinical concerns, matches them to the correct specialist department, recommends appropriate treatments, answers clinic FAQs, and automates appointment bookings.

Adopting a **dual-mode intelligence system**, the assistant functions out-of-the-box using a local NLP rule engine, and upgrades to a context-aware conversational AI when supplied with a Google Gemini API key. All clinic treatments, department specialists, and FAQs are configured dynamically in a central JSON format, allowing clinic administrators to add or adjust services in real-time without modifying code.

---

## 🏥 Chosen Vertical
* **Vertical**: Healthcare & Aesthetic Wellness Clinic (Dental / Skin / Hair / Laser / Cosmetic)
* **Target Audience**: Prospective patients inquiring about treatments, looking for quick answers about recovery/costs, or requesting appointments.

---

## 🚀 Key Features

1. **Intelligent Conversational Assistant**:
   - Natural language chat interface styled with custom Glassmorphism.
   - Dynamic recommendation tags suggested in-line with message replies.
   - Conversation history cleanup and automatic scroll transitions.
2. **Patient Concern Analyzer**:
   - Detects symptoms for Dental (tooth pain, bleeding gums), Skin (acne, dullness, pores), Hair (loss, dandruff), Laser (unwanted hair, tattoos), and Cosmetic (wrinkles, lip volume).
   - Maps symptoms directly to specialists (Dr. Sarah Lin, Dr. Marcus Vance, etc.).
3. **Smart Decision Engine**:
   - Dual-Mode: Full Google Gemini Generative AI fallback to Local Token-Overlap Keyword Matching.
   - Scores user messages against treatment directories to provide relevant suggestions.
4. **FAQ Engine**:
   - Exposes timings, address, cancelation policy, pricing, safety protocols, and pain-tolerance info.
   - Auto-expands FAQ match blocks inside the chat.
5. **Interactive Catalog Dashboard**:
   - Searchable, tabbed catalog grouping treatments by department.
   - Transparent details: cost, duration, and recovery/downtime info.
   - Direct booking buttons linked from each card.
6. **Robust Appointment Booking flow**:
   - Collects Name, Phone, Concern, Preferred Date, and Preferred Time.
   - Validates dates (no past scheduling) and phone numbers.
7. **Admin Config Panel**:
   - Add new treatments or FAQ items directly via a web form.
   - Updates `services.json` on the fly, immediately refreshing the chat and catalog.

---

## 🛠️ Architecture & Folder Structure

The project is structured as a clean monorepo:

```
promptwar/
├── client/                 # React + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminConfig.tsx      # Admin Console configuration manager
│   │   │   ├── AppointmentForm.tsx  # Patient appointment scheduler
│   │   │   ├── ChatWidget.tsx       # Conversational AI assistant
│   │   │   └── ClinicDashboard.tsx  # Dynamic catalog and FAQs list
│   │   ├── App.tsx         # Main layout and tab controller
│   │   ├── index.css       # Custom design tokens, glassmorphism CSS
│   │   └── main.tsx        # React entrypoint
│   ├── index.html          # Web entry and SEO meta tags
│   ├── vite.config.ts      # Vite dev settings
│   └── tsconfig.json       # TypeScript frontend configurations
│
├── server/                 # Express + TypeScript Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── config.ts            # Environment loader & JSON I/O
│   │   ├── controllers/
│   │   │   ├── appointmentController.ts # Booking handlers
│   │   │   └── chatController.ts    # Chat session manager
│   │   ├── data/
│   │   │   ├── appointments.json    # Persistent booking file database
│   │   │   └── services.json        # Central clinic configuration
│   │   ├── middleware/
│   │   │   └── validation.middleware.ts # Express-validator rules
│   │   ├── routes/
│   │   │   └── routes.ts            # API routes
│   │   ├── services/
│   │   │   ├── appointmentService.ts # JSON persist helper
│   │   │   ├── clinicService.ts     # Configuration service
│   │   │   └── decisionEngine.ts    # Dual-mode AI / Local NLP engine
│   │   ├── types/
│   │   │   └── clinic.types.ts      # TypeScript interfaces
│   │   ├── app.ts          # Express setup
│   │   └── server.ts       # Server launcher
│   ├── jest.config.js      # Testing framework configuration
│   ├── tsconfig.json       # TypeScript backend configurations
│   └── package.json        # Node.js backend packages
│
└── README.md               # Documentation
```

---

## ⚙️ Environment Setup

Navigate to the `server` directory and create a `.env` file based on `.env.example`:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

> [!NOTE]
> If `GEMINI_API_KEY` is left blank, the system automatically uses its local keyword-matching NLP decision engine. You can test it fully without an API key!

---

## 📥 Installation & Running Locally

Ensure you have [Node.js](https://nodejs.org) (v18+) installed.

### 1. Set Up and Run the Backend Server
```bash
# Navigate to the server folder
cd server

# Install dependencies
npm install

# Run the automated tests to verify code stability
npm run test

# Start the server in developer mode (port 5000)
npm run dev
```

### 2. Set Up and Run the Frontend Client
```bash
# Open a new terminal and navigate to the client folder
cd client

# Install dependencies
npm install

# Build the client to ensure no compiler warnings
npm run build

# Start the frontend dev server (port 5173)
npm run dev
```

Open your browser to [http://localhost:5173](http://localhost:5173) to see the application.

---

## ☁️ Deployment Guide

### Option A: Deploying Frontend to Vercel & Backend to Render (Recommended Free Tier)

#### 1. Frontend on Vercel
1. Sign up on [Vercel](https://vercel.com).
2. Connect your Git Repository.
3. Select **Import** for the repository, and set the **Root Directory** as `client`.
4. Configure the settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

#### 2. Backend on Render
1. Sign up on [Render](https://render.com).
2. Create a new **Web Service** and connect your repository.
3. Configure the settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add **Environment Variables** in the Render Dashboard:
   - `PORT`: `10000` (or leave empty, Render assigns dynamically)
   - `CORS_ORIGIN`: Your Vercel frontend URL (e.g. `https://your-app.vercel.app`)
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API Key.
5. Click **Deploy Web Service**.

> [!IMPORTANT]
> Once deployed, modify `client/src/components/ClinicDashboard.tsx`, `client/src/components/AppointmentForm.tsx`, `client/src/components/ChatWidget.tsx`, and `client/src/components/AdminConfig.tsx` to point to your live Render backend URL instead of `http://localhost:5000`.

---

## 🧪 Testing Verification
The backend includes a full suite of unit and integration tests using **Jest** and **Supertest**.

Run tests using:
```bash
cd server
npm run test
```

Test coverage includes:
- **Local NLP Matching**: Timings, Acne, Bleeding Gums, and Greetings logic.
- **Booking State Machine**: Step-by-step conversation workflow transitions.
- **API Controllers**: Sanitization checks, missing fields rejection, and dynamic treatment creation.

---

## 📝 Assumptions & Scope
- **Storage**: Appointments are saved into `server/src/data/appointments.json` for lightweight persistence. In a full scale production setting, this should be replaced with a SQL or NoSQL database (e.g., PostgreSQL or MongoDB) via Prisma or Mongoose.
- **API Key**: If the Gemini API key expires or is empty, the server guarantees 100% operation using the fallback matching engine.
