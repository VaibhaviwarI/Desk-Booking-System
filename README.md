# 🏢 DeskBook — Smart Desk Booking & Workspace Management System

A full-stack, enterprise-grade hot-desking solution built with **Node.js, Express, MongoDB, React, Tailwind CSS, and Redux Toolkit**. 

DeskBook automates office desk allocation through smart team clustering algorithms, enforces floor quotas, provides automated no-show processing via background cron jobs with atomic MongoDB transactions, and secures administrative operations with role-based middleware.

---

## 🌟 Key Features

### 1. Smart Desk Allocation Algorithm
- **Fixed Desk Priority**: Automatically guarantees allocation to users assigned permanent/fixed desks.
- **Team Centroid Clustering**: Positions teammates close to each other by computing the geometric centroid $(x, y)$ of existing team bookings and selecting the closest available desk by Euclidean distance.
- **Team Quota Per Floor**: Enforces maximum team limits per floor to promote balanced inter-departmental distribution.
- **Automated Waitlist Queue**: When a floor reaches full capacity, users are seamlessly added to a FIFO waitlist.

### 2. Atomic Concurrency & Transactions
- **MongoDB Replica Set Transactions**: Booking desk creation and floor occupancy increment/decrement are encapsulated in atomic sessions (`session.startTransaction()`) to prevent overselling.
- **Partial Unique Indexes**: Enforces uniqueness on `(desk, bookingDate, timeSlot)` and `(user, bookingDate, timeSlot)` only when `status: "BOOKED"`, allowing historical or cancelled records without collision.
- **Atomic No-Show Reassignment**: A background cron job runs periodically to mark no-show bookings as `EXPIRED` and atomically reallocates the desk to the earliest waitlisted employee in a single transaction.

### 3. Role-Based Access Control (RBAC)
- **Roles Supported**: `ADMIN` and `EMPLOYEE`.
- **JWT Protection Middleware**: Validates Bearer tokens and cookies.
- **Authorization Guard**: Restricts admin management routes (user role promotions, system ledger, floor & desk configuration) exclusively to administrators.

### 4. Modern, Responsive Frontend
- **Built With**: React 18, Vite, Tailwind CSS, and Redux Toolkit.
- **User Dashboard**: Real-time reservation stats, greeting cards, and quick actions.
- **Interactive Booking**: Floor cards with live occupancy meters, visual time slot selector (Full Day, Morning, Afternoon), and allocation guides.
- **Reservations & Waitlist**: Filterable booking ledger with one-click check-in and cancellation.
- **Admin Control Panel**: Real-time analytics, user role switcher, system-wide booking ledger, and floor capacity setup.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Node.js, Express 5, Mongoose 9, MongoDB Atlas |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt password hashing |
| **Scheduling** | Node-cron background jobs |
| **Frontend** | React 18, Vite, React Router v6 |
| **State Management** | Redux Toolkit (`createSlice`, `createAsyncThunk`) |
| **Styling** | Tailwind CSS, PostCSS, Autoprefixer |
| **HTTP Client** | Axios with request interceptor |

---

## 📂 Project Architecture

```
Desk-Booking-System/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── app/                # Redux Store configuration
│   │   ├── features/           # Redux slices (auth, bookings, waitlist, floors, admin)
│   │   ├── components/         # Reusable UI (Navbar, ProtectedRoute, BookingCard, StatCard)
│   │   ├── pages/              # Views (LoginPage, RegisterPage, Dashboard, BookDesk, etc.)
│   │   ├── utils/              # Axios instance with JWT interceptor
│   │   ├── App.jsx             # React Router routing & guards
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js          # Vite config with backend proxy
│
├── server/                     # Backend API & Server
│   ├── src/
│   │   ├── config/             # DB connection & environment configuration
│   │   ├── constants/          # Office & booking constants
│   │   ├── controllers/        # Request handlers (auth, booking, admin, floor, etc.)
│   │   ├── jobs/               # Background no-show transaction cron job
│   │   ├── middleware/         # JWT verification & role-based authorize middleware
│   │   ├── models/             # Mongoose schemas (User, Booking, Desk, Floor, Team, Waitlist)
│   │   ├── routes/             # Express API routes
│   │   ├── scripts/            # Database seeding scripts (admin & 10 floors)
│   │   ├── utils/              # Euclidean distance, token generation, error helpers
│   │   ├── app.js              # Express app setup & middleware pipeline
│   │   └── server.js           # Server bootstrap & port listener
│   ├── .env                    # Environment variables
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance or MongoDB Atlas cluster connection string

---

### 1. Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `server/.env`:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```

