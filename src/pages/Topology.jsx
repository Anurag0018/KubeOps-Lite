import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import SchemaRoundedIcon from '@mui/icons-material/SchemaRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import { useClusterStore } from '../store/clusterStore';

export default function Topology() {
  const theme = useTheme();
  const [storeState] = useClusterStore();
  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [dragNodeId, setDragNodeId] = useState(null);
  const [positions, setPositions] = useState({});
  const [flowOffset, setFlowOffset] = useState(0);

  const containerRef = useRef(null);

  // Animating flow dashes
  useEffect(() => {
    let animId;
    const animate = () => {
      setFlowOffset((prev) => (prev - 0.4) % 20);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Filter deployments & pods
  const namespaces = ['production', 'infrastructure', 'background-jobs'];
  const deployments = storeState.deployments.filter(
    (d) => selectedNamespace === 'all' || d.ns === selectedNamespace
  );
  const pods = storeState.pods.filter(
    (p) => selectedNamespace === 'all' || p.namespace === selectedNamespace
  );

  // Build topology nodes and links
  const graphNodes = [];
  const graphLinks = [];

  // 1. Center Master Node
  graphNodes.push({
    id: 'k8s-master',
    label: 'API Server',
    type: 'master',
    color: theme.palette.primary.main,
    icon: <SettingsInputComponentIcon sx={{ color: '#ffffff', fontSize: 22 }} />,
  });

  // 2. Namespace Hubs
  const activeNamespaces = selectedNamespace === 'all' ? namespaces : [selectedNamespace];
  activeNamespaces.forEach((ns) => {
    const colorMap = {
      production: '#a855f7', // purple
      infrastructure: '#10b981', // emerald
      'background-jobs': '#f59e0b', // orange
    };
    const nsColor = colorMap[ns] || theme.palette.primary.main;
    graphNodes.push({
      id: `ns-${ns}`,
      label: ns,
      type: 'namespace',
      color: nsColor,
      icon: <HubRoundedIcon sx={{ color: '#ffffff', fontSize: 18 }} />,
    });
    // Link from master to namespace
    graphLinks.push({ source: 'k8s-master', target: `ns-${ns}`, value: 3 });
  });

  // 3. Deployments
  deployments.forEach((d) => {
    const parentNs = `ns-${d.ns}`;
    graphNodes.push({
      id: `dep-${d.name}`,
      label: d.name,
      type: 'deployment',
      color: theme.palette.mode === 'dark' ? '#3b82f6' : '#1d4ed8',
      icon: <AccountTreeRoundedIcon sx={{ color: '#ffffff', fontSize: 16 }} />,
      metadata: d,
    });
    // Link from namespace to deployment
    graphLinks.push({ source: parentNs, target: `dep-${d.name}`, value: 2 });
  });

  // 4. Pods
  pods.forEach((p) => {
    const parentDep = `dep-${p.deployment}`;
    const hasParentDep = graphNodes.some((n) => n.id === parentDep);
    const sourceNode = hasParentDep ? parentDep : `ns-${p.namespace}`;

    graphNodes.push({
      id: `pod-${p.name}`,
      label: p.name.length > 22 ? p.name.substring(0, 20) + '...' : p.name,
      type: 'pod',
      color: p.status === 'RUNNING' ? '#10b981' : p.status === 'PENDING' ? '#fb923c' : '#ef4444',
      icon: <DnsRoundedIcon sx={{ color: '#ffffff', fontSize: 14 }} />,
      metadata: p,
    });
    // Link to pod
    graphLinks.push({ source: sourceNode, target: `pod-${p.name}`, value: 1 });
  });

  // Generate layout positions dynamically
  useEffect(() => {
    const newPositions = {};
    const width = 800;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2 + 55; // Shift center down to give top pods space

    // Center Node
    newPositions['k8s-master'] = { x: centerX, y: centerY };

    // Layout Namespaces in a circle around center
    const nsNodes = graphNodes.filter((n) => n.type === 'namespace');
    nsNodes.forEach((ns, idx) => {
      const angle = (idx / nsNodes.length) * 2 * Math.PI - Math.PI / 2;
      const radius = 130;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      newPositions[ns.id] = { x, y };

      // Layout Deployments under/around their namespace hub
      const nsName = ns.id.replace('ns-', '');
      const depNodes = graphNodes.filter((n) => n.type === 'deployment' && n.metadata.ns === nsName);
      depNodes.forEach((dep, dIdx) => {
        const dAngle = angle + ((dIdx - (depNodes.length - 1) / 2) * 0.45);
        const dRadius = 220;
        const dx = centerX + dRadius * Math.cos(dAngle);
        const dy = centerY + dRadius * Math.sin(dAngle);
        newPositions[dep.id] = { x: dx, y: dy };

        // Layout Pods orbiting their deployment
        const depName = dep.id.replace('dep-', '');
        const podNodes = graphNodes.filter((n) => n.type === 'pod' && n.metadata.deployment === depName);
        podNodes.forEach((pod, pIdx) => {
          const pAngle = dAngle + ((pIdx - (podNodes.length - 1) / 2) * 0.28);
          const pRadius = 310;
          const px = centerX + pRadius * Math.cos(pAngle);
          const py = centerY + pRadius * Math.sin(pAngle);
          newPositions[pod.id] = { x: px, y: py };
        });
      });
    });

    // Catch any floating pods (orphaned pods that don't belong to a deployment)
    const orphanedPods = graphNodes.filter((n) => n.type === 'pod' && !n.metadata.deployment);
    orphanedPods.forEach((pod, oIdx) => {
      const oAngle = (oIdx / orphanedPods.length) * 2 * Math.PI;
      const oRadius = 260;
      newPositions[pod.id] = {
        x: centerX + oRadius * Math.cos(oAngle),
        y: centerY - 120 + oRadius * Math.sin(oAngle),
      };
    });

    setPositions(newPositions);
  }, [selectedNamespace, storeState.pods.length, storeState.deployments.length]);

  // Handle Dragging
  const handleMouseDown = (id, e) => {
    setDragNodeId(id);
  };

  const handleMouseMove = (e) => {
    if (!dragNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPositions((prev) => ({
      ...prev,
      [dragNodeId]: { x, y },
    }));
  };

  const handleMouseUp = () => {
    setDragNodeId(null);
  };

  const selectedNode = graphNodes.find((n) => n.id === selectedNodeId);

  // Helper to generate dynamic manifest YAML
  const getResourceYaml = (node) => {
    if (!node || !node.metadata) return '';
    if (node.type === 'deployment') {
      const d = node.metadata;
      return d.yaml || `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${d.name}
  namespace: ${d.ns}
spec:
  replicas: ${d.replicasTotal}
  selector:
    matchLabels:
      app: ${d.name}
  strategy:
    type: ${d.strategy}
  template:
    metadata:
      labels:
        app: ${d.name}
    spec:
      containers:
      - name: server
        image: nginx:alpine
        resources:
          limits:
            cpu: ${d.cpu}
            memory: ${d.memory}`;
    } else if (node.type === 'pod') {
      const p = node.metadata;
      return p.yaml || `apiVersion: v1
kind: Pod
metadata:
  name: ${p.name}
  namespace: ${p.namespace}
spec:
  containers:
  - name: container
    image: custom-image:v1
    resources:
      requests:
        cpu: ${p.cpu}
        memory: ${p.memory}
status:
  phase: ${p.status}
  hostIP: 192.168.1.101
  podIP: 10.244.1.33
  nodeName: ${p.node}`;
    }
    return '';
  };

  return (
    <Box sx={{ p: 4, backgroundColor: 'background.default', minHeight: 'calc(100vh - 70px)', transition: 'background-color 0.3s ease' }}>
      
      {/* Title */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.5px' }}>
            Cluster Topology Map
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Fully interactive dependency visualizer connecting Namespaces, Deployments, Pods, and Services.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={selectedNamespace}
              onChange={(e) => setSelectedNamespace(e.target.value)}
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: '8px',
                fontSize: '0.85rem',
                border: '1px solid',
                borderColor: 'divider',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
            >
              <MenuItem value="all">All Namespaces</MenuItem>
              {namespaces.map((ns) => (
                <MenuItem key={ns} value={ns}>{ns}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: selectedNodeId ? 8 : 12 }}>
          <Paper
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            sx={{
              position: 'relative',
              height: '560px',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'none',
              cursor: dragNodeId ? 'grabbing' : 'default',
              transition: 'transform 0.3s ease, border-color 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: theme.palette.mode === 'dark' 
                  ? `0 12px 20px -10px ${theme.palette.primary.main}26, 0 4px 20px 0 rgba(0,0,0,0.3)` 
                  : `0 12px 20px -10px ${theme.palette.primary.main}14, 0 4px 20px 0 rgba(0,0,0,0.05)`
              }
            }}
          >
            {/* SVG Visualizer Canvas */}
            <svg width="100%" height="100%" style={{ display: 'block' }}>
              {/* Connection Links */}
              {graphLinks.map((link, idx) => {
                const start = positions[link.source];
                const end = positions[link.target];
                if (!start || !end) return null;

                const midX = (start.x + end.x) / 2;
                const pathData = `M ${start.x} ${start.y} Q ${midX} ${(start.y + end.y) / 2 - 20} ${end.x} ${end.y}`;

                return (
                  <g key={`link-${idx}`}>
                    {/* Base Glow Line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                      strokeWidth={link.value * 2 + 1}
                    />
                    {/* Connected Line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={theme.palette.primary.main}
                      strokeWidth="1.5"
                      opacity="0.25"
                    />
                    {/* Pulsing traffic flow dashes */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={theme.palette.primary.main}
                      strokeWidth="1.5"
                      strokeDasharray="4, 16"
                      strokeDashoffset={flowOffset * (link.value === 3 ? 1.5 : 1)}
                      opacity="0.8"
                    />
                  </g>
                );
              })}

              {/* Render Nodes */}
              {graphNodes.map((node) => {
                const pos = positions[node.id];
                if (!pos) return null;

                const isSelected = selectedNodeId === node.id;
                const radius = node.type === 'master' ? 26 : node.type === 'namespace' ? 22 : node.type === 'deployment' ? 18 : 14;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                    onMouseDown={(e) => handleMouseDown(node.id, e)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isSelected && (
                      <circle
                        r={radius + 8}
                        fill="none"
                        stroke={node.color}
                        strokeWidth="1.5"
                        style={{ opacity: 0.45 }}
                      />
                    )}
                    <circle
                      r={radius}
                      fill={node.color}
                      stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.15)'}
                      strokeWidth={isSelected ? 2 : 1}
                      style={{
                        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))',
                        transition: 'r 0.2s ease',
                      }}
                    />
                    <g transform="translate(-10, -10)">
                      <foreignObject width="20" height="20">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                          {node.icon}
                        </Box>
                      </foreignObject>
                    </g>
                    <text
                      y={radius + 18}
                      textAnchor="middle"
                      fill={theme.palette.text.primary}
                      style={{
                        fontSize: node.type === 'master' ? '0.75rem' : '0.675rem',
                        fontWeight: isSelected ? 800 : 600,
                        letterSpacing: '-0.2px',
                        userSelect: 'none',
                        pointerEvents: 'none',
                      }}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            <Box sx={{ position: 'absolute', bottom: 12, left: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'primary.main', animation: 'runningPulse 1.5s infinite' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.675rem' }}>
                Drag nodes to organize layout. Click a node to view config.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {selectedNodeId && selectedNode && (
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '16px',
                height: '560px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'none',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Chip
                    label={selectedNode.type.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: `${selectedNode.color}20`,
                      color: selectedNode.color,
                      fontWeight: 800,
                      fontSize: '0.6rem',
                      height: '18px',
                      mb: 1,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem', letterSpacing: '-0.3px' }}>
                    {selectedNode.label}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => setSelectedNodeId(null)} sx={{ color: 'text.secondary' }}>
                  <CloseRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>

              <Divider />

              <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 2, pr: 0.5 }}>
                {selectedNode.metadata ? (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.675rem', color: 'text.secondary', mb: 1 }}>
                      YAML MANIFEST CONFIG
                    </Typography>
                    <Box
                      component="pre"
                      sx={{
                        p: 1.5,
                        backgroundColor: theme.palette.mode === 'dark' ? '#070b13' : '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: 'divider',
                        fontFamily: 'monospace',
                        fontSize: '0.725rem',
                        overflowX: 'auto',
                        whiteSpace: 'pre',
                        color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#334155',
                      }}
                    >
                      {getResourceYaml(selectedNode)}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <SchemaRoundedIcon sx={{ color: 'text.secondary', fontSize: 36, opacity: 0.5, mb: 1.5 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                      API resource details. Select a Deployment or Pod node to inspect config manifests.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
