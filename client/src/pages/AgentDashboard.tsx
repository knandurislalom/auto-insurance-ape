import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Chip,
  Stack,
  Paper
} from '@mui/material';
import {
  Business,
  Logout,
  Assignment,
  PendingActions,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AgentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock agent statistics
  const stats = [
    { label: 'Pending Claims', value: 12, color: 'warning', icon: <PendingActions /> },
    { label: 'Under Review', value: 8, color: 'info', icon: <Assignment /> },
    { label: 'Approved Today', value: 5, color: 'success', icon: <CheckCircle /> },
    { label: 'Requires Attention', value: 3, color: 'error', icon: <Warning /> }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Business sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Agent Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">
              Welcome, {user?.name}
            </Typography>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Good morning, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your claims processing overview for today.
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          {stats.map((stat, index) => (
            <Card key={index} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" color={`${stat.color}.main`}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}.light`, color: `${stat.color}.main` }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Quick Actions */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" startIcon={<Assignment />}>
              Review Pending Claims
            </Button>
            <Button variant="outlined" startIcon={<CheckCircle />}>
              Process Approvals
            </Button>
            <Button variant="outlined" startIcon={<Warning />}>
              Handle Urgent Cases
            </Button>
          </Stack>
        </Paper>

        {/* Feature Notice */}
        <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              🚧 Agent Features Coming Soon
            </Typography>
            <Typography variant="body1" paragraph>
              The agent dashboard is currently under development. The following features will be available soon:
            </Typography>
            <Box component="ul" sx={{ mt: 2 }}>
              <li>Claims queue management</li>
              <li>Customer case reviews</li>
              <li>Document verification tools</li>
              <li>Approval workflow system</li>
              <li>Communication center</li>
              <li>Reporting and analytics</li>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Chip 
                label="Development in Progress" 
                color="primary" 
                variant="outlined" 
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AgentDashboard;
