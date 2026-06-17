import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
import { useClusterStore, clusterStore } from '../store/clusterStore';

export default function Pods() {
  const theme = useTheme();
  const [storeState] = useClusterStore();
  const pods = storeState.pods;
  const [search, setSearch] = useState('');
  const [namespaceFilter, setNamespaceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPod, setSelectedPod] = useState(null);
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);
  const [yamlValue, setYamlValue] = useState('');
  const [yamlError, setYamlError] = useState('');

  const getYamlStr = (pod) => {
    if (!pod) return '';
    return pod.yaml || `apiVersion: v1
kind: Pod
metadata:
  name: ${pod.name}
  namespace: ${pod.namespace}
  labels:
    app: ${pod.deployment || 'standalone'}
spec:
  containers:
  - name: container
    image: custom-image:v1
    resources:
      requests:
        cpu: ${pod.cpu}
        memory: ${pod.memory}
status:
  phase: ${pod.status}
  hostIP: 192.168.1.101
  nodeName: ${pod.node}`;
  };

  useEffect(() => {
    if (!yamlValue) return;
    const lines = yamlValue.split('\n');
    let hasError = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('#')) {
        if (!line.includes(':') && !line.startsWith('-')) {
          hasError = true;
          break;
        }
      }
    }
    setYamlError(hasError ? 'Warning: invalid YAML syntax (missing colon or key-value format)' : '');
  }, [yamlValue]);

  const handleEditYamlOpen = () => {
    if (selectedPod) {
      setYamlValue(getYamlStr(selectedPod));
      setYamlDialogOpen(true);
    }
    setAnchorEl(null);
  };

  const handleApplyYaml = () => {
    if (selectedPod) {
      clusterStore.updateResourceYaml('pod', selectedPod.name, yamlValue);
      setYamlDialogOpen(false);
      setSelectedPod(null);
    }
  };

  const handleMenuOpen = (event, pod) => {
    setAnchorEl(event.currentTarget);
    setSelectedPod(pod);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Note: don't clear selectedPod immediately because the delete or YAML editor actions need it
  };

  const handleDeletePod = () => {
    if (selectedPod) {
      clusterStore.deletePod(selectedPod.name);
    }
    handleMenuClose();
  };

  const handleRefresh = () => {
    clusterStore.setState({
      pods: [
        { name: 'api-gateway-7f8d5c9b-1', deployment: 'api-gateway', namespace: 'production', status: 'RUNNING', cpu: '124m', cpuPercent: 42, memory: '256 Mi', restarts: 0, age: '16m', node: 'node-master-01' },
        { name: 'api-gateway-7f8d5c9b-2', deployment: 'api-gateway', namespace: 'production', status: 'RUNNING', cpu: '115m', cpuPercent: 38, memory: '240 Mi', restarts: 0, age: '16m', node: 'node-master-01' },
        { name: 'api-gateway-7f8d5c9b-3', deployment: 'api-gateway', namespace: 'production', status: 'RUNNING', cpu: '130m', cpuPercent: 44, memory: '260 Mi', restarts: 0, age: '16m', node: 'node-master-01' },
        { name: 'api-gateway-7f8d5c9b-4', deployment: 'api-gateway', namespace: 'production', status: 'RUNNING', cpu: '120m', cpuPercent: 40, memory: '250 Mi', restarts: 0, age: '16m', node: 'node-master-01' },
        { name: 'api-gateway-7f8d5c9b-5', deployment: 'api-gateway', namespace: 'production', status: 'RUNNING', cpu: '122m', cpuPercent: 41, memory: '254 Mi', restarts: 0, age: '16m', node: 'node-master-01' },
        { name: 'api-gateway-7f8d5c9b-6', deployment: 'api-gateway', namespace: 'production', status: 'RUNNING', cpu: '118m', cpuPercent: 39, memory: '248 Mi', restarts: 0, age: '16m', node: 'node-master-01' },
        { name: 'api-gateway-7f8d5c9b-7', deployment: 'api-gateway', namespace: 'production', status: 'RUNNING', cpu: '126m', cpuPercent: 43, memory: '258 Mi', restarts: 0, age: '16m', node: 'node-master-01' },
        { name: 'api-gateway-7f8d5c9b-8', deployment: 'api-gateway', namespace: 'production', status: 'RUNNING', cpu: '125m', cpuPercent: 42, memory: '256 Mi', restarts: 0, age: '16m', node: 'node-master-01' },
        { name: 'auth-service-v2-k9s1', deployment: 'auth-service', namespace: 'production', status: 'RUNNING', cpu: '82m', cpuPercent: 28, memory: '128 Mi', restarts: 2, age: '4h', node: 'node-worker-01' },
        { name: 'auth-service-v2-k9s2', deployment: 'auth-service', namespace: 'production', status: 'RUNNING', cpu: '80m', cpuPercent: 27, memory: '120 Mi', restarts: 1, age: '4h', node: 'node-worker-01' },
        { name: 'auth-service-v2-k9s3', deployment: 'auth-service', namespace: 'production', status: 'RUNNING', cpu: '85m', cpuPercent: 29, memory: '130 Mi', restarts: 3, age: '4h', node: 'node-worker-01' },
        { name: 'auth-service-v2-k9s4', deployment: 'auth-service', namespace: 'production', status: 'PENDING', cpu: '--', cpuPercent: 0, memory: '--', restarts: 0, age: '2m', node: 'node-worker-01' },
        { name: 'worker-node-03-err', deployment: 'worker-jobs', namespace: 'background-jobs', status: 'FAILED', cpu: '--', cpuPercent: 0, memory: '--', restarts: 14, age: '2d', node: 'node-worker-01' },
        { name: 'payment-db-sync-1', deployment: 'payment-db-sync', namespace: 'infrastructure', status: 'RUNNING', cpu: '40m', cpuPercent: 12, memory: '100 Mi', restarts: 0, age: '3d', node: 'node-worker-02' },
        { name: 'payment-db-sync-2', deployment: 'payment-db-sync', namespace: 'infrastructure', status: 'RUNNING', cpu: '42m', cpuPercent: 14, memory: '110 Mi', restarts: 0, age: '3d', node: 'node-worker-02' },
      ],
      deployments: [
        { name: 'api-gateway', ns: 'production', strategy: 'RollingUpdate', replicasReady: 8, replicasTotal: 8, status: 'Ready', cpu: '2.4 vCPU', memory: '4.8 GB RAM', iconBg: 'rgba(59, 130, 246, 0.08)', iconBorder: 'rgba(59, 130, 246, 0.12)', progressColor: '#3b82f6' },
        { name: 'auth-service', ns: 'production', strategy: 'Recreate', replicasReady: 3, replicasTotal: 4, status: 'Ready', cpu: '1.2 vCPU', memory: '2.1 GB RAM', iconBg: 'rgba(163, 116, 255, 0.08)', iconBorder: 'rgba(163, 116, 255, 0.12)', progressColor: '#a374ff' },
        { name: 'payment-db-sync', ns: 'infrastructure', strategy: 'RollingUpdate', replicasReady: 2, replicasTotal: 2, status: 'Ready', cpu: '0.8 vCPU', memory: '1.5 GB RAM', iconBg: 'rgba(16, 185, 129, 0.08)', iconBorder: 'rgba(16, 185, 129, 0.12)', progressColor: '#10b981' },
      ],
      healthScore: 94,
      nodeOutage: false,
      trafficSpike: false,
      uptime: '99.98%',
      latency: '12ms',
    });
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
        <MenuItem onClick={handleEditYamlOpen} sx={{ gap: 1.5, fontSize: '0.85rem' }}>
          <DescriptionRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          Edit YAML
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, fontSize: '0.85rem' }}>
          <TerminalRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          View Logs
        </MenuItem>
        <MenuItem onClick={handleDeletePod} sx={{ gap: 1.5, color: 'error.main', fontSize: '0.85rem' }}>
          <DeleteRoundedIcon sx={{ fontSize: 16, color: 'error.main' }} />
          Terminate
        </MenuItem>
      </Menu>

      {/* YAML Manifest Editor Dialog */}
      <Dialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '16px',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.05rem', pb: 1 }}>
          Edit Pod Manifest: {selectedPod?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          {yamlError ? (
            <Box sx={{ mb: 2, p: 1.25, borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
              <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                {yamlError}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mb: 2, p: 1.25, borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                ✓ Manifest syntax valid
              </Typography>
            </Box>
          )}
          <TextField
            multiline
            rows={14}
            fullWidth
            value={yamlValue}
            onChange={(e) => setYamlValue(e.target.value)}
            inputProps={{
              style: {
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                lineHeight: 1.4,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.mode === 'dark' ? '#070b13' : '#f8fafc',
                '& fieldset': { borderColor: 'divider' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setYamlDialogOpen(false)}
            sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyYaml}
            variant="contained"
            disabled={Boolean(yamlError)}
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '8px',
              backgroundColor: 'primary.main',
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
          >
            Apply Config
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
