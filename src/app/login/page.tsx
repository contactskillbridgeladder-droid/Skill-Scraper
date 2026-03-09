'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const ref = new URLSearchParams(window.location.search).get('ref')
        if (ref) {
            localStorage.setItem('referral_code', ref)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            if (mode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/login`,
                })
                if (error) throw error
                setSuccess('Password reset email sent! Check your inbox.')
                return
            }

            if (mode === 'login') {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error

                const isExt = new URLSearchParams(window.location.search).get('ext') === 'true'
                if (isExt && data.session) {
                    setSuccess('Login successful! You can close this tab and return to the extension.')
                    window.postMessage({
                        type: 'EXTENSION_LOGIN_SUCCESS',
                        token: data.session.access_token
                    }, '*')
                } else {
                    router.push('/dashboard')
                }
            } else {
                const { data, error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
                if (data.user) {
                    await supabase.from('user_plans').upsert({
                        user_id: data.user.id,
                        plan: 'free',
                        quota: 200,
                        used: 0
                    })
                }
                setSuccess('Account created! Check your email to verify, then login.')
                setMode('login')
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-5" style={{ paddingTop: '100px' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="glass p-8 w-full max-w-md relative z-10">

                <Link href="/" className="flex flex-col items-center justify-center gap-3 mb-8">
                    <img src="/logo.png" alt="Skill Scraper" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                    <span className="text-xl font-bold text-grad">Skill Scraper</span>
                </Link>

                {mode === 'forgot' ? (
                    <>
                        <h2 className="text-lg font-semibold text-center mb-1">Reset Password</h2>
                        <p className="text-white/30 text-sm text-center mb-6">Enter your email and we&apos;ll send you a reset link.</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-white/35 uppercase tracking-wider ml-1">Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="name@company.com" className="input-field" required
                                    aria-label="Email address" />
                            </div>

                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            {success && <p className="text-sm" style={{ color: 'var(--accent)' }}>{success}</p>}

                            <button type="submit" disabled={loading}
                                className="btn-glow w-full !py-3.5 !text-[16px]">
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>

                        <button onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                            className="w-full text-center text-sm text-white/30 hover:text-white/60 transition-colors mt-4">
                            ← Back to Login
                        </button>
                    </>
                ) : (
                    <>
                        {/* Google Login */}
                        <button
                            onClick={async () => {
                                await supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: { redirectTo: `${window.location.origin}/dashboard` }
                                })
                            }}
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium mb-5"
                            aria-label="Sign in with Google"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="flex items-center gap-4 mb-5">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-[11px] text-white/20 uppercase tracking-wider font-medium">or</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(0,0,0,0.3)' }}>
                            <button onClick={() => setMode('login')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${mode === 'login' ? 'text-white' : 'text-white/35 hover:text-white/60'}`}
                                style={mode === 'login' ? { background: 'rgba(0,240,255,0.1)', color: 'var(--accent)' } : {}}>
                                Login
                            </button>
                            <button onClick={() => setMode('signup')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${mode === 'signup' ? 'text-white' : 'text-white/35 hover:text-white/60'}`}
                                style={mode === 'signup' ? { background: 'rgba(124,58,237,0.12)', color: 'var(--accent2)' } : {}}>
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-white/35 uppercase tracking-wider ml-1">Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="name@company.com" className="input-field" required
                                    aria-label="Email address" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-white/35 uppercase tracking-wider ml-1">Password</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password (min 6 chars)'}
                                    className="input-field" required minLength={6}
                                    aria-label="Password" />
                            </div>

                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            {success && <p className="text-sm" style={{ color: 'var(--accent)' }}>{success}</p>}

                            <button type="submit" disabled={loading}
                                className="btn-glow w-full !py-3.5 !text-[16px] mt-1">
                                {loading ? '...' : mode === 'login' ? 'Login' : 'Create Account'}
                            </button>
                        </form>

                        {mode === 'login' && (
                            <button onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
                                className="w-full text-center text-sm text-white/30 hover:text-white/60 transition-colors mt-4">
                                Forgot password?
                            </button>
                        )}
                    </>
                )}

                <p className="text-center text-[11px] text-white/25 mt-6">
                    By continuing, you agree to our{' '}
                    <Link href="/terms" className="text-white/40 hover:text-[#00f0ff] transition-colors">Terms</Link>{' & '}
                    <Link href="/privacy" className="text-white/40 hover:text-[#00f0ff] transition-colors">Privacy Policy</Link>.
                </p>
            </motion.div>
        </div>
    )
}
