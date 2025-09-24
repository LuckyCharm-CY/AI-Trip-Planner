import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function PlaceAutocompleteElement({
  onSelect,
  placeholder = "Search a city or place…",
  options = {    includedPrimaryTypes: ["country", "locality", "administrative_area_level_1"],
}, 
}) {
  const hostRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    let el;
    let handler;

    loader.load().then(async (google) => {
      const { PlaceAutocompleteElement } = await google.maps.importLibrary("places");
      el = new PlaceAutocompleteElement(options);

      // Placeholder isn't in the reference, but is supported by the widget today.
      // Safe to keep; if Google changes this, you can remove it.
      try { el.placeholder = placeholder; } catch {}

      handler = async (evt) => {
        const { placePrediction } = evt; // PlacePrediction
        if (!placePrediction) return;
        const place = placePrediction.toPlace(); // -> Place
        await place.fetchFields({
          // ask only for what you need to keep billing lean
          fields: ["displayName", "formattedAddress", "location", "id"],
        });
        onSelect?.(place);
      };

      el.addEventListener("gmp-select", handler);

      if (hostRef.current) {
        hostRef.current.innerHTML = "";
        hostRef.current.appendChild(el);
      }
    });

    return () => {
      if (el && handler) el.removeEventListener("gmp-select", handler);
      if (el && el.remove) el.remove();
    };
  }, [onSelect, placeholder, JSON.stringify(options)]);

  return <div ref={hostRef} className="w-full" />;
}
