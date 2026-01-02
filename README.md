# Behavioral Analytics Quiz Platform — Data-Driven Learning Insights

A full-stack **behavioral analytics platform** that extends traditional quiz functionality with implicit user behavior tracking and cognitive load assessment. This research-oriented system captures micro-behaviors to identify learning patterns, hesitation indicators, and engagement metrics in real-time.

---

## 🎯 Project Overview & Problem Statement

### The Challenge in Educational Assessment

Traditional quiz applications provide only **explicit performance metrics** (correct/incorrect answers, completion time). However, they miss crucial **implicit behavioral signals** that reveal cognitive processes:

- **Cognitive Load Indicators**: How mental effort fluctuates during problem-solving
- **Decision Hesitation Patterns**: Moments of uncertainty before answer selection
- **Attention Disengagement**: When learners lose focus or become distracted
- **Help-Seeking Behavior**: When and why users request hints

### Why This Project Matters

This platform addresses a significant gap in **educational technology research** by:

- Capturing **fine-grained behavioral data** without intrusive equipment
- Providing **real-time cognitive load assessment** through mouse tracking and interaction patterns
- Enabling **adaptive interventions** based on observed user states
- Demonstrating how **implicit signals** can complement explicit performance metrics

### Innovation Beyond Basic Quiz Apps

Unlike conventional quiz platforms, this system:

- Tracks **6 distinct behavioral metrics** beyond simple answers
- Implements **session-level stress scoring** with gentle intervention triggers
- Provides **research-grade analytics** for educational psychology studies
- Demonstrates **real-world applicability** of cognitive load theory in web environments

---

## 🧠 Core Concepts & Behavioral Metrics

### Implicit Behavioral Signal Tracking

This platform captures **six key behavioral indicators** that provide insights into cognitive processes and learning states:

#### 1. **Tab Blur Tracking**

- **What**: Detects when users switch away from the quiz tab
- **Why**: Indicates potential distraction, fatigue, or cognitive overload
- **Implementation**: Window blur events with debouncing to prevent false positives
- **Academic Basis**: Correlates with mind wandering and attention disengagement

#### 2. **Hover Intent Detection**

- **What**: Measures deliberate hovering over answer options
- **Why**: Suggests consideration and evaluation of choices
- **Implementation**: 1.5-second delay before registering hover intent
- **Research Support**: Longer hover times correlate with deeper cognitive processing

#### 3. **Hover Switch Analysis**

- **What**: Tracks movement between different answer options
- **Why**: Indicates uncertainty, comparison behavior, or indecision
- **Implementation**: Sequential hover events on different answer options
- **Cognitive Insight**: High switching frequency suggests conflicting mental representations

#### 4. **Response Time Measurement**

- **What**: Time from question presentation to answer submission
- **Why**: Combined with other metrics to assess cognitive load
- **Implementation**: High-resolution timing with performance.now()
- **Research Context**: Both fast and slow responses can indicate different cognitive states

#### 5. **Hint Usage Patterns**

- **What**: When and how often users request help
- **Why**: Reveals difficulty thresholds and help-seeking strategies
- **Implementation**: Event-based tracking with question context
- **Educational Value**: Identifies optimal timing for scaffolding interventions

#### 6. **Session-Level Stress Influence**

- **What**: Cumulative behavioral indicators aggregated per session
- **Why**: Provides holistic view of user cognitive state over time
- **Implementation**: Weighted scoring system with intervention thresholds
- **Adaptive Potential**: Enables context-aware system responses

---

## 🏗️ Architecture Overview

### System Design Principles

#### **Frontend (React 18 + Vite)**

- **Hook-Based Architecture**: Custom hooks for each behavioral tracking modality
- **Session Management**: Centralized state handling for behavioral data
- **Event-Driven Design**: Real-time event streaming to backend
- **Component Separation**: Clear distinction between UI, logic, and data layers

**Key Architectural Patterns:**

- `useTabBlurTracking`: Manages attention disengagement detection
- `useAnswerHoverTracking`: Handles complex hover state machine
- `SessionInfluenceContext`: Provides reactive stress scoring
- `eventService`: Centralized event transmission to backend

#### **Backend (Node.js + Express)**

- **Layered Architecture**: Clear separation of concerns
  - **Controllers**: Request/response handling and validation
  - **Services**: Business logic and data processing
  - **Repositories**: Data access and persistence
  - **Models**: Data structure definitions

