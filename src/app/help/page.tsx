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
        <div className="relative min-h-screen">
            <div className="bg-dots" />

            <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-white">S</div>
                    <span className="text-xl font-bold gradient-text">Skill Scraper</span>
                </Link>
                <Link href="/dashboard" className="btn btn-outline text-sm py-2 px-4">← Dashboard</Link>
            </nav>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black mb-4 gradient-text text-center">Help Center</motion.h1>
                <p className="text-center text-gray-400 mb-12">Need help? Find answers to common questions here or contact support.</p>

                <div className="grid gap-6">
                    {faqs.map((faq, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 border-white/5 hover:border-cyan-500/20 transition">
                            <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="mt-16 glass-card p-10 text-center glow-blue">
                    <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                    <p className="text-gray-400 mb-8">Our support team is always here to help you scaling your business.</p>
                    <a href="mailto:contact.skillbridgeladder@gmail.com" className="btn btn-primary px-10 py-4">
                        📧 Email Support
                    </a>
                </motion.div>
            </div>
        </div>
    )
}
