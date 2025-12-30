import React from 'react';
import { RangeProbability } from '../types';
import { Calendar, Percent } from 'lucide-react';

interface ProbabilityTableProps {
  stats: RangeProbability[];
}

export const ProbabilityTable: React.FC<ProbabilityTableProps> = ({ stats }) => {
  if (stats.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
        <Percent className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">Survival Probability by Duration</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-4 py-3">Time Horizon</th>
              <th className="px-4 py-3">Future Age</th>
              <th className="px-4 py-3 text-right">Probability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stats.map((stat) => (
              <tr key={stat.yearsFromNow} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-700">
                  +{stat.yearsFromNow} Years
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {stat.futureAge} y.o.
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          stat.probability > 75 ? 'bg-emerald-500' :
                          stat.probability > 50 ? 'bg-blue-500' :
                          stat.probability > 25 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${stat.probability}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-800 w-12">{stat.probability.toFixed(0)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-slate-50 text-[10px] text-slate-400 text-center border-t border-slate-100">
         Probabilities derived from cumulative hazard function (Gompertz-Makeham law + Stage HR).
      </div>
    </div>
  );
};