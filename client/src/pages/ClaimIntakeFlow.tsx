import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import StepIndicator from '../components/StepIndicator';
import PartiesInvolvedStep from '../components/steps/PartiesInvolvedStep';
import ClaimInformationStep from '../components/steps/ClaimInformationStep';
import DamagePhotosStep from '../components/steps/DamagePhotosStep';
import ConfirmationStep from '../components/steps/ConfirmationStep';
import SuccessStep from '../components/steps/SuccessStep';
import PoliceReportStep from '../components/steps/PoliceReportStep';
import { ClaimData, ClaimStep, Party, DamagePhoto, PoliceReport } from '../types/claim';
import ClaimFlowLogo from '../components/ClaimFlowLogo';

const initialClaimData: ClaimData = {
  parties: [{ id: '1', name: 'Sarah Johnson' }], // Pre-filled user
  policyNumber: 'POL-123456789', // Pre-filled
  incidentAddress: '',
  incidentDate: '',
  description: '',
  damagePhotos: [],
  policeReport: {
    id: '1',
    hasReport: false
  },
  confirmed: false
};

const steps: ClaimStep[] = [
  { step: 1, title: 'Parties Involved', completed: false },
  { step: 2, title: 'Claim Information', completed: false },
  { step: 3, title: 'Damage Photos', completed: false },
  { step: 4, title: 'Police Report', completed: false },
  { step: 5, title: 'Confirm & Submit', completed: false }
];

const ClaimIntakeFlow: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get('vehicle');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [claimData, setClaimData] = useState<ClaimData>(initialClaimData);
  const [stepStatus, setStepStatus] = useState<ClaimStep[]>(steps);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch vehicle data based on vehicleId
    console.log('Selected vehicle:', vehicleId);
  }, [vehicleId]);

  const handleNext = () => {
    // Mark current step as completed
    setStepStatus(prev => 
      prev.map(step => 
        step.step === currentStep 
          ? { ...step, completed: true }
          : step
      )
    );

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit claim
      handleSubmitClaim();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmitClaim = async () => {
    try {
      // Here you would make API call to submit claim
      console.log('Submitting claim:', claimData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting claim:', error);
    }
  };

  const updateClaimData = (data: Partial<ClaimData>) => {
    setClaimData(prev => ({ ...prev, ...data }));
  };

  const renderCurrentStep = () => {
    if (isSubmitted) {
      return <SuccessStep onGoToDashboard={() => navigate('/dashboard')} />;
    }

    switch (currentStep) {
      case 1:
        return (
          <PartiesInvolvedStep
            parties={claimData.parties}
            onUpdate={(parties: Party[]) => updateClaimData({ parties })}
          />
        );
      case 2:
        return (
          <ClaimInformationStep
            data={{
              policyNumber: claimData.policyNumber,
              incidentAddress: claimData.incidentAddress,
              incidentDate: claimData.incidentDate,
              description: claimData.description
            }}
            onUpdate={(data: any) => updateClaimData(data)}
          />
        );
      case 3:
        return (
          <DamagePhotosStep
            photos={claimData.damagePhotos}
            onUpdate={(damagePhotos: DamagePhoto[]) => updateClaimData({ damagePhotos })}
          />
        );
      case 4:
        return (
          <PoliceReportStep
            policeReport={claimData.policeReport}
            onUpdate={(policeReport: PoliceReport) => updateClaimData({ policeReport })}
          />
        );
      case 5:
        return (
          <ConfirmationStep
            claimData={claimData}
            onUpdate={(data: any) => updateClaimData(data)}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return claimData.parties.length > 0 && claimData.parties[0].name.trim() !== '';
      case 2:
        return claimData.incidentAddress.trim() !== '' &&
               claimData.incidentDate !== '' &&
               claimData.description.trim() !== '';
      case 3:
        return claimData.damagePhotos.length > 0;
      case 4:
        // Police report step is always valid (user can choose not to file a report)
        return true;
      case 5:
        return claimData.confirmed;
      default:
        return false;
    }
  };

  if (isSubmitted) {
    return (
      <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        <SuccessStep onGoToDashboard={() => navigate('/dashboard')} />
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <ClaimFlowLogo sx={{ mr: 2, color: 'white' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ClaimFlow - Step {currentStep} of 5
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        <StepIndicator currentStep={currentStep} steps={stepStatus} />
        
        <Paper sx={{ p: 4, mb: 4 }}>
          {renderCurrentStep()}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            size="large"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid()}
            size="large"
          >
            {currentStep === 5 ? 'Submit Claim' : 'Next Step'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ClaimIntakeFlow;
