import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Rating,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  LocationOn,
  Star,
  Schedule,
  Payment,
  Verified,
  DirectionsCar,
  Phone,
  Directions
} from '@mui/icons-material';
import { RepairShop } from '../../types/claim';

interface RepairShopSelectionProps {
  selectedRepairShop?: RepairShop;
  onSelectShop: (shop: RepairShop) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const mockRepairShops: RepairShop[] = [
  {
    id: '1',
    name: 'Downtown Auto Body',
    rating: 4.8,
    reviewCount: 127,
    distance: 0.5,
    availability: 'Available today',
    certifications: ['BMW', 'Honda'],
    directPay: true,
    address: '123 Main St, Seattle WA',
    phone: '(206) 555-0101'
  },
  {
    id: '2',
    name: 'Precision Collision Center',
    rating: 4.6,
    reviewCount: 89,
    distance: 1.2,
    availability: 'Available tomorrow',
    certifications: ['BMW', 'Honda', 'Toyota'],
    directPay: true,
    address: '456 1st Ave, Seattle WA',
    phone: '(206) 555-0102'
  },
  {
    id: '3',
    name: 'Quick Fix Auto',
    rating: 4.2,
    reviewCount: 156,
    distance: 2.1,
    availability: 'Available Mon-Fri',
    certifications: [],
    directPay: true,
    address: '789 2nd St, Seattle WA',
    phone: '(206) 555-0103'
  }
];

const RepairShopSelection: React.FC<RepairShopSelectionProps> = ({
  selectedRepairShop,
  onSelectShop,
  onSubmit,
  onBack
}) => {
  const [selectedShopId, setSelectedShopId] = useState<string>(selectedRepairShop?.id || '');

  const handleSelectShop = (shop: RepairShop) => {
    setSelectedShopId(shop.id);
    onSelectShop(shop);
  };

  const handleGetEstimate = (shop: RepairShop) => {
    handleSelectShop(shop);
    onSubmit();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Preferred Repair Shops
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Choose from our network of trusted, certified repair shops:
      </Typography>

      {/* Repair Shop Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
        {mockRepairShops.map((shop) => (
          <Card 
            key={shop.id}
            sx={{ 
              cursor: 'pointer',
              border: selectedShopId === shop.id ? 2 : 1,
              borderColor: selectedShopId === shop.id ? 'primary.main' : 'divider',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-1px)'
              }
            }}
            onClick={() => handleSelectShop(shop)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <DirectionsCar sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                      {shop.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={shop.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {shop.rating} ({shop.reviewCount} reviews)
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {shop.distance} miles away
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip 
                      icon={<Schedule />}
                      label={shop.availability}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                    {shop.directPay && (
                      <Chip 
                        icon={<Payment />}
                        label="Insurance Direct Pay"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {shop.certifications.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Verified sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        Certified: {shop.certifications.join(', ')}
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    📍 {shop.address}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<Directions />}
                  onClick={(e) => {
                    e.stopPropagation();
                    // In a real app, this would open maps/directions
                    console.log('Get directions to:', shop.name);
                  }}
                >
                  Directions
                </Button>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGetEstimate(shop);
                  }}
                >
                  Get Estimate
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Use Different Shop Option */}
      <Card sx={{ mb: 4, bgcolor: 'grey.50' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Have a preferred shop not listed?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You can use any licensed repair shop. Keep in mind that non-network shops may require 
            different payment arrangements.
          </Typography>
          <Button 
            variant="outlined"
            onClick={() => {
              // In a real app, this would allow custom shop entry
              console.log('Use different shop');
            }}
          >
            Use Different Shop
          </Button>
        </CardContent>
      </Card>

      {/* Benefits Alert */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="subtitle2" gutterBottom>
          Benefits of using network repair shops:
        </Typography>
        <List dense>
          <ListItem sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              <Box sx={{ width: 4, height: 4, bgcolor: 'primary.main', borderRadius: '50%' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Direct insurance payment - no upfront costs"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              <Box sx={{ width: 4, height: 4, bgcolor: 'primary.main', borderRadius: '50%' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Quality guarantee on all work performed"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              <Box sx={{ width: 4, height: 4, bgcolor: 'primary.main', borderRadius: '50%' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Streamlined communication with insurance"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        </List>
      </Alert>

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
          onClick={onSubmit}
          disabled={!selectedShopId}
          size="large"
        >
          Continue with Selected Shop
        </Button>
      </Box>
    </Box>
  );
};

export default RepairShopSelection;
