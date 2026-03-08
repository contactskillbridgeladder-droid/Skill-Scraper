'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, PLANS, PlanKey } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function UploadPaymentContent() {
    const [user, setUser] = useState<{ id?: string; email?: string } | null>(null)
    const [transactionId, setTransactionId] = useState('')
    const [screenshot, setScreenshot] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const planRequested = (searchParams.get('plan') as PlanKey) || 'starter'

    useEffect(() => {
        checkAuth()
    }, [])

    async function checkAuth() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/login'); return }
        setUser(user)
    }

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault()
        if (!screenshot || !transactionId || !user) return
        setUploading(true)
        setError('')

        try {
            // Upload screenshot to Supabase Storage
            const fileExt = screenshot.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('payment-screenshots')
                .upload(fileName, screenshot)

            if (uploadError) throw uploadError

            const { data: urlData } = supabase.storage
                .from('payment-screenshots')
                .getPublicUrl(fileName)

            // Create payment request
            const { error: insertError } = await supabase.from('payment_requests').insert({
                user_id: user.id,
                plan_requested: planRequested,
                amount: PLANS[planRequested]?.price || 0,
                transaction_id: transactionId,
                screenshot_url: urlData.publicUrl,
                status: 'pending'
            })

            if (insertError) throw insertError
            setSuccess(true)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Upload failed')
        } finally {
            setUploading(false)
        }
    }

    if (success) {
        return (
            <div className="relative min-h-screen flex items-center justify-center p-6">
                <div className="bg-dots" />
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-10 max-w-md text-center relative z-10">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold mb-3">Payment Submitted!</h2>
                    <p className="text-gray-400 mb-6">
                        We&apos;ll verify your payment and upgrade your account within 24 hours. You&apos;ll receive an email confirmation.
                    </p>
                    <Link href="/dashboard" className="btn btn-primary w-full">Go to Dashboard</Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen">
            <div className="bg-dots" />

            <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-white">S</div>
                    <span className="text-xl font-bold gradient-text">Skill Scraper</span>
                </Link>
                <Link href="/upgrade" className="btn btn-outline text-sm py-2 px-4">← Back</Link>
            </nav>

            <div className="relative z-10 max-w-lg mx-auto px-6 py-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8">
                    <h1 className="text-2xl font-bold mb-2">📸 Upload Payment Proof</h1>
                    <p className="text-gray-400 text-sm mb-6">
                        Submit your payment screenshot for
                        <span className="text-cyan-400 font-semibold"> {PLANS[planRequested]?.name || 'Starter'}</span> credits
                        (₹{PLANS[planRequested]?.price || 199})
                    </p>

                    <form onSubmit={handleUpload} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Transaction ID / UPI Reference</label>
                            <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)}
                                placeholder="e.g. 412345678901" className="input" required />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400 mb-1 block">Payment Screenshot</label>
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-cyan-500/30 transition cursor-pointer"
                                onClick={() => document.getElementById('fileInput')?.click()}>
                                {screenshot ? (
                                    <div>
                                        <div className="text-green-400 mb-1">✓ {screenshot.name}</div>
                                        <div className="text-xs text-gray-500">{(screenshot.size / 1024).toFixed(1)} KB</div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-2xl mb-2">📁</div>
                                        <p className="text-sm text-gray-400">Click to upload screenshot</p>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                                <input id="fileInput" type="file" accept="image/*" className="hidden"
                                    onChange={e => setScreenshot(e.target.files?.[0] || null)} required />
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button type="submit" disabled={uploading || !screenshot || !transactionId}
                            className="btn btn-accent w-full">
                            {uploading ? '⏳ Uploading...' : '🚀 Submit Payment Proof'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default function UploadPaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
            <UploadPaymentContent />
        </Suspense>
    )
}
