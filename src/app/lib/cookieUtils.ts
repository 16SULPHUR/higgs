export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return;

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  return cookie?.split('=')[1];
}

export function setCookie(name: string, value: string, days = 7): void {
  if (typeof document === 'undefined') return;

  const expires = new Date(Date.now() + days * 864e5).toUTCString();

  document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Lax`;
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}


export function clearAllCookies(): void {
  document.cookie.split(';').forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
}
