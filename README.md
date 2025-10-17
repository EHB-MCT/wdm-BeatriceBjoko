# Quiz App — Data-Driven Learning Platform

A full-stack **Quiz Application** that tracks user performance, analyzes question difficulty, and visualizes learning patterns.  
This project combines **React (frontend)**, **Node.js + Express (backend)**, and **MongoDB (database)** — all containerized using **Docker**.

---

## 🚀 Project Overview

This app is more than just quizzes — it’s an **analytics-based learning tool**.  
Users can play quizzes, use hints, and monitor their progress, while the system tracks detailed behavioral data for analysis.

### 🎯 Core Goals

- Build a **modern quiz app** with real-time feedback.
- Gather analytics on user performance and question difficulty.
- Visualize global stats and personal insights.
- Use **Docker** to manage a scalable and reproducible development environment.

---

## ⚙️ Tech Stack

| Layer                | Technology                                                                      | Description                                    |
| -------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Frontend**         | React + Vite                                                                    | Interactive quiz UI with live feedback         |
| **Backend**          | Node.js + Express                                                               | REST API for questions, results, and analytics |
| **Database**         | MongoDB                                                                         | Stores users, questions, and gameplay data     |
| **Containerization** | Docker + Docker Compose for multi-container setup (frontend, backend, database) |

---

## 🧩 Features

### 🧠 Quiz Functionality

- Multiple-choice questions with hints and lives
- Timer per question (track response speed)
- Dynamic question difficulty based on average success rate

### 📊 Analytics & Insights

- Average response time per question
- Global vs. personal success rates
- Hint usage patterns
- Session time and drop-off analysis
- Regional activity tracking (via IP geolocation)

### 👩‍💻 Developer Tools

- Modular architecture (frontend/backend separation)
- Docker setup for full-stack deployment
- API ready for data collection and analysis

---

## 🧭 Getting Started

### 🐳 Option 1 — Run with Docker (recommended)

- Make sure you have Docker installed, then run: docker compose up --build

- Once everything is running:

- Frontend → http://localhost:8080

- Backend → http://localhost:5000

- MongoDB → Port 27017

To stop the containers: docker compose down

### 💻 Option 2 — Run Locally (for development)

If you prefer not to use Docker:

#### 1️⃣ Start the Backend

cd backend
npm install
npm start

#### 2️⃣ Start the Frontend

cd frontend
npm install
npm run dev

Then open your browser at http://localhost:8080
