'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Database } from '@/types/database.types'
import { DeleteButton } from '@/components/common/DeleteButton'
import { EditGrinderDialog } from '@/components/grinders/EditGrinderDialog'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Grinder = Database['public']['Tables']['grinders']['Row']

interface GrinderListProps {
    grinders: Grinder[]
}

export function GrinderList({ grinders }: GrinderListProps) {
    const router = useRouter()
    const supabase = createClient()

    const deleteGrinder = async (id: string) => {
        const { error } = await supabase.from('grinders').delete().eq('id', id)
        if (error) {
            console.error('Failed to delete grinder', error)
            alert('Failed to delete grinder')
        } else {
            router.refresh()
        }
    }

    // ...
    if (grinders.length === 0) {
        return (
            <div className="text-center py-12 bg-card/30 rounded-xl border-2 border-dashed border-white/10">
                <p className="text-muted-foreground">No grinders added yet.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grinders.map((grinder) => (
                <Card key={grinder.id} className="bg-card/40 backdrop-blur-sm border-white/5 group relative hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pt-4 pb-3">
                        <div>
                            <CardTitle className="text-lg font-display tracking-wide">{grinder.name}</CardTitle>
                            <CardDescription className="capitalize text-xs mt-0.5">
                                {grinder.type} {grinder.setting_type ? `• ${grinder.setting_type}` : ''}
                            </CardDescription>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <EditGrinderDialog grinder={grinder} />
                            <DeleteButton
                                onDelete={() => deleteGrinder(grinder.id)}
                                itemName={grinder.name}
                                size="icon"
                            />
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}
