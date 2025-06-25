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
  Timeline,
  Build,
  Assessment,
  Schedule
} from '@mui/icons-material';
import { CollisionClaimData } from '../../types/claim';

interface SuccessStepProps {
  onGoToDashboard: () => void;
  claimId?: number | null;
  claimData?: CollisionClaimData;
}

const getNonCollisionSteps = () => [
  'Claim Submitted',
  'Under Review',
  'Assessment',
  'Decision'
];

const getCollisionSteps = (estimationMethod?: string) => {
  const baseSteps = [
    'Claim Submitted',
    'Under Review'
  ];
  
  if (estimationMethod === 'adjuster') {
    return [
      ...baseSteps,
      'Adjuster Scheduled',
      'Damage Assessment',
      'Estimate Review',
      'Decision'
    ];
  } else if (estimationMethod === 'repair_shop') {
    return [
      ...baseSteps,
      'Shop Estimate',
      'Estimate Review',
      'Repair Authorization',
      'Decision'
    ];
  } else if (estimationMethod === 'digital') {
    return [
      ...baseSteps,
      'AI Assessment',
      'Estimate Review',
      'Validation',
      'Decision'
    ];
  }
  
  return baseSteps.concat(['Assessment', 'Decision']);
};

const SuccessStep: React.FC<SuccessStepProps> = ({ onGoToDashboard, claimId, claimData }) => {
  const claimNumber = claimId ? `CLM-${claimId}` : `CLM-${Date.now().toString().slice(-6)}`;
  const isCollision = claimData?.isCollision || false;
  const estimationMethod = claimData?.estimationMethod;
  
  const claimSteps = isCollision 
    ? getCollisionSteps(estimationMethod) 
    : getNonCollisionSteps();
  
  const estimatedTime = isCollision ? '5-7 business days' : '3-5 business days';
  
  const getNextStepsContent = () => {
    if (isCollision && estimationMethod) {
      switch (estimationMethod) {
        case 'adjuster':
          return [
            { time: 'Immediate', action: 'You\'ll receive a confirmation email with your claim details' },
            { time: 'Within 24 hours', action: 'An adjuster will be assigned and will contact you to confirm the scheduled visit' },
            { time: 'Scheduled visit', action: 'Adjuster will inspect your vehicle and provide damage assessment' },
            { time: 'Within 2 days of visit', action: 'Estimate will be reviewed and claim decision communicated' }
          ];
        case 'repair_shop':
          return [
            { time: 'Immediate', action: 'You\'ll receive a confirmation email with your claim details' },
            { time: 'Today', action: 'Contact your selected repair shop to schedule an estimate appointment' },
            { time: 'After shop estimate', action: 'Repair shop will submit estimate directly to us for review' },
            { time: 'Within 2-3 days', action: 'Estimate will be reviewed and repair authorization provided' }
          ];
        case 'digital':
          return [
            { time: 'Immediate', action: 'You\'ll receive a confirmation email with your claim details' },
            { time: 'Within 1 hour', action: 'AI assessment will be completed based on your uploaded photos' },
            { time: 'Within 24 hours', action: 'Digital estimate will be validated by our team' },
            { time: 'Within 2 days', action: 'Final estimate and claim decision will be communicated' }
          ];
      }
    }
    
    // Default non-collision steps
    return [
      { time: 'Immediate', action: 'You\'ll receive a confirmation email with your claim details' },
      { time: 'Within 24 hours', action: 'A claims adjuster will be assigned to review your case' },
      { time: 'Within 2-3 days', action: 'You may be contacted for additional information or to schedule an assessment' },
      { time: 'Within 5 days', action: 'Initial decision on your claim will be communicated' }
    ];
  };

  const nextSteps = getNextStepsContent();

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
          Your {isCollision ? 'collision' : 'auto insurance'} claim has been received and is being processed.
          {isCollision && estimationMethod && (
            <Box sx={{ mt: 1 }}>
              <Chip 
                label={`${estimationMethod === 'adjuster' ? 'Adjuster Visit' : 
                        estimationMethod === 'repair_shop' ? 'Repair Shop Estimate' : 
                        'Digital Assessment'} Selected`}
                size="small"
                color="primary"
                icon={estimationMethod === 'adjuster' ? <Schedule /> : 
                     estimationMethod === 'repair_shop' ? <Build /> : 
                     <Assessment />}
              />
            </Box>
          )}
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
            {nextSteps.map((step, index) => (
              <Typography key={index} component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>{step.time}:</strong> {step.action}
              </Typography>
            ))}
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
