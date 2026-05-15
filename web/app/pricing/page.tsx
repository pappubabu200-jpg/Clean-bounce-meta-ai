'use client'
import { useState } from 'react'

export default function Pricing() {
  const [loading, setLoading] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  const apiKey = localStorage.getItem('api_key')

  async function checkout() {
    setLoading(true)
    const res = await fetch(`${API_URL}/api/billing/checkout`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey || '' }
    })
    const data = await res.json()
    window.location.href = data.url
  }

  return (
    <div style={{maxWidth: 900, margin: '40px auto', padding: 20, textAlign: 'center'}}>
      <h1 style={{fontSize: 48, marginBottom: 16}}>Simple Pricing</h1>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 40}}>

        <div style={{background: '#111', border: '1px solid #333', borderRadius: 12, padding: 32}}>
          <h2>Free</h2>
          <div style={{fontSize: 40, fontWeight: 700, margin: '16px 0'}}>$0</div>
          <ul style={{textAlign: 'left', lineHeight: 2}}>
            <li>100 SMTP verifies/day</li>
            <li>5K extractor chars/day</li>
            <li>1 bulk job/day</li>
          </ul>
          <button style={{width: '100%', padding: 12, marginTop: 24, background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 8}}>
            Current Plan
          </button>
        </div>

        <div style={{background: '#111', border: '2px solid #fff', borderRadius: 12, padding: 32}}>
          <h2>Pro</h2>
          <div style={{fontSize: 40, fontWeight: 700, margin: '16px 0'}}>$19<span style={{fontSize: 20}}>/mo</span></div>
          <ul style={{textAlign: 'left', lineHeight: 2}}>
            <li>10,000 SMTP verifies/day</li>
            <li>Unlimited extractor</li>
            <li>Unlimited bulk jobs</li>
            <li>API access</li>
          </ul>
          <button
            onClick={checkout}
            disabled={loading ||!apiKey}
            style={{width: '100%', padding: 12, marginTop: 24, background: '#fff', color: '#000', border: 0, borderRadius: 8, fontWeight: 600}}
          >
            {loading? 'Loading...' : 'Upgrade to Pro'}
          </button>
        </div>

      </div>
    </div>
  )
                       }
