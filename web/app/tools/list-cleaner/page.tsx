'use client'
import { useState } from 'react'

type VerifyResult = {
  email: string, syntax: boolean, mx: boolean, smtp: boolean,
  disposable: boolean, valid: boolean, reason: string
}

export default function ListCleaner() {
  const [emails, setEmails] = useState('')
  const [result, setResult] = useState<{total: number, valid: number, invalid: number, results: VerifyResult[]} | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  async function clean() {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const emailList = emails.split('\n').map(e => e.trim()).filter(Boolean)
      if (emailList.length > 100) throw new Error('Max 100 emails per run on free plan')

      const res = await fetch(`${API_URL}/api/tools/clean`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: emailList })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function downloadCSV() {
    if (!result) return
    const csv = 'email,status,reason\n' + result.results.map(r =>
      `${r.email},${r.valid? 'valid' : 'invalid'},${r.reason}`
    ).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'verified.csv'
    link.click()
  }

  return (
    <div style={{maxWidth: 900, margin: '40px auto', padding: 20}}>
      <h1 style={{fontSize: 32, marginBottom: 8}}>List Cleaner Pro – MX/SMTP</h1>
      <p style={{color: '#888', marginBottom: 24}}>Real mailbox verification. 100 free per day.</p>

      <textarea
        placeholder="test@gmail.com&#10;fake@nodomain.xyz&#10;john@company.com"
        value={emails}
        onChange={e => setEmails(e.target.value)}
        style={{width: '100%', height: 200, background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: 12, fontSize: 14, fontFamily: 'monospace'}}
      />

      <div style={{color: '#666', fontSize: 14, marginTop: 8}}>
        {emails.split('\n').filter(Boolean).length}/100 emails
      </div>

      <button
        onClick={clean}
        disabled={loading ||!emails}
        style={{width: '100%', marginTop: 16, padding: 14, background: loading? '#333' : '#fff', color: loading? '#888' : '#000', border: 0, borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: loading? 'default' : 'pointer'}}
      >
        {loading? 'Verifying...' : 'Verify with SMTP'}
      </button>

      {error && <div style={{marginTop: 16, color: '#f43f5e'}}>{error}</div>}

      {result && (
        <div style={{marginTop: 24, background: '#111', border: '1px solid #333', borderRadius: 8, padding: 16}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24}}>
              <div>
                <div style={{color: '#888', fontSize: 14}}>Total</div>
                <div style={{fontSize: 24, fontWeight: 600}}>{result.total}</div>
              </div>
              <div>
                <div style={{color: '#888', fontSize: 14}}>Valid</div>
                <div style={{fontSize: 24, fontWeight: 600, color: '#10b981'}}>{result.valid}</div>
              </div>
              <div>
                <div style={{color: '#888', fontSize: 14}}>Invalid</div>
                <div style={{fontSize: 24, fontWeight: 600, color: '#f43f5e'}}>{result.invalid}</div>
              </div>
            </div>
            <button onClick={downloadCSV} style={{background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', height: 36}}>
              Download CSV
            </button>
          </div>

          <table style={{width: '100%', fontSize: 14}}>
            <thead>
              <tr style={{textAlign: 'left', color: '#888'}}>
                <th style={{padding: '8px 0'}}>Email</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {result.results.map(r => (
                <tr key={r.email} style={{borderTop: '1px solid #222'}}>
                  <td style={{padding: '8px 0', fontFamily: 'monospace'}}>{r.email}</td>
                  <td style={{color: r.valid? '#10b981' : '#f43f5e'}}>{r.valid? 'Valid' : 'Invalid'}</td>
                  <td style={{color: '#888'}}>{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
                              }
