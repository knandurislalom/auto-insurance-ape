import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { 
  Person, 
  Business, 
  Login as LoginIcon,
  Security
} from '@mui/icons-material';
import ClaimFlowLogo from '../components/ClaimFlowLogo';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types/auth';

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
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [customerCredentials, setCustomerCredentials] = useState({
    email: '',
    password: ''
  });
  
  const [agentCredentials, setAgentCredentials] = useState({
    email: '',
    password: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleSubmit = async (userType: 'customer' | 'agent') => {
    setLoading(true);
    setError('');

    const credentials: LoginCredentials = {
      email: userType === 'customer' ? customerCredentials.email : agentCredentials.email,
      password: userType === 'customer' ? customerCredentials.password : agentCredentials.password,
      userType
    };

    try {
      const success = await login(credentials);
      
      if (success) {
        // Route based on user type
        if (userType === 'customer') {
          navigate('/dashboard');
        } else {
          navigate('/agent-dashboard');
        }
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoType: 'customer' | 'agent') => {
    if (demoType === 'customer') {
      setCustomerCredentials({
        email: 'sarah@example.com',
        password: 'demo123'
      });
      setTabValue(0);
    } else {
      setAgentCredentials({
        email: 'agent@insurance.com',
        password: 'demo123'
      });
      setTabValue(1);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <ClaimFlowLogo 
            sx={{ 
              width: 80, 
              height: 80, 
              color: 'primary.main', 
              mx: 'auto', 
              mb: 2,
              display: 'block'
            }}
          />
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            ClaimFlow
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Streamlined insurance claims processing
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="login type tabs"
              variant="fullWidth"
            >
              <Tab 
                icon={<Person />} 
                label="Customer Login" 
                id="login-tab-0"
                aria-controls="login-tabpanel-0"
              />
              <Tab 
                icon={<Business />} 
                label="Agent Login" 
                id="login-tab-1"
                aria-controls="login-tabpanel-1"
              />
            </Tabs>
          </Box>

          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ maxWidth: 400, mx: 'auto' }}>
              <Typography variant="h5" gutterBottom>
                Customer Portal
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                File claims, view existing claims, and manage your policies
              </Typography>
              
              <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit('customer'); }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={customerCredentials.email}
                  onChange={(e) => setCustomerCredentials(prev => ({ ...prev, email: e.target.value }))}
                  margin="normal"
                  required
                  disabled={loading}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={customerCredentials.password}
                  onChange={(e) => setCustomerCredentials(prev => ({ ...prev, password: e.target.value }))}
                  margin="normal"
                  required
                  disabled={loading}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                  disabled={loading || !customerCredentials.email || !customerCredentials.password}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? 'Signing In...' : 'Sign In as Customer'}
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleDemoLogin('customer')}
                disabled={loading}
              >
                Try Demo Account
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ maxWidth: 400, mx: 'auto' }}>
              <Typography variant="h5" gutterBottom>
                Agent Portal
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Process claims, manage customer cases, and review documentation
              </Typography>

              <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit('agent'); }}>
                <TextField
                  fullWidth
                  label="Agent Email"
                  type="email"
                  value={agentCredentials.email}
                  onChange={(e) => setAgentCredentials(prev => ({ ...prev, email: e.target.value }))}
                  margin="normal"
                  required
                  disabled={loading}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={agentCredentials.password}
                  onChange={(e) => setAgentCredentials(prev => ({ ...prev, password: e.target.value }))}
                  margin="normal"
                  required
                  disabled={loading}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                  disabled={loading || !agentCredentials.email || !agentCredentials.password}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? 'Signing In...' : 'Sign In as Agent'}
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleDemoLogin('agent')}
                disabled={loading}
              >
                Try Demo Account
              </Button>
            </Box>
          </TabPanel>
        </Paper>

        {/* Demo Credentials Information */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom textAlign="center">
            Demo Accounts
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2
          }}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Customer Demo</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Email: sarah@example.com<br />
                  Password: demo123
                </Typography>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Business color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Agent Demo</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Email: agent@insurance.com<br />
                  Password: demo123
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <Security color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Your data is protected with enterprise-grade security
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
