'use client'

import React, { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
type Props = {}

const Map = (props: Props) => {
    const mapRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
                version: "weekly",
            })

            const { Map } = await loader.importLibrary("maps")
            const position = {
                lat: 4.6722,
                lng: 74.0629
            }

            // map options
            const mapOptions: google.maps.MapOptions = {
                center: position,
                zoom: 8,
                mapId: "NEXT_JS_MAP",
            }

            //sETUP MAP

            const map = new Map(mapRef.current as HTMLDivElement, mapOptions)
        }
        initMap()
    }, [])
  return (
    <div style={{ height: '600px'}} ref={mapRef}/>
  )
}

export default Map