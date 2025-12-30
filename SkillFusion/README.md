# SkillFusion

A detailed mentorship and skill swapping web application.

## Tech Stack
- **Frontend**: React (Vite)
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Prerequisites
- Node.js installed.
- MongoDB installed and running on `mongodb://127.0.0.1:27017`.

## Installation

1. **Backend Setup**
   ```bash
   npm install
   ```

2. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```

## Running the App

1. **Start Backend**
   From the root and run:
   ```bash
   npm start
   # or
   node server.js
   ```
   Server runs on http://localhost:5000.

2. **Start Frontend**
   Open a new terminal, navigate to `client`, and run:
   ```bash
   cd client
   npm run dev
   ```
   Client runs on http://localhost:5173.

## Features
- **Student Dashboard**: View progress, completed courses, and request mentors.
- **Mentor Dashboard**: Accept requests and update student progress.
- **Progress Tracking**: Real-time progress updates.
- **Completion**: Automatic course completion when progress reaches 100%.
