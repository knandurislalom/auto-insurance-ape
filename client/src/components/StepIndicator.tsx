import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ClaimStep } from '../types/claim';

interface StepIndicatorProps {
  currentStep: number;
  steps: ClaimStep[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper 
        activeStep={currentStep - 1} 
        alternativeLabel={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
      >
        {steps.map((step) => (
          <Step key={step.step} completed={step.completed}>
            <StepLabel>
              {!isMobile ? (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {step.title}
                </Typography>
              ) : (
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Step {step.step}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.title}
                  </Typography>
                </Box>
              )}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StepIndicator;
