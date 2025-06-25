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
  Alert,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Logout,
  Search,
  Visibility,
  Warning,
  ReportProblem
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClaimFlowLogo from '../components/ClaimFlowLogo';

// Enhanced claim interface with rule validation data
interface SimpleClaim {
  id: string;
  claimantName: string;
  claimType: string;
  dateSubmitted: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  amount: number;
  status: 'New' | 'Under Review' | 'Pending Approval' | 'Approved' | 'Denied';
  hasPoliceReport: boolean;
  hasDriverLicense: boolean;
  hasLicensePlate: boolean;
  injuriesReported: boolean;
}

// Business Rules for validation
interface BusinessRule {
  id: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  check: (claim: SimpleClaim) => boolean;
}

const businessRules: BusinessRule[] = [
  {
    id: 'A001',
    description: 'Police report must be uploaded',
    severity: 'High',
    check: (claim) => claim.claimType.toLowerCase().includes('auto') ? claim.hasPoliceReport : true
  },
  {
    id: 'A002',
    description: 'License plate or driver\'s license required',
    severity: 'High',
    check: (claim) => claim.hasDriverLicense || claim.hasLicensePlate
  },
  {
    id: 'A003',
    description: 'Estimated damage for minor collisions should be < $10,000',
    severity: 'Medium',
    check: (claim) => claim.amount <= 10000
  },
  {
    id: 'A004',
    description: 'Injury flag inconsistent with damage < $500',
    severity: 'Medium',
    check: (claim) => !(claim.amount < 500 && claim.injuriesReported)
  }
];

const mockClaims: SimpleClaim[] = [
  {
    id: 'CLM-001',
    claimantName: 'Sarah Johnson',
    claimType: 'Auto Collision',
    dateSubmitted: '2025-06-24',
    priority: 'Critical',
    amount: 15000,
    status: 'New',
    hasPoliceReport: false, // Violates A001
    hasDriverLicense: true,
    hasLicensePlate: true,
    injuriesReported: false
  },
  {
    id: 'CLM-002',
    claimantName: 'Mike Wilson',
    claimType: 'Auto Theft',
    dateSubmitted: '2025-06-23',
    priority: 'Critical',
    amount: 35000,
    status: 'Under Review',
    hasPoliceReport: true,
    hasDriverLicense: false, // Violates A002
    hasLicensePlate: false,  // Violates A002
    injuriesReported: false
  },
  {
    id: 'CLM-003',
    claimantName: 'Emily Davis',
    claimType: 'Auto Collision',
    dateSubmitted: '2025-06-24',
    priority: 'High',
    amount: 8500,
    status: 'New',
    hasPoliceReport: true,
    hasDriverLicense: true,
    hasLicensePlate: true,
    injuriesReported: false
  },
  {
    id: 'CLM-004',
    claimantName: 'Robert Brown',
    claimType: 'Auto Vandalism',
    dateSubmitted: '2025-06-22',
    priority: 'Medium',
    amount: 3200,
    status: 'Under Review',
    hasPoliceReport: true,
    hasDriverLicense: true,
    hasLicensePlate: true,
    injuriesReported: false
  },
  {
    id: 'CLM-005',
    claimantName: 'Lisa Anderson',
    claimType: 'Auto Collision',
    dateSubmitted: '2025-06-21',
    priority: 'Low',
    amount: 1800,
    status: 'Pending Approval',
    hasPoliceReport: true,
    hasDriverLicense: true,
    hasLicensePlate: true,
    injuriesReported: false
  },
  {
    id: 'CLM-006',
    claimantName: 'James Carter',
    claimType: 'Auto Collision',
    dateSubmitted: '2025-06-21',
    priority: 'Medium',
    amount: 400,
    status: 'New',
    hasPoliceReport: true,
    hasDriverLicense: true,
    hasLicensePlate: true,
    injuriesReported: true // Violates A004 (injury with damage < $500)
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

  // Function to validate a claim against business rules
  const validateClaim = (claim: SimpleClaim) => {
    const violations = businessRules.filter(rule => !rule.check(claim));
    return violations;
  };

  // Function to get all claims with rule violations
  const getClaimsWithViolations = () => {
    return mockClaims.filter(claim => validateClaim(claim).length > 0);
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
  const claimsWithViolations = getClaimsWithViolations();
  const highSeverityViolations = claimsWithViolations.filter(claim => 
    validateClaim(claim).some(violation => violation.severity === 'High')
  ).length;

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
          
          {/* Rule Violations Alert */}
          {claimsWithViolations.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>⚠️ {claimsWithViolations.length} claims have business rule violations</strong>
                {highSeverityViolations > 0 && (
                  <span> - {highSeverityViolations} with high severity issues</span>
                )}
              </Typography>
            </Alert>
          )}
          
          {/* Critical Claims Alert */}
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
                    <TableCell><strong>Rule Issues</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClaims.map((claim) => {
                    const violations = validateClaim(claim);
                    const hasHighSeverity = violations.some(v => v.severity === 'High');
                    
                    return (
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
                        <TableCell>
                          {violations.length > 0 ? (
                            <Tooltip 
                              title={
                                <div>
                                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                                    Business Rule Violations:
                                  </Typography>
                                  {violations.map((violation, index) => (
                                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                      • {violation.id}: {violation.description} ({violation.severity})
                                    </Typography>
                                  ))}
                                </div>
                              }
                              arrow
                              placement="top"
                            >
                              <Badge badgeContent={violations.length} color={hasHighSeverity ? 'error' : 'warning'}>
                                {hasHighSeverity ? (
                                  <ReportProblem color="error" />
                                ) : (
                                  <Warning color="warning" />
                                )}
                              </Badge>
                            </Tooltip>
                          ) : (
                            <Chip 
                              label="Valid" 
                              color="success" 
                              size="small" 
                              variant="outlined"
                            />
                          )}
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
                    );
                  })}
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

        {/* Business Rules Summary */}
        {claimsWithViolations.length > 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Business Rule Violations Summary
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                {businessRules.map((rule) => {
                  const violatingClaims = mockClaims.filter(claim => !rule.check(claim));
                  return (
                    <Box key={rule.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label={rule.id} 
                          size="small" 
                          color={rule.severity === 'High' ? 'error' : 'warning'}
                          sx={{ mr: 1 }}
                        />
                        <Chip 
                          label={rule.severity} 
                          size="small" 
                          color={rule.severity === 'High' ? 'error' : 'warning'}
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {rule.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {violatingClaims.length > 0 ? (
                          <span style={{ color: rule.severity === 'High' ? '#d32f2f' : '#ed6c02' }}>
                            {violatingClaims.length} claims violating this rule
                          </span>
                        ) : (
                          <span style={{ color: '#2e7d32' }}>All claims compliant</span>
                        )}
                      </Typography>
                      {violatingClaims.length > 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Claims: {violatingClaims.map(c => c.id).join(', ')}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default SimplifiedAgentDashboard;
