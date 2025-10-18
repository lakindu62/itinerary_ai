import React, { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@frontend/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';
import { ActivityDto, ItineraryDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
// no explicit GeoJSON type imports needed

interface MapComponentProps {
  itinerary: ItineraryDto | null;
  selectedPlace: ActivityDto | null;
  onPlaceSelect: (place: ActivityDto | null) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  itinerary,
  selectedPlace,
  onPlaceSelect
}) => {
  console.log("🚀 ~ MapComponent ~ selectedPlace:", selectedPlace)
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const isMapLoadedRef = useRef<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const routeTimeoutRef = useRef<number | null>(null);

  const mapboxToken = "pk.eyJ1IjoibGFraW5kdTYyIiwiYSI6ImNtZjExZ2IycTFpbDkya3M3Y3plM3J6M24ifQ.zyO0dcbxZbMArJvMwfPX6w";

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapboxToken) {
      console.warn('Mapbox token is not set. Please set NEXT_PUBLIC_MAPBOX_API_KEY');
    }
    mapboxgl.accessToken = mapboxToken;

    // If token is missing, skip initializing the map to avoid runtime errors
    if (!mapboxToken) {
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3522, 48.8566], // Default to Paris
      zoom: 12,
      pitch: 45,
    });

    map.current.on('load', () => {
      isMapLoadedRef.current = true;
      setMapLoaded(true);
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    return () => {
      if (map.current) {
        map.current.remove();
      }
      isMapLoadedRef.current = false;
      setMapLoaded(false);
      if (routeTimeoutRef.current) {
        window.clearTimeout(routeTimeoutRef.current);
        routeTimeoutRef.current = null;
      }
    };
  }, [mapboxToken]);

  // // Add resize observer to handle container size changes
  // useEffect(() => {
  //   if (!mapContainer.current || !map.current) return;

  //   const resizeObserver = new ResizeObserver(() => {
  //     if (map.current) {
  //       // Small delay to ensure the DOM has updated

  //       map.current?.resize();

  //     }
  //   });

  //   resizeObserver.observe(mapContainer.current);

  //   return () => {
  //     resizeObserver.disconnect();
  //   };
  // }, []);

  const normalizeCoordinates = (coords: unknown): [number, number] | null => {
    if (!coords) return null;
    if (Array.isArray(coords) && coords.length === 2) {
      const lng = Number(coords[0]);
      const lat = Number(coords[1]);
      if (!Number.isNaN(lng) && !Number.isNaN(lat)) return [lng, lat];
      return null;
    }
    if (typeof coords === 'object') {
      const maybe = coords as { lng?: unknown; lon?: unknown; latitude?: unknown; lat?: unknown; longitude?: unknown };
      const lngRaw = (maybe.longitude ?? maybe.lng ?? maybe.lon) as unknown;
      const latRaw = (maybe.latitude ?? maybe.lat) as unknown;
      if (lngRaw != null && latRaw != null) {
        const lng = Number(lngRaw);
        const lat = Number(latRaw);
        if (!Number.isNaN(lng) && !Number.isNaN(lat)) return [lng, lat];
      }
    }
    return null;
  };

  const clearRouteLayers = () => {
    if (!map.current) return;
    const routeLayerId = 'route';
    const routeSourceId = 'route';
    try {
      if (map.current.getLayer(routeLayerId)) {
        map.current.removeLayer(routeLayerId);
      }
    } catch {
      // ignore
    }
    try {
      if (map.current.getSource(routeSourceId)) {
        map.current.removeSource(routeSourceId);
      }
    } catch {
      // ignore
    }
  };

  const setRoute = useCallback(async (coordinates: [number, number][]) => {
    if (!map.current || !mapboxToken || coordinates.length < 2) return;

    clearRouteLayers();
    // slight delay ensures cleanup applied
    await new Promise(resolve => setTimeout(resolve, 80));

    const waypoints = coordinates.map(([lng, lat]) => `${lng},${lat}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?steps=true&geometries=geojson&access_token=${mapboxToken}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (!json || !json.routes || json.routes.length === 0) return;
      const route = json.routes[0];
      const data = {
        type: 'Feature',
        properties: {},
        geometry: route.geometry,
      } as GeoJSON.Feature;

      if (map.current.getSource('route')) {
        map.current.removeSource('route');
      }
      map.current.addSource('route', {
        type: 'geojson',
        data,
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75,
        },
      });
    } catch (err) {
      console.error('Error fetching route:', err);
    }
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || !itinerary || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const allPlaces = itinerary.days.flatMap(day => day.activities);
    console.log("🚀 ~ MapComponent ~ allPlaces:", allPlaces)

    const routeCoordinates = allPlaces
      .map(place => normalizeCoordinates((place as ActivityDto).coordinates))
      .filter((c): c is [number, number] => Array.isArray(c));

    // Add markers for all places
    allPlaces.forEach((place, index) => {

      const el = document.createElement('div');
      el.className = 'marker-pin';
      el.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)));
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        transition: all 0.2s ease;
      `;
      el.textContent = (index + 1).toString();

      // el.addEventListener('mouseenter', () => {
      //   el.style.transform = 'scale(1.1)';
      //   el.style.zIndex = '1000';
      // });

      // el.addEventListener('mouseleave', () => {
      //   el.style.transform = 'scale(1)';
      //   el.style.zIndex = '1';
      // });

      const marker = new mapboxgl.Marker(el)
        .setLngLat(place.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px; color: black;">
                <h3 style="margin: 0 0 4px 0; font-weight: bold;">${place.name}</h3>

                ${place.description ? `<p style="margin: 4px 0 0 0; font-size: 12px;">${place.description}</p>` : ''}
              </div>
            `)
        )
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onPlaceSelect(place);
      });

      markersRef.current.push(marker);
    });

    if (routeTimeoutRef.current) {
      window.clearTimeout(routeTimeoutRef.current);
      routeTimeoutRef.current = null;
    }
    if (routeCoordinates.length >= 2) {
      routeTimeoutRef.current = window.setTimeout(() => {
        void setRoute(routeCoordinates);
      }, 300);
    } else {
      clearRouteLayers();
    }

    // Fit map to show all places
    if (allPlaces.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      allPlaces.forEach(place => bounds.extend(place.coordinates));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [itinerary, onPlaceSelect, mapLoaded, setRoute]);

  useEffect(() => {

    console.log("🚀 ~ MapComponent ~ selectedPlace:", selectedPlace)
    if (!map.current || !selectedPlace) return;
    map.current.flyTo({
      center: selectedPlace.coordinates,
      zoom: 15,
      duration: 1000
    });
  }, [selectedPlace]);

  return (
    <div className="h-full  relative" style={{ minHeight: '400px' }}>
      {!mapboxToken && (
        <Card className="absolute top-4 left-4 right-4 p-4 z-10 bg-background/95 backdrop-blur-sm">
          <div className="text-sm">Mapbox token missing. Set <code>NEXT_PUBLIC_MAPBOX_API_KEY</code> in your env.</div>
        </Card>
      )}
      <div
        ref={mapContainer}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />

      {itinerary && (
        <Card className="absolute top-4 left-4 p-3 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-primary" />
            <div>

              <p className="text-xs text-muted-foreground">

              </p>
            </div>
          </div>
        </Card>
      )}

      {selectedPlace && (
        <Card className="absolute bottom-4 left-4 right-4 p-4 bg-background/95 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{selectedPlace.name}</h3>

              {selectedPlace.description && (
                <p className="text-sm mt-1">{selectedPlace.description}</p>
              )}

            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MapComponent;