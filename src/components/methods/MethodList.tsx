'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Database } from '@/types/database.types'
import { DeleteButton } from '@/components/common/DeleteButton'
import { EditMethodDialog } from '@/components/methods/EditMethodDialog'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Beaker } from 'lucide-react'

type Method = Database['public']['Tables']['methods']['Row']

interface MethodListProps {
    methods: Method[]
}

export function MethodList({ methods }: MethodListProps) {
    const router = useRouter()
    const supabase = createClient()

    const deleteMethod = async (id: string) => {
        const { error } = await supabase.from('methods').delete().eq('id', id)
        if (error) {
            console.error('Failed to delete method', error)
            alert('Failed to delete method')
        } else {
            router.refresh()
        }
    }

    if (methods.length === 0) {
        return (
            <div className="text-center py-12 bg-card/30 rounded-xl border-2 border-dashed border-white/10">
                <Beaker className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No brewing methods added yet.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methods.map((method) => (
                <Card key={method.id} className="bg-card/40 backdrop-blur-sm border-white/5 group relative hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pt-4 pb-3">
                        <div>
                            <CardTitle className="text-lg font-display tracking-wide">{method.name}</CardTitle>
                            {method.description && (
                                <CardDescription className="text-xs mt-1 line-clamp-2">
                                    {method.description}
                                </CardDescription>
                            )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <EditMethodDialog method={method} />
                            <DeleteButton
                                onDelete={() => deleteMethod(method.id)}
                                itemName={method.name}
                                size="icon"
                            />
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}
