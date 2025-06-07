"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, Target, Clock, Leaf, Star, TrendingUp } from "lucide-react"

interface UserPreferences {
  location_city: string
  budget: number
  roofArea: number
  electricityUsage: number
  investmentStyle: "conservative" | "balanced" | "aggressive"
  priority: "payback" | "profit" | "environment" | "balanced"
  riskTolerance: number
}

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
    paybackPeriod: number
    totalProfit: number
    carbonReduction: number
    suitabilityScore: number
  }
  matchScore: number
  pros: string[]
  cons: string[]
  recommendation: string
}

interface SmartRecommendationProps {
  onRecommendationSelect: (recommendation: RecommendationResult) => void
}

export default function SmartRecommendation({ onRecommendationSelect }: SmartRecommendationProps) {
  const [step, setStep] = useState(1)
  // const [preferences, setPreferences] = useState<UserPreferences>({
  //   location_city: "",
  //   budget: 0,
  //   roofArea: 0,
  //   electricityUsage: 0,
  //   investmentStyle: "balanced",
  //   priority: "balanced",
  //   riskTolerance: 50,
  // })
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("formData")
    if (stored) {
      const parsed = JSON.parse(stored)
      const preferences: UserPreferences = parsed
    }
  }, [])

  

  // const generateRecommendations = async () => {
  //   setIsGenerating(true)
  //   await new Promise((resolve) => setTimeout(resolve, 3000))

  //   // 基於地區的日照時數係數
  //   const sunlightCoefficient = {
  //     台南市: 1.2,
  //     高雄市: 1.15,
  //     屏東縣: 1.18,
  //     台東縣: 1.1,
  //     台中市: 1.0,
  //     彰化縣: 1.05,
  //     雲林縣: 1.08,
  //     嘉義市: 1.1,
  //     台北市: 0.85,
  //     新北市: 0.88,
  //     基隆市: 0.8,
  //     宜蘭縣: 0.82,
  //   }

  //   const coefficient = sunlightCoefficient[preferences.location_city as keyof typeof sunlightCoefficient] || 0.95

  //   // 生成多個推薦方案
  //   const scenarios = [
  //     {
  //       name: "經濟實用方案",
  //       description: "成本控制，穩健回報",
  //       roofUsage: 0.6,
  //       direction: "south",
  //       roofType: "concrete",
  //       focus: "payback",
  //     },
  //     {
  //       name: "最大效益方案",
  //       description: "充分利用屋頂，最大化收益",
  //       roofUsage: 0.9,
  //       direction: "south",
  //       roofType: "metal",
  //       focus: "profit",
  //     },
  //     {
  //       name: "環保優先方案",
  //       description: "注重環境效益，減碳為主",
  //       roofUsage: 0.8,
  //       direction: "southeast",
  //       roofType: "sloped",
  //       focus: "environment",
  //     },
  //     {
  //       name: "平衡發展方案",
  //       description: "兼顧成本、收益與環保",
  //       roofUsage: 0.75,
  //       direction: "southwest",
  //       roofType: "flat",
  //       focus: "balanced",
  //     },
  //   ]

  //   const generatedRecommendations: RecommendationResult[] = scenarios.map((scenario, index) => {
  //     const effectiveArea = preferences.roofArea * scenario.roofUsage
  //     const systemSize = effectiveArea * 0.15

  //     const directionCoefficient = {
  //       south: 1.0,
  //       southeast: 0.95,
  //       southwest: 0.95,
  //       east: 0.85,
  //       west: 0.85,
  //       north: 0.7,
  //     }
  //     const dirCoeff = directionCoefficient[scenario.direction as keyof typeof directionCoefficient]

  //     const annualGeneration = systemSize * 1200 * coefficient * dirCoeff
  //     const installationCost = systemSize * 45000
  //     const annualSavings = annualGeneration * 3.2
  //     const paybackPeriod = installationCost / annualSavings
  //     const totalProfit = annualSavings * 20 - installationCost
  //     const carbonReduction = annualGeneration * 0.554
  //     const suitabilityScore = Math.min(100, coefficient * dirCoeff * 100)

  //     // 計算匹配分數
  //     let matchScore = 0

  //     // 預算匹配 (30%)
  //     if (preferences.budget === 0 || installationCost <= preferences.budget) {
  //       matchScore += 30
  //     } else {
  //       matchScore += Math.max(0, 30 * (1 - (installationCost - preferences.budget) / preferences.budget))
  //     }

  //     // 投資風格匹配 (25%)
  //     if (preferences.investmentStyle === "conservative" && paybackPeriod <= 8) {
  //       matchScore += 25
  //     } else if (preferences.investmentStyle === "aggressive" && totalProfit > 500000) {
  //       matchScore += 25
  //     } else if (preferences.investmentStyle === "balanced") {
  //       matchScore += 20
  //     }

  //     // 優先目標匹配 (25%)
  //     if (preferences.priority === scenario.focus || preferences.priority === "balanced") {
  //       matchScore += 25
  //     }

  //     // 適合度匹配 (20%)
  //     matchScore += (suitabilityScore / 100) * 20

  //     // 生成優缺點
  //     const pros = []
  //     const cons = []

  //     if (paybackPeriod <= 7) pros.push("回本速度快")
  //     if (totalProfit > 400000) pros.push("長期收益高")
  //     if (carbonReduction > 3000) pros.push("環保效益顯著")
  //     if (installationCost < 300000) pros.push("初期投資較低")

  //     if (paybackPeriod > 10) cons.push("回本時間較長")
  //     if (installationCost > 500000) cons.push("初期投資較高")
  //     if (suitabilityScore < 80) cons.push("地理條件一般")

  //     // 生成推薦理由
  //     // let recommendation = ""
  //     // if (matchScore >= 80) {
  //     //   recommendation = "強烈推薦：此方案非常符合您的需求和偏好"
  //     // } else if (matchScore >= 60) {
  //     //   recommendation = "推薦：此方案基本符合您的條件"
  //     // } else {
  //     //   recommendation = "可考慮：此方案有一定優勢，但可能不完全符合您的偏好"
  //     // }

  //     return {
  //       id: `rec_${index}`,
  //       name: scenario.name,
  //       description: scenario.description,
  //       formData: {
  //         location_city: preferences.location_city,
  //         roofArea: effectiveArea,
  //         electricityUsage: preferences.electricityUsage,
  //         roofType: scenario.roofType,
  //         direction: scenario.direction,
  //       },
  //       results: {
  //         suitable: suitabilityScore > 60,
  //         installationCost: Math.round(installationCost),
  //         annualGeneration: Math.round(annualGeneration),
  //         annualSavings: Math.round(annualSavings),
  //         paybackPeriod: Math.round(paybackPeriod * 10) / 10,
  //         totalProfit: Math.round(totalProfit),
  //         carbonReduction: Math.round(carbonReduction),
  //         suitabilityScore: Math.round(suitabilityScore),
  //       },
  //       matchScore: Math.round(matchScore),
  //       pros,
  //       cons,
  //       recommendation,
  //     }
  //   })

  //   // 按匹配分數排序
  //   generatedRecommendations.sort((a, b) => b.matchScore - a.matchScore)
  //   setRecommendations(generatedRecommendations)
  //   setIsGenerating(false)
  //   setStep(3)
  // }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("zh-TW").format(num)
  }

  // if (step === 1) {
  //   return (
  //     <div className="space-y-6">
  //       <Card>
  //         <CardHeader>
  //           <CardTitle className="flex items-center space-x-2">
  //             <Lightbulb className="h-5 w-5" />
  //             <span>智能推薦系統</span>
  //           </CardTitle>
  //           <CardDescription>告訴我們您的需求和偏好，我們將為您推薦最適合的太陽能板投資方案</CardDescription>
  //         </CardHeader>
  //         <CardContent className="space-y-6">
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //             <div className="space-y-2">
  //               <Label htmlFor="location">所在地區</Label>
  //               <Select onValueChange={(value) => setPreferences((prev) => ({ ...prev, location: value }))}>
  //                 <SelectTrigger>
  //                   <SelectValue placeholder="選擇您的所在地區" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   {taiwanCities.map((city) => (
  //                     <SelectItem key={city} value={city}>
  //                       {city}
  //                     </SelectItem>
  //                   ))}
  //                 </SelectContent>
  //               </Select>
  //             </div>

  //             <div className="space-y-2">
  //               <Label htmlFor="budget">預算範圍 (萬元)</Label>
  //               <Input
  //                 id="budget"
  //                 type="number"
  //                 placeholder="例：50 (0表示無預算限制)"
  //                 value={preferences.budget || ""}
  //                 onChange={(e) => setPreferences((prev) => ({ ...prev, budget: Number(e.target.value) * 10000 }))}
  //               />
  //             </div>

  //             <div className="space-y-2">
  //               <Label htmlFor="roofArea">屋頂面積 (平方米)</Label>
  //               <Input
  //                 id="roofArea"
  //                 type="number"
  //                 placeholder="例：50"
  //                 value={preferences.roofArea || ""}
  //                 onChange={(e) => setPreferences((prev) => ({ ...prev, roofArea: Number(e.target.value) }))}
  //               />
  //             </div>

  //             <div className="space-y-2">
  //               <Label htmlFor="electricityUsage">月平均用電量 (度)</Label>
  //               <Input
  //                 id="electricityUsage"
  //                 type="number"
  //                 placeholder="例：300"
  //                 value={preferences.electricityUsage || ""}
  //                 onChange={(e) => setPreferences((prev) => ({ ...prev, electricityUsage: Number(e.target.value) }))}
  //               />
  //             </div>
  //           </div>

  //           <Button
  //             onClick={() => setStep(2)}
  //             disabled={!preferences.location || !preferences.roofArea || !preferences.electricityUsage}
  //             className="w-full bg-orange-500 hover:bg-orange-600"
  //             size="lg"
  //           >
  //             下一步：設定投資偏好
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  // if (step) {
  //   return (
  //     <div className="space-y-6">
  //       <Card>
  //         <CardHeader>
  //           <CardTitle className="flex items-center space-x-2">
  //             <Target className="h-5 w-5" />
  //             <span>投資偏好設定</span>
  //           </CardTitle>
  //           <CardDescription>請告訴我們您的投資風格和優先考量，以便為您量身推薦方案</CardDescription>
  //         </CardHeader>
  //         <CardContent className="space-y-6">
  //           <div className="space-y-4">
  //             <div className="space-y-3">
  //               <Label>投資風格</Label>
  //               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
  //                 {[
  //                   { value: "conservative", label: "保守型", desc: "優先考慮風險控制和穩定回報" },
  //                   { value: "balanced", label: "平衡型", desc: "兼顧風險和收益" },
  //                   { value: "aggressive", label: "積極型", desc: "追求最大收益，可承受較高風險" },
  //                 ].map((style) => (
  //                   <Card
  //                     key={style.value}
  //                     className={`cursor-pointer transition-all ${
  //                       preferences.investmentStyle === style.value ? "ring-2 ring-orange-500 bg-orange-50" : ""
  //                     }`}
  //                     onClick={() => setPreferences((prev) => ({ ...prev, investmentStyle: style.value as any }))}
  //                   >
  //                     <CardContent className="p-4">
  //                       <h4 className="font-medium">{style.label}</h4>
  //                       <p className="text-sm text-gray-600 mt-1">{style.desc}</p>
  //                     </CardContent>
  //                   </Card>
  //                 ))}
  //               </div>
  //             </div>

  //             <div className="space-y-3">
  //               <Label>優先目標</Label>
  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  //                 {[
  //                   { value: "payback", label: "快速回本", icon: Clock, desc: "希望盡快收回投資成本" },
  //                   { value: "profit", label: "最大收益", icon: TrendingUp, desc: "追求長期最大化收益" },
  //                   { value: "environment", label: "環保優先", icon: Leaf, desc: "重視環境效益和減碳" },
  //                   { value: "balanced", label: "均衡發展", icon: Target, desc: "各方面都要兼顧" },
  //                 ].map((priority) => (
  //                   <Card
  //                     key={priority.value}
  //                     className={`cursor-pointer transition-all ${
  //                       preferences.priority === priority.value ? "ring-2 ring-orange-500 bg-orange-50" : ""
  //                     }`}
  //                     onClick={() => setPreferences((prev) => ({ ...prev, priority: priority.value as any }))}
  //                   >
  //                     <CardContent className="p-4 flex items-center space-x-3">
  //                       <priority.icon className="h-5 w-5 text-orange-500" />
  //                       <div>
  //                         <h4 className="font-medium">{priority.label}</h4>
  //                         <p className="text-sm text-gray-600">{priority.desc}</p>
  //                       </div>
  //                     </CardContent>
  //                   </Card>
  //                 ))}
  //               </div>
  //             </div>

  //             <div className="space-y-3">
  //               <Label>風險承受度</Label>
  //               <div className="space-y-2">
  //                 <Slider
  //                   value={[preferences.riskTolerance]}
  //                   onValueChange={(value) => setPreferences((prev) => ({ ...prev, riskTolerance: value[0] }))}
  //                   max={100}
  //                   step={10}
  //                   className="w-full"
  //                 />
  //                 <div className="flex justify-between text-sm text-gray-600">
  //                   <span>保守 (低風險)</span>
  //                   <span className="font-medium">{preferences.riskTolerance}%</span>
  //                   <span>積極 (高風險)</span>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>

  //           <div className="flex space-x-3">
  //             <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
  //               上一步
  //             </Button>
  //             <Button
  //               onClick={generateRecommendations}
  //               disabled={isGenerating}
  //               className="flex-1 bg-orange-500 hover:bg-orange-600"
  //               size="lg"
  //             >
  //               {isGenerating ? "生成推薦中..." : "生成智能推薦"}
  //             </Button>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>為您推薦的方案</span>
          </CardTitle>
          <CardDescription>基於您的條件和偏好，我們為您精選了以下方案，按匹配度排序</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((rec, index) => (
          <Card key={rec.id} className={index === 0 ? "ring-2 ring-orange-500" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {index === 0 && <Star className="h-5 w-5 text-orange-500" />}
                  <span>{rec.name}</span>
                </CardTitle>
                <Badge variant={rec.matchScore >= 80 ? "default" : rec.matchScore >= 60 ? "secondary" : "outline"}>
                  匹配度 {rec.matchScore}%
                </Badge>
              </div>
              <CardDescription>{rec.description}</CardDescription>
              {index === 0 && <Badge className="w-fit bg-orange-500">🏆 最佳推薦</Badge>}
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={rec.matchScore} className="h-2" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">安裝成本</p>
                  <p className="font-semibold">{formatCurrency(rec.results.installationCost)}</p>
                </div>
                <div>
                  <p className="text-gray-600">回本年限</p>
                  <p className="font-semibold">{rec.results.paybackPeriod} 年</p>
                </div>
                <div>
                  <p className="text-gray-600">年節省</p>
                  <p className="font-semibold">{formatCurrency(rec.results.annualSavings)}</p>
                </div>
                <div>
                  <p className="text-gray-600">20年獲益</p>
                  <p className="font-semibold text-green-600">{formatCurrency(rec.results.totalProfit)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-green-600">優勢</h4>
                <ul className="text-sm space-y-1">
                  {rec.pros.map((pro, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {rec.cons.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-600">注意事項</h4>
                  <ul className="text-sm space-y-1">
                    {rec.cons.map((con, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">{rec.recommendation}</p>
              </div>

              <Button
                onClick={() => onRecommendationSelect(rec)}
                className="w-full"
                variant={index === 0 ? "default" : "outline"}
              >
                查看詳細分析
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">需要重新推薦？</h3>
              <p className="text-sm text-gray-600">調整您的偏好設定以獲得更精準的推薦</p>
            </div>
            <Button variant="outline" onClick={() => setStep(1)}>
              重新設定
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
