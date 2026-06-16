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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RefreshIcon from '@mui/icons-material/Refresh';

const initialNamespaces = [
  { name: 'default', status: 'Active', podsCount: 0, memoryLimit: 'No Limit', age: '30d' },
  { name: 'production', status: 'Active', podsCount: 48, memoryLimit: '24 GB / 32 GB', memoryPct: 75, age: '28d' },
  { name: 'data-tier', status: 'Active', podsCount: 12, memoryLimit: '16 GB / 16 GB', memoryPct: 100, age: '28d' },
  { name: 'background-jobs', status: 'Active', podsCount: 22, memoryLimit: '8 GB / 16 GB', memoryPct: 50, age: '20d' },
  { name: 'kube-system', status: 'Active', podsCount: 14, memoryLimit: 'No Limit', age: '30d' },
  { name: 'kube-public', status: 'Active', podsCount: 0, memoryLimit: 'No Limit', age: '30d' },
  { name: 'temp-sandbox-99', status: 'Terminating', podsCount: 2, memoryLimit: '2 GB / 4 GB', memoryPct: 50, age: '2h' },
];

export default function Namespaces() {
  const [namespaces, setNamespaces] = useState(initialNamespaces);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newNsName, setNewNsName] = useState('');

  const handleCreateNamespace = () => {
    if (newNsName.trim()) {
      setNamespaces([
        ...namespaces,
        {
          name: newNsName.toLowerCase().trim(),
          status: 'Active',
          podsCount: 0,
          memoryLimit: 'No Limit',
          age: '1m',
        },
      ]);
      setNewNsName('');
      setOpenDialog(false);
    }
  };

  const handleDeleteNamespace = (name) => {
    setNamespaces(namespaces.map(ns => {
      if (ns.name === name) {
        return { ...ns, status: 'Terminating' };
      }
      return ns;
    }));
  };

  const filteredNamespaces = namespaces.filter(ns =>
    ns.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: 'background.default', minHeight: 'calc(100vh - 70px)', transition: 'background-color 0.3s ease' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.5px' }}>
            Namespaces
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Partition cluster resources into virtual sub-clusters.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <IconButton sx={{ color: 'text.secondary', border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ fontWeight: 600 }}
          >
            Create Namespace
          </Button>
        </Box>
      </Box>

      {/* Filter */}
      <Box sx={{ display: 'flex', mb: 3 }}>
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
            placeholder="Filter namespaces..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ color: 'text.primary', width: '100%', fontSize: '0.875rem' }}
          />
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Namespace Name</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Status</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Pods Count</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Memory Quota Limit</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Age</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNamespaces.map((ns) => (
              <TableRow key={ns.name} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell sx={{ color: 'text.primary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider' }}>{ns.name}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Chip
                    label={ns.status}
                    size="small"
                    color={ns.status === 'Active' ? 'success' : 'error'}
                    sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                  />
                </TableCell>
                <TableCell sx={{ color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>{ns.podsCount}</TableCell>
                <TableCell sx={{ width: '250px', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.5, fontWeight: 500 }}>
                      {ns.memoryLimit}
                    </Typography>
                    {ns.memoryPct !== undefined && (
                      <LinearProgress
                        variant="determinate"
                        value={ns.memoryPct}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: 'action.selected',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: ns.memoryPct === 100 ? 'error.main' : 'primary.main',
                          },
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider' }}>{ns.age}</TableCell>
                <TableCell align="right" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                  {ns.name !== 'default' && ns.name !== 'kube-system' && ns.status === 'Active' ? (
                    <IconButton
                      size="small"
                      sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                      onClick={() => handleDeleteNamespace(ns.name)}
                    >
                      <DeleteRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary', pr: 1.5 }}>Protected</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px',
            color: 'text.primary',
            width: '400px',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Namespace</DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <TextField
            autoFocus
            label="Namespace Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newNsName}
            onChange={(e) => setNewNsName(e.target.value)}
            InputLabelProps={{
              sx: { color: 'text.secondary' }
            }}
            sx={{
              '& label.Mui-focused': { color: 'primary.main' },
              '& .MuiOutlinedInput-root': {
                color: 'text.primary',
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'text.secondary' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleCreateNamespace} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>

  );
}
