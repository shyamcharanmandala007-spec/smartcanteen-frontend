# 🍱 SmartCanteen – Online Food Pre-Ordering and Queue Management System

A full-stack, enterprise-grade web application built according to the **SmartCanteen Flowchart Architecture & Specification**.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Modular CSS Design System, Web Audio API |
| **Backend** | Java 17, Spring Boot 3, Spring MVC, REST APIs |
| **Security** | Spring Security 6, JWT (JSON Web Tokens) Bearer Authentication |
| **Data & ORM** | Spring Data JPA, Hibernate, MySQL 8.0 |

---

## 📁 Project Directory Structure

```
smart-canteen/
├── backend/                       # ☕ Spring Boot Java Application
│   ├── pom.xml                    # Maven configuration (Spring Boot, Security, JPA, JWT, MySQL)
│   └── src/
│       ├── main/resources/        # application.properties (MySQL & JWT configs)
│       └── main/java/com/smartcanteen/
│           ├── SmartCanteenApplication.java
│           ├── config/            # DataInitializer (auto-seeds accounts & dishes)
│           ├── controller/        # Auth, Menu, Order, Admin, Feedback REST controllers
│           ├── dto/               # Request/Response DTO models
│           ├── entity/            # User, Role, MenuItem, Order, OrderItem, Feedback entities
│           ├── repository/        # Spring Data JPA interfaces
│           ├── security/          # JWT Util, JwtAuthenticationFilter, SecurityConfig
│           └── service/           # Business logic, token generation, wallet deduction
│
├── frontend/                      # ⚛️ React.js Application
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                # Main coordinator, Web Audio synthesizer
│       ├── index.css              # Custom dark-mode glassmorphic design system
│       ├── services/api.js        # REST client with automatic JWT token attachment
│       └── components/            # Navbar, MenuSection, CartDrawer, OrderTrackerModal, AdminDashboard, AuthModal, FeedbackModal
│
├── assets/                        # 📊 System Flowchart Diagram (PNG & PDF)
├── run-frontend.bat               # 🚀 1-Click React Frontend Launcher
├── run-backend.bat                # 🚀 1-Click Spring Boot Backend Launcher
└── legacy-prototype/              # 📦 Archived static vanilla HTML/CSS mockup
```

---

## 🚀 How to Run the Application

### Option 1: 1-Click Launchers (Windows)
- Double-click **`run-frontend.bat`** to launch the React development server on `http://localhost:5173`.
- Double-click **`run-backend.bat`** to launch the Spring Boot REST API server on `http://localhost:8080`.

### Option 2: Terminal Commands

#### 1. Backend (Spring Boot):
```powershell
cd backend
mvn spring-boot:run
```

#### 2. Frontend (React):
```powershell
cd frontend
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## 🔑 Test Credentials
| Role | Email | Password | Pre-loaded Features |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campus.edu` | `student123` | ₹350 Campus Wallet, Pre-Order, Live Token Stepper |
| **Admin** | `admin@canteen.edu` | `admin123` | Kitchen KDS Kanban Queue, Menu CRUD, KPI Dashboard |
