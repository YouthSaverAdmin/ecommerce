const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function checkAuth() {
  const response = await fetch(`${API_BASE_URL}/api/auth/check/`, {
    credentials: 'include', // to send cookies if you have session auth
  });

  if (!response.ok) {
    throw new Error('Auth check failed');
  }
  return response.json();
}
