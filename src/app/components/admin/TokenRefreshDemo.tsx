'use client';

import { useState } from 'react';
import { useSession, useSessionActions } from '@/contexts/SessionContext';
import { api } from '@/lib/api.client';
import { tokenRefreshService } from '@/lib/tokenRefreshService';
import { getDecodedTokenExpiry, shouldRefreshToken, getTimeUntilExpiry } from '@/lib/tokenUtils';
import { RefreshCw, Clock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function TokenRefreshDemo() {
  const session = useSession();
  const { refreshAccessToken } = useSessionActions();
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const analyzeToken = () => {
    if (!session?.accessToken) {
      setTokenInfo({ error: 'No access token available' });
      return;
    }

    try {
      const expiry = getDecodedTokenExpiry(session.accessToken);
      const timeUntilExpiry = getTimeUntilExpiry(session.accessToken);
      const needsRefresh = shouldRefreshToken(session.accessToken);
      
      setTokenInfo({
        expiry: expiry ? new Date(expiry).toLocaleString() : 'Invalid',
        timeUntilExpiry: timeUntilExpiry ? Math.round(timeUntilExpiry / 1000) : 'Invalid',
        needsRefresh,
        isExpired: expiry ? Date.now() >= expiry : true
      });
    } catch (error) {
      setTokenInfo({ error: 'Failed to decode token' });
    }
  };

  const testApiCall = async () => {
    if (!session) {
      setTestResult('No session available');
      return;
    }

    setIsLoading(true);
    setTestResult('');

    try {
      // This will trigger automatic token refresh if needed
      const result = await api.get(session, '/api/admin/users');
      setTestResult(`✅ API call successful! Retrieved ${result?.length || 0} users`);
    } catch (error: any) {
      setTestResult(`❌ API call failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testManualRefresh = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      const newToken = await refreshAccessToken();
      if (newToken) {
        setTestResult('✅ Manual token refresh successful!');
        analyzeToken(); // Refresh token info
      } else {
        setTestResult('❌ Manual token refresh failed');
      }
    } catch (error: any) {
      setTestResult(`❌ Manual token refresh error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testProactiveRefresh = () => {
    try {
      tokenRefreshService.scheduleProactiveRefresh();
      setTestResult('✅ Proactive refresh scheduled! Check console for timing info.');
    } catch (error: any) {
      setTestResult(`❌ Failed to schedule proactive refresh: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        <RefreshCw className="inline mr-2" />
        Token Refresh Demo
      </h2>

      {/* Token Information */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Token Status</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Session Status:</span>
            <span className={`px-2 py-1 rounded text-sm ${
              session === undefined ? 'bg-yellow-100 text-yellow-800' :
              session === null ? 'bg-red-100 text-red-800' :
              'bg-green-100 text-green-800'
            }`}>
              {session === undefined ? 'Loading...' : 
               session === null ? 'Not Authenticated' : 
               'Authenticated'}
            </span>
          </div>
          
          {session?.accessToken && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Access Token:</span>
              <span className="text-sm text-gray-600">
                {session.accessToken.substring(0, 20)}...
              </span>
            </div>
          )}
          
          {session?.refreshToken && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Refresh Token:</span>
              <span className="text-sm text-gray-600">
                {session.refreshToken.substring(0, 20)}...
              </span>
            </div>
          )}
        </div>

        <button
          onClick={analyzeToken}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <Clock className="inline mr-2" size={16} />
          Analyze Token
        </button>

        {tokenInfo && (
          <div className="mt-3 p-3 bg-white rounded border">
            {tokenInfo.error ? (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={16} />
                {tokenInfo.error}
              </div>
            ) : (
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Expires:</span> {tokenInfo.expiry}</div>
                <div><span className="font-medium">Time until expiry:</span> {tokenInfo.timeUntilExpiry}s</div>
                <div><span className="font-medium">Needs refresh:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    tokenInfo.needsRefresh ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {tokenInfo.needsRefresh ? 'Yes' : 'No'}
                  </span>
                </div>
                <div><span className="font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    tokenInfo.isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {tokenInfo.isExpired ? 'Expired' : 'Valid'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Test Actions */}
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">Test Automatic Token Refresh</h3>
          <p className="text-sm text-blue-700 mb-3">
            This will make an API call that automatically refreshes the token if it's expired.
          </p>
          <button
            onClick={testApiCall}
            disabled={!session || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 className="inline mr-2 animate-spin" size={16} /> : <CheckCircle className="inline mr-2" size={16} />}
            Test API Call with Auto-Refresh
          </button>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-800">Test Manual Token Refresh</h3>
          <p className="text-sm text-green-700 mb-3">
            Manually trigger a token refresh to test the refresh mechanism.
          </p>
          <button
            onClick={testManualRefresh}
            disabled={!session || isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 className="inline mr-2 animate-spin" size={16} /> : <RefreshCw className="inline mr-2" size={16} />}
            Manual Token Refresh
          </button>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-purple-800">Test Proactive Refresh</h3>
          <p className="text-sm text-purple-700 mb-3">
            Schedule a proactive token refresh before expiration.
          </p>
          <button
            onClick={testProactiveRefresh}
            disabled={!session}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Clock className="inline mr-2" size={16} />
            Schedule Proactive Refresh
          </button>
        </div>
      </div>

      {/* Results */}
      {testResult && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Test Results</h3>
          <div className="p-3 bg-white rounded border">
            <p className="text-sm">{testResult}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800">How to Test</h3>
        <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
          <li>Wait for your access token to expire (or modify the expiration time in your backend)</li>
          <li>Use the "Test API Call with Auto-Refresh" button to see automatic token refresh in action</li>
          <li>Check the browser console for detailed refresh logs</li>
          <li>Monitor the Network tab to see refresh requests and retries</li>
        </ol>
      </div>
    </div>
  );
}
