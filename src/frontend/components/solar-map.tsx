"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Sun, Cloud, Zap, Thermometer } from "lucide-react"

interface SolarMapProps {
  selectedLocation: string
}

interface LocationData {
  name: string
  coordinates: [number, number]
  solarPotential: number
  averageSunlight: number
  temperature: number
  weatherCondition: string
  nearbyInstallations: number
}

export default function SolarMap({ selectedLocation }: SolarMapProps) {
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // 台灣各縣市的座標和太陽能數據
  const taiwanLocations: Record<string, LocationData> = {
    台北市: {
      name: "台北市",
      coordinates: [25.033, 121.5654],
      solarPotential: 75,
      averageSunlight: 4.2,
      temperature: 23,
      weatherCondition: "多雲",
      nearbyInstallations: 1250,
    },
    新北市: {
      name: "新北市",
      coordinates: [25.0118, 121.4654],
      solarPotential: 78,
      averageSunlight: 4.5,
      temperature: 24,
      weatherCondition: "晴朗",
      nearbyInstallations: 2100,
    },
    桃園市: {
      name: "桃園市",
      coordinates: [24.9937, 121.3009],
      solarPotential: 82,
      averageSunlight: 4.8,
      temperature: 25,
      weatherCondition: "晴朗",
      nearbyInstallations: 1800,
    },
    台中市: {
      name: "台中市",
      coordinates: [24.1477, 120.6736],
      solarPotential: 88,
      averageSunlight: 5.2,
      temperature: 26,
      weatherCondition: "晴朗",
      nearbyInstallations: 2500,
    },
    台南市: {
      name: "台南市",
      coordinates: [22.9999, 120.2269],
      solarPotential: 95,
      averageSunlight: 5.8,
      temperature: 28,
      weatherCondition: "晴朗",
      nearbyInstallations: 3200,
    },
    高雄市: {
      name: "高雄市",
      coordinates: [22.6273, 120.3014],
      solarPotential: 92,
      averageSunlight: 5.6,
      temperature: 29,
      weatherCondition: "晴朗",
      nearbyInstallations: 2800,
    },
    基隆市: {
      name: "基隆市",
      coordinates: [25.1276, 121.7391],
      solarPotential: 68,
      averageSunlight: 3.8,
      temperature: 22,
      weatherCondition: "多雲",
      nearbyInstallations: 450,
    },
    新竹市: {
      name: "新竹市",
      coordinates: [24.8138, 120.9675],
      solarPotential: 85,
      averageSunlight: 5.0,
      temperature: 25,
      weatherCondition: "晴朗",
      nearbyInstallations: 980,
    },
    嘉義市: {
      name: "嘉義市",
      coordinates: [23.4801, 120.4491],
      solarPotential: 90,
      averageSunlight: 5.4,
      temperature: 27,
      weatherCondition: "晴朗",
      nearbyInstallations: 750,
    },
    屏東縣: {
      name: "屏東縣",
      coordinates: [22.5519, 120.5487],
      solarPotential: 96,
      averageSunlight: 6.0,
      temperature: 30,
      weatherCondition: "晴朗",
      nearbyInstallations: 1900,
    },
    宜蘭縣: {
      name: "宜蘭縣",
      coordinates: [24.7021, 121.7378],
      solarPotential: 70,
      averageSunlight: 4.0,
      temperature: 23,
      weatherCondition: "多雲",
      nearbyInstallations: 650,
    },
    花蓮縣: {
      name: "花蓮縣",
      coordinates: [23.9871, 121.6015],
      solarPotential: 85,
      averageSunlight: 5.1,
      temperature: 25,
      weatherCondition: "晴朗",
      nearbyInstallations: 820,
    },
    台東縣: {
      name: "台東縣",
      coordinates: [22.7972, 121.1713],
      solarPotential: 88,
      averageSunlight: 5.3,
      temperature: 27,
      weatherCondition: "晴朗",
      nearbyInstallations: 680,
    },
  }

  useEffect(() => {
    if (selectedLocation && taiwanLocations[selectedLocation]) {
      setLocationData(taiwanLocations[selectedLocation])
    }
    // 模擬地圖載入
    const timer = setTimeout(() => setMapLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [selectedLocation])

  const getSolarPotentialColor = (potential: number) => {
    if (potential >= 90) return "text-green-600 bg-green-100"
    if (potential >= 80) return "text-yellow-600 bg-yellow-100"
    if (potential >= 70) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }

  const getSolarPotentialText = (potential: number) => {
    if (potential >= 90) return "優秀"
    if (potential >= 80) return "良好"
    if (potential >= 70) return "普通"
    return "較差"
  }

  return (
    <div className="space-y-4">
      {/* 地圖卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>位置與太陽能潛力</span>
          </CardTitle>
          <CardDescription>
            {selectedLocation ? `${selectedLocation}的太陽能發電潛力分析` : "請選擇地區以查看太陽能潛力"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 模擬地圖區域 */}
          <div className="relative h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden border">
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                {/* 模擬地圖背景 */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-yellow-100 to-orange-100">
                  {/* 模擬台灣輪廓 */}
                  <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full opacity-30" fill="currentColor">
                    <path
                      d="M150 50 C180 60, 200 100, 190 150 C185 200, 170 250, 160 300 C150 350, 140 380, 130 390 C120 380, 110 350, 100 300 C90 250, 75 200, 70 150 C60 100, 80 60, 110 50 C130 45, 140 45, 150 50 Z"
                      className="text-green-600"
                    />
                  </svg>
                </div>

                {/* 位置標記 */}
                {locationData && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap">
                        {locationData.name}
                      </div>
                    </div>
                  </div>
                )}

                {/* 太陽能強度圖例 */}
                <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 p-2 rounded text-xs">
                  <div className="font-medium mb-1">太陽能強度</div>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>低</span>
                    <span>高</span>
                  </div>
                </div>

                {/* Google Maps 標誌 */}
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">📍 Google Maps</div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 位置資訊卡片 */}
      {locationData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Sun className="h-5 w-5" />
                <span>太陽能數據</span>
              </span>
              <Badge className={getSolarPotentialColor(locationData.solarPotential)}>
                {getSolarPotentialText(locationData.solarPotential)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-600">日照時數</span>
                </div>
                <p className="text-lg font-semibold">{locationData.averageSunlight} 小時/日</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-gray-600">平均溫度</span>
                </div>
                <p className="text-lg font-semibold">{locationData.temperature}°C</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600">天氣狀況</span>
                </div>
                <p className="text-lg font-semibold">{locationData.weatherCondition}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span className="text-gray-600">附近安裝數</span>
                </div>
                <p className="text-lg font-semibold">{locationData.nearbyInstallations.toLocaleString()} 戶</p>
              </div>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">地區特色</h4>
              <p className="text-sm text-orange-700">
                {locationData.solarPotential >= 90
                  ? "此地區擁有優秀的太陽能發電條件，日照充足，非常適合安裝太陽能板。"
                  : locationData.solarPotential >= 80
                    ? "此地區具有良好的太陽能發電潛力，適合投資太陽能板。"
                    : locationData.solarPotential >= 70
                      ? "此地區的太陽能條件普通，建議詳細評估後再決定。"
                      : "此地區的太陽能條件較為一般，建議考慮其他因素。"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
