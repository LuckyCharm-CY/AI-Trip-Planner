// // import React from "react";

// // export default function PlacesToVisit({ trip }) {
// //   const plan = trip?.tripData?.trip_plan ?? {};
// //   const days = Array.isArray(plan.daily_plan) ? plan.daily_plan : [];
// //   const attractions = Array.isArray(plan.attractions) ? plan.attractions : [];

// //   if (!days.length && !attractions.length) {
// //     return (
// //       <section>
// //         <h2 className="font-bold text-lg">Places to Visit</h2>
// //         <p className="text-sm text-gray-500 mt-2">No places returned for this trip.</p>
// //       </section>
// //     );
// //   }

// //   const mapsHref = (q) =>
// //     q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : undefined;

// //   const Img = ({ src, alt, className }) => (
// //     <img
// //       src={src || "/logo.png"}
// //       alt={alt || ""}
// //       className={className}
// //       onError={(e) => { e.currentTarget.src = "/logo.png"; }}
// //       loading="lazy"
// //     />
// //   );

// //   const Slot = ({ label, slot }) => {
// //     const acts = Array.isArray(slot?.activities) ? slot.activities : [];
// //     if (!acts.length) return null;

// //     return (
// //       <div className="mt-4">
// //         <div className="text-sm font-semibold uppercase tracking-wide text-gray-600">
// //           {label}
// //         </div>

// //         <ul className="mt-2 space-y-3">
// //           {acts.map((a, i) => {
// //             const query = a?.maps_search_query || a?.address || a?.name || "";
// //             const href = mapsHref(query);
// //             const img = a?.image_url;

// //             return (
// //               <li key={`${label}-${i}`} className="p-3 rounded-xl border bg-white/60">
// //                 <div className="flex items-start gap-3">
// //                   {/* Thumbnail */}
// //                   <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
// //                     <Img src={img} alt={a?.name || "Activity"} className="w-full h-full object-cover" />
// //                   </div>

// //                   {/* Text block */}
// //                   <div className="min-w-0 flex-1">
// //                     <div className="flex items-center justify-between gap-3">
// //                       <div className="min-w-0">
// //                         <div className="font-medium truncate">{a?.name || "Place"}</div>
// //                         <div className="mt-0.5 text-xs text-gray-600 flex flex-wrap gap-2">
// //                           {a?.time_range && <span>⏰ {a.time_range}</span>}
// //                           {a?.address && <span>📍 {a.address}</span>}
// //                           {typeof a?.ticket_price_sgd === "number" && (
// //                             <span>💸 ~S${a.ticket_price_sgd}</span>
// //                           )}
// //                         </div>
// //                       </div>

// //                       {href && (
// //                         <a
// //                           href={href}
// //                           target="_blank"
// //                           rel="noreferrer"
// //                           className="shrink-0 text-xs px-3 py-1.5 rounded-full border hover:bg-gray-50"
// //                         >
// //                           Open in Maps
// //                         </a>
// //                       )}
// //                     </div>

// //                     {a?.description && (
// //                       <p className="mt-2 text-sm text-gray-700 leading-relaxed">
// //                         {a.description}
// //                       </p>
// //                     )}
// //                   </div>
// //                 </div>
// //               </li>
// //             );
// //           })}
// //         </ul>
// //       </div>
// //     );
// //   };

// //   return (
// //     <section>
// //       <h2 className="font-bold text-lg">Places to Visit</h2>

// //       {/* Day-by-day plan */}
// //       <div className="mt-4 space-y-6">
// //         {days.map((d, idx) => (
// //           <article key={d?.day ?? idx} className="p-5 rounded-2xl border shadow-sm bg-white">
// //             <header className="flex items-start justify-between gap-3">
// //               <div className="flex items-center gap-3">
// //                 <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100">
// //                   Day {d?.day ?? idx + 1}
// //                 </span>
// //                 {d?.summary && <p className="text-sm text-gray-600">{d.summary}</p>}
// //               </div>
// //             </header>

// //             <Slot label="Morning" slot={d?.morning} />
// //             <Slot label="Afternoon" slot={d?.afternoon} />
// //             <Slot label="Evening" slot={d?.evening} />
// //           </article>
// //         ))}
// //       </div>

