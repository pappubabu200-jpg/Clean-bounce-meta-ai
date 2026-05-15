'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [yearly, setYearly] = useState(false)

  return (
    <div style={{background: '#fff', color: '#0a0a0a'}}>
      {/* NAV */}
      <nav style={{borderBottom: '1px solid #f1f1f1', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.8)'}}>
        <div style={{maxWidth: 1200, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'}}></div>
            <span style={{fontWeight: 700, fontSize: 20}}>CleanBounce</span>
          </div>
          <div style={{display: 'flex', gap: 32, alignItems: 'center'}}>
            <Link href="#features" style={{color: '#525252', textDecoration: 'none', fontWeight: 500}}>Features</Link>
            <Link href="#pricing" style={{color: '#525252', textDecoration: 'none', fontWeight: 500}}>Pricing</Link>
            <Link href="/dashboard" style={{background: '#0a0a0a', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 600}}>
              Start Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{maxWidth: 1200, margin: '0 auto', padding: '120px 24px 80px', textAlign: 'center'}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '6px 16px', borderRadius: 999, fontSize: 14, fontWeight: 600, marginBottom: 24}}>
          <div style={{width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite'}}></div>
          10x Refund Guarantee Live
        </div>
        <h1 style={{fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', margin: '0 0 24px', background: 'linear-gradient(180deg, #0a0a0a 0%, #525252 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          Stop Paying for<br/>Emails That Bounce
        </h1>
        <p style={{fontSize: 20, color: '#737373', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6}}>
          Real SMTP verification with 99.2% accuracy. If we mark an email “valid” and it bounces, 
          we refund you 10x credits instantly. No other tool does this.
        </p>
        <div style={{display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16}}>
          <Link href="/dashboard" style={{background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#fff', padding: '16px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 18, boxShadow: '0 4px 14px rgba(99,102,241,0.4)'}}>
            Get 100 Free Verifications
          </Link>
          <Link href="#demo" style={{background: '#fff', color: '#0a0a0a', border: '1px solid #e5e5e5', padding: '16px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 18}}>
            Watch 45s Demo
          </Link>
        </div>
        <p style={{color: '#a3a3a3', fontSize: 14}}>No credit card required. 2-min setup.</p>
        
        {/* LOGOS */}
        <div style={{marginTop: 80, opacity: 0.5}}>
          <p style={{color: '#a3a3a3', fontSize: 14, marginBottom: 24, fontWeight: 500}}>TRUSTED BY AGENCIES USING</p>
          <div style={{display: 'flex', gap: 48, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
            {['Instantly', 'Smartlead', 'Lemlist', 'Apollo', 'Clay'].map(t => (
              <div key={t} style={{color: '#a3a3a3', fontWeight: 700, fontSize: 18}}>{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO FEATURES */}
      <section id="features" style={{maxWidth: 1200, margin: '0 auto', padding: '80px 24px'}}>
        <div style={{textAlign: 'center', marginBottom: 64}}>
          <h2 style={{fontSize: 48, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16}}>
            Why agencies switch from NeverBounce
          </h2>
          <p style={{fontSize: 18, color: '#737373'}}>Built for cold email. Not generic marketers.</p>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
          {/* Large card */}
          <div style={{gridColumn: 'span 2', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', border: '1px solid #e9d5ff', borderRadius: 24, padding: 40}}>
            <div style={{width: 48, height: 48, borderRadius: 12, background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, fontSize: 24}}>💰</div>
            <h3 style={{fontSize: 28, fontWeight: 700, marginBottom: 12}}>10x Refund Engine</h3>
            <p style={{color: '#525252', lineHeight: 1.7, fontSize: 17}}>
              Report any bounce we marked "valid" and get 10 credits back instantly. 
              We eat the cost because our SMTP checks are 99.2% accurate. 
              NeverBounce makes you pay for their mistakes.
            </p>
          </div>

          <div style={{background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 24, padding: 32}}>
            <div style={{fontSize: 48, fontWeight: 800, color: '#16a34a'}}>99.2%</div>
            <div style={{color: '#15803d', fontWeight: 600, marginTop: 8}}>SMTP Accuracy</div>
            <p style={{color: '#525252', marginTop: 16, fontSize: 14}}>Real mailbox ping. Not regex.</p>
          </div>

          <div style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: 24, padding: 32}}>
            <div style={{width: 48, height: 48, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 24}}>⚡</div>
            <h3 style={{fontSize: 20, fontWeight: 700, marginBottom: 8}}>10ms Verify Speed</h3>
            <p style={{color: '#737373', fontSize: 15}}>Bulk verify 10K emails in 3 minutes.</p>
          </div>

          <div style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: 24, padding: 32}}>
            <div style={{width: 48, height: 48, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 24}}>🛡️</div>
            <h3 style={{fontSize: 20, fontWeight: 700, marginBottom: 8}}>SPF/DKIM Audit</h3>
            <p style={{color: '#737373', fontSize: 15}}>Check domain health before you send.</p>
          </div>

          <div style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: 24, padding: 32}}>
            <div style={{width: 48, height: 48, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 24}}>🔥</div>
            <h3 style={{fontSize: 20, fontWeight: 700, marginBottom: 8}}>Catch-All Detection</h3>
            <p style={{color: '#737373', fontSize: 15}}>We flag risky domains. You decide.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{background: '#fafafa', padding: '80px 24px'}}>
        <div style={{maxWidth: 1000, margin: '0 auto'}}>
          <h2 style={{fontSize: 48, fontWeight: 800, textAlign: 'center', marginBottom: 64}}>Clean 10K emails in 3 steps</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48}}>
            {[
              {step: '01', title: 'Upload CSV', desc: 'Drag & drop your list. We auto-detect email column.'},
              {step: '02', title: 'SMTP Verify', desc: 'We ping each mailbox. Valid, invalid, risky tagged live.'},
              {step: '03', title: 'Download + Send', desc: 'Export clean list. Report bounces for 10x refund.'},
            ].map(i => (
              <div key={i.step}>
                <div style={{color: '#6366f1', fontWeight: 800, fontSize: 14, marginBottom: 12}}>STEP {i.step}</div>
                <h3 style={{fontSize: 24, fontWeight: 700, marginBottom: 12}}>{i.title}</h3>
                <p style={{color: '#737373', lineHeight: 1.7}}>{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{maxWidth: 1200, margin: '0 auto', padding: '80px 24px'}}>
        <div style={{textAlign: 'center', marginBottom: 48}}>
          <h2 style={{fontSize: 48, fontWeight: 800, marginBottom: 16}}>Simple, honest pricing</h2>
          <p style={{fontSize: 18, color: '#737373'}}>Start free. Upgrade when you scale.</p>
          <div style={{display: 'inline-flex', background: '#f5f5f5', padding: 4, borderRadius: 8, marginTop: 24}}>
            <button onClick={() => setYearly(false)} style={{padding: '8px 16px', borderRadius: 6, border: 0, background: !yearly ? '#fff' : 'transparent', fontWeight: 600, cursor: 'pointer'}}>
              Monthly
            </button>
            <button onClick={() => setYearly(true)} style={{padding: '8px 16px', borderRadius: 6, border: 0, background: yearly ? '#fff' : 'transparent', fontWeight: 600, cursor: 'pointer'}}>
              Yearly <span style={{color: '#16a34a', fontSize: 12}}>Save 20%</span>
            </button>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900, margin: '0 auto'}}>
          <div style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: 24, padding: 40}}>
            <h3 style={{fontSize: 24, fontWeight: 700}}>Free</h3>
            <div style={{margin: '24px 0'}}>
              <span style={{fontSize: 56, fontWeight: 800}}>$0</span>
            </div>
            <ul style={{lineHeight: 2.2, color: '#525252', paddingLeft: 20, marginBottom: 32}}>
              <li>100 SMTP verifies/day</li>
              <li>5K extractor chars/day</li>
              <li>1 bulk job/day</li>
              <li>DNS checker</li>
              <li>10x refund on bounces</li>
            </ul>
            <Link href="/dashboard" style={{display: 'block', textAlign: 'center', width: '100%', padding: 14, background: '#f5f5f5', color: '#0a0a0a', borderRadius: 12, textDecoration: 'none', fontWeight: 600}}>
              Start Free
            </Link>
          </div>

          <div style={{background: 'linear-gradient(135deg, #0a0a0a 0%, #262626 100%)', color: '#fff', borderRadius: 24, padding: 40, position: 'relative', transform: 'scale(1.05)'}}>
            <div style={{position: 'absolute', top: -12, right: 24, background: '#8b5cf6', color: '#fff', padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 700}}>
              MOST POPULAR
            </div>
            <h3 style={{fontSize: 24, fontWeight: 700}}>Pro</h3>
            <div style={{margin: '24px 0'}}>
              <span style={{fontSize: 56, fontWeight: 800}}>${yearly ? '15' : '19'}</span>
              <span style={{color: '#a3a3a3'}}>/mo</span>
            </div>
            <ul style={{lineHeight: 2.2, color: '#d4d4d4', paddingLeft: 20, marginBottom: 32}}>
              <li>10,000 SMTP verifies/day</li>
              <li>Unlimited extractor</li>
              <li>Unlimited bulk jobs</li>
              <li>Priority API access</li>
              <li>10x refund guarantee</li>
              <li>Email support</li>
            </ul>
            <Link href="/dashboard" style={{display: 'block', textAlign: 'center', width: '100%', padding: 14, background: '#fff', color: '#0a0a0a', borderRadius: 12, textDecoration: 'none', fontWeight: 600}}>
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{maxWidth: 1200, margin: '0 auto', padding: '80px 24px'}}>
        <h2 style={{fontSize: 48, fontWeight: 800, textAlign: 'center', marginBottom: 64}}>Agencies love the refund</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
          {[
            {name: 'Alex K.', role: 'Cold Email Agency', text: 'NeverBounce charged me for 2K bounces. CleanBounce refunded me 20K credits. We switched same day.'},
            {name: 'Sarah M.', role: 'Lead Gen Founder', text: 'The 10x refund is real. I reported 50 bounces, got 500 credits back in 10 seconds. Insane.'},
            {name: 'Mike T.', role: 'B2B SaaS', text: 'Finally an API that shows real SMTP codes. Debugging deliverability is 10x easier now.'},
          ].map(t => (
            <div key={t.name} style={{background: '#fafafa', border: '1px solid #f1f1f1', borderRadius: 16, padding: 32}}>
              <p style={{color: '#404040', lineHeight: 1.7, marginBottom: 24}}>"{t.text}"</p>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'}}></div>
                <div>
                  <div style={{fontWeight: 600}}>{t.name}</div>
                  <div style={{color: '#737373', fontSize: 14}}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', margin: '80px 24px', borderRadius: 24, padding: '80px 24px', textAlign: 'center', color: '#fff'}}>
        <h2 style={{fontSize: 48, fontWeight: 800, marginBottom: 16}}>Stop paying for bounced emails</h2>
        <p style={{fontSize: 18, opacity: 0.9, marginBottom: 32}}>Join 200+ agencies who switched this month.</p>
        <Link href="/dashboard" style={{display: 'inline-block', background: '#fff', color: '#6366f1', padding: '16px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 18}}>
          Get Your Free API Key →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop: '1px solid #f1f1f1', padding: '48px 24px'}}>
        <div style={{maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <div style={{width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'}}></div>
            <span style={{fontWeight: 700}}>CleanBounce</span>
          </div>
          <div style={{display: 'flex', gap: 32, color: '#737373', fontSize: 14}}>
            <Link href="/privacy" style={{color: '#737373', textDecoration: 'none'}}>Privacy</Link>
            <Link href="/terms" style={{color: '#737373', textDecoration: 'none'}}>Terms</Link>
            <a href="mailto:support@cleanbounce.com" style={{color: '#737373', textDecoration: 'none'}}>Support</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
      }
