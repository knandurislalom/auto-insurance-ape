import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography
} from '@mui/material';
import MuiThemeProvider from './components/MuiThemeProvider';
import Dashboard from './pages/Dashboard';
import ClaimIntakeFlow from './pages/ClaimIntakeFlow';
import ExistingClaims from './pages/ExistingClaims';
import './App.css';

function App() {
  return (
    <MuiThemeProvider>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Auto Insurance Claims
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/claim/new" element={<ClaimIntakeFlow />} />
          <Route path="/claims" element={<ExistingClaims />} />
        </Routes>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
