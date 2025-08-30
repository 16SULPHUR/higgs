'use client';

import { getCookie, setCookie } from './cookieUtils';
import { shouldRefreshToken, getTimeUntilExpiry } from './tokenUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TokenRefreshResult {
  accessToken: string;
  refreshToken?: string;
}

class TokenRefreshService {
  private refreshTimeout: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<TokenRefreshResult> | null = null;

  /**
   * Refreshes the access token using the refresh token
   */
  private async refreshAccessToken(refreshToken: string): Promise<TokenRefreshResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await res.json();
      
      if (!res.ok || !data.accessToken) {
        throw new Error(data?.message || 'Failed to refresh access token');
      }

      // Update cookies with new tokens
      setCookie('accessToken', data.accessToken, 7);
      if (data.refreshToken) {
        setCookie('refreshToken', data.refreshToken, 7);
      }

      return data;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      
      // Clear cookies and redirect to login on refresh failure
      if (typeof window !== 'undefined') {
        const { clearAllCookies } = await import('./cookieUtils');
        clearAllCookies();
        window.location.href = '/login';
      }
      
      throw error;
    }
  }

  /**
   * Ensures a valid access token is available, refreshing if necessary
   */
  async ensureValidToken(): Promise<string | null> {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');

    // If no access token, return null
    if (!accessToken) {
      return null;
    }

    // If token is not expired, return it
    if (!shouldRefreshToken(accessToken)) {
      return accessToken;
    }

    // If no refresh token, return null
    if (!refreshToken) {
      return null;
    }

    // If already refreshing, wait for the existing refresh
    if (this.isRefreshing && this.refreshPromise) {
      try {
        const result = await this.refreshPromise;
        return result.accessToken;
      } catch (error) {
        return null;
      }
    }

    // Start refresh process
    this.isRefreshing = true;
    this.refreshPromise = this.refreshAccessToken(refreshToken);

    try {
      const result = await this.refreshPromise;
      return result.accessToken;
    } catch (error) {
      return null;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Sets up proactive token refresh scheduling
   */
  scheduleProactiveRefresh(): void {
    const accessToken = getCookie('accessToken');
    if (!accessToken) return;

    // Clear existing timeout
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    const timeUntilExpiry = getTimeUntilExpiry(accessToken);
    if (!timeUntilExpiry) return;

    // Schedule refresh 5 minutes before expiration
    const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 1000); // At least 1 second

    this.refreshTimeout = setTimeout(async () => {
      try {
        const refreshToken = getCookie('refreshToken');
        if (refreshToken) {
          await this.refreshAccessToken(refreshToken);
          // Schedule next refresh
          this.scheduleProactiveRefresh();
        }
      } catch (error) {
        console.error('Proactive token refresh failed:', error);
      }
    }, refreshTime);

    console.log(`[TokenRefreshService] Scheduled token refresh in ${Math.round(refreshTime / 1000)} seconds`);
  }

  /**
   * Stops the proactive refresh scheduling
   */
  stopProactiveRefresh(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  /**
   * Manually triggers a token refresh
   */
  async manualRefresh(): Promise<string | null> {
    return this.ensureValidToken();
  }
}

// Export singleton instance
export const tokenRefreshService = new TokenRefreshService();
