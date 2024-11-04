import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Droplets, ThermometerSun, TrendingUp, Map } from 'lucide-react'

const features = [
  {
    icon: <Leaf className="h-8 w-8 text-green-500" />,
    title: "Crop Health Monitoring",
    description: "AI-powered analysis of drone imagery to detect early signs of crop stress, disease, or pest infestations."
  },
  {
    icon: <Map className="h-8 w-8 text-blue-500" />,
    title: "Interactive Field Mapping",
    description: "Detailed, interactive maps of your fields with overlays for various data points and historical comparisons."
  },
  {
    icon: <Droplets className="h-8 w-8 text-blue-500" />,
    title: "Soil Moisture Tracking",
    description: "Real-time monitoring of soil moisture levels to optimize irrigation and prevent water stress."
  },
  {
    icon: <ThermometerSun className="h-8 w-8 text-yellow-500" />,
    title: "Weather Integration",
    description: "Incorporation of local weather data and forecasts to aid in planning farm operations."
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
    title: "Growth Analytics",
    description: "Track and analyze crop growth rates over time, with predictive modeling for harvest timing and yield estimation."
  }
]

export default function Features() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crop Monitor Features</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                {feature.icon}
                <span className="ml-2">{feature.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}