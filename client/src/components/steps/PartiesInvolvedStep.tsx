import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  Divider
} from '@mui/material';
import { Add, Delete, Person } from '@mui/icons-material';
import { Party } from '../../types/claim';

interface PartiesInvolvedStepProps {
  parties: Party[];
  onUpdate: (parties: Party[]) => void;
}

const PartiesInvolvedStep: React.FC<PartiesInvolvedStepProps> = ({ 
  parties, 
  onUpdate 
}) => {
  const [newDriverName, setNewDriverName] = useState('');

  const handleAddDriver = () => {
    if (newDriverName.trim()) {
      const newParty: Party = {
        id: Date.now().toString(),
        name: newDriverName.trim(),
        licenseNumber: '',
        contactInfo: ''
      };
      onUpdate([...parties, newParty]);
      setNewDriverName('');
    }
  };

  const handleRemoveDriver = (id: string) => {
    // Don't allow removing the main user (first party)
    if (parties.findIndex(p => p.id === id) === 0) return;
    
    onUpdate(parties.filter(party => party.id !== id));
  };

  const handleUpdateParty = (id: string, field: keyof Party, value: string) => {
    onUpdate(
      parties.map(party =>
        party.id === id ? { ...party, [field]: value } : party
      )
    );
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Parties Involved
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please confirm your information and add any other drivers involved in the incident.
      </Typography>

      {parties.map((party, index) => (
        <Card key={party.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                {index === 0 ? 'Primary Driver (You)' : `Driver ${index + 1}`}
              </Typography>
              {index > 0 && (
                <IconButton
                  onClick={() => handleRemoveDriver(party.id)}
                  sx={{ ml: 'auto' }}
                  color="error"
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Full Name"
                value={party.name}
                onChange={(e) => handleUpdateParty(party.id, 'name', e.target.value)}
                disabled={index === 0} // Main user name is pre-filled and disabled
                required
                fullWidth
              />
              
              <TextField
                label="License Number (Optional)"
                value={party.licenseNumber || ''}
                onChange={(e) => handleUpdateParty(party.id, 'licenseNumber', e.target.value)}
                fullWidth
              />
              
              <TextField
                label="Contact Information (Optional)"
                value={party.contactInfo || ''}
                onChange={(e) => handleUpdateParty(party.id, 'contactInfo', e.target.value)}
                placeholder="Phone number or email"
                fullWidth
              />
            </Box>
          </CardContent>
        </Card>
      ))}

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          Add Another Driver
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Driver Name"
            value={newDriverName}
            onChange={(e) => setNewDriverName(e.target.value)}
            placeholder="Enter full name"
            sx={{ flexGrow: 1 }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddDriver();
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddDriver}
            disabled={!newDriverName.trim()}
          >
            Add Driver
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PartiesInvolvedStep;
