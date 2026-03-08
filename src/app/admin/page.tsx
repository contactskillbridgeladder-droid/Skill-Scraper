'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, PLANS, PlanKey } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PaymentRequest {
    id: string
    user_id: string
    plan_requested: PlanKey
    amount: number
    transaction_id: string
    screenshot_url: string
    status: string
    created_at: string
    user_email?: string
}

// ADMIN EMAILS
const ADMIN_EMAILS = ['contact.skillbridgeladder@gmail.com', 'skillbridgeladder@gmail.com']

export default function AdminPage() {
    const [payments, setPayments] = useState<PaymentRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
    const router = useRouter()

    useEffect(() => {
        checkAdmin()
    }, [])

    async function checkAdmin() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/login'); return }

        if (!ADMIN_EMAILS.includes(user.email || '')) {
            router.push('/dashboard')
            return
        }

        setIsAdmin(true)
        fetchPayments()
    }

    async function fetchPayments() {
        const query = supabase.from('payment_requests').select('*').order('created_at', { ascending: false })

        if (filter !== 'all') {
            query.eq('status', filter)
        }

        const { data } = await query

        if (data) {
            const enriched = await Promise.all(data.map(async (p) => {
                const { data: userData } = await supabase.auth.admin.getUserById(p.user_id).catch(() => ({ data: null }))
                return { ...p, user_email: (userData as any)?.user?.email || 'Unknown' }
            }))
            setPayments(enriched)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (isAdmin) fetchPayments()
    }, [filter, isAdmin])

    async function handleApprove(payment: PaymentRequest) {
        if (!confirm(`Approve ₹${payment.amount} for ${payment.plan_requested} credits?`)) return

        await supabase.from('payment_requests').update({ status: 'approved' }).eq('id', payment.id)

        const plan = PLANS[payment.plan_requested]
        if (plan) {
            const { data: currentPlan } = await supabase
                .from('user_plans')
                .select('*')
                .eq('user_id', payment.user_id)
                .single()

            const currentQuota = currentPlan?.quota || 200
            const newQuota = currentQuota + plan.quota

            await supabase.from('user_plans').upsert({
                user_id: payment.user_id,
                plan: payment.plan_requested,
                quota: newQuota,
            })
        }

        fetchPayments()
    }

    async function handleReject(paymentId: string) {
        if (!confirm('Reject this payment?')) return
        await supabase.from('payment_requests').update({ status: 'rejected' }).eq('id', paymentId)
        fetchPayments()
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#00f0ff] animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="w-full relative z-10">
            {/* Admin Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
                style={{ background: 'rgba(3, 0, 20, 0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                <div className="container-main flex items-center justify-between" style={{ height: '72px' }}>
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-lg font-bold text-white">A</div>
                        <span className="text-lg font-bold tracking-tight" style={{ color: '#ff6b35' }}>Admin Panel</span>
                    </Link>
                    <Link href="/dashboard" className="btn-ghost !py-2.5 !px-5 !text-[13px]">
                        ← Dashboard
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <div className="container-main" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }} className="font-black tracking-[-0.03em] mb-8">
                        🔧 Payment Requests
                    </h1>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all capitalize
                                    ${filter === f
                                        ? 'bg-gradient-to-r from-[var(--accent2)] to-[var(--accent)] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                                        : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20 hover:text-white/60'}`}>
                                {f === 'pending' ? `⏳ ${f}` : f === 'approved' ? `✅ ${f}` : f === 'rejected' ? `❌ ${f}` : `📋 ${f}`}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#00f0ff] animate-spin"></div>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="glass text-center py-12">
                            <div className="text-4xl mb-3">📭</div>
                            <p className="text-white/35 font-light">No {filter === 'all' ? '' : filter} payment requests</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {payments.map((p, i) => (
                                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass !p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">

                                    {/* Screenshot thumbnail */}
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                        {p.screenshot_url ? (
                                            <a href={p.screenshot_url} target="_blank" rel="noopener noreferrer">
                                                <img src={p.screenshot_url} alt="Payment" className="w-full h-full object-cover" />
                                            </a>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20">📷</div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                                                ${p.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400' :
                                                    p.status === 'approved' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                                                {p.status.toUpperCase()}
                                            </span>
                                            <span className="text-sm text-white/40">{p.user_email}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-white font-semibold">₹{p.amount}</span>
                                            <span className="text-white/20"> → </span>
                                            <span className="text-[#00f0ff] font-semibold">{p.plan_requested}</span>
                                            <span className="text-white/20"> ({PLANS[p.plan_requested]?.quota.toLocaleString()} credits)</span>
                                        </div>
                                        <div className="text-xs text-white/20 mt-1">
                                            TXN: {p.transaction_id} · {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {p.status === 'pending' && (
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button onClick={() => handleApprove(p)}
                                                className="text-sm py-2 px-4 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all font-medium">
                                                ✅ Approve
                                            </button>
                                            <button onClick={() => handleReject(p.id)}
                                                className="text-sm py-2 px-4 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all font-medium">
                                                ❌ Reject
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
