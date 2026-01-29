import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapView = ({ devices, selectedDevice, onDeviceSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);

      // Force map to recalculate size
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const markers = markersRef.current;

    // Update markers
    devices.forEach((device) => {
      const { id, latitude, longitude, status, name } = device;

      if (markers[id]) {
        // Update existing marker
        markers[id].setLatLng([latitude, longitude]);
        
        // Update popup content
        const popupContent = `
          <div style="text-align: center;">
            <strong>${name}</strong><br/>
            Status: ${status}<br/>
            Lat: ${latitude.toFixed(6)}<br/>
            Lng: ${longitude.toFixed(6)}
          </div>
        `;
        markers[id].setPopupContent(popupContent);
        
        // Change marker color based on status
        if (status === 'offline') {
          markers[id].setOpacity(0.5);
        } else {
          markers[id].setOpacity(1);
        }
      } else {
        // Create new marker
        const marker = L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center;">
              <strong>${name}</strong><br/>
              Status: ${status}<br/>
              Lat: ${latitude.toFixed(6)}<br/>
              Lng: ${longitude.toFixed(6)}
            </div>
          `);

        marker.on('click', () => {
          onDeviceSelect(id);
        });

        markers[id] = marker;
      }
    });

    // Remove markers for devices no longer in the list
    Object.keys(markers).forEach((id) => {
      if (!devices.find((d) => d.id === id)) {
        map.removeLayer(markers[id]);
        delete markers[id];
      }
    });

    // Focus on selected device
    if (selectedDevice && markers[selectedDevice]) {
      const device = devices.find((d) => d.id === selectedDevice);
      if (device) {
        map.flyTo([device.latitude, device.longitude], 17, {
          animate: true,
          duration: 1.5,
        });
        markers[selectedDevice].openPopup();
      }
    } else if (devices.length > 0) {
      // Fit bounds to show all devices
      const bounds = devices
        .filter((d) => d.latitude && d.longitude)
        .map((d) => [d.latitude, d.longitude]);
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [devices, selectedDevice, onDeviceSelect]);

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default MapView;
