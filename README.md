# Crowdfunding Platform

## Overview

Crowdfunding Platform is a community-driven fundraising application that allows creators to launch campaigns and supporters to fund them securely.

- **Frontend:** React + TailwindCSS
- **Backend:** NestJS + MongoDB (Mongoose)
- **Payment Integration:** VNPAY

## Features

### Campaign Management

- Create, edit, and delete campaigns
- Define funding goals, deadlines, cover images, and perks
- Track progress (total raised, goal completion %, number of backers)

### Funding

- Supporters choose a custom amount or predefined perks
- Secure payment via VNPAY
- Automatic transaction status updates through VNPAY IPN

### User Management

- Register/Login with email and password
- Manage profile and contribution history
- Creator dashboard to manage campaigns

### Administration

- Approve or remove campaigns
- Monitor transactions
- Handle violation reports

## System Architecture

### Frontend (React)

- Single Page Application with React Router
- Data fetching via RESTful APIs from backend
- Payment flow: create funding → redirect to VNPAY → return & confirmation

### Backend (NestJS + MongoDB)

- JWT authentication and authorization
- RESTful APIs for users, campaigns, fundings, and payments
- VNPAY integration (generate payment URL, handle return URL, IPN verification)

### Database (MongoDB)

Collections:

- `users`
- `campaigns`
- `fundings`
- `perks`

## VNPAY Payment Flow

1. Supporter selects amount or perk
2. Backend creates a funding record with status **pending**
3. Backend generates VNPAY URL → frontend redirects user
4. After payment:
   - VNPAY redirects user to **Return URL** (frontend feedback)
   - VNPAY calls **IPN URL** (backend server-to-server confirmation)
5. Backend verifies signature and updates funding status to **paid** or **failed**

## Installation

### Prerequisites

- Node.js >= 18
- MongoDB >= 6
- VNPAY merchant account (TMN Code, Hash Secret, Return URL, IPN URL)

### Setup

1. Clone the repository
2. Configure environment variables for backend and frontend
3. Install dependencies for both frontend and backend
4. Start backend (NestJS)
5. Start frontend (React)

## Environment Variables

### Backend (`.env`)

| Variable          | Description                                 |
| ----------------- | ------------------------------------------- |
| NODE_ENV          | Environment (`development` or `production`) |
| PORT              | Backend server port                         |
| MONGO_URI         | MongoDB connection string                   |
| JWT_SECRET        | Secret key for JWT authentication           |
| JWT_EXPIRES       | Expiration time for JWT (e.g., `7d`)        |
| VNPAY_TMN_CODE    | Merchant terminal code from VNPAY           |
| VNPAY_HASH_SECRET | Hash secret key from VNPAY                  |
| VNPAY_PAYMENT_URL | VNPAY payment gateway URL                   |
| VNPAY_RETURN_URL  | Return URL after payment                    |
| VNPAY_IPN_URL     | IPN (Instant Payment Notification) endpoint |
| VNPAY_LOCALE      | Locale setting (e.g., `vn`)                 |
| VNPAY_CURRENCY    | Currency code (e.g., `VND`)                 |

### Frontend (`.env`)

| Variable          | Description          |
| ----------------- | -------------------- |
| VITE_API_BASE_URL | Backend API base URL |

## Development Workflow

- **Frontend:**
  ```bash
  cd frontend

  cd client
  cd server\api_crowdfunding

  npm install
  npm run dev
  ```
