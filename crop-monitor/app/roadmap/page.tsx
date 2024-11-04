import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const roadmapItems = [
  {
    title: "Real-time Data Integration",
    description: "Integrate live data feeds from drones and ground sensors for up-to-the-minute crop monitoring.",
    status: "In Progress",
    eta: "Q3 2023"
  },
  {
    title: "Advanced AI Image Analysis",
    description: "Enhance our AI algorithms to detect early signs of crop diseases and nutrient deficiencies from drone imagery.",
    status: "Planned",
    eta: "Q4 2023"
  },
  {
    title: "Mobile App Development",
    description: "Create a mobile application for on-the-go access to crop data and alerts.",
    status: "Planned",
    eta: "Q1 2024"
  },
  {
    title: "Predictive Yield Modeling",
    description: "Implement machine learning models to forecast crop yields based on historical data and current conditions.",
    status: "Research",
    eta: "Q2 2024"
  },
  {
    title: "Automated Drone Fleet Management",
    description: "Develop a system for scheduling and managing autonomous drone flights for continuous monitoring.",
    status: "Planned",
    eta: "Q3 2024"
  },
  {
    title: "Integration with Farm Management Software",
    description: "Create APIs and plugins to integrate Crop Monitor data with popular farm management software solutions.",
    status: "Research",
    eta: "Q4 2024"
  },
  {
    title: "Precision Agriculture Recommendations",
    description: "Provide AI-driven recommendations for precision application of water, fertilizers, and pesticides.",
    status: "Planned",
    eta: "Q1 2025"
  },
  {
    title: "Climate Change Impact Analysis",
    description: "Develop tools to analyze and predict the impact of climate change on crop performance and farm operations.",
    status: "Research",
    eta: "Q2 2025"
  }
]

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in progress':
      return 'bg-blue-500'
    case 'planned':
      return 'bg-yellow-500'
    case 'research':
      return 'bg-purple-500'
    default:
      return 'bg-gray-500'
  }
}

export default function Roadmap() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crop Monitor Roadmap</h1>
      <p className="text-lg mb-8">
        Our development roadmap outlines the exciting features and improvements we're working on to make Crop Monitor even more powerful and user-friendly. Here's what you can look forward to:
      </p>
      <div className="space-y-6">
        {roadmapItems.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{item.title}</CardTitle>
                <Badge className={`${getStatusColor(item.status)} text-white`}>{item.status}</Badge>
              </div>
              <CardDescription>Estimated completion: {item.eta}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}