'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { MapContainer, TileLayer, Rectangle } from 'react-leaflet'
import L from 'leaflet' // Import Leaflet

// Mock data for demonstration purposes
const crops = ['Wheat', 'Corn', 'Soybeans', 'Rice']

type RecommendationType = 'seeding' | 'harvesting'

interface Recommendation {
  type: RecommendationType
  date: Date
  details: string
}

const generateMockRecommendation = (type: RecommendationType): Recommendation => {
  const date = new Date()
  date.setDate(date.getDate() + Math.floor(Math.random() * 30))

  let details = ''
  if (type === 'seeding') {
    details = `Optimal soil conditions expected. Moisture levels at 60%. Forecasted temperature range: 15-22°C.`
  } else {
    details = `Expected grain moisture: 14%. Protein levels optimal. Storage capacity available: 80%. Local mill capacity: 70%.`
  }

  return { type, date, details }
}

export default function AdvancedCropManagement() {
  const [selectedCrop, setSelectedCrop] = useState<string>(''); // Keep track of selected crop
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [location, setLocation] = useState<[number, number] | null>(null); // Store user location
  const [manualLatitude, setManualLatitude] = useState<string>(''); // For manual latitude input
  const [manualLongitude, setManualLongitude] = useState<string>(''); // For manual longitude input
  const mapRef = useRef<any>(null); // Reference for the map container

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]); // Set user location
      },
      (error) => {
        console.error("Error getting location", error.message);
        alert("Unable to retrieve your location. Please enable location services or enter it manually."); // Notify user
        setLocation([51.505, -0.09]); // Default to London if location access fails
      }
    );
  }, []);

  const handleSubmit = async (type: RecommendationType) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRecommendation(generateMockRecommendation(type));
    setLoading(false);
  }

  const handleManualLocationSubmit = () => {
    const lat = parseFloat(manualLatitude);
    const lng = parseFloat(manualLongitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setLocation([lat, lng]);
    } else {
      alert("Please enter valid latitude and longitude values.");
    }
  }

  useEffect(() => {
    if (recommendation) {
      const container = L.DomUtil.get('map');
      if (container != null) {
        container._leaflet_id = null; // Reset the Leaflet map
      }
    }
  }, [recommendation]); // Reset when recommendation changes

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Advanced Crop Management</h1>
      <p className="text-lg mb-8">
        Our AI-powered system provides precise recommendations for optimal seeding and harvesting times, 
        taking into account various factors such as soil conditions, weather forecasts, harvester availability, 
        storage capacity, and market conditions.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Crop Selection</CardTitle>
          <CardDescription>Select your crop type for personalized recommendations based on your location.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Select onValueChange={(value) => setSelectedCrop(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              {crops.map(crop => (
                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Optimal Seeding Time</CardTitle>
            <CardDescription>Get AI-powered recommendations for the best time to seed your crops.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleSubmit('seeding')} 
              disabled={!location || loading || !selectedCrop}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Get Seeding Recommendation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimal Harvesting Time</CardTitle>
            <CardDescription>Receive recommendations for the ideal harvesting time based on multiple factors.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleSubmit('harvesting')} 
              disabled={!location || loading || !selectedCrop}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Get Harvesting Recommendation
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Manual Location Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter latitude"
              value={manualLatitude}
              onChange={(e) => setManualLatitude(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Enter longitude"
              value={manualLongitude}
              onChange={(e) => setManualLongitude(e.target.value)}
              className="p-2 border rounded"
            />
            <Button onClick={handleManualLocationSubmit}>Set Location Manually</Button>
          </div>
        </CardContent>
      </Card>

      {recommendation && location && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{recommendation.type === 'seeding' ? 'Seeding' : 'Harvesting'} Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              <strong>Recommended Date: </strong>
              {format(recommendation.date, 'MMMM d, yyyy')}
            </p>
            <p className="mb-4">{recommendation.details}</p>
            <div className="h-[300px] w-full">
              <MapContainer id="map" center={location} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Rectangle
                  bounds={[
                    [location[0] - 0.01, location[1] - 0.01],
                    [location[0] + 0.01, location[1] + 0.01],
                  ]}
                  pathOptions={{ color: recommendation.type === 'seeding' ? 'green' : 'orange' }}
                />
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About Our Advanced Crop Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our Advanced Crop Management system is a gift to all farmers, designed to optimize farming operations 
            and maximize yields while ensuring the highest quality produce. By leveraging cutting-edge AI technology 
            and comprehensive data analysis, we provide farmers with precise, actionable insights.
          </p>
          <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Meter-precise seeding recommendations based on soil conditions and local climate data.</li>
            <li>Optimal harvesting time predictions considering grain quality, protein levels, and moisture content.</li>
            <li>Integration of real-time and forecasted weather data for informed decision-making.</li>
            <li>Consideration of harvester availability and efficiency to optimize resource allocation.</li>
            <li>Analysis of local mill capacity and grain storage levels to prevent bottlenecks.</li>
            <li>Market-driven recommendations to maximize financial returns for farmers.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
