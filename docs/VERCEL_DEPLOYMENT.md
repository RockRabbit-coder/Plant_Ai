# Deploying PlantCare AI to Vercel

This guide outlines how to host **PlantCare AI** with Vercel for the frontend and a container web service for the AI backend.

---

## 1. Architectural Overview

| Tier | Component | Recommended Host | Why? |
|---|---|---|---|
| **Frontend** | React 18 + Vite + TypeScript + Tailwind | **Vercel** | Lightning-fast Edge CDN, global SSL, instant SPA routing, zero-config Vite deployments. |
| **Backend & AI** | FastAPI + PyTorch MobileNetV3 + OpenCV | **Render** / **Railway** / **Fly.io** | PyTorch and OpenCV require ~1.5 GB memory and persistent model execution that exceed Vercel's 50MB/250MB serverless bundle limits. |

---

## 2. Step-by-Step Deployment

### Step A: Push Code to GitHub

1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "feat: prepare PlantCare AI for Vercel deployment"
   ```
2. Create a new repository on [GitHub](https://github.com) and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

---

### Step B: Deploy Backend (Render / Railway)

#### Option 1: Render (Recommended, Free / Easy)
1. Sign in to [Render](https://render.com).
2. Click **New +** > **Web Service**.
3. Select your GitHub repository.
4. Render will automatically detect `render.yaml` or you can configure manually:
   - **Environment:** `Python`
   - **Build Command:** `pip install -r backend/requirements.txt greenlet`
   - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables:**
     - `PYTHON_VERSION`: `3.11.9`
     - `MODEL_PATH`: `../ml/models/plantcare_mobilenetv3.pth`
5. Click **Create Web Service**. Once deployed, copy your backend URL (e.g., `https://plantcare-api.onrender.com`).

#### Option 2: Railway
1. Sign in to [Railway](https://railway.app).
2. Click **New Project** > **Deploy from GitHub repo**.
3. Under Settings > General, set root directory to `.` or use the Dockerfile.
4. Copy your generated public domain URL.

---

### Step C: Deploy Frontend to Vercel

#### Method 1: Via Vercel Web Dashboard (Easiest)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** > **Project**.
2. Select your GitHub repository.
3. Configure Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click edit and choose `frontend` (or leave as root, as `vercel.json` is configured for both).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand **Environment Variables**:
   - Add `VITE_API_URL` = `https://your-backend-api.onrender.com` (your backend URL from Step B).
5. Click **Deploy**.

#### Method 2: Via Vercel CLI
From your terminal:
```bash
# Install Vercel CLI globally if not already installed
npm install -g vercel

# Navigate to frontend and deploy
cd frontend
vercel
```
When prompted:
- Set up and deploy: **Yes**
- Which scope: Select your account
- Link to existing project: **No**
- Project name: `plantcare-ai`
- In which directory is your code located: `./`
- Want to modify settings: **No** (Vercel will detect Vite and `vercel.json` automatically)

To deploy to production:
```bash
vercel --prod
```

---

## 3. Seamless Proxy Option (Zero-CORS)

If you prefer your frontend domain to proxy all requests directly without exposing backend URLs to the client:

In `frontend/vercel.json`, update the `rewrites` section:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-api.onrender.com/api/:path*"
    },
    {
      "source": "/uploads/:path*",
      "destination": "https://your-backend-api.onrender.com/uploads/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
With this configuration, all `/api/v1/...` and `/uploads/...` calls stay on your Vercel domain and are transparently proxied to the backend at the edge.

---

## 4. Verification Checklist

- [ ] Visit `https://<your-project>.vercel.app`
- [ ] Direct routing works without 404 (e.g. refresh on `/library` or `/detect`)
- [ ] Scan sample image on `/detect`
- [ ] Grad-CAM visual heatmap generates and renders
- [ ] PDF report download functions properly
