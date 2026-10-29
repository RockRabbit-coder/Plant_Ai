export interface PredictionItem {
  class_idx: number;
  raw_label: string;
  crop: string;
  disease: string;
  display_name: string;
  is_healthy: boolean;
  confidence: number;
  confidence_ratio: number;
}

export interface VisualExplanation {
  heatmap_overlay_base64: string;
  heatmap_mask_base64: string;
  estimated_affected_area_pct: number;
  interpretation: string;
}

export interface QualityAssessment {
  width: number;
  height: number;
  blur_score: number;
  brightness: number;
  is_blurry: boolean;
  is_too_dark: boolean;
  is_too_bright: boolean;
  is_acceptable: boolean;
  quality_warnings: string[];
}

export interface ReferenceItem {
  title: string;
  url: string;
}

export interface DiseaseDetail {
  raw_label: string;
  crop: string;
  disease: string;
  scientific_name?: string;
  is_healthy: boolean;
  severity_level: string;
  description: string;
  symptoms: string[];
  causes: string;
  prevention: string[];
  management: string[];
  references: ReferenceItem[];
}

export interface AnalysisResponse {
  status: string;
  scan_id: string;
  image_url: string;
  primary_prediction: PredictionItem;
  alternative_predictions: PredictionItem[];
  is_uncertain: boolean;
  uncertainty_reasons: string[];
  entropy: number;
  quality: QualityAssessment;
  visual_explanation: VisualExplanation;
  disease_details: DiseaseDetail;
  model_version: string;
  timestamp: string;
}

export interface ScanListItem {
  id: string;
  image_url: string;
  heatmap_url?: string;
  crop: string;
  disease: string;
  is_healthy: boolean;
  confidence: number;
  severity_pct?: number;
  is_uncertain: boolean;
  created_at: string;
}

export interface PlantProfile {
  id: string;
  name: string;
  crop_species: string;
  variety?: string;
  field_identifier?: string;
  notes?: string;
  created_at: string;
  scans_count: number;
  scans: ScanListItem[];
}

export interface DiseaseRiskFactor {
  disease: string;
  crop: string;
  risk_level: 'Low' | 'Moderate' | 'High' | 'Critical';
  contributing_factors: string[];
  recommendation: string;
}

export interface WeatherRiskResponse {
  location: string;
  crop: string;
  temperature_c: number;
  humidity_pct: number;
  rainfall_mm: number;
  condition: string;
  source: string;
  disease_risks: DiseaseRiskFactor[];
  summary_guidance: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
  source_type: string;
  relevant_references: ReferenceItem[];
}

export interface DashboardStats {
  summary: {
    total_scans: number;
    healthy_scans: number;
    suspected_disease_scans: number;
    healthy_ratio_pct: number;
    total_plants_monitored: number;
    active_alerts_count: number;
  };
  crop_distribution: Array<{ name: string; scans: number }>;
  disease_distribution: Array<{ name: string; count: number }>;
  activity_timeline: Array<{ date: string; scans: number; healthy: number; diseased: number }>;
  recent_scans: Array<{
    id: string;
    crop: string;
    disease: string;
    is_healthy: boolean;
    confidence: number;
    created_at: string;
    image_url: string;
  }>;
}

export interface FarmField {
  id: string;
  name: string;
  crop_type: string;
  area_hectares: number;
  latitude?: number;
  longitude?: number;
  notes?: string;
  created_at: string;
}
