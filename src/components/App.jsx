import React, { useState, useEffect, useMemo } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { io } from 'socket.io-client';
import MapView from './MapView';
import DeviceList from './DeviceList';
import DeviceControls from './DeviceControls';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [devices, setDevices] = useState({});
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [socket, setSocket] = useState(null);
  
  const isMobile = useMediaQuery('(max-width:900px)');

  // Create theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
      }),
    [darkMode]
  );

  // Initialize socket connection
  useEffect(() => {
    const socketConnection = io();
    setSocket(socketConnection);

    socketConnection.on('receiveLocation', (data) => {
      const { id, latitude, longitude } = data;
      
      setDevices((prevDevices) => ({
        ...prevDevices,
        [id]: {
          id,
          name: prevDevices[id]?.name || `Device ${Object.keys(prevDevices).length + 1}`,
          latitude,
          longitude,
          status: 'online',
          lastSeen: new Date(),
          battery: prevDevices[id]?.battery || Math.floor(Math.random() * 100),
        },
      }));
    });

    socketConnection.on('userDisconnected', (id) => {
      setDevices((prevDevices) => {
        const updatedDevices = { ...prevDevices };
        if (updatedDevices[id]) {
          updatedDevices[id].status = 'offline';
        }
        return updatedDevices;
      });
    });

    socketConnection.on('deviceAction', (data) => {
      const { id, action } = data;
      console.log(`Device ${id} received action: ${action}`);
      // In a real app, this would trigger actual device actions
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDeviceSelect = (deviceId) => {
    setSelectedDevice(deviceId);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleDeviceAction = (action) => {
    if (selectedDevice && socket) {
      socket.emit('deviceAction', {
        id: selectedDevice,
        action,
      });
      
      // Update local state to show action was triggered
      setDevices((prevDevices) => ({
        ...prevDevices,
        [selectedDevice]: {
          ...prevDevices[selectedDevice],
          lastAction: action,
          lastActionTime: new Date(),
        },
      }));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Find My Phone
            </Typography>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Device List Drawer */}
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          anchor="left"
          open={isMobile ? drawerOpen : true}
          onClose={toggleDrawer}
          sx={{
            width: 320,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 320,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <DeviceList
            devices={Object.values(devices)}
            selectedDevice={selectedDevice}
            onDeviceSelect={handleDeviceSelect}
          />
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <Toolbar />
          
          {/* Map View */}
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <MapView
              devices={Object.values(devices)}
              selectedDevice={selectedDevice}
              onDeviceSelect={handleDeviceSelect}
            />
          </Box>

          {/* Device Controls */}
          {selectedDevice && devices[selectedDevice] && (
            <DeviceControls
              device={devices[selectedDevice]}
              onAction={handleDeviceAction}
            />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
