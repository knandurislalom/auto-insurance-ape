import React from 'react';
import {
  Typography,
  TextField,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface ClaimInformationData {
  policyNumber: string;
  incidentAddress: string;
  incidentDate: string;
  description: string;
}

interface ClaimInformationStepProps {
  data: ClaimInformationData;
  onUpdate: (data: Partial<ClaimInformationData>) => void;
}

const ClaimInformationStep: React.FC<ClaimInformationStepProps> = ({ 
  data, 
  onUpdate 
}) => {
  const handleDateChange = (date: Date | null) => {
    if (date) {
      onUpdate({ incidentDate: date.toISOString().split('T')[0] });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Claim Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please provide details about the incident and your policy information.
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Policy Number"
                value={data.policyNumber}
                disabled
                fullWidth
                helperText="This is automatically filled from your account"
              />

              <TextField
                label="Incident Address"
                value={data.incidentAddress}
                onChange={(e) => onUpdate({ incidentAddress: e.target.value })}
                placeholder="Where did the incident occur?"
                required
                fullWidth
                multiline
                rows={2}
              />

              <DatePicker
                label="Incident Date"
                value={data.incidentDate ? new Date(data.incidentDate) : null}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    helperText: 'Select the date when the incident occurred'
                  }
                }}
                maxDate={new Date()} // Can't select future dates
              />

              <TextField
                label="Brief Description"
                value={data.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Please describe what happened..."
                required
                fullWidth
                multiline
                rows={4}
                helperText="Provide a brief description of the incident (minimum 10 characters)"
              />
            </Box>
          </CardContent>
        </Card>

        <Typography variant="body2" color="text.secondary">
          Make sure all information is accurate as it will be used for processing your claim.
        </Typography>
      </Box>
    </LocalizationProvider>
  );
};

export default ClaimInformationStep;
