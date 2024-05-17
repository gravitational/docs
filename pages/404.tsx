// 404.js

import Link from "next/link";

export default function FourOhFour() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 Page Not Found</h1>
      <p>Sorry, we couldn&apos;t find that page</p>
      <p>We couldn&apos;t find the page you were looking for.</p>
      <h2>Pages you may find useful</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
      <li><a href="/">Home Page</a></li>
        <li><Link href="/about">About Us</Link></li>
        <li><Link href="/blog">Blog</Link></li>
        <li><Link href="/Support">Customer Support</Link></li>
        <li><Link href="/">Documentation</Link></li>
        <li><Link href="installation">Installation</Link></li>
        <li><Link href="server-access">Teleport Server Access</Link></li>
        <li><Link href="kubernetes-access">Teleport Kubernetes Access</Link></li>
        <li><Link href="database-access">Teleport Database Access</Link></li>
        <li><Link href="desktop-access">Teleport Desktop Access</Link></li>
        <li><Link href="application-access">Teleport Application Access</Link></li>
      </ul>
    </div>
  );
}
