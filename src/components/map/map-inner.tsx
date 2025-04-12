"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const { BaseLayer } = LayersControl;

const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const buildOverpassQuery = (lat: number, lng: number) => `
  [out:json][timeout:25];
  (
    node["amenity"](around:1000,${lat},${lng});
    node["shop"](around:1000,${lat},${lng});
    node["tourism"](around:1000,${lat},${lng});
    node["leisure"](around:1000,${lat},${lng});
    node["historic"](around:1000,${lat},${lng});
  );
  out body;
`;

function DynamicPOILoader({ setPois }: { setPois: Function }) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      fetchPOIs(center.lat, center.lng);
    },
  });

  const fetchPOIs = async (lat: number, lng: number) => {
    const query = buildOverpassQuery(lat, lng);
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    if (!res.ok) {
      console.error("Overpass API Error:", res.status);
      return;
    }

    const data = await res.json();
    const points = data.elements
      .filter((el: any) => el.lat && el.lon)
      .map((el: any) => ({
        id: el.id,
        lat: el.lat,
        lng: el.lon,
        name: el.tags?.name || "Unnamed",
        type:
          el.tags?.amenity ||
          el.tags?.shop ||
          el.tags?.tourism ||
          el.tags?.leisure ||
          el.tags?.historic ||
          "POI",
      }));

    setPois(points);
  };

  return null;
}

export default function MapInner() {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [pois, setPois] = useState<
    { id: number; lat: number; lng: number; name: string; type: string }[]
  >([]);

  const firstLoadRef = useRef(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(coords);
        if (firstLoadRef.current) {
          firstLoadRef.current = false;
          const query = buildOverpassQuery(coords[0], coords[1]);
          const res = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query,
          });
          const data = await res.json();
          const points = data.elements
            .filter((el: any) => el.lat && el.lon)
            .map((el: any) => ({
              id: el.id,
              lat: el.lat,
              lng: el.lon,
              name: el.tags?.name || "Unnamed",
              type:
                el.tags?.amenity ||
                el.tags?.shop ||
                el.tags?.tourism ||
                el.tags?.leisure ||
                el.tags?.historic ||
                "POI",
            }));
          setPois(points);
        }
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  if (!userPosition) return <div>Getting your location...</div>;

  return (
    <MapContainer
      center={userPosition}
      zoom={16}
      scrollWheelZoom={true}
      className="h-[800px] w-full rounded-md z-10"
    >
      <LayersControl position="topright">
        <BaseLayer checked name="Street Map">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>
        <BaseLayer name="Satellite View">
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye...'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>
      </LayersControl>

      {/* Dynamic POI loading */}
      <DynamicPOILoader setPois={setPois} />

      {/* User Marker */}
      <Marker position={userPosition} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* POI Markers */}
      {pois.map((poi) => (
        <Marker key={poi.id} position={[poi.lat, poi.lng]}>
          <Popup>
            <strong>{poi.name}</strong>
            <br />
            Type: {poi.type}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
