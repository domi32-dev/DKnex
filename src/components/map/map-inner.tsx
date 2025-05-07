"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { RouteGenerator, RoutePreferences } from "./route-generator";
import { Feature, LineString } from "geojson";

export default function MapLibreMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const defaultCoords: [number, number] = [10.4515, 51.1657]; // Germany (longitude, latitude)

    function createMap(center: [number, number]) {
      if (!mapRef.current) return;

      const map = new maplibregl.Map({
        container: mapRef.current,
        center,
        zoom: 13,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              maxzoom: 19,
              attribution:
                '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            },
          },
          layers: [
            {
              id: "osm-tiles",
              type: "raster",
              source: "osm",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        maxZoom: 19,
        minZoom: 0,
      });

      const nav = new NavigationControl({});
      map.addControl(nav, "top-right");
      mapInstance.current = map;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userCoords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setCurrentLocation(userCoords);
        createMap(userCoords);
      },
      () => {
        // Fallback: Germany
        createMap(defaultCoords);
      },
      { enableHighAccuracy: true }
    );

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const handleGenerateRoute = async (preferences: RoutePreferences) => {
    if (!currentLocation || !mapInstance.current) return;

    try {
      const response = await fetch('/api/route/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startLocation: currentLocation,
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate route');
      }

      const route: Feature<LineString> = await response.json();

      // Add the route to the map
      if (mapInstance.current.getSource('route')) {
        (mapInstance.current.getSource('route') as maplibregl.GeoJSONSource).setData(route);
      } else {
        const source: maplibregl.GeoJSONSourceSpecification = {
          type: 'geojson',
          data: route
        };

        mapInstance.current.addSource('route', source);
        mapInstance.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 3
          }
        });
      }
    } catch (error) {
      console.error('Error generating route:', error);
    }
  };

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "85vh",
        position: "relative"
      }}
    >
      <RouteGenerator onGenerateRoute={handleGenerateRoute} />
    </div>
  );
}
