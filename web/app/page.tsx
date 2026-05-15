'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Zap, Database, Upload, CheckCircle2, Download, Moon, Sun, Copy, Check, ArrowRight, Code2, Webhook, Activity, Users } from 'lucide-react'

export default function Home() {
  const [yearly, setYearly] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('john@company.com')
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [darkMode])

  useEffect(() => {
    const messages = [
      '✓ Sarah from New York verified 12,400 emails',
      '✓ Agency switched from NeverBounce',
      '✓ 50,000 emails cleaned today',
      '✓ Mike from SF upgraded to Pro',
    ]
    let i = 0
    const interval = setInterval(() => {
      setNotifications(prev => [...prev.slice(-2), { id: Date.now(), text: messages[i % messages.length] }])
      i++
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleDemo = async () => {
    setVerifying(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 800))
    setResult({ status: 'valid', smtp: '250 OK', score: 99, catchAll: false })
    setVerifying(false)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(`curl -X POST https://api.cleanbounce.ai/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"email":"${email}"}'`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-dark-900 text-gray-900 dark:text-white transition-colors duration-300">
        {/* NOISE + GRADIENT BLURS */}
        <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.02] pointer-events-none z-0" />
        <div className="fixed -top-48 -right-48 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-[80px] animate-float pointer-events-none" />
        <div className="fixed -bottom-72 -left-48 w-[700px] h-[700px] bg-gradient-to-br from-purple-500/12 to-indigo-500/12 blur-[100px] animate-float pointer-events-none" style={{animationDelay: '5s'}} />

        {/* NAV */}
        <nav className="sticky top-0 z-50 border-b border-gray-100 dark:border-white/[0.06] backdrop-blur-xl bg-white/80 dark:bg-dark-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30" />
              <span className="font-extrabold text-xl tracking-tight">CleanBounce</span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="#features" className="nav-link text-gray-600 dark:text-gray-400 text-[15px] font-medium hidden md:block">Features</Link>
              <Link href="#pricing" className="nav-link text-gray-600 dark:text-gray-400 text-[15px] font-medium hidden md:block">Pricing</Link>
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                {darkMode? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link href="/dashboard" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-semibold text-[15px] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                Start Free →
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-36 pb-20 md:pb-28 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm shadow-green-500/10">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.2)] animate-pulse-slow" />
              10x Refund Guarantee Live
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold leading-[1.05] tracking-[-0.04em] mb-7 bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent max-w-4xl mx-auto">
              Stop Paying for<br/>Emails That Bounce
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Real SMTP verification with 99.2% accuracy. If we mark an email valid and it bounces,
              we refund you 10x credits instantly.
            </p>

            <div className="flex gap-3 justify-center mb-5 flex-wrap">
              <Link href="/dashboard" className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-[17px] shadow-xl shadow-indigo-500/35 hover:shadow-2xl hover:shadow-indigo-500/45 hover:-translate-y-0.5 hover:scale-[1.02] transition-all inline-flex items-center gap-2">
                Get 100 Free Verifications <ArrowRight size={18} />
              </Link>
              <Link href="#demo" className="bg-white dark:bg-dark-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-dark-700 px-8 py-4 rounded-xl font-semibold text-[17px] hover:bg-gray-50 dark:hover:bg-dark-700 transition-all">
                Watch 45s Demo
              </Link>
            </div>

            <p className="text-gray-400 text-sm font-medium">No credit card required • 2-minute setup</p>

            {/* SOCIAL PROOF METRICS */}
            <div className="flex gap-8 md:gap-16 justify-center mt-16 flex-wrap">
              {[
                {value: '12M+', label: 'Emails Verified'},
                {value: '99.2%', label: 'Accuracy'},
                {value: '200+', label: 'Agencies Switched'}
              ].map(m => (
                <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight">{m.value}</div>
                  <div className="text-gray-500 dark:text-gray-500 text-sm mt-1">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* REAL DASHBOARD UI - NOT PNG */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-20 relative">
            <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-3xl p-2 shadow-2xl shadow-gray-900/10 dark:shadow-black/50 max-w-5xl mx-auto overflow-hidden">
              <div className="bg-gray-50 dark:bg-dark-900 rounded-2xl p-6 border border-gray-200 dark:border-dark-700">
                <div className="flex gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>

                {/* DASHBOARD CONTENT */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-dark-700">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Bulk Verification Results</div>
                    <div className="text-xs text-gray-500">2,847 / 3,000 processed</div>
                  </div>

                  {[
                    {email: 'john@company.com', status: 'valid', score: 99},
                    {email: 'sarah@startup.io', status: 'valid', score: 98},
                    {email: 'admin@oldsite.com', status: 'invalid', score: 0},
                    {email: 'info@generic.co', status: 'catch-all', score: 45},
                  ].map((row, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center justify-between py-3 px-4 rounded-lg bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className={row.status === 'valid'? 'text-green-500' : row.status === 'invalid'? 'text-red-500' : 'text-yellow-500'} />
                        <span className="text-sm font-medium">{row.email}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          row.status === 'valid'? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          row.status === 'invalid'? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}>
                          {row.status}
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{row.score}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-[60px] -z-10 animate-pulse-slow" />
          </motion.div>

          {/* TRUSTED LOGOS */}
          <div className="mt-20">
            <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-8">Trusted by agencies using</p>
            <div className="flex gap-8 md:gap-14 justify-center items-center flex-wrap opacity-40 dark:opacity-50">
              {['Instantly', 'Smartlead', 'Lemlist', 'Apollo', 'Clay'].map(t => (
                <div key={t} className="text-gray-900 dark:text-white font-extrabold text-xl tracking-tight">{t}</div>
              ))}
            </div>
          </div>
        </section>

        {/* LIVE API DEMO */}
        <section id="demo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5">Try it live</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">Verify an email in real-time. See SMTP response codes.</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl p-8">
              <div className="text-sm font-semibold mb-4 text-gray-500 dark:text-gray-400">REQUEST</div>
              <div className="bg-gray-50 dark:bg-dark-900 rounded-xl p-5 font-mono text-sm mb-4 relative border border-gray-200 dark:border-dark-700">
                <button onClick={copyCode} className="absolute top-3 right-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg px-3 py-1.5 cursor-pointer flex items-center gap-1.5 text-xs font-medium hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
                  {copied? <Check size={14} /> : <Copy size={14} />}
                  {copied? 'Copied' : 'Copy'}
                </button>
                <div className="text-purple-600 dark:text-purple-400">curl</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">-X POST https://api.cleanbounce.ai/verify \</div>
                <div className="text-gray-600 dark:text-gray-400">-H "Authorization: Bearer YOUR_API_KEY" \</div>
                <div className="text-gray-600 dark:text-gray-400">-d '{`{"email":"${email}"}`}'</div>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-gray-900 dark:text-white text-[15px] mb-3 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-colors"
                placeholder="john@company.com"
              />
              <button onClick={handleDemo} disabled={verifying} className="w-full py-3.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-[15px] hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70">
                {verifying? 'Verifying...' : 'Verify Email'}
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl p-8">
              <div className="text-sm font-semibold mb-4 text-gray-500 dark:text-gray-400">RESPONSE</div>
              <div className="bg-gray-50 dark:bg-dark-900 rounded-xl p-5 font-mono text-sm min-h-[240px] border border-gray-200 dark:border-dark-700">
                <AnimatePresence mode="wait">
                  {result? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="text-green-600 dark:text-green-400">{`{`}</div>
                      <div className="ml-4 text-gray-600 dark:text-gray-400">"status": <span className="text-green-600 dark:text-green-400">"{result.status}"</span>,</div>
                      <div className="ml-4 text-gray-600 dark:text-gray-400">"smtp": <span className="text-indigo-600 dark:text-indigo-400">"{result.smtp}"</span>,</div>
                      <div className="ml-4 text-gray-600 dark:text-gray-400">"score": <span className="text-amber-600 dark:text-amber-400">{result.score}</span>,</div>
                      <div className="ml-4 text-gray-600 dark:text-gray-400">"catchAll": <span className="text-red-600 dark:text-red-400">false</span></div>
                      <div className="text-green-600 dark:text-green-400">{`}`}</div>
                    </motion.div>
                  ) : (
                    <div className="text-gray-400 dark:text-gray-600">Run verification to see response...</div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="text-center mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
                Why agencies switch from<br/>NeverBounce
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">Built for cold email. Not generic marketers.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-7 feature-card bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20 border border-purple-200 dark:border-purple-900/50 rounded-3xl p-12">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center mb-7 shadow-lg shadow-purple-500/25">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <h3 className="text-3xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">10x Refund Engine</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[17px]">
                If we're wrong, you get 10x credits back. Simple.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="md:col-span-5 feature-card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-900/50 rounded-3xl p-10 flex flex-col justify-center">
              <div className="text-6xl font-extrabold text-green-600 dark:text-green-500 tracking-tight leading-none">99.2%</div>
              <div className="text-green-700 dark:text-green-400 font-bold mt-3 text-lg">SMTP Accuracy</div>
              <p className="text-gray-600 dark:text-gray-400 mt-5 text-[15px] leading-relaxed">Real mailbox ping. Not regex.</p>
            </motion.div>

            {[
              {icon: Zap, title: '10ms Verify Speed', desc: 'Bulk verify 10K emails in 3 minutes.', color: 'from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20', iconBg: 'from-blue-500 to-sky-500'},
              {icon: ShieldCheck, title: 'SPF/DKIM Audit', desc: 'Check domain health before you send.', color: 'from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20', iconBg: 'from-amber-500 to-yellow-500'},
              {icon: Database, title: 'Catch-All Detection', desc: 'We flag risky domains. You decide.', color: 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20', iconBg: 'from-red-500 to-rose-500'},
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} className="md:col-span-4 feature-card bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-3xl p-9">
                <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${f.iconBg} flex items-center justify-center mb-5`}>
                  <f.icon size={26} className="text-white" />
                </div>
                <h3 className="text-[22px] font-bold mb-2.5 tracking-tight">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="md:col-span-12 feature-card bg-gradient-to-br from-slate-50 to-gray-50 dark:from-dark-800 dark:to-dark-700 border border-gray-200 dark:border-dark-700 rounded-3xl p-12 flex items-center gap-12 flex-col md:flex-row">
         
