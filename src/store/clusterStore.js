import { useState, useEffect } from 'react';

// Default initial state data
const initialDeployments = [
  {
    name: 'api-gateway',
    ns: 'production',
    strategy: 'RollingUpdate',
    replicasReady: 8,
    replicasTotal: 8,
    status: 'Ready',
    cpu: '2.4 vCPU',
    memory: '4.8 GB RAM',
    iconBg: 'rgba(59, 130, 246, 0.08)',
    iconBorder: 'rgba(59, 130, 246, 0.12)',
    progressColor: '#3b82f6',
  },
  {
    name: 'auth-service',
    ns: 'production',
    strategy: 'Recreate',
    replicasReady: 3,
    replicasTotal: 4,
    status: 'Updating',
    cpu: '1.2 vCPU',
    memory: '2.1 GB RAM',
    iconBg: 'rgba(163, 116, 255, 0.08)',
    iconBorder: 'rgba(163, 116, 255, 0.12)',
    progressColor: '#a374ff',
  },
  {
    name: 'payment-db-sync',
    ns: 'infrastructure',
    strategy: 'RollingUpdate',
    replicasReady: 2,
    replicasTotal: 2,
    status: 'Ready',
    cpu: '0.8 vCPU',
    memory: '1.5 GB RAM',
    iconBg: 'rgba(16, 185, 129, 0.08)',
    iconBorder: 'rgba(16, 185, 129, 0.12)',
    progressColor: '#10b981',
  },
];

const initialPods = [
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
];

const initialEvents = [
  { time: '2m', type: 'Warning', reason: 'BackOff', object: 'Pod/notifications-worker-341d-dff89', message: 'Back-off restarting failed container worker in pod notifications-worker' },
  { time: '5m', type: 'Normal', reason: 'Scheduled', object: 'Pod/worker-node-03-7bf9c8d-aa11b', message: 'Successfully assigned background-jobs/worker-node-03-7bf9c8d-aa11b to node-03' },
  { time: '12m', type: 'Normal', reason: 'Pulling', object: 'Pod/worker-node-03-7bf9c8d-aa11b', message: 'Pulling image "nginx:alpine"' },
  { time: '15m', type: 'Normal', reason: 'ScaleUp', object: 'Deployment/frontend-web', message: 'Scaled up replica set frontend-web to 5' },
  { time: '45m', type: 'Warning', reason: 'FailedMount', object: 'Pod/redis-master-0', message: 'MountVolume.SetUp failed for volume "redis-data" : conn refused' },
  { time: '1h', type: 'Normal', reason: 'Created', object: 'Pod/redis-master-0', message: 'Created container redis-master' },
  { time: '2h', type: 'Normal', reason: 'Started', object: 'Pod/redis-master-0', message: 'Started container redis-master' },
  { time: '4h', type: 'Normal', reason: 'Pulled', object: 'Pod/auth-service-5c6d7e8f-xyz34', message: 'Successfully pulled image "auth-svc:v2.1.0" in 2.34s' },
];

const initialNodes = [
  { name: 'node-master-01', role: 'Master', ip: '192.168.1.100', cpu: 45, mem: 60, status: 'Online', slots: [1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0] },
  { name: 'node-worker-01', role: 'Worker', ip: '192.168.1.101', cpu: 78, mem: 82, status: 'Online', slots: [1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 0, 0] },
  { name: 'node-worker-02', role: 'Worker', ip: '192.168.1.102', cpu: 28, mem: 40, status: 'Online', slots: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0] }
];

