'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ReferralsPage() {
    const [referralLink, setReferralLink] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [stats, setStats] = useState({ total: 0, verified: 0, coins: 0 })

    useEffect(() => {
        loadReferralData()
    }, [])

    async function loadReferralData() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: plan } = await supabase
            .from('user_plans')
            .select('referral_code')
            .eq('user_id', user.id)
            .single()

        const code = plan?.referral_code || user.id.slice(0, 8).toUpperCase()
        setReferralLink(`https://scraper.skillbridgeladder.in/login?ref=${code}`)

        const { data: refs } = await supabase
            .from('referrals')
            .select('status')
            .eq('referrer_id', user.id)

        if (refs) {
            const verified = refs.filter(r => r.status === 'verified').length
            setStats({ total: refs.length, verified, coins: verified * 50 })
        }
    }

    function handleCopy() {
        if (!referralLink) return
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    function handleWhatsApp() {
        if (!referralLink) return
        const msg = encodeURIComponent(`🚀 Try Skill Scraper - the best B2B lead scraping tool!\n\nSign up free with my link and get started: ${referralLink}`)
        window.open(`https://wa.me/?text=${msg}`, '_blank')
    }

    return (
        <>
            <section className="w-full text-center" style={{ paddingTop: '160px', paddingBottom: '40px' }}>
                <div className="container-main">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }} className="font-black tracking-[-0.03em] mb-4">
                            Refer Friends, Earn <span className="text-grad-cyan">Skillcoins</span>
                        </h1>
                        <p className="text-white/35 text-[16px] font-light max-w-[520px] mx-auto">
                            Share Skill Scraper with your network and earn 50 free credits for every successful signup.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="w-full" style={{ paddingBottom: '100px' }}>
                <div className="container-main" style={{ maxWidth: '820px' }}>

                    {/* Stats Row */}
                    {referralLink && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="grid grid-cols-3 gap-4 mb-8">
                            {[
                                { label: 'Total Referrals', value: stats.total, color: '#00f0ff' },
                                { label: 'Verified', value: stats.verified, color: '#22c55e' },
                                { label: 'Credits Earned', value: stats.coins, color: '#a78bfa' },
                            ].map((s, i) => (
                                <div key={i} className="glass text-center p-5">
                                    <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
                                    <div className="text-xs text-white/35 font-light">{s.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* Steps */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {[
                            { step: '1', title: 'Copy Your Link', desc: 'Get your unique referral link below and share it.' },
                            { step: '2', title: 'Friend Signs Up', desc: 'They register using your link — tracked automatically.' },
                            { step: '3', title: 'Earn 50 Credits', desc: 'Admin verifies and 50 free credits are added to your account!' }
                        ].map((s, i) => (
                            <div key={i} className="glass p-6 text-center">
                                <div className="w-12 h-12 mx-auto rounded-full bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center font-bold text-xl border border-[#00f0ff]/20 mb-4 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                                    {s.step}
                                </div>
                                <h3 className="font-semibold text-white/90 mb-2">{s.title}</h3>
                                <p className="text-sm font-light text-white/35">{s.desc}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Referral Link Box */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="glass p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(124,58,237,0.04), rgba(0,240,255,0.05))' }} />
                        <div className="relative z-10 w-full flex flex-col items-center">
                            <h2 className="text-2xl font-bold mb-2">Your Referral Link</h2>
                            <p className="text-white/40 text-sm mb-7 text-center max-w-[460px]">
                                Share this link. When someone signs up using it, you earn 50 credits after admin verification.
                            </p>

                            {referralLink ? (
                                <>
                                    {/* Link Display */}
                                    <div className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 flex items-center gap-3 mb-5 max-w-xl">
                                        <span className="text-[#00f0ff] text-sm font-mono truncate flex-1">{referralLink}</span>
                                        <button onClick={handleCopy}
                                            className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all"
                                            style={copied
                                                ? { background: 'rgba(34,197,94,0.15)', borderColor: '#22c55e', color: '#22c55e' }
                                                : { background: 'rgba(0,240,255,0.1)', borderColor: 'rgba(0,240,255,0.3)', color: '#00f0ff' }
                                            }>
                                            {copied ? '✓ Copied!' : '📋 Copy'}
                                        </button>
                                    </div>

                                    {/* Share Buttons */}
                                    <div className="flex gap-3 flex-wrap justify-center">
                                        <button onClick={handleCopy}
                                            className="btn-glow !py-3 !px-7 !text-[14px]">
                                            📋 Copy Link
                                        </button>
                                        <button onClick={handleWhatsApp}
                                            className="btn-ghost !py-3 !px-7 !text-[14px]"
                                            style={{ borderColor: 'rgba(34,197,94,0.4)', color: '#22c55e' }}>
                                            💬 Share on WhatsApp
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <p className="text-white/40 text-sm">Login to get your unique referral link</p>
                                    <Link href="/login" className="btn-glow !py-3 !px-8 !text-[14px]">
                                        Login to Get Link
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>

                </div>
            </section>
        </>
    )
}
