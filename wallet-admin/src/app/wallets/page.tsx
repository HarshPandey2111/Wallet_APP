'use client';
import { useEffect, useState } from 'react';
import { fetchWallets, toggleWalletStatus } from '../services/adminService';

export default function ManageWallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWallets();
      setWallets(response);
    } catch (err) {
      setError('Failed to load wallets');
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (walletId, isFrozen) => {
    try {
      await toggleWalletStatus(walletId, !isFrozen);
      loadWallets();
    } catch (err) {
      alert('Failed to update wallet status');
    }
  };

  return (
    <main>
      <h1>Manage Wallets</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((wallet) => (
            <tr key={wallet.id}>
              <td>{wallet.id}</td>
              <td>${wallet.balance}</td>
              <td>{wallet.isFrozen ? 'Frozen' : 'Active'}</td>
              <td>
                <button onClick={() => handleToggleStatus(wallet.id, wallet.isFrozen)}>
                  {wallet.isFrozen ? 'Unfreeze' : 'Freeze'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
