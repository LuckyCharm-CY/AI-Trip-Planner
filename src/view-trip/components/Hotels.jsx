// // // import React from 'react'
// // // import { Link } from 'react-router-dom'
// // // function Hotels({trip}) {
// // //   return (
// // //     <div>
// // //       <h2 className='font-bold text-xl mt-5'>Hotel Recommendations</h2>


// // //       <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 '>
// // //         {trip?.tripData?.hotel_options?.map((hotel,index) => (
// // //             <Link to={'https://www/google.com/maps/search/?api=1&query='+hotel?.exact_location} target='_blank'>
// // //             <div className='hover:scale-105 transition-all'>
// // //                 <img src="/logo.png" className='rounded-xl'></img>
// // //                 <div className='my-2 flex flex-col gap-2'>
// // //                      <h2 className='font-medium '>{hotel.name}</h2>
// // //                      <h2 className='text-xs text-gray-500'>📍 {hotel.exact_location}</h2>
// // //                      <h2 className='text-sm'>💰 ${hotel.price_range_sgd} per night</h2>
// // //                      <h2 className='text-sm'>⭐️ {hotel.star_rating} </h2>


// // //                 </div>
// // //             </div>
// // //             </Link>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default Hotels
// // import React from "react";

// // function Hotels({ trip }) {
// //   const hotels = trip?.tripData?.trip_plan?.hotel_options ?? [];

// //   if (!hotels.length) return null; // or render a nice empty state

// //   return (
// //     <div>
// //       <h2 className="font-bold text-xl mt-5">Hotel Recommendations</h2>

// //       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
// //         {hotels.map((hotel, index) => {
// //           const name = hotel?.name ?? "Unnamed hotel";
// //           const loc =
// //             hotel?.exact_location || hotel?.area_neighbourhood || "";
// //           const price = hotel?.price_range_sgd || "N/A";
// //           const stars = Number(hotel?.star_rating ?? 0);
// //           const mapsQuery = encodeURIComponent(loc || name);
// //           const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

// //           return (
// //             <a
// //               key={`${name}-${index}`}
// //               href={mapsUrl}
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="hover:scale-105 transition-all block"
// //             >
// //               <img src="/logo.png" alt={name} className="rounded-xl" />
// //               <div className="my-2 flex flex-col gap-2">
// //                 <h2 className="font-medium">{name}</h2>
// //                 <h3 className="text-xs text-gray-500">📍 {loc || "—"}</h3>
// //                 <h3 className="text-sm">💰 {price} per night</h3>
// //                 <h3 className="text-sm">⭐️ {stars}</h3>
// //               </div>
// //             </a>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Hotels;
// import React, { useEffect, useMemo, useState } from "react";
// import { GetPlaceDetails } from "@/service/GlobalApi";

// const photoUrlFromName = (name) =>
//   `https://places.googleapis.com/v1/${name}/media?maxHeightPx=600&maxWidthPx=600&key=${
//     import.meta.env.VITE_GOOGLE_PLACES_API_KEY
//   }`;

// export default function Hotels({ trip }) {
//   // keep hotels stable
//   const hotels = useMemo(
//     () =>
//       Array.isArray(trip?.tripData?.trip_plan?.hotel_options)
//         ? trip.tripData.trip_plan.hotel_options
//         : [],
//     [trip]
//   );

//   const [photos, setPhotos] = useState({}); // index -> photo URL

//   const fallbackQuery = useMemo(
//     () =>
//       trip?.userSelection?.destination?.formattedAddress ||
//       trip?.userSelection?.destination?.label ||
//       trip?.tripData?.trip_plan?.destination ||
//       "",
//     [trip]
//   );

//   // stable key so the effect only runs when the list meaningfully changes
//   const hotelKey = useMemo(
//     () =>
//       hotels
//         .map(
//           (h) =>
//             `${h?.name ?? ""}|${h?.exact_location ?? ""}|${
//               h?.area_neighbourhood ?? ""
//             }`
//         )
//         .join("~"),
//     [hotels]
//   );

//   useEffect(() => {
//     let cancelled = false;

//     async function fetchPhotos() {
//       // if empty, clear once (only if it isn't already empty) and bail
//       if (!hotels.length) {
//         setPhotos((prev) => (Object.keys(prev).length ? {} : prev));
//         return;
//       }

//       const next = {};
//       await Promise.allSettled(
//         hotels.map(async (hotel, i) => {
//           try {
//             const query =
//               hotel?.exact_location ||
//               hotel?.area_neighbourhood ||
//               hotel?.name ||
//               fallbackQuery;

//             if (!query) {
//               next[i] = "/logo.png";
//               return;
//             }

//             const { data } = await GetPlaceDetails({ textQuery: query });
//             const place = Array.isArray(data?.places) ? data.places[0] : null;
//             const photoName = place?.photos?.[0]?.name;
//             next[i] = photoName ? photoUrlFromName(photoName) : "/logo.png";
//           } catch {
//             next[i] = "/logo.png";
//           }
//         })
//       );

//       if (!cancelled) {
//         // only update if something actually changed
//         const same =
//           Object.keys(next).length === Object.keys(photos).length &&
//           Object.keys(next).every((k) => next[k] === photos[k]);
//         if (!same) setPhotos(next);
//       }
//     }

