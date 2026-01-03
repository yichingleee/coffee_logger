'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type Bean = Database['public']['Tables']['beans']['Row']

interface BeanPickerProps {
    selectedBeanId?: string
    onSelect: (beanId: string) => void
}

export function BeanPicker({ selectedBeanId, onSelect }: BeanPickerProps) {
    const [beans, setBeans] = useState<Bean[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBeans = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('beans')
                .select('*')
                .eq('is_active', true)
                .order('name')

            if (data) {
                setBeans(data)
            }
            setLoading(false)
        }
        fetchBeans()
    }, [])

    return (
        <div className="space-y-3 group">
            <Label htmlFor="bean-select" className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Select Bean</Label>
            <Select
                value={selectedBeanId}
                onValueChange={onSelect}
                disabled={loading}
            >
                <SelectTrigger id="bean-select" className="w-full h-12 bg-secondary/20 border-white/10 hover:bg-secondary/40 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm">
                    <SelectValue placeholder={loading ? "Initializing..." : "Select Bean Protocol..."} />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10">
                    {beans.length === 0 && !loading && (
                        <div className="p-4 text-sm text-muted-foreground text-center">No active beans found.</div>
                    )}
                    {beans.map((bean) => (
                        <SelectItem key={bean.id} value={bean.id} className="focus:bg-primary/20 focus:text-primary cursor-pointer">
                            <span className="font-medium">{bean.name}</span>
                            {bean.roaster && <span className="text-muted-foreground ml-2 text-xs opacity-70">// {bean.roaster}</span>}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
