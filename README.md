# PlantCare AI — Intelligent Plant Disease Detection Platform

> **Tagline:** Detect Plant Diseases with AI. Protect Every Leaf.  
> **Category:** Artificial Intelligence, Computer Vision, Smart Agriculture, Precision Farming.

---

## 1. Project Overview

**PlantCare AI** is a production-oriented web platform that enables farmers, agronomists, students, and gardening enthusiasts to upload or capture photographs of plant leaves and receive real-time, explainable AI diagnoses of plant diseases.

Unlike mockups or static prototypes, PlantCare AI executes **real deep learning convolutional neural network inference** on uploaded imagery, generates **Grad-CAM (Gradient-weighted Class Activation Mapping) visual attention heatmaps**, detects out-of-distribution uncertainty, and provides **evidence-based cultural sanitation and Integrated Pest Management (IPM) guidance** grounded in university extension research (UC Davis IPM, Cornell, FAO, Purdue).

---

## 2. Complete Features & Pages Implemented

| # | Page / Feature | Key Functionality |
|---|---|---|
| 1 | **Home Page** | Modern botanical UI, 10 sections: hero, methodology, supported crop catalog, multilingual banner, FAQ, CTA, and footer. |
| 2 | **Foliar Disease Scanner** | Drag-and-drop, camera trigger, preview, rotate/reset controls, file validation, Laplacian blur & resolution verification. |
| 3 | **AI Analysis Results** | Primary diagnosis, calibrated confidence score, healthy status, differential alternative diagnoses, clinical symptoms, and uncertainty alerts. |
| 4 | **Visual Symptom Analysis (Grad-CAM)** | Interactive attention heatmap overlay, opacity slider (0–100%), side-by-side mode, affected leaf area percentage estimate, and scientific XAI explanation. |
| 5 | **Disease Library** | Searchable agricultural catalog covering all 38 PlantVillage classes, filter by crop and health category, scientific pathogen names, and dossier links. |
| 6 | **Disease Dossier Pages** | Detailed pages with macroscopic symptoms, epidemiological triggers, sanitation steps, long-term prevention, and university citations. |
| 7 | **Smart Treatment & Prevention Guide** | Practical cultural actions, sanitation/leaf disposal, canopy airflow/watering protocols, and chemical pesticide advisories. |
| 8 | **PlantCare Agricultural Chatbot** | Conversational assistant with structured RAG fallback over verified agricultural literature + LLM API capability (Gemini/OpenAI). |
| 9 | **Multilingual Support (i18n)** | Full native translations for **English**, **Tamil (தமிழ்)**, **Hindi (हिन्दी)**, **Telugu (తెలుగు)**, and **Kannada (ಕನ್ನಡ)**. |
| 10 | **User Dashboard Analytics** | Summary cards, Recharts activity timeline (scans over time), healthy vs diseased ratio, and crop frequency distributions. |
| 11 | **Scan History** | Historical records, thumbnails, filter by crop, deletion controls with file cleanup, and PDF report downloads. |
| 12 | **Plant Profiles** | Track individual plants over time, plot associations, chronological side-by-side symptom progression. |
| 13 | **Weather & Disease Risk** | Microclimate risk model evaluating ambient temperature, humidity, and rainfall against epidemiological pathogen triggers. |
| 14 | **Farm Map & Monitoring** | Spatial plot registration, approximate coordinates, area in hectares, and field health monitoring with privacy protections. |
| 15 | **PDF Report Generator** | Publication-grade agricultural diagnosis reports generated both server-side via ReportLab and client-side via jsPDF. |
| 16 | **About, Privacy & Feedback** | Project mission, computer vision architecture, privacy policy, and user feedback submission with database persistence. |

---

## 3. Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Tooling:** Vite
- **Styling:** Tailwind CSS with custom agricultural color palette (Forest Green `#1b4332`, Leaf Green `#52b788`, Light Sage `#f3f7f4`, Charcoal `#1a1f1d`)
- **Icons:** Lucide React
- **Data Visualization:** Recharts
- **Internationalization:** i18next & react-i18next (en, ta, hi, te, kn)
- **PDF Export:** jsPDF & html2canvas

### Backend
- **Framework:** Python 3.11 with FastAPI
- **Validation:** Pydantic v2
- **Database:** SQLAlchemy 2.0 (AsyncIO) with SQLite (`aiosqlite`) default; PostgreSQL supported via `DATABASE_URL`
- **Server:** Uvicorn

### Artificial Intelligence & Computer Vision
- **Deep Learning Framework:** PyTorch & Torchvision
- **Architecture:** MobileNetV3-Small (38 PlantVillage classes)
- **Explainability (XAI):** Custom Grad-CAM hooked on final convolutional feature layer
- **Computer Vision:** OpenCV (headless) for Laplacian blur scoring, color conversions, and HSV leaf masking

---

## 4. Supported 38 PlantVillage Classes

