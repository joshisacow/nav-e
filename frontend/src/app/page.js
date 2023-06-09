"use client"

import Image from 'next/image'
import { useMemo } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'


export default function Home() {
  const { isLoaded, loadError } = useLoadScript({ 
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return 'Loading...';
  if (loadError) return 'Error loading maps';

  return <Map />;


    // <main className="flex min-h-screen flex-col justify-between p-24">
    //   Nav-E
      

    // </main>
}

function Map() {
  const mapContainerStyle = {
    width: '100%',
    height: '100vh',
  };

  const center = useMemo( () => ({
    lat: 44,
    lng: -80,
  }), []);

  return (
    <GoogleMap 
      zoom ={10} 
      center={center} 
      mapContainerStyle = {mapContainerStyle}> 
      <Marker 
        position={center} 
        // icon = {"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
      />
    </GoogleMap>

  )
}
