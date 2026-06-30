export interface VisualAnalysis {
  detected_elements: string[];
  hazard_level: string;
  approximate_dimensions: string;
}

export interface ContextualClues {
  landmarks: string[];
  ocr_text: string;
  weather_condition: string;
}

export interface MunicipalityDispatchPayload {
  priority_code: string;
  department: string;
  remediation_instructions: string;
}

export interface AgenticActions {
  municipality_dispatch_payload: MunicipalityDispatchPayload;
  community_verification_prompt: string;
}

export interface Gamification {
  xp_rewarded: number;
  badge_unlocked: string;
}

export interface CivicReportAnalysis {
  issue_verified: boolean;
  confidence_score: number;
  category: string;
  subcategory: string;
  severity: string;
  estimated_impact_radius_meters: number;
  visual_analysis: VisualAnalysis;
  contextual_clues: ContextualClues;
  agentic_actions: AgenticActions;
  gamification: Gamification;
}

export interface CivicReport {
  id: string;
  title: string;
  description: string;
  imageUrl?: string; // base64 encoded string
  mediaType?: string; // e.g. "image/png"
  createdAt: string;
  status: "Reported" | "Analyzing" | "Verified" | "Dispatched" | "Resolved";
  latitude: number;
  longitude: number;
  analysis?: CivicReportAnalysis;
  upvotes: number;
}
