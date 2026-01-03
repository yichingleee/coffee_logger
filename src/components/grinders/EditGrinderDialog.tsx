'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database.types'
import { Pencil } from 'lucide-react'

type Grinder = Database['public']['Tables']['grinders']['Row']

interface EditGrinderDialogProps {
    grinder: Grinder
    trigger?: React.ReactNode
}

export function EditGrinderDialog({ grinder, trigger }: EditGrinderDialogProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const [name, setName] = useState(grinder.name)
    const [type, setType] = useState<'manual' | 'electric'>(grinder.type || 'manual')
    const [settingType, setSettingType] = useState(grinder.setting_type || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error: updateError } = await supabase
                .from('grinders')
                .update({
                    name,
                    type,
                    setting_type: settingType || null,
                })
                .eq('id', grinder.id)

            if (updateError) throw updateError

            setOpen(false)
            router.refresh()
        } catch (err: any) {
            console.error('Error updating grinder:', err)
            setError(err.message || 'Failed to update grinder')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Grinder</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-grinder-name">Grinder Name</Label>
                        <Input
                            id="edit-grinder-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. Comandante C40, Baratza Encore"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-grinder-type">Type</Label>
                        <Select value={type} onValueChange={(val: 'manual' | 'electric') => setType(val)}>
                            <SelectTrigger id="edit-grinder-type">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="electric">Electric</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-grinder-setting">Setting Type (optional)</Label>
                        <Input
                            id="edit-grinder-setting"
                            value={settingType}
                            onChange={(e) => setSettingType(e.target.value)}
                            placeholder="e.g. Clicks, Numbered dial"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