//     fetchPhotos();
//     return () => {
//       cancelled = true;
//     };
//     // depend on stable primitives, not the array
//   }, [hotelKey, fallbackQuery]); // eslint-disable-line react-hooks/exhaustive-deps

//   if (!hotels.length) return null;

//   const mapsHref = (q) =>
//     q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : "#";

//   return (
//     <section>
//       <h2 className="font-bold text-xl mt-5">Hotel Recommendations</h2>

//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//         {hotels.map((hotel, index) => {
//           const name = hotel?.name ?? "Unnamed hotel";
//           const loc = hotel?.exact_location || hotel?.area_neighbourhood || "";
//           const price = hotel?.price_range_sgd || "N/A";
//           const stars = Number(hotel?.star_rating ?? 0);
//           const href = mapsHref(loc || name);
//           const src = photos[index] || hotel?.image_url || "/logo.png";

//           return (
//             <a
//               key={`${name}-${index}`}
//               href={href}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="hover:scale-105 transition-all block"
//             >
//               <img
//                 src={src}
//                 alt={name}
//                 className="rounded-xl h-40 w-full object-cover"
//                 loading="lazy"
//                 onError={(e) => (e.currentTarget.src = "/logo.png")}
//               />
//               <div className="my-2 flex flex-col gap-2">
//                 <h3 className="font-medium">{name}</h3>
//                 <p className="text-xs text-gray-500">📍 {loc || "—"}</p>
//                 <p className="text-sm">💰 {price} per night</p>
//                 <p className="text-sm">⭐️ {stars}{stars === 1 ? " star" : " stars"}</p>
//               </div>
//             </a>
//           );
//         })}
//       </div>
//     </section>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import { GetPlaceDetails } from "@/service/GlobalApi";

const photoUrlFromName = (name) =>
  `https://places.googleapis.com/v1/${name}/media?maxHeightPx=600&maxWidthPx=600&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`;

export default function Hotels({ trip }) {
  // 1) stable list of hotels
  const hotels = useMemo(
    () =>
      Array.isArray(trip?.tripData?.trip_plan?.hotel_options)
        ? trip.tripData.trip_plan.hotel_options
        : [],
    [trip]
  );

  // 2) destination string to strengthen queries
  const destination =
    trip?.userSelection?.destination?.formattedAddress ||
    trip?.userSelection?.destination?.label ||
    trip?.tripData?.trip_plan?.destination ||
    "";

  // 3) photo cache (index -> url)
  const [photos, setPhotos] = useState({});

  // 4) stable key so effect only runs when hotels meaningfully change
  const hotelKey = useMemo(
    () =>
      hotels
        .map(
          (h) =>
            `${h?.name ?? ""}|${h?.exact_location ?? ""}|${
              h?.area_neighbourhood ?? ""
            }`
        )
        .join("~"),
    [hotels]
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchPhotos() {
      if (!hotels.length) {
        setPhotos({});
        return;
      }

      const next = {};
      await Promise.allSettled(
        hotels.map(async (h, i) => {
          try {
            // Strong query: "Hotel Name, Destination" -> better chance of photos
            const query =
              [h?.name, destination].filter(Boolean).join(", ") ||
              h?.exact_location ||
              h?.area_neighbourhood ||
              h?.name ||
              destination;

            if (!query) {
              next[i] = "/logo.png";
              return;
            }

            const { data } = await GetPlaceDetails({ textQuery: query });
            const places = Array.isArray(data?.places) ? data.places : [];

            // prefer a place with photos; prefer lodging if present
            const withPhotos = places.filter((p) => p?.photos?.length);
            const lodging =
              withPhotos.find((p) => p?.types?.includes?.("lodging")) ||
              withPhotos[0];

            const photoName = lodging?.photos?.[0]?.name; // first photo is the safest
            next[i] = photoName ? photoUrlFromName(photoName) : "/logo.png";
          } catch {
            next[i] = "/logo.png";
          }
        })
      );

      if (!cancelled) setPhotos(next);
    }

    fetchPhotos();
    return () => {
      cancelled = true;
    };
  }, [hotelKey, destination]);

  if (!hotels.length) return null;

  const mapsHref = (q) =>
    q
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
      : "#";

  return (
    <section>
      <h2 className="font-bold text-xl mt-5">Hotel Recommendations</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {hotels.map((hotel, index) => {
          const name = hotel?.name ?? "Unnamed hotel";
          const loc = hotel?.exact_location || hotel?.area_neighbourhood || "";
          const price = hotel?.price_range_sgd || "N/A";
          const stars = Number(hotel?.star_rating ?? 0);
          const href = mapsHref(loc || name);
          const src = photos[index] || hotel?.image_url || "/logo.png";

          return (
            <a
              key={`${name}-${index}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition-all block"
            >
              <img
                src={src}
                alt={name}
                className="rounded-xl h-40 w-full object-cover"
                loading="lazy"
                onError={(e) => (e.currentTarget.src = "/logo.png")}
              />
              <div className="my-2 flex flex-col gap-2">
                <h3 className="font-medium">{name}</h3>
                <p className="text-xs text-gray-500">📍 {loc || "—"}</p>
                <p className="text-sm">💰 {price} per night</p>
                <p className="text-sm">
                  ⭐️ {stars}
                  {stars === 1 ? " star" : " stars"}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
