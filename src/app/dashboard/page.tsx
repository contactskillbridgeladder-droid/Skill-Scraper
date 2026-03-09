'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, PLANS, PlanKey } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserPlan {
    plan: PlanKey
    quota: number
    used: number
    cycle_start?: string
}

export default function DashboardPage() {
    const [user, setUser] = useState<{ email?: string; id?: string } | null>(null)
    const [plan, setPlan] = useState<UserPlan | null>(null)
    const [pendingPayment, setPendingPayment] = useState<{ plan_requested: string; created_at: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    async function checkAuth() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/login'); return }
        setUser(user)

        const { data } = await supabase.from('user_plans').select('*').eq('user_id', user.id).single()
        setPlan(data || { plan: 'free', quota: 200, used: 0 })

        // Check for pending payments
        const { data: pendingData } = await supabase.from('payment_requests')
            .select('plan_requested, created_at')
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
        if (pendingData) setPendingPayment(pendingData)

        setLoading(false)
    }

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#00f0ff] animate-spin"></div>
        </div>
    )

    const currentPlan = plan ? PLANS[plan.plan] || PLANS.free : PLANS.free
    const usedPercent = plan ? Math.min(100, (plan.used / plan.quota) * 100) : 0
    const remaining = plan ? plan.quota - plan.used : 200

    return (
        <div className="w-full relative z-10">
            {/* Dashboard Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
                style={{ background: 'rgba(3, 0, 20, 0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                <div className="container-main flex items-center justify-between" style={{ height: '72px' }}>
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <img src="/logo.png" alt="Skill Scraper" className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" />
                        <span className="text-lg font-bold tracking-tight">Skill Scraper</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-white/40 hidden sm:block">{user?.email}</span>
                        <button onClick={handleLogout} className="btn-ghost !py-2.5 !px-5 !text-[13px]">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="container-main" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }} className="font-black tracking-[-0.03em] mb-3">
                        Welcome Back, <span className="text-grad-cyan">Scraper</span>
                    </h1>
                    <p className="text-white/35 text-[16px] font-light">
                        Here&apos;s an overview of your current usage and plan details.
                    </p>
                </motion.div>

                {/* Pending Payment Banner */}
                {pendingPayment && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-8 rounded-2xl p-5 flex items-center gap-4 border border-yellow-500/20"
                        style={{ background: 'rgba(255, 180, 0, 0.06)' }}>
                        <div className="text-3xl">⏳</div>
                        <div className="flex-1">
                            <div className="text-yellow-400 font-semibold text-sm mb-0.5">Payment Under Review</div>
                            <p className="text-white/35 text-xs font-light">
                                Your <span className="text-white/60 font-medium">{PLANS[pendingPayment.plan_requested as keyof typeof PLANS]?.name || pendingPayment.plan_requested}</span> upgrade
                                is being verified. This usually takes 1-24 hours.
                            </p>
                        </div>
                        <div className="text-xs text-white/20 shrink-0">
                            {new Date(pendingPayment.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
                    {/* Usage Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="md:col-span-8 glass relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f0ff] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white/30 mb-6">Quota Usage</div>

                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-6xl font-black tracking-tighter text-white/90">{plan?.used || 0}</span>
                            <span className="text-xl font-medium text-white/30 mb-2">/ {plan?.plan === 'enterprise' ? '∞' : plan?.quota} Leads</span>
                        </div>

                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-4">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${usedPercent}%` }} transition={{ delay: 0.4, duration: 1 }}
                                className={`h-full rounded-full relative ${usedPercent > 90 ? 'bg-[#ff0055]' : usedPercent > 70 ? 'bg-[#ffb400]' : 'bg-[#00f0ff]'}`}>
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </motion.div>
                        </div>

                        <div className="flex justify-between items-center text-sm font-medium text-white/35">
                            <span>{usedPercent.toFixed(1)}% Used</span>
                            <span>{plan?.plan === 'enterprise' ? 'Unlimited' : remaining} Exports Remaining</span>
                        </div>
                    </motion.div>

                    {/* Plan Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="md:col-span-4 glass flex flex-col justify-between">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white/30 mb-6">Active Plan</div>
                            <div className="text-3xl font-bold text-grad-cyan mb-2">{currentPlan.name}</div>
                            <div className="text-sm font-light text-white/35 leading-relaxed mb-6">{currentPlan.label}</div>
                        </div>

                        {plan?.plan !== 'enterprise' ? (
                            <Link href="/upgrade" className="btn-glow w-full text-center !text-[14px]">
                                Upgrade Plan 🚀
                            </Link>
                        ) : (
                            <div className="py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold"
                                style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                                ✅ Enterprise Key Active
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Installation Guide */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="glass">
                        <h3 className="text-xl font-semibold mb-6 tracking-tight">Installation Guide</h3>
                        <ul className="space-y-6">
                            {[
                                { step: '1', title: 'Download Bundle', desc: 'Get the latest version locally.' },
                                { step: '2', title: 'Developer Mode', desc: 'Visit chrome://extensions and enable it.' },
                                { step: '3', title: 'Load Unpacked', desc: 'Select the unzipped folder.' }
                            ].map((s, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center font-bold text-sm border border-[#00f0ff]/20 shrink-0">
                                        {s.step}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white/90 mb-1">{s.title}</div>
                                        <div className="text-sm font-light text-white/35">{s.desc}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="glass flex flex-col justify-center gap-4">
                        <h3 className="text-xl font-semibold mb-2 tracking-tight">Quick Actions</h3>

                        <a href="/skill-scraper-v1.7.3.zip" download
                            className="btn-glow w-full !justify-start !pl-6 !gap-4 !text-[14px]"
                            style={{ boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}>
                            <span className="text-xl">⬇️</span> Download Extension Bundle
                        </a>
                        <Link href="/upload-payment" className="btn-ghost w-full !justify-start !pl-6 !gap-4 !text-[14px]">
                            <span className="text-xl">💳</span> Upload Payment Verification
                        </Link>
                        <Link href="/upgrade" className="btn-ghost w-full !justify-start !pl-6 !gap-4 !text-[14px]">
                            <span className="text-xl">🛍️</span> Browse Upgrade Packages
                        </Link>
                    </motion.div>
                </div>

                {/* Referral Invite Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="glass mt-6 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.04), rgba(0,240,255,0.03))' }} />
                    <div className="flex-1 relative z-10">
                        <h3 className="text-lg font-semibold mb-1">🎁 Invite Friends, Get Credits!</h3>
                        <p className="text-white/35 text-sm font-light">
                            Share your referral link. Get <span className="text-[#00f0ff] font-medium">50 free credits</span> when they sign up.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            const link = `https://scraper.skillbridgeladder.in/login?ref=${user?.id?.slice(0, 8)}`
                            navigator.clipboard.writeText(link)
                            alert('Referral link copied!')
                        }}
                        className="btn-glow !py-3 !px-6 !text-[13px] relative z-10 whitespace-nowrap shrink-0">
                        📋 Copy Referral Link
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
