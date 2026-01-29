import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  TextField,
  Typography,
  Chip,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  PhoneAndroid as PhoneIcon,
  Search as SearchIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';

const DeviceList = ({ devices, selectedDevice, onDeviceSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatLastSeen = (date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const lastSeen = new Date(date);
    const diffMs = now - lastSeen;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Search Box */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search devices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider />

      {/* Device Count */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredDevices.length} device{filteredDevices.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Device List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {filteredDevices.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'No devices found' : 'No devices connected'}
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredDevices.map((device) => (
              <ListItem key={device.id} disablePadding>
                <ListItemButton
                  selected={selectedDevice === device.id}
                  onClick={() => onDeviceSelect(device.id)}
                >
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">{device.name}</Typography>
                        <CircleIcon
                          sx={{
                            fontSize: 8,
                            color: device.status === 'online' ? 'success.main' : 'grey.500',
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" display="block">
                          {device.status === 'online' ? 'Online' : 'Offline'}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Last seen: {formatLastSeen(device.lastSeen)}
                        </Typography>
                        {device.battery !== undefined && (
                          <Chip
                            label={`${device.battery}%`}
                            size="small"
                            sx={{ mt: 0.5, height: 20 }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default DeviceList;
