import { useState, useEffect } from 'react';
import { checkApiHealth } from '../api';

/**
 * Custom hook to check the status of the API
 * @param interval The interval in milliseconds to check the API status
 * @returns An object with the API status information
 */
const useApiStatus = (interval: number = 30000) => {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    try {
      setStatus('checking');
      const result = await checkApiHealth();
      
      // Consider both online status and successful response
      if (result.status === 'online' || result.data?.status === 'success') {
        setStatus('online');
        setError(null);
      } else {
        setStatus('offline');
        setError('API is not available');
      }
    } catch (err) {
      setStatus('offline');
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('API health check failed:', err);
    } finally {
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    // Check immediately on mount
    checkStatus();

    // Set up interval for checking
    const intervalId = setInterval(checkStatus, interval);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [interval]);

  return {
    status,
    lastChecked,
    error,
    checkNow: checkStatus
  };
};

export default useApiStatus;

