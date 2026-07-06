"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function FinanceTrendChart({ data }: { data: { month: string; amount: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="financeLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F4C5D7" />
              <stop offset="50%" stopColor="#E981A4" />
              <stop offset="100%" stopColor="#FEC9C3" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#FAF2DD" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#8A7B83", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#8A7B83", fontSize: 12 }} axisLine={false} tickLine={false} width={56} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #F4C5D7", background: "rgba(255,255,255,0.9)" }}
            formatter={(value: number) => [`₱${value.toLocaleString()}`, "Amount"]}
          />
          <Line type="monotone" dataKey="amount" stroke="url(#financeLine)" strokeWidth={3} dot={{ r: 4, fill: "#E981A4" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
