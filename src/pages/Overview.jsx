import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  TextField,
  Paper,
} from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import LayersIcon from '@mui/icons-material/Layers';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import SchemaIcon from '@mui/icons-material/Schema';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SecurityIcon from '@mui/icons-material/Security';
import SyncIcon from '@mui/icons-material/Sync';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useClusterStore, clusterStore } from '../store/clusterStore';

// Mock trend metrics for CPU, Memory, and Network health timeline
const timelineData = [
  { time: '12:00', cpu: 40, memory: 65, network: 18 },
  { time: '12:10', cpu: 45, memory: 68, network: 22 },
  { time: '12:20', cpu: 42, memory: 70, network: 20 },
  { time: '12:30', cpu: 48, memory: 72, network: 25 },
  { time: '12:40', cpu: 41, memory: 73, network: 45 },
  { time: '12:50', cpu: 43, memory: 74, network: 15 },
  { time: '13:00', cpu: 49, memory: 76, network: 12 },
  { time: '13:10', cpu: 52, memory: 77, network: 28 },
  { time: '13:20', cpu: 55, memory: 75, network: 32 },
  { time: '13:30', cpu: 58, memory: 72, network: 30 },
  { time: '13:40', cpu: 56, memory: 70, network: 35 },
  { time: '13:50', cpu: 50, memory: 68, network: 32 },
];

