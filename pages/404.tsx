// 404.js

import Link from "next/link";

export default function FourOhFour() {
  return (
    <>
      <h1>404 - Page Not Found</h1>
      We&apos;re very sorry - we could not find the page you were looking for.
      Please navigate to the Teleport <Link href="/">Documentation</Link> or the
      <a href="/">Home Page</a> to find what you&apos;re looking for.
    </>
  );
}
