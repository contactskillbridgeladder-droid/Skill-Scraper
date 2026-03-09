'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function EnterprisePage() {
    return (
        <>
            <section className="w-full text-center" style={{ paddingTop: '160px', paddingBottom: '40px' }}>
                <div className="container-main">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }} className="font-black tracking-[-0.03em] mb-4">
                            Master Keys for <span className="text-grad-cyan">Enterprise</span>
                        </h1>
                        <p className="text-white/35 text-[16px] font-light max-w-[520px] mx-auto">
                            Unlock full, unrestricted access to Skill Scraper with a Master Key. Tailored for large teams and agencies.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="w-full" style={{ paddingBottom: '100px' }}>
                <div className="container-main" style={{ maxWidth: '820px' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-8 md:p-12 mb-8 relative overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(0,240,255,0.03))' }} />
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-4">What is an Enterprise Key?</h2>
                            <p className="text-white/40 leading-relaxed mb-6">
                                An Enterprise Master Key is an exclusive access code that grants a user account unrestricted scanning limits and premium features. These keys are manually issued and tracked by our administration team. Once activated on your dashboard, your plan will instantly be upgraded to 'Enterprise'.
                            </p>
                            <h3 className="text-xl font-semibold mb-3">Key Benefits</h3>
                            <ul className="space-y-3 text-white/40 mb-8">
                                <li className="flex items-center gap-3">✅ <span className="text-white/60">Bypass standard quota limits</span></li>
                                <li className="flex items-center gap-3">✅ <span className="text-white/60">Priority premium support</span></li>
                                <li className="flex items-center gap-3">✅ <span className="text-white/60">Unlimited map scans and data exports</span></li>
                                <li className="flex items-center gap-3">✅ <span className="text-white/60">Dedicated account management</span></li>
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-4 items-center bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm shadow-xl">
                                <div className="flex-1">
                                    <h4 className="font-bold text-white mb-1">Have a Master Key?</h4>
                                    <p className="text-sm font-light text-white/30">Head over to your dashboard to activate it.</p>
                                </div>
                                <Link href="/dashboard" className="btn-glow !py-3 !px-6 !text-[14px]">Go to Dashboard</Link>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
                        <p className="text-white/40 mb-4">Interested in purchasing an Enterprise Key for your agency?</p>
                        <Link href="/help" className="text-[#00f0ff] hover:text-white transition-colors py-2 px-6 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 inline-block font-medium">Contact Sales Team</Link>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
