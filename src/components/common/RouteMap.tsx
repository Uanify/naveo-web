/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

interface RouteMapProps {
  origin: { lat: number; lng: number; name: string };
  destination: { lat: number; lng: number; name: string };
  onRouteInfo?: (info: { distanceKm: number; durationMin: number }) => void;
}

export function RouteMap({ origin, destination, onRouteInfo }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const isMapLoaded = useRef(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // ✅ Inicializar mapa (solo una vez)
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    if (!mapboxgl.accessToken) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN");
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [origin.lng, origin.lat],
      zoom: 12,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      isMapLoaded.current = true;
    });

    // ✅ Cleanup (evita leaks cuando desmontas el componente)
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
      isMapLoaded.current = false;
    };
  }, [origin.lng, origin.lat]);

  // ✅ Calcular ruta cada vez que cambian los puntos
  useEffect(() => {
    if (!map.current) return;
    if (!origin || !destination) return;
    if (!mapboxgl.accessToken) return;

    const controller = new AbortController();

    const setMarkers = () => {
      // remove previous markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const originMarker = new mapboxgl.Marker({ color: "#2563eb" })
        .setLngLat([origin.lng, origin.lat])
        .addTo(map.current!);

      const destinationMarker = new mapboxgl.Marker({ color: "#C60002" })
        .setLngLat([destination.lng, destination.lat])
        .addTo(map.current!);

      markersRef.current.push(originMarker, destinationMarker);
    };

    const getRoute = async () => {
      if (!map.current) return;
      if (!isMapLoaded.current) return;

      try {
        // ✅ ETA más realista con tráfico (si prefieres, usa "mapbox/driving")
        const profile = "mapbox/driving-traffic";

        const res = await fetch(
          `https://api.mapbox.com/directions/v5/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`,
          { method: "GET", signal: controller.signal }
        );

        if (!res.ok) throw new Error(`Mapbox Directions error: ${res.status}`);

        const json = await res.json();
        const route0 = json?.routes?.[0];
        if (!route0?.geometry?.coordinates) return;

        const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route0.geometry.coordinates,
          },
        };

        const existingSource = map.current.getSource("route") as
          | mapboxgl.GeoJSONSource
          | undefined;

        if (existingSource) {
          existingSource.setData(geojson as any);
        } else {
          // ✅ addLayer solo después de load
          map.current.addLayer({
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: geojson as any,
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#2563eb",
              "line-width": 4,
              "line-opacity": 0.75,
            },
          });
        }

        // Fit bounds
        const bounds = new mapboxgl.LngLatBounds()
          .extend([origin.lng, origin.lat])
          .extend([destination.lng, destination.lat]);

        map.current.fitBounds(bounds, { padding: 40 });

        // ✅ Manda info al form (metros -> km, segundos -> min)
        onRouteInfo?.({
          distanceKm: Number((route0.distance / 1000).toFixed(2)),
          durationMin: Math.max(1, Math.round(route0.duration / 60)),
        });
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error(err);
        }
      }
    };

    setMarkers();

    if (!isMapLoaded.current) {
      map.current.once("load", getRoute);
    } else {
      getRoute();
    }

    return () => controller.abort();
  }, [origin, destination, onRouteInfo]);

  return <div ref={mapContainer} className="h-full w-full" />;
}
