import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip
} from '@mui/material';
import { 
  CheckCircle, 
  Receipt, 
  Dashboard,
  Timeline
} from '@mui/icons-material';

interface SuccessStepProps {
  onGoToDashboard: () => void;
  claimId?: number | null;
}

const claimSteps = [
  'Claim Submitted',
  'Under Review',
  'Assessment',
  'Decision'
];

const SuccessStep: React.FC<SuccessStepProps> = ({ onGoToDashboard, claimId }) => {
  const claimNumber = claimId ? `CLM-${claimId}` : `CLM-${Date.now().toString().slice(-6)}`;
  const estimatedTime = '3-5 business days';

  return (
    <Box sx={{ textAlign: 'center' }}>
      {/* Success Header */}
      <Box sx={{ mb: 4 }}>
        <CheckCircle 
          sx={{ 
            fontSize: 80, 
            color: 'success.main',
            mb: 2
          }} 
        />
        <Typography variant="h4" component="h1" gutterBottom color="success.main">
          Claim Submitted Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your auto insurance claim has been received and is being processed.
        </Typography>
      </Box>

      {/* Claim Details */}
      <Card sx={{ mb: 4, textAlign: 'left' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Receipt sx={{ mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6">
                Claim Number
              </Typography>
              <Typography variant="h5" color="primary">
                {claimNumber}
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Save your claim number {claimNumber} for future reference. 
              You'll need it to check your claim status or contact support.
            </Typography>
          </Alert>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Estimated Processing Time:</strong> {estimatedTime}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You'll receive email updates as your claim progresses through each stage.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Status Tracker */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Timeline sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">
              Claim Progress Tracker
            </Typography>
          </Box>

          <Stepper activeStep={0} alternativeLabel>
            {claimSteps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="body2">
                    {label}
                  </Typography>
                  {index === 0 && (
                    <Chip 
                      label="Current" 
                      size="small" 
                      color="primary" 
                      sx={{ mt: 1 }}
                    />
                  )}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Your claim is currently in the <strong>Claim Submitted</strong> stage.
          </Typography>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card sx={{ mb: 4, textAlign: 'left' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            What Happens Next?
          </Typography>
          
          <Box component="ol" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>Immediate:</strong> You'll receive a confirmation email with your claim details
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>Within 24 hours:</strong> A claims adjuster will be assigned to review your case
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>Within 2-3 days:</strong> You may be contacted for additional information or to schedule an assessment
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Within 5 days:</strong> Initial decision on your claim will be communicated
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<Dashboard />}
          onClick={onGoToDashboard}
          size="large"
        >
          Go to Dashboard
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          onClick={() => {
            // In a real app, this would navigate to claim details
            console.log('View claim details:', claimNumber);
          }}
        >
          View Claim Details
        </Button>
      </Box>

      {/* Contact Information */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Need help? Contact our claims support team at{' '}
          <strong>1-800-CLAIMS</strong> or email{' '}
          <strong>claims@insurance.com</strong>
        </Typography>
      </Box>
    </Box>
  );
};

export default SuccessStep;
