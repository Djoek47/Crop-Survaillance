import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapComponent({ mapCenter, mockData, userPosition, setSelectedCrop }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(mapCenter, 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(mapCenter)
    }
  }, [mapCenter])

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Circle) {
          mapInstanceRef.current.removeLayer(layer)
        }
      })

      mockData.crops.forEach((crop) => {
        const icon = L.icon({
          iconUrl: crop.logo,
          iconSize: [25, 25],
          iconAnchor: [12.5, 25],
          popupAnchor: [0, -25],
        })

        L.marker(crop.position, { icon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <h3 class="font-bold">${crop.type}</h3>
            <p>Count: ${crop.count}</p>
            <p>Growth: ${crop.growth}%</p>
          `)
          .on('click', () => setSelectedCrop(crop))
      })

      mockData.damages.forEach((damage) => {
        L.circle(damage.position, {
          radius: damage.radius,
          color: 'red',
          fillColor: 'red'
        })
          .addTo(mapInstanceRef.current)
          .bindPopup(damage.type)
      })

      mockData.sensors.forEach((sensor) => {
        L.circle(sensor.position, {
          radius: 20,
          color: 'blue',
          fillColor: 'blue'
        })
          .addTo(mapInstanceRef.current)
          .bindPopup(`Humidity Sensor: ${sensor.humidity}%`)
      })

      if (userPosition) {
        const userIcon = L.icon({
          iconUrl: '/images/user-icon.png',
          iconSize: [25, 25],
          iconAnchor: [12.5, 25],
          popupAnchor: [0, -25],
        })

        L.marker(userPosition, { icon: userIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup('Your Location')
      }
    }
  }, [mockData, userPosition, setSelectedCrop])

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
}