// //       {/* Bonus attractions */}
// //       {attractions.length > 0 && (
// //         <div className="mt-10">
// //           <h3 className="font-semibold">Bonus Attractions</h3>
// //           <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //             {attractions.map((a, i) => {
// //               const href = mapsHref(a?.maps_search_query || a?.name || "");
// //               const img = a?.image_url;

// //               return (
// //                 <a key={i} href={href} target="_blank" rel="noreferrer" className="block group">
// //                   <article className="rounded-2xl border bg-white overflow-hidden hover:shadow-md transition">
// //                     <div className="aspect-[16/10] bg-gray-100">
// //                       <Img src={img} alt={a?.name || "Attraction"} className="h-full w-full object-cover" />
// //                     </div>
// //                     <div className="p-4">
// //                       <div className="font-medium">{a?.name || "Attraction"}</div>
// //                       {a?.why_go && <p className="text-sm text-gray-700 mt-1 line-clamp-3">{a.why_go}</p>}
// //                       {a?.best_time && (
// //                         <p className="text-xs text-gray-500 mt-1">Best time: {a.best_time}</p>
// //                       )}
// //                       {href && (
// //                         <span className="text-xs underline mt-2 inline-block">Open in Maps</span>
// //                       )}
// //                     </div>
// //                   </article>
// //                 </a>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       )}
// //     </section>
// //   );
// // }
// import React, { useEffect, useMemo, useState } from "react";
// import { GetPlaceDetails } from "@/service/GlobalApi";

// // build a Places media URL from a photo "name"
// const photoUrlFromName = (name) =>
//   `https://places.googleapis.com/v1/${name}/media?maxHeightPx=600&maxWidthPx=600&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`;

// export default function PlacesToVisit({ trip }) {
//   const plan = trip?.tripData?.trip_plan ?? {};
//   const days = Array.isArray(plan.daily_plan) ? plan.daily_plan : [];
//   const attractions = Array.isArray(plan.attractions) ? plan.attractions : [];

//   // fallback text when we need to guess a place to search for
//   const fallbackQuery =
//     trip?.userSelection?.destination?.formattedAddress ||
//     trip?.userSelection?.destination?.label ||
//     plan?.destination ||
//     "";

//   // ---- Photo cache (key -> url) ----
//   const [photos, setPhotos] = useState({}); // { key: url }

//   // Build a stable list of items we might need photos for
//   const itemsNeedingPhotos = useMemo(() => {
//     const list = [];

//     const pushAct = (keyPrefix, a) => {
//       const key = `${keyPrefix}:${a?.name || a?.address || a?.maps_search_query || ""}`;
//       const query = a?.maps_search_query || a?.address || a?.name || fallbackQuery || "";
//       const prefilled = a?.image_url || null; // AI-supplied image (if any)
//       list.push({ key, query, prefilled });
//     };

//     days.forEach((d, dIdx) => {
//       const slots = [
//         ["Morning", d?.morning],
//         ["Afternoon", d?.afternoon],
//         ["Evening", d?.evening],
//       ];
//       slots.forEach(([label, slot]) => {
//         const acts = Array.isArray(slot?.activities) ? slot.activities : [];
//         acts.forEach((a, i) => pushAct(`day${d?.day ?? dIdx + 1}:${label}:${i}`, a));
//       });
//     });

//     attractions.forEach((a, i) => {
//       const key = `attr:${i}:${a?.name || a?.maps_search_query || ""}`;
//       const query = a?.maps_search_query || a?.name || fallbackQuery || "";
//       const prefilled = a?.image_url || null;
//       list.push({ key, query, prefilled });
//     });

//     return list;
//   }, [days, attractions, fallbackQuery]);

//   // Fetch missing photos (only for items that don't already have image_url or cached photo)
//   useEffect(() => {
//     let cancelled = false;

//     async function fetchAll() {
//       if (!itemsNeedingPhotos.length) return;

//       const next = { ...photos };

//       await Promise.allSettled(
//         itemsNeedingPhotos.map(async ({ key, query, prefilled }) => {
//           // If we already have something, skip
//           if (next[key]) return;

