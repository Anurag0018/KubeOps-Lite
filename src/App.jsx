import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
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

export default function App() {
  const [currentView, setCurrentView] = useState('overview');
  const [themeMode, setThemeMode] = useState('dark');

  const activeTheme = useMemo(() => getTheme(themeMode), [themeMode]);

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
      default:
        return <Overview />;
    }
  };

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'background.default', color: 'text.primary', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
        {/* Navigation Sidebar */}
        <Sidebar currentView={currentView} onViewChange={setCurrentView} themeMode={themeMode} setThemeMode={setThemeMode} />

        {/* Main Workspace */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {currentView !== 'logs' && <Header />}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', backgroundColor: 'background.default', transition: 'background-color 0.3s ease' }}>
            {renderView()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

