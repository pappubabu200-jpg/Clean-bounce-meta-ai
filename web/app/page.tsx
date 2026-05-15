'use client'
import Link from 'next/link'

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  return (
    <div style={{background: '#000', color: '#fff', minHeight: '100vh'}}>
      {/* NAV */}
      <nav style={{borderBottom: '1px solid #222', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontWeight: 700, fontSize: 20}}>CleanBounce</div>
        <div style={{display: 'flex', gap: 24, alignItems: 'center'}}>
          <Link href="/tools/bulk-verifier" style={{color: '#888', textDecoration: 'none'}}>Tools</Link>
          <Link href="/pricing" style={{color: '#888', textDecoration: 'none'}}>Pricing</Link>
          <Link href="/dashboard" style={{background: '#fff', color: '#000', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600}}>
            Dashboard
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{maxWidth: 1000, margin: '80px auto', padding: '0 24px', textAlign: 'center'}}>
        <div style={{display: 'inline-block', background: '#10b981', color: '#000', padding: '4px 12px', borderRadius: 999, fontSize: 14, fontWeight: 600, marginBottom: 24}}>
          10x REFUND GUARANTEE
        </div>
        <h1 style={{fontSize: 64, fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px'}}>
          Email Verification That<br/>Pays You When We're Wrong
        </h1>
        <p style={{fontSize: 20, color: '#888', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6}}>
          We verify emails with real SMTP checks. If we mark an email "valid" and it bounces, 
          we refund you 10x credits. NeverBounce won't do that.
        </p>
        <div style={{display: 'flex', gap: 16, justifyContent: 'center'}}>
          <Link href="/dashboard" style={{background: '#fff', color: '#000', padding: '16px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 18}}>
            Get Free API Key
          </Link>
          <Link href="/tools/bulk-verifier" style={{background: '#111', color: '#fff', border: '1px solid #333', padding: '16px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 18}}>
            Try Bulk Verifier
          </Link>
        </div>
        <p style={{color: '#555', marginTop: 16, fontSize: 14}}>100 free verifications/day. No credit card.</p>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '32px 24px'}}>
        <div style={{maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexWrap: 'wrap', gap: 24}}>
          <div>
            <div style={{fontSize: 32, fontWeight: 700}}>99.2%</div>
            <div style={{color: '#888'}}>Accuracy</div>
          </div>
          <div>
            <div style={{fontSize: 32, fontWeight: 700}}>10ms</div>
            <div style={{color: '#888'}}>Avg Verify Time</div>
          </div>
          <div>
            <div style={{fontSize: 32, fontWeight: 700}}>10x</div>
            <div style={{color: '#888'}}>Refund on Bounce</div>
          </div>
          <div>
            <div style={{fontSize: 32, fontWeight: 700}}>5</div>
            <div style={{color: '#888'}}>Free Tools</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{maxWidth: 1000, margin: '80px auto', padding: '0 24px'}}>
        <h2 style={{fontSize: 40, fontWeight: 700, textAlign: 'center', marginBottom: 64}}>Everything You Need to Clean Lists</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32}}>
          {[
            {title: 'SMTP Verification', desc: 'Real mailbox check via SMTP RCPT TO. Not just syntax.', icon: '✓'},
            {title: 'Bulk Upload 10K', desc: 'Upload CSV. Get results with valid/invalid/catch-all tags.', icon: '⇪'},
            {title: 'DNS Checker', desc: 'SPF, DKIM, DMARC audit for any domain in 1 click.', icon: '🛡️'},
            {title: '10x Refund Engine', desc: 'Report a bounce we marked valid. Get 10 credits back instantly.', icon: '💰'},
            {title: 'API Access', desc: 'REST API with 99.9% uptime. 10K verifications/day on Pro.', icon: '</>'},
            {title: 'Extractor Tool', desc: 'Paste text or URL. Extract all emails in seconds.', icon: '⌕'},
          ].map(f => (
            <div key={f.title} style={{background: '#111', border: '1px solid #222', borderRadius: 12, padding: 24}}>
              <div style={{fontSize: 32, marginBottom: 16}}>{f.icon}</div>
              <h3 style={{fontSize: 20, fontWeight: 600, marginBottom: 8}}>{f.title}</h3>
              <p style={{color: '#888', lineHeight: 1.6}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{maxWidth: 900, margin: '80px auto', padding: '0 24px'}}>
        <h2 style={{fontSize: 40, fontWeight: 700, textAlign: 'center', marginBottom: 64}}>Simple Pricing</h2>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
          <div style={{background: '#111', border: '1px solid #333', borderRadius: 12, padding: 32}}>
            <h3 style={{fontSize: 24, fontWeight: 600}}>Free</h3>
            <div style={{fontSize: 48, fontWeight: 700, margin: '16px 0'}}>$0</div>
            <ul style={{lineHeight: 2, color: '#888', paddingLeft: 20}}>
              <li>100 SMTP verifies/day</li>
              <li>5K extractor chars/day</li>
              <li>1 bulk job/day</li>
              <li>DNS checker</li>
            </ul>
            <Link href="/dashboard" style={{display: 'block', textAlign: 'center', width: '100%', marginTop: 32, padding: 12, background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 8, textDecoration: 'none', fontWeight: 600}}>
              Start Free
            </Link>
          </div>

          <div style={{background: '#111', border: '2px solid #fff', borderRadius: 12, padding: 32, position: 'relative'}}>
            <div style={{position: 'absolute', top: -12, right: 24, background: '#10b981', color: '#000', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700}}>
              MOST POPULAR
            </div>
            <h3 style={{fontSize: 24, fontWeight: 600}}>Pro</h3>
            <div style={{fontSize: 48, fontWeight: 700, margin: '16px 0'}}>$19<span style={{fontSize: 20, color: '#888'}}>/mo</span></div>
            <ul style={{lineHeight: 2, color: '#888', paddingLeft: 20}}>
              <li>10,000 SMTP verifies/day</li>
              <li>Unlimited extractor</li>
              <li>Unlimited bulk jobs</li>
              <li>10x refund guarantee</li>
              <li>Priority API access</li>
            </ul>
            <Link href="/dashboard" style={{display: 'block', textAlign: 'center', width: '100%', marginTop: 32, padding: 12, background: '#fff', color: '#000', border: 0, borderRadius: 8, textDecoration: 'none', fontWeight: 600}}>
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{maxWidth: 800, margin: '80px auto', padding: '0 24px'}}>
        <h2 style={{fontSize: 40, fontWeight: 700, textAlign: 'center', marginBottom: 64}}>FAQ</h2>
        {[
          {q: 'How is this different from NeverBounce?', a: 'We give 10x credit refunds if we mark an email valid and it bounces. They don\'t. We also show real SMTP response codes.'},
          {q: 'Do you store my email lists?', a: 'No. Bulk jobs auto-delete after 24h. We only store counts for billing.'},
          {q: 'What\'s a "catch-all" result?', a: 'Domain accepts all emails. We flag these so you know the risk. You decide to keep or remove.'},
          {q: 'Can I get an invoice?', a: 'Yes. Stripe sends invoices automatically. Email support@cleanbounce.com for custom billing.'},
        ].map(f => (
          <div key={f.q} style={{borderBottom: '1px solid #222', padding: '24px 0'}}>
            <h3 style={{fontSize: 18, fontWeight: 600, marginBottom: 8}}>{f.q}</h3>
            <p style={{color: '#888', lineHeight: 1.6}}>{f.a}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer style={{borderTop: '1px solid #222', padding: '40px 24px', textAlign: 'center', color: '#555'}}>
        <p>© 2026 CleanBounce. Built for agencies who hate bounced emails.</p>
        <div style={{marginTop: 16, display: 'flex', gap: 24, justifyContent: 'center'}}>
          <Link href="/privacy" style={{color: '#555', textDecoration: 'none'}}>Privacy</Link>
          <Link href="/terms" style={{color: '#555', textDecoration: 'none'}}>Terms</Link>
          <a href="mailto:support@cleanbounce.com" style={{color: '#555', textDecoration: 'none'}}>Support</a>
        </div>
      </footer>
    </div>
  )
      }
