import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Avatar,
  Chip,
  Stack,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { DirectionsCar, Add, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from '../types/claim';
import { useAuth } from '../contexts/AuthContext';
import ClaimFlowLogo from '../components/ClaimFlowLogo';

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Honda',
    model: 'Accord',
    year: 2020,
    licensePlate: 'ABC-123',
  },
  {
    id: '2',
    make: 'Toyota',
    model: 'RAV4',
    year: 2018,
    licensePlate: 'XYZ-789',
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userName = user?.name || 'User'; // Use authenticated user's name

  const handleStartClaim = (vehicleId: string) => {
    navigate(`/claim/new?vehicle=${vehicleId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <ClaimFlowLogo sx={{ mr: 2, color: 'white' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ClaimFlow
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">
              {userName}
            </Typography>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {userName.charAt(0)}
            </Avatar>
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
            >
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Good morning, {userName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your vehicles and file claims when needed.
        </Typography>
      </Box>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Your Vehicles
      </Typography>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4
        }}
      >
        {mockVehicles.map((vehicle) => (
          <Card 
            key={vehicle.id}
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <DirectionsCar />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="h3">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </Typography>
                  <Chip 
                    label={vehicle.licensePlate} 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                startIcon={<Add />}
                fullWidth
                size="large"
                onClick={() => handleStartClaim(vehicle.id)}
                sx={{ m: 1 }}
              >
                Add a Claim
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Quick Actions
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button 
            variant="outlined" 
            fullWidth
            onClick={() => navigate('/claims')}
          >
            View Existing Claims
          </Button>
          <Button variant="outlined" fullWidth>
            Policy Documents
          </Button>
          <Button variant="outlined" fullWidth>
            Contact Support
          </Button>
        </Stack>
      </Box>
    </Container>
    </Box>
  );
};

export default Dashboard;
