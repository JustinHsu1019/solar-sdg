"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    preferredTime: "",
    message: "",
    agreeToTerms: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 模擬提交
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.name && formData.phone && formData.email && formData.agreeToTerms

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">預約成功！</h3>
          <p className="text-gray-600 text-center mb-6">
            感謝您的預約，我們的專業顧問將在1-2個工作天內與您聯繫， 為您提供詳細的太陽能板安裝諮詢服務。
          </p>
          <Button onClick={() => setIsSubmitted(false)}>重新預約</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 聯繫表單 */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>預約專員諮詢</CardTitle>
            <CardDescription>填寫以下資訊，我們的專業顧問將為您提供免費的太陽能板安裝評估</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名 *</Label>
                  <Input
                    id="name"
                    placeholder="請輸入您的姓名"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">聯絡電話 *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="09XX-XXX-XXX"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">電子信箱 *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">所在地區</Label>
                  <Select onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇您的所在地區" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">北部地區</SelectItem>
                      <SelectItem value="central">中部地區</SelectItem>
                      <SelectItem value="south">南部地區</SelectItem>
                      <SelectItem value="east">東部地區</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTime">希望聯繫時間</Label>
                  <Select onValueChange={(value) => handleInputChange("preferredTime", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇方便的時間" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">上午 (9:00-12:00)</SelectItem>
                      <SelectItem value="afternoon">下午 (13:00-17:00)</SelectItem>
                      <SelectItem value="evening">晚上 (18:00-20:00)</SelectItem>
                      <SelectItem value="anytime">任何時間</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">其他需求或問題</Label>
                <Textarea
                  id="message"
                  placeholder="請描述您的需求或想了解的問題..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  我同意接收太陽能板相關資訊，並了解個人資料將依隱私權政策處理
                </Label>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600"
                size="lg"
              >
                {isSubmitting ? "提交中..." : "預約免費諮詢"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 聯繫資訊 */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>聯繫資訊</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">客服專線</p>
                <p className="text-gray-600">0800-123-456</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">電子信箱</p>
                <p className="text-gray-600">info@solar-taiwan.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">服務地區</p>
                <p className="text-gray-600">全台灣</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">服務時間</p>
                <p className="text-gray-600">週一至週五 9:00-18:00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>服務流程</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">免費諮詢</p>
                  <p className="text-sm text-gray-600">專員電話聯繫，了解需求</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">現場評估</p>
                  <p className="text-sm text-gray-600">專業技師到府勘查</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">方案規劃</p>
                  <p className="text-sm text-gray-600">客製化安裝方案</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">專業安裝</p>
                  <p className="text-sm text-gray-600">合格技師施工安裝</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
