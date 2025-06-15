"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ExploreContent from "@/components/ExploreContent";

export default function ExplorePage() {
  const [events, setEvents] = useState([]);
  const [tours, setTours] = useState([]);
  const [kuliners, setKuliners] = useState([]);
  
  // State untuk authentication
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch data
  useEffect(() => {
    // Fetch events
    const unsubEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch tours
    const unsubTours = onSnapshot(collection(db, "tours"), (snapshot) => {
      setTours(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch kuliners
    const unsubKuliners = onSnapshot(collection(db, "kuliners"), (snapshot) => {
      setKuliners(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubEvents();
      unsubTours();
      unsubKuliners();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} userData={userData} />
      <ExploreContent events={events} tours={tours} kuliners={kuliners} />
      <Footer />
    </div>
  );
}