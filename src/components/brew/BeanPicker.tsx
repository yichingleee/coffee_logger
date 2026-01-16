'use client'

import { Database } from '@/types/database.types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type Bean = Pick<Database['public']['Tables']['beans']['Row'], 'id' | 'name' | 'roaster'>

interface BeanPickerProps {
    beans: Bean[]
    selectedBeanId?: string
    onSelect: (beanId: string) => void
}

export function BeanPicker({ beans, selectedBeanId, onSelect }: BeanPickerProps) {
    const isEmpty = beans.length === 0

    return (
        <div className="space-y-3 group">
            <Label htmlFor="bean-select" className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Select Bean</Label>
            <Select
                value={selectedBeanId}
                onValueChange={onSelect}
            >
                <SelectTrigger id="bean-select" className="w-full h-12 bg-secondary/20 border-white/10 hover:bg-secondary/40 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm">
                    <SelectValue placeholder={isEmpty ? "No active beans" : "Select Bean Protocol..."} />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10">
                    {isEmpty && (
                        <div className="p-4 text-sm text-muted-foreground text-center">No active beans found.</div>
                    )}
                    {beans.map((bean) => (
                        <SelectItem key={bean.id} value={bean.id} className="focus:bg-primary/20 focus:text-primary cursor-pointer">
                            <span className="font-medium">{bean.name}</span>
                            {bean.roaster && (
                                <span className="text-muted-foreground ml-2 text-xs opacity-70">
                                    {'// '}
                                    {bean.roaster}
                                </span>
                            )}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
