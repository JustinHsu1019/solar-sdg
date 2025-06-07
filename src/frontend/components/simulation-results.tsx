"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, TrendingUp, Leaf, DollarSign, Calendar, Zap, Save } from "lucide-react"
import InvestmentChart from "@/components/investment-chart"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"

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

interface SimulationResultsProps {
  results: Results
  formData: SimulationData
  onSavePlan?: (planName: string) => void
}

export default function SimulationResults({ results, formData, onSavePlan }: SimulationResultsProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [planName, setPlanName] = useState("")

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

  return (
    <div className="space-y-6">
      {/* 適合性評估 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              {results.suitable ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span>適合性評估</span>
            </CardTitle>
            {onSavePlan && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(true)}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>保存方案</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold">{results.suitable ? "適合安裝" : "需要評估"}</p>
              <p className="text-gray-600">基於您的地理位置和屋頂條件</p>
            </div>
            <Badge
              variant={results.suitable ? "default" : "secondary"}
              className={results.suitable ? "bg-green-500" : "bg-yellow-500"}
            >
              適合度: {results.suitabilityScore}%
            </Badge>
          </div>
          <Progress value={results.suitabilityScore} className="h-2" />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">地區</p>
              <p className="font-medium">{formData.location}</p>
            </div>
            <div>
              <p className="text-gray-600">屋頂面積</p>
              <p className="font-medium">{formData.roofArea} m²</p>
            </div>
            <div>
              <p className="text-gray-600">屋頂類型</p>
              <p className="font-medium">{formData.roofType}</p>
            </div>
            <div>
              <p className="text-gray-600">朝向</p>
              <p className="font-medium">{formData.direction}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 關鍵指標 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">安裝成本</p>
                <p className="text-2xl font-bold">{formatCurrency(results.installationCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">年發電量</p>
                <p className="text-2xl font-bold">{formatNumber(results.annualGeneration)} kWh</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">年節省電費</p>
                <p className="text-2xl font-bold">{formatCurrency(results.annualSavings)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">回本年限</p>
                <p className="text-2xl font-bold">{results.paybackPeriod} 年</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 投資回報分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>20年投資回報</CardTitle>
            <CardDescription>累積收益與成本分析</CardDescription>
          </CardHeader>
          <CardContent>
            <InvestmentChart
              installationCost={results.installationCost}
              annualSavings={results.annualSavings}
              paybackPeriod={results.paybackPeriod}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-500" />
              <span>環境效益</span>
            </CardTitle>
            <CardDescription>您對環境保護的貢獻</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">年減碳量</p>
                  <p className="text-2xl font-bold text-green-600">{formatNumber(results.carbonReduction)} kg CO₂</p>
                </div>
                <Leaf className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">相當於種植樹木</span>
                <span className="font-medium">{Math.round(results.carbonReduction / 22)} 棵</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">20年總減碳量</span>
                <span className="font-medium">{formatNumber(results.carbonReduction * 20)} kg CO₂</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">20年總獲益</span>
                <span className="font-medium text-green-600">{formatCurrency(results.totalProfit)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>保存投資方案</CardTitle>
              <CardDescription>為這個方案命名，以便日後比較</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="planName">方案名稱</Label>
                <Input
                  id="planName"
                  placeholder="例：我家屋頂方案"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    if (planName.trim() && onSavePlan) {
                      onSavePlan(planName.trim())
                      setPlanName("")
                      setShowSaveDialog(false)
                    }
                  }}
                  disabled={!planName.trim()}
                  className="flex-1"
                >
                  保存
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSaveDialog(false)
                    setPlanName("")
                  }}
                  className="flex-1"
                >
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
