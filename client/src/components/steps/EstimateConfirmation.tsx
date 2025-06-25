import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  Divider,
  Chip,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Receipt,
  Timeline,
  Dashboard,
  Visibility,
  CheckCircle,
  Schedule,
  HourglassEmpty
} from '@mui/icons-material';
import { DamageEstimate } from '../../types/claim';

interface EstimateConfirmationProps {
  estimate: DamageEstimate;
  estimationMethod: 'adjuster' | 'repair_shop' | 'digital';
  onViewDetails: () => void;
  onBackToDashboard: () => void;
}

const statusSteps = [
  'Claim Submitted',
  'Estimate Received',
  'Review & Approval',
  'Settlement',
  'Payment'
];

const getEstimationMethodDetails = (method: 'adjuster' | 'repair_shop' | 'digital') => {
  switch (method) {
    case 'adjuster':
      return {
        title: 'Insurance Adjuster Estimate',
        icon: <Receipt />,
        description: 'Professional on-site inspection completed'
      };
    case 'repair_shop':
      return {
        title: 'Repair Shop Estimate',
        icon: <Receipt />,
        description: 'Estimate from certified repair facility'
      };
    case 'digital':
      return {
        title: 'AI Digital Assessment',
        icon: <Receipt />,
        description: 'AI-powered damage analysis completed'
      };
  }
};

const EstimateConfirmation: React.FC<EstimateConfirmationProps> = ({
  estimate,
  estimationMethod,
  onViewDetails,
  onBackToDashboard
}) => {
  const methodDetails = getEstimationMethodDetails(estimationMethod);
  const estimateId = estimate.id || `EST-2024-${Date.now().toString().slice(-6)}`;
  const totalAmount = estimate.amount || 3247.50;
  const breakdown = estimate.breakdown || {
    parts: 1890.00,
    labor: 1200.00,
    paint: 157.50
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      {/* Success Header */}
      <Box sx={{ mb: 4 }}>
        <Receipt 
          sx={{ 
            fontSize: 60, 
            color: 'success.main',
            mb: 2
          }} 
        />
        <Typography variant="h4" component="h1" gutterBottom color="success.main">
          Estimate Received!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your damage estimate has been submitted to your claim.
        </Typography>
      </Box>

      {/* Estimate Details */}
      <Card sx={{ mb: 4, textAlign: 'left' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {methodDetails.icon}
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6">
                {methodDetails.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {methodDetails.description}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Estimate ID
            </Typography>
            <Typography variant="h6" color="primary">
              {estimateId}
            </Typography>
          </Box>

          {estimate.estimatorInfo && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {estimationMethod === 'repair_shop' ? 'Shop' : 'Adjuster'}
              </Typography>
              <Typography variant="body1">
                {estimate.estimatorInfo.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {estimate.estimatorInfo.company}
              </Typography>
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Date Submitted
            </Typography>
            <Typography variant="body1">
              {estimate.dateSubmitted || new Date().toLocaleDateString()}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Cost Breakdown */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Preliminary Amount
            </Typography>
            <Typography variant="h4" color="primary.main" gutterBottom>
              ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Parts:</Typography>
                <Typography variant="body2">${breakdown.parts.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Labor:</Typography>
                <Typography variant="body2">${breakdown.labor.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Paint:</Typography>
                <Typography variant="body2">${breakdown.paint.toFixed(2)}</Typography>
              </Box>
              {breakdown.other && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Other:</Typography>
                  <Typography variant="body2">${breakdown.other.toFixed(2)}</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {estimationMethod === 'digital' && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> This is a preliminary estimate based on AI analysis. 
                Final amount may vary after detailed inspection.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Updated Status Tracker */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Timeline sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">
              What happens next?
            </Typography>
          </Box>

          <Stepper activeStep={1} alternativeLabel>
            {statusSteps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="body2">
                    {label}
                  </Typography>
                  {index === 0 && (
                    <Chip 
                      label="Complete" 
                      size="small" 
                      color="success" 
                      sx={{ mt: 1 }}
                    />
                  )}
                  {index === 1 && (
                    <Chip 
                      label="Complete" 
                      size="small" 
                      color="success" 
                      sx={{ mt: 1 }}
                    />
                  )}
                  {index === 2 && (
                    <Chip 
                      label="1-2 days" 
                      size="small" 
                      color="warning" 
                      sx={{ mt: 1 }}
                    />
                  )}
                  {index === 3 && (
                    <Chip 
                      label="3-5 days" 
                      size="small" 
                      color="default" 
                      sx={{ mt: 1 }}
                    />
                  )}
                  {index === 4 && (
                    <Chip 
                      label="5-7 days" 
                      size="small" 
                      color="default" 
                      sx={{ mt: 1 }}
                    />
                  )}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Schedule sx={{ mr: 1, color: 'warning.main' }} />
            <Typography variant="body2" color="text.secondary">
              Your claim is currently in <strong>Review & Approval</strong> stage
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Next Steps Information */}
      <Card sx={{ mb: 4, textAlign: 'left' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Next Steps
          </Typography>
          
          <Box component="ol" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>Review Period (1-2 days):</strong> Our claims team will review the estimate and may request additional information
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>Approval Process (2-3 days):</strong> Estimate will be approved or adjustments may be requested
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>Settlement (3-5 days):</strong> Final settlement amount will be determined and communicated
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Payment (5-7 days):</strong> Payment will be processed according to your policy terms
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<Visibility />}
          onClick={onViewDetails}
          size="large"
        >
          View Full Details
        </Button>
        
        <Button
          variant="contained"
          startIcon={<Dashboard />}
          onClick={onBackToDashboard}
          size="large"
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Contact Information */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Questions about your estimate? Contact your assigned adjuster or our claims support team at{' '}
          <strong>1-800-CLAIMS</strong>
        </Typography>
      </Box>
    </Box>
  );
};

export default EstimateConfirmation;
