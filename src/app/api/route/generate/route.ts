import { NextResponse } from 'next/server';
import type { RoutePreferences } from '@/components/map/route-generator';

// Helper function to generate a random number within a range
function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// Helper function to generate a point at a specific distance and bearing from start
function generatePoint(start: [number, number], distanceKm: number, bearing: number): [number, number] {
  const R = 6371; // Earth's radius in km
  const d = distanceKm / R;
  const lat1 = start[1] * Math.PI / 180;
  const lon1 = start[0] * Math.PI / 180;
  const bearingRad = bearing * Math.PI / 180;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) +
    Math.cos(lat1) * Math.sin(d) * Math.cos(bearingRad)
  );

  const lon2 = lon1 + Math.atan2(
    Math.sin(bearingRad) * Math.sin(d) * Math.cos(lat1),
    Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
  );

  return [
    (lon2 * 180 / Math.PI + 540) % 360 - 180, // Normalize longitude
    lat2 * 180 / Math.PI
  ];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startLocation, preferences } = body as {
      startLocation: [number, number];
      preferences: RoutePreferences;
    };

    if (!startLocation || !preferences) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Generate waypoints based on preferences
    const numPoints = Math.max(5, Math.floor(preferences.distance / 0.5));
    const points: [number, number][] = [startLocation];
    
    // Generate a circular-ish route
    for (let i = 1; i < numPoints; i++) {
      const progress = i / numPoints;
      const angle = progress * 360 + randomInRange(-20, 20);
      const distance = (preferences.distance / numPoints) * randomInRange(0.8, 1.2);
      
      const newPoint = generatePoint(
        points[points.length - 1],
        distance,
        angle
      );
      points.push(newPoint);
    }

    // Close the loop by returning to start
    points.push(startLocation);

    const route = {
      type: 'Feature',
      properties: {
        difficulty: preferences.difficulty,
        duration: preferences.duration,
        distance: preferences.distance,
        description: preferences.description
      },
      geometry: {
        type: 'LineString',
        coordinates: points
      }
    };

    return NextResponse.json(route);
  } catch (error) {
    console.error('Error generating route:', error);
    return NextResponse.json(
      { error: 'Failed to generate route' },
      { status: 500 }
    );
  }
} 