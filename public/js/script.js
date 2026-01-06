// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Connect to Socket.IO server
  const socket = io();

  /* ================================
     GEOLOCATION LOGIC
  ================================ */

  function successCallback(position) {
    const { latitude, longitude } = position.coords;

    socket.emit("sendLocation", {
      latitude,
      longitude,
    });
  }

  function errorCallback(error) {
    console.error("Geolocation error:", error.message);
  }

  if (navigator.geolocation) {
    // Get location once (fast)
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      timeout: 20000,
    });

    // Watch location continuously
    navigator.geolocation.watchPosition(successCallback, errorCallback, {
      enableHighAccuracy: false, // better for laptops
      timeout: 20000,
      maximumAge: 10000,
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }

  /* ================================
     LEAFLET MAP SETUP
  ================================ */

  const map = L.map("map").setView([0, 0], 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // 🔥 IMPORTANT: Force Leaflet to recalculate size
  setTimeout(() => {
    map.invalidateSize();
  }, 500);

  /* ================================
     MARKER HANDLING
  ================================ */

  const markers = {};

  socket.on("receiveLocation", (data) => {
    const { id, latitude, longitude } = data;

    map.flyTo([latitude, longitude], 17, {
      animate: true,
      duration: 1.5,
    });

    if (markers[id]) {
      markers[id].setLatLng([latitude, longitude]);
    } else {
      markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
  });

  const offset = Math.random() * 0.0001;

  markers[id] = L.marker([latitude + offset, longitude + offset]).addTo(map);

  socket.on("userDisconnected", (id) => {
    if (markers[id]) {
      map.removeLayer(markers[id]);
      delete markers[id];
    }
  });
});
