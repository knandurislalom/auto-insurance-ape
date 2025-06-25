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
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tabs,
  Tab,
  Alert,
  Badge,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Menu
} from '@mui/material';
import {
  Logout,
  Assignment,
  CheckCircle,
  Warning,
  Security,
  Search,
  PriorityHigh,
  Person,
  Visibility,
  Edit,
  NotificationImportant,
  Speed,
  Assessment,
  ArrowBack,
  Description,
  Phone,
  MoreVert,
  GetApp,
  Send,
  Block
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClaimFlowLogo from '../components/ClaimFlowLogo';

// Enhanced data structure for intelligent claim processing
interface Claim {
  id: string;
  claimantName: string;
  claimType: string;
  dateSubmitted: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  riskScore: number;
  fraudProbability: number;
  amount: number;
  status: 'New' | 'Under Review' | 'Pending Approval' | 'Approved' | 'Denied' | 'Escalated';
  flags: string[];
  timeInQueue: number; // hours
  slaDeadline: string;
  estimatedResolutionTime: number; // hours
  assignedTo?: string;
  complexityScore: number;
  customerTier: 'Premium' | 'Standard' | 'Basic';
  aiRecommendations: string[];
  documentStatus: 'Complete' | 'Incomplete' | 'Under Review';
  inconsistencies: string[];
  relatedClaims: string[];
  lastActivity: string;
  priorityFactors: {
    value: number;
    urgency: number;
    risk: number;
    complexity: number;
    sla: number;
  };
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
    status: 'New',
    flags: ['High Value', 'Multiple Parties', 'SLA Risk'],
    timeInQueue: 2,
    slaDeadline: '2025-06-26',
    estimatedResolutionTime: 8,
    assignedTo: 'John Smith',
    complexityScore: 8,
    customerTier: 'Premium',
    aiRecommendations: ['Request additional documentation', 'Schedule inspection', 'Verify police report'],
    documentStatus: 'Incomplete',
    inconsistencies: ['Damage description mismatch', 'Timeline discrepancy'],
    relatedClaims: [],
    lastActivity: '2025-06-24T10:30:00Z',
    priorityFactors: {
      value: 9,
      urgency: 8,
      risk: 8,
      complexity: 8,
      sla: 9
    }
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
    status: 'Under Review',
    flags: ['Fraud Alert', 'Document Issues', 'High Value'],
    timeInQueue: 18,
    slaDeadline: '2025-06-25',
    estimatedResolutionTime: 12,
    assignedTo: 'John Smith',
    complexityScore: 9,
    customerTier: 'Standard',
    aiRecommendations: ['Escalate to fraud team', 'Cross-reference with theft database', 'Verify ownership documents'],
    documentStatus: 'Under Review',
    inconsistencies: ['Suspicious timing', 'Incomplete theft report', 'Value discrepancy'],
    relatedClaims: ['CLM-078'],
    lastActivity: '2025-06-24T09:15:00Z',
    priorityFactors: {
      value: 10,
      urgency: 9,
      risk: 10,
      complexity: 9,
      sla: 8
    }
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
    status: 'Pending Approval',
    flags: ['Routine Processing'],
    timeInQueue: 32,
    slaDeadline: '2025-06-27',
    estimatedResolutionTime: 4,
    assignedTo: 'John Smith',
    complexityScore: 4,
    customerTier: 'Standard',
    aiRecommendations: ['Approve with standard coverage', 'Request repair estimate'],
    documentStatus: 'Complete',
    inconsistencies: [],
    relatedClaims: [],
    lastActivity: '2025-06-23T16:45:00Z',
    priorityFactors: {
      value: 4,
      urgency: 3,
      risk: 4,
      complexity: 4,
      sla: 5
    }
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
    status: 'Under Review',
    flags: ['Routine'],
    timeInQueue: 48,
    slaDeadline: '2025-06-28',
    estimatedResolutionTime: 3,
    assignedTo: 'John Smith',
    complexityScore: 3,
    customerTier: 'Basic',
    aiRecommendations: ['Standard processing', 'Verify repair costs'],
    documentStatus: 'Complete',
    inconsistencies: [],
    relatedClaims: [],
    lastActivity: '2025-06-23T14:20:00Z',
    priorityFactors: {
      value: 3,
      urgency: 2,
      risk: 2,
      complexity: 3,
      sla: 4
    }
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
    status: 'New',
    flags: ['Frequent Claimant', 'Pattern Alert'],
    timeInQueue: 72,
    slaDeadline: '2025-06-25',
    estimatedResolutionTime: 2,
    assignedTo: 'John Smith',
    complexityScore: 5,
    customerTier: 'Standard',
    aiRecommendations: ['Review claim history', 'Verify incident details'],
    documentStatus: 'Complete',
    inconsistencies: ['Similar claim pattern'],
    relatedClaims: ['CLM-034', 'CLM-067'],
    lastActivity: '2025-06-22T11:30:00Z',
    priorityFactors: {
      value: 2,
      urgency: 7,
      risk: 6,
      complexity: 5,
      sla: 8
    }
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AgentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedClaims, setSelectedClaims] = useState<Set<string>>(new Set());
  const [bulkActionMenu, setBulkActionMenu] = useState<null | HTMLElement>(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [savedFilters, setSavedFilters] = useState<string[]>(['High Priority + Fraud Risk', 'Due Today', 'My Critical Claims']);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClaimSelect = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowDetailView(true);
  };

  const handleDetailViewClose = () => {
    setShowDetailView(false);
    setSelectedClaim(null);
  };

  const handleBulkSelect = (claimId: string, selected: boolean) => {
    const newSelected = new Set(selectedClaims);
    if (selected) {
      newSelected.add(claimId);
    } else {
      newSelected.delete(claimId);
    }
    setSelectedClaims(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedClaims(new Set(filteredClaims.map(c => c.id)));
    } else {
      setSelectedClaims(new Set());
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} on claims:`, Array.from(selectedClaims));
    // Here you would implement the actual bulk action logic
    setBulkActionMenu(null);
    setSelectedClaims(new Set());
  };

  // Filter claims based on search, status, and priority
  const filteredClaims = mockClaims.filter(claim => {
    const matchesSearch = claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || claim.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || claim.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate enhanced dashboard metrics
  const metrics = {
    totalClaims: mockClaims.length,
    criticalClaims: mockClaims.filter(c => c.priority === 'Critical').length,
    highPriority: mockClaims.filter(c => c.priority === 'High' || c.priority === 'Critical').length,
    avgRiskScore: Math.round(mockClaims.reduce((sum, c) => sum + c.riskScore, 0) / mockClaims.length),
    avgFraudProbability: Math.round(mockClaims.reduce((sum, c) => sum + c.fraudProbability, 0) / mockClaims.length),
    pendingApproval: mockClaims.filter(c => c.status === 'Pending Approval').length,
    avgProcessingTime: Math.round(mockClaims.reduce((sum, c) => sum + c.timeInQueue, 0) / mockClaims.length),
    totalValue: mockClaims.reduce((sum, c) => sum + c.amount, 0),
    fraudAlerts: mockClaims.filter(c => c.flags.some(flag => flag.includes('Fraud'))).length,
    documentIssues: mockClaims.filter(c => c.documentStatus !== 'Complete').length,
    slaRisk: mockClaims.filter(c => {
      const deadline = new Date(c.slaDeadline);
      const now = new Date();
      const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntilDeadline <= 24;
    }).length,
    completedToday: 8,
    inconsistencyFlags: mockClaims.filter(c => c.inconsistencies.length > 0).length,
    relatedClaimsCount: mockClaims.filter(c => c.relatedClaims.length > 0).length
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
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <ClaimFlowLogo sx={{ mr: 2, color: 'white' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ClaimFlow - Agent Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={<NotificationImportant />} 
              label={`${metrics.highPriority} High Priority`}
              color="error"
              variant="outlined"
              size="small"
              sx={{ color: 'white', borderColor: 'white' }}
            />
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

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Dashboard Header with Enhanced Branding */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {user?.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {metrics.criticalClaims > 0 
              ? `🚨 ${metrics.criticalClaims} critical claims need immediate attention`
              : `📋 ${metrics.highPriority} priority claims in your queue`
            }
          </Typography>
          
          {/* Enhanced Alert System */}
          {metrics.criticalClaims > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>URGENT ACTION REQUIRED:</strong> Critical claims detected with high fraud probability
              </Typography>
            </Alert>
          )}
          {metrics.fraudAlerts > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>🔍 AI INSIGHT:</strong> {metrics.fraudAlerts} claims flagged for potential fraud - immediate review recommended
              </Typography>
            </Alert>
          )}
          {metrics.slaRisk > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>⏰ SLA ALERT:</strong> {metrics.slaRisk} claims approaching deadline within 24 hours
              </Typography>
            </Alert>
          )}
        </Box>

        {/* Enhanced Priority Queue Metrics */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
          gap: 3,
          mb: 4 
        }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" component="div" color="primary.main" gutterBottom>
                {metrics.totalClaims}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Total Claims
              </Typography>
              <Typography variant="caption" color="text.secondary">
                In queue today
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: metrics.criticalClaims > 0 ? 'error.light' : 'background.paper' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                component="div" 
                color={metrics.criticalClaims > 0 ? 'error.main' : 'success.main'} 
                gutterBottom
              >
                {metrics.criticalClaims}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                🔴 Critical
              </Typography>
              {metrics.criticalClaims > 0 && (
                <Chip label="Immediate Action" color="error" size="small" sx={{ mt: 1 }} />
              )}
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: metrics.highPriority > 0 ? 'warning.light' : 'background.paper' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" component="div" color="warning.main" gutterBottom>
                {metrics.highPriority - metrics.criticalClaims}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                🟡 High Priority
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Review today
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: metrics.fraudAlerts > 0 ? 'error.light' : 'background.paper' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                component="div" 
                color={metrics.fraudAlerts > 0 ? 'error.main' : 'success.main'} 
                gutterBottom
              >
                {metrics.fraudAlerts}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                🚨 Fraud Alerts
              </Typography>
              <Typography variant="caption" color="text.secondary">
                AI detected
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" component="div" color="success.main" gutterBottom>
                {metrics.completedToday}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                ✅ Completed
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Today's progress
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Enhanced Quick Actions with AI Recommendations */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
          mb: 4 
        }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Smart Actions - AI Recommended
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
                mb: 3
              }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PriorityHigh />}
                  fullWidth
                  color="error"
                  aria-label={`Review ${metrics.criticalClaims} critical priority claims`}
                >
                  Critical Claims ({metrics.criticalClaims})
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Security />}
                  fullWidth
                  color="error"
                  aria-label={`Review ${metrics.fraudAlerts} fraud alerts`}
                >
                  Fraud Alerts ({metrics.fraudAlerts})
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<CheckCircle />}
                  fullWidth
                  color="warning"
                  aria-label={`Review ${metrics.pendingApproval} pending approvals`}
                >
                  Pending ({metrics.pendingApproval})
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Assignment />}
                  fullWidth
                  color="info"
                  aria-label="Batch process routine claims"
                >
                  Batch Process (3)
                </Button>
              </Box>
              
              {/* AI Workflow Recommendations */}
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                🤖 AI Workflow Recommendations
              </Typography>
              <Stack spacing={1}>
                <Alert severity="info" sx={{ py: 1 }}>
                  <Typography variant="body2">
                    <strong>Priority Focus:</strong> Process CLM-002 first - 85% fraud probability detected
                  </Typography>
                </Alert>
                <Alert severity="success" sx={{ py: 1 }}>
                  <Typography variant="body2">
                    <strong>Efficiency Tip:</strong> Batch 3 similar collision claims for 25% time savings
                  </Typography>
                </Alert>
                <Alert severity="warning" sx={{ py: 1 }}>
                  <Typography variant="body2">
                    <strong>SLA Alert:</strong> CLM-001 deadline in 8 hours - escalate if not resolved
                  </Typography>
                </Alert>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Today's Performance
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Claims Target</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {metrics.completedToday}/15
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(metrics.completedToday / 15) * 100} 
                  sx={{ height: 8, borderRadius: 1, mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Efficiency Score</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">92%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={92} 
                  color="success"
                  sx={{ height: 8, borderRadius: 1, mb: 2 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Accuracy Rate</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">96%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={96} 
                  color="success"
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>

              <Alert severity="success">
                <Typography variant="body2">
                  <strong>Great performance!</strong> You're 15% ahead of team average and on track to exceed daily goals.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Box>

        {/* Claims Management Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="claims dashboard tabs">
              <Tab 
                label={
                  <Badge badgeContent={metrics.highPriority} color="error">
                    Priority Queue
                  </Badge>
                } 
                id="dashboard-tab-0"
                aria-controls="dashboard-tabpanel-0"
              />
              <Tab 
                label="All Claims" 
                id="dashboard-tab-1"
                aria-controls="dashboard-tabpanel-1"
              />
              <Tab 
                label="Analytics" 
                id="dashboard-tab-2"
                aria-controls="dashboard-tabpanel-2"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {/* Enhanced Priority Queue with AI Intelligence */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>🧠 AI-Powered Prioritization:</strong> Claims automatically ranked by fraud probability, 
                SLA deadlines, claim complexity, and business impact. Focus on red items first.
              </Typography>
            </Alert>

            {/* Enhanced Search and Filters */}
            <Box sx={{ mb: 3 }}>
              {/* Primary Search and Filter Row */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
                <TextField
                  placeholder="Search by claim ID, name, or type..."
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
                  sx={{ minWidth: 350 }}
                  aria-label="Search claims"
                />
                <FormControl size="medium" sx={{ minWidth: 150 }}>
                  <InputLabel>Status Filter</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status Filter"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Claims</MenuItem>
                    <MenuItem value="New">🆕 New</MenuItem>
                    <MenuItem value="Under Review">🔍 Under Review</MenuItem>
                    <MenuItem value="Pending Approval">⏳ Pending Approval</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="medium" sx={{ minWidth: 150 }}>
                  <InputLabel>Priority Filter</InputLabel>
                  <Select
                    value={filterPriority}
                    label="Priority Filter"
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <MenuItem value="all">All Priorities</MenuItem>
                    <MenuItem value="Critical">🔴 Critical</MenuItem>
                    <MenuItem value="High">🟡 High</MenuItem>
                    <MenuItem value="Medium">🟦 Medium</MenuItem>
                    <MenuItem value="Low">🟢 Low</MenuItem>
                  </Select>
                </FormControl>

                {/* Bulk Actions */}
                {selectedClaims.size > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="primary">
                      {selectedClaims.size} selected
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => setBulkActionMenu(e.currentTarget)}
                      endIcon={<MoreVert />}
                    >
                      Bulk Actions
                    </Button>
                    <Menu
                      anchorEl={bulkActionMenu}
                      open={Boolean(bulkActionMenu)}
                      onClose={() => setBulkActionMenu(null)}
                    >
                      <MenuItem onClick={() => handleBulkAction('approve')}>
                        <CheckCircle sx={{ mr: 1 }} /> Approve Selected
                      </MenuItem>
                      <MenuItem onClick={() => handleBulkAction('deny')}>
                        <Block sx={{ mr: 1 }} /> Deny Selected
                      </MenuItem>
                      <MenuItem onClick={() => handleBulkAction('escalate')}>
                        <Send sx={{ mr: 1 }} /> Escalate Selected
                      </MenuItem>
                      <MenuItem onClick={() => handleBulkAction('export')}>
                        <GetApp sx={{ mr: 1 }} /> Export Selected
                      </MenuItem>
                    </Menu>
                  </Box>
                )}
              </Box>

              {/* Quick Filter Chips */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip 
                  label="🔴 Critical Only" 
                  clickable 
                  color="error" 
                  variant="outlined"
                  onClick={() => setFilterPriority('Critical')}
                />
                <Chip 
                  label="🚨 Fraud Alerts" 
                  clickable 
                  color="warning" 
                  variant="outlined"
                  onClick={() => setSearchTerm('fraud')}
                />
                <Chip 
                  label="⏰ Due Today" 
                  clickable 
                  color="info" 
                  variant="outlined"
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    setSearchTerm(today);
                  }}
                />
                <Chip 
                  label="📄 Doc Issues" 
                  clickable 
                  color="secondary" 
                  variant="outlined"
                  onClick={() => setSearchTerm('incomplete')}
                />
              </Box>

              {/* Saved Filters */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Saved Filters:
                </Typography>
                {savedFilters.map((filter, index) => (
                  <Chip
                    key={index}
                    label={filter}
                    size="small"
                    variant="outlined"
                    clickable
                    onClick={() => {
                      // Apply saved filter logic here
                      console.log(`Applying filter: ${filter}`);
                      // Example: setSavedFilters usage
                      if (filter.includes('Critical')) {
                        setFilterPriority('Critical');
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Enhanced Claims Table with AI Features */}
            <TableContainer component={Paper} sx={{ maxHeight: 700, borderRadius: 2 }}>
              <Table stickyHeader aria-label="AI-powered claims priority queue">
                <TableHead>
                  <TableRow sx={{ '& th': { backgroundColor: 'primary.light', color: 'primary.contrastText' } }}>
                    <TableCell>
                      <Checkbox
                        checked={filteredClaims.length > 0 && selectedClaims.size === filteredClaims.length}
                        indeterminate={selectedClaims.size > 0 && selectedClaims.size < filteredClaims.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        sx={{ color: 'white' }}
                        aria-label="Select all claims"
                      />
                    </TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Priority</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Claim Details</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Claimant</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">AI Risk Assessment</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Amount</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Status & Timeline</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Actions</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClaims
                    .sort((a, b) => {
                      const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                        return priorityOrder[b.priority] - priorityOrder[a.priority];
                      }
                      return b.fraudProbability - a.fraudProbability;
                    })
                    .map((claim) => {
                      const slaDeadline = new Date(claim.slaDeadline);
                      const now = new Date();
                      const hoursUntilDeadline = Math.max(0, (slaDeadline.getTime() - now.getTime()) / (1000 * 60 * 60));
                      const isUrgent = hoursUntilDeadline <= 24;
                      
                      return (
                        <TableRow 
                          key={claim.id} 
                          hover 
                          sx={{ 
                            bgcolor: claim.priority === 'Critical' ? 'error.light' : 
                                    isUrgent ? 'warning.light' : 
                                    claim.fraudProbability >= 70 ? 'error.lighter' : 'inherit',
                            '&:hover': {
                              bgcolor: claim.priority === 'Critical' ? 'error.main' : 
                                      isUrgent ? 'warning.main' : 'action.hover',
                              color: claim.priority === 'Critical' || isUrgent ? 'white' : 'inherit'
                            },
                            borderLeft: claim.priority === 'Critical' ? '4px solid' : 
                                       claim.fraudProbability >= 70 ? '4px solid' : 'none',
                            borderLeftColor: claim.priority === 'Critical' ? 'error.main' : 'warning.main'
                          }}
                          aria-label={`${claim.priority} priority claim ${claim.id} for ${claim.claimantName}`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedClaims.has(claim.id)}
                              onChange={(e) => handleBulkSelect(claim.id, e.target.checked)}
                              aria-label={`Select claim ${claim.id}`}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100 }}>
                              <Chip
                                label={claim.priority}
                                color={getPriorityColor(claim.priority) as any}
                                size="medium"
                                icon={claim.priority === 'Critical' ? <Warning /> : undefined}
                                aria-label={`Priority level: ${claim.priority}`}
                                sx={{ mb: 1, minWidth: 80 }}
                              />
                              {claim.priority === 'Critical' && (
                                <Typography variant="caption" color="error.main" fontWeight="bold">
                                  🚨 URGENT
                                </Typography>
                              )}
                              {isUrgent && (
                                <Typography variant="caption" color="warning.main" fontWeight="bold">
                                  ⏰ {Math.round(hoursUntilDeadline)}h left
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box>
                              <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>
                                {claim.id}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {claim.claimType}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Age: {claim.timeInQueue}h | Complexity: {claim.complexityScore}/10
                              </Typography>
                              {claim.flags.some(flag => flag.includes('Fraud')) && (
                                <Box sx={{ mt: 1 }}>
                                  <Chip 
                                    label="🚨 FRAUD ALERT" 
                                    color="error" 
                                    size="small"
                                    sx={{ fontSize: '0.7rem' }}
                                    aria-label="This claim has fraud indicators"
                                  />
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar 
                                sx={{ 
                                  width: 40, 
                                  height: 40, 
                                  bgcolor: claim.customerTier === 'Premium' ? 'primary.main' : 
                                          claim.customerTier === 'Standard' ? 'info.main' : 'secondary.main'
                                }}
                              >
                                <Person />
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight="medium">
                                  {claim.claimantName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {claim.customerTier} Customer
                                </Typography>
                                {claim.relatedClaims.length > 0 && (
                                  <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
                                    ⚠️ {claim.relatedClaims.length} related claims
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Box sx={{ minWidth: 140 }}>
                              {/* Overall Risk Score */}
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Overall Risk
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={claim.riskScore}
                                    color={getRiskColor(claim.riskScore) as any}
                                    sx={{ flexGrow: 1, height: 6, borderRadius: 1 }}
                                    aria-label={`Risk score: ${claim.riskScore} out of 100`}
                                  />
                                  <Typography variant="caption" fontWeight="bold">
                                    {claim.riskScore}%
                                  </Typography>
                                </Box>
                              </Box>
                              
                              {/* Fraud Probability */}
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Fraud Probability
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={claim.fraudProbability}
                                    color={claim.fraudProbability >= 70 ? 'error' : 
                                           claim.fraudProbability >= 40 ? 'warning' : 'success'}
                                    sx={{ flexGrow: 1, height: 6, borderRadius: 1 }}
                                  />
                                  <Typography 
                                    variant="caption" 
                                    fontWeight="bold"
                                    color={claim.fraudProbability >= 70 ? 'error.main' : 'text.primary'}
                                  >
                                    {claim.fraudProbability}%
                                  </Typography>
                                </Box>
                              </Box>

                              {/* AI Recommendations */}
                              {claim.aiRecommendations.length > 0 && (
                                <Typography variant="caption" color="primary.main" sx={{ fontStyle: 'italic' }}>
                                  🤖 {claim.aiRecommendations[0]}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>
                              {formatCurrency(claim.amount)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Est. Resolution: {claim.estimatedResolutionTime}h
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Box>
                              <Chip
                                label={claim.status}
                                variant="outlined"
                                size="medium"
                                color={claim.status === 'New' ? 'info' : 
                                       claim.status === 'Under Review' ? 'warning' : 'default'}
                                sx={{ mb: 1 }}
                              />
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                📄 Docs: {claim.documentStatus}
                              </Typography>
                              {claim.inconsistencies.length > 0 && (
                                <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
                                  ⚠️ {claim.inconsistencies.length} inconsistencies
                                </Typography>
                              )}
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Review claim details and AI analysis">
                                <IconButton 
                                  size="medium" 
                                  color="primary"
                                  aria-label={`Review claim ${claim.id}`}
                                  onClick={() => handleClaimSelect(claim)}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit claim information">
                                <IconButton 
                                  size="medium"
                                  aria-label={`Edit claim ${claim.id}`}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Claims Summary Footer */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredClaims.length} claims | 
                🔴 {filteredClaims.filter(c => c.priority === 'Critical').length} Critical | 
                🚨 {filteredClaims.filter(c => c.fraudProbability >= 70).length} High Fraud Risk | 
                ⏰ {filteredClaims.filter(c => {
                  const hours = (new Date(c.slaDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60);
                  return hours <= 24;
                }).length} Due Soon
              </Typography>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              All Claims Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete list of all claims with advanced filtering and search capabilities.
            </Typography>
            {/* Same table as above but with all claims */}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Performance Summary
            </Typography>
            
            {/* Simplified Performance Cards */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
              mb: 3
            }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Speed color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h4" color="success.main" gutterBottom>
                    2.1h
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Average Processing Time
                  </Typography>
                  <Chip label="25% faster than team" color="success" />
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Assessment color="success" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h4" color="success.main" gutterBottom>
                    96.8%
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Decision Accuracy
                  </Typography>
                  <Chip label="Above target (95%)" color="success" />
                </CardContent>
              </Card>
            </Box>

            {/* Simple Progress Summary */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Progress
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Claims Processed</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {metrics.completedToday} / 12 target
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(metrics.completedToday / 12) * 100} 
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Quality Score</Typography>
                    <Typography variant="body1" fontWeight="bold">96%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={96} 
                    color="success"
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>

                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    <strong>Great work!</strong> You're on track to exceed your daily goals.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </TabPanel>
        </Card>

        {/* Claim Detail Dialog */}
        <Dialog 
          open={showDetailView} 
          onClose={handleDetailViewClose}
          maxWidth="lg"
          fullWidth
          aria-labelledby="claim-detail-dialog-title"
        >
          <DialogTitle id="claim-detail-dialog-title" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={handleDetailViewClose} aria-label="Go back to claims list">
                  <ArrowBack />
                </IconButton>
                <Typography variant="h5">
                  Claim {selectedClaim?.id} - {selectedClaim?.claimantName}
                </Typography>
              </Box>
              <Button variant="outlined" size="small">
                🔄 Refresh
              </Button>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {selectedClaim && (
              <Box sx={{ p: 3 }}>
                {/* Header with claim overview and priority */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3, mb: 3 }}>
                  {/* Claim Overview */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        📋 Claim Overview
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Claim ID</Typography>
                          <Typography variant="body1" fontWeight="medium">{selectedClaim.id}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Date Submitted</Typography>
                          <Typography variant="body1">{new Date(selectedClaim.dateSubmitted).toLocaleDateString()}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Claim Type</Typography>
                          <Typography variant="body1">{selectedClaim.claimType}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Estimated Damage</Typography>
                          <Typography variant="body1" fontWeight="bold">{formatCurrency(selectedClaim.amount)}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Status</Typography>
                          <Chip label={selectedClaim.status} size="small" color="primary" />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Assigned To</Typography>
                          <Typography variant="body1">{selectedClaim.assignedTo || 'Unassigned'}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Priority</Typography>
                          <Chip 
                            label={selectedClaim.priority} 
                            color={getPriorityColor(selectedClaim.priority) as any} 
                            size="small"
                          />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Customer Tier</Typography>
                          <Typography variant="body1">{selectedClaim.customerTier}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Risk Assessment Panel */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        📊 Risk Assessment
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Overall Risk Score
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" 
                            color={selectedClaim.riskScore >= 80 ? 'error.main' : selectedClaim.riskScore >= 60 ? 'warning.main' : 'success.main'}>
                            {selectedClaim.riskScore >= 80 ? '⚠️ HIGH' : selectedClaim.riskScore >= 60 ? '🟡 MED' : '✅ LOW'}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedClaim.riskScore} 
                          color={getRiskColor(selectedClaim.riskScore) as any}
                          sx={{ height: 8, borderRadius: 1, mb: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {selectedClaim.riskScore}%
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Fraud Indicators
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" 
                            color={selectedClaim.fraudProbability >= 70 ? 'error.main' : selectedClaim.fraudProbability >= 40 ? 'warning.main' : 'success.main'}>
                            {selectedClaim.fraudProbability >= 70 ? '⚠️ HIGH' : selectedClaim.fraudProbability >= 40 ? '🟡 MED' : '✅ LOW'}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedClaim.fraudProbability} 
                          color={selectedClaim.fraudProbability >= 70 ? 'error' : selectedClaim.fraudProbability >= 40 ? 'warning' : 'success'}
                          sx={{ height: 8, borderRadius: 1, mb: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {selectedClaim.fraudProbability}%
                        </Typography>
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Time Sensitivity
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color="error.main">
                            🔴 HIGH
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={80} 
                          color="error"
                          sx={{ height: 8, borderRadius: 1, mb: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          SLA: {Math.round((new Date(selectedClaim.slaDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60))}h remaining
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* Red Flags and Alerts */}
                {(selectedClaim.flags.length > 0 || selectedClaim.inconsistencies.length > 0) && (
                  <Card sx={{ mb: 3, bgcolor: 'error.lighter' }}>
                    <CardContent>
                      <Typography variant="h6" color="error.main" gutterBottom>
                        🚨 FRAUD ALERT: Multiple red flags
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {selectedClaim.flags.map((flag, index) => (
                          <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                            <Typography variant="body2">⚠️ {flag}</Typography>
                          </Alert>
                        ))}
                        {selectedClaim.inconsistencies.map((inconsistency, index) => (
                          <Alert key={index} severity="error" sx={{ mb: 1 }}>
                            <Typography variant="body2">⚠️ {inconsistency}</Typography>
                          </Alert>
                        ))}
                      </Box>
                      <Button variant="outlined" size="small" startIcon={<Assessment />}>
                        📊 View Full Analysis
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Recommended Actions and Documents */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                  {/* Recommended Actions */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        🎯 Recommended Actions
                      </Typography>
                      <List dense>
                        {selectedClaim.aiRecommendations.map((recommendation, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon>
                              <Chip label={index + 1} size="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={recommendation}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                        ▶️ Execute Action Plan
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Documents Status */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        📄 Documents
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <List dense>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                              <Description fontSize="small" color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="📄 accident_report.pdf" 
                              secondary="✅ Valid"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                              <Description fontSize="small" color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="🚓 police_report.pdf" 
                              secondary="✅ Valid"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon>
                              <Description fontSize="small" color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="🏥 medical_report.pdf" 
                              secondary="✅ Valid"
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        </List>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>AI Analysis:</strong> Documents authentic
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        No alterations detected
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Cross-reference:</strong> ✅ Consistent
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                {/* Case Notes */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📝 Case Notes
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Add note..."
                      multiline
                      rows={2}
                      variant="outlined"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        📅 {new Date(selectedClaim.lastActivity).toLocaleString()} - Initial review
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        📅 {new Date(selectedClaim.dateSubmitted).toLocaleString()} - Fraud flags noted
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📅 {new Date(selectedClaim.dateSubmitted).toLocaleString()} - Escalated to SIU
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleDetailViewClose} color="secondary">
              Close
            </Button>
            <Button variant="outlined" color="primary" startIcon={<Phone />}>
              📞 Contact Claimant
            </Button>
            <Button variant="outlined" color="warning" startIcon={<Send />}>
              📤 Escalate
            </Button>
            <Button variant="outlined" color="error" startIcon={<Block />}>
              ❌ Deny Claim
            </Button>
            <Button variant="contained" color="success" startIcon={<CheckCircle />}>
              ✅ Approve
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AgentDashboard;
