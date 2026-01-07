import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/layout/LogoutButton'
import { SettingsToggle } from '@/components/layout/SettingsToggle'
import { BrewWorkflow } from '@/components/brew/BrewWorkflow'
import { LogFeed } from '@/components/dashboard/LogFeed'
import { SilkBackground } from '@/components/dashboard/SilkBackground'
import { Bean, Cog, Beaker } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const displayName = profile?.username || user.email?.split('@')[0]

    return (
        <div className="min-h-screen bg-[#050505] text-foreground pb-20 relative">
            <SilkBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent uppercase">
                            Brew // Tracker
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm tracking-widest uppercase">
                            Operator: <span className="text-primary">{displayName}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-secondary/50 p-2 rounded-full backdrop-blur-md border border-white/5">
                        <SettingsToggle />
                        <div className="h-6 w-px bg-border" />
                        <LogoutButton />
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <Link href="/pantry" className="group">
                        <div className="relative overflow-hidden rounded-2xl bg-card border border-white/5 p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)] h-full">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Bean className="h-24 w-24 -rotate-12" />
                            </div>
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                                    <Bean className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-display font-bold uppercase tracking-wide">Pantry</h3>
                                    <p className="text-xs text-muted-foreground">Bean Inventory</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/methods" className="group">
                        <div className="relative overflow-hidden rounded-2xl bg-card border border-white/5 p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)] h-full">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Beaker className="h-24 w-24 -rotate-12" />
                            </div>
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                                    <Beaker className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-display font-bold uppercase tracking-wide">Methods</h3>
                                    <p className="text-xs text-muted-foreground">Drippers & Gear</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/grinders" className="group">
                        <div className="relative overflow-hidden rounded-2xl bg-card border border-white/5 p-8 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_30px_-10px_hsl(var(--accent)/0.3)] h-full">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Cog className="h-24 w-24 -rotate-12" />
                            </div>
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform duration-300">
                                    <Cog className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-display font-bold uppercase tracking-wide">Equipment</h3>
                                    <p className="text-xs text-muted-foreground">Grinder Settings</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:items-start">
                    {/* Main Workflow - Takes up 2 columns */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <span className="w-2 h-8 bg-primary rounded-full" />
                            NEW BREW
                        </h2>
                        <BrewWorkflow />
                    </div>

                    {/* Recent Logs - 1 Column */}
                    <div className="lg:flex lg:flex-col lg:h-[calc(100vh-16rem)]">
                        <div className="pb-2 flex-shrink-0 flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="w-2 h-8 bg-muted rounded-full" />
                                DATA LOGS
                            </h2>
                            <Link href="/logs" className="text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">
                                View All →
                            </Link>
                        </div>
                        <div className="flex-1 lg:overflow-y-auto lg:pl-1 pt-6">
                            <LogFeed />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
