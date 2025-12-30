import React from 'react';
import { CadasilStage, Sex } from '../types';
import { Activity, User, Dna, Brain } from 'lucide-react';
import { BrainVisualizer } from './BrainVisualizer';

interface InputFormProps {
  age: number;
  setAge: (age: number) => void;
  stage: CadasilStage;
  setStage: (stage: CadasilStage) => void;
  sex: Sex;
  setSex: (sex: Sex) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ age, setAge, stage, setStage, sex, setSex }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <Dna className="w-5 h-5 text-indigo-600" />
        Clinical Parameters
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Patient Sex
          </label>
          <div className="flex gap-4">
            {[Sex.MALE, Sex.FEMALE].map((s) => (
              <button
                key={s}
                onClick={() => setSex(s)}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                  sex === s
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Sex is a significant prognostic factor in CADASIL (JAMA Neurol. 2024).
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Current Age
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="18"
              max="90"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-2xl font-bold text-indigo-900 min-w-[3rem]">
              {age}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            NOTCH3-SVD Severity Stage
          </label>
          <div className="relative">
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as CadasilStage)}
              className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none transition-all text-xs sm:text-sm"
            >
              {Object.values(CadasilStage).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Brain className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed mb-4">
            <strong>Stages 1-2</strong> are defined by MRI findings (WMH & Lacunes).<br/>
            <strong>Stages 3-4</strong> are defined by clinical disability (mRS score).
          </p>
          
          <BrainVisualizer stage={stage} />
        </div>
      </div>
    </div>
  );
};