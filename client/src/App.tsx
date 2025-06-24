import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Paper
} from '@mui/material';
import MuiThemeProvider from './components/MuiThemeProvider';
import './App.css';

function App() {
  return (
    <MuiThemeProvider>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Auto Insurance Claims Processor
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Auto Insurance Claims Processor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload your documents and let our system process your insurance claims automatically.
          </Typography>
        </Paper>
      </Container>
    </MuiThemeProvider>
  );
}

export default App;
