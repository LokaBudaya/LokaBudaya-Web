"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

import HeroSection from "@/components/ui/HeroSection";
import CategorySection from "@/components/ui/CategorySection";
import DestinationCarousel from "@/components/DestinationCarousel";
import Navbar from "@/components/ui/Navbar";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [tours, setTours] = useState([]);
  const [kuliners, setKuliners] = useState([]);

  // Ambil data events
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(data);
      setFilteredEvents(data);
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

  const handleFilterChange = (filters) => {
    let filtered = events;

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

    setFilteredEvents(filtered);
  };

  return (
    <div>
      <Navbar></Navbar>
      <HeroSection onFilterChange={handleFilterChange} />
      <CategorySection events={filteredEvents} tours={tours} kuliners={kuliners} />
      <DestinationCarousel />
    </div>
  );
}
