"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Results {
  suitable: boolean
  installationCost: number
  annualGeneration: number
  annualSavings: number
  paybackPeriod: number
  totalProfit: number
  carbonReduction: number
  suitabilityScore: number
}

interface SimulationData {
  location: string
  roofArea: number
  electricityUsage: number
  roofType: string
  direction: string
}

interface SavedPlan {
  id: string
  name: string
  formData: SimulationData
  results: Results
  createdAt: Date
}

interface ComparisonChartProps {
  plans: SavedPlan[]
  metric: "cost" | "savings" | "payback" | "profit"
}

export default function ComparisonChart({ plans, metric }: ComparisonChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getChartData = () => {
    return plans.map((plan) => ({
      name: plan.name,
      value: (() => {
        switch (metric) {
          case "cost":
            return plan.results.installationCost
          case "savings":
            return plan.results.annualSavings
          case "payback":
            return plan.results.paybackPeriod
          case "profit":
            return plan.results.totalProfit
          default:
            return 0
        }
      })(),
    }))
  }

  const getYAxisLabel = () => {
    switch (metric) {
      case "cost":
        return "安裝成本"
      case "savings":
        return "年節省電費"
      case "payback":
        return "回本年限"
      case "profit":
        return "20年總獲益"
      default:
        return ""
    }
  }

  const getBarColor = () => {
    switch (metric) {
      case "cost":
        return "#ef4444"
      case "savings":
        return "#22c55e"
      case "payback":
        return "#f59e0b"
      case "profit":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={metric === "payback" ? (value) => `${value}年` : formatCurrency}
            label={{ value: getYAxisLabel(), angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value: number) => [
              metric === "payback" ? `${value} 年` : formatCurrency(value),
              getYAxisLabel(),
            ]}
          />
          <Bar dataKey="value" fill={getBarColor()} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
