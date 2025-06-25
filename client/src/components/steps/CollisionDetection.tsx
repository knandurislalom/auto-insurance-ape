import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Search,
  Business,
  CameraAlt,
  Schedule,
  CheckCircle,
  DirectionsCar
} from '@mui/icons-material';
import { EstimationOption } from '../../types/claim';

interface CollisionDetectionProps {
  onSelectEstimationMethod: (method: 'adjuster' | 'repair_shop' | 'digital') => void;
}

const estimationOptions: EstimationOption[] = [
  {
    type: 'adjuster',
    title: 'Insurance Adjuster Visit',
    description: 'We\'ll send an adjuster to you',
    timeline: '1-2 business days',
    benefits: ['Free inspection', 'Professional assessment', 'No travel required', 'Direct insurance communication']
  },
  {
    type: 'repair_shop',
    title: 'Preferred Repair Shop',
    description: 'Get estimate from repair shop',
    timeline: 'Same day estimates',
    benefits: ['Network of trusted shops', 'Immediate estimates', 'Direct insurance payment', 'Quality guaranteed']
  },
  {
    type: 'digital',
    title: 'Digital Assessment',
    description: 'Submit additional photos',
    timeline: 'Immediate preliminary est.',
    benefits: ['AI-assisted evaluation', 'Instant preliminary estimate', 'No appointments needed', 'Upload at your convenience']
  }
];

const getOptionIcon = (type: string) => {
  switch (type) {
    case 'adjuster':
      return <Business />;
    case 'repair_shop':
      return <DirectionsCar />;
    case 'digital':
      return <CameraAlt />;
    default:
      return <Search />;
  }
};

const CollisionDetection: React.FC<CollisionDetectionProps> = ({ onSelectEstimationMethod }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      {/* Detection Header */}
      <Box sx={{ mb: 4 }}>
        <Search 
          sx={{ 
            fontSize: 60, 
            color: 'warning.main',
            mb: 2
          }} 
        />
        <Typography variant="h4" component="h1" gutterBottom color="warning.main">
          Collision Detected!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Based on your claim details and photos, we've identified this as a collision-related claim.
        </Typography>
      </Box>

      {/* Next Steps Alert */}
      <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
        <Typography variant="h6" gutterBottom>
          📋 Damage Assessment Needed
        </Typography>
        <Typography variant="body2">
          To process your claim, we need a professional damage estimate. 
          Choose your preferred option below:
        </Typography>
      </Alert>

      {/* Estimation Options */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {estimationOptions.map((option) => (
          <Card 
            key={option.type}
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)'
              }
            }}
            onClick={() => onSelectEstimationMethod(option.type as 'adjuster' | 'repair_shop' | 'digital')}
          >
            <CardContent sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ mr: 2, color: 'primary.main' }}>
                  {getOptionIcon(option.type)}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {option.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip 
                      icon={<Schedule />}
                      label={option.timeline}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>

              <List dense>
                {option.benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={benefit}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ minWidth: 200 }}
                >
                  Choose This Option
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Additional Information */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          💡 <strong>Pro Tip:</strong> You can submit multiple estimates to ensure accurate assessment. 
          Our claims team will review all estimates to determine the best course of action.
        </Typography>
      </Box>
    </Box>
  );
};

export default CollisionDetection;
