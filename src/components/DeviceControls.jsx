import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Collapse,
} from '@mui/material';
import {
  VolumeUp as RingIcon,
  Lock as LockIcon,
  DeleteForever as EraseIcon,
} from '@mui/icons-material';

const DeviceControls = ({ device, onAction }) => {
  const [openDialog, setOpenDialog] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const handleActionClick = (action) => {
    if (action === 'ring') {
      // Ring action doesn't need confirmation
      onAction(action);
      setActionSuccess('Device ring command sent!');
      setTimeout(() => setActionSuccess(null), 3000);
    } else {
      // Lost Mode and Erase need confirmation
      setOpenDialog(action);
    }
  };

  const handleConfirmAction = () => {
    if (openDialog) {
      onAction(openDialog);
      setActionSuccess(
        openDialog === 'lostMode'
          ? 'Lost Mode activated!'
          : 'Erase data command sent!'
      );
      setTimeout(() => setActionSuccess(null), 3000);
    }
    setOpenDialog(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const getDialogContent = () => {
    if (openDialog === 'lostMode') {
      return {
        title: 'Enable Lost Mode?',
        content:
          'Lost Mode will lock the device and display a custom message. You can track its location and the device will be locked until you disable Lost Mode.',
      };
    } else if (openDialog === 'erase') {
      return {
        title: 'Erase Device Data?',
        content:
          'WARNING: This will permanently delete all data on the device. This action cannot be undone. The device will be reset to factory settings.',
      };
    }
    return { title: '', content: '' };
  };

  const dialogContent = getDialogContent();

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          m: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {/* Device Info */}
        <Box>
          <Typography variant="h6" gutterBottom>
            {device.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {device.status === 'online' ? (
              <span style={{ color: 'green' }}>● Online</span>
            ) : (
              <span style={{ color: 'grey' }}>● Offline</span>
            )}
          </Typography>
        </Box>

        <Divider />

        {/* Success Message */}
        <Collapse in={!!actionSuccess}>
          <Alert severity="success" onClose={() => setActionSuccess(null)}>
            {actionSuccess}
          </Alert>
        </Collapse>

        {/* Control Buttons */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Device Actions
          </Typography>
          <ButtonGroup
            fullWidth
            orientation="vertical"
            variant="outlined"
            sx={{ gap: 1 }}
          >
            <Button
              startIcon={<RingIcon />}
              onClick={() => handleActionClick('ring')}
              disabled={device.status === 'offline'}
              color="primary"
            >
              Ring Device
            </Button>
            <Button
              startIcon={<LockIcon />}
              onClick={() => handleActionClick('lostMode')}
              disabled={device.status === 'offline'}
              color="warning"
            >
              Enable Lost Mode
            </Button>
            <Button
              startIcon={<EraseIcon />}
              onClick={() => handleActionClick('erase')}
              disabled={device.status === 'offline'}
              color="error"
            >
              Erase Device Data
            </Button>
          </ButtonGroup>
        </Box>

        {/* Device Details */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Device Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Battery: {device.battery !== undefined ? `${device.battery}%` : 'Unknown'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Location: {device.latitude?.toFixed(6)}, {device.longitude?.toFixed(6)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last Updated: {device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Unknown'}
          </Typography>
          {device.lastAction && (
            <Typography variant="body2" color="text.secondary">
              Last Action: {device.lastAction} ({new Date(device.lastActionTime).toLocaleTimeString()})
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={!!openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogContent.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContent.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={openDialog === 'erase' ? 'error' : 'warning'}
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeviceControls;
