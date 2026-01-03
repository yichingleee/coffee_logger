'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database.types'
import { Pencil } from 'lucide-react'

type Method = Database['public']['Tables']['methods']['Row']

interface EditMethodDialogProps {
    method: Method
    trigger?: React.ReactNode
}

export function EditMethodDialog({ method, trigger }: EditMethodDialogProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const [name, setName] = useState(method.name)
    const [description, setDescription] = useState(method.description || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error: updateError } = await supabase
                .from('methods')
                .update({
                    name,
                    description: description || null,
                })
                .eq('id', method.id)

            if (updateError) throw updateError

            setOpen(false)
            router.refresh()
        } catch (err: any) {
            console.error('Error updating method:', err)
            setError(err.message || 'Failed to update method')
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
                    <DialogTitle>Edit Brewing Method</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-method-name">Method Name</Label>
                        <Input
                            id="edit-method-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. V60, Chemex, AeroPress"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-method-description">Description (optional)</Label>
                        <Textarea
                            id="edit-method-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add notes about this brewing method..."
                            rows={3}
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