const initialTimelineData = [
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

let state = {
  themeMode: 'dark',
  accentColor: 'blue',
  simulatorOpen: false,
  deployments: initialDeployments,
  pods: initialPods,
  events: initialEvents,
  nodes: initialNodes,
  timelineData: initialTimelineData,
  healthScore: 94,
  uptime: '99.98%',
  latency: '12ms',
  trafficSpike: false,
  nodeOutage: false,
};

let listeners = [];

export const clusterStore = {
  getState() {
    return state;
  },
  
  setState(updater) {
    if (typeof updater === 'function') {
      state = { ...state, ...updater(state) };
    } else {
      state = { ...state, ...updater };
    }
    listeners.forEach(l => l(state));
  },
  
  subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },

  // Actions
  scaleDeployment(name, replicas) {
    this.setState(s => {
      // Find deployment
      const updatedDeployments = s.deployments.map(d => {
        if (d.name === name) {
          const isReady = replicas === d.replicasReady; // simplify
          return {
            ...d,
            replicasTotal: replicas,
            replicasReady: replicas, // instantly ready for simulation simplicity
            status: 'Ready',
            progressColor: '#10b981'
          };
        }
        return d;
      });

      // Synchronize Pods list: match quantity
      const existingPodsOfDep = s.pods.filter(p => p.deployment === name);
      const otherPods = s.pods.filter(p => p.deployment !== name);
      
      const newPodsOfDep = [...existingPodsOfDep];
      if (newPodsOfDep.length < replicas) {
        // Add pods
        for (let i = newPodsOfDep.length + 1; i <= replicas; i++) {
          const nodes = ['node-master-01', 'node-worker-01', 'node-worker-02'];
          const node = nodes[Math.floor(Math.random() * nodes.length)];
          newPodsOfDep.push({
            name: `${name}-scaled-${Math.random().toString(36).substring(7)}`,
            deployment: name,
            namespace: name === 'payment-db-sync' ? 'infrastructure' : 'production',
            status: 'RUNNING',
            cpu: '120m',
            cpuPercent: 40,
            memory: '250 Mi',
            restarts: 0,
            age: '1s',
            node
          });
        }
      } else if (newPodsOfDep.length > replicas) {
        // Remove pods
        newPodsOfDep.splice(replicas);
      }

      // Add a scale event
      const newEvent = {
        time: 'Now',
        type: 'Normal',
        reason: 'ScaleUp',
        object: `Deployment/${name}`,
        message: `Scaled replica set ${name} to ${replicas} in cluster`
      };

      return {
        deployments: updatedDeployments,
        pods: [...otherPods, ...newPodsOfDep],
        events: [newEvent, ...s.events]
      };
    });
  },

  restartDeployment(name) {
    this.setState(s => {
      // Set deployment to Updating
      const updatedDeployments = s.deployments.map(d => {
        if (d.name === name) {
          return {
            ...d,
            status: 'Updating',
            progressColor: '#3b82f6'
          };
        }
        return d;
      });

      // Update pods status to PENDING/restarting
      const updatedPods = s.pods.map(p => {
        if (p.deployment === name) {
          return {
            ...p,
            status: 'PENDING',
            restarts: p.restarts + 1,
            cpu: '--',
            cpuPercent: 0,
          };
        }
        return p;
      });

      const newEvent = {
        time: 'Now',
        type: 'Normal',
        reason: 'RollingRestart',
        object: `Deployment/${name}`,
        message: `Initiated rolling restart of all replicas for deployment ${name}`
      };

      // Set timeout to return them to Running state after 3 seconds
      setTimeout(() => {
        this.setState(current => {
          const finishedDeployments = current.deployments.map(d => {
            if (d.name === name) {
              return { ...d, status: 'Ready', progressColor: '#10b981' };
            }
            return d;
          });
          const finishedPods = current.pods.map(p => {
            if (p.deployment === name) {
              return { ...p, status: 'RUNNING', cpu: '115m', cpuPercent: 38 };
            }
            return p;
          });
          return {
            deployments: finishedDeployments,
            pods: finishedPods
          };
        });
      }, 3000);

      return {
        deployments: updatedDeployments,
        pods: updatedPods,
        events: [newEvent, ...s.events]
      };
    });
  },

  deletePod(name) {
    this.setState(s => {
      const podToDelete = s.pods.find(p => p.name === name);
      if (!podToDelete) return {};

      const newEvent = {
        time: 'Now',
        type: 'Normal',
        reason: 'Killing',
        object: `Pod/${name}`,
        message: `Stopping container instance ${name} gracefully`
      };

      // Remove pod
      const filteredPods = s.pods.filter(p => p.name !== name);

      // Decrement deployment counts
      const updatedDeployments = s.deployments.map(d => {
        if (d.name === podToDelete.deployment) {
          return {
            ...d,
            replicasTotal: Math.max(0, d.replicasTotal - 1),
            replicasReady: Math.max(0, d.replicasReady - 1),
          };
        }
        return d;
      });

      return {
        pods: filteredPods,
        deployments: updatedDeployments,
        events: [newEvent, ...s.events]
      };
    });
  },

  // Incident Simulators
  simulatePodCrash() {
    this.setState(s => {
      // Find a running pod
      const runningPods = s.pods.filter(p => p.status === 'RUNNING');
      if (runningPods.length === 0) return {};

      const randomPod = runningPods[Math.floor(Math.random() * runningPods.length)];
      
      const updatedPods = s.pods.map(p => {
        if (p.name === randomPod.name) {
          return {
            ...p,
            status: 'FAILED',
            restarts: p.restarts + 1,
            cpu: '--',
            cpuPercent: 0,
            memory: '--'
          };
        }
        return p;
      });

      const newEvent = {
        time: 'Now',
        type: 'Warning',
        reason: 'BackOff',
        object: `Pod/${randomPod.name}`,
        message: `Back-off restarting failed container in pod ${randomPod.name} (exit code 137)`
      };

      return {
        pods: updatedPods,
        events: [newEvent, ...s.events],
        healthScore: Math.max(50, s.healthScore - 6)
      };
    });
  },

  fixCrashedPods() {
    this.setState(s => {
      const failedPods = s.pods.filter(p => p.status === 'FAILED' && p.name !== 'worker-node-03-err'); // Keep the static failed worker node
      if (failedPods.length === 0) return {};

      const updatedPods = s.pods.map(p => {
        if (p.status === 'FAILED' && p.name !== 'worker-node-03-err') {
          return {
            ...p,
            status: 'RUNNING',
            cpu: '110m',
            cpuPercent: 36,
            memory: '220 Mi'
          };
        }
        return p;
      });

      const newEvents = failedPods.map(p => ({
        time: 'Now',
        type: 'Normal',
        reason: 'Started',
        object: `Pod/${p.name}`,
        message: `Successfully restarted container in pod ${p.name}`
      }));

      return {
        pods: updatedPods,
        events: [...newEvents, ...s.events],
        healthScore: 94
      };
    });
  },

  simulateNodeOutage() {
    this.setState(s => {
      if (s.nodeOutage) return {};

      // Set node-worker-01 status to Offline
      const updatedNodes = s.nodes.map(n => {
        if (n.name === 'node-worker-01') {
          return { ...n, status: 'Offline', cpu: 0, mem: 0, slots: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
        }
        return n;
      });

      // Fail all pods on node-worker-01
      const updatedPods = s.pods.map(p => {
        if (p.node === 'node-worker-01') {
          return { ...p, status: 'FAILED', cpu: '--', cpuPercent: 0, memory: '--' };
        }
        return p;
      });

      const newEvent = {
        time: 'Now',
        type: 'Warning',
        reason: 'NodeNotReady',
        object: 'Node/node-worker-01',
        message: 'Node node-worker-01 status changed to NotReady (Connection timeout)'
      };

      return {
        nodes: updatedNodes,
        pods: updatedPods,
        events: [newEvent, ...s.events],
        nodeOutage: true,
        healthScore: 72,
        latency: '85ms',
      };
    });
  },

  restoreNodeOutage() {
    this.setState(s => {
      if (!s.nodeOutage) return {};

      const updatedNodes = s.nodes.map(n => {
        if (n.name === 'node-worker-01') {
          return { ...n, status: 'Online', cpu: 78, mem: 82, slots: [1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 0, 0] };
        }
        return n;
      });

      const updatedPods = s.pods.map(p => {
        if (p.node === 'node-worker-01' && p.name !== 'worker-node-03-err') {
          return { ...p, status: 'RUNNING', cpu: '82m', cpuPercent: 28, memory: '128 Mi' };
        }
        return p;
      });

      const newEvent = {
        time: 'Now',
        type: 'Normal',
        reason: 'NodeReady',
        object: 'Node/node-worker-01',
        message: 'Node node-worker-01 status changed to Ready (Connection restored)'
      };

      return {
        nodes: updatedNodes,
        pods: updatedPods,
        events: [newEvent, ...s.events],
        nodeOutage: false,
        healthScore: 94,
        latency: '12ms',
      };
    });
  },

  simulateTrafficSpike() {
    this.setState(s => {
      // Double CPU usage on all pods
      const updatedPods = s.pods.map(p => {
        if (p.status === 'RUNNING') {
          const oldPercent = p.cpuPercent || 30;
          const newPercent = Math.min(98, oldPercent * 2.1);
          return {
            ...p,
            cpuPercent: newPercent,
            cpu: `${Math.round(newPercent * 3)}m`
          };
        }
        return p;
      });

      // Update Node CPU allocations
      const updatedNodes = s.nodes.map(n => {
        if (n.status === 'Online') {
          return { ...n, cpu: Math.min(99, Math.round(n.cpu * 1.5)) };
        }
        return n;
      });

      // Update timeline chart with a spike
      const updatedTimeline = s.timelineData.map((t, idx) => {
        if (idx >= s.timelineData.length - 3) {
          return { ...t, cpu: Math.min(98, t.cpu + 35), network: Math.min(95, t.network + 60) };
        }
        return t;
      });

      const newEvent = {
        time: 'Now',
        type: 'Normal',
        reason: 'TrafficSpike',
        object: 'Ingress/production-ingress',
        message: 'Traffic volume spiked by +240% (current rate: 8.4k rps)'
      };

      return {
        pods: updatedPods,
        nodes: updatedNodes,
        timelineData: updatedTimeline,
        events: [newEvent, ...s.events],
        trafficSpike: true,
        latency: '34ms',
      };
    });
  },

  resetTraffic() {
    this.setState(s => {
      const updatedPods = s.pods.map(p => {
        if (p.status === 'RUNNING') {
          const basePod = initialPods.find(bp => bp.name === p.name);
          return {
            ...p,
            cpuPercent: basePod ? basePod.cpuPercent : 30,
            cpu: basePod ? basePod.cpu : '90m'
          };
        }
        return p;
      });

      const updatedNodes = s.nodes.map((n, idx) => {
        const baseNode = initialNodes.find(bn => bn.name === n.name);
        return {
          ...n,
          cpu: baseNode ? baseNode.cpu : n.cpu
        };
      });

      return {
        pods: updatedPods,
        nodes: updatedNodes,
        timelineData: initialTimelineData,
        trafficSpike: false,
        latency: '12ms'
      };
    });
  },

  triggerSecurityIncident() {
    this.setState(s => {
      const newEvent = {
        time: 'Now',
        type: 'Warning',
        reason: 'SecurityAlert',
        object: 'Ingress/production-ingress',
        message: 'SQL Injection attempt detected and blocked from IP 185.220.101.4'
      };
      
      // We can drop health slightly
      return {
        events: [newEvent, ...s.events],
        healthScore: Math.max(50, s.healthScore - 4)
      };
    });
  }
};

// Global Store Custom React Hook
export const useClusterStore = () => {
  const [storeState, setStoreState] = useState(state);
  
  useEffect(() => {
    return clusterStore.subscribe(setStoreState);
  }, []);
  
  const updateStore = (updater) => {
    clusterStore.setState(updater);
  };
  
  return [storeState, updateStore];
};
