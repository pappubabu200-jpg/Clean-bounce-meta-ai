'use client'
import { useState } from 'react'

export default function EmailExtractor() {
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<{emails: string[], total: number} | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  async function extract() {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${API_URL}/api/tools/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, url })
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
    const csv = 'email\n' + result.emails.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'emails.csv'
    link.click()
  }

  return (
    <div style={{maxWidth: 800, margin: '40px auto', padding: 20}}>
      <h1 style={{fontSize: 32, marginBottom: 8}}>Email Extractor – Free</h1>
      <p style={{color: '#888', marginBottom: 24}}>Extract emails from text or any URL. 100% free.</p>

      <textarea
        placeholder="Paste text here..."
        value={text}
        onChange={e => setText(e.target.value)}
        style={{width: '100%', height: 120, background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: 12, fontSize: 14}}
      />

      <div style={{margin: '16px 0', textAlign: 'center', color: '#666'}}>OR</div>

      <input
        placeholder="https://example.com"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{width: '100%', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: 12, fontSize: 14}}
      />

      <button
        onClick={extract}
        disabled={loading || (!text &&!url)}
        style={{width: '100%', marginTop: 16, padding: 14, background: loading? '#333' : '#fff', color: loading? '#888' : '#000', border: 0, borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: loading? 'default' : 'pointer'}}
      >
        {loading? 'Extracting...' : 'Extract Emails'}
      </button>

      {error && <div style={{marginTop: 16, color: '#f43f5e'}}>{error}</div>}

      {result && (
        <div style={{marginTop: 24, background: '#111', border: '1px solid #333', borderRadius: 8, padding: 16}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
            <span style={{fontWeight: 600}}>Found {result.total} emails</span>
            <button onClick={downloadCSV} style={{background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '6px 12px', cursor: 'pointer'}}>
              Download CSV
            </button>
          </div>
          <div style={{maxHeight: 300, overflow: 'auto'}}>
            {result.emails.map(e => (
              <div key={e} style={{padding: '8px 0', borderBottom: '1px solid #222', fontFamily: 'monospace', fontSize: 14}}>{e}</div>
            ))}
          </div>
          {result.total > 50 && <div style={{marginTop: 12, color: '#888', fontSize: 14}}>Showing first 50. Download CSV for all {result.total}.</div>}
        </div>
      )}
    </div>
  )
  }
