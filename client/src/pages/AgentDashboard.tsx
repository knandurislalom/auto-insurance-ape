import React, { useState, useEffect } from 'react';
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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Logout,
  Assignment,
  PendingActions,
  CheckCircle,
  Warning,
  Security,
  TrendingUp,
  Search,
  FilterList,
  PriorityHigh,
  Schedule,
  Person,
  AttachMoney,
  Flag,
  Visibility,
  Edit,
  MoreVert,
  NotificationImportant,
  Speed,
  Assessment,
  Timeline,
  AutoGraph,
  ReportProblem,
  Article,
  People,
  Analytics,
  Gavel,
  AccessTime,
  TrendingDown,
  Psychology,
  Policy
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter claims based on search and status
  const filteredClaims = mockClaims.filter(claim => {
    const matchesSearch = claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || claim.status === filterStatus;
    return matchesSearch && matchesStatus;
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
        {/* Intelligent Welcome Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Good morning, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            You have {metrics.criticalClaims > 0 ? `${metrics.criticalClaims} critical claims requiring immediate attention` : 
                     `${metrics.highPriority} high-priority claims in your queue`}.
            {metrics.slaRisk > 0 && ` ${metrics.slaRisk} claims are at SLA risk.`}
          </Typography>
          {metrics.criticalClaims > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>⚠️ Critical Alert:</strong> CLM-002 (Auto Theft) has 85% fraud probability and needs immediate escalation.
              </Typography>
            </Alert>
          )}
          {metrics.fraudAlerts > 0 && (
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>🔍 AI Insight:</strong> {metrics.fraudAlerts} claims flagged for potential fraud require expert review today.
              </Typography>
            </Alert>
          )}
        </Box>

        {/* Enhanced Key Metrics Overview */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' },
          gap: 3,
          mb: 4 
        }}>
          <Card sx={{ height: '100%', bgcolor: metrics.criticalClaims > 0 ? 'error.light' : 'background.paper' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" color={metrics.criticalClaims > 0 ? 'error.main' : 'primary.main'}>
                    {metrics.criticalClaims}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Critical Claims
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: metrics.criticalClaims > 0 ? 'error.main' : 'error.light', color: 'white' }}>
                  <ReportProblem />
                </Avatar>
              </Box>
              {metrics.criticalClaims > 0 && (
                <Chip label="Immediate Action Required" color="error" size="small" sx={{ mt: 1 }} />
              )}
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" color="primary.main">
                    {metrics.totalClaims}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Claims
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <Assignment />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip label={`${metrics.highPriority} High Priority`} color="warning" size="small" />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" color="warning.main">
                    {metrics.avgFraudProbability}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Fraud Risk
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <Psychology />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip label={`${metrics.fraudAlerts} Active Alerts`} color="error" size="small" />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" color="info.main">
                    {metrics.slaRisk}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    SLA Risk
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <AccessTime />
                </Avatar>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Due within 24h
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" color="error.main">
                    {metrics.documentIssues}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Doc Issues
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}>
                  <Article />
                </Avatar>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Incomplete/Under Review
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" color="success.main">
                    {metrics.completedToday}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Today
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip label="+20% vs yesterday" color="success" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Enhanced Performance Insights & AI Recommendations */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
          mb: 4 
        }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoGraph color="primary" />
                AI-Powered Performance Insights
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 3 
              }}>
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Average Processing Time
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">{metrics.avgProcessingTime}h</Typography>
                      <Chip label="-15% vs last week" color="success" size="small" />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.max(0, 100 - (metrics.avgProcessingTime / 100 * 100))}
                      color="success"
                      sx={{ mt: 1, height: 4, borderRadius: 1 }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Fraud Detection Accuracy
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">94.2%</Typography>
                      <Chip label="+3.1% vs last month" color="success" size="small" />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={94.2}
                      color="success"
                      sx={{ mt: 1, height: 4, borderRadius: 1 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Decision Consistency Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">88.7%</Typography>
                      <Chip label="Above target" color="info" size="small" />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={88.7}
                      color="info"
                      sx={{ mt: 1, height: 4, borderRadius: 1 }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Portfolio Value
                    </Typography>
                    <Typography variant="h6">{formatCurrency(metrics.totalValue)}</Typography>
                    <Typography variant="caption" color="success.main">
                      Risk-adjusted: {formatCurrency(metrics.totalValue * 0.85)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      High-Risk Claims
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" color="error.main">{metrics.fraudAlerts}</Typography>
                      <Chip label="Active monitoring" color="error" size="small" />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Data Inconsistencies
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" color="warning.main">{metrics.inconsistencyFlags}</Typography>
                      <Chip label="Requires review" color="warning" size="small" />
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              {/* AI Recommendations Section */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Psychology color="primary" />
                AI Recommendations for Today
              </Typography>
              <Stack spacing={1}>
                <Alert severity="warning" sx={{ py: 0.5 }}>
                  <Typography variant="body2">
                    <strong>Priority Focus:</strong> Review CLM-002 (Auto Theft) - High fraud probability (85%)
                  </Typography>
                </Alert>
                <Alert severity="info" sx={{ py: 0.5 }}>
                  <Typography variant="body2">
                    <strong>Workflow Optimization:</strong> Batch process 3 routine vandalism claims for efficiency
                  </Typography>
                </Alert>
                <Alert severity="success" sx={{ py: 0.5 }}>
                  <Typography variant="body2">
                    <strong>Pattern Detected:</strong> CLM-005 shows similar pattern to previous claims - investigate relationship
                  </Typography>
                </Alert>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Gavel color="primary" />
                Smart Actions
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<ReportProblem />}
                  fullWidth
                  color="error"
                  size="large"
                >
                  Critical Claims ({metrics.criticalClaims})
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Psychology />}
                  fullWidth
                  color="warning"
                >
                  Fraud Alerts ({metrics.fraudAlerts})
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AccessTime />}
                  fullWidth
                  color="info"
                >
                  SLA Risk ({metrics.slaRisk})
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Article />}
                  fullWidth
                >
                  Doc Issues ({metrics.documentIssues})
                </Button>
                <Divider />
                <Button
                  variant="text"
                  startIcon={<Analytics />}
                  fullWidth
                  size="small"
                >
                  View Full Analytics
                </Button>
                <Button
                  variant="text"
                  startIcon={<People />}
                  fullWidth
                  size="small"
                >
                  Team Collaboration
                </Button>
              </Stack>

              {/* Performance Badge */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="success.dark" gutterBottom>
                  Today's Performance
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Efficiency Score</Typography>
                  <Chip label="92%" color="success" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2">Quality Score</Typography>
                  <Chip label="96%" color="success" />
                </Box>
              </Box>
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
            {/* Enhanced Priority Queue with Red Flags */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>AI-Powered Prioritization:</strong> Claims are automatically ranked by risk score, fraud probability, SLA deadlines, and business impact. 
                Red flags indicate potential fraud, data inconsistencies, or processing complications.
              </Typography>
            </Alert>

            {/* Search and Filter */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Under Review">Under Review</MenuItem>
                  <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Enhanced Claims Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Claim ID</TableCell>
                    <TableCell>Claimant</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Risk</TableCell>
                    <TableCell>Fraud Risk</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>SLA</TableCell>
                    <TableCell>Red Flags</TableCell>
                    <TableCell>AI Recommendations</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClaims
                    .sort((a, b) => {
                      // Enhanced priority sorting with Critical level
                      const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                        return priorityOrder[b.priority] - priorityOrder[a.priority];
                      }
                      // Secondary sort by fraud probability for same priority
                      if (a.fraudProbability !== b.fraudProbability) {
                        return b.fraudProbability - a.fraudProbability;
                      }
                      return b.riskScore - a.riskScore;
                    })
                    .map((claim) => {
                      const slaDeadline = new Date(claim.slaDeadline);
                      const now = new Date();
                      const hoursUntilDeadline = Math.max(0, (slaDeadline.getTime() - now.getTime()) / (1000 * 60 * 60));
                      const slaRisk = hoursUntilDeadline <= 24;
                      
                      return (
                        <TableRow key={claim.id} hover sx={{ 
                          bgcolor: claim.priority === 'Critical' ? 'error.light' : 
                                  slaRisk ? 'warning.light' : 'inherit'
                        }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="body2" fontWeight="medium">
                                {claim.id}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {claim.customerTier}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                <Person />
                              </Avatar>
                              <Box>
                                <Typography variant="body2">{claim.claimantName}</Typography>
                                {claim.relatedClaims.length > 0 && (
                                  <Typography variant="caption" color="warning.main">
                                    {claim.relatedClaims.length} related claims
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">{claim.claimType}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Complexity: {claim.complexityScore}/10
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={claim.priority}
                              color={getPriorityColor(claim.priority) as any}
                              size="small"
                              icon={claim.priority === 'Critical' ? <ReportProblem /> : undefined}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                              <LinearProgress
                                variant="determinate"
                                value={claim.riskScore}
                                color={getRiskColor(claim.riskScore) as any}
                                sx={{ flexGrow: 1, height: 6, borderRadius: 1 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {claim.riskScore}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
                              <LinearProgress
                                variant="determinate"
                                value={claim.fraudProbability}
                                color={claim.fraudProbability >= 80 ? 'error' : 
                                       claim.fraudProbability >= 60 ? 'warning' : 'success'}
                                sx={{ flexGrow: 1, height: 6, borderRadius: 1 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {claim.fraudProbability}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(claim.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Chip
                                label={claim.status}
                                variant="outlined"
                                size="small"
                                color={claim.status === 'Escalated' ? 'error' : 'default'}
                              />
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                {claim.documentStatus}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTime 
                                fontSize="small" 
                                color={slaRisk ? 'error' : 'action'} 
                              />
                              <Typography 
                                variant="caption" 
                                color={slaRisk ? 'error.main' : 'text.secondary'}
                              >
                                {Math.round(hoursUntilDeadline)}h
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                              {claim.flags.map((flag, index) => (
                                <Tooltip key={index} title={flag}>
                                  <Chip
                                    label={flag}
                                    size="small"
                                    color={flag.includes('Fraud') ? 'error' : 
                                           flag.includes('High') || flag.includes('SLA') ? 'warning' : 'default'}
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                  />
                                </Tooltip>
                              ))}
                              {claim.inconsistencies.length > 0 && (
                                <Tooltip title={`Inconsistencies: ${claim.inconsistencies.join(', ')}`}>
                                  <Chip
                                    label={`${claim.inconsistencies.length} Issues`}
                                    size="small"
                                    color="warning"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                  />
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ minWidth: 200 }}>
                            <Stack spacing={0.5}>
                              {claim.aiRecommendations.slice(0, 2).map((rec, index) => (
                                <Typography key={index} variant="caption" color="primary.main">
                                  • {rec}
                                </Typography>
                              ))}
                              {claim.aiRecommendations.length > 2 && (
                                <Typography variant="caption" color="text.secondary">
                                  +{claim.aiRecommendations.length - 2} more...
                                </Typography>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5}>
                              <Tooltip title="Review Claim">
                                <IconButton size="small" color="primary">
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton size="small">
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="More Actions">
                                <IconButton size="small">
                                  <MoreVert />
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
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Analytics color="primary" />
              Advanced Analytics & Predictive Insights
            </Typography>
            
            {/* Performance Metrics Grid */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              mb: 4
            }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Speed color="primary" />
                    Processing Efficiency
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="h4" color="success.main">2.1h</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Avg processing time
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={88} 
                    color="success"
                    sx={{ height: 8, borderRadius: 1, mb: 1 }}
                  />
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">vs Team Avg</Typography>
                      <Typography variant="caption" color="success.main">+35% faster</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">vs Industry</Typography>
                      <Typography variant="caption" color="success.main">+42% faster</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Monthly Trend</Typography>
                      <Chip label="-12%" color="success" size="small" />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assessment color="success" />
                    Decision Accuracy
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="h4" color="success.main">96.8%</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Overall accuracy
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={96.8} 
                    color="success"
                    sx={{ height: 8, borderRadius: 1, mb: 1 }}
                  />
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Fraud Detection</Typography>
                      <Typography variant="caption" color="success.main">94.2%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Risk Assessment</Typography>
                      <Typography variant="caption" color="success.main">98.1%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Target (95%)</Typography>
                      <Chip label="+1.8%" color="success" size="small" />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp color="info" />
                    Predictive Analytics
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="h4" color="info.main">+23%</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Forecasted efficiency gain
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    color="info"
                    sx={{ height: 8, borderRadius: 1, mb: 1 }}
                  />
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Next Week Volume</Typography>
                      <Typography variant="caption" color="warning.main">+15%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Fraud Risk Trend</Typography>
                      <Typography variant="caption" color="error.main">+8%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">AI Confidence</Typography>
                      <Chip label="92%" color="info" size="small" />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {/* Detailed Analytics */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 3 
            }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Claim Processing Insights
                  </Typography>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                    mb: 3
                  }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Claims by Priority Distribution
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip label={`Critical: ${metrics.criticalClaims}`} color="error" size="small" />
                        <Chip label={`High: ${metrics.highPriority - metrics.criticalClaims}`} color="warning" size="small" />
                      </Stack>
                      <LinearProgress variant="determinate" value={40} color="error" sx={{ mb: 0.5, height: 4 }} />
                      <LinearProgress variant="determinate" value={30} color="warning" sx={{ mb: 0.5, height: 4 }} />
                      <LinearProgress variant="determinate" value={20} color="info" sx={{ mb: 0.5, height: 4 }} />
                      <LinearProgress variant="determinate" value={10} color="success" sx={{ height: 4 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Risk Distribution
                      </Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">High Risk (80+)</Typography>
                          <Typography variant="caption" color="error.main">
                            {mockClaims.filter(c => c.riskScore >= 80).length} claims
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">Medium Risk (40-79)</Typography>
                          <Typography variant="caption" color="warning.main">
                            {mockClaims.filter(c => c.riskScore >= 40 && c.riskScore < 80).length} claims
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">Low Risk (&lt;40)</Typography>
                          <Typography variant="caption" color="success.main">
                            {mockClaims.filter(c => c.riskScore < 40).length} claims
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    AI Model Performance Metrics
                  </Typography>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 2
                  }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Fraud Detection Precision
                      </Typography>
                      <Typography variant="h6" color="success.main">94.2%</Typography>
                      <LinearProgress variant="determinate" value={94.2} color="success" sx={{ height: 3 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Priority Accuracy
                      </Typography>
                      <Typography variant="h6" color="info.main">91.7%</Typography>
                      <LinearProgress variant="determinate" value={91.7} color="info" sx={{ height: 3 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Time Prediction
                      </Typography>
                      <Typography variant="h6" color="warning.main">88.3%</Typography>
                      <LinearProgress variant="determinate" value={88.3} color="warning" sx={{ height: 3 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Workload Optimization
                  </Typography>
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>AI Recommendation:</strong> Consider batching 3 similar auto collision claims for 20% efficiency gain.
                    </Typography>
                  </Alert>
                  
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" gutterBottom>Current Workload</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption">Capacity Utilization</Typography>
                        <Typography variant="body2" fontWeight="medium">78%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={78} sx={{ height: 6, borderRadius: 1 }} />
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" gutterBottom>Projected This Week</Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">New Claims</Typography>
                          <Typography variant="caption">+12</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">Expected Closures</Typography>
                          <Typography variant="caption">-18</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">Net Change</Typography>
                          <Typography variant="caption" color="success.main">-6</Typography>
                        </Box>
                      </Stack>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Typography variant="body2" gutterBottom>Performance Recommendations</Typography>
                      <Stack spacing={1}>
                        <Typography variant="caption" color="primary.main">
                          • Focus on CLM-002 (high fraud risk)
                        </Typography>
                        <Typography variant="caption" color="primary.main">
                          • Batch process routine claims
                        </Typography>
                        <Typography variant="caption" color="primary.main">
                          • Review SLA-risk items first
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </Card>
      </Container>
    </Box>
  );
};

export default AgentDashboard;
