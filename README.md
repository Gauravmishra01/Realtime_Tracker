# 📍 Find My Phone

🚀 **A Modern Device Tracking Application**

This repository contains a full-featured "Find My Phone" application built with Node.js, Express, Socket.IO, React, and Material-UI. Track multiple devices in real-time with a beautiful, responsive interface.

## ✨ Features

### Real-time Device Tracking
- Live location updates via WebSockets (Socket.IO)
- Interactive map visualization with Leaflet.js
- Multiple device support with automatic discovery

### Modern UI/UX
- **Material-UI Components**: Professional, clean interface
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Device List Drawer**: 
  - Search and filter devices
  - View device status (online/offline)
  - Battery level indicators
  - Last seen timestamps

### Device Controls
- **Ring Device**: Make your device play a sound
- **Lost Mode**: Lock device and display custom message
- **Erase Data**: Remotely wipe device data (with confirmation)

### Map Features
- Real-time marker updates
- Automatic map centering on device selection
- Device popups with location details
- Smooth animations and transitions

## 🛠 Technologies Used

- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.IO
- **Frontend**: React 18
- **UI Framework**: Material-UI (MUI)
- **Maps**: Leaflet.js with OpenStreetMap tiles
- **Build Tools**: Webpack, Babel

## 📦 Installation

### Prerequisites
- Node.js 14+ installed on your system

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Gauravmishra01/Realtime_Tracker.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Realtime_Tracker
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the frontend:
   ```bash
   npm run build
   ```

5. Start the application:
   ```bash
   npm start
   ```

6. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## 🚀 Development

For development with auto-rebuild on changes:

```bash
npm run dev
```

This will watch for changes in the `src` directory and automatically rebuild the bundle.

## 📱 Usage

1. **View Devices**: Open the application to see all connected devices in the left sidebar
2. **Search**: Use the search box to filter devices by name
3. **Select Device**: Click on any device to view its location on the map
4. **Device Actions**: Use the control panel to ring, lock, or erase a device
5. **Dark Mode**: Toggle the theme using the button in the top-right corner
6. **Mobile**: Tap the menu icon to open/close the device drawer on mobile

## 🎨 Screenshots

The application features a clean, modern interface with:
- Full-width interactive map
- Collapsible device list
- Material Design components
- Smooth animations and transitions

## 🤝 Contributing

Feel free to submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Live Demo

Check out the live application: [Find My Phone - Live Link](https://realtime-tracker-2z3j.onrender.com)

---

Built with ❤️ using React and Material-UI
