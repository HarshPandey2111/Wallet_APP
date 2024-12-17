import Link from 'next/link';

const Layout = ({ children }) => (
  <div>
    <header style={{ padding: '20px', background: '#333', color: '#fff' }}>
      <h1>Admin Panel</h1>
      <nav>
        <Link href="/users" style={{ marginRight: '20px', color: '#fff' }}>Manage Users</Link>
        <Link href="/wallets" style={{ color: '#fff' }}>Manage Wallets</Link>
      </nav>
    </header>
    <main style={{ padding: '20px' }}>{children}</main>
  </div>
);

export default Layout;
