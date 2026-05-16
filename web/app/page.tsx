'use client'
import { useState } from 'react'
import { Upload, FileText, Download, AlertCircle } from 'lucide-react'

export default function BulkVerifier() {
  const [file, setFile] = useState<File | null>(null)
  const [jobId, setJobId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/bulk/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setJobId(data.jobId)
        pollStatus(data.jobId)
      }
    } catch (e) {
      setError('Upload failed')
    }
    setLoading(false)
  }

  const pollStatus = async (id: string) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/bulk/status?jobId=${id}`)
      const data = await res.json()
      
      if (data.status === 'done') {
        setResult(data)
        clearInterval(interval)
      }
    }, 2000)
  }
<section className="bg-gradient-to-br from-red-50 to-orange-50 py-20 text-center">
  <h2 className="text-4xl font-extrabold mb-4">10x Refund Guarantee</h2>
  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
    If we mark an email "valid" and it hard bounces, we refund 10x credits. 
    No other email verifier does this. Because we’re that accurate.
  </p>
</section>
  return (
    <div style={{maxWidth: 800, margin: '40px auto', padding: 20}}>
      <h1 style={{fontSize: 32, marginBottom: 8}}>Bulk Verifier – 10K Emails</h1>
      <p style={{color: '#888', marginBottom: 24}}>Upload CSV. We verify via SMTP. Takes ~1 email/sec.</p>

      <div style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, padding: 32, marginBottom: 24}}>
        <div style={{border: '2px dashed #d4d4d4', borderRadius: 12, padding: 40, textAlign: 'center', marginBottom: 16}}>
          <Upload size={32} color="#737373" style={{margin: '0 auto 16px'}} />
          <input 
            type="file" 
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{display: 'none'}}
            id="file-upload"
          />
          <label htmlFor="file-upload" style={{cursor: 'pointer', color: '#6366f1', fontWeight: 600}}>
            Click to upload CSV
          </label>
          {file && <div style={{marginTop: 12, fontSize: 14, color: '#737373'}}>{file.name}</div>}
        </div>

        <button 
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            width: '100%', 
            padding: '14px 24px', 
            borderRadius: 12, 
            background: file? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#e5e5e5', 
            color: '#fff', 
            border: 0, 
            fontWeight: 700, 
            cursor: file? 'pointer' : 'not-allowed'
          }}
        >
          {loading? 'Processing...' : 'Verify Emails'}
        </button>

        {error && (
          <div style={{marginTop: 16, padding: 16, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, display: 'flex', gap: 12}}>
            <AlertCircle size={20} color="#dc2626" />
            <span style={{color: '#dc2626', fontSize: 14}}>{error}</span>
          </div>
        )}
      </div>

      {result && (
        <div style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, padding: 32}}>
          <h2 style={{fontSize: 24, marginBottom: 16}}>Results</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: 32, fontWeight: 800, color: '#16a34a'}}>{result.valid || 0}</div>
              <div style={{fontSize: 14, color: '#737373'}}>Valid</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: 32, fontWeight: 800, color: '#dc2626'}}>{result.invalid || 0}</div>
              <div style={{fontSize: 14, color: '#737373'}}>Invalid</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: 32, fontWeight: 800, color: '#f59e0b'}}>{result.catchAll || 0}</div>
              <div style={{fontSize: 14, color: '#737373'}}>Catch-all</div>
            </div>
          </div>
          <button style={{width: '100%', padding: '14px 24px', borderRadius: 12, background: '#16a34a', color: '#fff', border: 0, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
            <Download size={18} />
            Download Clean CSV
          </button>
        </div>
      )}
    </div>
  )
            }
