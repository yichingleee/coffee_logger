'use client'

import { Database } from '@/types/database.types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

type Method = Pick<Database['public']['Tables']['methods']['Row'], 'id' | 'name'>

interface MethodPickerProps {
    methods: Method[]
    selectedMethodId?: string
    onSelect: (methodId: string) => void
}

export function MethodPicker({ methods, selectedMethodId, onSelect }: MethodPickerProps) {
    const isEmpty = methods.length === 0

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="method-select">Brewing Method</Label>
                <Link href="/methods" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                    <PlusCircle className="h-3 w-3" />
                    Manage
                </Link>
            </div>
            <Select
                value={selectedMethodId}
                onValueChange={onSelect}
            >
                <SelectTrigger id="method-select" className="w-full">
                    <SelectValue placeholder={isEmpty ? "No methods yet" : "Select a method..."} />
                </SelectTrigger>
                <SelectContent>
                    {isEmpty && (
                        <div className="p-4 text-center space-y-2">
                            <p className="text-sm text-muted-foreground">No methods found.</p>
                            <Link href="/methods" className="text-xs text-primary hover:underline block">
                                Add your first method
                            </Link>
                        </div>
                    )}
                    {methods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                            {method.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
