import React, { useEffect, useMemo, useState } from "react";
import { GetPlaceDetails } from "@/service/GlobalApi";

const placesMediaUrl = (name) =>
  `https://places.googleapis.com/v1/${name}/media?maxHeightPx=600&maxWidthPx=1000&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`;

export default function UserTripCardItem({ trip, onClick }) {
  const plan = trip?.tripData?.trip_plan || {};
  const destination =
    plan.destination ||
    trip?.userSelection?.destination?.label ||
    trip?.userSelection?.destination?.formattedAddress ||
    "Your trip";

  const days = plan.duration_days || Number(trip?.userSelection?.days) || 1;
  const budget = plan.budget || trip?.userSelection?.budget?.title || "Budget not set";
  const traveler = plan.traveler || trip?.userSelection?.travelWith?.title || "Solo trip";

  const queryText = useMemo(
    () =>
      trip?.userSelection?.destination?.formattedAddress ||
      trip?.userSelection?.destination?.label ||
      plan.destination ||
      "",
    [trip, plan.destination]
  );

  const [imgSrc, setImgSrc] = useState("/logo.png");

  useEffect(() => {
    let cancelled = false;
    async function fetchPhoto() {
      if (!queryText) {
        setImgSrc("/logo.png");
        return;
      }
      try {
        const { data } = await GetPlaceDetails({ textQuery: queryText });
        const photoName = data?.places?.[0]?.photos?.[0]?.name;
        if (!cancelled && photoName) setImgSrc(placesMediaUrl(photoName));
      } catch {
        /* keep placeholder */
      }
    }
    fetchPhoto();
    return () => { cancelled = true; };
  }, [queryText]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="h-full flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={destination}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/logo.png")}
        />
      </div>

      {/* Content section with consistent spacing */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 leading-tight">
          {destination}
        </h3>
        
        {/* Trip details in a clean grid */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="text-base">📅</span>
              <span className="font-medium">Duration:</span>
              <span>{days} {days > 1 ? "days" : "day"}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="text-base">💰</span>
              <span className="font-medium">Budget:</span>
              <span className="truncate">{budget}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="text-base">👥</span>
              <span className="font-medium">Travelers:</span>
              <span className="truncate">{traveler}</span>
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}