//           // If AI provided an image_url, use it
//           if (prefilled) {
//             next[key] = prefilled;
//             return;
//           }

//           // If no query, fallback to logo
//           if (!query) {
//             next[key] = "/logo.png";
//             return;
//           }

//           try {
//             const { data } = await GetPlaceDetails({ textQuery: query });
//             const place = Array.isArray(data?.places) ? data.places[0] : null;
//             const photoName = place?.photos?.[0]?.name;
//             next[key] = photoName ? photoUrlFromName(photoName) : "/logo.png";
//           } catch {
//             next[key] = "/logo.png";
//           }
//         })
//       );

//       if (!cancelled) {
//         setPhotos((prev) => {
//           // only update if changed
//           const same =
//             Object.keys(prev).length === Object.keys(next).length &&
//             Object.keys(prev).every((k) => prev[k] === next[k]);
//           return same ? prev : next;
//         });
//       }
//     }

//     fetchAll();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [itemsNeedingPhotos]);

//   if (!days.length && !attractions.length) {
//     return (
//       <section>
//         <h2 className="font-bold text-lg">Places to Visit</h2>
//         <p className="text-sm text-gray-500 mt-2">No places returned for this trip.</p>
//       </section>
//     );
//   }

//   const mapsHref = (q) =>
//     q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : undefined;

//   const Img = ({ src, alt, className }) => (
//     <img
//       src={src || "/logo.png"}
//       alt={alt || ""}
//       className={className}
//       onError={(e) => {
//         e.currentTarget.src = "/logo.png";
//       }}
//       loading="lazy"
//     />
//   );

//   const Slot = ({ label, slot, dayKey }) => {
//     const acts = Array.isArray(slot?.activities) ? slot.activities : [];
//     if (!acts.length) return null;

//     return (
//       <div className="mt-4">
//         <div className="text-sm font-semibold uppercase tracking-wide text-gray-600">
//           {label}
//         </div>

//         <ul className="mt-2 space-y-3">
//           {acts.map((a, i) => {
//             const query = a?.maps_search_query || a?.address || a?.name || "";
//             const href = mapsHref(query);
//             const key = `${dayKey}:${label}:${i}:${a?.name || a?.address || a?.maps_search_query || ""}`;
//             const img = a?.image_url || photos[key];

//             return (
//               <li key={key} className="p-3 rounded-xl border bg-white/60">
//                 <div className="flex items-start gap-3">
//                   {/* Thumbnail */}
//                   <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
//                     <Img src={img} alt={a?.name || "Activity"} className="w-full h-full object-cover" />
//                   </div>

//                   {/* Text block */}
//                   <div className="min-w-0 flex-1">
//                     <div className="flex items-center justify-between gap-3">
//                       <div className="min-w-0">
//                         <div className="font-medium truncate">{a?.name || "Place"}</div>
//                         <div className="mt-0.5 text-xs text-gray-600 flex flex-wrap gap-2">
//                           {a?.time_range && <span>⏰ {a.time_range}</span>}
//                           {a?.address && <span>📍 {a.address}</span>}
//                           {typeof a?.ticket_price_sgd === "number" && (
//                             <span>💸 ~S${a.ticket_price_sgd}</span>
//                           )}
//                         </div>
//                       </div>

//                       {href && (
//                         <a
//                           href={href}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="shrink-0 text-xs px-3 py-1.5 rounded-full border hover:bg-gray-50"
//                         >
//                           Open in Maps
//                         </a>
//                       )}
//                     </div>

//                     {a?.description && (
//                       <p className="mt-2 text-sm text-gray-700 leading-relaxed">
//                         {a.description}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     );
//   };

//   return (
//     <section>
//       <h2 className="font-bold text-lg">Places to Visit</h2>

//       {/* Day-by-day plan */}
//       <div className="mt-4 space-y-6">
//         {days.map((d, idx) => {
//           const dayKey = `day${d?.day ?? idx + 1}`;
//           return (
//             <article key={dayKey} className="p-5 rounded-2xl border shadow-sm bg-white">
//               <header className="flex items-start justify-between gap-3">
//                 <div className="flex items-center gap-3">
//                   <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100">
//                     Day {d?.day ?? idx + 1}
//                   </span>
//                   {d?.summary && <p className="text-sm text-gray-600">{d.summary}</p>}
//                 </div>
//               </header>

