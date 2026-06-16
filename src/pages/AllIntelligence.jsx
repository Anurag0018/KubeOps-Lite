import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import OfflineBoltRoundedIcon from '@mui/icons-material/OfflineBoltRounded';

// Procedural rough approximation of Earth continents for holographic projection
const isLand = (lat, lon) => {
  // lat is in degrees [-90, 90], lon is in degrees [-180, 180]
  
  // Antarctica (very bottom)
  if (lat < -62) return Math.random() < 0.2; // Sparse dots representing ice caps
  
  // North America
  if (lat > 12 && lat < 72 && lon > -168 && lon < -52) {
    if (lat < 28 && lon > -110 && lon < -85) return false; // Exclude Gulf of Mexico area roughly
    if (lat > 48 && lon > -95 && lon < -75) return Math.random() < 0.65; // Great Lakes blend
    return true;
  }
  
  // South America
  if (lat > -56 && lat <= 12 && lon > -82 && lon < -34) {
    if (lat < 0) {
      const t = (lat + 56) / 68; // 0 (south) to 1 (equator)
      const centerLon = -60 - 4 * (1 - t);
      const halfWidth = 10 + 16 * t;
      return (lon > centerLon - halfWidth && lon < centerLon + halfWidth);
    }
    return true;
  }
  
  // Greenland
  if (lat > 60 && lat < 83 && lon > -70 && lon < -18) {
    return (lon < -30 + (83 - lat) * 1.6);
  }
  
  // Africa
  if (lat > -35 && lat < 37 && lon > -18 && lon < 51) {
    if (lat > 12 && lon > 32 && lon < 45) return false; // Red Sea rough cut
    if (lat < 0) {
      const t = (lat + 35) / 35; // 0 at bottom, 1 at equator
      return (lon > 10 - 25 * t && lon < 40 + 10 * t);
    }
    return true;
  }
  
  // Europe & Western Asia
  if (lat >= 35 && lat < 72 && lon > -10 && lon < 45) {
    if (lat < 42 && lon > 12 && lon < 22) return false; // Italy / Adriatic gap
    if (lat < 45 && lon > 28 && lon < 40) return false; // Black Sea rough cut
    return true;
  }
  
  // Asia (Central, East, South)
  if (lat >= 8 && lat < 75 && lon >= 45 && lon < 180) {
    // Saudi Arabia & Middle East
    if (lat < 30 && lon > 35 && lon < 60) {
      return (lat > 12 && lon < 50) || (lat > 15);
    }
    // India
    if (lat < 28 && lon > 68 && lon < 90) {
      return (lon > 78 - (lat - 8) * 0.9 && lon < 78 + (lat - 8) * 0.9);
    }
    // SE Asia & Indochina
    if (lat < 24 && lon > 95 && lon < 112) {
      return (lat > 8);
    }
    // Maritime SE Asia (islands)
    if (lat < 8 && lon > 95 && lon < 140) {
      return Math.random() < 0.45; // Sparse dots for islands
    }
    return true;
  }
  
  // Australia
  if (lat > -40 && lat < -10 && lon > 113 && lon < 153) {
    if (lat > -20 && lon < 120) return Math.random() < 0.8; // indent NW corner
    return true;
  }
  
  // United Kingdom & Ireland
  if (lat > 50 && lat < 61 && lon > -11 && lon < 2) {
    return true;
  }
  
  // Japan
  if (lat > 31 && lat < 45 && lon > 130 && lon < 146) {
    return Math.abs(lon - (130 + (lat - 31) * 1.05)) < 2.5;
  }
  
  // Madagascar
  if (lat > -26 && lat < -12 && lon > 43 && lon < 51) {
    return true;
  }
  
  return false;
};

