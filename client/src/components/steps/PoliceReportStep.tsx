import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Alert,
  Chip,
  Stack,
  IconButton,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Delete,
  Info
} from '@mui/icons-material';
import { PoliceReport } from '../../types/claim';

interface PoliceReportStepProps {
  policeReport: PoliceReport;
  onUpdate: (policeReport: PoliceReport) => void;
}

const PoliceReportStep: React.FC<PoliceReportStepProps> = ({
  policeReport,
  onUpdate
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleReportStatusChange = (hasReport: boolean) => {
    const updatedReport: PoliceReport = {
      ...policeReport,
      hasReport,
      // Clear fields if user says no report was filed
      ...(hasReport ? {} : {
        reportNumber: '',
        officerName: '',
        department: '',
        file: undefined,
        preview: undefined
      })
    };
    onUpdate(updatedReport);
  };

  const handleFieldChange = (field: keyof PoliceReport, value: string) => {
    onUpdate({
      ...policeReport,
      [field]: value
    });
  };

  const handleFileUpload = (file: File) => {
    const preview = URL.createObjectURL(file);
    onUpdate({
      ...policeReport,
      file,
      preview
    });
  };

  const handleFileRemove = () => {
    if (policeReport.preview) {
      URL.revokeObjectURL(policeReport.preview);
    }
    onUpdate({
      ...policeReport,
      file: undefined,
      preview: undefined
    });
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        handleFileUpload(file);
      } else {
        alert('Please upload a PDF document or image file.');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Police Report Information
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Please provide information about any police report filed for this incident.
      </Typography>

      {/* Police Report Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              <Typography variant="h6" gutterBottom>
                Was a police report filed for this incident?
              </Typography>
            </FormLabel>
            <RadioGroup
              row
              value={policeReport.hasReport ? 'yes' : 'no'}
              onChange={(e) => handleReportStatusChange(e.target.value === 'yes')}
            >
              <FormControlLabel 
                value="yes" 
                control={<Radio />} 
                label="Yes, a police report was filed" 
              />
              <FormControlLabel 
                value="no" 
                control={<Radio />} 
                label="No, no police report was filed" 
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      {/* Police Report Details - Only show if report was filed */}
      {policeReport.hasReport && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Police Report Details
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
                <TextField
                  fullWidth
                  label="Police Report Number"
                  value={policeReport.reportNumber || ''}
                  onChange={(e) => handleFieldChange('reportNumber', e.target.value)}
                  placeholder="e.g., RPT-2024-001234"
                  helperText="If available, enter the official report number"
                />
                
                <TextField
                  fullWidth
                  label="Responding Officer Name"
                  value={policeReport.officerName || ''}
                  onChange={(e) => handleFieldChange('officerName', e.target.value)}
                  placeholder="e.g., Officer Johnson"
                  helperText="Name of the officer who responded"
                />
                
                <TextField
                  fullWidth
                  label="Police Department"
                  value={policeReport.department || ''}
                  onChange={(e) => handleFieldChange('department', e.target.value)}
                  placeholder="e.g., Metropolitan Police Department"
                  helperText="Department that filed the report"
                  sx={{ gridColumn: { md: 'span 2' } }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Police Report Upload */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Police Report Document
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload a copy of the official police report (PDF or image format)
              </Typography>

              {!policeReport.file ? (
                <Box
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  sx={{
                    border: `2px dashed ${dragOver ? 'primary.main' : 'grey.300'}`,
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: dragOver ? 'action.hover' : 'background.default',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Drag and drop your police report here
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    or click to browse files
                  </Typography>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="police-report-upload"
                  />
                  <label htmlFor="police-report-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                    >
                      Choose File
                    </Button>
                  </label>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Supports: PDF, JPG, PNG (Max 10MB)
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Description color="primary" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">
                        {policeReport.file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(policeReport.file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                    <Chip label="Uploaded" color="success" size="small" />
                    <IconButton 
                      color="error" 
                      onClick={handleFileRemove}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="police-report-replace"
                  />
                  <label htmlFor="police-report-replace">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      size="small"
                    >
                      Replace File
                    </Button>
                  </label>
                </Box>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Information Alert */}
      {!policeReport.hasReport && (
        <Alert severity="info" sx={{ mt: 3 }} icon={<Info />}>
          <Typography variant="body2">
            <strong>No police report filed?</strong> That's okay! Many incidents don't require police involvement. 
            We can still process your claim with the information and photos you provide.
          </Typography>
        </Alert>
      )}

      {policeReport.hasReport && !policeReport.file && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Document Upload Optional:</strong> While uploading the police report helps expedite processing, 
            you can continue without it. You can always upload it later through your dashboard.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default PoliceReportStep;
