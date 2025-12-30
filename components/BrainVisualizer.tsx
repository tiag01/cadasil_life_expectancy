import React, { useState, useEffect } from 'react';
import { CadasilStage } from '../types';

interface BrainVisualizerProps {
  stage: CadasilStage;
}

// User uploaded PNGs
const IMAGE_MAP_PNG: Record<string, string> = {
  [CadasilStage.STAGE_0]: "/mri_stage_0.png",
  [CadasilStage.STAGE_1A]: "/mri_stage_1a.png",
  [CadasilStage.STAGE_1B]: "/mri_stage_1b.png",
  [CadasilStage.STAGE_2A]: "/mri_stage_2a.png",
  [CadasilStage.STAGE_2B]: "/mri_stage_2b.png",
  [CadasilStage.STAGE_3A]: "/mri_stage_3a.png",
  [CadasilStage.STAGE_3B]: "/mri_stage_3b.png",
  [CadasilStage.STAGE_4A]: "/mri_stage_4a.png",
};

// Generated SVG fallbacks
const IMAGE_MAP_SVG: Record<string, string> = {
  [CadasilStage.STAGE_0]: "/stage0.svg",
  [CadasilStage.STAGE_1A]: "/stage1a.svg",
  [CadasilStage.STAGE_1B]: "/stage1b.svg",
  [CadasilStage.STAGE_2A]: "/stage2a.svg",
  [CadasilStage.STAGE_2B]: "/stage2b.svg",
  [CadasilStage.STAGE_3A]: "/stage3a.svg",
  [CadasilStage.STAGE_3B]: "/stage3b.svg",
  [CadasilStage.STAGE_4A]: "/stage4a.svg",
};

const STAGE_DESCRIPTIONS: Record<string, string> = {
  [CadasilStage.STAGE_0]: "Stage 0: Normal brain parenchyma. No WMH.",
  [CadasilStage.STAGE_1A]: "Stage 1A: Punctate WMH spots.",
  [CadasilStage.STAGE_1B]: "Stage 1B: Periventricular caps (horns).",
  [CadasilStage.STAGE_2A]: "Stage 2A: Caps + early focal lesions.",
  [CadasilStage.STAGE_2B]: "Stage 2B: Confluence beginning.",
  [CadasilStage.STAGE_3A]: "Stage 3A: Extensive confluent disease.",
  [CadasilStage.STAGE_3B]: "Stage 3B: Severe diffuse leukoencephalopathy.",
  [CadasilStage.STAGE_4A]: "Stage 4A: Significant atrophy & ventricular enlargement.",
};

export const BrainVisualizer: React.FC<BrainVisualizerProps> = ({ stage }) => {
  const [imgSrc, setImgSrc] = useState<string>(IMAGE_MAP_PNG[stage]);
  const [hasError, setHasError] = useState(false);
  const stageLabel = stage.split(':')[0];
  const description = STAGE_DESCRIPTIONS[stage] || "";

  // Reset state when stage changes
  useEffect(() => {
    setImgSrc(IMAGE_MAP_PNG[stage]);
    setHasError(false);
  }, [stage]);

  const handleError = () => {
    if (!hasError) {
      // First try: Fallback to SVG
      console.warn(`Failed to load PNG for ${stage}, falling back to SVG.`);
      setImgSrc(IMAGE_MAP_SVG[stage]);
      setHasError(true);
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      {/* Container styled to look like a medical imaging plate */}
      <div className="relative w-48 h-48 bg-black rounded-sm overflow-hidden border-4 border-slate-900 shadow-2xl group">
        <img 
          src={imgSrc} 
          alt={`${stageLabel} MRI Scan`} 
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={handleError}
        />
        
        {/* Clinical Overlay Label */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-left border-l-2 border-indigo-500">
          <span className="block text-white text-xs font-bold tracking-wide">{stageLabel}</span>
        </div>

        {/* Scan Type Marker */}
        <div className="absolute top-2 right-2 opacity-50">
          <span className="text-[10px] font-mono text-white">AX T2/FLAIR</span>
        </div>
        
        {hasError && (
          <div className="absolute top-1 left-1 opacity-50 bg-red-900/50 px-1 rounded">
             <span className="text-[8px] text-red-200 font-mono">SVG FALLBACK</span>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500 text-center max-w-[200px] leading-tight">
        {description}
      </p>
    </div>
  );
};