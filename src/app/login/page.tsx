'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error

                // Check if this is an extension login
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
                setIsLogin(true)
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

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <button onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${isLogin ? 'text-white' : 'text-white/35 hover:text-white/60'}`}
                        style={isLogin ? { background: 'rgba(0,240,255,0.1)', color: 'var(--accent)' } : {}}>
                        Login
                    </button>
                    <button onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${!isLogin ? 'text-white' : 'text-white/35 hover:text-white/60'}`}
                        style={!isLogin ? { background: 'rgba(124,58,237,0.12)', color: 'var(--accent2)' } : {}}>
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-white/35 uppercase tracking-wider ml-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="name@company.com" className="input-field" required />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-white/35 uppercase tracking-wider ml-1">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                            placeholder={isLogin ? 'Enter your password' : 'Create a strong password (min 6 chars)'}
                            className="input-field" required minLength={6} />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {success && <p className="text-sm" style={{ color: 'var(--accent)' }}>{success}</p>}

                    <button type="submit" disabled={loading}
                        className="btn-glow w-full !py-3.5 !text-[16px] mt-1">
                        {loading ? '...' : isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-[11px] text-white/25 mt-6">
                    By continuing, you agree to our Terms of Service.
                </p>
            </motion.div>
        </div>
    )
}
