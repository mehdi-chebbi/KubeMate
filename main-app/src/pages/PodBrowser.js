import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Search, RefreshCw, Server, Activity, AlertCircle, CheckCircle, FileText, X, Copy, Download } from 'lucide-react';
import { apiService } from '../services/apiService';

const PodBrowser = ({ user, onLogout }) => {
  const [podsData, setPodsData] = useState({ namespaces: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNamespaces, setExpandedNamespaces] = useState(new Set());
  const [lastRefresh, setLastRefresh] = useState(null);
  
  // Logs modal state
  const [logsModal, setLogsModal] = useState({ isOpen: false, podName: '', namespace: '', logs: '', loading: false, error: '' });

  useEffect(() => {
    fetchPods();
  }, []);

  const fetchPods = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Use real API call
      const response = await apiService.getPods();
      
      if (response.success) {
        setPodsData({ namespaces: response.namespaces });
        setLastRefresh(new Date());
        
        // Auto-expand first namespace
        if (response.namespaces.length > 0) {
          setExpandedNamespaces(new Set([response.namespaces[0].name]));
        }
      } else {
        setError(response.error || 'Failed to load pod data');
      }
      
    } catch (error) {
      console.error('Failed to fetch pods:', error);
      setError('Failed to load pod data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPodLogs = async (namespace, podName) => {
    setLogsModal({ isOpen: true, podName, namespace, logs: '', loading: true, error: '' });
    
    try {
      const response = await apiService.getPodLogs(namespace, podName);
      
      if (response.success) {
        setLogsModal({ 
          isOpen: true, 
          podName: response.podName, 
          namespace: response.namespace, 
          logs: response.logs, 
          loading: false, 
          error: '' 
        });
      } else {
        setLogsModal({ 
          isOpen: true, 
          podName, 
          namespace, 
          logs: '', 
          loading: false, 
          error: response.error || 'Failed to fetch pod logs' 
        });
      }
      
    } catch (error) {
      console.error('Failed to fetch pod logs:', error);
      setLogsModal({ 
        isOpen: true, 
        podName, 
        namespace, 
        logs: '', 
        loading: false, 
        error: 'Failed to fetch pod logs. Please try again.' 
      });
    }
  };

  const closeLogsModal = () => {
    setLogsModal({ isOpen: false, podName: '', namespace: '', logs: '', loading: false, error: '' });
  };

  const copyLogsToClipboard = () => {
    navigator.clipboard.writeText(logsModal.logs);
    // You could add a toast notification here
  };

  const downloadLogs = () => {
    const blob = new Blob([logsModal.logs], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${logsModal.podName}-${logsModal.namespace}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const toggleNamespace = (namespaceName) => {
    setExpandedNamespaces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(namespaceName)) {
        newSet.delete(namespaceName);
      } else {
        newSet.add(namespaceName);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'running':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Activity className="w-4 h-4 text-yellow-400" />;
      case 'crashloopbackoff':
      case 'error':
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Server className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'running':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'crashloopbackoff':
      case 'error':
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const filterPods = (data) => {
    if (!searchTerm) return data;
    
    const filtered = { namespaces: [] };
    
    data.namespaces.forEach(namespace => {
      const filteredPods = namespace.pods.filter(pod =>
        pod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        namespace.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filteredPods.length > 0) {
        filtered.namespaces.push({
          ...namespace,
          pods: filteredPods,
          pod_count: filteredPods.length
        });
      }
    });
    
    return filtered;
  };

  const filteredData = filterPods(podsData);

  return (
    <div className="k8s-container min-h-screen flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="k8s-glass border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Server className="w-8 h-8 text-k8s-blue" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Pod Browser</h1>
                  <p className="text-k8s-gray text-sm">
                    Browse and manage Kubernetes pods across all namespaces
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchPods}
                  disabled={loading}
                  className="k8s-button-secondary flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <a
                  href="/user/dashboard"
                  className="k8s-button-secondary flex items-center gap-2"
                >
                  Back to Chat
                </a>
                <button
                  onClick={onLogout}
                  className="k8s-button-secondary flex items-center gap-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
          {/* Search and Controls */}
          <div className="k8s-card p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-k8s-gray w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search pods or namespaces..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="k8s-input pl-10 w-full"
                />
              </div>
              {lastRefresh && (
                <div className="text-k8s-gray text-sm">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          {/* Pods List */}
          <div className="k8s-card">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 text-k8s-blue animate-spin mr-3" />
                <span className="text-k8s-gray">Loading pods...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 mb-4">{error}</p>
                <button onClick={fetchPods} className="k8s-button-primary">
                  Try Again
                </button>
              </div>
            ) : filteredData.namespaces.length === 0 ? (
              <div className="text-center py-12">
                <Server className="w-12 h-12 text-k8s-gray mx-auto mb-4" />
                <p className="text-k8s-gray">
                  {searchTerm ? 'No pods found matching your search.' : 'No pods found.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-k8s-dark/30">
                {filteredData.namespaces.map((namespace) => (
                  <div key={namespace.name} className="p-4">
                    {/* Namespace Header */}
                    <button
                      onClick={() => toggleNamespace(namespace.name)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-k8s-dark/30 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        {expandedNamespaces.has(namespace.name) ? (
                          <ChevronDown className="w-5 h-5 text-k8s-blue" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-k8s-blue" />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {namespace.name}
                          </h3>
                          <p className="text-k8s-gray text-sm">
                            {namespace.pod_count} pod{namespace.pod_count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Pods List */}
                    {expandedNamespaces.has(namespace.name) && (
                      <div className="ml-8 mt-2 space-y-2">
                        {namespace.pods.map((pod) => (
                          <div
                            key={pod.name}
                            className="flex items-center justify-between p-4 bg-k8s-dark/20 rounded-lg hover:bg-k8s-dark/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {getStatusIcon(pod.status)}
                              <div>
                                <h4 className="text-white font-medium">
                                  {pod.name}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-k8s-gray mt-1">
                                  <span>Ready: {pod.ready}</span>
                                  <span>Restarts: {pod.restarts}</span>
                                  <span>Age: {pod.age}</span>
                                  <span>Node: {pod.node}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`text-sm font-medium ${getStatusColor(pod.status)}`}>
                                {pod.status}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fetchPodLogs(namespace.name, pod.name);
                                }}
                                className="k8s-button-secondary flex items-center gap-2 p-2"
                                title="View pod logs"
                              >
                                <FileText className="w-4 h-4" />
                                Logs
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Logs Modal */}
        {logsModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="k8s-card max-w-5xl w-full h-[85vh] max-h-[85vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-k8s-blue" />
                    Pod Logs
                  </h2>
                  <p className="text-k8s-gray text-sm mt-1">
                    {logsModal.podName} in namespace: {logsModal.namespace}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyLogsToClipboard}
                    disabled={!logsModal.logs || logsModal.loading}
                    className="k8s-button-secondary flex items-center gap-2"
                    title="Copy logs to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={downloadLogs}
                    disabled={!logsModal.logs || logsModal.loading}
                    className="k8s-button-secondary flex items-center gap-2"
                    title="Download logs"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={closeLogsModal}
                    className="k8s-button-secondary p-2"
                    title="Close logs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="flex-1 p-6 overflow-hidden min-h-0">
                {logsModal.loading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="w-6 h-6 text-k8s-blue animate-spin mr-3" />
                    <span className="text-k8s-gray">Loading pod logs...</span>
                  </div>
                ) : logsModal.error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                      <p className="text-red-400 mb-4">{logsModal.error}</p>
                      <button onClick={closeLogsModal} className="k8s-button-primary">
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <span className="text-k8s-gray text-sm">
                        Showing last {logsModal.logs.split('\n').length} lines
                      </span>
                      <span className="text-k8s-gray text-sm">
                        {logsModal.timestamp && new Date(logsModal.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex-1 bg-black/50 rounded-lg p-4 overflow-y-auto font-mono text-sm text-gray-300 border border-white/10 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                      <pre className="whitespace-pre-wrap">{logsModal.logs || 'No logs available'}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodBrowser;