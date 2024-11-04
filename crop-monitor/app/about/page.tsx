import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Crop Monitor</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Crop Monitor aims to empower farmers with cutting-edge technology, 
            combining AI-powered drone imagery analysis with advanced sensor data 
            to provide comprehensive insights into crop health, growth, and environmental conditions.
          </p>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Daily drone flights capture high-resolution imagery of your fields</li>
            <li>AI algorithms analyze the imagery to detect crop health, count plants, and identify potential issues</li>
            <li>Ground sensors provide real-time data on soil moisture, temperature, and other key metrics</li>
            <li>All data is integrated into an easy-to-use dashboard for informed decision-making</li>
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Early detection of crop stress and diseases</li>
            <li>Optimized resource allocation (water, fertilizer, pesticides)</li>
            <li>Improved crop yield forecasting</li>
            <li>Reduced environmental impact through precision agriculture</li>
            <li>Data-driven decision making for better farm management</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}