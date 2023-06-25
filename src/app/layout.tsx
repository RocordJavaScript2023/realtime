// We want to import the `Providers` component in the toplevel Layout.
// That way, each and every page will get wrapped with the Providers-
// Component, allowing us to access Session State and Data.
import { NextAuthProvider } from '@/components/providers.component'

export const metadata = {
  title: 'Realtime',
  description: 'Chat in REAL-Time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          { children }
        </NextAuthProvider>
      </body>
    </html>
  );
}
