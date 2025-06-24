import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Checkbox,
  FormControlLabel,
  Alert
} from '@mui/material';
import { 
  Person, 
  Policy, 
  LocationOn, 
  Event, 
  Description,
  PhotoCamera,
  CheckCircle,
  LocalPolice
} from '@mui/icons-material';
import { ClaimData } from '../../types/claim';

interface ConfirmationStepProps {
  claimData: ClaimData;
  onUpdate: (data: Partial<ClaimData>) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ 
  claimData, 
  onUpdate 
}) => {
  const handleConfirmationChange = (confirmed: boolean) => {
    onUpdate({ confirmed });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Confirm Your Claim
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please review all the information before submitting your claim. Make sure everything is accurate.
      </Typography>

      {/* Claim Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Claim Summary
          </Typography>
          
          <List>
            {/* Parties Involved */}
            <ListItem>
              <ListItemIcon>
                <Person color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Parties Involved"
                secondary={
                  <Box>
                    {claimData.parties.map((party, index) => (
                      <Typography key={party.id} variant="body2" component="div">
                        {index === 0 ? '• Primary: ' : '• Additional: '}{party.name}
                        {party.licenseNumber && ` (License: ${party.licenseNumber})`}
                      </Typography>
                    ))}
                  </Box>
                }
              />
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Policy Information */}
            <ListItem>
              <ListItemIcon>
                <Policy color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Policy Number"
                secondary={claimData.policyNumber}
              />
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Incident Location */}
            <ListItem>
              <ListItemIcon>
                <LocationOn color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Incident Location"
                secondary={claimData.incidentAddress || 'Not specified'}
              />
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Incident Date */}
            <ListItem>
              <ListItemIcon>
                <Event color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Incident Date"
                secondary={formatDate(claimData.incidentDate)}
              />
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Description */}
            <ListItem>
              <ListItemIcon>
                <Description color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Description"
                secondary={claimData.description || 'No description provided'}
              />
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Photos */}
            <ListItem>
              <ListItemIcon>
                <PhotoCamera color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Damage Photos"
                secondary={`${claimData.damagePhotos.length} photo(s) uploaded`}
              />
            </ListItem>

            <Divider variant="inset" component="li" />

            {/* Police Report */}
            <ListItem>
              <ListItemIcon>
                <LocalPolice color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Police Report"
                secondary={
                  claimData.policeReport.hasReport 
                    ? `Police report filed${claimData.policeReport.reportNumber ? ` (${claimData.policeReport.reportNumber})` : ''}`
                    : 'No police report filed'
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Photo Preview */}
      {claimData.damagePhotos.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Attached Photos
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: 1,
              mt: 2
            }}>
              {claimData.damagePhotos.slice(0, 6).map((photo) => (
                <Box
                  key={photo.id}
                  sx={{
                    aspectRatio: '1',
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <img
                    src={photo.preview}
                    alt={`Damage at ${photo.location}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              ))}
              {claimData.damagePhotos.length > 6 && (
                <Box
                  sx={{
                    aspectRatio: '1',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.paper'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    +{claimData.damagePhotos.length - 6} more
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Checkbox */}
      <Card>
        <CardContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            By submitting this claim, you confirm that all information provided is accurate and complete.
          </Alert>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={claimData.confirmed}
                onChange={(e) => handleConfirmationChange(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body1">
                I confirm that all the information provided is accurate and I understand that providing false information may result in claim denial.
              </Typography>
            }
          />

          {claimData.confirmed && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'success.main' }}>
              <CheckCircle sx={{ mr: 1 }} />
              <Typography variant="body2">
                Ready to submit claim
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConfirmationStep;
