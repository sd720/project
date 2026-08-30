# Gold Loan Application & Data Collection Portal

A modern, full-stack web application designed for processing gold loan applications. Built with a Node.js/Express backend and a React (Vite) frontend.

## Features
- **Intake Portal**: Multi-step form to collect customer and gold details (gross/net weight, purity).
- **Dynamic Calculator**: Instantly computes pure gold weight and max eligible loan amount (75% LTV) based on real-time selections.
- **Form Validation**: Strict checks for net vs. gross weight, 10-digit mobile numbers, and missing fields.
- **Deduplication Check**: Rejects submissions if the same mobile number has applied within the last 7 days.
- **Admin Dashboard**: View all past collected leads with masked mobile numbers.
- **Zero-Config Local Dev**: Uses `mongodb-memory-server` to spin up an in-memory MongoDB database automatically on start. No external database setup required!

## Tech Stack
- **Frontend**: React (Vite), React Router, Lucide Icons, Vanilla CSS (Premium Design System)
- **Backend**: Node.js, Express, Mongoose, MongoDB (In-memory for local dev)

## How to Run Locally

1. **Install Dependencies**
   Run the following command in the root directory to install dependencies for the root, frontend, and backend simultaneously:
   ```bash
   npm run install:all
   ```
   *(Alternatively, run `npm install` in the root, `backend/`, and `frontend/` folders manually).*

2. **Start the Application**
   ```bash
   npm start
   ```
   This command uses `concurrently` to start both the Express backend (port 5000) and the Vite frontend (port 5173).

3. **Access the App**
   - **Intake Portal**: [http://localhost:5173/](http://localhost:5173/)
   - **Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)
   - **Backend API**: [http://localhost:5000/api/v1/loan-schemes](http://localhost:5000/api/v1/loan-schemes)
