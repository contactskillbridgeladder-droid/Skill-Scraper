'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const faqs = [
    { q: "How do I install the extension?", a: "Download the ZIP bundle from your dashboard, extract it, go to chrome://extensions, enable Developer Mode, and click 'Load unpacked'." },
    { q: "How do credits work?", a: "Each 'export' counts as credits used based on the number of leads. 1 lead = 1 credit. Free users get 200 credits monthly." },
    { q: "Is my data secure?", a: "Yes. Skill Scraper only stores your account information and credit balance. We do not store the leads you scrape; they are downloaded directly to your computer." },
    { q: "How long does it take to get my credits?", a: "After you upload your payment screenshot, our admin team verifies it manually. This usually takes 1-24 hours." },
    { q: "Can I use it on multiple computers?", a: "Yes, you can log in with your email on any computer that has the Skill Scraper extension installed." },
]

export default function HelpPage() {
    return (
        <>
            <section className="w-full" style={{ paddingTop: '160px', paddingBottom: '40px' }}>
                <div className="container-main text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }} className="font-black tracking-[-0.03em] mb-4">
                            Help <span className="text-grad-cyan">Center</span>
                        </h1>
                        <p className="text-white/35 text-[16px] font-light max-w-[480px] mx-auto">
                            Need help? Find answers to common questions here or contact support.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="w-full" style={{ paddingBottom: '80px' }}>
                <div className="container-main" style={{ maxWidth: '800px' }}>
                    <div className="grid gap-5">
                        {faqs.map((faq, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                className="glass">
                                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                                <p className="text-white/40 text-sm leading-relaxed font-light">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                        className="glass mt-12 text-center !border-[var(--border-accent)] shadow-[0_0_30px_rgba(0,240,255,0.06)]">
                        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                        <p className="text-white/35 font-light mb-6">Our support team is always here to help you.</p>
                        <Link href="/contact" className="btn-glow !px-10">
                            📧 Contact Support
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