4. **Seed Database** (Creates default Admin user and 10 office floors with active desks):
   ```bash
   node src/scripts/seedAdminAndFloors.js
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Backend will run on `http://localhost:3000`.*

---

### 2. Frontend Setup

1. Open a second terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   *Frontend will run on `http://localhost:5173`.*

---

## 🔑 Default Credentials

A pre-configured Administrator account is ready for use:

- **Username / Email**: `admin` *(or `admin@deskbook.com`)*
- **Password**: `admin123`
- **Role**: `ADMIN`

*Note: New sign-ups via the registration page default to `EMPLOYEE` access. Only an Administrator can promote an account to `ADMIN` from the Admin Portal.*

---

## 📡 API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new employee account
- `POST /api/auth/login` — Sign in with email/username and password
- `GET /api/auth/me` — Retrieve authenticated user profile *(Protected)*

### Desk Booking (`/api/bookings`)
- `POST /api/bookings/book` — Reserve a desk (handles team clustering & waitlist fallback)
- `GET /api/bookings/my-bookings` — Fetch all bookings for logged-in user
- `PATCH /api/bookings/:bookingId/check-in` — Check in to an active reservation
- `PATCH /api/bookings/:bookingId/cancel` — Cancel an upcoming reservation

### Waitlist (`/api/waitlist`)
- `GET /api/waitlist/my-waitlist` — Fetch user's waitlist entries
- `PATCH /api/waitlist/:waitlistId/cancel` — Leave the waitlist

### Floors & Desks (`/api/floors`, `/api/desks`)
- `GET /api/floors` — Get all floors and current occupancies *(Protected)*
- `POST /api/floors` — Create a new floor *(Admin only)*
- `GET /api/desks` — List desks (filterable by `floorId`) *(Protected)*
- `POST /api/desks` — Add desks to floor *(Admin only)*

### Admin Management (`/api/admin`)
- `GET /api/admin/stats` — Overall system analytics *(Admin only)*
- `GET /api/admin/users` — List registered users *(Admin only)*
- `PATCH /api/admin/users/:userId` — Update user roles/teams *(Admin only)*
- `GET /api/admin/bookings` — Master bookings ledger *(Admin only)*

---

## 💡 Interview Talking Points & Architecture Highlights

1. **Why separate `app.js` and `server.js`?**
   - Enables clean unit/integration testing with tools like Supertest without spinning up a live HTTP server or network port.
   - Decouples Express middleware/routing configuration from environment bootstrapping (DB connection, cron initialization, port binding).

2. **Why MongoDB Transactions for Booking & No-Show?**
   - Eliminates race conditions (double bookings).
   - Guarantees that updating floor occupancy counts and creating the reservation record succeed or fail together atomically.
   - In no-show expiration, atomically marks the expired booking and promotes the oldest waitlisted user in one database transaction.

3. **Why Partial Unique Indexes?**
   - A traditional unique compound index on `(desk, bookingDate, timeSlot)` blocks reassignment if a previous booking for that slot was cancelled or expired.
   - Partial indexing with `{ partialFilterExpression: { status: "BOOKED" } }` ensures only active bookings are constrained by uniqueness.

4. **Why `Booking.find().populate()` over `countDocuments().populate()` for Team Quota?**
   - Mongoose does not populate documents during a `countDocuments()` query.
   - We query active bookings on that floor/date and populate the `user` reference with a `{ team: req.user.team }` match condition, then count populated records accurately in memory.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
