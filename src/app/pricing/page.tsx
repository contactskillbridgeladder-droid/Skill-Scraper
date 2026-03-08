'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PLANS } from '@/lib/supabase'

export default function PricingPage() {
    return (
        <>
            {/* Header */}
            <section className="w-full" style={{ paddingTop: '160px', paddingBottom: '40px' }}>
                <div className="container-main text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }} className="font-black tracking-[-0.03em] mb-4">
                            Simple, Transparent <span className="text-grad">Pricing</span>
                        </h1>
                        <p className="text-white/35 text-[16px] font-light max-w-[500px] mx-auto">
                            Credits map directly to exported lists. No hidden fees.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Cards */}
            <section className="w-full" style={{ paddingBottom: '80px' }}>
                <div className="container-main">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {Object.entries(PLANS).map(([key, plan], i) => (
                            <motion.div key={key} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                                className={`glass p-7 flex flex-col text-center relative ${key === 'pro' ? 'lg:-translate-y-3' : ''}`}
                                style={key === 'pro' ? { borderColor: 'rgba(124,58,237,0.4)', boxShadow: '0 0 40px rgba(124,58,237,0.1)' } : {}}>

                                {key === 'pro' && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-[11px] font-bold text-white tracking-widest uppercase whitespace-nowrap"
                                        style={{ background: 'linear-gradient(135deg, var(--accent2), var(--accent))' }}>
                                        Most Popular
                                    </div>
                                )}

                                <h3 className="text-xl font-medium mb-3 text-white/80">{plan.name}</h3>
                                <div className="mb-2">
                                    <span style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }} className="font-black tracking-tight">
                                        {key === 'enterprise' ? 'Custom' : plan.price === 0 ? 'Free' : `₹${plan.price}`}
                                    </span>
                                </div>
                                <p className="text-[11px] font-medium text-white/25 mb-6 pb-6 uppercase tracking-[0.15em]"
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {key === 'enterprise' ? 'Contact Us' : 'Credit Pack'}
                                </p>

                                <ul className="space-y-3 mb-8 flex-grow text-left">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="text-[13px] text-white/50 flex items-start gap-2.5">
                                            <span className="shrink-0 mt-0.5 text-[12px]" style={{ color: 'var(--accent)' }}>✓</span>
                                            <span className="font-light">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto">
                                    <Link href={key === 'enterprise' ? 'mailto:contact.skillbridgeladder@gmail.com' : '/login'}
                                        className={`w-full text-center block ${key === 'pro' ? 'btn-glow' : 'btn-ghost'}`}>
                                        {key === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* How Credits Work */}
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        className="glass mt-16 p-8 sm:p-12 max-w-[680px] mx-auto text-center">
                        <h3 className="text-2xl font-bold mb-4">How Credits Work</h3>
                        <p className="text-white/35 font-light leading-relaxed mb-4 text-[15px]">
                            Scraping is <strong className="text-white/75">completely free and unlimited</strong>. Credits are only used when exporting.
                        </p>
                        <p className="text-white/35 font-light leading-relaxed text-[15px]">
                            Free users get <strong className="text-white/75">200 credits per month</strong>, auto-refreshed.
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
