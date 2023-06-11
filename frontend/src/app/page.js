"use client"

import Image from 'next/image'
import { useMemo } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import Map from '@/components/Map'


export default function Home() {
  const { isLoaded, loadError } = useLoadScript({ 
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return 'Loading...';
  if (loadError) return 'Error loading maps';

  return (
    <div class = "wrapper">
      <Map />
      <div className="search-bar">
        Nav-E
      </div>
    </div>
  )
}

