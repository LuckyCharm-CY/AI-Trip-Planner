import React, { useEffect, useState } from "react";
import {IoIosSend} from "react-icons/io"
import { Button } from "@/components/ui/button";
import { GetPlaceDetails } from '@/service/GlobalApi';


const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACES_API_KEY
function InfoSection({trip}) {

    const [photoUrl, setPhotoUrl] = useState();
useEffect(() => {
  if (!trip) return;
  GetPlacePhoto();
}, [trip]);

const GetPlacePhoto = async () => {
  try {
    const query =
      trip?.userSelection?.destination?.formattedAddress ||
      trip?.userSelection?.destination?.label ||
      trip?.tripData?.trip_plan?.destination ||
      "";

    if (!query) return; // nothing to look up

    const { data } = await GetPlaceDetails({ textQuery: query });
    console.log("Place details:", data.places[0].photos[3].name);

    const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', data.places[0].photos[3].name)

    setPhotoUrl(PhotoUrl)
    console.log(PhotoUrl)
  } catch (e) {
    console.error("GetPlacePhoto failed:", e);
  }
};



  return (
    <div>
      <img src={photoUrl} className='h-[340px] w-full object-cover rounded-xl'/>
    <div className='flex justify-between items-center'>

      <div className=' my-5 flex flex-col gap-2'>
        <h2 className='font-bold text-2xl'>{trip?.userSelection?.destination?.formattedAddress}</h2>
        <div className='flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'> 📅 {trip.userSelection?.days} Day</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'> 💰 {trip.userSelection?.budget?.title} Budget</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'> 👥 No. Of Traveler: {trip.userSelection?.travelWith?.people} </h2>
        </div>

        </div>
        <Button><IoIosSend/></Button>
      </div>
    </div>
  )
}

export default InfoSection
