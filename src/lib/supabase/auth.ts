import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export const getUser = cache(async () => {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
        return null
    }
    return user
})

export const getProfile = cache(async (userId: string) => {
    const supabase = await createClient()
    const { data } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', userId)
        .single()
    return data
})
