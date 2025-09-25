import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@frontend/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';
import { ActivityDto, ItineraryDto } from '@shared/types/itinerary/chat-itinerary.response.dto';

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

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = "pk.eyJ1IjoibGFraW5kdTYyIiwiYSI6ImNtZjExZ2IycTFpbDkya3M3Y3plM3J6M24ifQ.zyO0dcbxZbMArJvMwfPX6w";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3522, 48.8566], // Default to Paris
      zoom: 12,
      pitch: 45,
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
    };
  }, []);

  useEffect(() => {
    if (!map.current || !itinerary) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const allPlaces = itinerary.days.flatMap(day => day.activities);
    console.log("🚀 ~ MapComponent ~ allPlaces:", allPlaces)

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
              <div style="padding: 8px;">
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

    // Fit map to show all places
    if (allPlaces.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      allPlaces.forEach(place => bounds.extend(place.coordinates));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [itinerary, onPlaceSelect]);

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
    <div className="h-full relative" style={{ minHeight: '400px' }}>
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