import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceDot,
  Label
} from 'recharts';
import { SurvivalDataPoint, ProgressionMarker } from '../types';

interface SurvivalChartProps {
  data: SurvivalDataPoint[];
  markers?: ProgressionMarker[];
  color?: string;
}

export const SurvivalChart: React.FC<SurvivalChartProps> = ({ data, markers = [], color = "#4f46e5" }) => {
  return (
    <div className="h-[400px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="year" 
            label={{ value: 'Years from Now', position: 'insideBottomRight', offset: -10 }} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis 
            label={{ value: 'Survival Probability (%)', angle: -90, position: 'insideLeft' }} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Probability']}
            labelFormatter={(label) => `Year +${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="survivalProbability" 
            stroke={color} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPv)" 
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          
          {/* Progression Markers: Dots on the line indicating likely stage transitions */}
          {markers.map((marker, index) => (
             <ReferenceDot
                key={index}
                x={marker.year}
                y={marker.survivalProbability}
                r={5}
                fill="#ffffff"
                stroke={color}
                strokeWidth={2}
                isFront={true}
             >
               <Label 
                 value={marker.label} 
                 position="top" 
                 offset={10}
                 fill="#475569"
                 fontSize={11}
                 fontWeight={500}
               />
             </ReferenceDot>
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};