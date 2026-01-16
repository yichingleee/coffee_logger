'use client'

import React, { useEffect } from 'react'
import { Database } from '@/types/database.types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Link } from 'lucide-react'

type Grinder = Pick<Database['public']['Tables']['grinders']['Row'], 'id' | 'name'>

interface GrinderPickerProps {
    grinders: Grinder[]
    selectedGrinderId?: string
    onSelect: (grinderId: string) => void
    grindSetting: string
    onSettingChange: (setting: string) => void
}

export function GrinderPicker({ grinders, selectedGrinderId, onSelect, grindSetting, onSettingChange }: GrinderPickerProps) {
    const isEmpty = grinders.length === 0

    useEffect(() => {
        if (grinders.length === 1 && !selectedGrinderId) {
            onSelect(grinders[0].id)
        }
    }, [grinders, onSelect, selectedGrinderId])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="grinder-select">Grinder</Label>
                <Select
                    value={selectedGrinderId}
                    onValueChange={onSelect}
                >
                    <SelectTrigger id="grinder-select" className="w-full">
                        <SelectValue placeholder={
                            isEmpty ? "No grinders added" : "Select Grinder"
                        } />
                    </SelectTrigger>
                    <SelectContent>
                        {isEmpty && (
                            <div className="p-2 text-sm text-muted-foreground text-center">
                                No grinders found. <a href="/grinders" className="text-primary hover:underline">Add one?</a>
                            </div>
                        )}
                        {grinders.map((grinder) => (
                            <SelectItem key={grinder.id} value={grinder.id}>
                                {grinder.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="grind-setting">Setting</Label>
                <Input
                    id="grind-setting"
                    value={grindSetting}
                    onChange={(e) => onSettingChange(e.target.value)}
                    placeholder="e.g. 15, 2.4, Fine"
                />
            </div>
        </div>
    )
}
