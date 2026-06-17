import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, Drawer, Typography, Button, IconButton, Divider } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import OfflineBoltRoundedIcon from '@mui/icons-material/OfflineBoltRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { getTheme } from './theme';
import Sidebar from './layouts/Sidebar';
import Header from './layouts/Header';
import Overview from './pages/Overview';
import Namespaces from './pages/Namespaces';
import Pods from './pages/Pods';
import Deployments from './pages/Deployments';
import Services from './pages/Services';
import Events from './pages/Events';
import Logs from './pages/Logs';
import AllIntelligence from './pages/AllIntelligence';
import Topology from './pages/Topology';
import KubeTerminal from './components/KubeTerminal';
import { useClusterStore, clusterStore } from './store/clusterStore';

export default function App() {
  const [currentView, setCurrentView] = useState('overview');
  const [storeState, setStoreState] = useClusterStore();

  const activeTheme = useMemo(() => {
    return getTheme(storeState.themeMode, storeState.accentColor);
  }, [storeState.themeMode, storeState.accentColor]);

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <Overview />;
      case 'namespaces':
        return <Namespaces />;
      case 'pods':
        return <Pods />;
      case 'deployments':
        return <Deployments />;
      case 'services':
        return <Services />;
      case 'events':
        return <Events />;
      case 'logs':
        return <Logs />;
      case 'intelligence':
        return <AllIntelligence />;
      case 'topology':
        return <Topology />;
      default:
        return <Overview />;
    }
  };

  const handleCloseSimulator = () => {
    setStoreState({ simulatorOpen: false });
  };

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'background.default', color: 'text.primary', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
        {/* Navigation Sidebar */}
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        {/* Main Workspace */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {currentView !== 'logs' && <Header />}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', backgroundColor: 'background.default', transition: 'background-color 0.3s ease' }}>
            {renderView()}
          </Box>
        </Box>

        {/* Dynamic Simulator Control Drawer */}
        <Drawer
          anchor="right"
          open={storeState.simulatorOpen}
          onClose={handleCloseSimulator}
          PaperProps={{
            sx: {
              width: 380,
              backgroundColor: 'background.paper',
              borderLeft: '1px solid',
              borderColor: 'divider',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              backgroundImage: 'none',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.15)'
            }
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <OfflineBoltRoundedIcon sx={{ color: 'primary.main', fontSize: 22 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, fontSize: '1.15rem' }}>
                Cluster Simulator
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleCloseSimulator} sx={{ color: 'text.secondary' }}>
              <CloseRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem', mt: -1 }}>
            Inject errors, failures, and traffic anomalies in real-time to test the responsiveness of your UI dashboards.
          </Typography>

          <Divider />

          {/* Section 1: Pod Incidents */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5, fontSize: '0.8rem', letterSpacing: '0.5px' }}>
              POD INCIDENTS
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => clusterStore.simulatePodCrash()}
                startIcon={<ErrorOutlineRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.725rem',
                  py: 0.85,
                  borderRadius: '8px',
                  backgroundColor: '#ef4444',
                  '&:hover': { backgroundColor: '#dc2626' }
                }}
              >
                Simulate Pod Crash
              </Button>
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={() => clusterStore.fixCrashedPods()}
                startIcon={<CheckCircleRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.725rem',
                  py: 0.85,
                  borderRadius: '8px',
                  borderColor: 'success.main',
                  color: 'success.main',
                  '&:hover': { borderColor: 'success.dark', backgroundColor: 'rgba(16, 185, 129, 0.04)' }
                }}
              >
                Restore Crashed Pods
              </Button>
            </Box>
          </Box>

          {/* Section 2: Node Failures */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5, fontSize: '0.8rem', letterSpacing: '0.5px' }}>
              NODE INFRASTRUCTURE
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => clusterStore.simulateNodeOutage()}
                disabled={storeState.nodeOutage}
                startIcon={<CloseRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.725rem',
                  py: 0.85,
                  borderRadius: '8px',
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#d97706' },
                  '&:disabled': { backgroundColor: 'action.disabledBackground', color: 'action.disabled' }
                }}
              >
                Simulate Worker Node Outage
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => clusterStore.restoreNodeOutage()}
                disabled={!storeState.nodeOutage}
                startIcon={<CheckCircleRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.725rem',
                  py: 0.85,
                  borderRadius: '8px',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.04)' }
                }}
              >
                Restore Node Connection
              </Button>
            </Box>
          </Box>

          {/* Section 3: Traffic Simulations */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5, fontSize: '0.8rem', letterSpacing: '0.5px' }}>
              NETWORK & LOAD SENSING
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => clusterStore.simulateTrafficSpike()}
                disabled={storeState.trafficSpike}
                startIcon={<FlashOnRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.725rem',
                  py: 0.85,
                  borderRadius: '8px',
                  backgroundColor: '#6366f1',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#4f46e5' },
                  '&:disabled': { backgroundColor: 'action.disabledBackground', color: 'action.disabled' }
                }}
              >
                Simulate +240% Ingress Spike
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => clusterStore.resetTraffic()}
                disabled={!storeState.trafficSpike}
                startIcon={<CloseRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.725rem',
                  py: 0.85,
                  borderRadius: '8px',
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                Normalize Cluster Load
              </Button>
            </Box>
          </Box>

          {/* Section 4: Security Events */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5, fontSize: '0.8rem', letterSpacing: '0.5px' }}>
              SECURITY INCIDENTS
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => clusterStore.triggerSecurityIncident()}
              startIcon={<SecurityRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                width: '100%',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.725rem',
                py: 0.85,
                borderRadius: '8px',
                backgroundColor: '#8b5cf6',
                color: '#ffffff',
                '&:hover': { backgroundColor: '#7c3aed' }
              }}
            >
              Simulate SQL Injection Intrusion
            </Button>
          </Box>
        </Drawer>
        <KubeTerminal />
      </Box>
    </ThemeProvider>
  );
}

