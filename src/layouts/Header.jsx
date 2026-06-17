import React from 'react';
import {
  Box,
  InputBase,
  IconButton,
  Badge,
  MenuItem,
  Select,
  FormControl,
  Avatar,
  useTheme,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import CircleIcon from '@mui/icons-material/Circle';
import OfflineBoltRoundedIcon from '@mui/icons-material/OfflineBoltRounded';
import { useClusterStore } from '../store/clusterStore';

export default function Header() {
  const [cluster, setCluster] = React.useState('production-us-east-1');
  const [storeState, setStoreState] = useClusterStore();
  const theme = useTheme();

  const handleClusterChange = (event) => {
    setCluster(event.target.value);
  };

  const handleToggleSimulator = () => {
    setStoreState({ simulatorOpen: !storeState.simulatorOpen });
  };

  const accents = [
    { name: 'blue', color: '#3b82f6' },
    { name: 'purple', color: '#8b5cf6' },
    { name: 'emerald', color: '#10b981' },
    { name: 'orange', color: '#f97316' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 1.25,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <style>{`
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 var(--pulse-color); }
          70% { box-shadow: 0 0 0 6px var(--pulse-color-fade); }
          100% { box-shadow: 0 0 0 0 var(--pulse-color-fade); }
        }
      `}</style>

      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          borderRadius: '8px',
          px: 2,
          py: 0.5,
          width: '400px',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s ease',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: `0 0 0 1px ${theme.palette.primary.main}4d`,
          },
        }}
      >
        <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
        <InputBase
          placeholder="Search resources, pods, or logs..."
          sx={{
            color: 'text.primary',
            width: '100%',
            fontSize: '0.875rem',
            '&::placeholder': {
              color: 'text.secondary',
              opacity: 0.7,
            },
          }}
        />
      </Box>

      {/* Right Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        
        {/* Theme Accent Color Picker */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '20px', px: 1.5, py: 0.5 }}>
          {accents.map((accent) => {
            const isSelected = storeState.accentColor === accent.name;
            return (
              <Tooltip key={accent.name} title={`Select ${accent.name} theme`} arrow>
                <IconButton
                  size="small"
                  onClick={() => setStoreState({ accentColor: accent.name })}
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: accent.color,
                    border: isSelected ? '1.5px solid #ffffff' : '1px solid rgba(0,0,0,0.1)',
                    boxShadow: isSelected ? '0 0 4px rgba(0,0,0,0.5)' : 'none',
                    p: 0,
                    '&:hover': {
                      backgroundColor: accent.color,
                      transform: 'scale(1.2)',
                    },
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>

        {/* Pulse Animated Cluster Simulator Toggle Button */}
        <Tooltip title="Toggle Cluster Simulator Drawer" arrow>
          <IconButton
            onClick={handleToggleSimulator}
            style={{
              '--pulse-color': `${theme.palette.primary.main}66`,
              '--pulse-color-fade': `${theme.palette.primary.main}00`,
            }}
            sx={{
              color: storeState.simulatorOpen ? '#ffffff' : 'primary.main',
              backgroundColor: storeState.simulatorOpen ? 'primary.main' : 'background.paper',
              border: '1px solid',
              borderColor: 'primary.main',
              borderRadius: '50%',
              p: 1,
              animation: storeState.simulatorOpen ? 'none' : 'pulseGlow 2s infinite',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: '#ffffff',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <OfflineBoltRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {/* Cluster Selector */}
        <FormControl size="small">
          <Select
            value={cluster}
            onChange={handleClusterChange}
            sx={{
              backgroundColor: 'background.paper',
              color: theme.palette.mode === 'dark' ? '#34d399' : '#059669', // Readability check
              fontWeight: 600,
              fontSize: '0.75rem',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: 'divider',
              px: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
              },
              '& .MuiSelect-select': {
                py: 0.75,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              },
              '& .MuiSvgIcon-root': {
                color: 'text.secondary',
              },
            }}
            renderValue={(value) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircleIcon sx={{ color: '#10b981', fontSize: 8 }} />
                {value}
              </Box>
            )}
          >
            <MenuItem value="production-us-east-1" sx={{ fontSize: '0.75rem' }}>
              production-us-east-1
            </MenuItem>
            <MenuItem value="staging-us-east-1" sx={{ fontSize: '0.75rem' }}>
              staging-us-east-1
            </MenuItem>
            <MenuItem value="dev-cluster" sx={{ fontSize: '0.75rem' }}>
              dev-cluster
            </MenuItem>
          </Select>
        </FormControl>

        {/* Notification Icon */}
        <IconButton
          sx={{
            color: 'text.secondary',
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '50%',
            p: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'text.primary',
            },
          }}
        >
          <Badge
            variant="dot"
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#ef4444',
                right: 2,
                top: 2,
              },
            }}
          >
            <NotificationsNoneRoundedIcon sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>

        {/* Profile Avatar */}
        <Avatar
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="User Profile"
          sx={{
            width: 36,
            height: 36,
            border: '1.5px solid',
            borderColor: 'divider',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
        />
      </Box>
    </Box>
  );
}

