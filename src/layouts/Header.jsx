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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import CircleIcon from '@mui/icons-material/Circle';

export default function Header() {
  const [cluster, setCluster] = React.useState('production-us-east-1');
  const theme = useTheme();

  const handleClusterChange = (event) => {
    setCluster(event.target.value);
  };

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
            boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)',
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

