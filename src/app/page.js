"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import HeroSection from "@/components/ui/HeroSection";
import CategorySection from "@/components/ui/CategorySection";
import DestinationCarousel from "@/components/DestinationCarousel";
import Navbar from "@/components/ui/Navbar";
import AllCategorySections from "@/components/AllCategorySections";
import YourDiscoveryFeed from "@/components/YourDiscoveryFeed";
import Footer from "@/components/ui/Footer";

export default function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tours, setTours] = useState([]);
  const [kuliners, setKuliners] = useState([]);
  
  // TAMBAH: State untuk authentication
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // TAMBAH: Handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Ambil data user dari Firestore
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

  // Ambil data events
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(data);
      setFiltered(data);
    });

    return () => unsub();
  }, []);

  // Ambil data tours dan kuliners
  useEffect(() => {
    const unsubTours = onSnapshot(collection(db, "tours"), (snapshot) => {
      setTours(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubKuliners = onSnapshot(collection(db, "kuliners"), (snapshot) => {
      setKuliners(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubTours();
      unsubKuliners();
    };
  }, []);

  const handleFilterChange = (filters, data) => {
    let filtered = [data];

    if (filters.location && filters.location !== "all") {
      filtered = filtered.filter((event) =>
        event.lokasi?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(
        (event) => event.kategori?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.date) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.tanggal_event?.toDate());
        const filterDate = new Date(filters.date);
        return eventDate.toDateString() === filterDate.toDateString();
      });
    }

    if (filters.search) {
      filtered = filtered.filter((event) =>
        [event.nama_event, event.deskripsi, event.lokasi]
          .join(" ")
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      );
    }

    setFiltered(filtered);

    const filteredEvents = handleFilterChange(filters, events);
    const filteredTours = handleFilterChange(filters, tours);
    const filteredKuliners = handleFilterChange(filters, kuliners);

    setEvents(filteredEvents);
    setTours(filteredTours);
    setKuliners(filteredKuliners);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Pass user dan userData ke Navbar */}
      <Navbar user={user} userData={userData} />
      <HeroSection onFilterChange={handleFilterChange} />
      <AllCategorySections events={filtered} tours={tours} kuliners={kuliners} />
      <DestinationCarousel />
      <YourDiscoveryFeed></YourDiscoveryFeed>
      <Footer></Footer>
    </div>
  );
}