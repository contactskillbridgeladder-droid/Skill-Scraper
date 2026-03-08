'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        // In a real implementation this would send to an API endpoint
        // For now, we simulate a successful submission
        setTimeout(() => setStatus('success'), 1500);
    }

    return (
        <>
            <section className="w-full" style={{ paddingTop: '160px', paddingBottom: '60px' }}>
                <div className="container-main text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }} className="font-black tracking-[-0.03em] mb-4">
                            Contact <span className="text-grad-cyan">Support</span>
                        </h1>
                        <p className="text-white/35 text-[16px] font-light max-w-[460px] mx-auto">
                            Need help, have a feature request, or found a bug? Send us a message below.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="w-full" style={{ paddingBottom: '120px' }}>
                <div className="container-main" style={{ maxWidth: '600px' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass p-8 sm:p-10 relative overflow-hidden">

                        {status === 'success' ? (
                            <div className="text-center py-10">
                                <div className="text-5xl mb-4">✅</div>
                                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                                <p className="text-white/50 mb-6">We'll get back to you as soon as possible.</p>
                                <button onClick={() => setStatus('idle')} className="btn-glow !py-3 px-8 text-sm">
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-white/70 font-medium px-1">Name</label>
                                        <input required type="text" placeholder="John Doe"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-white/70 font-medium px-1">Email</label>
                                        <input required type="email" placeholder="john@company.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-white/70 font-medium px-1">Category</label>
                                    <select required className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer appearance-none">
                                        <option value="support">Technical Support</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="bug">Report a Bug</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-white/70 font-medium px-1">Message</label>
                                    <textarea required rows={5} placeholder="How can we help you?"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all resize-none"></textarea>
                                </div>

                                <button type="submit" disabled={status === 'loading'}
                                    className="btn-glow !py-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>
        </>
    )
}
