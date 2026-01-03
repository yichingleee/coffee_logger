'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface BrewLogData {
    bean_id: string | null
    grinder_id: string | null
    method_id: string | null
    grind_setting: string | null
    dose: number
    ratio: number
    bloom_time: number | null
    total_time: number | null
}

export async function submitBrewLog(data: BrewLogData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase.from('logs').insert({
        user_id: user.id,
        ...data
    })

    if (error) {
        console.error('Error submitting brew log:', error)
        throw new Error('Failed to save brew log')
    }

    revalidatePath('/dashboard')
    revalidatePath('/logs')
}
