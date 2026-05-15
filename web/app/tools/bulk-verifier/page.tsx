'use client'
import { useState, useEffect } from 'react'

export default function BulkVerifier() {
  const [file, setFile] = useState<File | null>(null)
  const [jobId, setJobId] = useState('')
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  async function upload() {
    if (!file) return
    setLoading(true)
    const form = new FormData()
    form.append('file', file)

    const res = await fetch(`${API_URL}/api/bulk/upload`, {
      method: 'POST',
      body: form
    })
    const data = await res.json()
    setJobId(data.job_id)
    setLoading(false)
  }

  useEffect(() => {
    if (!jobId) return
    const interval = setInterval(async () => {
      const res = await fetch(`${API_URL}/api/bulk/status/${jobId}`)
      const data = await res.json()
      setStatus(data)
      if (data.status === 'done') clearInterval(interval)
    }, 2000)
    return () => clearInterval(interval)
  }, [jobId])

  return (
    <div style={{maxWidth: 800, margin: '40px auto', padding: 20}}>
      <h1 style={{fontSize: 32, marginBottom: 8}}>Bulk Verifier – 10K Emails</h1>
      <p style={{color: '#888', marginBottom: 24}}>Upload CSV. We verify via SMTP. Takes ~1 email/sec.</p>

      <input
        type="file"
        accept=".csv"
        onChange={e => setFile(e.target.files?.[0] || null)}
        style={{width: '100%', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: 12}}
      />

      <button
        onClick={upload}
        disabled={loading ||!file}
        style={{width: '100%', marginTop: 16, padding: 14, background: '#fff', color: '#000', border: 0, borderRadius: 8, fontSize: 16, fontWeight: 600}}
      >
        {loading? 'Uploading...' : 'Start Verification'}
      </button>

      {status && (
        <div style={{marginTop: 24, background: '#111', border: '1px solid #333', borderRadius: 8, padding: 16}}>
          <div>Status: {status.status}</div>
          <div>Progress: {status.processed}/{status.total}</div>
          <div>Valid: {status.valid || 0}</div>

          {status.status === 'done' && (
  <div style={{display: 'flex', gap: 12, marginTop: 12}}>
    <a
      href={`${API_URL}/api/bulk/download/${jobId}`}
      style={{background: '#10b981', color: '#000', padding: '8px 16px', borderRadius: 6, textDecoration: 'none', fontWeight: 600}}
    >
      Download Results CSV
    </a>
    
    <button onClick={() => {
      const email = prompt('Which email bounced after sending?')
      if (!email) return
      fetch(`${API_URL}/api/report/bounce`, {
        method: 'POST',
        headers: {
          'X-API-Key': localStorage.getItem('api_key') || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, job_id: jobId})
      })
      .then(r => r.json())
      .then(d => {
        if (d.refunded) {
          alert(`Refunded ${d.refunded} credits. We marked it valid but it bounced.`)
        } else {
          alert(d.error || 'Could not refund. Email was not marked valid by us.')
        }
      })
    }}
    style={{background: '#f43f5e', color: '#fff', border: 0, padding: '8px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer'}}>
      Report Bounce – Get 10x Refund
    </button>
  </div>
)}
            </a>
          )}
        </div>
      )}
    </div>
  )
        }
