import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import {
  CameraAlt,
  CheckCircle,
  Schedule,
  LightbulbOutlined,
  Close,
  PhotoCamera
} from '@mui/icons-material';
import { DigitalAssessment, DamagePhoto } from '../../types/claim';

interface DigitalAssessmentProps {
  digitalAssessment?: DigitalAssessment;
  onUpdate: (assessment: DigitalAssessment) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const requiredPhotos = [
  'Overall vehicle view',
  'Close-up of damage',
  'License plate (clear)',
  'VIN number (dashboard)',
  'Damage from multiple angles'
];

const photographyTips = [
  'Use good lighting (daylight preferred)',
  'Keep camera steady',
  'Get close to damaged areas',
  'Include reference objects for scale'
];

const DigitalAssessmentGuide: React.FC<DigitalAssessmentProps> = ({
  digitalAssessment,
  onUpdate,
  onSubmit,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessment, setAssessment] = useState<DigitalAssessment>(
    digitalAssessment || {
      requiredPhotos,
      completedPhotos: [],
      additionalPhotos: []
    }
  );

  const handlePhotoCapture = (photoType: string) => {
    // In a real app, this would open the camera
    console.log('Capturing photo for:', photoType);
    
    const updatedAssessment = {
      ...assessment,
      completedPhotos: [...assessment.completedPhotos, photoType]
    };
    setAssessment(updatedAssessment);
    onUpdate(updatedAssessment);
  };

  const handleRemovePhoto = (photoType: string) => {
    const updatedAssessment = {
      ...assessment,
      completedPhotos: assessment.completedPhotos.filter(p => p !== photoType)
    };
    setAssessment(updatedAssessment);
    onUpdate(updatedAssessment);
  };

  const getProgressPercentage = () => {
    return (assessment.completedPhotos.length / requiredPhotos.length) * 100;
  };

  const isPhotoCompleted = (photoType: string) => {
    return assessment.completedPhotos.includes(photoType);
  };

  const canProceed = () => {
    return assessment.completedPhotos.length >= requiredPhotos.length;
  };

  const getNextRequiredPhoto = () => {
    return requiredPhotos.find(photo => !isPhotoCompleted(photo));
  };

  if (currentStep === 1) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          AI-Powered Damage Assessment
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Our AI will analyze additional photos to provide a preliminary damage estimate.
        </Typography>

        {/* Progress Indicator */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Schedule sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Step 1 of 5
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={20} 
              sx={{ height: 8, borderRadius: 1 }}
            />
          </CardContent>
        </Card>

        {/* Photo Requirements */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📋 Photo Requirements:
            </Typography>
            
            <List>
              {requiredPhotos.map((photoType, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon>
                    {isPhotoCompleted(photoType) ? (
                      <CheckCircle sx={{ color: 'success.main' }} />
                    ) : (
                      <Schedule sx={{ color: 'warning.main' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={photoType}
                    primaryTypographyProps={{
                      style: {
                        textDecoration: isPhotoCompleted(photoType) ? 'line-through' : 'none',
                        color: isPhotoCompleted(photoType) ? 'gray' : 'inherit'
                      }
                    }}
                  />
                  {isPhotoCompleted(photoType) ? (
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemovePhoto(photoType)}
                      sx={{ ml: 1 }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  ) : (
                    <Button 
                      size="small" 
                      variant="outlined"
                      startIcon={<CameraAlt />}
                      onClick={() => handlePhotoCapture(photoType)}
                      sx={{ ml: 1 }}
                    >
                      Take Photo
                    </Button>
                  )}
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Current Photos: {assessment.completedPhotos.length}/{requiredPhotos.length} needed
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={getProgressPercentage()} 
                sx={{ height: 6, borderRadius: 1 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Photography Tips */}
        <Alert severity="info" icon={<LightbulbOutlined />} sx={{ mb: 4 }}>
          <Typography variant="subtitle2" gutterBottom>
            💡 Tips for Better Photos:
          </Typography>
          <List dense>
            {photographyTips.map((tip, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <Box sx={{ width: 4, height: 4, bgcolor: 'primary.main', borderRadius: '50%' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={tip}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Alert>

        {/* Photo Thumbnails */}
        {assessment.completedPhotos.length > 0 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Uploaded Photos
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {assessment.completedPhotos.map((photoType, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <PhotoCamera sx={{ color: 'grey.500' }} />
                    <IconButton 
                      size="small"
                      sx={{ 
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                      onClick={() => handleRemovePhoto(photoType)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {/* Add more photo slots */}
                {Array.from({ length: Math.max(0, requiredPhotos.length - assessment.completedPhotos.length) }).map((_, index) => (
                  <Box 
                    key={`empty-${index}`}
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed',
                      borderColor: 'grey.300'
                    }}
                  >
                    <CameraAlt sx={{ color: 'grey.400' }} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Next Photo to Take */}
        {!canProceed() && (
          <Card sx={{ mb: 4, bgcolor: 'primary.lighter' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📸 Take Next Photo
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {getNextRequiredPhoto()}
              </Typography>
              <Button 
                variant="contained"
                startIcon={<CameraAlt />}
                onClick={() => {
                  const nextPhoto = getNextRequiredPhoto();
                  if (nextPhoto) {
                    handlePhotoCapture(nextPhoto);
                  }
                }}
                size="large"
              >
                Take {getNextRequiredPhoto()}
              </Button>
            </CardContent>
          </Card>
        )}

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
            onClick={() => setCurrentStep(2)}
            disabled={!canProceed()}
            size="large"
          >
            Review & Submit
          </Button>
        </Box>
      </Box>
    );
  }

  // Step 2: Review and Submit
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Review Your Photos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Please review your photos before submitting for AI analysis.
      </Typography>

      {/* Completed Photos Review */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Uploaded Photos ({assessment.completedPhotos.length})
          </Typography>
          
          <List>
            {assessment.completedPhotos.map((photoType, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary={photoType} />
              </ListItem>
            ))}
          </List>

          <Alert severity="success" sx={{ mt: 2 }}>
            All required photos have been uploaded successfully!
          </Alert>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            What happens next?
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
              </ListItemIcon>
              <ListItemText 
                primary="AI analysis of your photos (2-3 minutes)"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Preliminary damage estimate generated"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Estimate submitted to your claim for review"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={() => setCurrentStep(1)}
          size="large"
        >
          Back to Photos
        </Button>
        
        <Button
          variant="contained"
          onClick={onSubmit}
          size="large"
        >
          Submit for AI Analysis
        </Button>
      </Box>
    </Box>
  );
};

export default DigitalAssessmentGuide;
