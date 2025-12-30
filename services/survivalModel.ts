import { CadasilStage, Sex, ModelResult, SurvivalDataPoint, ProgressionMarker } from '../types';

// Data inferred from JAMA Neurol. 2024 "Life Expectancy in CADASIL"
// and NOTCH3-SVD staging system.
// Median survival ages: Men ~64.6y, Women ~69.3y.

const GOMPERTZ_PARAMS = {
  [Sex.MALE]: { A: 0.00008, B: 0.105 }, 
  [Sex.FEMALE]: { A: 0.000045, B: 0.108 } 
};

// Hazard Ratios for NOTCH3-SVD Staging
// Stage 0: Asymptomatic carrier (Risk slightly above gen pop due to vascular fragility)
// Stage 1 (MRI Changes - WMH): Mild risk increase
// Stage 2 (MRI Changes - Lacunes): Moderate risk, indicates small vessel infarcts
// Stage 3 (Clinical Disability mRS 3-4): Significant mortality risk
// Stage 4 (End Stage mRS 5): High mortality risk
const HAZARD_RATIOS: Record<CadasilStage, number> = {
  [CadasilStage.STAGE_0]: 1.0,    // Baseline CADASIL risk
  [CadasilStage.STAGE_1A]: 1.1,   // Early WMH
  [CadasilStage.STAGE_1B]: 1.25,  // Extensive WMH
  [CadasilStage.STAGE_2A]: 1.5,   // Few Lacunes (First strokes often happen here)
  [CadasilStage.STAGE_2B]: 1.9,   // Multiple Lacunes
  [CadasilStage.STAGE_3A]: 2.8,   // Moderate Disability (Needs help)
  [CadasilStage.STAGE_3B]: 4.2,   // Severe Disability (Non-ambulatory often)
  [CadasilStage.STAGE_4A]: 7.5    // Bedridden/Severe (End stage)
};

// Typical Onset Ages for these specific NOTCH3-SVD stages
// Used for placing markers on the graph.
// WMH starts early (30s). Lacunes often 40s-50s. Disability 50s-60s.
const MILESTONES = [
  { label: "Stage 1 (WMH Onset)", age: 32 },
  { label: "Stage 2 (Lacunes/Stroke)", age: 48 },
  { label: "Stage 3 (Disability)", age: 59 },
  { label: "Stage 4 (Severe)", age: 66 }
];

const getBaseMortalityRate = (age: number, sex: Sex): number => {
  const effectiveAge = Math.max(age, 18);
  const params = GOMPERTZ_PARAMS[sex];
  const qx = params.A * Math.exp(params.B * effectiveAge);
  return Math.min(qx, 0.99);
};

export const calculateSurvivalModel = (startAge: number, stage: CadasilStage, sex: Sex): ModelResult => {
  const hr = HAZARD_RATIOS[stage];
  const data: SurvivalDataPoint[] = [];
  const markers: ProgressionMarker[] = [];
  
  let currentSurvival = 1.0;
  let medianFound = false;
  let yearsTo50 = 0;
  let sumProductSurvival = 0;
  
  // Add "Current Status" marker
  markers.push({
    year: 0,
    age: startAge,
    label: "Current: " + stage.split(':')[0],
    survivalProbability: 100
  });

  // Add expected future milestones if the patient is younger than them
  MILESTONES.forEach(m => {
    if (m.age > startAge) {
      markers.push({
        year: m.age - startAge,
        age: m.age,
        label: m.label,
        survivalProbability: 0 // Will be filled in loop
      });
    }
  });

  // Simulate year by year
  for (let year = 0; year <= 60; year++) {
    const currentAge = startAge + year;
    const probabilityPercent = currentSurvival * 100;
    
    data.push({
      year,
      age: currentAge,
      survivalProbability: probabilityPercent
    });

    // Fill marker probabilities
    markers.forEach(marker => {
      if (Math.abs(marker.year - year) < 0.5) {
        marker.survivalProbability = probabilityPercent;
      }
    });

    if (!medianFound && currentSurvival <= 0.5) {
      // Linear interpolation for smoother median year
      const prevSurv = data[year-1].survivalProbability / 100;
      const fraction = (prevSurv - 0.5) / (prevSurv - currentSurvival);
      yearsTo50 = (year - 1) + fraction;
      medianFound = true;
    }

    const baseQx = getBaseMortalityRate(currentAge, sex);
    
    // Apply Stage Hazard Ratio
    const adjustedQx = 1 - Math.pow((1 - baseQx), hr);
    
    sumProductSurvival += currentSurvival;
    currentSurvival = currentSurvival * (1 - adjustedQx);

    if (currentSurvival < 0.005 || currentAge >= 105) break;
  }

  const meanExpectancy = sumProductSurvival - 0.5;
  const finalMedian = medianFound ? yearsTo50 : meanExpectancy;

  return {
    meanExpectancy: parseFloat(meanExpectancy.toFixed(1)),
    medianSurvival: parseFloat(finalMedian.toFixed(1)),
    data,
    yearsTo50Percent: finalMedian,
    progressionMarkers: markers.filter(m => m.year <= data.length - 1)
  };
};