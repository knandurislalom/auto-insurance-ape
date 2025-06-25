import React, { useState } from 'react';
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Logout,
  Search,
  Visibility
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClaimFlowLogo from '../components/ClaimFlowLogo';

// Simplified claim interface
interface SimpleClaim {
  id: string;
  claimantName: string;
  claimType: string;
  dateSubmitted: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  amount: number;
  status: 'New' | 'Under Review' | 'Pending Approval' | 'Approved' | 'Denied';
}

const mockClaims: SimpleClaim[] = [
  {
    id: 'CLM-001',
    claimantName: 'Sarah Johnson',
    claimType: 'Auto Collision',
    dateSubmitted: '2025-06-24',
    priority: 'Critical',
    amount: 15000,
    status: 'New'
  },
  {
    id: 'CLM-002',
    claimantName: 'Mike Wilson',
    claimType: 'Auto Theft',
    dateSubmitted: '2025-06-23',
    priority: 'Critical',
    amount: 35000,
    status: 'Under Review'
  },
  {
    id: 'CLM-003',
    claimantName: 'Emily Davis',
    claimType: 'Auto Collision',
    dateSubmitted: '2025-06-24',
    priority: 'High',
    amount: 8500,
    status: 'New'
  },
  {
    id: 'CLM-004',
    claimantName: 'Robert Brown',
    claimType: 'Auto Vandalism',
    dateSubmitted: '2025-06-22',
    priority: 'Medium',
    amount: 3200,
    status: 'Under Review'
  },
  {
    id: 'CLM-005',
    claimantName: 'Lisa Anderson',
    claimType: 'Auto Collision',
    dateSubmitted: '2025-06-21',
    priority: 'Low',
    amount: 1800,
    status: 'Pending Approval'
  }
];

const SimplifiedAgentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewClaim = (claimId: string) => {
    console.log(`Viewing claim: ${claimId}`);
    // Navigate to claim details
  };

  // Filter claims based on search
  const filteredClaims = mockClaims.filter(claim => 
    claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.claimType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate simple metrics
  const totalClaims = mockClaims.length;
  const criticalClaims = mockClaims.filter(c => c.priority === 'Critical').length;
  const newClaims = mockClaims.filter(c => c.status === 'New').length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'info';
      case 'Under Review': return 'warning';
      case 'Pending Approval': return 'secondary';
      case 'Approved': return 'success';
      case 'Denied': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Simplified App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <ClaimFlowLogo sx={{ mr: 2, color: 'white' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ClaimFlow - Agent Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="inherit">
              {user?.name}
            </Typography>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <IconButton color="inherit" onClick={handleLogout} size="small">
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Simplified Welcome Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {user?.name}
          </Typography>
          
          {/* Single Alert for Critical Claims */}
          {criticalClaims > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>{criticalClaims} critical claims</strong> need immediate attention
              </Typography>
            </Alert>
          )}
        </Box>

        {/* Simplified Metrics - Only 3 Essential Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4 
        }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" component="div" color="primary.main" gutterBottom>
                {totalClaims}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Total Claims
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: criticalClaims > 0 ? 'error.light' : 'background.paper' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                component="div" 
                color={criticalClaims > 0 ? 'error.main' : 'success.main'} 
                gutterBottom
              >
                {criticalClaims}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Critical Claims
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" component="div" color="info.main" gutterBottom>
                {newClaims}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                New Claims
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Simplified Search and Claims Table */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Claims Queue
              </Typography>
              <TextField
                size="small"
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300 }}
              />
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Claim ID</strong></TableCell>
                    <TableCell><strong>Claimant</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Priority</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Amount</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClaims.map((claim) => (
                    <TableRow key={claim.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {claim.id}
                        </Typography>
                      </TableCell>
                      <TableCell>{claim.claimantName}</TableCell>
                      <TableCell>{claim.claimType}</TableCell>
                      <TableCell>
                        <Chip 
                          label={claim.priority}
                          color={getPriorityColor(claim.priority) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={claim.status}
                          color={getStatusColor(claim.status) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(claim.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>{claim.dateSubmitted}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleViewClaim(claim.id)}
                          variant="outlined"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredClaims.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No claims found matching your search.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SimplifiedAgentDashboard;
