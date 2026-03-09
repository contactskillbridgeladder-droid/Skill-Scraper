'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ReferralsPage() {
    return (
        <>
            <section className="w-full text-center" style={{ paddingTop: '160px', paddingBottom: '40px' }}>
                <div className="container-main">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }} className="font-black tracking-[-0.03em] mb-4">
                            Refer Friends, Earn <span className="text-grad-cyan">Skillcoins</span>
                        </h1>
                        <p className="text-white/35 text-[16px] font-light max-w-[520px] mx-auto">
                            Share Skill Scraper with your network and earn free API quotas for every successful signup.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="w-full" style={{ paddingBottom: '100px' }}>
                <div className="container-main" style={{ maxWidth: '820px' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { step: '1', title: 'Get Your Link', desc: 'Copy your unique referral link from the dashboard.' },
                            { step: '2', title: 'Share with Friends', desc: 'Send it to your network or share it on WhatsApp.' },
                            { step: '3', title: 'Earn Skillcoins', desc: 'Get 50 free Skillcoins when they register an account!' }
                        ].map((s, i) => (
                            <div key={i} className="glass p-6 text-center hover:bg-white-[0.03] transition-colors">
                                <div className="w-12 h-12 mx-auto rounded-full bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center font-bold text-xl border border-[#00f0ff]/20 mb-4 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                                    {s.step}
                                </div>
                                <h3 className="font-semibold text-white/90 mb-2">{s.title}</h3>
                                <p className="text-sm font-light text-white/35">{s.desc}</p>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(124,58,237,0.04), rgba(0,240,255,0.05))' }} />
                        <div className="relative z-10 w-full flex flex-col items-center">
                            <h2 className="text-2xl font-bold mb-4">Ready to start earning?</h2>
                            <p className="text-white/40 leading-relaxed mb-8 max-w-[500px] mx-auto text-sm">
                                Your unique referral link is automatically generated and waiting for you in your user dashboard. Note: Referrals must be verified by an admin before the Skillcoins are disbursed to prevent abuse.
                            </p>

                            <Link href="/dashboard" className="btn-glow inline-flex !py-4 !px-8 !text-[15px] shadow-[0_0_30px_rgba(0,240,255,0.15)]">
                                Get My Referral Link
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
