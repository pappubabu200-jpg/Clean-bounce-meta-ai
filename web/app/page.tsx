'use client'

import { useState, useEffect } from 'react'

type Usage = {
  clean_used: number
  clean_limit: number
  extract_used: number
  extract_limit: number
}

export default function Dashboard() {
  const [apiKey, setApiKey] = useState('')
  const [usage, setUsage] = useState<Usage | null>(null)

  const [email, setEmail] = useState('')
  const [bounceEmail, setBounceEmail] = useState('')
  const [msg, setMsg] = useState('')

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  // Load API key from localStorage safely
  useEffect(() => {
    const key = localStorage.getItem('api_key') || ''
    setApiKey(key)
  }, [])

  // Fetch usage
  useEffect(() => {
    if (!apiKey) return

    fetch(`${API_URL}/api/usage`, {
      headers: {
        'X-API-Key': apiKey,
      },
    })
      .then((r) => r.json())
      .then(setUsage)
      .catch(console.error)
  }, [apiKey, API_URL])

  // Signup / Generate API key
  async function signup() {
    try {
      const form = new FormData()
      form.append('email', email)

      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        body: form,
      })

      const data = await res.json()

      if (!data.api_key) {
        setMsg('Failed to generate API key')
        return
      }

      setApiKey(data.api_key)
      localStorage.setItem('api_key', data.api_key)
    } catch (err) {
      console.error(err)
      setMsg('Signup failed')
    }
  }

  // Report bounce
  async function handleReport() {
    try {
      const res = await fetch(`${API_URL}/api/report-bounce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          email: bounceEmail,
        }),
      })

      const data = await res.json()

      setMsg(
        data.success
          ? `Refunded ${data.refunded} credits`
          : 'No matching verification found'
      )
    } catch (err) {
      console.error(err)
      setMsg('Something went wrong')
    }
  }

  // Login / Signup screen
  if (!apiKey) {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: '100px auto',
          padding: 20,
        }}
      >
        <h1>Get Free API Key</h1>

        <input
          placeholder="email@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            margin: '16px 0',
            background: '#111',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: 8,
          }}
        />

        <button
          onClick={signup}
          style={{
            width: '100%',
            padding: 12,
            background: '#fff',
            color: '#000',
            border: 0,
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          Generate Key
        </button>

        {msg && (
          <div style={{ marginTop: 16 }}>
            {msg}
          </div>
        )}
      </div>
    )
  }

  // Dashboard
  return (
    <div
      style={{
        maxWidth: 900,
        margin: '40px auto',
        padding: 20,
      }}
    >
      <h1>Dashboard</h1>

      {/* API Key Card */}
      <div
        style={{
          background: '#111',
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            color: '#888',
            fontSize: 14,
            marginBottom: 8,
          }}
        >
          API Key
        </div>

        <code
          style={{
            wordBreak: 'break-all',
          }}
        >
          {apiKey}
        </code>
      </div>

      {/* Usage Cards */}
      {usage && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: '#111',
              padding: 16,
              borderRadius: 8,
            }}
          >
            <div style={{ color: '#888' }}>
              SMTP Verifications
            </div>

            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {usage.clean_used}/{usage.clean_limit}
            </div>
          </div>

          <div
            style={{
              background: '#111',
              padding: 16,
              borderRadius: 8,
            }}
          >
            <div style={{ color: '#888' }}>
              Extractor Chars
            </div>

            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {usage.extract_used}/{usage.extract_limit}
            </div>
          </div>
        </div>
      )}

      {/* 10x Refund Engine */}
      <div
        style={{
          background: '#fafafa',
          padding: 24,
          borderRadius: 12,
          border: '1px solid #e5e5e5',
        }}
      >
        <h2>10x Refund Engine</h2>

        <p>
          If we marked an email as valid and it bounced,
          we refund 10x credits.
        </p>

        <input
          value={bounceEmail}
          onChange={(e) => setBounceEmail(e.target.value)}
          placeholder="bounced@email.com"
          style={{
            width: '100%',
            padding: 12,
            marginTop: 12,
            marginBottom: 12,
            borderRadius: 8,
            border: '1px solid #d4d4d4',
          }}
        />

        <button
          onClick={handleReport}
          style={{
            padding: '12px 24px',
            background: '#dc2626',
            color: '#fff',
            border: 0,
            borderRadius: 8,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Report Bounce
        </button>

        {msg && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              background: '#f0fdf4',
              borderRadius: 8,
            }}
          >
            {msg}
          </div>
        )}
      </div>
    </div>
  )
      }
