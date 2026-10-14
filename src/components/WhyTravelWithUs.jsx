import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CULTURAL_PLACES, JOGJA_GPS_ZONES } from '../data/culturalData';

export default function WhyTravelWithUs() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Inisialisasi Peta Leaflet Berpusat di D.I. Yogyakarta (Sumbu Filosofis Merapi - Keraton - Parangtritis)
    const map = L.map(mapContainerRef.current, {
      center: [-7.8014, 110.3775],
      zoom: 11,
      minZoom: 9,
      maxZoom: 18,
      scrollWheelZoom: true,
      zoomControl: true
    });

    mapInstanceRef.current = map;

    // Tile Layer Esri World Street Map Resmi (Bebas Watermark & CORS Handal)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri • Peta Budaya & Kuliner D.I. Yogyakarta',
      maxZoom: 19
    }).addTo(map);

    // Garis Imajiner Sumbu Kosmologi Yogyakarta (Gunung Merapi -> Tugu/Malioboro -> Keraton -> Parangtritis)
    const philosophicalAxisCoords = [
      [-7.5965, 110.4242], // Lereng Merapi & Kaliurang
      [-7.7926, 110.3658], // Tugu & Malioboro
      [-7.8053, 110.3644], // Keraton Ngayogyakarta
      [-8.0247, 110.3323]  // Pantai Parangtritis
    ];

    L.polyline(philosophicalAxisCoords, {
      color: '#9e1c64',
      weight: 4,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Tambahkan Pin Interaktif untuk Setiap Destinasi & Zona Kuliner di D.I. Yogyakarta
    CULTURAL_PLACES.forEach((point, index) => {
      const coords = [point.coordinates.lat, point.coordinates.lng];
      const img = point.coverImage;
      const gmapsLink = point.chapter07?.mapsDirectLink || `https://maps.google.com/?q=${encodeURIComponent(point.name + ' Yogyakarta')}`;
      const matchedZone = JOGJA_GPS_ZONES.find((z) => z.id === point.gpsZoneId);
      const topFood = matchedZone?.kulinerList?.[0];

      const customIcon = L.divIcon({
        className: 'custom-track-marker',
        html: `
          <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(158, 28, 100, 0.4); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 30px; height: 30px; border-radius: 50%; background: #9e1c64; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 700; font-size: 12px;">
              ${index + 1}
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20]
      });

      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; width: 250px; padding: 4px; color: #111827;">
          <div style="position: relative; height: 115px; border-radius: 10px; overflow: hidden; margin-bottom: 8px;">
            <img src="${img}" alt="${point.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <span style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.75); color: #fff; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 99px;">
              ${point.regionLabel}
            </span>
          </div>
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 3px; color: #0f172a;">
            ${point.name}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            🎟️ ${point.ticketInfo?.domestik || 'Gratis'}
          </div>
          ${
            topFood
              ? `<div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 6px 8px; border-radius: 8px; font-size: 11px; color: #065f46; margin-bottom: 8px;">
                  <strong>Rekomendasi kuliner di kawasan ini:</strong><br/>${topFood.name}
                </div>`
              : ''
          }
          <a href="${gmapsLink}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #9e1c64; color: #ffffff; font-size: 11px; font-weight: 600; padding: 7px 10px; border-radius: 8px; text-decoration: none;">
            Buka Navigasi Google Maps →
          </a>
        </div>
      `;

      L.marker(coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent, {
          closeButton: false,
          maxWidth: 270
        });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <section
      id="peta-indonesia"
      style={{
        position: 'relative',
        width: '100%',
        height: '85vh',
        minHeight: '650px',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        border: 'none',
        background: '#e5e7eb'
      }}
    >
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          zIndex: 1
        }}
      />
    </section>
  );
}
