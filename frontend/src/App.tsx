import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { DetectPage } from './pages/DetectPage';
import { ResultsPage } from './pages/ResultsPage';
import { VisualAnalysisPage } from './pages/VisualAnalysisPage';
import { DiseaseLibraryPage } from './pages/DiseaseLibraryPage';
import { DiseaseDetailPage } from './pages/DiseaseDetailPage';
import { TreatmentGuidePage } from './pages/TreatmentGuidePage';
import { ChatbotPage } from './pages/ChatbotPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScanHistoryPage } from './pages/ScanHistoryPage';
import { PlantProfilesPage } from './pages/PlantProfilesPage';
import { WeatherRiskPage } from './pages/WeatherRiskPage';
import { FarmMonitoringPage } from './pages/FarmMonitoringPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col text-slate-100 selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
        {/* Subtle Background Glow Spheres */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none -z-10" />
        <div className="fixed top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/8 blur-[140px] pointer-events-none -z-10" />
        <div className="fixed bottom-[-10%] left-[25%] w-[650px] h-[650px] rounded-full bg-violet-600/6 blur-[150px] pointer-events-none -z-10" />

        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/detect" element={<DetectPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/visual-analysis" element={<VisualAnalysisPage />} />
            <Route path="/library" element={<DiseaseLibraryPage />} />
            <Route path="/library/:rawLabel" element={<DiseaseDetailPage />} />
            <Route path="/guide" element={<TreatmentGuidePage />} />
            <Route path="/assistant" element={<ChatbotPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<ScanHistoryPage />} />
            <Route path="/plants" element={<PlantProfilesPage />} />
            <Route path="/weather" element={<WeatherRiskPage />} />
            <Route path="/farms" element={<FarmMonitoringPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
