'use client'

import { useState, useEffect, useCallback } from 'react'
import {user} from '/images/user-icon.png'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, Leaf, AlertTriangle, Droplets, ThermometerSun, Wind, User } from 'lucide-react'
import { format } from 'date-fns'
import axios from 'axios'
import { Arrow } from '@radix-ui/react-select'

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
})

const generateRandomCoords = (center, radius) => {
  const randomAngle = Math.random() * 2 * Math.PI
  const randomRadius = Math.random() * radius
  const deltaLat = (randomRadius / 111300) * Math.cos(randomAngle)
  const deltaLon = (randomRadius / 111300) * Math.sin(randomAngle)
  return [center[0] + deltaLat, center[1] + deltaLon]
}

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedCrop, setSelectedCrop] = useState<any | null>(null)
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null)
  const [weather, setWeather] = useState({ temperature: null, humidity: null, windSpeed: null })
  const [mapCenter, setMapCenter] = useState([51.505, -0.09])
  const [mockData, setMockData] = useState({ crops: [], damages: [], sensors: [] })
  const [loadingWeather, setLoadingWeather] = useState(true)
  const [isClient, setIsClient] = useState(false)

  const API_KEY = 'YOUR OPENWAETHER KEY'

  const getUserLocation = useCallback(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      console.log("Fetching user location...")
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserPosition([latitude, longitude])
          setMapCenter([latitude, longitude])
          fetchWeatherData([latitude, longitude])
          generateMockData([latitude, longitude])
        },
        (error) => {
          console.error("Geolocation error:", error.message)
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }, [])

  useEffect(() => {
    setIsClient(true)
    getUserLocation()
    const intervalId = setInterval(getUserLocation, 60000)
    return () => clearInterval(intervalId)
  }, [getUserLocation])

  const fetchWeatherData = async (position) => {
    const [lat, lon] = position
    setLoadingWeather(true)

    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat: lat,
          lon: lon,
          appid: API_KEY,
          units: 'metric',
        },
      })

      console.log("Weather API Response:", response.data)

      const { main, wind } = response.data
      setWeather({
        temperature: main.temp,
        humidity: main.humidity,
        windSpeed: wind.speed,
      })
    } catch (error) {
      console.error("Error fetching weather data:", error)
    } finally {
      setLoadingWeather(false)
    }
  }

  const generateMockData = (center) => {
    const crops = []
    const damages = []
    const sensors = []
    const cropTypes = ['Corn', 'Wheat', 'Soybeans', 'Rice', 'Barley']
    const radius = 1000

    for (let i = 0; i < 5; i++) {
      const position = generateRandomCoords(center, radius)
      crops.push({
        id: i + 1,
        position,
        count: Math.floor(Math.random() * 1000) + 100,
        type: cropTypes[i % cropTypes.length],
        growth: Math.floor(Math.random() * 100),
        logo: `/images/${cropTypes[i % cropTypes.length].toLowerCase()}-logo.png`,
      })
    }

    for (let i = 0; i < 3; i++) {
      const position = generateRandomCoords(center, radius)
      damages.push({
        id: i + 1,
        position,
        radius: Math.floor(Math.random() * 100) + 50,
        type: 'Pest Damage',
      })
    }

    for (let i = 0; i < 2; i++) {
      const position = generateRandomCoords(center, radius)
      sensors.push({
        id: i + 1,
        position,
        humidity: Math.floor(Math.random() * 100),
      })
    }

    setMockData({ crops, damages, sensors })
  }

  const recenterMap = () => {
    if (userPosition) {
      setMapCenter(userPosition)
    } else {
      getUserLocation()
    }
  }

  const updateData = () => {
    if (userPosition) {
      fetchWeatherData(userPosition)
      generateMockData(userPosition)
    } else {
      getUserLocation()
    }
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col md:flex-row">
      <Card className="w-full md:w-1/3 overflow-auto">
        <CardHeader>
          <CardTitle>Enhanced Crop Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="flex space-x-2">
              <Button onClick={recenterMap} variant="outline">Recenter</Button>
              <Button onClick={updateData} variant="outline">Update Data</Button>
            </div>
          </div>

          <Tabs defaultValue="weather" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weather">Weather</TabsTrigger>
              <TabsTrigger value="crop">Crop Info</TabsTrigger>
              <TabsTrigger value="legend">Legend</TabsTrigger>
            </TabsList>
            <TabsContent value="weather">
              <div className="space-y-2">
                {loadingWeather ? (
                  <div>Loading weather data...</div>
                ) : weather.temperature !== null ? (
                  <>
                    <div className="flex items-center">
                      <ThermometerSun className="mr-2 h-4 w-4" />
                      <span>Temperature: {weather.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="mr-2 h-4 w-4" />
                      <span>Humidity: {weather.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="mr-2 h-4 w-4" />
                      <span>Wind Speed: {weather.windSpeed} m/s</span>
                    </div>
                  </>
                ) : (
                  <div>Unable to fetch weather data.</div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="crop">
              {selectedCrop ? (
                <div>
                  <h3 className="font-bold">{selectedCrop.type}</h3>
                  <p>Count: {selectedCrop.count}</p>
                  <p>Growth: {selectedCrop.growth}%</p>
                  <Progress value={selectedCrop.growth} className="mt-2" />
                </div>
              ) : (
                <p>Select a crop on the map to view details</p>
              )}
            </TabsContent>
            <TabsContent value="legend">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Leaf className="mr-2 h-4 w-4 text-green-500" />
                  <span>Crop Location</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-orange-500" />
                  <span>Your Location</span>
                </div>

                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                  <span>Damage Area</span>
                </div>
                <div className="flex items-center">
                  <Droplets className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Humidity Sensor</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="w-full md:w-2/3 h-full">
        {isClient && (
          <MapComponent
            mapCenter={mapCenter}
            mockData={mockData}
            userPosition={userPosition}
            setSelectedCrop={setSelectedCrop}
          />
        )}
      </div>
    </div>
  )
}