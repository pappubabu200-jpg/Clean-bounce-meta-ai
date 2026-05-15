'use client'
import { useState } from 'react'

export default function DNSChecker() {
  const [domain, setDomain] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  async function check() {
    setLoading(true)
    const res = await fetch(`${API_URL}/api/tools/dns/${domain}`)
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div style={{maxWidth: 800, margin: '40px auto', padding: 20}}>
      <h1 style={{fontSize: 32, marginBottom: 8}}>DNS Checker – SPF/DKIM/DMARC</h1>
      <p style={{color: '#888', marginBottom: 24}}>Check email authentication for any domain.</p>

      <div style={{display: 'flex', gap: 8}}>
        <input
          placeholder="example.com"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          style={{flex: 1, background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: 12}}
        />
        <button
          onClick={check}
          disabled={loading ||!domain}
          style={{padding: '12px 24px', background: '#fff', color: '#000', border: 0, borderRadius: 8, fontWeight: 600}}
        >
          {loading? 'Checking...' : 'Check'}
        </button>
      </div>

      {result && (
        <div style={{marginTop: 24, background: '#111', border: '1px solid #333', borderRadius: 8, padding: 16}}>
          <div style={{marginBottom: 16}}><b>MX:</b> {result.mx?.join(', ') || 'None'}</div>
          <div style={{marginBottom: 16}}><b>SPF:</b> <code style={{color: result.spf? '#10b981' : '#f43f5e'}}>{result.spf || 'Missing'}</code></div>
          <div style={{marginBottom: 16}}><b>DKIM:</b> <span style={{color: result.dkim? '#10b981' : '#f43f5e'}}>{result.dkim? 'Found' : 'Missing'}</span></div>
          <div><b>DMARC:</b> <code style={{color: result.dmarc? '#10b981' : '#f43f5e'}}>{result.dmarc || 'Missing'}</code></div>
        </div>
      )}
    </div>
  )
                  }
