import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  InputBase,
  Chip,
  Divider,
} from '@mui/material';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import { useClusterStore, clusterStore } from '../store/clusterStore';

export default function KubeTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { text: 'Welcome to KubeTerminal v1.0.0 (Dynamic DevOps Simulator Console)', type: 'system' },
    { text: "Type 'help' to list all supported simulated kubectl commands.", type: 'system' },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [storeState] = useClusterStore();

  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const addHistoryLine = (text, type = 'output') => {
    setHistory((prev) => [...prev, { text, type }]);
  };

  const handleCommandSubmit = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    addHistoryLine(`kubeops@cluster:~$ ${trimmed}`, 'command');
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];

    if (cmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    if (cmd === 'help') {
      addHistoryLine('Supported commands:', 'system');
      addHistoryLine('  help                                       - List all commands');
      addHistoryLine('  clear                                      - Clear terminal logs');
      addHistoryLine('  kubectl get nodes                          - Show cluster nodes state');
      addHistoryLine('  kubectl get namespaces                     - Show namespaces list');
      addHistoryLine('  kubectl get deployments                    - List deployments');
      addHistoryLine('  kubectl get pods [-n <namespace>]          - List pods (all or filtered by ns)');
      addHistoryLine('  kubectl scale deployment <name> --replicas=<num>  - Scale replica count');
      addHistoryLine('  kubectl delete pod <pod-name>              - Terminate pod instance');
      addHistoryLine('  kubectl logs <pod-name>                    - Print pod standard output logs');
      setInputVal('');
      return;
    }

    // Parse kubectl command
    if (cmd === 'kubectl') {
      const action = parts[1];
      const resource = parts[2];

      if (action === 'get') {
        if (resource === 'nodes') {
          // Format nodes table
          addHistoryLine('NAME             STATUS    ROLES     AGE    CPU%    MEM%');
          storeState.nodes.forEach((n) => {
            addHistoryLine(
              `${n.name.padEnd(16)} ${n.status.padEnd(9)} ${n.role.padEnd(9)} 28d    ${String(
                n.cpu
              ).padStart(3)}%    ${String(n.mem).padStart(3)}%`
            );
          });
        } else if (resource === 'namespaces') {
          addHistoryLine('NAME              STATUS   AGE');
          addHistoryLine('default           Active   30d');
          addHistoryLine('production        Active   28d');
          addHistoryLine('infrastructure    Active   28d');
          addHistoryLine('background-jobs   Active   20d');
          addHistoryLine('kube-system       Active   30d');
        } else if (resource === 'deployments') {
          addHistoryLine('NAME              READY   UP-TO-DATE   AVAILABLE   AGE');
          storeState.deployments.forEach((d) => {
            addHistoryLine(
              `${d.name.padEnd(17)} ${d.replicasReady}/${d.replicasTotal}`.padEnd(25) +
                ` ${d.replicasTotal}`.padEnd(13) +
                ` ${d.replicasReady}`.padEnd(12) +
                ' 4d12h'
            );
          });
        } else if (resource === 'pods') {
          // Check for namespace option -n
          let ns = null;
          const nIndex = parts.indexOf('-n');
          if (nIndex !== -1 && parts[nIndex + 1]) {
            ns = parts[nIndex + 1];
          }

          addHistoryLine('NAME'.padEnd(32) + 'READY   STATUS      RESTARTS   AGE    NODE');
          const filteredPods = ns ? storeState.pods.filter((p) => p.namespace === ns) : storeState.pods;

          filteredPods.forEach((p) => {
            addHistoryLine(
              `${p.name.padEnd(31)} 1/1     ${p.status.padEnd(11)} ${String(p.restarts).padEnd(10)} ${p.age.padEnd(6)} ${p.node}`
            );
          });
        } else {
          addHistoryLine("Error: resource type not found. Use 'nodes', 'namespaces', 'deployments' or 'pods'.", 'error');
        }
      } else if (action === 'scale') {
        if (resource === 'deployment' && parts[3]) {
          const depName = parts[3];
          const repArg = parts.find((p) => p.startsWith('--replicas='));
          if (repArg) {
            const count = parseInt(repArg.split('=')[1], 10);
            if (!isNaN(count)) {
              clusterStore.scaleDeployment(depName, count);
              addHistoryLine(`deployment.apps/${depName} scaled successfully to ${count}`, 'success');
            } else {
              addHistoryLine('Error: invalid replica quantity.', 'error');
            }
          } else {
            addHistoryLine("Error: missing replica flag (e.g. '--replicas=5')", 'error');
          }
        } else {
          addHistoryLine("Error: scale target invalid. Syntax: 'kubectl scale deployment <name> --replicas=<num>'", 'error');
        }
      } else if (action === 'delete') {
        if (resource === 'pod' && parts[3]) {
          const podName = parts[3];
          const exists = storeState.pods.some((p) => p.name === podName);
          if (exists) {
            clusterStore.deletePod(podName);
            addHistoryLine(`pod "${podName}" deleted gracefully`, 'success');
          } else {
            addHistoryLine(`Error: pod "${podName}" not found.`, 'error');
          }
        } else {
          addHistoryLine("Error: delete syntax invalid. Syntax: 'kubectl delete pod <pod-name>'", 'error');
        }
      } else if (action === 'logs' && parts[2]) {
        const podName = parts[2];
        const pod = storeState.pods.find((p) => p.name === podName);
        if (pod) {
          addHistoryLine(`--- Streaming STDOUT logs for ${podName} ---`, 'system');
          addHistoryLine(`[2026-06-17T09:12:44Z] INFO Initializing server listener on port 8080`);
          addHistoryLine(`[2026-06-17T09:12:45Z] INFO Database connectivity pool online (max_conns=100)`);
          addHistoryLine(`[2026-06-17T09:13:02Z] INFO Incoming payload size: 2.34KB from ingress-nginx`);
          addHistoryLine(`[2026-06-17T09:14:15Z] DEBUG Health probe check GET /healthz 200 OK`);
          addHistoryLine(`[2026-06-17T09:15:30Z] INFO Cache layer sync complete (32 keys refreshed)`);
        } else {
          addHistoryLine(`Error: pod "${podName}" not found.`, 'error');
        }
      } else {
        addHistoryLine(`Error: unknown command action "${action}".`, 'error');
      }
      setInputVal('');
      return;
    }

    addHistoryLine(`bash: command not found: ${cmd}`, 'error');
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommandSubmit(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex === commandHistory.length - 1 ? -1 : historyIndex + 1;
      setHistoryIndex(nextIdx);
      setInputVal(nextIdx === -1 ? '' : commandHistory[nextIdx]);
    }
  };

  const suggestions = [
    'kubectl get pods',
    'kubectl get deployments',
    'kubectl get nodes',
    'kubectl get namespaces',
    'help',
  ];

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1100 }}>
      {/* Floating Action Button */}
      {!isOpen && (
        <Tooltip title="Toggle KubeTerminal Shell" arrow placement="left">
          <IconButton
            onClick={() => setIsOpen(true)}
            sx={{
              width: 54,
              height: 54,
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: `0 4px 20px ${clusterStore.getState().themeMode === 'dark' ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.15)'}, 0 0 12px ${storeState.accentColor === 'orange' ? 'rgba(249,115,22,0.45)' : 'rgba(59,130,246,0.45)'}`,
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <TerminalRoundedIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Tooltip>
      )}

      {/* Terminal Overlay Console */}
      {isOpen && (
        <Paper
          elevation={16}
          sx={{
            width: '620px',
            height: '420px',
            backgroundColor: '#050811',
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Header */}
          <Box sx={{ px: 2, py: 1.25, backgroundColor: '#0c0f1b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TerminalRoundedIcon sx={{ color: 'primary.main', fontSize: 18 }} />
              <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                kubectl-shell-emulator
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => setHistory([])} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                <DeleteSweepRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'text.secondary', '&:hover': { color: '#ffffff' } }}>
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Terminal History */}
          <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0.75, fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: 1.4, color: '#f8fafc' }}>
            {history.map((line, idx) => {
              let color = '#f8fafc';
              if (line.type === 'command') color = '#fbbf24'; // yellow
              else if (line.type === 'system') color = 'primary.main';
              else if (line.type === 'error') color = '#ef4444'; // red
              else if (line.type === 'success') color = '#10b981'; // green

              return (
                <Typography key={idx} sx={{ fontFamily: 'monospace', fontSize: '0.725rem', color, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {line.text}
                </Typography>
              );
            })}
            <div ref={terminalEndRef} />
          </Box>

          {/* Autocomplete Helper suggestions */}
          <Box sx={{ px: 2, py: 0.75, backgroundColor: '#070a14', display: 'flex', gap: 1, overflowX: 'auto', flexWrap: 'nowrap', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            {suggestions.map((s) => (
              <Chip
                key={s}
                label={s}
                size="small"
                onClick={() => setInputVal(s)}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'text.secondary',
                  fontFamily: 'monospace',
                  fontSize: '0.65rem',
                  height: '20px',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    color: '#ffffff',
                  },
                }}
              />
            ))}
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />

          {/* CommandLine Input */}
          <Box sx={{ px: 2, py: 1.5, backgroundColor: '#090d19', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color: '#10b981', fontWeight: 800, fontSize: '0.75rem', fontFamily: 'monospace', mr: 1, userSelect: 'none' }}>
              kubeops@cluster:~$
            </Typography>
            <InputBase
              inputRef={inputRef}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="kubectl get pods..."
              sx={{
                color: '#ffffff',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                width: '100%',
              }}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
}
