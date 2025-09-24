import React, { useEffect, useState } from "react";
import PlaceAutocompleteElement from "@/components/PlaceAutocompleteElement";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelsList } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendToGemini } from '../service/AIModal.jsx'   
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios"; 
import { db } from "@/service/firebaseConfig.jsx";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from "react-router-dom";
export default function CreateTrip() {
  const [formData, setFormData] = useState({
    destination: null,     // the Place object
    destinationLabel: "",  // what you show to users
    days: "",
    budget: null,
    travelWith: null,
  });
  const [openDailog,setOpenDailog] = useState(false);

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
  const handleInputChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const selectKey = (item, index) => item?.id ?? item?.value ?? item?.title ?? index;

  const login= useGoogleLogin ({
    onSuccess:(codeResp)=>GetUserProfile(codeResp),
      onError:(error) => console.log(error)
  })

  // normalize whatever sendToGemini returns into a plain string
async function toPlainText(ai) {
  if (typeof ai === "string") return ai.trim();

  // SDK style: obj.text()
  if (ai && typeof ai.text === "function") {
    const t = await ai.text();
    return String(t ?? "").trim();
  }

  // Some wrappers: ai.response.text()
  if (ai?.response && typeof ai.response.text === "function") {
    const t = await ai.response.text();
    return String(t ?? "").trim();
  }

  // Other common fields
  if (typeof ai?.output_text === "string") return ai.output_text.trim();
  if (typeof ai?.content === "string") return ai.content.trim();

  // Last resort: JSON
  return JSON.stringify(ai ?? "");
}

function extractFirstJson(text = "") {
  // If there’s a ```json ... ``` block, grab it; else use the whole string
  const m = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const body = (m ? m[1] : text).trim();
  try { return JSON.parse(body); } catch { return null; } // parse if valid, else null
}

const onGenerateTrip = async() => {

  
 
  const user = localStorage.getItem('user');

  if (!user) 
  {
    setOpenDailog(true)
    return;
  }
  const days = Number(formData.days);



  const missing = [];
  if (!formData.destination) missing.push("destination");
  if (!days || days < 1) missing.push("valid number of days (≥ 1)");
  if (!formData.budget) missing.push("budget");
  if (!formData.travelWith) missing.push("who you're travelling with");
  if (missing.length) {
    toast.error(`Please complete: ${missing.join(", ")}`);
    return;
  }

  if (days > 5) {
    toast("Heads up: longer trips (> 5 days) may take a little longer to generate.");
  }

  // Titles from stored objects
  const budgetTitle = formData.budget?.title ?? "Moderate";
  const travelTitle = formData.travelWith?.title ?? "Just Me";

  const payload = {
    destination: {
      id: formData.destination.id,
      label: formData.destinationLabel,
      location:
        typeof formData.destination.location?.toJSON === "function"
          ? formData.destination.location.toJSON()
          : formData.destination.location,
    },
    days,
    budget: budgetTitle,
    travelWith: travelTitle,
  };

  console.log("Submit payload:", payload);
  toast.success("Trip preferences captured! Generating your itinerary…");


  setLoading(true)
  const FINAL_PROMPT = AI_PROMPT
    .replaceAll("{destinationLabel}", String(formData.destinationLabel || ""))
    .replaceAll("{days}", String(days))
    .replaceAll("{budget}", String(budgetTitle))
    .replaceAll("{travelWith}", String(travelTitle))
+ `
Return ONLY a single valid JSON object, no markdown, no code fences, no comments.
Follow this schema EXACTLY (keys & casing must match). If unknown, use null.

{
  "trip_plan": {
    "destination": "string",
    "traveler": "string",
    "budget": "string",
    "duration_days": number,

    "hotel_options": [{
      "name": "string",
      "area_neighbourhood": "string",
      "star_rating": number,
      "price_range_sgd": "string",
      "room_type": "string",
      "exact_location": "string",
      "walk_to_transit_mins": number,
      "why_good_for_just_me": "string",
      "image_url": "string",              // direct, hotlinkable image URL
      "maps_search_query": "string"   // keep as plain text to plug into Google Maps
    }],

    "daily_plan": [{
      "day": number,                   // 1..duration_days
      "summary": "string",
      "morning": {
        "activities": [{
          "name": "string",
          "description": "string",
          "time_range": "string",      // e.g. "09:00–11:00"
          "address": "string",
          "lat": number,               // decimal degrees or null
          "lng": number,
          "ticket_price_sgd": number | null,
          "booking_url": "string" | null,
          "category": "sightseeing | museum | food | nature | shopping | nightlife | activity | other"
        }]
      },
      "afternoon": { "activities": [ /* same shape as morning.activities */ ] },
      "evening":   { "activities": [ /* same shape as morning.activities */ ] }
    }],

    "attractions": [{
      "name": "string",
      "why_go": "string",
      "best_time": "string",
      "lat": number | null,
      "lng": number | null,
      "image_url": "string",              // direct, hotlinkable image URL
      "maps_search_query": "string"
    }]
  }
}

`;
  // console.log(FINAL_PROMPT);
try {
  const raw = await sendToGemini(FINAL_PROMPT);
  const replyText = await toPlainText(raw);

  if (!replyText) {
    toast.error("AI returned an empty response. Please try again.");
    return;
  }

  await SaveAiTrip(replyText);
} catch (e) {
  console.error("AI error:", e);
  toast.error("Failed to generate itinerary.");
} finally {
  setLoading(false);
}
};

// const SaveAiTrip=async(TripData)=> {
//     setLoading(true);

//   const user=JSON.parse(localStorage.getItem('user'))
//   // add a new doc in firebase collection "AITrips"
//   const docId = Date.now().toString()
//   await setDoc(doc(db, "AITrips", docId), {
//     userSelection: formData,
//     tripData : TripData,
//     userEmail:user?.email,
//     id:docId
//   });
//     setLoading(false)

// }
const SaveAiTrip = async (tripText) => {
  setLoading(true);

  let docId = Date.now().toString();

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    // const docId = Date.now().toString();

    const parsed = extractFirstJson(tripText); // object or null

    // normalize destination to serializable primitives only
    const dest = formData.destination;
    const destination = dest
      ? {
          id: dest.id ?? null,
          label: formData.destinationLabel ?? "",
          formattedAddress: dest.formattedAddress ?? null,
          location:
            typeof dest.location?.toJSON === "function"
              ? dest.location.toJSON() // {lat, lng}
              : dest.location ?? null,
        }
      : null;

    await setDoc(doc(db, "AITrips", docId), {
      userSelection: {
        destination,
        days: formData.days ?? "",
        budget: formData.budget ?? null,
        travelWith: formData.travelWith ?? null,
      },
      tripData: parsed,                      // parsed JSON if available (or null)
      tripDataText: String(tripText ?? ""),  // always store raw text too
      userEmail: user?.email ?? null,
      createdAt: serverTimestamp(),
      id: docId,
    });

    toast.success("Trip saved!");
  } catch (e) {
    console.error("Failed to save trip:", e);
    toast.error("Failed to save trip");
  } finally {
    setLoading(false);
    navigate('/view-trip/'+ docId)
  }
};

 const GetUserProfile=(tokenInfo)=> {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,  {
      headers: {
        Authorization:  `Bearer ${tokenInfo.access_token}  `,
        Accept: 'Application/json'
      }
    }).then((resp)=> {
      console.log(resp)
      localStorage.setItem('user', JSON.stringify(resp.data))
      setOpenDailog(false); //close the dialog
      onGenerateTrip() // if sign in successful then carry out the generation of the trip
    })
  }
  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information and our trip planner will generate the best itinerary based on your preference.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        {/* Destination */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is your destination of choice?</h2>
<PlaceAutocompleteElement
  value={formData.destinationLabel}       // React drives the text
  onChangeText={(text) =>                 // update while typing
    handleInputChange("destinationLabel", text)
  }
  onSelect={(place) => {                  // update when selecting a suggestion
    const label = place?.displayName?.text || place?.formattedAddress || "";
    handleInputChange("destination", {
      id: place.id,
      location:
        typeof place.location?.toJSON === "function"
          ? place.location.toJSON()
          : place.location ?? null,
      formattedAddress: place?.formattedAddress ?? null,
    });
    handleInputChange("destinationLabel", label);
  }}
  placeholder="Search a country or place…"
/>
{formData.destinationLabel && (
  <div className="mt-3">
    <Input
      readOnly
      value={formData.destinationLabel}
      className="text-gray-500 italic" // makes it look like a placeholder
    />
  </div>
)}
        </div>

        {/* Days */}
        <div>
          <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            min={1}
            inputMode="numeric"
            value={formData.days}
            onChange={(e) => handleInputChange("days", e.target.value)}
          />
        </div>

        {/* Budget */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
{SelectBudgetOptions.map((item) => {
  const selected = formData.budget?.id === item.id;
  return (
    <button
      type="button"
      key={item.id}
      onClick={() => handleInputChange("budget", item)}   // store object
      className={`p-4 border rounded-lg text-left transition ${
        selected ? "border-black ring-2 ring-black/10" : "border-gray-200 hover:shadow"
      }`}
    >
      <h2 className="text-4xl">{item.icon}</h2>
      <h2 className="font-bold text-lg">{item.title}</h2>
      <h2 className="text-sm text-gray-500">{item.desc}</h2>
    </button>
  );
})}
          </div>
        </div>

        {/* Travel With */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on travelling with on your next adventure?
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelsList.map((item) => {
  const selected = formData.travelWith?.id === item.id;
  return (
    <button
      type="button"
      key={item.id}
      onClick={() => handleInputChange("travelWith", item)} // store object
      className={`p-4 border rounded-lg text-left transition ${
        selected ? "border-black ring-2 ring-black/10" : "border-gray-200 hover:shadow"
      }`}
    >
      <h2 className="text-4xl">{item.icon}</h2>
      <h2 className="font-bold text-lg">{item.title}</h2>
      <h2 className="text-sm text-gray-500">{item.desc}</h2>
    </button>
  );
})}
          </div>
        </div>

        <div className="my-10 justify-end flex">
<Button 
disabled={loading}
onClick={onGenerateTrip}>
{loading?
<AiOutlineLoading3Quarters className="h-7 w-7 animate-spin"/> : "Generate Trip"
}</Button>

        </div>
        <Dialog open={openDailog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg"></img>
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p> Sign in to the app with Google authentication securely</p>
           
              <Button 
              onClick={login}
              className='w-full mt-5 flex gap-4 items-center'>

                <FcGoogle className="h-7 w-7"/>
                Sign In With Google 
                </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
