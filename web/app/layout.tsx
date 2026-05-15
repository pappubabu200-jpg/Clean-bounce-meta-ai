export const metadata = {
  title: 'CleanBounce Tools',
  description: 'Free email tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{fontFamily: 'system-ui', margin: 0, background: '#0a0a0a', color: '#fff'}}>
        {children}
      </body>
    </html>
  )
}
