import Link from 'next/link'
import { ComponentProps } from 'react'

export default function Page() {
  return (
    <main>
      <h1>Page 1</h1>
      <ul>
        <li>
          <DebugLink href="/cookies" prefetch />
        </li>
        <li>
          <DebugLink href="/error-after-cookies" prefetch />
        </li>
        <li>
          <DebugLink href="/sync-io-after-cookies" prefetch />
        </li>
        <li>
          <DebugLink href="/cookies-only" prefetch />
        </li>
        <li>
          <DebugLink href="/search-params?foo=123" prefetch />
          {' | '}
          <DebugLink href="/search-params?foo=456" prefetch />
        </li>
        <li>
          <DebugLink href="/dynamic-params/123" prefetch />
          {' | '}
          <DebugLink href="/dynamic-params/456" prefetch />
        </li>
      </ul>
    </main>
  )
}

function DebugLink({
  href,
  ...props
}: Omit<ComponentProps<typeof Link>, 'href'> & { href: string }) {
  return (
    <details data-href={href}>
      <summary>{href} (show link)</summary>
      <Link href={href} {...props}>
        {href}
      </Link>
    </details>
  )
}
