import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "@/service/firebaseConfig";
import UserTripCardItem from "./components/UserTripCardItem";

export default function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function GetUserTrips() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) {
        navigate("/");
        return;
      }

      try {
        const q = query(
          collection(db, "AITrips"),
          where("userEmail", "==", user.email)
        );
        const snap = await getDocs(q);

        const items = [];
        snap.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });

        setUserTrips(items);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>

      {loading && <p className="mt-6 text-gray-500">Loading your trips…</p>}

      {!loading && userTrips.length === 0 && (
        <p className="mt-6 text-gray-500">No trips yet.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10">
        {userTrips.map((trip) => (
          <UserTripCardItem
            key={trip.id}
            trip={trip}
            onClick={() => navigate(`/view-trip/${trip.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
