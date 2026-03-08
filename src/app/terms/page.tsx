'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function TermsPage() {
    return (
        <div className="relative min-h-screen">
            <div className="bg-dots" />

            <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-white">S</div>
                    <span className="text-xl font-bold gradient-text">Skill Scraper</span>
                </Link>
                <Link href="/" className="btn btn-outline text-sm py-2 px-4">← Back to Home</Link>
            </nav>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10">
                    <h1 className="text-4xl font-black mb-8 gradient-text">Terms & Conditions</h1>

                    <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
                            <p>By using Skill Scraper, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our service.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
                            <p>Skill Scraper is a lead generation tool that allows users to extract business information from Google Maps. We provide both a browser extension and an online dashboard.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">3. User Responsibilities</h2>
                            <p>Users are responsible for how they use the data extracted. You must comply with all local and international laws regarding data privacy, spam, and telemarketing.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">4. Intellectual Property</h2>
                            <p>The Skill Scraper software, including code, design, and logos, is the exclusive property of SkillBridge Ladder. Unauthorized copying, reverse engineering, or redistribution is strictly prohibited and protected by law.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">5. Credit System & Payments</h2>
                            <p>Payments for credit packs are final. Credits are added to your account after manual verification of your payment screenshot. We reserve the right to refuse service to anyone suspected of fraudulent activity.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">6. Limitation of Liability</h2>
                            <p>Skill Scraper is provided "as is". We are not responsible for any data loss, account suspension by third-party platforms (like Google), or business damages resulting from the use of our tool.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3">7. Contact</h2>
                            <p>For legal inquiries, contact us at contact.skillbridgeladder@gmail.com</p>
                        </section>
                    </div>
                </motion.div>
            </div>

            <footer className="relative z-10 py-8 text-center text-sm text-gray-500">
                <p>© 2026 Skill Scraper. Last updated: March 2026</p>
            </footer>
        </div>
    )
}
