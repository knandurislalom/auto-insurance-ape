import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Alert,
  Stack,
  Avatar,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Assignment,
  LocationOn,
  CalendarToday,
  AttachMoney,
  Description,
  CloudDownload,
  Visibility,
  LocalHospital,
  DirectionsCar,
  Home
} from '@mui/icons-material';
import { ExistingClaim } from '../types/claim';
import { ClaimsAPIService } from '../services/claimsAPI';
import ClaimFlowLogo from '../components/ClaimFlowLogo';

const ExistingClaims: React.FC = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<ExistingClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch claims for Sarah Johnson specifically
        const response = await ClaimsAPIService.getClaims({
          claimant_name: 'Sarah Johnson'
        });
        
        // Transform the API response to match the ExistingClaim interface
        const claimsData = response.claims || []; // API returns { claims: [...], ... }
        const transformedClaims: ExistingClaim[] = claimsData.map((claim: any) => ({
          claim_id: `CLM${claim.id.toString().padStart(3, '0')}`,
          claim_type: 'auto', // Default to auto since this is an auto insurance system
          claimant_name: claim.claimant_name,
          date_of_incident: claim.incident_date || new Date().toISOString().split('T')[0],
          location: claim.incident_location || 'Location not specified',
          description: claim.damage_description || 'No description provided',
          documents_uploaded: claim.documents?.map((doc: any) => doc.filename) || [],
          estimated_damage: claim.estimated_damage,
          injuries_reported: claim.injuries_reported || false
        }));
        
        setClaims(transformedClaims);
      } catch (err) {
        console.error('Error fetching claims:', err);
        setError('Failed to load claims. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const getClaimTypeIcon = (type: string) => {
    switch (type) {
      case 'auto':
        return <DirectionsCar />;
      case 'home':
        return <Home />;
      case 'medical':
        return <LocalHospital />;
      default:
        return <Assignment />;
    }
  };

  const getClaimTypeColor = (type: string) => {
    switch (type) {
      case 'auto':
        return 'primary';
      case 'home':
        return 'secondary';
      case 'medical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusChip = (claimId: string) => {
    // Mock status based on claim ID for demo
    const statuses = ['submitted', 'under_review', 'assessment', 'approved'];
    const statusIndex = claimId.slice(-1).charCodeAt(0) % statuses.length;
    const status = statuses[statusIndex];
    
    const colorMap = {
      submitted: 'info',
      under_review: 'warning',
      assessment: 'primary',
      approved: 'success'
    } as const;

    return (
      <Chip
        label={status.replace('_', ' ').toUpperCase()}
        color={colorMap[status as keyof typeof colorMap]}
        size="small"
        variant="filled"
      />
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={24} />
          <Typography>Loading claims...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          <Typography variant="body1">{error}</Typography>
          <Button variant="outlined" onClick={() => window.location.reload()} sx={{ mt: 1 }}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <ClaimFlowLogo sx={{ mr: 2, color: 'white' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ClaimFlow - Your Claims
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sarah's Claims
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your insurance claims. Click on any claim for more details.
          </Typography>
        </Box>

        {claims.length === 0 ? (
          <Alert severity="info">
            <Typography variant="body1">
              No claims found for Sarah Johnson. <Button onClick={() => navigate('/dashboard')}>File your first claim</Button>
            </Typography>
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {claims.map((claim) => (
              <Card
                key={claim.claim_id}
                sx={{
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => {
                  // In a real app, this would navigate to claim details
                  console.log('View claim details:', claim.claim_id);
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                      <Avatar
                        sx={{ 
                          bgcolor: `${getClaimTypeColor(claim.claim_type)}.main`,
                          width: 48,
                          height: 48
                        }}
                      >
                        {getClaimTypeIcon(claim.claim_type)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="h3">
                          Claim #{claim.claim_id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {claim.claimant_name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      {getStatusChip(claim.claim_id)}
                      <Chip
                        label={claim.claim_type.toUpperCase()}
                        color={getClaimTypeColor(claim.claim_type) as any}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 3
                  }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CalendarToday color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          Date of Incident
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: 3 }}>
                        {formatDate(claim.date_of_incident)}
                      </Typography>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <LocationOn color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          Location
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: 3 }}>
                        {claim.location}
                      </Typography>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AttachMoney color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          Estimated Damage
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: 3, fontWeight: 'medium' }}>
                        {formatCurrency(claim.estimated_damage)}
                      </Typography>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Description color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          Documents Uploaded
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: 3 }}>
                        {claim.documents_uploaded.length} file(s)
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Description:
                    </Typography>
                    <Typography variant="body1">
                      {claim.description}
                    </Typography>
                  </Box>

                  {claim.injuries_reported && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Injuries reported - Medical attention required
                      </Typography>
                    </Alert>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1}>
                      {claim.documents_uploaded.slice(0, 3).map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc}
                          variant="outlined"
                          size="small"
                          icon={<CloudDownload />}
                          clickable
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Download document:', doc);
                          }}
                        />
                      ))}
                      {claim.documents_uploaded.length > 3 && (
                        <Chip
                          label={`+${claim.documents_uploaded.length - 3} more`}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Stack>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('View full details:', claim.claim_id);
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        <Paper sx={{ p: 3, mt: 4, bgcolor: 'background.default' }}>
          <Typography variant="h6" gutterBottom>
            Need Help?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            If you have questions about any of your claims, our support team is here to help.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="outlined">
              Contact Support
            </Button>
            <Button variant="outlined">
              File New Claim
            </Button>
            <Button variant="outlined">
              Claims FAQ
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ExistingClaims;