//               <Slot label="Morning" slot={d?.morning} dayKey={dayKey} />
//               <Slot label="Afternoon" slot={d?.afternoon} dayKey={dayKey} />
//               <Slot label="Evening" slot={d?.evening} dayKey={dayKey} />
//             </article>
//           );
//         })}
//       </div>

//       {/* Bonus attractions */}
//       {attractions.length > 0 && (
//         <div className="mt-10">
//           <h3 className="font-semibold">Bonus Attractions</h3>
//           <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {attractions.map((a, i) => {
//               const href = mapsHref(a?.maps_search_query || a?.name || "");
//               const key = `attr:${i}:${a?.name || a?.maps_search_query || ""}`;
//               const img = a?.image_url || photos[key];

//               return (
//                 <a key={key} href={href} target="_blank" rel="noreferrer" className="block group">
//                   <article className="rounded-2xl border bg-white overflow-hidden hover:shadow-md transition">
//                     <div className="aspect-[16/10] bg-gray-100">
//                       <Img src={img} alt={a?.name || "Attraction"} className="h-full w-full object-cover" />
//                     </div>
//                     <div className="p-4">
//                       <div className="font-medium">{a?.name || "Attraction"}</div>
//                       {a?.why_go && <p className="text-sm text-gray-700 mt-1 line-clamp-3">{a.why_go}</p>}
//                       {a?.best_time && (
//                         <p className="text-xs text-gray-500 mt-1">Best time: {a.best_time}</p>
//                       )}
//                       {href && <span className="text-xs underline mt-2 inline-block">Open in Maps</span>}
//                     </div>
//                   </article>
//                 </a>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import { GetPlaceDetails } from "@/service/GlobalApi";

const placesPhoto = (name) =>
  `https://places.googleapis.com/v1/${name}/media?maxHeightPx=600&maxWidthPx=600&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`;

const mapsHref = (q) =>
  q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : undefined;

// Swap to fallback once if the primary URL fails; then to /logo.png as last resort
function SmartImg({ primary, fallback, alt = "", className = "" }) {
  const [src, setSrc] = useState(primary || fallback || "/logo.png");
  useEffect(() => {
    setSrc(primary || fallback || "/logo.png");
  }, [primary, fallback]);
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (src !== fallback && fallback) setSrc(fallback);
        else if (src !== "/logo.png") setSrc("/logo.png");
      }}
    />
  );
}

