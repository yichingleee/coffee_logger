import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import LogoutButton from '@/components/layout/LogoutButton'
import { LogHistory } from '@/components/logs/LogHistory'

export default async function LogsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch ALL logs for the history page
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

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-background to-background pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="p-3 hover:bg-white/5 rounded-full transition-colors border border-transparent hover:border-white/10 group">
                            <ChevronLeft className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-4xl font-display font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                Data Logs
                            </h1>
                            <p className="text-muted-foreground text-sm tracking-wider uppercase">
                                Historical Brew Archive
                            </p>
                        </div>
                    </div>
                    <LogoutButton />
                </div>

                {/* Main Content */}
                <LogHistory initialLogs={logs || []} />
            </div>
        </div>
    )
}
