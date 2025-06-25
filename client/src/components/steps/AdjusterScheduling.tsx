import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Home,
  LocationOn,
  Schedule,
  Phone,
  Email,
  AccessTime
} from '@mui/icons-material';
import { AdjusterVisit } from '../../types/claim';

interface AdjusterSchedulingProps {
  adjusterVisit?: AdjusterVisit;
  onUpdate: (adjusterVisit: AdjusterVisit) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const timeSlots = [
  { date: 'Tomorrow - March 16', times: ['9:00 AM - 12:00 PM', '1:00 PM - 5:00 PM'] },
  { date: 'March 17 - Friday', times: ['9:00 AM - 12:00 PM', '1:00 PM - 5:00 PM'] },
  { date: 'March 18 - Saturday', times: ['10:00 AM - 2:00 PM'] }
];

const AdjusterScheduling: React.FC<AdjusterSchedulingProps> = ({
  adjusterVisit,
  onUpdate,
  onSubmit,
  onBack
}) => {
  const [formData, setFormData] = useState<AdjusterVisit>(
    adjusterVisit || {
      location: 'home',
      preferredDate: '',
      preferredTime: '',
      contactPhone: '(206) 555-0123',
      contactEmail: 'sarah.j@email.com'
    }
  );

  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const handleLocationChange = (location: 'home' | 'incident' | 'custom') => {
    const updatedData = { ...formData, location };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const handleCustomAddressChange = (customAddress: string) => {
    const updatedData = { ...formData, customAddress };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const handleTimeSlotSelect = (date: string, time: string) => {
    const slotKey = `${date}-${time}`;
    setSelectedSlot(slotKey);
    const updatedData = { ...formData, preferredDate: date, preferredTime: time };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const handleContactChange = (field: 'contactPhone' | 'contactEmail', value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const isFormValid = () => {
    return formData.location && 
           formData.preferredDate && 
           formData.preferredTime && 
           formData.contactPhone && 
           formData.contactEmail &&
           (formData.location !== 'custom' || formData.customAddress);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Schedule Adjuster Visit
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        An insurance adjuster will inspect your vehicle and provide a professional damage estimate.
      </Typography>

      {/* Vehicle Location */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Vehicle Location
          </Typography>
          
          <RadioGroup 
            value={formData.location} 
            onChange={(e) => handleLocationChange(e.target.value as 'home' | 'incident' | 'custom')}
          >
            <FormControlLabel 
              value="home" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Home sx={{ mr: 1, fontSize: 20 }} />
                  <Box>
                    <Typography variant="body1">My home address</Typography>
                    <Typography variant="body2" color="text.secondary">
                      123 Oak Street, Seattle WA
                    </Typography>
                  </Box>
                </Box>
              }
            />
            
            <FormControlLabel 
              value="incident" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                  <Box>
                    <Typography variant="body1">Incident location</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Main St & 1st Ave, Seattle
                    </Typography>
                  </Box>
                </Box>
              }
            />
            
            <FormControlLabel 
              value="custom" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body1">Different address</Typography>
                </Box>
              }
            />
          </RadioGroup>

          {formData.location === 'custom' && (
            <TextField
              fullWidth
              label="Enter address"
              value={formData.customAddress || ''}
              onChange={(e) => handleCustomAddressChange(e.target.value)}
              sx={{ mt: 2 }}
              placeholder="Enter the address where vehicle can be inspected"
            />
          )}
        </CardContent>
      </Card>

      {/* Preferred Time */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Preferred Time
          </Typography>
          
          {timeSlots.map((slot) => (
            <Box key={slot.date} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 1, fontSize: 20 }} />
                {slot.date}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {slot.times.map((time) => {
                  const slotKey = `${slot.date}-${time}`;
                  const isSelected = selectedSlot === slotKey;
                  return (
                    <Chip
                      key={time}
                      label={time}
                      onClick={() => handleTimeSlotSelect(slot.date, time)}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      icon={<AccessTime />}
                      sx={{ cursor: 'pointer' }}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
          
          <Button variant="outlined" size="small" sx={{ mt: 2 }}>
            See more times...
          </Button>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.contactPhone}
                onChange={(e) => handleContactChange('contactPhone', e.target.value)}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Email"
                value={formData.contactEmail}
                onChange={(e) => handleContactChange('contactEmail', e.target.value)}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* What to Expect */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="subtitle2" gutterBottom>
          What to expect during the inspection:
        </Typography>
        <List dense>
          <ListItem sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              <Box sx={{ width: 4, height: 4, bgcolor: 'primary.main', borderRadius: '50%' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Inspection typically takes 30-45 minutes"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              <Box sx={{ width: 4, height: 4, bgcolor: 'primary.main', borderRadius: '50%' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Adjuster will photograph and document all damage"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              <Box sx={{ width: 4, height: 4, bgcolor: 'primary.main', borderRadius: '50%' }} />
            </ListItemIcon>
            <ListItemText 
              primary="You'll receive a preliminary estimate on-site"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        </List>
      </Alert>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={onBack}
          size="large"
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!isFormValid()}
          size="large"
        >
          Schedule Appointment
        </Button>
      </Box>
    </Box>
  );
};

export default AdjusterScheduling;
