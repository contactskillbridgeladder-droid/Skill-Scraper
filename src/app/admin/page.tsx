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

interface DashStats {
    totalUsers: number
    totalPayments: number
    pendingPayments: number
    totalRevenue: number
}

// ADMIN EMAILS - strict access
const ADMIN_EMAILS = ['contact.skillbridgeladder@gmail.com', 'skillbridgeladder@gmail.com']

export default function AdminPage() {
    const [payments, setPayments] = useState<PaymentRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
    const [stats, setStats] = useState<DashStats>({ totalUsers: 0, totalPayments: 0, pendingPayments: 0, totalRevenue: 0 })
    const [previewImg, setPreviewImg] = useState<string | null>(null)
    const [manualEmail, setManualEmail] = useState('')
    const [manualCredits, setManualCredits] = useState('')
    const [manualMsg, setManualMsg] = useState('')
    const router = useRouter()

    useEffect(() => { checkAdmin() }, [])

    async function checkAdmin() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/login'); return }
        if (!ADMIN_EMAILS.includes(user.email || '')) { router.push('/dashboard'); return }
        setIsAdmin(true)
        fetchPayments()
        fetchStats()
    }

    async function fetchStats() {
        const { count: userCount } = await supabase.from('user_plans').select('*', { count: 'exact', head: true })
        const { data: allPayments } = await supabase.from('payment_requests').select('*')
        const pending = allPayments?.filter(p => p.status === 'pending').length || 0
        const revenue = allPayments?.filter(p => p.status === 'approved').reduce((sum, p) => sum + (p.amount || 0), 0) || 0
        setStats({
            totalUsers: userCount || 0,
            totalPayments: allPayments?.length || 0,
            pendingPayments: pending,
            totalRevenue: revenue
        })
    }

    async function fetchPayments() {
        let query = supabase.from('payment_requests').select('*').order('created_at', { ascending: false })
        if (filter !== 'all') query = query.eq('status', filter)
        const { data } = await query

        if (data) {
            const enriched = await Promise.all(data.map(async (p) => {
                try {
                    const { data: userData } = await supabase.auth.admin.getUserById(p.user_id)
                    return { ...p, user_email: (userData as any)?.user?.email || 'Unknown' }
                } catch {
                    return { ...p, user_email: 'Unknown' }
                }
            }))
            setPayments(enriched)
        }
        setLoading(false)
    }

    useEffect(() => { if (isAdmin) fetchPayments() }, [filter, isAdmin])

    async function handleApprove(payment: PaymentRequest) {
        if (!confirm(`Approve ₹${payment.amount} for ${payment.plan_requested} credits?`)) return
        await supabase.from('payment_requests').update({ status: 'approved' }).eq('id', payment.id)
        const plan = PLANS[payment.plan_requested]
        if (plan) {
            const { data: currentPlan } = await supabase.from('user_plans').select('*').eq('user_id', payment.user_id).single()
            const newQuota = (currentPlan?.quota || 200) + plan.quota
            await supabase.from('user_plans').upsert({ user_id: payment.user_id, plan: payment.plan_requested, quota: newQuota })
        }
        fetchPayments()
        fetchStats()
    }

    async function handleReject(paymentId: string) {
        if (!confirm('Reject this payment?')) return
        await supabase.from('payment_requests').update({ status: 'rejected' }).eq('id', paymentId)
        fetchPayments()
        fetchStats()
    }

    async function handleManualCredits() {
        if (!manualEmail || !manualCredits) return
        setManualMsg('')
        try {
            // Find the user by email using user_plans + auth lookup
            const { data: users } = await supabase.from('user_plans').select('*')
            // We need to find user by email - use a different approach
            const credits = parseInt(manualCredits)
            if (isNaN(credits) || credits <= 0) { setManualMsg('❌ Enter valid credit number'); return }

            // Use RPC or direct lookup - for now search payment_requests for user email
            const { data: allPayments } = await supabase.from('payment_requests').select('user_id').limit(1000)
            // Find user_id by checking auth
            // Simpler: just upsert by searching
            const res = await fetch(`/api/ext/admin-credits`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: manualEmail, credits })
            })
            if (res.ok) {
                setManualMsg(`✅ Added ${credits} credits to ${manualEmail}`)
                setManualEmail('')
                setManualCredits('')
                fetchStats()
            } else {
                const err = await res.json()
                setManualMsg(`❌ ${err.error || 'Failed'}`)
            }
        } catch (e: any) {
            setManualMsg(`❌ ${e.message}`)
        }
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
            {/* Image Preview Modal */}
            {previewImg && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6"
                    onClick={() => setPreviewImg(null)}>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl w-full max-h-[80vh] relative">
                        <img src={previewImg} alt="Payment Screenshot" className="w-full h-full object-contain rounded-xl" />
                        <button onClick={() => setPreviewImg(null)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-lg hover:bg-black/80">
                            ✕
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Admin Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
                style={{ background: 'rgba(3, 0, 20, 0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                <div className="container-main flex items-center justify-between" style={{ height: '72px' }}>
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-lg font-bold text-white">A</div>
                        <span className="text-lg font-bold tracking-tight" style={{ color: '#ff6b35' }}>Admin Panel</span>
                    </Link>
                    <Link href="/dashboard" className="btn-ghost !py-2.5 !px-5 !text-[13px]">← Dashboard</Link>
                </div>
            </nav>

            <div className="container-main" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#00f0ff' },
                        { label: 'Total Payments', value: stats.totalPayments, icon: '💳', color: '#7c3aed' },
                        { label: 'Pending', value: stats.pendingPayments, icon: '⏳', color: '#ffb400' },
                        { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: '#22c55e' },
                    ].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="glass !p-5">
                            <div className="text-xl mb-2">{s.icon}</div>
                            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                            <div className="text-[11px] uppercase tracking-[0.15em] text-white/25 font-semibold mt-1">{s.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Manual Credits */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass mb-8">
                    <h3 className="text-lg font-semibold mb-4">🎁 Manual Credit Grant</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input type="email" value={manualEmail} onChange={e => setManualEmail(e.target.value)}
                            placeholder="User email"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-all" />
                        <input type="number" value={manualCredits} onChange={e => setManualCredits(e.target.value)}
                            placeholder="Credits"
                            className="w-full sm:w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-all" />
                        <button onClick={handleManualCredits}
                            className="btn-glow !py-3 !px-6 !text-[14px] whitespace-nowrap">
                            Give Credits
                        </button>
                    </div>
                    {manualMsg && <p className="mt-3 text-sm">{manualMsg}</p>}
                </motion.div>

                {/* Payment Requests */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <h2 className="text-2xl font-bold mb-5">🔧 Payment Requests</h2>

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
                                    transition={{ delay: i * 0.04 }}
                                    className="glass !p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">

                                    {/* Screenshot thumbnail - clickable preview */}
                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 cursor-pointer border border-white/10 hover:border-[var(--accent)]/40 transition-all"
                                        onClick={() => p.screenshot_url && setPreviewImg(p.screenshot_url)}>
                                        {p.screenshot_url ? (
                                            <img src={p.screenshot_url} alt="Payment" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20">📷</div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold
                                                ${p.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400' :
                                                    p.status === 'approved' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                                                {p.status.toUpperCase()}
                                            </span>
                                            <span className="text-sm text-white/50 font-medium">{p.user_email}</span>
                                        </div>
                                        <div className="text-sm mb-1">
                                            <span className="text-white font-semibold">₹{p.amount}</span>
                                            <span className="text-white/20"> → </span>
                                            <span className="text-[#00f0ff] font-semibold">{p.plan_requested}</span>
                                            <span className="text-white/20"> ({PLANS[p.plan_requested]?.quota.toLocaleString()} credits)</span>
                                        </div>
                                        <div className="text-xs text-white/20 flex flex-wrap gap-x-3">
                                            <span>TXN: <span className="text-white/40">{p.transaction_id}</span></span>
                                            <span>{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        {/* Image link */}
                                        {p.screenshot_url && (
                                            <a href={p.screenshot_url} target="_blank" rel="noopener noreferrer"
                                                className="text-xs text-[#00f0ff]/60 hover:text-[#00f0ff] mt-1 inline-block transition-colors">
                                                🔗 Open full image
                                            </a>
                                        )}
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
