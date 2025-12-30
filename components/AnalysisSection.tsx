import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { generateAnalysis } from '../services/geminiService';
import { CadasilStage, Sex } from '../types';

interface AnalysisSectionProps {
  age: number;
  stage: CadasilStage;
  sex: Sex;
  meanExpectancy: number;
  medianSurvival: number;
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ 
  age, stage, sex, meanExpectancy, medianSurvival 
}) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastParams, setLastParams] = useState<string>("");

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateAnalysis(age, stage, sex, meanExpectancy, medianSurvival);
    setAnalysis(result);
    setLoading(false);
    setLastParams(`${age}-${stage}-${sex}`);
  };

  const currentParams = `${age}-${stage}-${sex}`;
  const isStale = lastParams !== "" && lastParams !== currentParams;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl shadow-sm border border-indigo-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-indigo-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          Clinical AI Interpretation
        </h2>
        {(!analysis || isStale) && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              isStale ? "Update Analysis" : "Generate Analysis"
            )}
          </button>
        )}
      </div>

      {!analysis && !loading && (
        <p className="text-slate-500 text-sm italic">
          Generate an AI interpretation of these curves based on the NOTCH3 mutation profile and recent literature.
        </p>
      )}

      {loading && !analysis && (
         <div className="animate-pulse space-y-3">
           <div className="h-4 bg-indigo-100 rounded w-3/4"></div>
           <div className="h-4 bg-indigo-100 rounded w-full"></div>
           <div className="h-4 bg-indigo-100 rounded w-5/6"></div>
         </div>
      )}

      {analysis && (
        <div className={`prose prose-indigo prose-sm max-w-none text-slate-700 leading-relaxed ${isStale ? 'opacity-50' : ''}`}>
          {analysis.split('\n').map((paragraph, idx) => (
             <p key={idx} className="mb-2">{paragraph}</p>
          ))}
          {isStale && <p className="text-xs text-amber-600 font-medium mt-2">* Inputs changed. Refresh analysis.</p>}
        </div>
      )}
    </div>
  );
};