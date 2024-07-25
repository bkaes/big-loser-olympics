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
      <nav>
        <Link href="/standings">Standings</Link>
        <Link href="/data-viewer">Data Viewer</Link>
      </nav>
      <main>{children}</main>
    </div>
  )
}
