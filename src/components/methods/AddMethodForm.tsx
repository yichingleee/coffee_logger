'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function AddMethodForm() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
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

            const { error: insertError } = await supabase.from('methods').insert({
                user_id: user.id,
                name,
                description: description || null,
            })

            if (insertError) throw insertError

            setName('')
            setDescription('')
            router.refresh()
        } catch (err) {
            console.error(err)
            setError('Failed to add method')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-white/5 bg-card/30 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="font-display tracking-wide uppercase text-lg">New Method</CardTitle>
                <CardDescription>Add a new brewing device to your arsenal.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Method/Device Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. Hario V60 02"
                            className="bg-background/50 border-white/10 focus:border-primary/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ceramic, plastic, or notes about filters..."
                            className="bg-background/50 border-white/10 focus:border-primary/50 min-h-[100px]"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            'Add Method'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
