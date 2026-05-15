'use client'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('api_key') || '')
  const [usage, setUsage] = useState<any>(null)
  const [email, setEmail] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  async function signup() {
    const form = new FormData()
    form.append('email', email)
    const res = await fetch(`${API_URL}/api/auth/signup`, { method: 'POST', body: form })
    const data = await res.json()
    setApiKey(data.api_key)
    localStorage.setItem('api_key', data.api_key)
  }

  useEffect(() => {
    if (!apiKey) return
    fetch(`${API_URL}/api/usage`, { headers: { 'X-API-Key': apiKey } })
     .then(r => r.json()).then(setUsage)
  }, [apiKey])

  if (!apiKey) {
    return (
      <div style={{maxWidth: 400, margin: '100px auto', padding: 20}}>
        <h1>Get Free API Key</h1>
        <input placeholder="email@company.com" value={email} onChange={e => setEmail(e.target.value)}
          style={{width: '100%', padding: 12, margin: '16px 0', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 8}} />
        <button onClick={signup} style={{width: '100%', padding: 12, background: '#fff', color: '#000', border: 0, borderRadius: 8, fontWeight: 600}}>
          Generate Key
        </button>
      </div>
    )
  }

  return (
    <div style={{maxWidth: 800, margin: '40px auto', padding: 20}}>
      <h1>Dashboard</h1>
      <div style={{background: '#111', padding: 16, borderRadius: 8, marginBottom: 24}}>
        <div style={{color: '#888', fontSize: 14}}>API Key</div>
        <code>{apiKey}</code>
      </div>

      {usage && (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
          <div style={{background: '#111', padding: 16, borderRadius: 8}}>
            <div style={{color: '#888'}}>SMTP Verifications</div>
            <div style={{fontSize: 32, fontWeight: 600}}>{usage.clean_used}/{usage.clean_limit}</div>
          </div>
          <div style={{background: '#111', padding: 16, borderRadius: 8}}>
            <div style={{color: '#888'}}>Extractor Chars</div>
            <div style={{fontSize: 32, fontWeight: 600}}>{usage.extract_used}/{usage.extract_limit}</div>
          </div>
        </div>
      )}
    </div>
  )
}
