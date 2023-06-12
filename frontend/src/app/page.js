"use client"

import Image from 'next/image'
import { useState } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import Map from '@/components/Map'
import SearchBar from '@/components/SearchBar'


export default function Home() {
  const { isLoaded, loadError } = useLoadScript({ 
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  if (!isLoaded) return 'Loading...';
  if (loadError) return 'Error loading maps';

  return ( <Map />
  )
}

