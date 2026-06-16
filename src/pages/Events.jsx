import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  InputBase,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircleIcon from '@mui/icons-material/Circle';

import { useClusterStore } from '../store/clusterStore';

export default function Events() {
  const theme = useTheme();
  const [storeState] = useClusterStore();
  const events = storeState.events;
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.object.toLowerCase().includes(search.toLowerCase()) || evt.message.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || evt.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <Box sx={{ p: 4, backgroundColor: 'background.default', minHeight: 'calc(100vh - 70px)', transition: 'background-color 0.3s ease' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.5px' }}>
            Cluster Events
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Live status reports, lifecycle events, and audit logs of active Kubernetes resources.
          </Typography>
        </Box>
        <IconButton sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            borderRadius: '8px',
            px: 2,
            py: 0.5,
            width: '320px',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search events object or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ color: 'text.primary', width: '100%', fontSize: '0.875rem' }}
          />
        </Box>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            sx={{
              backgroundColor: 'background.paper',
              color: 'text.primary',
              fontSize: '0.875rem',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'divider',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Warning">Warning</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '16px',
          boxShadow: 'none',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.palette.mode === 'dark' 
              ? `0 12px 20px -10px ${theme.palette.primary.main}40, 0 4px 20px 0 rgba(0, 0, 0, 0.3)` 
              : `0 12px 20px -10px ${theme.palette.primary.main}20, 0 4px 20px 0 rgba(0, 0, 0, 0.05)`,
            borderColor: 'primary.main',
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '100px' }}>Last Seen</TableCell>
              <TableCell sx={{ width: '120px' }}>Type</TableCell>
              <TableCell sx={{ width: '150px' }}>Reason</TableCell>
              <TableCell sx={{ width: '280px' }}>Object</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map((evt, idx) => (
              <TableRow key={idx} hover sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell sx={{ color: 'text.secondary' }}>{evt.time}</TableCell>
                <TableCell>
                  <Chip
                    label={evt.type}
                    size="small"
                    color={evt.type === 'Warning' ? 'warning' : 'success'}
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      height: '20px',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{evt.reason}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {evt.object}
                </TableCell>
                <TableCell sx={{ color: evt.type === 'Warning' ? (theme.palette.mode === 'dark' ? 'warning.main' : 'warning.dark') : 'text.primary', fontSize: '0.85rem' }}>
                  {evt.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
