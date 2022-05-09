
// add addtional entries using the template below, or found here: https://nextjs.org/docs/advanced-features/security-headers
const ContentSecurityPolicy = `
frame-ancestors 'none';
`

export const securityHeaders = [
  {
    // config to prevent the browser from rendering the page inside a frame or iframe and avoid clickjacking http://en.wikipedia.org/wiki/Clickjacking
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    // This header enables the Cross-site scripting (XSS) filter built into most recent web browsers.
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    // when serving user-supplied content, include a X-Content-Type-Options: nosniff header along with the Content-Type: header, to disable content-type sniffing on some browsers.
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
  
]