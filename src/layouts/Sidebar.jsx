import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import OfflineBoltRoundedIcon from '@mui/icons-material/OfflineBoltRounded';
import { useClusterStore } from '../store/clusterStore';

const DRAWER_WIDTH = 240;

// Color accents for each sidebar navigation view
const itemColors = {
  overview: { hex: '#3b82f6', rgba: '59, 130, 246' },
  namespaces: { hex: '#a855f7', rgba: '168, 85, 247' },
  pods: { hex: '#10b981', rgba: '16, 185, 129' },
  deployments: { hex: '#f59e0b', rgba: '245, 158, 11' }, // Warm amber
  intelligence: { hex: '#06b6d4', rgba: '6, 182, 212' }, // Neon cyan
  services: { hex: '#0ea5e9', rgba: '14, 165, 233' }, // Sky blue
  events: { hex: '#e11d48', rgba: '225, 29, 72' }, // Vibrant rose
  logs: { hex: '#14b8a6', rgba: '20, 184, 166' }, // Teal
  settings: { hex: '#64748b', rgba: '100, 116, 139' }, // Slate
};

const menuItems = [
  { text: 'Overview', icon: <GridViewRoundedIcon />, view: 'overview' },
  { text: 'Namespaces', icon: <LayersRoundedIcon />, view: 'namespaces' },
  { text: 'Pods', icon: <DnsRoundedIcon />, view: 'pods' },
  { text: 'Deployments', icon: <AccountTreeRoundedIcon />, view: 'deployments' },
  { text: 'AI Intelligence', icon: <OfflineBoltRoundedIcon />, view: 'intelligence' },
  { text: 'Services', icon: <HubRoundedIcon />, view: 'services' },
  { text: 'Events', icon: <FlashOnRoundedIcon />, view: 'events' },
  { text: 'Logs', icon: <TerminalRoundedIcon />, view: 'logs' },
];

