import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  InputBase,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Button,
  Avatar,
  AvatarGroup,
  Grid,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';

// Mock Pods Data from Target Mockup
const initialPods = [
  { name: 'api-gateway-7f8d5c9b', ns: 'production', status: 'RUNNING', sparkPath: 'M0,12 Q15,4 30,16 T60,6 T80,10', selected: true },
  { name: 'auth-service-v2-k9s1', ns: 'production', status: 'RUNNING', sparkPath: 'M0,15 Q15,10 30,18 T60,12 T80,8', selected: false },
  { name: 'redis-master-0', ns: 'data-tier', status: 'RUNNING', sparkPath: 'M0,8 Q15,16 30,6 T60,14 T80,12', selected: false },
  { name: 'payment-processor-temp', ns: 'staging', status: 'PENDING', sparkPath: 'M0,12 Q15,18 30,10 T60,18 T80,14', selected: false },
  { name: 'worker-node-01', ns: 'jobs', status: 'RUNNING', sparkPath: 'M0,10 Q15,8 30,14 T60,8 T80,15', selected: false }
];

// Reference Logs from Target Mockup
const initialLogs = [
  '2023-11-24 14:22:01.452 INFO Incoming request from 192.168.1.1: GET /v1/health',
  '2023-11-24 14:22:01.458 SUCCESS Auth check passed for user_8291. Token validated in 6ms.',
  '2023-11-24 14:22:02.182 WARN Redis connection latency detected: 142ms. Threshold exceeded.',
  '2023-11-24 14:22:02.115 INFO Auto-scaling group prod-api-asg triggered scale-up event.',
  '2023-11-24 14:22:03.441 ERROR Failed to persist session for user_8291: ECONNRESET',
  '    at /app/node_modules/redis/client.js:142:11',
  '    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)',
  '2023-11-24 14:22:04.002 INFO Re-establishing Redis connection pool...',
  '2023-11-24 14:22:04.562 SUCCESS Connection pool recovered. 10 healthy nodes available.',
  '2023-11-24 14:22:05.112 INFO Incoming request from 172.16.0.4: POST /v1/orders',
  '2023-11-24 14:22:05.155 INFO Order processing started for ORDER-77291',
  '2023-11-24 14:22:05.890 INFO Notifying logistics provider API...',
  '2023-11-24 14:22:06.121 SUCCESS Order ORDER-77291 confirmed and dispatched.'
];

const logPool = [
  'INFO Incoming request from 192.168.1.20: GET /v1/status',
  'SUCCESS Auth cache hit for user_4910. Duration 1ms.',
  'INFO Queue callback payload dispatched to subscriber worker-node-01',
  'WARN Retry count exceeded on payload processing. Attempt 3 of 5.',
  'INFO GC heap compaction initiated. Frees 240 MB.',
  'SUCCESS Log rotation process finished. Deleted 12 uncompressed descriptors.',
  'ERROR File system write permission rejected on path /var/log/app: EACCES',
  'INFO Connection pool recycled. Available slots: 2000.',
];

