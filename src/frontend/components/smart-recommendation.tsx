"use client"

import { useState, useEffect } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InvestmentChart from "@/components/investment-chart"
import { Star } from "lucide-react"
import { PiFunnelBold } from "react-icons/pi";
interface RecommendationResult {
  id: string
  name: string
  description: string
  formData: {
    location_city: string
    roofArea: number
    electricityUsage: number
    roofType: string
    direction: string
  }
  results: {
    suitable: boolean
    installationCost: number
    annualGeneration: number
    annualSavings: number
    totalProfit: number
    carbonReduction: number
  }
  matchScore: number
  module_name: string
  payback_years: number
  type: string
  capacity_kw: number
  efficiency_percent: number
  efficiency_level: string
  fit_rate_total: number
  daily_kwh_per_kw: number
  investment_projection_20yr: { value: number; year: number }[]
}

interface SmartRecommendationProps {
  recommendation?: RecommendationResult[]
  onRecommendationSelect?: (recommendation: RecommendationResult) => void
  onSavePlan?: (planName: string, planData: RecommendationResult) => void
}


export default function SmartRecommendation({
  onRecommendationSelect,
  onSavePlan,
}: SmartRecommendationProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [planName, setPlanName] = useState("")
  const [converted, setConverted] = useState<RecommendationResult[]>([])
  const [selectedChartPlan, setSelectedChartPlan] = useState<RecommendationResult | null>(null)
  const [sortBy, setSortBy] = useState("matchScore")
  const [aiResult, setAiResult] = useState<{
    [id: string]: {
      final_recommendation: string
      score: number
      explanation_text: string
    }
  }>({})

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
    }).format(amount)

  const calculateCompatibility = (
    efficiencyPercent: number,
    riskTolerance: number
  ): number => {
    const minEff = 16.5
    const maxEff = 23.6
    let normalizedEff = (efficiencyPercent - minEff) / (maxEff - minEff)
    normalizedEff = Math.max(0, Math.min(1, normalizedEff))
    const riskToleranceNormalized = riskTolerance / 100
    const compatibilityScore = 1 - Math.abs(normalizedEff - riskToleranceNormalized)
    return Math.round(compatibilityScore * 100 * 100) / 100
  }

  useEffect(() => {
    const rawData = localStorage.getItem("data")
    const data = rawData ? JSON.parse(rawData) : {}

    const formData = {
      location_city: data?.formData?.location_city || "未輸入",
      roofArea: data?.formData?.roofArea || 0,
      electricityUsage: data?.formData?.electricityUsage || 0,
      roofType: data?.formData?.roofType || "未輸入",
      direction: data?.formData?.direction || "未輸入",
    }

    const recommendations = data?.recommendations || []
    const transformed = recommendations.map((item: any, index: number): RecommendationResult => ({
      id: `rec-${index}`,
      name: item.brand,
      description: `容量 ${item.capacity_kw}kW，每年約可發電 ${item.annual_generation_kwh} 度`,
      formData,
      module_name: item.module_name,
      payback_years: item.payback_years,
      type: item.type,
      capacity_kw: item.capacity_kw,
      efficiency_percent: item.efficiency_percent,
      efficiency_level: item.efficiency_level,
      fit_rate_total: item.fit_rate_total,
      daily_kwh_per_kw: item.daily_kwh_per_kw,
      investment_projection_20yr: item.investment_projection_20yr,
      results: {
        suitable: true,
        annualGeneration: item.annual_generation_kwh,
        annualSavings: item.annual_revenue_ntd,
        totalProfit: item.annual_revenue_ntd * 20,
        carbonReduction: parseFloat((item.annual_generation_kwh * 0.5).toFixed(1)),
        installationCost: item.install_cost_ntd,
      },
      matchScore: calculateCompatibility(
        item.efficiency_percent,
        data.formData?.risk_tolerance || 50
      ),
    }))
    setConverted(transformed)
  }, [])

  useEffect(() => {
    setConverted((prev) =>
      [...prev].sort((a, b) => {
        if (sortBy === "installationCost") return a.results.installationCost - b.results.installationCost
        if (sortBy === "annualSavings") return b.results.annualSavings - a.results.annualSavings
        if (sortBy === "efficiency_percent") return b.efficiency_percent - a.efficiency_percent
        return b.matchScore - a.matchScore
      })
    )
  }, [sortBy])

  if (converted.length === 0) {
    return (
      <div className="p-6 text-gray-600 text-center">
        <p>尚無推薦資料，請先完成投資計算。</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="space-y-2">
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>為您推薦的方案</span>
              </CardTitle>
              <CardDescription>
                基於您的條件，我們為您精選了以下方案，按匹配度排序
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <PiFunnelBold className="w-5 h-5 text-muted-foreground" />
              <Select defaultValue="matchScore" onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matchScore">匹配度</SelectItem>
                  <SelectItem value="installationCost">安裝成本</SelectItem>
                  <SelectItem value="annualSavings">年收益</SelectItem>
                  <SelectItem value="efficiency_percent">效率</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {converted.map((rec, index) => (
            <Card key={rec.id} className={index === 0 ? "relative ring-2 ring-orange-500 z-10" : "relative z-10"}>
              <CardHeader onClick={() => setSelectedChartPlan(rec)}>
                <CardTitle className="flex justify-between items-center">
                  <span className="flex items-center space-x-2">
                    {index === 0 && <Star className="h-5 w-5 text-orange-500" />}
                    <span>{rec.name}</span>
                  </span>
                  <Badge variant={rec.matchScore >= 80 ? "default" : rec.matchScore >= 60 ? "secondary" : "outline"}>
                    匹配度 {rec.matchScore}%
                  </Badge>
                </CardTitle>
                <CardDescription>{rec.module_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={rec.matchScore} className="h-2" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">模組效率</p>
                    <p className="font-semibold">{rec.efficiency_percent}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">安裝成本</p>
                    <p className="font-semibold">{formatCurrency(rec.results.installationCost)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">年收益</p>
                    <p className="font-semibold">{formatCurrency(rec.results.annualSavings)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">20年獲益</p>
                    <p className="font-semibold text-green-600">{formatCurrency(rec.results.totalProfit)}</p>
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    const response = await fetch("http://localhost:5001/api/llm_decision", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        module_name: rec.module_name,
                        efficiency_percent: rec.efficiency_percent,
                        efficiency_level: rec.efficiency_level,
                        capacity_kw: rec.capacity_kw,
                        address: rec.formData.location_city,
                        annual_generation_kwh: rec.results.annualGeneration,
                        install_cost_ntd: rec.results.installationCost,
                        annual_revenue_ntd: rec.results.annualSavings,
                        payback_years: rec.payback_years,
                      }),
                    })
                    const data = await response.json()
                    setAiResult((prev) => ({ ...prev, [rec.id]: data }))
                  }}
                  className="relative w-full z-20"
                  variant="secondary"
                >
                🔍 AI 評估此方案
              </Button>
              <div className="flex flex-row1 gap-4 mt-2 text-sm text-gray-600">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveDialog(true)}
                  className="flex items-center space-x-2"
                >
                  <span>保存方案</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {setSelectedChartPlan(rec)
                                  setShowContactDialog(true)}}
                  className="flex items-center space-x-2 w-full"
                >
                  <span>聯絡廠商</span>
                </Button>
              </div>
              

              {aiResult[rec.id] && (
                <div className="text-sm mt-2 bg-yellow-50 border border-yellow-300 p-2 rounded">
                  <p><strong>📢 AI 回應</strong></p>
                  <p>建議：{aiResult[rec.id].final_recommendation}</p>
                  <p>分數：{aiResult[rec.id].score}</p>
                  <p>說明：{aiResult[rec.id].explanation_text}</p>
                </div>
              )}
              {/* {onSavePlan && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveDialog(true)}
                  className="flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>保存方案</span>
                </Button>
              )} */}
              </CardContent>
            </Card>
          ))}
        </div>
        
      </div>

      {selectedChartPlan && (
        <Dialog open={!!selectedChartPlan} onOpenChange={(open) => !open && setSelectedChartPlan(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedChartPlan.name} 投資回報分析</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="chart" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chart">📊 投資圖表</TabsTrigger>
                <TabsTrigger value="raw">📁 原始資料</TabsTrigger>
              </TabsList>

              <TabsContent value="chart">
                <InvestmentChart
                  installationCost={selectedChartPlan.results.installationCost}
                  annualSavings={selectedChartPlan.results.annualSavings}
                  paybackPeriod={selectedChartPlan.payback_years}
                />
              </TabsContent>

              <TabsContent value="raw">
                <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
                  <div><strong>模組名稱：</strong>{selectedChartPlan.module_name}</div>
                  <div><strong>品牌：</strong>{selectedChartPlan.name}</div>
                  <div><strong>模組種類：</strong>{selectedChartPlan.type}</div>
                  <div><strong>容量：</strong>{selectedChartPlan.capacity_kw} kW</div>
                  <div><strong>日均發電量：</strong>{selectedChartPlan.daily_kwh_per_kw} kWh/kW</div>
                  <div><strong>效率：</strong>{selectedChartPlan.efficiency_percent}% ({selectedChartPlan.efficiency_level})</div>
                  <div><strong>購電費率：</strong>{selectedChartPlan.fit_rate_total} 元/kWh</div>
                  <div><strong>年收益：</strong>{formatCurrency(selectedChartPlan.results.annualSavings)}</div>
                  <div><strong>安裝成本：</strong>{formatCurrency(selectedChartPlan.results.installationCost)}</div>
                  <div><strong>預估回本：</strong>{selectedChartPlan.payback_years} 年</div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogClose asChild>
              <Button variant="outline" className="mt-4 w-full">關閉</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
      {showContactDialog && selectedChartPlan && (
        <Dialog open={showContactDialog} onOpenChange={(open) => !open && setShowContactDialog(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>聯絡 {selectedChartPlan.name} 廠商資訊</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm text-gray-700">
              <p><strong>模組名稱：</strong>{selectedChartPlan.module_name}</p>
              <p><strong>品牌：</strong>{selectedChartPlan.name}</p>
              <p><strong>模組類型：</strong>{selectedChartPlan.type}</p>
              <p><strong>容量：</strong>{selectedChartPlan.capacity_kw} kW</p>
              <p><strong>聯絡信箱：</strong>{`support_${selectedChartPlan.name.toLowerCase().replace(/\s/g, "")}_${Math.random().toString(36).substring(2, 7)}@solarcloud.ai`}</p>
              <p><strong>客服電話：</strong>+886-800-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
            <DialogClose asChild>
              <Button variant="outline" className="mt-4 w-full">關閉</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}

    </div>
  )
}
