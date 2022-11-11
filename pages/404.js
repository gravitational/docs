// 404.js
import Link from 'next/link'

export default function FourOhFour() {
  return <>
    <h1>404 - Page Not Found</h1>
    We're very sorry - we couldn't find the page you were looking for. 
    Please navigate to the Teleport <a href="https://docs.goteleport.com">Documentation</a> or
    the <a href="https://goteleport.com">Home Page</a> to find what you're looking for. 
  </>
}