// Custom 3D Isometric Glowing & Rotating Logo Component
const KubeOpsLogo = ({ themeMode }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: 34, height: 34 }}>
    <style>{`
      @keyframes logoPulse {
        0%, 100% { transform: scale(0.95); opacity: 0.35; }
        50% { transform: scale(1.15); opacity: 0.75; }
      }
      @keyframes logoRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    
    {/* Ambient Glow Aura */}
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(6, 182, 212, 0.1) 70%)',
        filter: 'blur(5px)',
        animation: 'logoPulse 3s ease-in-out infinite',
      }}
    />
    
    {/* SVG Hexagonal Globe Core */}
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="45%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Outer Hexagon Outline */}
      <path
        d="M16 2L29 9.5V24.5L16 32L3 24.5V9.5L16 2Z"
        stroke="url(#logoGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logoGlow)"
        style={{
          transformOrigin: 'center',
          animation: 'logoRotate 25s linear infinite',
        }}
      />
      
      {/* Inner Lattice Nodes */}
      <path
        d="M16 2V16M29 9.5L16 16M3 9.5L16 16M16 16V32M29 24.5L16 16M3 24.5L16 16"
        stroke="url(#logoGrad)"
        strokeWidth="1.5"
        strokeOpacity="0.8"
        strokeLinecap="round"
      />
      
      {/* Center Core Spark */}
      <circle cx="16" cy="16" r="3" fill={themeMode === 'dark' ? '#ffffff' : '#06b6d4'} filter="url(#logoGlow)" />
    </svg>
  </Box>
);

export default function Sidebar({ currentView, onViewChange }) {
  const [storeState, setStoreState] = useClusterStore();
  const themeMode = storeState.themeMode;
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'background.sidebar',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px 12px',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        },
      }}
    >
      <Box>
        {/* Header Logo block */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, mb: 2.5 }}>
          <KubeOpsLogo themeMode={themeMode} />
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: 'text.primary', fontSize: '1.25rem' }}>
            KubeOps <span style={{ color: '#3b82f6', fontWeight: 400 }}>Lite</span>
          </Typography>
        </Box>

        {/* Menu Items */}
        <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {menuItems.map((item) => {
            const isActive = currentView === item.view;
            const colors = itemColors[item.view] || itemColors.overview;
            
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => onViewChange(item.view)}
                  sx={{
                    borderRadius: '8px',
                    py: 0.75,
                    px: 1.25,
                    backgroundColor: isActive ? `rgba(${colors.rgba}, 0.06)` : 'transparent',
                    borderLeft: `3px solid ${isActive ? colors.hex : 'transparent'}`,
                    color: isActive ? colors.hex : 'text.secondary',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      backgroundColor: isActive ? `rgba(${colors.rgba}, 0.08)` : (themeMode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'),
                      color: isActive ? colors.hex : 'text.primary',
                      '& .icon-box': {
                        borderColor: `rgba(${colors.rgba}, 0.45)`,
                        color: colors.hex,
                        backgroundColor: `rgba(${colors.rgba}, 0.15)`,
                        transform: 'scale(1.05)',
                        boxShadow: `0 0 10px rgba(${colors.rgba}, 0.15)`,
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    <Box
                      className="icon-box"
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isActive ? `rgba(${colors.rgba}, 0.12)` : (themeMode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'),
                        border: '1px solid',
                        borderColor: isActive ? `rgba(${colors.rgba}, 0.25)` : 'divider',
                        color: isActive ? colors.hex : 'text.secondary',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: isActive ? `drop-shadow(0px 0px 4px rgba(${colors.rgba}, 0.3))` : 'none',
                        '& .MuiSvgIcon-root': { fontSize: 16 },
                      }}
                    >
                      {item.icon}
                    </Box>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.8rem',
                      letterSpacing: '0.1px',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer Section */}
      <Box>
        {/* Custom Light/Dark Mode Switch - above settings */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1.5,
            py: 1,
            mb: 1.5,
            borderRadius: '8px',
            backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.8rem' }}>
            Theme Mode
          </Typography>
          
          {/* Custom Toggle Switch Pill */}
          <Box
            onClick={() => setStoreState({ themeMode: themeMode === 'dark' ? 'light' : 'dark' })}
            sx={{
              width: 52,
              height: 26,
              borderRadius: 13,
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: '5px',
              backgroundColor: themeMode === 'dark' ? '#000000' : '#e2e8f0',
              border: `1px solid ${themeMode === 'dark' ? '#1e293b' : '#cbd5e1'}`,
              boxShadow: themeMode === 'light' ? 'inset 0 1px 2px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Left Sun Icon in Light Mode */}
            {themeMode === 'light' && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
                <circle cx="12" cy="12" r="5" fill="#f59e0b" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
              </svg>
            )}

            {/* Sliding White Handle Circle */}
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                position: 'absolute',
                top: 3,
                left: themeMode === 'dark' ? 3 : 29,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />

            {/* Right Moon Icon in Dark Mode */}
            {themeMode === 'dark' && (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#cbd5e1" style={{ opacity: 0.9 }}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </Box>
            )}
          </Box>
        </Box>

        {/* Settings button */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => onViewChange('settings')}
            sx={{
              borderRadius: '8px',
              py: 0.75,
              px: 1.25,
              color: currentView === 'settings' ? itemColors.settings.hex : 'text.secondary',
              backgroundColor: currentView === 'settings' ? `rgba(${itemColors.settings.rgba}, 0.06)` : 'transparent',
              borderLeft: `3px solid ${currentView === 'settings' ? itemColors.settings.hex : 'transparent'}`,
              transition: 'all 0.25s ease',
              '&:hover': {
                backgroundColor: currentView === 'settings' ? `rgba(${itemColors.settings.rgba}, 0.08)` : (themeMode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'),
                color: currentView === 'settings' ? itemColors.settings.hex : 'text.primary',
                '& .icon-box': {
                  borderColor: `rgba(${itemColors.settings.rgba}, 0.45)`,
                  color: itemColors.settings.hex,
                  backgroundColor: `rgba(${itemColors.settings.rgba}, 0.15)`,
                  transform: 'scale(1.05)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 42 }}>
              <Box
                className="icon-box"
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: currentView === 'settings' ? `rgba(${itemColors.settings.rgba}, 0.12)` : (themeMode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'),
                  border: '1px solid',
                  borderColor: currentView === 'settings' ? `rgba(${itemColors.settings.rgba}, 0.25)` : 'divider',
                  color: currentView === 'settings' ? itemColors.settings.hex : 'text.secondary',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& .MuiSvgIcon-root': { fontSize: 16 },
                }}
              >
                <SettingsRoundedIcon />
              </Box>
            </ListItemIcon>
            <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 500, fontSize: '0.8rem' }} />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ borderColor: 'divider', mb: 1.5 }} />

        {/* Profile Details */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 0.75,
            borderRadius: '12px',
            backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Alex Rivera"
              sx={{ width: 32, height: 32, border: '1px solid', borderColor: 'divider' }}
            />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.75rem', lineHeight: 1.2 }}>
                Alex Rivera
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                Platform Engineer
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444' } }}>
            <LogoutRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
}


