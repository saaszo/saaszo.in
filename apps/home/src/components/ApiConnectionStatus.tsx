'use client';
import React, { useState, useEffect } from 'react';

export default function ApiConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [details, setDetails] = useState<any>(null);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.saaszo.in';
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setDetails(data);
        setStatus('online');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      setStatus('offline');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={checkConnection}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-lg transition-all duration-300 backdrop-blur-md ${
          status === 'online'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
            : status === 'offline'
            ? 'bg-error/10 border-error/20 text-error'
            : 'bg-surface-container border-outline/20 text-on-surface-variant animate-pulse'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${
          status === 'online' ? 'bg-emerald-500 animate-pulse' : 
          status === 'offline' ? 'bg-error' : 'bg-outline'
        }`} />
        <span className="text-xs font-bold uppercase tracking-wider">
          API {status}
        </span>
      </button>
      
      {status === 'online' && details && (
        <div className="absolute bottom-full right-0 mb-3 w-64 p-4 rounded-2xl bg-surface-container-high border border-outline/20 shadow-xl animate-fade-up pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <h4 className="text-xs font-bold mb-2 uppercase tracking-widest text-outline">System Health</h4>
          <div className="space-y-2">
            {Object.entries(details.services || {}).map(([service, state]) => (
              <div key={service} className="flex justify-between items-center text-xs">
                <span className="capitalize text-on-surface-variant font-medium">{service}</span>
                <span className={state === 'healthy' ? 'text-emerald-500' : 'text-error'}>{state as string}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