export default function Overview() {
  const theme = useTheme();
  const [storeState] = useClusterStore();

  const [widgetModalOpen, setWidgetModalOpen] = useState(false);
  const [newMetric, setNewMetric] = useState('cpu');
  const [newChartType, setNewChartType] = useState('area');
  const [newTitle, setNewTitle] = useState('Custom CPU Metric');

  const handleAddWidget = () => {
    clusterStore.addWidget({
      title: newTitle || `Custom ${newMetric.toUpperCase()} Metric`,
      metric: newMetric,
      chartType: newChartType,
    });
    setWidgetModalOpen(false);
    setNewTitle('Custom CPU Metric');
  };

  const totalPods = storeState.pods.length;
  const healthyPods = storeState.pods.filter(p => p.status === 'RUNNING').length;
  const warningPods = storeState.pods.filter(p => p.status === 'PENDING').length;
  const failedPods = storeState.pods.filter(p => p.status === 'FAILED').length;
  const totalWarnings = warningPods + failedPods;
  const totalDeployments = storeState.deployments.length;

  return (
    <Box sx={{ p: 3, backgroundColor: 'transparent', width: '100%' }}>
      {/* Title block */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, fontSize: '1.6rem', letterSpacing: '-0.5px' }}>
          Kubernetes Cluster Overview
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '0.825rem', fontWeight: 500 }}>
          Real-time monitoring and workload management for your primary production cluster.
        </Typography>
      </Box>

      {/* Grid Row 1: KPI Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Card 1: Total Pods */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.75 }}>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)', display: 'flex' }}>
                  <LayersIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(4, 120, 87, 0.08)',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(4, 120, 87, 0.15)',
                  borderRadius: '20px',
                  px: 1.25,
                  py: 0.25
                }}>
                  <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? '#10b981' : '#047857', fontWeight: 700, fontSize: '0.65rem' }}>+12%</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', mb: 0.25 }}>Total Pods</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.8rem' }}>{totalPods}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Healthy Pods */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.75 }}>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', display: 'flex' }}>
                  <CheckCircleOutlineRoundedIcon sx={{ color: '#10b981', fontSize: 18 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <svg width="20" height="10" viewBox="0 0 24 12" style={{ opacity: 0.8 }}>
                    <path d="M0 6 Q6 0, 12 6 T24 6" fill="none" stroke={theme.palette.mode === 'dark' ? '#10b981' : '#047857'} strokeWidth="1.5" />
                  </svg>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.5px' }}>STABLE</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', mb: 0.25 }}>Healthy Pods</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.mode === 'dark' ? '#10b981' : '#059669', fontSize: '1.8rem' }}>{healthyPods}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Warnings */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  ? '0 12px 20px -10px rgba(245, 158, 11, 0.15), 0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
                  : '0 12px 20px -10px rgba(245, 158, 11, 0.1), 0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                borderColor: '#f59e0b',
              }
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.75 }}>
                <Box sx={{
                  p: 1,
                  borderRadius: '10px',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(180, 83, 9, 0.08)',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(180, 83, 9, 0.15)',
                  display: 'flex'
                }}>
                  <WarningAmberRoundedIcon sx={{ color: theme.palette.mode === 'dark' ? '#f59e0b' : '#b45309', fontSize: 18 }} />
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(180, 83, 9, 0.08)',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(180, 83, 9, 0.15)',
                  borderRadius: '20px',
                  px: 1,
                  py: 0.25
                }}>
                  <SecurityIcon sx={{ color: theme.palette.mode === 'dark' ? '#f59e0b' : '#b45309', fontSize: 10 }} />
                  <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? '#f59e0b' : '#b45309', fontWeight: 700, fontSize: '0.6rem' }}>Attention</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', mb: 0.25 }}>Warnings</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.8rem' }}>{totalWarnings}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4: Deployments */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  ? '0 12px 20px -10px rgba(99, 102, 241, 0.15), 0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
                  : '0 12px 20px -10px rgba(99, 102, 241, 0.15), 0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                borderColor: '#6366f1',
              }
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.75 }}>
                <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)', display: 'flex' }}>
                  <SchemaIcon sx={{ color: '#6366f1', fontSize: 18 }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <SyncIcon sx={{ color: 'text.secondary', fontSize: 12 }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.5px' }}>ACTIVE</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', mb: 0.25 }}>Deployments</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.8rem' }}>{totalDeployments}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grid Row 2: Charts Panel */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Left: CPU/Memory Line Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
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
            <CardContent sx={{ p: 2, pb: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.0rem' }}>
                  Cluster Health Timeline
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CircleIcon sx={{ color: '#3b82f6', fontSize: 6 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem' }}>CPU</Typography>
                  <CircleIcon sx={{ color: '#10b981', fontSize: 6 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem' }}>Memory</Typography>
                  <CircleIcon sx={{ color: '#8b5cf6', fontSize: 6 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem' }}>Network</Typography>
                </Box>
              </Box>
              {/* Line Chart */}
              <Box sx={{ flex: 1, width: '100%', minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={storeState.timelineData} margin={{ top: 10, right: 10, left: -45, bottom: 12 }}>
                    <XAxis dataKey="time" stroke={theme.palette.text.secondary} fontSize={10} tickLine={false} axisLine={false} dy={8} style={{ fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '8px',
                        color: theme.palette.text.primary,
                      }}
                    />
                    <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="network" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Radial Score Gauge */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
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
            <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.0rem', mb: 1 }}>
                Cluster Health Score
              </Typography>
              {/* Centered Circle progress ring */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', flex: 1, my: 0.5 }}>
                <style>{`
                  @keyframes drawProgressRing {
                    from { stroke-dashoffset: ${2 * Math.PI * 80}; }
                    to { stroke-dashoffset: ${2 * Math.PI * 80 * (1 - storeState.healthScore / 100)}; }
                  }
                `}</style>
                <svg width="130" height="130" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke={theme.palette.mode === 'dark' ? '#151926' : 'rgba(0,0,0,0.06)'} strokeWidth="12" />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={storeState.healthScore >= 90 ? '#10b981' : (storeState.healthScore >= 75 ? '#f59e0b' : '#ef4444')}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - storeState.healthScore / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                    style={{
                      animation: 'drawProgressRing 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                    }}
                  />
                </svg>
                <Box sx={{ position: 'absolute', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '2.1rem', lineHeight: 1.1 }}>
                    {storeState.healthScore}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: storeState.healthScore >= 90 ? '#10b981' : (storeState.healthScore >= 75 ? '#f59e0b' : '#ef4444'),
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      letterSpacing: '1px',
                      mt: 0.25
                    }}
                  >
                    {storeState.healthScore >= 90 ? 'EXCELLENT' : (storeState.healthScore >= 75 ? 'GOOD' : 'WARNING')}
                  </Typography>
                </Box>
              </Box>
              {/* Substats */}
              <Grid container spacing={1} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '10px',
                    p: 1.25,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, display: 'block', mb: 0.25, fontSize: '0.625rem', letterSpacing: '0.5px' }}>UPTIME</Typography>
                    <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '0.85rem' }}>{storeState.uptime}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '10px',
                    p: 1.25,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, display: 'block', mb: 0.25, fontSize: '0.625rem', letterSpacing: '0.5px' }}>LATENCY</Typography>
                    <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '0.85rem' }}>{storeState.latency}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Custom Metrics Explorer Section */}
      <Box sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <SchemaIcon sx={{ color: 'primary.main', fontSize: 22 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem', letterSpacing: '-0.3px' }}>
              Custom Prometheus-Style Metrics
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setWidgetModalOpen(true)}
            startIcon={<AddRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderColor: 'divider',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.725rem',
              textTransform: 'none',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              }
            }}
          >
            Add Widget
          </Button>
        </Box>

        {storeState.customWidgets && storeState.customWidgets.length > 0 ? (
          <Grid container spacing={2}>
            {storeState.customWidgets.map((w) => {
              const generateMockChartData = (metric) => {
                const data = [];
                for (let i = 0; i < 8; i++) {
                  let val = 20 + Math.random() * 50;
                  if (metric === 'cpu') val = 30 + Math.random() * 45;
                  else if (metric === 'memory') val = 50 + Math.random() * 30;
                  else if (metric === 'network') val = 15 + Math.random() * 60;
                  else if (metric === 'ingress') val = 100 + Math.random() * 400;
                  data.push({ time: `12:${i}0`, value: Math.round(val) });
                }
                return data;
              };

              const data = generateMockChartData(w.metric);
              const isDark = theme.palette.mode === 'dark';

              return (
                <Grid key={w.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '16px',
                      p: 2.25,
                      height: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isDark
                          ? `0 12px 20px -10px ${theme.palette.primary.main}26, 0 4px 20px 0 rgba(0,0,0,0.3)`
                          : `0 12px 20px -10px ${theme.palette.primary.main}14, 0 4px 20px 0 rgba(0,0,0,0.05)`,
                        borderColor: 'primary.main',
                        '& .delete-btn': { opacity: 1 },
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.8rem', letterSpacing: '-0.2px' }}>
                          {w.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600 }}>
                          {`${w.metric.toUpperCase()} • ${w.chartType.toUpperCase()}`}
                        </Typography>
                      </Box>
                      <IconButton
                        className="delete-btn"
                        size="small"
                        onClick={() => clusterStore.removeWidget(w.id)}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          color: 'text.secondary',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          '&:hover': { color: 'error.main' },
                        }}
                      >
                        <DeleteRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 1, width: '100%', height: '110px', mt: 1.5 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        {w.chartType === 'line' ? (
                          <LineChart data={data}>
                            <XAxis dataKey="time" hide />
                            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }} labelStyle={{ color: theme.palette.text.secondary }} itemStyle={{ color: theme.palette.text.primary }} />
                            <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
                          </LineChart>
                        ) : w.chartType === 'bar' ? (
                          <BarChart data={data}>
                            <XAxis dataKey="time" hide />
                            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }} />
                            <Bar dataKey="value" fill={theme.palette.primary.main} radius={[3, 3, 0, 0]} />
                          </BarChart>
                        ) : (
                          <AreaChart data={data}>
                            <defs>
                              <linearGradient id={`grad-${w.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" hide />
                            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }} />
                            <Area type="monotone" dataKey="value" stroke={theme.palette.primary.main} strokeWidth={2} fill={`url(#grad-${w.id})`} />
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              boxShadow: 'none',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 500, fontSize: '0.825rem' }}>
              No custom widgets added. Configure widgets to track custom metrics telemetry dynamically.
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => setWidgetModalOpen(true)}
              startIcon={<AddRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontWeight: 700,
                fontSize: '0.725rem',
                textTransform: 'none',
                borderRadius: '8px',
                backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.dark' }
              }}
            >
              Configure First Widget
            </Button>
          </Paper>
        )}
      </Box>

      {/* Grid Row 3: Active Workloads */}
      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.0rem' }}>
            Active Workloads
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: theme.palette.mode === 'dark' ? 'divider' : 'rgba(0, 0, 0, 0.12)',
                backgroundColor: 'background.paper',
                color: 'text.primary',
                borderRadius: '20px',
                px: 1.5,
                py: 0.25,
                fontWeight: 600,
                fontSize: '0.7rem',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'text.secondary',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              All Namespaces
            </Button>
            <Button
              variant="outlined"
              size="small"
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                borderColor: theme.palette.mode === 'dark' ? 'divider' : 'rgba(0, 0, 0, 0.12)',
                backgroundColor: 'background.paper',
                color: 'text.primary',
                borderRadius: '20px',
                px: 1.5,
                py: 0.25,
                fontWeight: 600,
                fontSize: '0.7rem',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'text.secondary',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              Filter by Status
            </Button>
          </Box>
        </Box>
        <Grid container spacing={2}>
          {storeState.deployments.map((dep) => {
            const depPods = storeState.pods.filter((p) => p.deployment === dep.name);
            const runningPods = depPods.filter((p) => p.status === 'RUNNING');
            
            // calculate average CPU percent
            let avgCpu = 0;
            if (runningPods.length > 0) {
              const totalCpu = runningPods.reduce((acc, p) => acc + (p.cpuPercent || 0), 0);
              avgCpu = Math.round(totalCpu / runningPods.length);
            }
            
            // calculate memory
            let memStr = '0 Mi';
            let memPercent = 0;
            if (runningPods.length > 0) {
              const memVal = runningPods.reduce((acc, p) => acc + (parseFloat(p.memory) || 0), 0);
              memPercent = Math.min(100, Math.round(memVal / 12)); // mock scale
              memStr = memVal >= 1024 ? `${(memVal / 1024).toFixed(1)} GB` : `${memVal} Mi`;
            }

            // status text
            const hasFailed = depPods.some((p) => p.status === 'FAILED');
            const hasPending = depPods.some((p) => p.status === 'PENDING');
            const statusText = hasFailed ? 'WARNING' : (hasPending ? 'WARNING' : 'RUNNING'); // Staging pending -> WARNING alert level

            const statusColors = {
              RUNNING: {
                bg: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(4, 120, 87, 0.08)',
                color: theme.palette.mode === 'dark' ? '#10b981' : '#047857',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(4, 120, 87, 0.15)'
              },
              WARNING: {
                bg: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(180, 83, 9, 0.08)',
                color: theme.palette.mode === 'dark' ? '#f59e0b' : '#b45309',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(180, 83, 9, 0.15)'
              }
            };
            const currentStatusColor = statusColors[statusText] || statusColors.RUNNING;

            let icon = <LayersIcon sx={{ fontSize: 16 }} />;
            let iconColor = '#3b82f6';
            let iconBg = 'rgba(59, 130, 246, 0.08)';
            let iconBorder = 'rgba(59, 130, 246, 0.12)';

            if (dep.name.includes('db') || dep.name.includes('redis') || dep.name.includes('sync')) {
              icon = <StorageRoundedIcon sx={{ fontSize: 16 }} />;
              iconColor = '#10b981';
              iconBg = 'rgba(16, 185, 129, 0.08)';
              iconBorder = 'rgba(16, 185, 129, 0.12)';
            } else if (dep.name.includes('auth')) {
              icon = <TerminalRoundedIcon sx={{ fontSize: 16 }} />;
              iconColor = '#a374ff';
              iconBg = 'rgba(163, 116, 255, 0.08)';
              iconBorder = 'rgba(163, 116, 255, 0.12)';
            }

            return (
              <Grid key={dep.name} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '16px',
                    p: 2,
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: '8px',
                          backgroundColor: iconBg,
                          border: `1px solid ${iconBorder}`,
                          color: iconColor,
                          display: 'flex',
                        }}
                      >
                        {icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem', lineHeight: 1.2 }}>
                          {dep.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                          <svg width="8" height="8" viewBox="0 0 100 100" style={{ fill: theme.palette.text.secondary }}>
                            <polygon points="50,0 93,25 93,75 50,100 7,75 7,25" />
                          </svg>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600 }}>
                            {dep.ns}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Chip
                      label={statusText}
                      size="small"
                      sx={{
                        backgroundColor: currentStatusColor.bg,
                        color: currentStatusColor.color,
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        height: '18px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: currentStatusColor.borderColor,
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem' }}>CPU Usage</Typography>
                        <Typography variant="body2" sx={{ color: statusText === 'WARNING' ? 'error.main' : 'text.primary', fontWeight: 700, fontSize: '0.7rem' }}>{statusText === 'WARNING' ? '92%' : `${avgCpu}%`}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={statusText === 'WARNING' ? 92 : avgCpu}
                        sx={{
                          height: 4,
                          borderRadius: 3,
                          backgroundColor: 'action.selected',
                          '& .MuiLinearProgress-bar': { backgroundColor: statusText === 'WARNING' ? '#ef4444' : 'primary.main', borderRadius: 3 },
                        }}
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem' }}>Memory</Typography>
                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.7rem' }}>{statusText === 'WARNING' ? '2.1 GB' : memStr}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={statusText === 'WARNING' ? 40 : memPercent}
                        sx={{
                          height: 4,
                          borderRadius: 3,
                          backgroundColor: 'action.selected',
                          '& .MuiLinearProgress-bar': { backgroundColor: '#10b981', borderRadius: 3 },
                        }}
                      />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Grid Row 4: Cluster Node Heatmap Grid */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.0rem', mb: 2 }}>
          Cluster Nodes Capacity & Allocations
        </Typography>
        <Grid container spacing={2}>
          {storeState.nodes.map((node) => {
            // Compute slots dynamically based on pods assigned to this node
            const nodePods = storeState.pods.filter(p => p.node === node.name);
            
            // Construct slots array of size 12: 1 for RUNNING, 2 for PENDING, 3 for FAILED, 0 for empty
            const slots = Array(12).fill(0);
            if (node.status === 'Online') {
              nodePods.forEach((pod, index) => {
                if (index < 12) {
                  if (pod.status === 'RUNNING') slots[index] = 1;
                  else if (pod.status === 'PENDING') slots[index] = 2;
                  else if (pod.status === 'FAILED') slots[index] = 3;
                }
              });
            }

            const activeSlotsCount = slots.filter(s => s !== 0).length;

            // Calculate node stats based on pod load
            let currentCpu = node.cpu;
            let currentMem = node.mem;
            if (node.status === 'Online') {
              // Adjust slightly based on total active slots to show dynamic cpu load
              const loadFactor = activeSlotsCount / 12;
              currentCpu = Math.min(99, Math.round((node.cpu * 0.4) + (loadFactor * 60)));
              currentMem = Math.min(99, Math.round((node.mem * 0.5) + (loadFactor * 50)));
            }

            return (
              <Grid key={node.name} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '16px',
                    p: 2,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.palette.mode === 'dark' 
                        ? '0 12px 20px -10px rgba(59, 130, 246, 0.15), 0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
                        : '0 12px 20px -10px rgba(59, 130, 246, 0.1), 0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  {/* Node Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.825rem' }}>
                          {node.name}
                        </Typography>
                        {node.role === 'Worker' && node.status === 'Online' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => clusterStore.drainNode(node.name)}
                            sx={{
                              fontSize: '0.6rem',
                              py: 0,
                              px: 0.75,
                              height: '18px',
                              minWidth: 'auto',
                              textTransform: 'none',
                              fontWeight: 800,
                              borderColor: 'rgba(239, 68, 68, 0.3)',
                              color: 'error.main',
                              borderRadius: '4px',
                              '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                borderColor: 'error.main',
                              }
                            }}
                          >
                            Drain
                          </Button>
                        )}
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600 }}>
                        {`${node.role} • ${node.ip} • ${node.status}`}
                      </Typography>
                    </Box>
                    <Chip
                      label={node.status === 'Offline' ? 'OFFLINE' : node.status === 'Draining' ? 'DRAINING' : `${currentCpu}% CPU`}
                      size="small"
                      sx={{
                        backgroundColor: node.status === 'Offline' ? 'rgba(239, 68, 68, 0.08)' : (node.status === 'Draining' ? 'rgba(245, 158, 11, 0.08)' : (currentCpu > 70 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(59, 130, 246, 0.08)')),
                        color: node.status === 'Offline' ? 'error.main' : (node.status === 'Draining' ? '#f59e0b' : (currentCpu > 70 ? 'error.main' : 'primary.main')),
                        fontSize: '0.625rem',
                        fontWeight: 800,
                        height: '18px',
                      }}
                    />
                  </Box>

                  {/* Progress bars for CPU/Mem */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 700 }}>Memory allocation</Typography>
                      <Typography variant="caption" sx={{ color: 'text.primary', fontSize: '0.65rem', fontWeight: 700 }}>{node.status === 'Offline' ? '0' : currentMem}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={node.status === 'Offline' ? 0 : currentMem}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: 'action.selected',
                        '& .MuiLinearProgress-bar': { backgroundColor: currentMem > 80 ? '#ef4444' : '#10b981', borderRadius: 2 },
                      }}
                    />
                  </Box>

                  {/* Grid Slots Title */}
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.625rem', display: 'block', mb: 1, letterSpacing: '0.5px' }}>
                    POD ALLOCATIONS ({node.status === 'Offline' ? 0 : activeSlotsCount} / 12 SLOTS)
                  </Typography>

                  {/* Grid slots display */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0.75 }}>
                    {slots.map((slot, i) => {
                      let bg = 'divider';
                      let hoverText = 'Empty Slot';
                      if (slot === 1) { bg = '#10b981'; hoverText = 'Running Pod'; }
                      else if (slot === 2) { bg = '#f59e0b'; hoverText = 'Warning Pod'; }
                      else if (slot === 3) { bg = '#ef4444'; hoverText = 'Failed Pod'; }
                      
                      return (
                        <Box
                          key={i}
                          title={hoverText}
                          sx={{
                            height: 14,
                            borderRadius: '3px',
                            backgroundColor: bg === 'divider' ? 'action.selected' : bg,
                            opacity: bg === 'divider' ? 0.4 : 0.85,
                            transition: 'transform 0.2s ease, opacity 0.2s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'scale(1.15)',
                              opacity: 1,
                            }
                          }}
                        />
                      );
                    })}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Add Custom Metric Widget Dialog */}
      <Dialog
        open={widgetModalOpen}
        onClose={() => setWidgetModalOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '16px',
            color: 'text.primary',
            width: '400px',
            p: 1.5
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: 'text.primary' }}>
            Add Custom Metrics Widget
          </Typography>
          <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => setWidgetModalOpen(false)}>
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 500, mb: 1 }}>
            Configure a new Prometheus-style telemetry card to monitor custom cluster resources dynamically.
          </Typography>

          <TextField
            label="Widget Title"
            variant="outlined"
            fullWidth
            size="small"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            slotProps={{
              inputLabel: {
                style: { fontSize: '0.825rem', fontWeight: 600 }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                fontSize: '0.825rem',
              }
            }}
          />

          <FormControl fullWidth size="small">
            <InputLabel id="metric-select-label" sx={{ fontSize: '0.825rem', fontWeight: 600 }}>Metric Source</InputLabel>
            <Select
              labelId="metric-select-label"
              id="metric-select"
              value={newMetric}
              label="Metric Source"
              onChange={(e) => {
                const val = e.target.value;
                setNewMetric(val);
                // Auto update title placeholder if user hasn't typed a custom one
                if (newTitle.startsWith('Custom ') || newTitle === '') {
                  setNewTitle(`Custom ${val.toUpperCase()} Metric`);
                }
              }}
              sx={{ borderRadius: '8px', fontSize: '0.825rem' }}
            >
              <MenuItem value="cpu" sx={{ fontSize: '0.825rem' }}>CPU Usage (%)</MenuItem>
              <MenuItem value="memory" sx={{ fontSize: '0.825rem' }}>Memory Allocation (%)</MenuItem>
              <MenuItem value="network" sx={{ fontSize: '0.825rem' }}>Network Latency (ms)</MenuItem>
              <MenuItem value="ingress" sx={{ fontSize: '0.825rem' }}>Ingress Requests/sec</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="chart-type-select-label" sx={{ fontSize: '0.825rem', fontWeight: 600 }}>Chart Type</InputLabel>
            <Select
              labelId="chart-type-select-label"
              id="chart-type-select"
              value={newChartType}
              label="Chart Type"
              onChange={(e) => setNewChartType(e.target.value)}
              sx={{ borderRadius: '8px', fontSize: '0.825rem' }}
            >
              <MenuItem value="area" sx={{ fontSize: '0.825rem' }}>Area Chart</MenuItem>
              <MenuItem value="line" sx={{ fontSize: '0.825rem' }}>Line Chart</MenuItem>
              <MenuItem value="bar" sx={{ fontSize: '0.825rem' }}>Bar Chart</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1 }}>
          <Button
            onClick={() => setWidgetModalOpen(false)}
            sx={{
              color: 'text.secondary',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.725rem'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddWidget}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: 'primary.main',
              color: '#ffffff',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.725rem',
              borderRadius: '8px',
              px: 2,
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Add Widget
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}