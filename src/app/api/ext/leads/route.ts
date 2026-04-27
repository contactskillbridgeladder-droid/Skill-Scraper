import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split(' ')[1]
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        // Get the leads from the request body
        const leadsData = await req.json()
        
        if (!Array.isArray(leadsData) || leadsData.length === 0) {
            return NextResponse.json({ success: true, count: 0 })
        }

        // Add user_id to all leads
        const insertData = leadsData.map(lead => ({
            user_id: user.id,
            data: lead,
            // Assuming leads have a 'name' or 'place_id' we can use to avoid duplicates or just insert directly.
            // Using a simple JSONB insert into `scraped_leads` table.
        }))

        const { error } = await supabase.from('scraped_leads').insert(insertData)

        if (error) {
            console.error('Error inserting leads:', error)
            return NextResponse.json({ error: 'Failed to sync leads', details: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, count: insertData.length })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
