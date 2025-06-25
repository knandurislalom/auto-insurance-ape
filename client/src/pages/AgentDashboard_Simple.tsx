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
  LinearProgress,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  Logout,
  Search,
  Visibility,
  ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClaimFlowLogo from '../components/ClaimFlowLogo';

// Simplified data structure
interface Claim {
  id: string;
  claimantName: string;
  claimType: string;
  dateSubmitted: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  riskScore: number;
  fraudProbability: number;
  amount: number;
  status: 'New' | 'Under Review' | 'Pending Approval' | 'Approved' | 'Denied';
}

const mockClaims: Claim[] = [
  {
    id: 'CLM-001',
    claimantName: 'Sarah Johnson',
    claimType: 'Auto Collision',
    dateSubmitted: '2025-06-24',
    priority: 'Critical',
    riskScore: 85,
    fraudProbability: 78,
    amount: 15000,
    status: 'New'
  },
  {
    id: 'CLM-002',
    claimantName: 'Mike Wilson',
    claimType: 'Auto Theft',
    dateSubmitted: '2025-06-23',
    priority: 'Critical',
    riskScore: 92,
    fraudProbability: 85,
    amount: 35000,
    status: 'Under Review'
  },
  {
    id: 'CLM-003',
    claimantName: 'Emma Davis',
    claimType: 'Auto Vandalism',
    dateSubmitted: '2025-06-22',
    priority: 'Medium',
    riskScore: 45,
    fraudProbability: 35,
    amount: 3500,
    status: 'Pending Approval'
  },
  {
    id: 'CLM-004',
    claimantName: 'Robert Chen',
    claimType: 'Auto Collision',
    dateSubmitted: '2025-06-21',
    priority: 'Low',
    riskScore: 25,
    fraudProbability: 15,
    amount: 2800,
    status: 'Under Review'
  },
  {
    id: 'CLM-005',
    claimantName: 'Lisa Rodriguez',
    claimType: 'Auto Glass Damage',
    dateSubmitted: '2025-06-20',
    priority: 'High',
    riskScore: 65,
    fraudProbability: 55,
    amount: 1200,
    status: 'New'
  }
];

const AgentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClaimSelect = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowDetailView(true);
  };

  const handleDetailViewClose = () => {
    setShowDetailView(false);
    setSelectedClaim(null);
  };

  // Simple filtering
  const filteredClaims = mockClaims.filter(claim => {
    const matchesSearch = claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || claim.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || claim.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Simple metrics
  const metrics = {
    totalClaims: mockClaims.length,
    criticalClaims: mockClaims.filter(c => c.priority === 'Critical').length,
    completedToday: 8
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 80) return 'error';
    if (riskScore >= 60) return 'warning';
    if (riskScore >= 40) return 'info';
    return 'success';
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
            ClaimFlow - Agent Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {metrics.criticalClaims > 0 && (
              <Chip 
                label={`${metrics.criticalClaims} Critical`}
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
            <IconButton color="inherit" onClick={handleLogout} size="small" aria-label="Logout">
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Simple Welcome Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {user?.name}
          </Typography>
          {metrics.criticalClaims > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Urgent:</strong> You have {metrics.criticalClaims} critical claims that need immediate attention.
              </Typography>
            </Alert>
          )}
        </Box>

        {/* Simple Metrics Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 3 
        }}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="div" color="primary.main" gutterBottom>
                {metrics.totalClaims}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Claims
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: metrics.criticalClaims > 0 ? 'error.light' : 'background.paper' }}>
            <CardContent>
              <Typography 
                variant="h4" 
                component="div" 
                color={metrics.criticalClaims > 0 ? 'error.main' : 'success.main'} 
                gutterBottom
              >
                {metrics.criticalClaims}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Critical Claims
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h4" component="div" color="success.main" gutterBottom>
                {metrics.completedToday}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Completed Today
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Simple Quick Actions */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => setFilterPriority('Critical')}
                aria-label="Show only critical claims"
              >
                View Critical Claims
              </Button>
              <Button 
                variant="outlined"
                onClick={() => setFilterStatus('New')}
                aria-label="Show only new claims"
              >
                New Claims
              </Button>
              <Button 
                variant="outlined"
                onClick={() => setFilterStatus('Under Review')}
                aria-label="Show claims under review"
              >
                Under Review
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Simple Claims Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Claims Queue
            </Typography>
            
            {/* Simple Search and Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search by claim ID or claimant name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
                aria-label="Search claims"
              />
              
              <FormControl size="medium" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Under Review">Under Review</MenuItem>
                  <MenuItem value="Pending Approval">Pending</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="medium" sx={{ minWidth: 120 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  label="Priority"
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Simplified Claims Table */}
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="claims queue">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">Priority</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">Claim ID</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">Claimant</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">Type</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">Amount</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">Status</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">Actions</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClaims
                    .sort((a, b) => {
                      // Simple priority sort: Critical > High > Medium > Low
                      const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                      return priorityOrder[b.priority] - priorityOrder[a.priority];
                    })
                    .map((claim) => (
                      <TableRow 
                        key={claim.id} 
                        hover 
                        sx={{ 
                          bgcolor: claim.priority === 'Critical' ? 'error.lighter' : 'inherit',
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
                          <Tooltip title="View claim details">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleClaimSelect(claim)}
                              aria-label={`View details for claim ${claim.id}`}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Simple Summary */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredClaims.length} of {mockClaims.length} claims
                {metrics.criticalClaims > 0 && ` • ${metrics.criticalClaims} Critical`}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Simplified Claim Detail Dialog */}
        <Dialog 
          open={showDetailView} 
          onClose={handleDetailViewClose}
          maxWidth="md"
          fullWidth
          aria-labelledby="claim-detail-title"
        >
          <DialogTitle id="claim-detail-title">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={handleDetailViewClose} aria-label="Close">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6">
                Claim {selectedClaim?.id} - {selectedClaim?.claimantName}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedClaim && (
              <Box sx={{ py: 2 }}>
                {/* Basic Claim Info */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Claim Information
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Claim Type</Typography>
                      <Typography variant="body1">{selectedClaim.claimType}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Amount</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formatCurrency(selectedClaim.amount)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Date Submitted</Typography>
                      <Typography variant="body1">
                        {new Date(selectedClaim.dateSubmitted).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Status</Typography>
                      <Chip label={selectedClaim.status} size="small" color="primary" />
                    </Box>
                  </Box>
                </Box>

                {/* Risk Information */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Risk Assessment
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Risk Score: {selectedClaim.riskScore}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedClaim.riskScore} 
                      color={getRiskColor(selectedClaim.riskScore) as any}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                  {selectedClaim.fraudProbability > 50 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        High fraud probability detected: {selectedClaim.fraudProbability}%
                      </Typography>
                    </Alert>
                  )}
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" color="success">
                    Approve
                  </Button>
                  <Button variant="outlined" color="error">
                    Deny
                  </Button>
                  <Button variant="contained">
                    Review
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AgentDashboard;
