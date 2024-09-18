'use client'

import mapboxgl from 'mapbox-gl'
import React, { useRef, useEffect, useState } from 'react'

type Props = {
  data: GeoJSON.GeoJSON
}

function Mapbox({ data }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [lng, setLng] = useState(-58.507)
  const [lat, setLat] = useState(-34.53)
  const [zoom, setZoom] = useState(11.53)
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PK!
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/cdrioboo/ckkpkadh722xq17ov0y0bp44p',
        center: [lng, lat],
        zoom,
        maxZoom: 22,
      })

      // Add zoom controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-left')

      // Add your custom markers and lines here

      map.on('load', () => {
        map.addSource('transito', {
          type: 'geojson',
          data,
        })
        map.addLayer(
          {
            id: 'transito-heat',
            type: 'heatmap',
            source: 'transito',
            maxzoom: 22,
          },
          'waterway-label',
        )
        map.addLayer(
          {
            id: 'transito-point',
            type: 'circle',
            source: 'transito',
            minzoom: 14,
          },
          'waterway-label',
        )
      })

      map.on('move', () => {
        setLng(+map.getCenter().lng.toFixed(4))
        setLat(+map.getCenter().lat.toFixed(4))
        setZoom(+map.getZoom().toFixed(2))
      })

      // Clean up on unmount
      return () => map.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mr-5">
      <div ref={mapContainer} className="h-[350px]" />
    </div>
  )
}

export default Mapbox