// Canvas 3D Neural Sphere / Glowing Dotted Earth Globe
const NeuralSphere = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = canvas.width = 280;
    let height = canvas.height = 200;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const radius = Math.min(width, height) * 0.38;
    const fov = 350;
    
    // Dynamic palette settings based on theme
    const colors = {
      land: isDark ? 'rgba(52, 211, 153,' : 'rgba(4, 120, 87,',
      hub: isDark ? 'rgba(6, 182, 212,' : 'rgba(14, 116, 144,',
      node: isDark ? 'rgba(255, 255, 255,' : 'rgba(79, 70, 229,',
      arc: isDark ? 'rgba(6, 182, 212,' : 'rgba(3, 105, 161,',
      packet: isDark ? '#ffffff' : '#4f46e5',
      sat: isDark ? 'rgba(6, 182, 212,' : 'rgba(37, 99, 235,',
      orbit: isDark ? 'rgba(59, 130, 246,' : 'rgba(99, 102, 241,',
      atmos: isDark ? '#06b6d4' : '#0891b2',
      backGlow1: isDark ? 'rgba(6, 182, 212, 0.10)' : 'rgba(6, 182, 212, 0.05)',
      backGlow2: isDark ? 'rgba(16, 185, 129, 0.03)' : 'rgba(16, 185, 129, 0.02)',
      ring: isDark ? 'rgba(52, 211, 153,' : 'rgba(16, 185, 129,',
      atmosFill1: isDark ? 'rgba(6, 182, 212, 0)' : 'rgba(6, 182, 212, 0)',
      atmosFill2: isDark ? 'rgba(6, 182, 212, 0.05)' : 'rgba(6, 182, 212, 0.02)',
      atmosFill3: isDark ? 'rgba(6, 182, 212, 0.22)' : 'rgba(14, 116, 144, 0.18)',
      atmosOutline: isDark ? 'rgba(6, 182, 212, 0.28)' : 'rgba(14, 116, 144, 0.45)',
    };

    // 1. Pre-generate 3D coordinates representing Earth landmass
    const globePoints = [];
    const step = 3.2; // Degree step for continent dot density
    for (let lat = -80; lat <= 80; lat += step) {
      const radLat = (lat * Math.PI) / 180;
      const cosLat = Math.cos(radLat);
      // Adjust longitude step to maintain uniform dot density across the sphere
      const stepLon = step / (cosLat || 0.1);
      for (let lon = -180; lon < 180; lon += stepLon) {
        if (isLand(lat, lon)) {
          const theta = (lon * Math.PI) / 180;
          const phi = ((90 - lat) * Math.PI) / 180;
          globePoints.push({
            x: Math.sin(phi) * Math.cos(theta),
            y: Math.cos(phi),
            z: Math.sin(phi) * Math.sin(theta)
          });
        }
      }
    }

    // 2. Satellites orbiting the globe
    const numSatellites = 3;
    const satellites = [];
    for (let i = 0; i < numSatellites; i++) {
      satellites.push({
        angle: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.006,
        radiusOffset: 12 + Math.random() * 10,
        tiltX: 0.4 + (Math.random() - 0.5) * 0.5, // fixed orbits
        tiltY: (Math.random() - 0.5) * 0.5,
        size: 2.5 + Math.random() * 1.5
      });
    }

    // 3. Neural Link Arcs (Bezier data connections on land)
    const numArcs = 3;
    const arcs = [];
    if (globePoints.length > 5) {
      for (let i = 0; i < numArcs; i++) {
        // Pick random points on land
        const p1 = globePoints[Math.floor(Math.random() * globePoints.length)];
        const p2 = globePoints[Math.floor(Math.random() * globePoints.length)];
        arcs.push({
          p1,
          p2,
          height: 0.12 + Math.random() * 0.16,
          progress: Math.random(),
          speed: 0.006 + Math.random() * 0.008,
        });
      }
    }

    // Globe rotation state
    let rotX = 0.25;
    let rotY = 0;
    const speedX = 0.0012;
    const speedY = 0.0028;

    // Directional Light Source vector (normalized) for 3D Shading
    // Light coming from top-left, slightly front
    const nlx = -0.424;
    const nly = -0.594;
    const nlz = 0.679;

    const project = (x, y, z, cx, cy) => {
      const scale = fov / (fov + z + radius);
      return {
        x: x * scale + cx,
        y: y * scale + cy,
        scale: scale
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;
      const shimmerTime = Date.now() * 0.0035;

      // Update globe rotation angles
      rotX += speedX;
      rotY += speedY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const rotatePoint = (x, y, z) => {
        // Rotate Y
        let x1 = x * cosY - z * sinY;
        let z1 = z * cosY + x * sinY;
        // Rotate X
        let y2 = y * cosX - z1 * sinX;
        let z2 = z1 * cosX + y * sinX;
        return { x: x1, y: y2, z: z2 };
      };

      // A. Draw glowing background aura
      const backGlow = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 1.5);
      backGlow.addColorStop(0, colors.backGlow1);
      backGlow.addColorStop(0.5, colors.backGlow2);
      backGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = backGlow;
      ctx.fillRect(0, 0, width, height);

      // B. Draw faint background Latitude / Longitude lines
      const latRings = 6;
      const lonRings = 7;
      const pointsPerRing = 32;

      // Draw Latitudes
      for (let r = 1; r < latRings; r++) {
        const phi = (r / latRings) * Math.PI;
        const ringRad = radius * Math.sin(phi);
        const ringY = radius * Math.cos(phi);
        
        ctx.beginPath();
        for (let p = 0; p <= pointsPerRing; p++) {
          const theta = (p / pointsPerRing) * Math.PI * 2;
          const x = ringRad * Math.cos(theta);
          const z = ringRad * Math.sin(theta);
          
          const rotated = rotatePoint(x, ringY, z);
          const proj = project(rotated.x, rotated.y, rotated.z, cx, cy);
          
          // Front-to-back depth alpha
          const depthAlpha = Math.min(1, Math.max(0.02, (1.2 - rotated.z / radius) / 2.2));
          ctx.strokeStyle = `${colors.ring}${depthAlpha * (isDark ? 0.06 : 0.22)})`;
          ctx.lineWidth = 0.8;
          
          if (p === 0) {
            ctx.moveTo(proj.x, proj.y);
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
        ctx.stroke();
      }

      // Draw Longitudes
      for (let r = 0; r < lonRings; r++) {
        const theta = (r / lonRings) * Math.PI * 2;
        
        ctx.beginPath();
        for (let p = 0; p <= pointsPerRing; p++) {
          const phi = (p / pointsPerRing) * Math.PI;
          const ringRad = radius * Math.sin(phi);
          const ringY = radius * Math.cos(phi);
          
          const x = ringRad * Math.cos(theta);
          const z = ringRad * Math.sin(theta);
          
          const rotated = rotatePoint(x, ringY, z);
          const proj = project(rotated.x, rotated.y, rotated.z, cx, cy);
          
          const depthAlpha = Math.min(1, Math.max(0.02, (1.2 - rotated.z / radius) / 2.2));
          ctx.strokeStyle = `${colors.ring}${depthAlpha * (isDark ? 0.06 : 0.22)})`;
          ctx.lineWidth = 0.8;
          
          if (p === 0) {
            ctx.moveTo(proj.x, proj.y);
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
        ctx.stroke();
      }

      // C. Draw 3D Dotted Continents with Lighting & Volumetric Shading
      globePoints.forEach((pt, idx) => {
        const rotated = rotatePoint(pt.x, pt.y, pt.z);
        const rx = rotated.x * radius;
        const ry = rotated.y * radius;
        const rz = rotated.z * radius;
        
        const proj = project(rx, ry, rz, cx, cy);

        // 1. Depth Fading (front Z is negative in our coordinate layout, back Z is positive)
        // unitZ goes from -1 (closest) to +1 (furthest)
        const unitZ = rotated.z; 
        const depthAlpha = Math.min(1, Math.max(0.05, (1.1 - unitZ) / 2.2));

        // 2. 3D Volumetric Shading
        // Calculate dot product between rotated normal and light vector
        const dotProd = rotated.x * nlx + rotated.y * nly + rotated.z * nlz;
        const shade = Math.max(0.18, (dotProd + 1.1) / 2.1);

        // Combined final opacity
        const opacity = depthAlpha * shade;

        // Size adjustment (front dots are slightly larger to enhance depth perception)
        const sizeMultiplier = (1.2 - unitZ) * 1.15;

        ctx.beginPath();
        if (idx % 26 === 0) {
          // Neon Cyan Active Server Hub
          const shimmer = Math.sin(shimmerTime + idx) * 0.35 + 0.65;
          const rDot = Math.max(1.0, proj.scale * 2.3 * sizeMultiplier);
          ctx.fillStyle = `${colors.hub}${opacity * shimmer * (isDark ? 0.95 : 1.25)})`;
          ctx.arc(proj.x, proj.y, rDot, 0, Math.PI * 2);
          ctx.fill();

          // Hub pulse ring
          ctx.beginPath();
          ctx.strokeStyle = `${colors.hub}${opacity * (1 - shimmer) * 0.4})`;
          ctx.lineWidth = 0.6;
          ctx.arc(proj.x, proj.y, rDot * 2.2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (idx % 15 === 0) {
          // Glowing Communication Node
          const shimmer = Math.sin(shimmerTime + idx) * 0.25 + 0.75;
          const rDot = Math.max(0.8, proj.scale * 1.7 * sizeMultiplier);
          ctx.fillStyle = `${colors.node}${opacity * shimmer * (isDark ? 0.9 : 1.25)})`;
          ctx.arc(proj.x, proj.y, rDot, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard Continent Land Point (Emerald Green)
          const rDot = Math.max(0.6, proj.scale * 1.35 * sizeMultiplier);
          ctx.fillStyle = `${colors.land}${opacity * (isDark ? 0.65 : 0.9)})`;
          ctx.arc(proj.x, proj.y, rDot, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // D. Draw atmospheric inner glow rim
      const innerAtm = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius);
      innerAtm.addColorStop(0, colors.atmosFill1);
      innerAtm.addColorStop(0.7, colors.atmosFill2);
      innerAtm.addColorStop(1, colors.atmosFill3);
      ctx.fillStyle = innerAtm;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // E. Draw sharp holographic atmosphere outline (Neon Cyan)
      ctx.shadowColor = colors.atmos;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = colors.atmosOutline;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow blur immediately

      // F. Draw Neural Link Data Arcs (Pulsing connection paths)
      arcs.forEach((arc) => {
        arc.progress += arc.speed;
        if (arc.progress > 1) {
          arc.progress = 0;
          // Re-route target to another random point
          arc.p2 = globePoints[Math.floor(Math.random() * globePoints.length)];
        }

        // 1. Draw the connection path line segments
        ctx.beginPath();
        const pathSteps = 24;
        for (let j = 0; j <= pathSteps; j++) {
          const t = j / pathSteps;
          
          // Spherical LERP
          let mx = arc.p1.x * (1 - t) + arc.p2.x * t;
          let my = arc.p1.y * (1 - t) + arc.p2.y * t;
          let mz = arc.p1.z * (1 - t) + arc.p2.z * t;
          const len = Math.sqrt(mx*mx + my*my + mz*mz);
          mx /= len; my /= len; mz /= len;

          // Arched radial height
          const h = 1.0 + arc.height * Math.sin(t * Math.PI);
          const px3d = mx * h * radius;
          const py3d = my * h * radius;
          const pz3d = mz * h * radius;

          const rotatedPoint = rotatePoint(px3d, py3d, pz3d);
          const proj = project(rotatedPoint.x, rotatedPoint.y, rotatedPoint.z, cx, cy);
          
          // Depth alpha
          const unitZ = rotatedPoint.z / radius;
          const depthAlpha = Math.min(1, Math.max(0.03, (1.2 - unitZ) / 2.2));

          ctx.strokeStyle = `${colors.arc}${depthAlpha * (isDark ? 0.26 : 0.45)})`;
          ctx.lineWidth = 0.8;

          if (j === 0) {
            ctx.moveTo(proj.x, proj.y);
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
        ctx.stroke();

        // 2. Draw the bright data packet traversing the path
        const t = arc.progress;
        let mx = arc.p1.x * (1 - t) + arc.p2.x * t;
        let my = arc.p1.y * (1 - t) + arc.p2.y * t;
        let mz = arc.p1.z * (1 - t) + arc.p2.z * t;
        const len = Math.sqrt(mx*mx + my*my + mz*mz);
        mx /= len; my /= len; mz /= len;

        const h = 1.0 + arc.height * Math.sin(t * Math.PI);
        const px3d = mx * h * radius;
        const py3d = my * h * radius;
        const pz3d = mz * h * radius;

        const rotatedPoint = rotatePoint(px3d, py3d, pz3d);
        const proj = project(rotatedPoint.x, rotatedPoint.y, rotatedPoint.z, cx, cy);
        
        const unitZ = rotatedPoint.z / radius;
        if (unitZ < 0.6) { // Draw pulse only if on front side
          ctx.fillStyle = colors.packet;
          ctx.shadowColor = colors.atmos;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(1.2, 3.2 * proj.scale), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // G. Draw Orbiting Blue/Cyan Satellites and Orbits
      satellites.forEach((sat) => {
        sat.angle += sat.speed;
        
        const orbitRad = radius + sat.radiusOffset;
        
        // 1. Render orbital path ring in 3D space
        ctx.beginPath();
        const orbitSteps = 48;
        for (let j = 0; j <= orbitSteps; j++) {
          const a = (j / orbitSteps) * Math.PI * 2;
          let sx = orbitRad * Math.cos(a);
          let sy = 0;
          let sz = orbitRad * Math.sin(a);
          
          const sy1 = sy * Math.cos(sat.tiltX) - sz * Math.sin(sat.tiltX);
          const sz1 = sz * Math.cos(sat.tiltX) + sy * Math.sin(sat.tiltX);
          const sx2 = sx * Math.cos(sat.tiltY) - sz1 * Math.sin(sat.tiltY);
          const sz2 = sz1 * Math.cos(sat.tiltY) + sx * Math.sin(sat.tiltY);

          const rotatedOrb = rotatePoint(sx2, sy1, sz2);
          const projOrb = project(rotatedOrb.x, rotatedOrb.y, rotatedOrb.z, cx, cy);
          
          const depthAlpha = Math.min(1, Math.max(0.02, (radius - rotatedOrb.z) / (2 * radius)));
          ctx.strokeStyle = `${colors.orbit}${depthAlpha * (isDark ? 0.05 : 0.15)})`;
          ctx.lineWidth = 0.8;
          
          if (j === 0) {
            ctx.moveTo(projOrb.x, projOrb.y);
          } else {
            ctx.lineTo(projOrb.x, projOrb.y);
          }
        }
        ctx.stroke();

        // 2. Render Satellite dot
        let sx = orbitRad * Math.cos(sat.angle);
        let sy = 0;
        let sz = orbitRad * Math.sin(sat.angle);
        
        const sy1 = sy * Math.cos(sat.tiltX) - sz * Math.sin(sat.tiltX);
        const sz1 = sz * Math.cos(sat.tiltX) + sy * Math.sin(sat.tiltX);
        
        const sx2 = sx * Math.cos(sat.tiltY) - sz1 * Math.sin(sat.tiltY);
        const sz2 = sz1 * Math.cos(sat.tiltY) + sx * Math.sin(sat.tiltY);

        const rotatedSat = rotatePoint(sx2, sy1, sz2);
        const proj = project(rotatedSat.x, rotatedSat.y, rotatedSat.z, cx, cy);

        // Depth alpha for satellite
        const unitZ = rotatedSat.z / orbitRad;
        const satDepthAlpha = Math.min(1, Math.max(0.1, (1.2 - unitZ) / 2.2));
        
        ctx.fillStyle = `${colors.sat}${satDepthAlpha * 0.95})`; // bright cyan
        ctx.shadowColor = colors.atmos;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, sat.size * proj.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
};


// Animated wave equalizer lines
const EqualizerIcon = () => (
  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '12px', width: '14px' }}>
    <style>{`
      @keyframes eqBar1 { 0%, 100% { height: 3px; } 50% { height: 12px; } }
      @keyframes eqBar2 { 0%, 100% { height: 10px; } 50% { height: 5px; } }
      @keyframes eqBar3 { 0%, 100% { height: 5px; } 50% { height: 10px; } }
    `}</style>
    <Box sx={{ width: '2px', backgroundColor: '#3b82f6', borderRadius: '1px', animation: 'eqBar1 0.8s ease-in-out infinite' }} />
    <Box sx={{ width: '2px', backgroundColor: '#3b82f6', borderRadius: '1px', animation: 'eqBar2 0.6s ease-in-out infinite' }} />
    <Box sx={{ width: '2px', backgroundColor: '#3b82f6', borderRadius: '1px', animation: 'eqBar3 1.0s ease-in-out infinite' }} />
  </Box>
);

export default function AllIntelligence() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [autoScroll, setAutoScroll] = useState(true);

  const logColors = {
    timestamp: '#64748b',
    info: '#3b82f6',
    success: isDark ? '#10b981' : '#059669',
    warn: isDark ? '#f59e0b' : '#d97706',
    message: isDark ? '#cbd5e1' : '#334155',
  };

  return (
    <Box sx={{ p: 3, backgroundColor: 'transparent', width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      
      {/* Title Header with action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, fontSize: '1.6rem', letterSpacing: '-0.5px' }}>
            AI Cluster Intelligence
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '0.825rem', fontWeight: 500 }}>
            Autonomous health monitoring and predictive resource optimization.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AutorenewRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderColor: 'divider',
              backgroundColor: 'transparent',
              color: 'text.primary',
              borderRadius: '8px',
              px: 2,
              py: 0.75,
              fontWeight: 600,
              fontSize: '0.725rem',
              textTransform: 'none',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              },
            }}
          >
            Re-analyze
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<DescriptionRoundedIcon sx={{ fontSize: 16 }} />}
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
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Row 1 Grid: Health Score card (Left) & Neural Sphere (Right) */}
      <Grid container spacing={2}>
        
        {/* Left tall card */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              height: '100%',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
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
            {/* Header part */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 52,
                  height: 52,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.12)',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#3b82f6', fontSize: '1.35rem' }}>
                  94%
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '0.975rem', lineHeight: 1.1 }}>
                  Cluster Health Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip
                    label="Optimal Performance"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      color: '#10b981',
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      height: '18px',
                      border: '1px solid rgba(16, 185, 129, 0.12)',
                    }}
                  />
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600 }}>
                    • Last updated 2m ago
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Sub columns row */}
            <Grid container spacing={4} sx={{ mb: 2 }}>
              {/* Predicted Risk Level */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.675rem', letterSpacing: '0.3px' }}>
                    PREDICTED RISK LEVEL
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 800, fontSize: '0.725rem' }}>
                    Minimal (12%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={12}
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: 'divider',
                    mb: 1.25,
                    '& .MuiLinearProgress-bar': { backgroundColor: '#10b981', borderRadius: 3 },
                  }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.7rem', lineHeight: 1.4, fontWeight: 500 }}>
                  AI models predict a stable environment for the next 48 hours based on current traffic patterns and pod stability.
                </Typography>
              </Grid>

              {/* Resource Optimization */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.675rem', letterSpacing: '0.3px' }}>
                    RESOURCE OPTIMIZATION
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 800, fontSize: '0.725rem' }}>
                    82% Efficient
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={82}
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: 'divider',
                    mb: 1.25,
                    '& .MuiLinearProgress-bar': { backgroundColor: '#3b82f6', borderRadius: 3 },
                  }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.7rem', lineHeight: 1.4, fontWeight: 500 }}>
                  Cluster is currently running at 82% efficiency. Potential for $420/mo savings by rightsizing 4 namespaces.
                </Typography>
              </Grid>
            </Grid>

            {/* Bottom Actions section */}
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
                <OfflineBoltRoundedIcon sx={{ color: '#3b82f6', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.75rem' }}>
                  AI Recommended Actions
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Resize auth-service Replicas', 'Optimize Redis Cache Memory', 'Cleanup Unused ConfigMaps'].map((action) => (
                  <Button
                    key={action}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: 'divider',
                      backgroundColor: 'transparent',
                      color: 'text.primary',
                      fontSize: '0.675rem',
                      fontWeight: 700,
                      py: 0.5,
                      px: 1.5,
                      textTransform: 'none',
                      borderRadius: '8px',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    {action}
                  </Button>
                ))}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right neural sphere card */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              height: '100%',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2,
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 12px 20px -10px rgba(6, 182, 212, 0.18), 0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
                  : '0 12px 20px -10px rgba(6, 182, 212, 0.12), 0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                borderColor: '#06b6d4',
              }
            }}
          >
            {/* Sphere graphic space */}
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <NeuralSphere />
            </Box>

            {/* Bottom info section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '1px' }}>
                  NEURAL LINK
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.825rem', mt: 0.25 }}>
                  Real-time Analysis Active
                </Typography>
              </Box>

              <Box sx={{ pb: 0.5 }}>
                <EqualizerIcon />
              </Box>
            </Box>
          </Card>
        </Grid>

      </Grid>

      {/* Row 2 Grid: Three Bottom Cards */}
      <Grid container spacing={2}>
        
        {/* Card 1: Anomaly Detection */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              p: 2.25,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
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
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.75 }}>
                <Box sx={{ p: 0.75, borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.12)', display: 'flex' }}>
                  <InsightsRoundedIcon sx={{ color: '#3b82f6', fontSize: 16 }} />
                </Box>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '0.85rem' }}>
                  Anomaly Detection
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.725rem', lineHeight: 1.5, mb: 2 }}>
                Unusual latency spike detected in <span style={{ color: theme.palette.text.primary, fontWeight: 700 }}>payment-gateway</span> namespace between 02:00 and 02:15 UTC.
              </Typography>
            </Box>

            <Box sx={{ mb: 2.25 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.625rem' }}>Confidence Score</Typography>
                <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 800, fontSize: '0.675rem' }}>98.4%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={98.4}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'divider',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#3b82f6', borderRadius: 2 },
                }}
              />
            </Box>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: 'divider',
                backgroundColor: 'transparent',
                color: 'text.primary',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.7rem',
                py: 0.75,
                borderRadius: '8px',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              View Anomaly Details
            </Button>
          </Card>
        </Grid>

        {/* Card 2: Resource Waste */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              p: 2.25,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
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
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.75 }}>
                <Box sx={{ p: 0.75, borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.12)', display: 'flex' }}>
                  <TrendingDownRoundedIcon sx={{ color: '#10b981', fontSize: 16 }} />
                </Box>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '0.85rem' }}>
                  Resource Waste
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.725rem', lineHeight: 1.5, mb: 2 }}>
                Identified <span style={{ color: theme.palette.text.primary, fontWeight: 700 }}>1.4 TB</span> of over-provisioned storage and <span style={{ color: theme.palette.text.primary, fontWeight: 700 }}>12 idle pods</span> across 3 clusters.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 800, fontSize: '0.6rem', letterSpacing: '0.5px', display: 'block', mb: 0.25 }}>
                  EST. SAVINGS
                </Typography>
                <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.1 }}>
                  $1,240<span style={{ fontSize: '0.85rem', fontWeight: 600 }}>/mo</span>
                </Typography>
              </Box>
              
              <CheckCircleRoundedIcon sx={{ color: '#10b981', fontSize: 22 }} />
            </Box>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: 'divider',
                backgroundColor: 'transparent',
                color: 'text.primary',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.7rem',
                py: 0.75,
                borderRadius: '8px',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              Apply Optimizations
            </Button>
          </Card>
        </Grid>

        {/* Card 3: Risk Prediction */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '16px',
              p: 2.25,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 12px 20px -10px rgba(139, 92, 246, 0.15), 0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
                  : '0 12px 20px -10px rgba(139, 92, 246, 0.1), 0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                borderColor: '#8b5cf6',
              }
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.75 }}>
                <Box sx={{ p: 0.75, borderRadius: '8px', backgroundColor: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.12)', display: 'flex' }}>
                  <ShieldRoundedIcon sx={{ color: '#8b5cf6', fontSize: 16 }} />
                </Box>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '0.85rem' }}>
                  Risk Prediction
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.725rem', lineHeight: 1.5, mb: 2 }}>
                Upcoming <span style={{ color: theme.palette.text.primary, fontWeight: 700 }}>v3.1 rollout</span> has a <span style={{ color: '#8b5cf6', fontWeight: 700 }}>22% risk</span> of memory leaks based on staging data patterns.
              </Typography>
            </Box>

            <Box sx={{ mb: 2.25 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.625rem' }}>Staging Stability</Typography>
                <Typography variant="caption" sx={{ color: '#8b5cf6', fontWeight: 800, fontSize: '0.675rem' }}>Medium</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={55}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'divider',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#8b5cf6', borderRadius: 2 },
                }}
              />
            </Box>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: 'divider',
                backgroundColor: 'transparent',
                color: 'text.primary',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.7rem',
                py: 0.75,
                borderRadius: '8px',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              Run Pre-flight Simulation
            </Button>
          </Card>
        </Grid>

      </Grid>

      {/* Row 3: Intelligence Event Log */}
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
              ? '0 12px 20px -10px rgba(100, 116, 139, 0.15), 0 4px 20px 0 rgba(0, 0, 0, 0.3)' 
              : '0 12px 20px -10px rgba(100, 116, 139, 0.1), 0 4px 20px 0 rgba(0, 0, 0, 0.05)',
            borderColor: 'text.secondary',
          }
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ListRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.775rem' }}>
                Intelligence Event Log
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#3b82f6' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3b82f6' }
                  }}
                />
              }
              label="Auto-scrolling logs"
              sx={{
                margin: 0,
                color: 'text.secondary',
                '& .MuiFormControlLabel-label': { fontSize: '0.675rem', fontWeight: 700 }
              }}
            />
          </Box>

          {/* Mini scroll logs panel */}
          <Box
            sx={{
              backgroundColor: isDark ? '#030712' : '#f8fafc',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'divider',
              p: 1.5,
              maxHeight: '120px',
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.725rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <span style={{ color: logColors.timestamp }}>2026-06-16 17:05:51</span>
              <span style={{ color: logColors.info, fontWeight: 700 }}>[INFO]</span>
              <span style={{ color: logColors.message }}>Real-time cluster health logs scanner attached successfully.</span>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <span style={{ color: logColors.timestamp }}>2026-06-16 17:05:48</span>
              <span style={{ color: logColors.success, fontWeight: 700 }}>[SUCCESS]</span>
              <span style={{ color: logColors.message }}>Predictive models successfully analyzed 124 workloads. No critical vulnerabilities found.</span>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <span style={{ color: logColors.timestamp }}>2026-06-16 17:05:40</span>
              <span style={{ color: logColors.warn, fontWeight: 700 }}>[WARN]</span>
              <span style={{ color: logColors.message }}>Memory limit ceiling warning detected on auth-service v2 replica nodes.</span>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
    </Box>
  );
}
