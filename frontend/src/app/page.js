"use client"

import { useLoadScript } from '@react-google-maps/api'
import Map from '@/components/map/Map'
import { useSearchParams } from 'next/navigation';

const libraries = ['places']

export default function Home() {
  // initialize google maps
  const { isLoaded, loadError } = useLoadScript({ 
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const searchParams = useSearchParams();

  if (!isLoaded) return 'Loading...';
  if (loadError) return 'Error loading maps';

  return (
    <Map searchParams ={searchParams} /> 
  )
}
