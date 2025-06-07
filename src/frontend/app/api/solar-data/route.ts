import { type NextRequest, NextResponse } from "next/server"

// 太陽能數據 API 路由
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lng = Number.parseFloat(searchParams.get("lng") || "0")

  try {
    // 實際應用中，這裡會整合真實的太陽能數據源
    // 例如：NASA Solar Radiation Database, NREL Solar Resource Data 等

    // 模擬基於座標的太陽能潛力計算
    const solarPotential = calculateSolarPotential(lat, lng)
    const averageSunlight = calculateAverageSunlight(lat, lng)
    const temperature = calculateAverageTemperature(lat, lng)
    const weatherCondition = getWeatherCondition(lat, lng)

    return NextResponse.json({
      solarPotential,
      averageSunlight,
      temperature,
      weatherCondition,
      coordinates: [lat, lng],
    })
  } catch (error) {
    console.error("Error fetching solar data:", error)
    return NextResponse.json({ error: "Failed to fetch solar data" }, { status: 500 })
  }
}

function calculateSolarPotential(lat: number, lng: number): number {
  // 基於緯度的簡單計算（實際應用中會更複雜）
  const latitudeFactor = Math.max(0, 100 - Math.abs(lat - 23.5) * 2) // 台灣緯度約23.5°
  const longitudeFactor = Math.random() * 20 + 80 // 模擬地形和氣候影響

  return Math.min(100, Math.max(0, (latitudeFactor + longitudeFactor) / 2))
}

function calculateAverageSunlight(lat: number, lng: number): number {
  // 基於緯度和經度的日照時數計算
  const baseSunlight = 5.5 - Math.abs(lat - 23.5) * 0.1
  const variation = (Math.random() - 0.5) * 1.0

  return Math.max(3.0, Math.min(7.0, baseSunlight + variation))
}

function calculateAverageTemperature(lat: number, lng: number): number {
  // 基於緯度的溫度計算
  const baseTemp = 28 - (lat - 22) * 0.5
  const variation = (Math.random() - 0.5) * 4

  return Math.round(Math.max(18, Math.min(35, baseTemp + variation)))
}

function getWeatherCondition(lat: number, lng: number): string {
  const conditions = ["晴朗", "多雲", "晴時多雲"]
  const index = Math.floor(Math.random() * conditions.length)
  return conditions[index]
}
