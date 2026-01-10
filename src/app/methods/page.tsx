import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import LogoutButton from '@/components/layout/LogoutButton'
import { AddMethodForm } from '@/components/methods/AddMethodForm'
import { MethodList } from '@/components/methods/MethodList'

export default async function MethodsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: methods } = await supabase
        .from('methods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-2 sm:gap-6 flex-1 min-w-0 mr-2">
                        <Link href="/dashboard" className="p-2 sm:p-3 hover:bg-white/5 rounded-full transition-colors border border-transparent hover:border-white/10 group flex-shrink-0">
                            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Link>
                        <div className="flex flex-col min-w-0 flex-1">
                            <h1 className="text-xl sm:text-4xl font-display font-bold uppercase tracking-wide sm:tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                                Methods
                            </h1>
                            <p className="text-muted-foreground text-[10px] sm:text-sm tracking-wider uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                                Brewing Devices & Techniques
                            </p>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <LogoutButton />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Add New Method */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <AddMethodForm />
                        </div>
                    </div>

                    {/* Right Column: List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-foreground/80 tracking-tight">Your Collection</h2>
                            <span className="text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full">
                                {methods?.length || 0} Devices
                            </span>
                        </div>
                        <MethodList methods={methods || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