export default function PlacesToVisit({ trip }) {
  const plan = trip?.tripData?.trip_plan ?? {};
  const days = Array.isArray(plan.daily_plan) ? plan.daily_plan : [];
  const attractions = Array.isArray(plan.attractions) ? plan.attractions : [];

  const fallbackQuery =
    trip?.userSelection?.destination?.formattedAddress ||
    trip?.userSelection?.destination?.label ||
    plan?.destination ||
    "";

  // Build list of things to get fallback photos for (we still fetch even if the AI gave image_url)
  const lookups = useMemo(() => {
    const list = [];
    const add = (key, query) => list.push({ key, query: query || fallbackQuery });

    days.forEach((d, di) => {
      [["Morning", d?.morning], ["Afternoon", d?.afternoon], ["Evening", d?.evening]].forEach(
        ([label, slot]) => {
          const acts = Array.isArray(slot?.activities) ? slot.activities : [];
          acts.forEach((a, i) =>
            add(`day${d?.day ?? di + 1}:${label}:${i}`, a?.maps_search_query || a?.address || a?.name)
          );
        }
      );
    });

    attractions.forEach((a, i) =>
      add(`attr:${i}`, a?.maps_search_query || a?.name)
    );

    return list;
  }, [days, attractions, fallbackQuery]);

  // cache of fallback (Places) photos: key -> url
  const [fallbackPhotos, setFallbackPhotos] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function fetchFallbacks() {
      if (!lookups.length) return;

      const next = { ...fallbackPhotos };

      // Fetch sequentially with a small delay to avoid 429s
      for (const { key, query } of lookups) {
        if (next[key] || !query) continue;
        try {
          const { data } = await GetPlaceDetails({ textQuery: query });
          const place = Array.isArray(data?.places) ? data.places[0] : null;
          const photoName = place?.photos?.[0]?.name;
          next[key] = photoName ? placesPhoto(photoName) : "/logo.png";
        } catch {
          next[key] = "/logo.png";
        }
        await new Promise((r) => setTimeout(r, 120));
        if (cancelled) return;
      }

      if (!cancelled) setFallbackPhotos(next);
    }

    fetchFallbacks();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookups]);

  if (!days.length && !attractions.length) {
    return (
      <section>
        <h2 className="font-bold text-lg">Places to Visit</h2>
        <p className="text-sm text-gray-500 mt-2">No places returned for this trip.</p>
      </section>
    );
  }

  const Slot = ({ label, slot, dayKey }) => {
    const acts = Array.isArray(slot?.activities) ? slot.activities : [];
    if (!acts.length) return null;

    return (
      <div className="mt-4">
        <div className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          {label}
        </div>
        <ul className="mt-2 space-y-3">
          {acts.map((a, i) => {
            const key = `${dayKey}:${label}:${i}`;
            const href = mapsHref(a?.maps_search_query || a?.address || a?.name || "");
            return (
              <li key={key} className="p-3 rounded-xl border bg-white/60">
                <div className="flex items-start gap-3">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <SmartImg
                      primary={a?.image_url}                // AI-provided
                      fallback={fallbackPhotos[key]}         // Places backup
                      alt={a?.name || "Activity"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{a?.name || "Place"}</div>
                        <div className="mt-0.5 text-xs text-gray-600 flex flex-wrap gap-2">
                          {a?.time_range && <span>⏰ {a.time_range}</span>}
                          {a?.address && <span>📍 {a.address}</span>}
                          {typeof a?.ticket_price_sgd === "number" && <span>💸 ~S${a.ticket_price_sgd}</span>}
                        </div>
                      </div>
                      {href && (
                        <a href={href} target="_blank" rel="noreferrer" className="shrink-0 text-xs px-3 py-1.5 rounded-full border hover:bg-gray-50">
                          Open in Maps
                        </a>
                      )}
                    </div>
                    {a?.description && <p className="mt-2 text-sm text-gray-700 leading-relaxed">{a.description}</p>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <section>
      <h2 className="font-bold text-lg">Places to Visit</h2>

      <div className="mt-4 space-y-6">
        {days.map((d, idx) => {
          const dayKey = `day${d?.day ?? idx + 1}`;
          return (
            <article key={dayKey} className="p-5 rounded-2xl border shadow-sm bg-white">
              <header className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100">
                    Day {d?.day ?? idx + 1}
                  </span>
                  {d?.summary && <p className="text-sm text-gray-600">{d.summary}</p>}
                </div>
              </header>
              <Slot label="Morning"   slot={d?.morning}   dayKey={dayKey} />
              <Slot label="Afternoon" slot={d?.afternoon} dayKey={dayKey} />
              <Slot label="Evening"   slot={d?.evening}   dayKey={dayKey} />
            </article>
          );
        })}
      </div>

      {attractions.length > 0 && (
        <div className="mt-10">
          <h3 className="font-semibold">Bonus Attractions</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {attractions.map((a, i) => {
              const key = `attr:${i}`;
              const href = mapsHref(a?.maps_search_query || a?.name || "");
              return (
                <a key={key} href={href} target="_blank" rel="noreferrer" className="block group">
                  <article className="rounded-2xl border bg-white overflow-hidden hover:shadow-md transition">
                    <div className="aspect-[16/10] bg-gray-100">
                      <SmartImg
                        primary={a?.image_url}                // AI-provided
                        fallback={fallbackPhotos[key]}         // Places backup
                        alt={a?.name || "Attraction"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="font-medium">{a?.name || "Attraction"}</div>
                      {a?.why_go && <p className="text-sm text-gray-700 mt-1 line-clamp-3">{a.why_go}</p>}
                      {a?.best_time && <p className="text-xs text-gray-500 mt-1">Best time: {a.best_time}</p>}
                      {href && <span className="text-xs underline mt-2 inline-block">Open in Maps</span>}
                    </div>
                  </article>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
