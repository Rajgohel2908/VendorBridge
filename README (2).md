<div align="center">

# 🏢 VendorBridge

**A full-stack Procurement Management Platform**  
RFQ lifecycle · Vendor quotations · Approval workflows · Purchase orders · Invoice generation

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

</div>

---

## 👥 Team Members

| # | Name | Email |
|---|------|-------|
| 1 | **Raj Gohel** *(Lead)* | rajgohel2908@gmail.com |
| 2 | Aniket Rathod | rathodaniket907@gmail.com |
| 3 | Rudra Patel | rudrarp2006@gmail.com |

---

## ✨ Features

- 🔐 **Role-Based Access Control** — Four distinct roles: Admin, Procurement Officer, Manager, and Vendor, each with scoped access and permissions
- 📋 **RFQ Management** — Create, assign, and track Requests for Quotation with file attachment support
- 💬 **Vendor Quotations** — Vendors submit and revise proposals; procurement officers compare them side-by-side
- ✅ **Approval Workflow** — Procurement officers submit quotations for manager review; managers approve or reject with remarks
- 📦 **Purchase Order Generation** — Auto-generated POs upon approval with GST calculation (18%)
- 🧾 **Invoice Pipeline** — Auto-generated invoices linked to POs; downloadable as PDF via `@react-pdf/renderer`
- 📊 **Reports & Analytics** — Monthly spend trends, vendor performance charts, and exportable CSV reports
- 🔔 **Activity Logs** — Full audit trail of all procurement actions with filtering and pagination
- 👤 **Admin Panel** — User management with role assignment and account activation/deactivation

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) | SPA framework with fast HMR dev server |
| [React Router v6](https://reactrouter.com/) | Client-side routing with protected and role-guarded routes |
| [TanStack Query v5](https://tanstack.com/query) | Server state management, caching, and mutations |
| [Zustand](https://zustand-demo.pmnd.rs/) | Lightweight global state (auth, notifications) |
| [React Hook Form](https://react-hook-form.com/) | Performant form handling with validation |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling with custom brand design tokens |
| [@react-pdf/renderer](https://react-pdf.org/) | Client-side invoice PDF generation and download |
| [Recharts](https://recharts.org/) | Responsive charts for spend trends and vendor analytics |
| [Lucide React](https://lucide.dev/) | Clean, consistent icon set |
| [Axios](https://axios-http.com/) | HTTP client with JWT interceptor |

### Backend

| Technology | Purpose |
|------------|---------|
| [Express.js 4](https://expressjs.com/) | RESTful API server |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Document-based data modeling |
| [JWT](https://jwt.io/) + Secure Cookies | Stateless authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [Multer](https://github.com/expressjs/multer) | File upload handling for RFQ attachments |
| [AWS S3 SDK](https://aws.amazon.com/sdk-for-javascript/) | Cloud file storage (optional) |
| [Nodemailer](https://nodemailer.com/) | Invoice email delivery |
| [express-validator](https://express-validator.github.io/) | Request validation middleware |
| [Nodemon](https://nodemon.io/) | Dev server with hot reload |

---

## 🔑 User Roles

| Role | Key Capabilities |
|------|-----------------|
| **ADMIN** | Manage vendors, manage users, view reports and analytics |
| **PROCUREMENT_OFFICER** | Create RFQs, compare quotations, submit for approval, generate POs and invoices |
| **MANAGER** | Review and approve or reject quotations, monitor procurement workflows |
| **VENDOR** | View assigned RFQs, submit and revise quotations, view own POs |

---

## 📁 Project Structure

```
VendorBridge/
├── backend/
│   └── src/
│       ├── config/            # DB and S3 configuration
│       ├── controllers/       # Route handler logic
│       ├── middleware/        # Auth, role guard, error handler, file upload
│       ├── models/            # Mongoose schemas
│       ├── routes/            # Express route definitions
│       ├── utils/             # Helpers (activity logger, email, PO/invoice number gen)
│       ├── validators/        # express-validator rule sets
│       ├── seed.js            # Database seeder with demo data
│       └── server.js          # Entry point
└── frontend/
    └── src/
        ├── components/        # Reusable UI components (layout, forms, charts, PDF)
        ├── hooks/             # TanStack Query data hooks per resource
        ├── pages/             # Route-level page components
        ├── services/          # Axios API service modules
        ├── store/             # Zustand global store
        └── utils/             # Formatters and role guard utility
```

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18.17 or higher
- **MongoDB** instance — Local or [Atlas](https://www.mongodb.com/cloud/atlas)
- **SMTP credentials** (optional, for invoice email delivery)
- **AWS S3** credentials (optional, for file storage)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/rajgohel2908/vendorbridge.git
cd vendorbridge
```

### 2. Install All Dependencies

```bash
npm run install:all
```

Or install manually:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment Variables

Create a `backend/.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PORT=5000

# Optional: Email (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@vendorbridge.com

# Optional: AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

---

## ▶️ Running the App

### Development (both servers concurrently)

```bash
npm run dev
```

This starts the backend at `http://localhost:5000` and the frontend at `http://localhost:5173`.

### Seed Demo Data

```bash
npm run seed
```

### Production Build

```bash
cd frontend && npm run build
cd ../backend && npm start
```

---

## 🔌 API Endpoints

| Module | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Auth | `POST` | `/api/auth/login` | Authenticate and receive JWT |
| Auth | `POST` | `/api/auth/register` | Register a new user |
| Auth | `POST` | `/api/auth/forgot-password` | Trigger password reset email |
| Vendors | `GET` | `/api/vendors` | List all vendors |
| Vendors | `POST` | `/api/vendors` | Create a new vendor |
| RFQ | `GET` | `/api/rfq` | List RFQs (role-scoped) |
| RFQ | `POST` | `/api/rfq` | Create a new RFQ |
| RFQ | `GET` | `/api/rfq/:id/quotations` | List quotations for an RFQ |
| Quotations | `GET` | `/api/quotations` | List quotations (role-scoped) |
| Quotations | `POST` | `/api/quotations` | Submit a new quotation |
| Approvals | `GET` | `/api/approvals` | List approval requests |
| Approvals | `POST` | `/api/approvals` | Submit quotation for approval |
| Approvals | `PUT` | `/api/approvals/:id` | Approve or reject a quotation |
| Purchase Orders | `GET` | `/api/purchase-orders` | List purchase orders |
| Purchase Orders | `POST` | `/api/purchase-orders` | Generate a purchase order |
| Invoices | `GET` | `/api/invoices` | List invoices |
| Invoices | `POST` | `/api/invoices` | Generate an invoice |
| Invoices | `POST` | `/api/invoices/:id/email` | Send invoice via email |
| Reports | `GET` | `/api/reports` | Procurement analytics summary |
| Activity | `GET` | `/api/activity` | Paginated activity log |
| Admin | `GET` | `/api/admin/users` | List all users |
| Admin | `PATCH` | `/api/admin/users/:id` | Update user role or status |

---

## 👤 Demo Accounts

All demo accounts use the password: `password123`

| Role | Email |
|------|-------|
| Admin | aarav@vendorbridge.test |
| Procurement Officer | priya@vendorbridge.test |
| Manager | karan@vendorbridge.test |
| Vendor (Acme) | vendor@acme.test |

> The app works without MongoDB — demo accounts are hardcoded and bypass the database. Connect a MongoDB instance and run `npm run seed` to populate full demo data.

---

## 📄 License

This project is built for academic and demonstration purposes.  
© 2025 VendorBridge Team — Raj Gohel, Aniket Rathod, Rudra Patel.
