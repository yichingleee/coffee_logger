'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Link } from 'lucide-react'

type Grinder = Database['public']['Tables']['grinders']['Row']

interface GrinderPickerProps {
    selectedGrinderId?: string
    onSelect: (grinderId: string) => void
    grindSetting: string
    onSettingChange: (setting: string) => void
}

export function GrinderPicker({ selectedGrinderId, onSelect, grindSetting, onSettingChange }: GrinderPickerProps) {
    const [grinders, setGrinders] = useState<Grinder[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGrinders = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('grinders')
                .select('*')
                .order('name')

            if (data) {
                setGrinders(data)
            }
            setLoading(false)
        }
        fetchGrinders()
    }, [])

    useEffect(() => {
        if (loading) {
            return
        }
        if (grinders.length === 1 && !selectedGrinderId) {
            onSelect(grinders[0].id)
        }
    }, [grinders, loading, onSelect, selectedGrinderId])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="grinder-select">Grinder</Label>
                <Select
                    value={selectedGrinderId}
                    onValueChange={onSelect}
                    disabled={loading}
                >
                    <SelectTrigger id="grinder-select" className="w-full">
                        <SelectValue placeholder={
                            loading ? "Loading..." : (grinders.length === 0 ? "No grinders added" : "Select Grinder")
                        } />
                    </SelectTrigger>
                    <SelectContent>
                        {grinders.length === 0 && !loading && (
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
