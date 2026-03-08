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
        <div className="w-full relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-[#030014]/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/logo.png" alt="Skill Scraper Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-transform hover:scale-105" />
                        <span className="text-2xl font-bold tracking-tight text-white hidden sm:block">Skill Scraper</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-medium text-gray-400 hidden sm:block">{user?.email}</span>
                        <button onClick={handleLogout} className="btn btn-secondary text-sm py-2 px-6">Logout</button>
                    </div>
                </div>
            </nav>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Welcome Back, <span className="text-gradient">Scraper</span></h1>
                <p className="text-gray-400 font-light">Here is an overview of your current usage and plan details.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">

                {/* Usage Card (Spans 8 columns) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="md:col-span-8 glass-panel p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f0ff] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 border-none"></div>
                    <div className="text-sm uppercase tracking-widest font-bold text-gray-500 mb-6">Quota Usage</div>

                    <div className="flex items-end gap-3 mb-6">
                        <span className="text-6xl font-black tracking-tighter text-white/90">{plan?.used || 0}</span>
                        <span className="text-xl font-medium text-gray-500 mb-2">/ {plan?.plan === 'enterprise' ? '∞' : plan?.quota} Leads</span>
                    </div>

                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-4 shadow-inner">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${usedPercent}%` }} transition={{ delay: 0.4, duration: 1 }}
                            className={`h-full rounded-full relative ${usedPercent > 90 ? 'bg-[#ff0055]' : usedPercent > 70 ? 'bg-[#ffb400]' : 'bg-[#00f0ff]'}`}>
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </motion.div>
                    </div>

                    <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                        <span>{usedPercent.toFixed(1)}% Used</span>
                        <span>{plan?.plan === 'enterprise' ? 'Unlimited' : remaining} Exports Remaining</span>
                    </div>
                </motion.div>

                {/* Plan Card (Spans 4 columns) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="md:col-span-4 glass-panel p-8 flex flex-col justify-between">
                    <div>
                        <div className="text-sm uppercase tracking-widest font-bold text-gray-500 mb-6">Active Plan</div>
                        <div className="text-3xl font-bold text-gradient mb-2">{currentPlan.name}</div>
                        <div className="text-sm font-light text-gray-400 leading-relaxed mb-6">{currentPlan.label}</div>
                    </div>

                    {plan?.plan !== 'enterprise' && (
                        <Link href="/upgrade" className="btn btn-primary w-full text-center">
                            Upgrade Plan 🚀
                        </Link>
                    )}
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Installation Guide */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass-panel p-8">
                    <h3 className="text-xl font-semibold mb-6 tracking-tight">Installation Guide</h3>
                    <ul className="space-y-6">
                        {[
                            { step: '1', title: 'Download Bundle', desc: 'Get the latest verison locally.' },
                            { step: '2', title: 'Developer Mode', desc: 'Visit chrome://extensions and enable it.' },
                            { step: '3', title: 'Load Unpacked', desc: 'Select the unzipped folder.' }
                        ].map((s, i) => (
                            <li key={i} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center font-bold text-sm border border-[#00f0ff]/20 shrink-0">
                                    {s.step}
                                </div>
                                <div>
                                    <div className="font-semibold text-white/90 mb-1">{s.title}</div>
                                    <div className="text-sm font-light text-gray-400">{s.desc}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Quick Links */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="glass-panel p-8 flex flex-col justify-center gap-4">
                    <h3 className="text-xl font-semibold mb-2 tracking-tight">Quick Actions</h3>

                    <a href="/skill-scraper.zip" download className="btn btn-primary w-full justify-start pl-6 gap-4 text-base shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                        <span className="text-xl">⬇️</span> Download Extension Bundle
                    </a>
                    <Link href="/upload-payment" className="btn btn-secondary w-full justify-start pl-6 gap-4 text-base">
                        <span className="text-xl">💳</span> Upload Payment Verification
                    </Link>
                    <Link href="/upgrade" className="btn btn-secondary w-full justify-start pl-6 gap-4 text-base">
                        <span className="text-xl">🛍️</span> Browse Upgrade Packages
                    </Link>

                </motion.div>
            </div>
        </div>
    )
}

