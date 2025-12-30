import React, { useState, useMemo } from 'react';
import { CadasilStage, Sex } from './types';
import { calculateSurvivalModel } from './services/survivalModel';
import { InputForm } from './components/InputForm';
import { SurvivalChart } from './components/SurvivalChart';
import { AnalysisSection } from './components/AnalysisSection';
import { Activity, Info, CalendarClock, TrendingDown } from 'lucide-react';

const App: React.FC = () => {
  const [age, setAge] = useState<number>(45);
  const [stage, setStage] = useState<CadasilStage>(CadasilStage.STAGE_1A);
  const [sex, setSex] = useState<Sex>(Sex.FEMALE);

  // Recalculate model whenever inputs change
  const modelResult = useMemo(() => {
    return calculateSurvivalModel(age, stage, sex);
  }, [age, stage, sex]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
               <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-cyan-600">
                 CADASIL Prognosis
               </h1>
            </div>
          </div>
          <a 
            href="https://jamanetwork.com/journals/jamaneurology/fullarticle/2827600"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 font-medium hidden sm:block hover:text-indigo-600 transition-colors underline decoration-slate-300 hover:decoration-indigo-600 underline-offset-2"
          >
            Based on JAMA Neurol. 2024
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-4 space-y-6">
            <InputForm 
              age={age} 
              setAge={setAge} 
              stage={stage} 
              setStage={setStage} 
              sex={sex}
              setSex={setSex}
            />
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">About CADASIL Survival</p>
                  <p className="mb-2">
                    Recent large cohort studies indicate median survival is reduced compared to the general population.
                  </p>
                  <p>
                    <strong>Sex Difference:</strong> Men often have earlier stroke onset and shorter life expectancy (Median ~65y) compared to Women (Median ~69y).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visualization & Stats */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <CalendarClock className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Est. Additional Years</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {modelResult.meanExpectancy} <span className="text-sm font-normal text-slate-500">years</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <TrendingDown className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Projected Median Age</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {(age + modelResult.medianSurvival).toFixed(1)} <span className="text-sm font-normal text-slate-500">years old</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Disease Trajectory</h3>
                  <p className="text-xs text-slate-500">
                    Dots represent typical age of onset for key clinical milestones (Stroke, Dementia, etc.) based on population averages.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                 <SurvivalChart 
                    data={modelResult.data} 
                    markers={modelResult.progressionMarkers}
                    color={sex === Sex.MALE ? "#0ea5e9" : "#ec4899"} 
                 />
              </div>
            </div>

            {/* AI Analysis */}
            <AnalysisSection 
              age={age}
              stage={stage}
              sex={sex}
              meanExpectancy={modelResult.meanExpectancy}
              medianSurvival={modelResult.medianSurvival}
            />

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;