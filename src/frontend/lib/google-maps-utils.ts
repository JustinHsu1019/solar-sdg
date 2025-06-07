// Google Maps 相關工具函數

export interface SolarData {
  location: [number, number]
  solarPotential: number
  averageSunlight: number
  temperature: number
  weatherCondition: string
}

// 根據座標獲取太陽能數據
export async function getSolarDataByCoordinates(lat: number, lng: number): Promise<SolarData> {
  // 實際應用中，這裡會調用真實的太陽能數據 API
  // 例如：NASA Solar Radiation Database, NREL API 等

  try {
    // 模擬 API 調用
    const response = await fetch(`/api/solar-data?lat=${lat}&lng=${lng}`)
    const data = await response.json()

    return {
      location: [lat, lng],
      solarPotential: data.solarPotential || 80,
      averageSunlight: data.averageSunlight || 5.0,
      temperature: data.temperature || 25,
      weatherCondition: data.weatherCondition || "晴朗",
    }
  } catch (error) {
    console.error("Failed to fetch solar data:", error)

    // 返回預設值
    return {
      location: [lat, lng],
      solarPotential: 80,
      averageSunlight: 5.0,
      temperature: 25,
      weatherCondition: "晴朗",
    }
  }
}

// 計算兩點間距離
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // 地球半徑（公里）
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 獲取附近的太陽能安裝案例
export async function getNearbyInstallations(lat: number, lng: number, radius = 10) {
  // 實際應用中會查詢資料庫或 API
  return [
    {
      id: "1",
      location: [lat + 0.001, lng + 0.001],
      capacity: "5kW",
      installDate: "2023-06-15",
      annualGeneration: 6500,
    },
    // ... 更多安裝案例
  ]
}
