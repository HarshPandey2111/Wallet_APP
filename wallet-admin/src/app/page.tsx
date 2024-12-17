export default function AdminDashboard() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <ul>
        <li>
          <a href="/users">Manage Users</a>
        </li>
        <li>
          <a href="/wallets">Manage Wallets</a>
        </li>
      </ul>
    </main>
  );
}
