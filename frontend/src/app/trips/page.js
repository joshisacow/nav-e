"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import IconButton from '@/components/utils/IconButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { getTrips, deleteTrip } from '@/services/api-requests';
import LoadingSpinner from '@/components/utils/LoadingSpinner'
import { faFileExport } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const page = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [savedTrips, setSavedTrips] = useState([]); // array of TripArrays
  const [loadingTrips, setLoadingTrips] = useState(false);  
  
  async function fetchTrips() {
    if (currentUser) {
      setLoadingTrips(true);
      const tripData = await getTrips(currentUser.uid);
      setSavedTrips(tripData);
      setLoadingTrips(false);
    }
  }

  useEffect(() => {
    // redirect to login if not logged in
    // if (!currentUser) {
    //   router.push('/login');
    // }

    fetchTrips();
  }, [currentUser])

  async function handleDeleteTrip (index) {
    await deleteTrip(currentUser.uid, index);
    fetchTrips();
  }
  console.log(savedTrips);
  return (
    <div>
      saved trips
      <IconButton
        icon="home"
        onClick={() => router.push('/')}
        className="text-lg px-3 py-2 bg-gray-200 rounded-lg box-content ml-6 hover:bg-gray-300 active:bg-gray-400"
      />

      {/* if loading show spinner  */}
      {loadingTrips 
        ? <LoadingSpinner /> 

        : savedTrips.length > 0 

        // Check if savedTrips is not empty
          ? ( 
            savedTrips.map((trip, index) => {
              return (
                <div key={index} className="border flex-col"> {/* Adding a unique key for each trip */}
                  <div className="flex mr-8"> 
                    <h1>Trip</h1>
                    <IconButton
                      icon="close"
                      onClick={() => handleDeleteTrip(index)}
                      className=" px-1 bg-gray-200 rounded-lg box-content ml-6 hover:bg-gray-300 active:bg-gray-400"
                    />
                    <Link
                      href={{
                        pathname: '/',
                        query: {
                          trip: JSON.stringify(trip)
                        }
                      }}
                      className=" px-1 bg-gray-200 rounded-lg box-content ml-6 hover:bg-gray-300 active:bg-gray-400"
                    >
                      <FontAwesomeIcon icon={faFileExport} />
                    </Link>
                  </div>
                  {trip.map((dest, index) => {
                    const det = dest.details.result;
                    return (
                      <div key={det.name} className="flex" > {/* Adding a unique key for each destination */}
                        <h2>{index+1}. {det.name} </h2>
                        <h3>({det.formatted_address})</h3>
                      </div>
                    );
                  })}

                  
                </div>
              );
            })
          ) 
          
          : <p>No trips found.</p> // Display a message when there are no saved trips
      }
    </div>
  )
}

export default page