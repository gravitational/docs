// 404.js

import Link from "next/link";

export default function FourOhFour() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 Page Not Found</h1>
      <p>Sorry, we couldn't find that page</p>
      <p>We're very sorry - we couldn't find the page you were looking for.</p>
      <h2>Pages you may find useful</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
      <li><a href="/">Home Page</a></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/support">Customer Support</Link></li>
        <li><Link href="Documentation">Installation</Link></li>
        <li><Link to="installation.mdx">Installation</Link></li>
        <li><Link to="server-access">Teleport Server Access</Link></li>
        <li><Link to="kubernetes-access">Teleport Kubernetes Access</Link></li>
        <li><Link to="database-access">Teleport Database Access</Link></li>
        <li><Link to="desktop-access">Teleport Desktop Access</Link></li>
        <li><Link to="application-access">Teleport Application Access</Link></li>
      </ul>
    </div>
  );
}