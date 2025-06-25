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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Logout,
  Search
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClaimFlowLogo from '../components/ClaimFlowLogo';

// Simplified claim data structure
interface Claim {
  id: string;
  claimantName: string;
  claimType: string;
  dateSubmitted: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  amount: number;
  status: 'New' | 'Under Review' | 'Approved' | 'Denied';
}

const mockClaims: Claim[] = [
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
    claimantName: 'Emma Davis',
    claimType: 'Auto Vandalism',
    dateSubmitted: '2025-06-22',
    priority: 'Medium',
    amount: 3500,
    status: 'New'
  },
  {
    id: 'CLM-004',
    claimantName: 'Robert Chen',
    claimType: 'Auto Collision',
    dateSubmitted: '2025-06-21',
    priority: 'Low',
    amount: 2800,
    status: 'Under Review'
  },
  {
    id: 'CLM-005',
    claimantName: 'Lisa Rodriguez',
    claimType: 'Auto Glass Damage',
    dateSubmitted: '2025-06-20',
    priority: 'High',
    amount: 1200,
    status: 'New'
  }
];

const AgentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Simple filtering - search and critical claims only
  const filteredClaims = mockClaims.filter(claim => {
    const matchesSearch = 
      claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claimType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCritical = showCriticalOnly ? claim.priority === 'Critical' : true;
    
    return matchesSearch && matchesCritical;
  });

  // Simple metrics
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Simple Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <ClaimFlowLogo sx={{ mr: 2, color: 'white' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Agent Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {criticalClaims > 0 && (
              <Chip 
                label={`${criticalClaims} Critical`}
                color="error"
                size="small"
                sx={{ color: 'white', borderColor: 'white' }}
              />
            )}
            <Typography variant="body2" color="inherit">
              {user?.name}
            </Typography>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <IconButton 
              color="inherit" 
              onClick={handleLogout} 
              size="small" 
              aria-label="Logout"
              title="Logout"
            >
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Message */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {user?.name}
          </Typography>
          {criticalClaims > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Attention:</strong> You have {criticalClaims} critical claims requiring immediate review.
              </Typography>
            </Alert>
          )}
        </Box>

        {/* Simple Status Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4 
        }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" component="div" color="primary.main" gutterBottom>
                {mockClaims.length}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Total Claims
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ bgcolor: criticalClaims > 0 ? 'error.light' : 'background.paper' }}>
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

          <Card elevation={2}>
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

        {/* Simple Actions */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant={showCriticalOnly ? "contained" : "outlined"}
                color="error"
                onClick={() => setShowCriticalOnly(!showCriticalOnly)}
                aria-label={showCriticalOnly ? "Show all claims" : "Show only critical claims"}
              >
                {showCriticalOnly ? "Show All Claims" : "Show Critical Only"}
              </Button>
              <Button 
                variant="outlined"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                Clear Search
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Claims List */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                Claims Queue ({filteredClaims.length})
              </Typography>
              
              <TextField
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ minWidth: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                aria-label="Search claims by ID, name, or type"
              />
            </Box>

            {/* Simple Claims Table */}
            <Box sx={{ overflowX: 'auto' }}>
              <Table aria-label="Claims list">
                <TableHead>
                  <TableRow>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Priority</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Claim ID</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Claimant</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Type</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Amount</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Status</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Action</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClaims
                    .sort((a, b) => {
                      // Sort by priority: Critical > High > Medium > Low
                      const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                      return priorityOrder[b.priority] - priorityOrder[a.priority];
                    })
                    .map((claim) => (
                      <TableRow 
                        key={claim.id} 
                        hover 
                        sx={{ 
                          bgcolor: claim.priority === 'Critical' ? 'error.lighter' : 'inherit'
                        }}
                      >
                        <TableCell>
                          <Chip
                            label={claim.priority}
                            color={getPriorityColor(claim.priority) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {claim.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {claim.claimantName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {claim.claimType}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(claim.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={claim.status}
                            variant="outlined"
                            size="small"
                            color={claim.status === 'New' ? 'info' : 
                                   claim.status === 'Under Review' ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="contained"
                            color="primary"
                            aria-label={`Review claim ${claim.id}`}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
            
            {filteredClaims.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No claims found matching your search criteria.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AgentDashboard;
