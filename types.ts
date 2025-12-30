export enum Sex {
  MALE = "Male",
  FEMALE = "Female"
}

export enum CadasilStage {
  STAGE_0 = "Stage 0: Premanifest (Genetic Predisposition)",
  STAGE_1A = "Stage 1A: Low WMH burden (Fazekas 1)",
  STAGE_1B = "Stage 1B: High WMH burden (Fazekas ≥2)",
  STAGE_2A = "Stage 2A: Low Lacune burden (count 1-4)",
  STAGE_2B = "Stage 2B: High Lacune burden (count ≥5)",
  STAGE_3A = "Stage 3A: Moderate Disability (mRS 3)",
  STAGE_3B = "Stage 3B: Mod. Severe Disability (mRS 4)",
  STAGE_4A = "Stage 4A: Severe Disability (mRS 5)"
}

export interface SurvivalDataPoint {
  year: number;
  age: number;
  survivalProbability: number; // 0 to 100
}

export interface ProgressionMarker {
  year: number;
  age: number;
  label: string;
  survivalProbability: number;
}

export interface ModelResult {
  meanExpectancy: number;
  medianSurvival: number;
  data: SurvivalDataPoint[];
  yearsTo50Percent: number;
  progressionMarkers: ProgressionMarker[];
}