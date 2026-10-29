import {
  AnalysisResponse,
  DiseaseDetail,
  ScanListItem,
  PlantProfile,
  WeatherRiskResponse,
  ChatResponse,
  ChatMessage,
  DashboardStats,
  FarmField
} from '../types';

const BACKEND_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = `${BACKEND_BASE}/api/v1`;

export function resolveMediaUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  return `${BACKEND_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function getScanPdfUrl(scanId: string): string {
  return `${API_BASE}/scans/${scanId}/pdf`;
}

export async function analyzeImage(file: File, plantId?: string): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (plantId) {
    formData.append('plant_id', plantId);
  }

  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(errorData.detail || 'Inference failed');
  }

  return res.json();
}

export async function getDiseases(params?: { crop?: string; healthy_only?: boolean; search?: string }): Promise<any[]> {
  const baseOrigin = BACKEND_BASE || window.location.origin;
  const url = new URL(`${API_BASE}/diseases`, baseOrigin);
  if (params?.crop) url.searchParams.append('crop', params.crop);
  if (params?.healthy_only !== undefined) url.searchParams.append('healthy_only', String(params.healthy_only));
  if (params?.search) url.searchParams.append('search', params.search);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to load disease library');
  return res.json();
}

export async function getDiseaseDetail(rawLabel: string): Promise<DiseaseDetail> {
  const res = await fetch(`${API_BASE}/diseases/${encodeURIComponent(rawLabel)}`);
  if (!res.ok) throw new Error('Disease dossier not found');
  return res.json();
}

export async function getScans(crop?: string): Promise<ScanListItem[]> {
  const baseOrigin = BACKEND_BASE || window.location.origin;
  const url = new URL(`${API_BASE}/scans`, baseOrigin);
  if (crop) url.searchParams.append('crop', crop);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to load scan history');
  return res.json();
}

export async function getScanDetail(scanId: string): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/scans/${scanId}`);
  if (!res.ok) throw new Error('Scan not found');
  return res.json();
}

export async function deleteScan(scanId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/scans/${scanId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete scan');
}

export async function getPlants(): Promise<PlantProfile[]> {
  const res = await fetch(`${API_BASE}/plants`);
  if (!res.ok) throw new Error('Failed to load plant profiles');
  return res.json();
}

export async function getPlantDetail(plantId: string): Promise<PlantProfile> {
  const res = await fetch(`${API_BASE}/plants/${plantId}`);
  if (!res.ok) throw new Error('Plant profile not found');
  return res.json();
}

export async function createPlant(data: {
  name: string;
  crop_species: string;
  variety?: string;
  field_identifier?: string;
  notes?: string;
}): Promise<PlantProfile> {
  const res = await fetch(`${API_BASE}/plants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create plant profile');
  return res.json();
}

export async function deletePlant(plantId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/plants/${plantId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete plant profile');
}

export async function getWeatherRisk(location: string = 'California Central Valley', crop: string = 'All'): Promise<WeatherRiskResponse> {
  const baseOrigin = BACKEND_BASE || window.location.origin;
  const url = new URL(`${API_BASE}/weather-risk`, baseOrigin);
  url.searchParams.append('location', location);
  url.searchParams.append('crop', crop);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to load weather risk evaluation');
  return res.json();
}

export async function sendChatMessage(
  message: string,
  language: string = 'en',
  currentScanId?: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      language,
      current_scan_id: currentScanId,
      history,
    }),
  });

  if (!res.ok) throw new Error('Chat assistant error');
  return res.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to load dashboard statistics');
  return res.json();
}

export async function getFarmFields(): Promise<FarmField[]> {
  const res = await fetch(`${API_BASE}/farms`);
  if (!res.ok) throw new Error('Failed to load farm fields');
  return res.json();
}

export async function createFarmField(data: {
  name: string;
  crop_type: string;
  area_hectares: number;
  latitude?: number;
  longitude?: number;
  notes?: string;
}): Promise<FarmField> {
  const res = await fetch(`${API_BASE}/farms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to register farm field');
  return res.json();
}

export async function submitFeedback(data: {
  scan_id?: string;
  category: string;
  description: string;
  rating?: number;
  contact_email?: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
}

export async function getHealth(): Promise<any> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('System health check failed');
  return res.json();
}