export default function Logs() {
  const theme = useTheme();
  const [pods, setPods] = useState(initialPods);
  const [selectedPod, setSelectedPod] = useState(initialPods[0]);
  const [logs, setLogs] = useState(initialLogs);
  const [podSearch, setPodSearch] = useState('');
  const [logSearch, setLogSearch] = useState('');
  const [liveStream, setLiveStream] = useState(true);
  const [cluster, setCluster] = useState('production-us-east-1');
  const consoleEndRef = useRef(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Simulate log streaming
  useEffect(() => {
    let interval = null;
    if (liveStream) {
      interval = setInterval(() => {
        const randomPool = logPool[Math.floor(Math.random() * logPool.length)];
        const now = new Date();
        // format date as: YYYY-MM-DD HH:MM:SS.SSS
        const dateStr = now.toISOString().replace('T', ' ').substring(0, 23);
        setLogs((prev) => [...prev, `${dateStr} ${randomPool}`]);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [liveStream]);

  // Select a pod from list
  const handleSelectPod = (pod) => {
    const updated = pods.map((p) => ({ ...p, selected: p.name === pod.name }));
    setPods(updated);
    setSelectedPod(pod);
    // Refresh log console to initial logs for simulated tail
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 23);
    setLogs([
      `${dateStr} INFO Initialized tail connection to pod namespace '${pod.ns}'`,
      `${dateStr} SUCCESS Attached std-out reader descriptors for pod '${pod.name}'`,
      ...initialLogs
    ]);
  };

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

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleDownloadLogs = () => {
    const text = logs.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPod.name}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtered pods based on search input
  const filteredPods = pods.filter(pod =>
    pod.name.toLowerCase().includes(podSearch.toLowerCase()) ||
    pod.ns.toLowerCase().includes(podSearch.toLowerCase())
  );

  // Filtered logs inside terminal
  const filteredLogs = logs.filter(log =>
    log.toLowerCase().includes(logSearch.toLowerCase())
  );

  const highlightText = (text, highlight) => {
    if (!highlight || !highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} style={{ backgroundColor: '#f59e0b', color: '#000000', padding: '0 2px', borderRadius: '2px', fontWeight: 700 }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // High-fidelity Log line parser
  const renderLogLine = (line, index) => {
    const isDark = theme.palette.mode === 'dark';
    
    const colors = {
      timestamp: isDark ? '#64748b' : '#64748b',
      defaultText: isDark ? '#cbd5e1' : '#334155',
      traceText: isDark ? '#64748b' : '#475569',
      info: '#3b82f6',
      success: isDark ? '#10b981' : '#059669',
      warn: isDark ? '#f59e0b' : '#d97706',
      error: isDark ? '#ef4444' : '#dc2626',
      method: isDark ? '#06b6d4' : '#0891b2',
      user: isDark ? '#f8fafc' : '#0f172a',
      order: isDark ? '#10b981' : '#059669',
      econn: isDark ? '#ef4444' : '#dc2626',
      latency: isDark ? '#f59e0b' : '#d97706',
    };

    if (line.trim().startsWith('at ')) {
      return (
        <Box key={index} sx={{ color: colors.traceText, pl: 6, fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: 1.6 }}>
          {highlightText(line, logSearch)}
        </Box>
      );
    }

    const match = line.match(/^(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3})\s(INFO|SUCCESS|WARN|ERROR)\s(.*)$/);
    if (!match) {
      return (
        <Box key={index} sx={{ color: colors.defaultText, fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: 1.6 }}>
          {highlightText(line, logSearch)}
        </Box>
      );
    }

    const [_, timestamp, level, message] = match;

    let levelColor = colors.defaultText;
    if (level === 'INFO') levelColor = colors.info;
    else if (level === 'SUCCESS') levelColor = colors.success;
    else if (level === 'WARN') levelColor = colors.warn;
    else if (level === 'ERROR') levelColor = colors.error;

    const renderMessage = (msg) => {
      const parts = [];
      const regex = /(GET\s\/\S+|POST\s\/\S+|user_\d+|ORDER-\d+|ECONNRESET|\d+ms)/g;
      let matchArr;
      let lastIndex = 0;

      while ((matchArr = regex.exec(msg)) !== null) {
        const matchIndex = matchArr.index;
        const matchedStr = matchArr[0];

        if (matchIndex > lastIndex) {
          parts.push(highlightText(msg.substring(lastIndex, matchIndex), logSearch));
        }

        if (matchedStr.startsWith('GET') || matchedStr.startsWith('POST')) {
          parts.push(
            <span key={matchIndex} style={{ color: colors.method, fontWeight: 600 }}>
              {highlightText(matchedStr, logSearch)}
            </span>
          );
        } else if (matchedStr.startsWith('user_')) {
          parts.push(
            <span key={matchIndex} style={{ color: colors.user, fontWeight: 700 }}>
              {highlightText(matchedStr, logSearch)}
            </span>
          );
        } else if (matchedStr.startsWith('ORDER-')) {
          parts.push(
            <span key={matchIndex} style={{ color: colors.order, fontWeight: 700 }}>
              {highlightText(matchedStr, logSearch)}
            </span>
          );
        } else if (matchedStr === 'ECONNRESET') {
          parts.push(
            <span key={matchIndex} style={{ color: colors.econn, fontWeight: 700 }}>
              {highlightText(matchedStr, logSearch)}
            </span>
          );
        } else if (matchedStr.endsWith('ms')) {
          parts.push(
            <span key={matchIndex} style={{ color: colors.latency, fontWeight: 700 }}>
              {highlightText(matchedStr, logSearch)}
            </span>
          );
        }

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < msg.length) {
        parts.push(highlightText(msg.substring(lastIndex), logSearch));
      }

      return parts.length > 0 ? parts : highlightText(msg, logSearch);
    };

    return (
      <Box key={index} sx={{ display: 'flex', fontFamily: 'monospace', fontSize: '0.75rem', py: 0.15, px: 2, '&:hover': { backgroundColor: 'action.hover' } }}>
        <Typography component="span" sx={{ color: colors.timestamp, fontSize: 'inherit', fontFamily: 'inherit', minWidth: '155px', flexShrink: 0 }}>
          {highlightText(timestamp, logSearch)}
        </Typography>
        <Typography component="span" sx={{ color: levelColor, fontWeight: 700, fontSize: 'inherit', fontFamily: 'inherit', minWidth: '65px', flexShrink: 0 }}>
          {highlightText(level, logSearch)}
        </Typography>
        <Typography component="span" sx={{ color: colors.defaultText, fontSize: 'inherit', fontFamily: 'inherit', flexGrow: 1, whiteSpace: 'pre-wrap' }}>
          {renderMessage(message)}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: 'transparent', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Dynamic blink caret animation style */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Header bar controls */}
      <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TerminalRoundedIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#3b82f6', fontSize: '1.1rem', letterSpacing: '-0.3px' }}>
              Live Logs Explorer
            </Typography>
          </Box>

          <FormControl size="small">
            <Select
              value={cluster}
              onChange={(e) => setCluster(e.target.value)}
              sx={{
                backgroundColor: 'background.paper',
                color: theme.palette.mode === 'dark' ? '#10b981' : '#059669',
                fontWeight: 600,
                fontSize: '0.725rem',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: 'divider',
                height: '28px',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': { py: 0.5, pr: 3, display: 'flex', alignItems: 'center', gap: 1 }
              }}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CircleIcon sx={{ color: theme.palette.mode === 'dark' ? '#10b981' : '#059669', fontSize: 6 }} />
                  {value}
                </Box>
              )}
            >
              <MenuItem value="production-us-east-1" sx={{ fontSize: '0.725rem' }}>production-us-east-1</MenuItem>
              <MenuItem value="staging-us-east-1" sx={{ fontSize: '0.725rem' }}>staging-us-east-1</MenuItem>
              <MenuItem value="dev-cluster" sx={{ fontSize: '0.725rem' }}>dev-cluster</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User Profile"
            sx={{
              width: 26,
              height: 26,
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#3b82f6',
              },
            }}
          />

          <IconButton
            size="small"
            sx={{
              color: '#94a3b8',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '50%',
              p: 0.75,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.06)', color: '#f8fafc' }
            }}
          >
            <ShareRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Main split grid */}
      <Grid container spacing={2} sx={{ flexGrow: 1, minHeight: 0 }}>
        
        {/* Left Column: Pod Selection List */}
        <Grid size={{ xs: 12, md: 4, lg: 3.5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          {/* Pod Search bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'background.paper',
              borderRadius: '8px',
              px: 1.5,
              py: 0.75,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
            <InputBase
              placeholder="Filter active pods..."
              value={podSearch}
              onChange={(e) => setPodSearch(e.target.value)}
              sx={{ color: 'text.primary', width: '100%', fontSize: '0.75rem' }}
            />
          </Box>

          {/* Pod list container */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.5, mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                24 ACTIVE PODS
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                SELECT ALL
              </Typography>
            </Box>

            {/* Pod Items rendering */}
            {filteredPods.map((pod) => (
              <Box
                key={pod.name}
                onClick={() => handleSelectPod(pod)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: '10px',
                  backgroundColor: pod.selected ? 'rgba(59, 130, 246, 0.08)' : 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderLeft: pod.selected ? '3px solid #3b82f6' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: pod.selected ? 'rgba(59, 130, 246, 0.12)' : 'action.hover',
                    borderColor: 'primary.main'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  {/* Status dot */}
                  <CircleIcon sx={{ color: getStatusColor(pod.status), fontSize: 8 }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: pod.selected ? 'primary.main' : 'text.primary',
                        fontWeight: 700,
                        fontSize: '0.775rem',
                        lineHeight: 1.25,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {pod.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.625rem', fontWeight: 600 }}>
                      ns: {pod.ns}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {/* Custom Sparkline path SVG */}
                  <svg width="60" height="20" style={{ opacity: pod.selected ? 0.9 : 0.4 }}>
                    <path
                      d={pod.sparkPath}
                      fill="none"
                      stroke={pod.selected ? theme.palette.primary.main : theme.palette.text.secondary}
                      strokeWidth="1.5"
                    />
                  </svg>

                  {/* Selected indicator check */}
                  {pod.selected && (
                    <CheckCircleRoundedIcon sx={{ color: '#3b82f6', fontSize: 16 }} />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Right Column: Live Logs Terminal Console */}
        <Grid size={{ xs: 12, md: 8, lg: 8.5 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: theme.palette.mode === 'dark' ? '#030712' : '#ffffff',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '12px',
              flexGrow: 1,
              overflow: 'hidden',
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
            {/* Terminal Header controls */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1,
                backgroundColor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.725rem', fontFamily: 'monospace' }}>
                  {`tail -f ${selectedPod.name}`}
                </Typography>
                
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  backgroundColor: liveStream
                    ? (theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.06)' : 'rgba(4, 120, 87, 0.08)')
                    : (theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.06)' : 'rgba(180, 83, 9, 0.08)'),
                  border: '1px solid',
                  borderColor: liveStream
                    ? (theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(4, 120, 87, 0.15)')
                    : (theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(180, 83, 9, 0.15)'),
                  borderRadius: '4px',
                  px: 1,
                  py: 0.25
                }}>
                  <CircleIcon sx={{
                    color: liveStream
                      ? (theme.palette.mode === 'dark' ? '#10b981' : '#047857')
                      : (theme.palette.mode === 'dark' ? '#f59e0b' : '#b45309'),
                    fontSize: 6
                  }} />
                  <Typography sx={{
                    color: liveStream
                      ? (theme.palette.mode === 'dark' ? '#10b981' : '#047857')
                      : (theme.palette.mode === 'dark' ? '#f59e0b' : '#b45309'),
                    fontWeight: 800,
                    fontSize: '0.625rem',
                    letterSpacing: '0.5px'
                  }}>
                    {liveStream ? 'STREAMING' : 'PAUSED'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    borderRadius: '6px',
                    px: 1,
                    py: 0.25,
                    width: '180px',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:focus-within': {
                      borderColor: 'primary.main',
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                    }
                  }}
                >
                  <SearchIcon sx={{ color: 'text.secondary', mr: 0.75, fontSize: 14 }} />
                  <InputBase
                    placeholder="Search logs..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    sx={{ color: 'text.primary', width: '100%', fontSize: '0.7rem' }}
                  />
                </Box>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setLiveStream(!liveStream)}
                  startIcon={liveStream ? <PauseRoundedIcon sx={{ fontSize: 14 }} /> : <PlayArrowRoundedIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    borderColor: 'divider',
                    backgroundColor: 'transparent',
                    color: 'text.secondary',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.675rem',
                    height: '24px',
                    py: 0,
                    px: 1,
                    borderRadius: '6px',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.hover',
                      color: 'text.primary'
                    }
                  }}
                >
                  {liveStream ? 'Pause' : 'Resume'}
                </Button>

                <IconButton
                  size="small"
                  onClick={handleDownloadLogs}
                  title="Download logs"
                  sx={{
                    color: 'text.secondary',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 0.4,
                    '&:hover': { color: 'text.primary', backgroundColor: 'action.hover' }
                  }}
                >
                  <DownloadRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={handleClearLogs}
                  title="Clear console"
                  sx={{
                    color: 'text.secondary',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 0.4,
                    '&:hover': { color: 'error.main', backgroundColor: 'rgba(239, 68, 68, 0.08)' }
                  }}
                >
                  <DeleteRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Terminal Screen area */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                py: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.15,
                backgroundColor: theme.palette.mode === 'dark' ? '#030712' : '#ffffff'
              }}
            >
              {filteredLogs.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#64748b', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  No matching log outputs found.
                </Box>
              ) : (
                filteredLogs.map((log, index) => renderLogLine(log, index))
              )}

              {/* Blinking blue cursor caret */}
              <Box sx={{ display: 'flex', py: 0.15, px: 2, alignItems: 'center' }}>
                <Typography component="span" sx={{ color: theme.palette.mode === 'dark' ? '#64748b' : '#64748b', fontSize: '0.75rem', fontFamily: 'monospace', minWidth: '155px', flexShrink: 0 }}>
                  {new Date().toISOString().replace('T', ' ').substring(0, 23)}
                </Typography>
                <Box
                  sx={{
                    width: 6,
                    height: 12,
                    backgroundColor: '#3b82f6',
                    animation: 'blink 1.2s step-end infinite',
                    ml: 0.25
                  }}
                />
              </Box>

              <div ref={consoleEndRef} />
            </Box>

            {/* Terminal Footer status info */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1,
                backgroundColor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <StorageRoundedIcon sx={{ color: 'text.secondary', fontSize: 12 }} />
                  <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.625rem', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                    STORAGE: <span style={{ color: theme.palette.text.primary }}>4.2 GB</span>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <SpeedRoundedIcon sx={{ color: 'text.secondary', fontSize: 12 }} />
                  <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.625rem', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                    LOAD: <span style={{ color: theme.palette.text.primary }}>12%</span>
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.625rem', fontFamily: 'monospace' }}>
                  UTF-8
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.625rem' }}>|</Typography>
                <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.625rem', fontFamily: 'monospace' }}>
                  {`${logs.length.toLocaleString()} Lines`}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.625rem' }}>|</Typography>
                <Typography
                  onClick={handleDownloadLogs}
                  sx={{
                    color: '#3b82f6',
                    fontWeight: 700,
                    fontSize: '0.625rem',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Export CSV
                </Typography>
              </Box>
            </Box>

          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
