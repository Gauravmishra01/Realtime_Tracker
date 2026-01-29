// Geolocation functionality - runs independently from React
(function() {
  // Wait for socket.io to be available
  const initGeolocation = () => {
    // Connect to Socket.IO server
    const socket = io();

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
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 10000,
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGeolocation);
  } else {
    initGeolocation();
  }
})();
