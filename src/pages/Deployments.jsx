import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  IconButton,
  Select,
  FormControl,
  MenuItem,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  useTheme,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CircleIcon from '@mui/icons-material/Circle';
import HeightRoundedIcon from '@mui/icons-material/HeightRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import SettingsBackupRestoreRoundedIcon from '@mui/icons-material/SettingsBackupRestoreRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { useClusterStore, clusterStore } from '../store/clusterStore';

export default function Deployments() {
  const theme = useTheme();
  const [storeState] = useClusterStore();
  const deployments = storeState.deployments;
  const [searchQuery, setSearchQuery] = useState('');
  const [cluster, setCluster] = useState('production-us-east-1');
  const [sortBy, setSortBy] = useState('recent');
  
  // Scale Dialog States
  const [scaleDialogOpen, setScaleDialogOpen] = useState(false);
  const [scalingDep, setScalingDep] = useState(null);
  const [scaleValue, setScaleValue] = useState(1);

  // More Vert Menu States
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeDep, setActiveDep] = useState(null);

  const handleMenuOpen = (e, dep) => {
    setAnchorEl(e.currentTarget);
    setActiveDep(dep);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveDep(null);
  };

  const handleOpenScale = (dep) => {
    setScalingDep(dep);
    setScaleValue(dep.replicasTotal);
    setScaleDialogOpen(true);
    handleMenuClose();
  };

  const handleApplyScale = () => {
    if (scalingDep) {
      clusterStore.scaleDeployment(scalingDep.name, scaleValue);
    }
    setScaleDialogOpen(false);
    setScalingDep(null);
  };

  // YAML Dialog States
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);
  const [yamlValue, setYamlValue] = useState('');
  const [yamlError, setYamlError] = useState('');

  const getYamlStr = (dep) => {
    if (!dep) return '';
    return dep.yaml || `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${dep.name}
  namespace: ${dep.ns}
spec:
  replicas: ${dep.replicasTotal}
  selector:
    matchLabels:
      app: ${dep.name}
  template:
    metadata:
      labels:
        app: ${dep.name}
    spec:
      containers:
      - name: container
        image: nginx:alpine
        resources:
          limits:
            cpu: ${dep.cpu}
            memory: ${dep.memory}`;
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
    if (activeDep) {
      setYamlValue(getYamlStr(activeDep));
      setYamlDialogOpen(true);
    }
    setAnchorEl(null);
  };

  const handleApplyYaml = () => {
    if (activeDep) {
      clusterStore.updateResourceYaml('deployment', activeDep.name, yamlValue);
      setYamlDialogOpen(false);
      setActiveDep(null);
    }
  };

  const handleRestart = (dep) => {
    clusterStore.restartDeployment(dep.name);
    handleMenuClose();
  };

  const handleRollback = (dep) => {
    alert(`Rollback initiated for deployment: ${dep.name}`);
    handleMenuClose();
  };

  return (
    <Box sx={{ p: 3, backgroundColor: 'transparent', width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      
      {/* Keyframe animation for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Title block & top controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, fontSize: '1.6rem', letterSpacing: '-0.5px' }}>
            Deployments
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '0.825rem', fontWeight: 500 }}>
            Manage workloads, rollout strategies, and replica scaling across your cluster.
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.725rem',
            textTransform: 'none',
            borderRadius: '8px',
            px: 2,
            py: 0.75,
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          }}
        >
          New Deployment
        </Button>
      </Box>

      {/* Row 1 Grid: 4 Metric Cards */}
      <Grid container spacing={2}>
        {/* Card 1 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              p: 2,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 12px 20px -10px rgba(59, 130, 246, 0.15), 0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
                  : '0 12px 20px -10px rgba(59, 130, 246, 0.1), 0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                borderColor: 'primary.main',
              },
              '&:hover .watermark-icon': {
                transform: 'scale(1.15) translateY(-2px)',
                opacity: theme.palette.mode === 'dark' ? 0.8 : 0.9,
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem' }}>Active Deployments</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.5, fontSize: '1.8rem' }}>18</Typography>
              </Box>
              <AccountTreeRoundedIcon className="watermark-icon" sx={{ color: 'primary.main', opacity: theme.palette.mode === 'dark' ? 0.6 : 0.7, fontSize: 36, position: 'absolute', right: 12, top: 12, transition: 'all 0.3s ease' }} />
            </Box>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#10b981' : '#047857', fontSize: '0.675rem', fontWeight: 700, mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CircleIcon sx={{ fontSize: 6, color: theme.palette.mode === 'dark' ? '#10b981' : '#047857' }} /> All systems operational
            </Typography>
          </Card>
        </Grid>

        {/* Card 2 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              p: 2,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 12px 20px -10px rgba(239, 68, 68, 0.15), 0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
                  : '0 12px 20px -10px rgba(239, 68, 68, 0.1), 0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                borderColor: 'error.main',
              },
              '&:hover .watermark-icon': {
                transform: 'scale(1.15) rotate(10deg)',
                opacity: theme.palette.mode === 'dark' ? 0.8 : 0.9,
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem' }}>Failed Deployments</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'error.main', mt: 0.5, fontSize: '1.8rem' }}>0</Typography>
              </Box>
              <ErrorOutlineRoundedIcon className="watermark-icon" sx={{ color: 'error.main', opacity: theme.palette.mode === 'dark' ? 0.6 : 0.7, fontSize: 36, position: 'absolute', right: 12, top: 12, transition: 'all 0.3s ease' }} />
            </Box>
            <Chip
              label="-100% from yesterday"
              size="small"
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(4, 120, 87, 0.08)',
                color: theme.palette.mode === 'dark' ? '#10b981' : '#047857',
                fontSize: '0.625rem',
                fontWeight: 800,
                height: '18px',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(4, 120, 87, 0.15)',
                mt: 1.5
              }}
            />
          </Card>
        </Grid>

        {/* Card 3 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              p: 2,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 12px 20px -10px rgba(245, 158, 11, 0.15), 0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
                  : '0 12px 20px -10px rgba(245, 158, 11, 0.1), 0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                borderColor: '#f59e0b',
              },
              '&:hover .watermark-icon': {
                transform: 'rotate(180deg) scale(1.15)',
                opacity: theme.palette.mode === 'dark' ? 0.7 : 0.75,
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem' }}>Rollouts Today</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.5, fontSize: '1.8rem' }}>12</Typography>
              </Box>
              <AutorenewRoundedIcon className="watermark-icon" sx={{ color: 'text.primary', opacity: theme.palette.mode === 'dark' ? 0.5 : 0.55, fontSize: 36, position: 'absolute', right: 12, top: 12, transition: 'all 0.4s ease' }} />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.675rem', fontWeight: 600, mt: 1.5 }}>
              Last rollout 14m ago
            </Typography>
          </Card>
        </Grid>

        {/* Card 4 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              p: 2,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 12px 20px -10px rgba(59, 130, 246, 0.15), 0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
                  : '0 12px 20px -10px rgba(59, 130, 246, 0.1), 0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                borderColor: 'primary.main',
              },
              '&:hover .watermark-icon': {
                transform: 'translateY(-3px) scale(1.15)',
                opacity: theme.palette.mode === 'dark' ? 0.7 : 0.75,
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem' }}>Average Replicas</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.5, fontSize: '1.8rem' }}>4.2</Typography>
              </Box>
              <Box className="watermark-icon" sx={{ display: 'flex', gap: '3px', position: 'absolute', right: 16, top: 16, opacity: theme.palette.mode === 'dark' ? 0.5 : 0.55, transition: 'all 0.3s ease' }}>
                <Box sx={{ width: 4, height: 20, backgroundColor: 'text.primary', borderRadius: 1 }} />
                <Box sx={{ width: 4, height: 26, backgroundColor: 'text.primary', borderRadius: 1 }} />
                <Box sx={{ width: 4, height: 16, backgroundColor: 'text.primary', borderRadius: 1 }} />
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#10b981' : '#047857', fontSize: '0.675rem', fontWeight: 700, mt: 1.5 }}>
              Optimized for cost
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Active Rollout Stepper Card */}
      <Card
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '16px',
          p: 2.5,
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
        
        {/* Header line of Card */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '0.9rem' }}>
              Active Rollout: <span style={{ color: '#3b82f6' }}>auth-service-v2.4.0</span>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.675rem', fontWeight: 600 }}>
              RollingUpdate Strategy • 25% max-surge • 25% max-unavailable
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CircleIcon sx={{ color: '#3b82f6', fontSize: 8 }} />
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.725rem' }}>
                In Progress (75%)
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: 'error.main',
                fontWeight: 800,
                fontSize: '0.725rem',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Abort Rollout
            </Typography>
          </Box>
        </Box>

        {/* Stepper block */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', position: 'relative', px: 2, py: 1 }}>
          
          {/* Background Connecting Line */}
          <Box sx={{ position: 'absolute', top: '24px', left: '6%', right: '6%', height: '2px', backgroundColor: 'divider', zIndex: 0 }} />
          
          {/* Active Progress Line */}
          <Box sx={{ position: 'absolute', top: '24px', left: '6%', width: '44%', height: '2px', backgroundColor: theme.palette.mode === 'dark' ? '#10b981' : '#047857', zIndex: 0 }} />
          
          {/* Active Connecting Line to step 3 */}
          <Box sx={{ position: 'absolute', top: '24px', left: '50%', width: '22%', height: '2px', backgroundColor: '#3b82f6', zIndex: 0 }} />

          {/* Step 1 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, textAlign: 'center', width: '16%' }}>
            <Box sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(4, 120, 87, 0.08)',
              border: '2.5px solid',
              borderColor: theme.palette.mode === 'dark' ? '#10b981' : '#047857',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1
            }}>
              <CheckCircleRoundedIcon sx={{ color: theme.palette.mode === 'dark' ? '#10b981' : '#047857', fontSize: 16 }} />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '0.725rem' }}>Image Pull</Typography>
            <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? '#10b981' : '#047857', fontSize: '0.625rem', fontWeight: 800, mt: 0.25 }}>Success</Typography>
          </Box>

          {/* Step 2 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, textAlign: 'center', width: '16%' }}>
            <Box sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(4, 120, 87, 0.08)',
              border: '2.5px solid',
              borderColor: theme.palette.mode === 'dark' ? '#10b981' : '#047857',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1
            }}>
              <CheckCircleRoundedIcon sx={{ color: theme.palette.mode === 'dark' ? '#10b981' : '#047857', fontSize: 16 }} />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '0.725rem' }}>Pre-deployment</Typography>
            <Typography variant="caption" sx={{ color: theme.palette.mode === 'dark' ? '#10b981' : '#047857', fontSize: '0.625rem', fontWeight: 800, mt: 0.25 }}>Checks passed</Typography>
          </Box>

          {/* Step 3 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, textAlign: 'center', width: '16%' }}>
            <Box sx={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '2.5px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }}>
              <AutorenewRoundedIcon sx={{ color: '#3b82f6', fontSize: 16, animation: 'spin 3s linear infinite' }} />
            </Box>
            <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 800, fontSize: '0.725rem' }}>Rolling Update</Typography>
            <Typography variant="caption" sx={{ color: 'text.primary', fontSize: '0.625rem', fontWeight: 700, mt: 0.25 }}>3/4 Replicas ready</Typography>
          </Box>

          {/* Step 4 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, textAlign: 'center', width: '16%' }}>
            <Box sx={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'background.paper', border: '2px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <MonitorHeartRoundedIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem' }}>Health Checks</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.625rem', fontWeight: 600, mt: 0.25 }}>Pending</Typography>
          </Box>

          {/* Step 5 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, textAlign: 'center', width: '16%' }}>
            <Box sx={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'background.paper', border: '2px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <FlagRoundedIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.725rem' }}>Complete</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.625rem', fontWeight: 600, mt: 0.25 }}>Waiting...</Typography>
          </Box>

        </Box>
      </Card>

      {/* Row 3: All Deployments Header and Cards */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 1, mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem', letterSpacing: '-0.3px' }}>
          All Deployments
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem' }}>Sort by:</Typography>
          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{
                backgroundColor: 'background.paper',
                color: 'text.primary',
                fontWeight: 700,
                fontSize: '0.7rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
                height: '28px',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': { py: 0.5, pr: 3, display: 'flex', alignItems: 'center', gap: 1 }
              }}
            >
              <MenuItem value="recent" sx={{ fontSize: '0.7rem' }}>Recent Activity</MenuItem>
              <MenuItem value="name" sx={{ fontSize: '0.7rem' }}>Name</MenuItem>
              <MenuItem value="replicas" sx={{ fontSize: '0.7rem' }}>Replicas Count</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Deployments Grid */}
      <Grid container spacing={2}>
        {deployments.map((dep) => (
          <Grid key={dep.name} size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '16px',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
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
              
              {/* Card Header section */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '8px',
                      backgroundColor: dep.iconBg,
                      border: `1px solid ${dep.iconBorder}`,
                      color: 'inherit',
                      display: 'flex',
                    }}
                  >
                    {dep.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.85rem', lineHeight: 1.2 }}>
                      {dep.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600 }}>
                      {`${dep.ns} • ${dep.strategy}`}
                    </Typography>
                  </Box>
                </Box>

                <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={(e) => handleMenuOpen(e, dep)}>
                  <MoreVertIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>

              {/* Stats part */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.675rem' }}>
                    Replicas
                  </Typography>
                  <Typography variant="body2" sx={{ color: dep.status === 'Ready' ? '#10b981' : '#3b82f6', fontWeight: 800, fontSize: '0.7rem' }}>
                    {`${dep.replicasReady} / ${dep.replicasTotal} `}
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'text.secondary' }}>{dep.status}</span>
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(dep.replicasReady / dep.replicasTotal) * 100}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: 'divider',
                    '& .MuiLinearProgress-bar': { backgroundColor: dep.progressColor, borderRadius: 2 },
                  }}
                />
              </Box>

              {/* Specs part */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.625rem' }}>
                  {dep.cpu}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.625rem' }}>
                  {dep.memory}
                </Typography>
              </Box>

              {/* Footer controls */}
              <Grid container spacing={1} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 4 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    onClick={() => handleOpenScale(dep)}
                    startIcon={<HeightRoundedIcon sx={{ fontSize: 12, transform: 'rotate(90deg)' }} />}
                    sx={{
                      borderColor: 'divider',
                      backgroundColor: 'transparent',
                      color: 'text.primary',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      py: 0.5,
                      px: 0.5,
                      textTransform: 'none',
                      borderRadius: '6px',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    Scale
                  </Button>
                </Grid>
                
                <Grid size={{ xs: 4 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    onClick={() => handleRestart(dep)}
                    startIcon={<SyncRoundedIcon sx={{ fontSize: 12 }} />}
                    sx={{
                      borderColor: 'divider',
                      backgroundColor: 'transparent',
                      color: 'text.primary',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      py: 0.5,
                      px: 0.5,
                      textTransform: 'none',
                      borderRadius: '6px',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    Restart
                  </Button>
                </Grid>

                <Grid size={{ xs: 4 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    onClick={() => handleRollback(dep)}
                    startIcon={<SettingsBackupRestoreRoundedIcon sx={{ fontSize: 12 }} />}
                    sx={{
                      borderColor: 'divider',
                      backgroundColor: 'transparent',
                      color: 'text.primary',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      py: 0.5,
                      px: 0.5,
                      textTransform: 'none',
                      borderRadius: '6px',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    Rollback
                  </Button>
                </Grid>
              </Grid>

            </Card>
          </Grid>
        ))}
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
        <MenuItem onClick={handleEditYamlOpen} sx={{ gap: 1.5, fontSize: '0.8rem', fontWeight: 600 }}>
          <DescriptionRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          Edit YAML
        </MenuItem>
        <MenuItem onClick={() => handleOpenScale(activeDep)} sx={{ gap: 1.5, fontSize: '0.8rem', fontWeight: 600 }}>
          <HeightRoundedIcon sx={{ fontSize: 14, color: '#3b82f6', transform: 'rotate(90deg)' }} />
          Scale Replicas
        </MenuItem>
        <MenuItem onClick={() => handleRestart(activeDep)} sx={{ gap: 1.5, fontSize: '0.8rem', fontWeight: 600 }}>
          <SyncRoundedIcon sx={{ fontSize: 14, color: theme.palette.mode === 'dark' ? '#10b981' : '#047857' }} />
          Rolling Restart
        </MenuItem>
        <MenuItem onClick={() => handleRollback(activeDep)} sx={{ gap: 1.5, fontSize: '0.8rem', fontWeight: 600 }}>
          <SettingsBackupRestoreRoundedIcon sx={{ fontSize: 14, color: theme.palette.mode === 'dark' ? '#f59e0b' : '#b45309' }} />
          Rollback
        </MenuItem>
      </Menu>

      {/* Scale Dialog */}
      <Dialog
        open={scaleDialogOpen}
        onClose={() => setScaleDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '16px',
            color: 'text.primary',
            width: '380px',
            p: 1.5
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary' }}>
            Scale Workload
          </Typography>
          <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => setScaleDialogOpen(false)}>
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3.5, fontSize: '0.75rem', fontWeight: 500 }}>
            Adjust replica count for <span style={{ color: '#3b82f6', fontWeight: 700 }}>{scalingDep?.name}</span>.
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={scaleValue}
              onChange={(e, val) => setScaleValue(val)}
              min={0}
              max={12}
              step={1}
              marks
              valueLabelDisplay="on"
              sx={{
                color: '#3b82f6',
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#3b82f6',
                  fontSize: '0.7rem',
                  fontWeight: 700
                }
              }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1 }}>
          <Button
            onClick={() => setScaleDialogOpen(false)}
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
            onClick={handleApplyScale}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '0.725rem',
              borderRadius: '8px',
              px: 2,
              '&:hover': {
                backgroundColor: '#2563eb'
              }
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

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
          Edit Deployment Manifest: {activeDep?.name}
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
