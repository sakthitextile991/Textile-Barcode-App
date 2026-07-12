import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import api from "../../services/api";
import { useState, useEffect } from "react";

export default function STProductionChart({data}) { 
  
  
  const hasData = data?.length > 0;
  
  

  {/*Mobile screen will show ony 5 fabrics */}
  const isMobile = window.innerWidth < 768;
  const chartData = isMobile
    ? (data ?? []).slice(0, 5)
    : (data ?? []);
  
  if (!hasData) {
    return (
      <div
        className="
          h-[320px]
          flex
          items-center
          justify-center
          rounded-xl
          border
          border-dashed
          border-slate-300
          bg-slate-50
        "
      >
        <div className="text-center">
          <p className="text-5xl mb-3">🏭</p>

          <p className="text-lg font-semibold text-slate-700">
            No Production Data
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Production statistics will appear here
          </p>
        </div>
      </div>
    );
  }
  
  

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} 
        margin={{
          top: 20,
          right: 20,
          left: 10,
          bottom: 40,
        }}
        barCategoryGap="30%"
      >
        
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis 
          dataKey="fabric"
          tick={false}
          tickLine={false}
         />

        <YAxis  tickFormatter={(value) =>
          `${value.toLocaleString()}`
          }
        />

        <Tooltip />

        {/* Blue Bottom */}
        <Bar
          dataKey="meters"
          stackId="a"
          fill="#3b82f6"
          name="Dispatched"
        >
          <LabelList
            dataKey="meters"
            position="center"
            fill="#ffffff"
            fontSize={12}
          />
        </Bar>

      
      </BarChart>
    </ResponsiveContainer>
  );
}