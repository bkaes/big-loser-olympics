// components/Layout.tsx
import Head from 'next/head'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export default function Layout({ children, title = 'Olympic Data' }: LayoutProps) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
        <Link style={{ marginRight: '10px' }} href="/">Standings</Link>
        <Link href="/teams">Teams</Link>
      </nav>
      <main>{children}</main>
    </div>
  )
}
