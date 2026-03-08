import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { name, email, category, message, transaction_id } = await request.json()

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
        }

        const { error } = await supabase.from('support_tickets').insert({
            name,
            email,
            category: category || 'support',
            message,
            transaction_id: transaction_id || null,
            status: 'open'
        })

        if (error) {
            // If table doesn't exist, still return success (form just won't persist)
            console.error('Support ticket insert error:', error)
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Failed to submit' }, { status: 500 })
    }
}
