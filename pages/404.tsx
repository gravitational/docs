// 404.js

import Link from "next/link";
import { sendPageNotFoundError } from "utils/posthog";
import { useEffect } from "react";
import SiteHeader from "components/Header";
import Footer from "layouts/DocsPage/Footer";

export default function FourOhFour() {
  useEffect(() => {
    void sendPageNotFoundError(); // Report Error to PostHog for tracking
  }, []);

  return (
    <div>
      <SiteHeader />
      <div style={{ padding: "50px" }}>
        <h1>404 Page Not Found</h1>
        <p>Sorry, we couldn&apos;t find that page!</p>
        <p>
          Go back to Documentation <Link href="/">home</Link>?
        </p>
        <h2>Other pages you may find useful</h2>
        <ul style={{ marginLeft: 1 }}>
          <li>
            <a href="https://goteleport.com/">Home Page</a>
          </li>
          <li>
            <Link href="https://goteleport.com/about/">About Us</Link>
          </li>
          <li>
            <Link href="https://goteleport.com/blog/">Blog</Link>
          </li>
          <li>
            <Link href="faq">Frequently Asked Questions</Link>
          </li>
          <li>
            <Link href="https://goteleport.com/support/">Help & Support</Link>
          </li>
          <li>
            <Link href="/">Documentation Home</Link>
          </li>
          <li>
            <Link href="installation">Installation</Link>
          </li>
          <li>
            <Link href="server-access/guides">Teleport Server Access</Link>
          </li>
          <li>
            <Link href="kubernetes-access">Teleport Kubernetes Access</Link>
          </li>
          <li>
            <Link href="database-access/guides">Teleport Database Access</Link>
          </li>
          <li>
            <Link href="desktop-access">Teleport Desktop Access</Link>
          </li>
          <li>
            <Link href="application-access/guides">Teleport Application Access</Link>
          </li>
        </ul>
      </div>
      <Footer section={true}></Footer>
    </div>
  );
}
