'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, PLANS, PlanKey } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UpgradePage() {
    const [user, setUser] = useState<{ email?: string; id?: string } | null>(null)
    const [currentPlan, setCurrentPlan] = useState<PlanKey>('free')
    const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    async function checkAuth() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/login'); return }
        setUser(user)
        const { data } = await supabase.from('user_plans').select('plan').eq('user_id', user.id).single()
        if (data) setCurrentPlan(data.plan as PlanKey)
    }

    const UPI_ID = 'YOUR_UPI_ID@upi' // Replace with your UPI ID

    return (
        <div className="relative min-h-screen">
            <div className="bg-dots" />

            <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-white">S</div>
                    <span className="text-xl font-bold gradient-text">Skill Scraper</span>
                </Link>
                <Link href="/dashboard" className="btn btn-outline text-sm py-2 px-4">← Dashboard</Link>
            </nav>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold mb-2 gradient-text">Buy Credits</h1>
                    <p className="text-gray-400 mb-10">Purchase export credits to download your scraped leads. Credits never expire.</p>
                </motion.div>

                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {Object.entries(PLANS).map(([key, plan], i) => {
                        const planKey = key as PlanKey
                        const isCurrent = planKey === currentPlan
                        const isEnterprise = planKey === 'enterprise'

                        return (
                            <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                className={`glass-card p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1
                  ${selectedPlan === planKey ? 'border-cyan-400/50 glow-cyan' : ''}
                  ${planKey === 'pro' ? 'border-purple-500/40' : ''}
                  ${isCurrent ? 'border-green-500/30' : ''}`}
                                onClick={() => !isEnterprise && !isCurrent && setSelectedPlan(planKey)}>

                                {planKey === 'pro' && (
                                    <div className="text-xs font-bold text-purple-400 bg-purple-500/15 px-2 py-1 rounded-full inline-block mb-3">BEST VALUE</div>
                                )}
                                {isCurrent && (
                                    <div className="text-xs font-bold text-green-400 bg-green-500/15 px-2 py-1 rounded-full inline-block mb-3">CURRENT</div>
                                )}

                                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                                <div className="text-3xl font-black mb-1">
                                    {isEnterprise ? 'Custom' : plan.price === 0 ? 'Free' : `₹${plan.price}`}
                                </div>
                                <p className="text-xs text-gray-500 mb-4">{isEnterprise ? 'Contact for pricing' : plan.quota.toLocaleString() + ' credits'}</p>

                                <ul className="space-y-2 mb-4">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="text-xs text-gray-400 flex items-start gap-2">
                                            <span className="text-green-400">✓</span> {f}
                                        </li>
                                    ))}
                                </ul>

                                {isEnterprise ? (
                                    <a href="mailto:contact@skillbridgeladder.in" className="btn btn-outline w-full text-sm py-2">
                                        📧 Contact Us
                                    </a>
                                ) : isCurrent ? (
                                    <div className="btn w-full text-sm py-2 bg-green-500/10 text-green-400 border border-green-500/20 cursor-default">
                                        ✓ Active
                                    </div>
                                ) : (
                                    <button onClick={() => setSelectedPlan(planKey)}
                                        className={`btn w-full text-sm py-2 ${selectedPlan === planKey ? 'btn-primary' : 'btn-outline'}`}>
                                        {plan.price === 0 ? 'Current Plan' : 'Select'}
                                    </button>
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                {/* Payment Section - shows when plan selected */}
                {selectedPlan && PLANS[selectedPlan].price > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 max-w-lg mx-auto glow-blue">
                        <h2 className="text-xl font-bold mb-2 text-center">💳 Complete Payment</h2>
                        <p className="text-center text-gray-400 text-sm mb-6">
                            Pay <span className="text-cyan-400 font-bold text-lg">₹{PLANS[selectedPlan].price}</span> for
                            <span className="text-white font-semibold"> {PLANS[selectedPlan].quota.toLocaleString()} credits</span>
                        </p>

                        {/* UPI QR Code Section */}
                        <div className="text-center mb-6">
                            <div className="w-64 h-64 mx-auto bg-white rounded-2xl p-3 mb-4 flex items-center justify-center">
                                <img
                                    src="/skillscraper.jpeg"
                                    alt="Skill Scraper UPI QR"
                                    className="w-full h-full object-contain rounded-xl"
                                />
                            </div>
                            <p className="text-sm text-gray-400 mb-1">Scan to Pay via UPI</p>
                            <p className="text-xs text-gray-500">Scan this QR with any UPI app to pay</p>
                        </div>

                        {/* UPI ID */}
                        <div className="bg-black/30 rounded-xl p-4 mb-6 text-center">
                            <p className="text-xs text-gray-500 mb-1">Or pay directly to UPI ID</p>
                            <p className="text-lg font-mono text-cyan-400 font-bold">{UPI_ID}</p>
                        </div>

                        {/* Next Step */}
                        <div className="text-center">
                            <p className="text-sm text-gray-400 mb-4">After payment, upload your screenshot:</p>
                            <Link href={`/upload-payment?plan=${selectedPlan}`} className="btn btn-accent w-full">
                                📸 Upload Payment Screenshot
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
