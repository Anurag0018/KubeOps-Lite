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
  useTheme,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  LinearProgress,
  Menu,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import OfflineBoltRoundedIcon from '@mui/icons-material/OfflineBoltRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Mock Pods Data from Target Mockup
const initialPods = [
  { name: 'api-gateway-7f8d5c9b', namespace: 'production', status: 'RUNNING', cpu: '124m', cpuPercent: 42, memory: '256 Mi', restarts: 0, age: '16m' },
  { name: 'auth-service-v2-k9s1', namespace: 'production', status: 'RUNNING', cpu: '82m', cpuPercent: 28, memory: '128 Mi', restarts: 2, age: '4h' },
  { name: 'worker-node-03-err', namespace: 'background-jobs', status: 'FAILED', cpu: '--', cpuPercent: 0, memory: '--', restarts: 14, age: '2d' },
  { name: 'payment-processor-temp', namespace: 'staging', status: 'PENDING', cpu: '--', cpuPercent: 0, memory: '--', restarts: 0, age: '3d' },
  { name: 'redis-master-0', namespace: 'data-tier', status: 'RUNNING', cpu: '45m', cpuPercent: 15, memory: '512 Mi', restarts: 0, age: '3d' },
];

export default function Pods() {
  const theme = useTheme();
  const [pods, setPods] = useState(initialPods);
  const [search, setSearch] = useState('');
  const [namespaceFilter, setNamespaceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPod, setSelectedPod] = useState(null);

  const handleMenuOpen = (event, pod) => {
    setAnchorEl(event.currentTarget);
    setSelectedPod(pod);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPod(null);
  };

  const handleDeletePod = () => {
    if (selectedPod) {
      setPods(pods.filter(p => p.name !== selectedPod.name));
    }
    handleMenuClose();
  };

  const handleRefresh = () => {
    setPods(initialPods);
  };

  const filteredPods = pods.filter(pod => {
    const matchesSearch = pod.name.toLowerCase().includes(search.toLowerCase());
    const matchesNamespace = namespaceFilter === 'all' || pod.namespace === namespaceFilter;
    const matchesStatus = statusFilter === 'all' || pod.status === statusFilter;
    return matchesSearch && matchesNamespace && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'RUNNING':
        return '#10b981'; // Emerald
      case 'PENDING':
        return '#f59e0b'; // Amber
      case 'FAILED':
        return '#ef4444'; // Red
      default:
        return '#64748b';
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: 'transparent', width: '100%' }}>
      <style>{`
        @keyframes runningPulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
          70% { box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
      {/* Category and Title header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 800, letterSpacing: '1px', display: 'block', mb: 0.5 }}>
            RESOURCES
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, fontSize: '1.6rem', letterSpacing: '-0.5px' }}>
            Pods Monitoring
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontSize: '0.825rem', fontWeight: 500 }}>
            Manage and monitor the lifecycle of your container instances.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'none',
            borderRadius: '8px',
            px: 2,
            py: 0.75,
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          }}
        >
          + Deploy Pod
        </Button>
      </Box>

      {/* Filters Row */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2.5, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>Namespace:</Typography>
          <FormControl size="small">
            <Select
              value={namespaceFilter}
              onChange={(e) => setNamespaceFilter(e.target.value)}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#0f111a' : '#ffffff',
                color: 'text.primary',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': { py: 0.75, px: 1.5 },
                '& .MuiSelect-icon': { color: 'text.secondary' }
              }}
            >
              <MenuItem value="all">All Namespaces</MenuItem>
              <MenuItem value="production">production</MenuItem>
              <MenuItem value="data-tier">data-tier</MenuItem>
              <MenuItem value="background-jobs">background-jobs</MenuItem>
              <MenuItem value="staging">staging</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>Status:</Typography>
          <FormControl size="small">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#0f111a' : '#ffffff',
                color: 'text.primary',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': { py: 0.75, px: 1.5 },
                '& .MuiSelect-icon': { color: 'text.secondary' }
              }}
            >
              <MenuItem value="all">Any Status</MenuItem>
              <MenuItem value="RUNNING">Running</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: theme.palette.mode === 'dark' ? '#0f111a' : '#ffffff',
            borderRadius: '8px',
            px: 1.5,
            py: 0.5,
            width: '240px',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <SearchIcon sx={{ color: '#64748b', mr: 1, fontSize: 18 }} />
          <InputBase
            placeholder="Filter by name or labels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ color: 'text.primary', width: '100%', fontSize: '0.75rem' }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="outlined"
          size="small"
          onClick={handleRefresh}
          startIcon={<RefreshIcon sx={{ fontSize: 14 }} />}
          sx={{
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            color: 'text.primary',
            borderRadius: '8px',
            px: 2,
            py: 0.75,
            fontWeight: 600,
            fontSize: '0.725rem',
            textTransform: 'none',
            '&:hover': {
              borderColor: 'text.secondary',
              backgroundColor: 'action.hover',
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Grid Layout: Table on Left (8.5), Sidebar Cards on Right (3.5) */}
      <Grid container spacing={2}>
        {/* Left Column: Pods Table List */}
        <Grid size={{ xs: 12, lg: 8.5 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '16px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem', borderBottom: '1px solid', borderColor: 'divider' }}>POD NAME</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem', borderBottom: '1px solid', borderColor: 'divider' }}>NAMESPACE</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem', borderBottom: '1px solid', borderColor: 'divider' }}>STATUS</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem', borderBottom: '1px solid', borderColor: 'divider' }}>CPU USAGE</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem', borderBottom: '1px solid', borderColor: 'divider' }}>MEMORY</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem', borderBottom: '1px solid', borderColor: 'divider' }}>RESTARTS</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem', borderBottom: '1px solid', borderColor: 'divider' }}>AGE</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem', borderBottom: '1px solid', borderColor: 'divider' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPods.map((pod) => (
                  <TableRow key={pod.name} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                    <TableCell sx={{
                      borderLeft: `4px solid ${getStatusColor(pod.status)}`,
                      color: 'text.primary',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 1.75,
                      pl: 2,
                    }}>
                      {pod.name}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1.75 }}>
                      <Chip
                        label={pod.namespace}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(59, 130, 246, 0.05)',
                          color: 'text.secondary',
                          fontSize: '0.675rem',
                          fontWeight: 600,
                          height: '20px',
                          borderRadius: '4px',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1.75 }}>
                      <Chip
                        label={pod.status}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(pod.status)}15`,
                          color: getStatusColor(pod.status),
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          height: '20px',
                          borderRadius: '4px',
                          border: `1px solid ${getStatusColor(pod.status)}25`,
                          animation: pod.status === 'RUNNING' ? 'runningPulse 2s infinite' : 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: '130px', borderBottom: '1px solid', borderColor: 'divider', py: 1.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.75rem', fontWeight: 700, minWidth: '35px' }}>
                          {pod.cpu}
                        </Typography>
                        {pod.status === 'RUNNING' && (
                          <LinearProgress
                            variant="determinate"
                            value={pod.cpuPercent}
                            sx={{
                              flexGrow: 1,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: 'action.selected',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#3b82f6',
                              },
                            }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.75rem', borderBottom: '1px solid', borderColor: 'divider', py: 1.75 }}>
                      {pod.memory}
                    </TableCell>
                    <TableCell sx={{
                      color: pod.restarts > 5 ? '#ef4444' : 'text.primary',
                      fontWeight: pod.restarts > 5 ? 800 : 600,
                      fontSize: '0.75rem',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 1.75,
                    }}>
                      {pod.restarts}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider', py: 1.75 }}>
                      {pod.age}
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1.75 }}>
                      <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={(e) => handleMenuOpen(e, pod)}>
                        <MoreVertIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>
                Showing 5 of 124 pods
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  sx={{
                    color: 'text.disabled',
                    borderColor: 'divider',
                    textTransform: 'none',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: 'text.primary',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                    textTransform: 'none',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    '&:hover': {
                      borderColor: 'text.secondary',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </TableContainer>
        </Grid>

        {/* Right Column: Health Summary & Quick Links */}
        <Grid size={{ xs: 12, lg: 3.5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Card 1: Cluster Health Summary */}
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 12px 20px -10px rgba(16, 185, 129, 0.15), 0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
                  : '0 12px 20px -10px rgba(16, 185, 129, 0.1), 0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                borderColor: '#10b981',
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: '0.5px', display: 'block', mb: 2 }}>
                CLUSTER HEALTH SUMMARY
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Running Pods Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      p: 0.75,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(4, 120, 87, 0.08)',
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(4, 120, 87, 0.15)',
                      display: 'flex'
                    }}>
                      <CheckCircleRoundedIcon sx={{ color: theme.palette.mode === 'dark' ? '#10b981' : '#047857', fontSize: 16 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.625rem', display: 'block' }}>RUNNING PODS</Typography>
                      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.1 }}>117</Typography>
                    </Box>
                  </Box>
                  <Chip
                    label="94.3%"
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(4, 120, 87, 0.08)',
                      color: theme.palette.mode === 'dark' ? '#10b981' : '#047857',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      height: '18px',
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(4, 120, 87, 0.15)',
                    }}
                  />
                </Box>

                {/* Failed Pods Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      p: 0.75,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(185, 28, 28, 0.08)',
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(185, 28, 28, 0.15)',
                      display: 'flex'
                    }}>
                      <CancelRoundedIcon sx={{ color: theme.palette.mode === 'dark' ? '#ef4444' : '#b91c1c', fontSize: 16 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.625rem', display: 'block' }}>FAILED PODS</Typography>
                      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.1 }}>2</Typography>
                    </Box>
                  </Box>
                  <Chip
                    label="1.6%"
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(185, 28, 28, 0.08)',
                      color: theme.palette.mode === 'dark' ? '#ef4444' : '#b91c1c',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      height: '18px',
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(185, 28, 28, 0.15)',
                    }}
                  />
                </Box>

                {/* Avg CPU */}
                <Box sx={{ mt: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.65rem' }}>AVERAGE CPU</Typography>
                    <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.7rem' }}>42%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={42}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: 'action.selected',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#3b82f6', borderRadius: 3 },
                    }}
                  />
                </Box>

                {/* Avg Memory */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.65rem' }}>AVERAGE MEMORY</Typography>
                    <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700, fontSize: '0.7rem' }}>68%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={68}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: 'action.selected',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#10b981', borderRadius: 3 },
                    }}
                  />
                </Box>

                {/* Optimization Tip Box */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.25,
                    p: 1.5,
                    borderRadius: '10px',
                    backgroundColor: 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 1,
                  }}
                >
                  <OfflineBoltRoundedIcon sx={{ color: '#3b82f6', fontSize: 20, mt: 0.25 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.75rem', mb: 0.25 }}>
                      Optimization Tip
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.675rem', lineHeight: 1.35, fontWeight: 500 }}>
                      3 pods in 'production' are over-provisioned. Reducing limits could save 1.2 vCPU.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Card 2: Quick Links */}
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 12px 20px -10px rgba(59, 130, 246, 0.15), 0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
                  : '0 12px 20px -10px rgba(59, 130, 246, 0.1), 0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                borderColor: 'primary.main',
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: '0.5px', display: 'block', mb: 1.5 }}>
                QUICK LINKS
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<TerminalRoundedIcon sx={{ color: '#3b82f6' }} />}
                    sx={{
                      borderColor: 'divider',
                      backgroundColor: 'background.default',
                      color: 'text.primary',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      py: 1,
                      textTransform: 'none',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                      '& .MuiButton-startIcon': { margin: 0 },
                      '&:hover': {
                        borderColor: 'text.secondary',
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    Exec Shell
                  </Button>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<DescriptionRoundedIcon sx={{ color: '#10b981' }} />}
                    sx={{
                      borderColor: 'divider',
                      backgroundColor: 'background.default',
                      color: 'text.primary',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      py: 1,
                      textTransform: 'none',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                      '& .MuiButton-startIcon': { margin: 0 },
                      '&:hover': {
                        borderColor: 'text.secondary',
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    View Logs
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            color: 'text.primary',
            width: '150px',
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, fontSize: '0.85rem' }}>
          <TerminalRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          View Logs
        </MenuItem>
        <MenuItem onClick={handleDeletePod} sx={{ gap: 1.5, color: 'error.main', fontSize: '0.85rem' }}>
          <DeleteRoundedIcon sx={{ fontSize: 16, color: 'error.main' }} />
          Terminate
        </MenuItem>
      </Menu>

    </Box>
  );
}
