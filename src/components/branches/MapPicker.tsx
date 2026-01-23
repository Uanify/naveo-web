"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { RiMapPinUserLine } from "@remixicon/react";

interface MapPickerProps {
  onLocationSelect: (data: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
}

export function MapPicker({
  onLocationSelect,
  initialLocation,
}: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const mapInitialized = useRef(false);

  // Update marker position when initialLocation changes from outside (e.g. search)
  useEffect(() => {
    if (map.current && marker.current && initialLocation) {
      const { lat, lng } = initialLocation;
      marker.current.setLngLat([lng, lat]);
      map.current.flyTo({ center: [lng, lat], zoom: 16 });
    }
  }, [initialLocation]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || mapInitialized.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;
    mapInitialized.current = true;

    const center: [number, number] = initialLocation
      ? [initialLocation.lng, initialLocation.lat]
      : [-99.1332, 19.4326]; // Mexico City default

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: center,
        zoom: 13,
      });

      marker.current = new mapboxgl.Marker({
        draggable: true,
        color: "#3b82f6",
      })
        .setLngLat(center)
        .addTo(map.current);

      marker.current.on("dragend", () => {
        const lngLat = marker.current?.getLngLat();
        if (lngLat) {
          onLocationSelect({ lat: lngLat.lat, lng: lngLat.lng });
        }
      });

      map.current.on("click", (e) => {
        marker.current?.setLngLat(e.lngLat);
        onLocationSelect({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      });

      map.current.on("load", () => {
        map.current?.resize();
      });
    } catch (error) {
      console.error("Error initializing Mapbox:", error);
    }

    return () => {
      map.current?.remove();
      mapInitialized.current = false;
    };
  }, []);

  const locateUser = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        if (map.current && marker.current) {
          map.current.flyTo({ center: [longitude, latitude], zoom: 16 });
          marker.current.setLngLat([longitude, latitude]);
          onLocationSelect({ lat: latitude, lng: longitude });
        }
      });
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* Locate Button */}
      <button
        onClick={locateUser}
        type="button"
        className="absolute bottom-10 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 hover:bg-white transition-all hover:scale-105 active:scale-95 dark:bg-gray-950/90 dark:border-gray-800"
        title="Mi ubicación"
      >
        <RiMapPinUserLine className="size-6 text-blue-600 dark:text-blue-400" />
      </button>

      {/* Center Marker Hint (Custom marker is handled by Mapbox) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <div className="size-4 rounded-full border-2 border-blue-500" />
      </div>
    </div>
  );
}
