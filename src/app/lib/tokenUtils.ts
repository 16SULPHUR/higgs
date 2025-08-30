import { jwtDecode } from 'jwt-decode';

type DecodedToken = { exp: number };

export function getDecodedTokenExpiry(token: string): number | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000; 
  } catch (err) {
    return null;
  }
}

export function getDecodedToken(token: string): any {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded; 
  } catch (err) {
    return null;
  }
}

/**
 * Checks if a token needs proactive refresh (expires within the specified buffer time)
 * @param token - The JWT token to check
 * @param bufferMinutes - Buffer time in minutes before expiration (default: 5 minutes)
 * @returns true if token needs refresh, false otherwise
 */
export function shouldRefreshToken(token: string, bufferMinutes: number = 5): boolean {
  const expiry = getDecodedTokenExpiry(token);
  if (!expiry) return true;
  
  const bufferTime = bufferMinutes * 60 * 1000; // Convert minutes to milliseconds
  return Date.now() >= (expiry - bufferTime);
}

/**
 * Gets the time until token expiration in milliseconds
 * @param token - The JWT token to check
 * @returns Time until expiration in milliseconds, or null if invalid token
 */
export function getTimeUntilExpiry(token: string): number | null {
  const expiry = getDecodedTokenExpiry(token);
  if (!expiry) return null;
  
  return expiry - Date.now();
}
