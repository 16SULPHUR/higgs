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