#### **Event-Based Analytics Model**

- **Event Structure**: `{ type, sessionId, payload, timestamp }`
- **Real-time Processing**: Immediate logging and aggregation
- **Scalable Design**: Easy addition of new behavioral metrics
- **Research Ready**: Structured data suitable for academic analysis

### Why This Architecture Matters

1. **Testability**: Each layer can be independently validated
2. **Maintainability**: Clear responsibilities reduce coupling
3. **Extensibility**: New behavioral metrics integrate seamlessly

---

## ⚙️ Technology Stack

| Layer                | Technology              | Purpose & Justification                          |
| -------------------- | ----------------------- | ------------------------------------------------ |
| **Frontend**         | React 18 + Vite         | Modern, component-based UI with fast development |
| **Routing**          | React Router DOM 7      | Client-side routing with navigation guards       |
| **Charts**           | Recharts 3.6            | React-native, maintainable data visualization    |
| **Backend**          | Node.js + Express       | RESTful API with middleware ecosystem            |
| **Database**         | MongoDB 8.x             | Flexible schema for evolving behavioral data     |
| **Authentication**   | JWT + bcrypt            | Secure token-based user management               |
| **Containerization** | Docker + Docker Compose | Reproducible development and deployment          |
| **Real-time Events** | Custom event service    | Low-latency behavioral data transmission         |

---

## 🛡️ Access Control & Security Architecture

### Role-Based Access Control System

This implementation demonstrates **textbook access control patterns** with clear role separation:

#### **Authentication Flow**

1. **Unauthenticated Users** → Redirected to `/login`
2. **Authenticated Regular Users** → Redirected to `/quiz`
3. **Authenticated Admin Users** → Full admin dashboard access

#### **Access Control Implementation**

**Frontend Guards:**

```jsx
// Protected route implementation
<AdminRoute>
	<AdminDashboard />
</AdminRoute>
```

**Backend Middleware:**

- `authMiddleware`: JWT token validation
- `requireAdmin`: Role-based endpoint protection
- Session-based behavioral data isolation

#### **Security Features**

- **JWT Authentication**: Stateless token-based sessions
- **Password Hashing**: bcrypt for secure credential storage
- **Environment Variables**: Sensitive configuration protection
- **CORS Configuration**: Cross-origin request security

### Admin Dashboard Features

#### **Behavioral Analytics Visualizations**

- **Hover Hesitation Charts**: Correlate hover behavior with question difficulty
- **Tab Blur Patterns**: Identify disengagement hotspots by question
- **Hint Effectiveness**: Analyze help-seeking patterns and outcomes
- **Response Time Distributions**: Speed-accuracy relationship analysis
- **Session Influence Tracking**: Cognitive load progression over time

#### **Why Recharts for Visualization**

- **React Native Integration**: Seamless component integration
- **Maintainability**: Declarative API with clear intent
- **Academic Suitability**: Publication-ready chart quality
- **Extensibility**: Easy addition of new visualization types

---

## 🧪 Testing & Validation

### Manual Testing Methodology

#### **Test Matrix Scenarios**

| Scenario         | Expected Behavior                    | Validation Criteria                |
| ---------------- | ------------------------------------ | ---------------------------------- |
| **Tab Blur**     | Increment stress score on focus loss | Debounced events, no spam          |
| **Hover Intent** | Register after 1.5s hover            | Timer accuracy, cleanup on unmount |
| **Hover Switch** | Track A→B transitions                | Proper state management            |
| **Hint Usage**   | Log with question context            | Session correlation maintained     |
| **Admin Access** | Role-based routing                   | Proper redirects and guards        |

#### **Behavioral Validation Tests**

- **Event Propagation**: Verify real-time event transmission
- **Session Isolation**: Confirm data separation between users
- **Stress Accumulation**: Test scoring algorithm thresholds
- **Chart Accuracy**: Validate data visualization correctness

### Quality Assurance

- **Component Testing**: Individual hook and context validation
- **Integration Testing**: End-to-end behavioral flow verification
- **Performance Testing**: Event handling under load conditions
- **Browser Compatibility**: Cross-browser behavioral consistency

---

## 🚀 Environment Setup & Deployment

### Prerequisites

- **Docker & Docker Compose** (recommended)
- **Node.js 18+** (for local development)
- **MongoDB** (if not using Docker)

### 🐳 Docker Deployment (Recommended)

#### **Step 1: Environment Configuration**

