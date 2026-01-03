import { createClient } from '@/lib/supabase/server'
import { Coffee } from 'lucide-react'
import { LogTimelineEntry } from './LogTimelineEntry'

export async function LogFeed() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: logs } = await supabase
        .from('logs')
        .select(`
            *,
            beans (
                name,
                roaster
            ),
            grinders (
                name
            ),
            methods (
                name
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-16 bg-card/50 backdrop-blur-sm rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center group hover:border-primary/30 transition-colors">
                <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Coffee className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xl font-display font-bold text-foreground">No Brew Data</p>
                <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wider">Initialize first sequence above</p>
            </div>
        )
    }

    return (
        <div className="relative">
            <div className="absolute left-[14px] top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-primary/30 to-transparent" />
            <div className="space-y-6">
                {logs.map((log) => (
                    <LogTimelineEntry key={log.id} log={log} />
                ))}
            </div>
        </div>
    )
}
