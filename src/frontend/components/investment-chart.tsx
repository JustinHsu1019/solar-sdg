"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface InvestmentChartProps {
  installationCost: number
  annualSavings: number
  paybackPeriod: number
}

export default function InvestmentChart({ installationCost, annualSavings, paybackPeriod }: InvestmentChartProps) {
  // 生成20年的累積收益數據
  const data = Array.from({ length: 21 }, (_, year) => {
    const cumulativeSavings = year * annualSavings
    const netProfit = cumulativeSavings - installationCost

    return {
      year,
      cumulativeSavings,
      netProfit,
      installationCost: year === 0 ? installationCost : 0,
    }
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" label={{ value: "年份", position: "insideBottom", offset: -5 }} />
          <YAxis tickFormatter={formatCurrency} label={{ value: "金額", angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name === "netProfit" ? "淨收益" : "累積節省",
            ]}
            labelFormatter={(year) => `第 ${year} 年`}
          />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" label="損益平衡點" />
          <ReferenceLine
            x={Math.round(paybackPeriod)}
            stroke="#ff7300"
            strokeDasharray="2 2"
            label={`回本點 (${Math.round(paybackPeriod)}年)`}
          />
          <Line type="monotone" dataKey="cumulativeSavings" stroke="#8884d8" strokeWidth={2} name="cumulativeSavings" />
          <Line type="monotone" dataKey="netProfit" stroke="#82ca9d" strokeWidth={2} name="netProfit" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
