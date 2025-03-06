"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1900 },
  { name: "Mar", total: 2300 },
  { name: "Apr", total: 2800 },
  { name: "May", total: 3500 },
  { name: "Jun", total: 3200 },
  { name: "Jul", total: 2800 },
  { name: "Aug", total: 3600 },
  { name: "Sep", total: 4100 },
  { name: "Oct", total: 3800 },
  { name: "Nov", total: 4300 },
  { name: "Dec", total: 3200 },
]

export function OverView() {
  return (
    <div className="w-full max-w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}`} 
          />
          <Bar 
            dataKey="total" 
            fill="currentColor" 
            radius={[4, 4, 0, 0]} 
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
