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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const initialServices = [
  { name: 'api-gateway', namespace: 'production', type: 'LoadBalancer', clusterIp: '10.96.15.24', externalIp: '34.120.45.67', ports: '80:31456/TCP', age: '4d 12h' },
  { name: 'auth-service', namespace: 'production', type: 'ClusterIP', clusterIp: '10.96.12.80', externalIp: 'None', ports: '8080/TCP', age: '4d 12h' },
  { name: 'payment-processor', namespace: 'production', type: 'ClusterIP', clusterIp: '10.96.88.94', externalIp: 'None', ports: '9000/TCP', age: '2d 6h' },
  { name: 'frontend-web', namespace: 'production', type: 'LoadBalancer', clusterIp: '10.96.44.101', externalIp: '34.120.45.99', ports: '80:30855/TCP', age: '10d' },
  { name: 'redis-master', namespace: 'data-tier', type: 'ClusterIP', clusterIp: '10.96.250.11', externalIp: 'None', ports: '6379/TCP', age: '12d' },
  { name: 'redis-replica', namespace: 'data-tier', type: 'ClusterIP', clusterIp: '10.96.250.12', externalIp: 'None', ports: '6379/TCP', age: '12d' },
  { name: 'report-generator', namespace: 'background-jobs', type: 'ClusterIP', clusterIp: '10.96.50.33', externalIp: 'None', ports: '5000/TCP', age: '5d' },
];

export default function Services() {
  const [services] = useState(initialServices);
  const [search, setSearch] = useState('');
  const [namespaceFilter, setNamespaceFilter] = useState('all');

  const filteredServices = services.filter(svc => {
    const matchesSearch = svc.name.toLowerCase().includes(search.toLowerCase());
    const matchesNamespace = namespaceFilter === 'all' || svc.namespace === namespaceFilter;
    return matchesSearch && matchesNamespace;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'LoadBalancer':
        return 'primary';
      case 'ClusterIP':
        return 'secondary';
      case 'NodePort':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: 'background.default', minHeight: 'calc(100vh - 70px)', transition: 'background-color 0.3s ease' }}>
      {/* Title */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.5px' }}>
            Services Networking
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage endpoints, service-discovery, internal clustering, and external load-balancers.
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
            placeholder="Filter services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ color: 'text.primary', width: '100%', fontSize: '0.875rem' }}
          />
        </Box>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={namespaceFilter}
            onChange={(e) => setNamespaceFilter(e.target.value)}
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
            <MenuItem value="all">All Namespaces</MenuItem>
            <MenuItem value="production">production</MenuItem>
            <MenuItem value="data-tier">data-tier</MenuItem>
            <MenuItem value="background-jobs">background-jobs</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Service Name</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Namespace</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Type</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Cluster IP</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>External IP</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Ports</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Age</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.map((svc) => (
              <TableRow key={svc.name} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell sx={{ color: 'text.primary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>{svc.name}</TableCell>
                <TableCell sx={{ color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Chip
                    label={svc.namespace}
                    size="small"
                    sx={{
                      backgroundColor: 'action.selected',
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                      height: '20px',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Chip
                    label={svc.type}
                    size="small"
                    color={getTypeColor(svc.type)}
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                  />
                </TableCell>
                <TableCell sx={{ color: 'text.primary', fontFamily: 'monospace', borderBottom: '1px solid', borderColor: 'divider' }}>{svc.clusterIp}</TableCell>
                <TableCell sx={{ color: svc.externalIp === 'None' ? 'text.secondary' : 'primary.main', fontWeight: svc.externalIp === 'None' ? 400 : 600, fontFamily: svc.externalIp === 'None' ? 'inherit' : 'monospace', borderBottom: '1px solid', borderColor: 'divider' }}>
                  {svc.externalIp}
                </TableCell>
                <TableCell sx={{ color: 'text.primary', fontFamily: 'monospace', borderBottom: '1px solid', borderColor: 'divider' }}>{svc.ports}</TableCell>
                <TableCell sx={{ color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider' }}>{svc.age}</TableCell>
                <TableCell align="right" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                  {svc.externalIp !== 'None' ? (
                    <IconButton size="small" href={`http://${svc.externalIp}`} target="_blank" sx={{ color: 'primary.main' }}>
                      <OpenInNewIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary', pr: 1.5 }}>-</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

  );
}