```bash
# Copy the environment template
cp .env.template .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**

```env
# Backend Configuration
BACKEND_PORT=5000
MONGO_URL=mongodb://mongo:27017/quizapp
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# Frontend Configuration
FRONTEND_PORT=8080

# Admin User Seeding (optional but recommended)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-admin-password
```

#### **Step 2: Launch Application**

```bash
# Build and start all services
docker compose up --build

# For detached mode
docker compose up --build -d
```

#### **Step 3: Verify Deployment**

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

#### **Step 4: Cleanup**

```bash
# Stop containers
docker compose down

# Remove volumes (deletes all data)
docker compose down -v
```

### 💻 Local Development Setup

#### **Backend Setup**

```bash
cd backend
npm install
# Configure .env with local MongoDB URL
npm start
```

#### **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

#### **Database Setup**

```bash
# Using MongoDB locally
mongod
# Or with Docker
docker run -d -p 27017:27017 mongo
```

### 🔧 Project Cloning Guide

For other developers wanting to run this project:

```bash
# Clone the repository
git clone <repository-url>
cd wdm-BeatriceBjoko

# Configure environment
cp .env.template .env
# Edit .env with your settings

# Start with Docker (recommended)
docker compose up --build

# Or develop locally
# Follow local development steps above
```

---

## 📚 Sources

### Behavioral Tracking & Cognitive Load Research

1. [environement variables](https://betterstack.com/community/questions/how-to-store-deploy-settings-node-js/) -> .env
2. [constants](https://medium.com/@shreya.dikshit99000/clean-code-with-constants-in-node-js-a-way-to-manage-the-static-values-ce8f1e6b7057) -> /config/analyticsThresholds.js -> manage constants
3. [constants](https://semaphore.io/blog/constants-layer-javascript) -> /config/analyticsThresholds.js -> manage constants
4. [seeders](https://medium.com/@emdadulislam162/setting-up-seeders-in-node-js-and-mongoose-with-example-828da1bf89f1) -> /config/seedAdmin.js -> setting up seeders
5. [mvc](https://codewithmatt.hashnode.dev/understanding-the-building-blocks-of-a-web-application-routes-controllers-services-repositories-and-databases) -> mvc
6. [Node.js architecture](https://www.youtube.com/watch?v=fc6o1gwqZuA) -> node.js architecture
7. [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) -> controllers/authController.js
8. [authentication](https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49) -> authentication in node.js
9. [jwt](https://www.geeksforgeeks.org/node-js/jwt-authentication-with-node-js/) -> jwt authentication
10. [Number.isNaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN) -> controllers/adminController.js -> Input values are converted using `parseInt()` and validated with `Number.isNaN()` to apply fallback values when the input is not a valid number.
11. [middleware](https://www.w3schools.com/nodejs/nodejs_middleware.asp) -> middleware
12. [middleware](https://expressjs.com/en/guide/using-middleware.html) -> /middleware -> folder contains Express middleware functions used to handle requests
13. [hashing](https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/) -> /models/User.js -> password hashing
14. [Charts](https://recharts.github.io/) -> A composable charting library built on React components -> components/charts
15. [hooks](https://react.dev/reference/react/hooks) -> /front-end -> hooks folder
16. [React best practices](https://dev.to/pramod_boda/recommended-folder-structure-for-react-2025-48mc) -> react folder structure
17. [React naming convention](https://dev.to/kristiyanvelkov/react-js-naming-convention-lcg) -> React -> naming convention
18. [React convention](https://handsonreact.com/docs/code-organization-conventions) -> React -> conventions
19. [Opencode](https://opncd.ai/share/rTzW1bVu) -> opencode -> Implementing Admin UI Route Protection in React Admin Section
20. [Opencode](https://opncd.ai/share/8teadC9m) -> opencode -> meta fields into admin users filters
21. [Opencode](https://opncd.ai/share/Omh36HwA) -> opencode -> Implementing AdminAnalytics dashboard and data visualization
22. [Opencode](https://opncd.ai/share/88spxSrA) -> opencode -> readme

### Technologies & Frameworks

- **React 18**: Component-based UI with concurrent features
- **Recharts 3.6**: React-native data visualization library
- **Node.js + Express**: Backend API development framework
- **MongoDB**: Document-oriented database for flexible schema evolution
- **Docker**: Containerization for reproducible development environments
- **JWT**: Stateless authentication for secure session management

---
