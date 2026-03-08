'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const [hidden, setHidden] = useState(false)
    const [lastY, setLastY] = useState(0)
    const [atTop, setAtTop] = useState(true)
    const pathname = usePathname()

    // Pages where we DON'T show the public navbar
    const hideOn = ['/dashboard', '/admin', '/upload-payment']
    const shouldHide = hideOn.some(p => pathname.startsWith(p))

    useEffect(() => {
        const handle = () => {
            const y = window.scrollY
            setAtTop(y < 20)
            setHidden(y > lastY && y > 100)
            setLastY(y)
        }
        window.addEventListener('scroll', handle, { passive: true })
        return () => window.removeEventListener('scroll', handle)
    })

    if (shouldHide) return null

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
            style={{
                transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
                background: atTop ? 'transparent' : 'rgba(3, 0, 20, 0.75)',
                backdropFilter: atTop ? 'none' : 'blur(20px)',
                WebkitBackdropFilter: atTop ? 'none' : 'blur(20px)',
                borderBottom: atTop ? 'none' : '1px solid rgba(255,255,255,0.06)',
            }}
        >
            <div className="container-main flex items-center justify-between" style={{ height: '72px' }}>
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                    <img src="/logo.png" alt="Skill Scraper" className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" />
                    <span className="text-lg font-bold tracking-tight">Skill Scraper</span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-2 sm:gap-5">
                    <Link href="/pricing"
                        className={`text-sm font-medium transition-colors hidden md:block ${pathname === '/pricing' ? 'text-white' : 'text-white/45 hover:text-white'}`}>
                        Pricing
                    </Link>
                    <Link href="/download"
                        className={`text-sm font-medium transition-colors hidden md:block ${pathname === '/download' ? 'text-white' : 'text-white/45 hover:text-white'}`}>
                        Download
                    </Link>
                    <Link href="/contact"
                        className={`text-sm font-medium transition-colors hidden md:block ${pathname === '/contact' ? 'text-white' : 'text-white/45 hover:text-white'}`}>
                        Support
                    </Link>
                    <Link href="/login"
                        className="text-sm font-medium text-white/45 hover:text-white transition-colors hidden md:block">
                        Log In
                    </Link>
                    <Link href="/login" className="btn-glow !py-2.5 !px-5 !text-[13px]">
                        Dashboard
                    </Link>
                </div>
            </div>
        </nav>
    )
}
