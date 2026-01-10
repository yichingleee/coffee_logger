import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import LogoutButton from '@/components/layout/LogoutButton'
import { AddBeanForm } from '@/components/pantry/AddBeanForm'
import { BeanList } from '@/components/pantry/BeanList'

export default async function PantryPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: beans } = await supabase
        .from('beans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-12">
                    <div className="flex items-center gap-3 sm:gap-6">
                        <Link href="/dashboard" className="p-2 sm:p-3 hover:bg-white/5 rounded-full transition-colors border border-transparent hover:border-white/10 group">
                            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-2xl sm:text-4xl font-display font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                Inventory
                            </h1>
                            <p className="text-muted-foreground text-xs sm:text-sm tracking-wider uppercase">
                                Bean Storage // Management
                            </p>
                        </div>
                    </div>
                    <LogoutButton />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Add New Bean */}
                    <div className="lg:col-span-1">
                        <AddBeanForm />
                    </div>

                    {/* Right Column: List */}
                    <div className="lg:col-span-2">
                        <BeanList initialBeans={beans || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
