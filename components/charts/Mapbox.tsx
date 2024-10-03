'use client'

import mapboxgl from 'mapbox-gl'
import React, { useEffect } from 'react'

type Props = {
  data: GeoJSON.GeoJSON
}

function Mapbox({ data }: Props) {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/cdrioboo/ckkpkadh722xq17ov0y0bp44p',
      center: [-58.507, -34.53],
      zoom: 11.53,
      maxZoom: 22,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_PK!,
    })

    // Add zoom controls
    // map.addControl(new mapboxgl.NavigationControl(), 'top-left')

    // Add your custom markers and lines here

    map.on('load', () => {
      map.addSource('transito', {
        type: 'geojson',
        data,
      })
      map.addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: 'transito',
        paint: {
          // Control the radius to smooth out the heatmap
          'heatmap-radius': {
            stops: [
              [0, 5], // Zoom level 0, radius 5 (smaller spheres at low zoom)
              [15, 30], // Zoom level 15, radius 50 (larger spheres at higher zoom)
            ],
          },

          // Lower the heatmap intensity for a more diffuse look
          'heatmap-intensity': {
            stops: [
              [0, 0.1], // Zoom level 0, low intensity
              [15, 0.5], // Zoom level 15, moderate intensity
            ],
            type: 'exponential', // Use an exponential scale for the stops
          },

          // Make the heatmap more transparent for smoother appearance
          'heatmap-opacity': 0.6, // 60% opacity for a more subtle effect

          // Use a smoother heatmap color transition
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(0, 0, 255, 0)', // Transparent to Blue (cold) at low density
            0.2,
            'rgb(0, 0, 255)', // Blue (cool)
            0.4,
            'rgb(0, 255, 0)', // Green (warming up)
            0.6,
            'rgb(255, 255, 0)', // Yellow (hot)
            0.8,
            'rgb(255, 165, 0)', // Orange (very hot)
            1,
            'rgb(255, 0, 0)', // Red (extremely hot)
          ],
        },
      })
      map.addLayer({
        id: 'transito-point',
        type: 'circle',
        source: 'transito',
        minzoom: 14,
      })
    })

    // Clean up on unmount
    return () => map.remove()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div id="map" className="mr-5 h-[380px]"></div>
}

export default Mapbox
