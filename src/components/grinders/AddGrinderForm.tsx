'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'

export function AddGrinderForm() {
    const [name, setName] = useState('')
    const [type, setType] = useState<'manual' | 'electric'>('electric')
    const [settingType, setSettingType] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error('No user found')

            const { error: insertError } = await supabase.from('grinders').insert({
                user_id: user.id,
                name,
                type,
                setting_type: settingType || null,
            })

            if (insertError) throw insertError

            setName('')
            setType('electric')
            setSettingType('')
            router.refresh()
        } catch (err) {
            console.error(err)
            setError('Failed to add grinder')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Grinder</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Grinder Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. Fellow Ode Gen 2"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select value={type} onValueChange={(val: 'manual' | 'electric') => setType(val)}>
                                <SelectTrigger id="type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="electric">Electric</SelectItem>
                                    <SelectItem value="manual">Manual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="settingType">Setting Type</Label>
                            <Input
                                id="settingType"
                                value={settingType}
                                onChange={(e) => setSettingType(e.target.value)}
                                placeholder="e.g. Stepped (1-10)"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                        {loading ? 'Adding...' : 'Add Grinder'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
