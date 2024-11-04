'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Upload, Loader2 } from 'lucide-react';

// Function to send the image to the backend for analysis
const processImage = async (file: File): Promise<{
  plantCount: number,
  vitality: number,
  location: [number, number]
}> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('http://localhost:5000/api/analyze-plants', { // Ensure this is correct
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image analysis failed');
  }

  const result = await response.json();
  return {
    plantCount: result.plantCount,
    vitality: result.vitality,
    location: result.location,
  };
}

export default function ImageAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    plantCount: number,
    vitality: number,
    location: [number, number]
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile && selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
      } else {
        alert('Please upload a valid image file.');
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setProcessing(true);
    try {
      const analysisResult = await processImage(file);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('There was an error processing the image. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Image Analysis</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Drone Image</CardTitle>
          <CardDescription>Upload a drone image for AI analysis of crop count and vitality.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Select Image</Label>
              <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <Button type="submit" disabled={!file || processing}>
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload and Analyze
                </>
              )}
            </Button>
          </form>
          {result && (
            <Button onClick={handleReset} className="mt-4">Reset</Button>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p><strong>Plant Count:</strong> {result.plantCount}</p>
              <p><strong>Vitality Score:</strong> {result.vitality}%</p>
            </div>
            <div className="h-[400px] w-full">
              <MapContainer center={result.location} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={result.location}>
                  <Popup>
                    Plant Count: {result.plantCount}<br />
                    Vitality: {result.vitality}%
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
