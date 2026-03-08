'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* ━━━ HERO ━━━ */}
      <section className="w-full" style={{ paddingTop: '160px', paddingBottom: '64px' }}>
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="flex flex-col items-center text-center"
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 rounded-full text-[13px] font-semibold"
              style={{
                border: '1px solid rgba(0,240,255,0.18)',
                background: 'rgba(0,240,255,0.05)',
                color: 'var(--accent)',
                animation: 'float-slow 5s ease-in-out infinite',
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
              V2.0 is Live — Scrape Unlimited Leads
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4.8rem)' }} className="font-black tracking-[-0.04em] leading-[1.08] mb-6">
              Unleash the Power of<br />
              <span className="text-grad">Google Maps Data</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/40 max-w-[580px] mb-10 font-light leading-relaxed" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)' }}>
              Extract phone numbers, WhatsApp, emails, and social media directly from Google Maps into Excel — in seconds.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link href="/download" className="btn-glow w-full sm:w-auto text-center">
                Download Extension
              </Link>
              <Link href="/pricing" className="btn-ghost w-full sm:w-auto text-center">
                View Pricing
              </Link>
            </div>
          </motion.div>


        </div>
      </section>

      {/* ━━━ FEATURES ━━━ */}
      <section className="w-full" style={{ paddingTop: '80px', paddingBottom: '100px' }}>
        <div className="container-main">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything You Need is <span className="text-grad-cyan">Built-in</span>
            </motion.h2>
            <p className="text-white/35 text-[16px] font-light max-w-[480px] mx-auto">
              We handle the complex scraping so you can focus on closing deals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🎯', title: 'Precision Targeting', desc: 'Pinpoint leads by country, state, and city.' },
              { icon: '💬', title: 'WhatsApp Discovery', desc: 'Extract WhatsApp numbers from profiles.' },
              { icon: '✉️', title: 'Deep Email Search', desc: 'Crawl websites for hidden emails & socials.' },
              { icon: '📊', title: 'Instant Export', desc: 'Download leads to CSV or Excel instantly.' },
              { icon: '⚡', title: 'Serverless Speed', desc: 'Runs in your browser. No proxies needed.' },
              { icon: '🎁', title: 'Free Tier', desc: 'Start scraping with our generous free tier.' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }} viewport={{ once: true }}
                className="glass p-7 text-center transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 mx-auto"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {f.icon}
                </div>
                <h3 className="text-[18px] font-semibold mb-2">{f.title}</h3>
                <p className="text-white/35 text-[14px] font-light leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SOCIAL PROOF STATS ━━━ */}
      <section className="w-full" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="container-main">
          <div className="glass p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-around gap-8 text-center">
            {[
              { num: '10,000+', label: 'Leads Scraped' },
              { num: '500+', label: 'Active Users' },
              { num: '50+', label: 'Countries' },
              { num: '4.8★', label: 'User Rating' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
                <div className="text-2xl sm:text-3xl font-black text-grad-cyan mb-1">{s.num}</div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-white/25 font-semibold">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section className="w-full" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="container-main">
          <div className="text-center mb-12">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Trusted by <span className="text-grad">Professionals</span>
            </motion.h2>
            <p className="text-white/35 text-[16px] font-light max-w-[480px] mx-auto">
              See what our users are saying about Skill Scraper.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Rahul S.', role: 'Real Estate Agent', text: 'Skill Scraper saved me hours of manual work. I can now find leads from any city in India within minutes!', avatar: '🏠' },
              { name: 'Priya M.', role: 'Marketing Agency', text: 'The WhatsApp number extraction is a game-changer. Our outreach campaigns are 3x more effective now.', avatar: '📈' },
              { name: 'Amit K.', role: 'Sales Consultant', text: 'Best investment I\'ve made. The free tier alone gives enough credits to close deals every month.', avatar: '🎯' },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}
                className="glass p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-[11px] text-white/30">{t.role}</div>
                  </div>
                </div>
                <p className="text-white/40 text-[14px] font-light leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex gap-0.5 mt-4">
                  {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-yellow-400 text-sm">★</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CTA BANNER ━━━ */}
      <section className="w-full" style={{ paddingTop: '40px', paddingBottom: '100px' }}>
        <div className="container-main">
          <div className="glass p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,240,255,0.03), transparent)' }} />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative z-10">Ready to grow your business?</h2>
            <p className="text-white/35 font-light mb-8 max-w-[460px] mx-auto relative z-10">
              Join thousands of professionals using Skill Scraper.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/download" className="btn-glow w-full sm:w-auto text-center">Get Started Free</Link>
              <Link href="/pricing" className="btn-ghost w-full sm:w-auto text-center">See Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
