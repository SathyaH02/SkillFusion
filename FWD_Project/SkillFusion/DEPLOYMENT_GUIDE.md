# SkillFusion Deployment Guide

This guide will walk you through deploying your SkillFusion application to **Render.com** as a single web service. This approach is free and easiest for MERN stack applications.

## Prerequisites

1.  **GitHub Account**: You need to have your code pushed to a GitHub repository.
2.  **Render Account**: Sign up at [render.com](https://render.com).
3.  **MongoDB Atlas URI**: You should have your production database connection string ready (from MongoDB Atlas).

## Step 1: Push to GitHub

Ensure your latest changes (including the new `server.js` and `package.json` modifications) are committed and pushed to GitHub.

## Step 2: Create a Web Service on Render

1.  Log in to the Render Dashboard.
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub account and select your `SkillFusion` repository.

## Step 3: Configure the Service

Fill in the details as follows:

*   **Name**: `skillfusion-app` (or any unique name)
*   **Region**: Closest to you (e.g., Singapore)
*   **Branch**: `main` (or your working branch)
*   **Root Directory**: Leave empty (defaults to root)
*   **Runtime**: **Node**
*   **Build Command**: `npm run build`
    *   *Note: This runs the script we added to your package.json, which installs dependencies for both server and client and builds the React app.*
*   **Start Command**: `npm start`
    *   *Note: This runs `node server.js`.*

## Step 4: Environment Variables

Scroll down to the **Environment Variables** section and click **Add Environment Variable**. Add the following:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `MONGO_URI` | Your MongoDB connection string (e.g., `mongodb+srv://user:pass@cluster...`) |
| `JWT_SECRET` | A long, random string for security |

## Step 5: Deploy

Click **Create Web Service**.

Render will start building your application. You can watch the logs.
1.  It will clone your repo.
2.  Run `npm run build` (installing all dependencies and building the React frontend).
3.  Run `npm start`.

Once it says **Live**, click the URL provided at the top (e.g., `https://skillfusion-app.onrender.com`). Your app is now online!

## Troubleshooting

-   **Build Failures**: Check the logs. If it says "command not found", ensure `npm run build` is correct.
-   **White Screen**: Open the browser console. If you see 404s for .js/.css files, check if `server.js` is correctly serving `client/dist`.
-   **Database Error**: Check your `MONGO_URI` in the Environment Variables. Ensure your IP Access List in MongoDB Atlas allows access from anywhere (`0.0.0.0/0`) since Render IPs change.

---

**Note**: Since we configured `server.js` to serve the `client/dist` folder, you do NOT need a separate static site host for the frontend. Both backend and frontend run on the same Render service.
