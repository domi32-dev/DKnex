"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapLibreMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const defaultCoords: [number, number] = [10.4515, 51.1657]; // Germany (longitude, latitude)

    function createMap(center: [number, number]) {
      const map = new maplibregl.Map({
        container: mapRef.current as HTMLElement,
        center,
        zoom: 13,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution:
                '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            },
          },
          layers: [
            {
              id: "osm-tiles",
              type: "raster",
              source: "osm",
            },
          ],
        },
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");
      mapInstance.current = map;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userCoords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        createMap(userCoords);
      },
      () => {
        // Fallback: Germany
        createMap(defaultCoords);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "85vh",
      }}
    />
  );
}