1. **Apple**: Apple Scab, Black Rot, Cedar Apple Rust, Healthy
2. **Blueberry**: Healthy
3. **Cherry**: Powdery Mildew, Healthy
4. **Corn (Maize)**: Gray Leaf Spot, Common Rust, Northern Leaf Blight, Healthy
5. **Grape**: Black Rot, Esca (Black Measles), Leaf Blight (Isariopsis), Healthy
6. **Orange / Citrus**: Huanglongbing (Citrus Greening)
7. **Peach**: Bacterial Spot, Healthy
8. **Pepper (Bell)**: Bacterial Spot, Healthy
9. **Potato**: Early Blight, Late Blight, Healthy
10. **Raspberry**: Healthy
11. **Soybean**: Healthy
12. **Squash / Cucurbits**: Powdery Mildew
13. **Strawberry**: Leaf Scorch, Healthy
14. **Tomato**: Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Two-Spotted Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy

---

## 5. Prerequisites

- **Python:** Python 3.11+
- **Node.js:** v18+ (tested on v24.14.0)
- **npm:** v9+

---

## 6. Installation & Execution

### 1. Clone & Setup Backend
```powershell
# Open terminal in project root
cd "PlantCare AI website\backend"

# Create and activate Python 3.11 virtual environment
py -3.11 -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt greenlet pytest-asyncio
```

### 2. Start the Backend API Server
```powershell
# From the backend/ directory with venv activated:
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will start at `http://127.0.0.1:8000`.  
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/v1/health`

### 3. Setup & Start the Frontend
```powershell
# In a separate terminal, navigate to the frontend/ directory:
cd "PlantCare AI website\frontend"

# Install packages
npm install

# Start Vite development server
npm run dev
```
The web application will open at `http://localhost:5173`.

---

## 7. Running Tests

### Backend Tests (Pytest)
```powershell
cd "PlantCare AI website\backend"
.\venv\Scripts\python.exe -m pytest tests/
```
Output:
```
tests\test_api.py ....... [100%]
7 passed in 4.85s
```
Covers: health check, 38-class catalog retrieval, crop filtering, epidemiological weather risk calculation, conversational assistant, PyTorch image inference with Grad-CAM, invalid upload rejection, and dashboard analytics.

### Frontend Tests (Vitest)
```powershell
cd "PlantCare AI website\frontend"
npm test
```
Output:
```
 ✓ src/__tests__/App.test.tsx (2 tests)
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

### Frontend Production Build
```powershell
cd "PlantCare AI website\frontend"
npm run build
```
Builds verified assets to `frontend/dist/`.

---

## 8. Docker & Cloud Deployment

### Local Docker Deployment
Launch both backend and frontend in isolated containers:
```bash
docker-compose up --build
```
- Web Application: `http://localhost:5173`
- Backend API: `http://localhost:8000`

### Vercel Deployment (Frontend) + Cloud Backend
For instructions on deploying the React frontend to **Vercel** with global CDN and SPA routing, paired with a cloud backend (Render/Railway), refer to:
👉 [**Vercel Deployment Guide**](docs/VERCEL_DEPLOYMENT.md)

---

## 9. Model Training & Custom Datasets

A reproducible training and evaluation pipeline is located in `ml/`:
- **Training script:** `ml/scripts/train.py`
  ```bash
  python ml/scripts/train.py --data_dir ./ml/data/plantvillage --epochs 15 --batch_size 32 --lr 0.001
  ```
- **Evaluation script:** `ml/scripts/evaluate.py`
  ```bash
  python ml/scripts/evaluate.py --model ./ml/models/plantcare_mobilenetv3.pth
  ```

---

## 10. Environment Variables

Create a `.env` file in `backend/` based on `.env.example`:
```ini
PROJECT_NAME="PlantCare AI"
DATABASE_URL="sqlite+aiosqlite:///./plantcare.db"
MODEL_PATH="../ml/models/plantcare_mobilenetv3.pth"
CONFIDENCE_THRESHOLD=0.40
BLUR_THRESHOLD=40.0

# Optional External API Keys (Graceful fallbacks are built-in)
OPENWEATHER_API_KEY=""
GEMINI_API_KEY=""
OPENAI_API_KEY=""
```

---

## 11. Agronomic Limitations & Ethical Disclaimer

1. **Diagnostic Screening Aid:** Predictions represent statistical probabilities computed by deep learning vision models. They are designed to support scouting and must not replace laboratory culture or microscopic pathogen verification.
2. **Pesticide Stewardship:** PlantCare AI promotes Integrated Pest Management (IPM), cultural sanitation, and biological controls. Never apply regulated chemical pesticides solely on an AI prediction without consulting local agricultural university extension guidelines.
3. **Field Variance:** Model confidence may vary on complex outdoor photos containing multiple pathogens, high soil glare, or heavy shading. Uncertainty warnings are explicitly rendered when confidence is low.
