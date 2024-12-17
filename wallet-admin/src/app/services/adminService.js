const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://10.43.1.186:3000/api';


export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const toggleUserStatus = async (userId, isActive) => {
  const response = await fetch(`${API_URL}/users/${userId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });
  if (!response.ok) throw new Error('Failed to update user status');
  return response.json();
};

export const fetchWallets = async () => {
  const response = await fetch(`${API_URL}/wallets`);
  if (!response.ok) throw new Error('Failed to fetch wallets');
  return response.json();
};

export const toggleWalletStatus = async (walletId, isFrozen) => {
  const response = await fetch(`${API_URL}/wallets/${walletId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isFrozen }),
  });
  if (!response.ok) throw new Error('Failed to update wallet status');
  return response.json();
};
