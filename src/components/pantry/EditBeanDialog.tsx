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
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database.types'
import { Pencil } from 'lucide-react'

type Bean = Database['public']['Tables']['beans']['Row']

interface EditBeanDialogProps {
    bean: Bean
    trigger?: React.ReactNode
}

export function EditBeanDialog({ bean, trigger }: EditBeanDialogProps) {
    // Dialog state
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    // Initialize state with bean data
    const [name, setName] = useState(bean.name)
    const [roaster, setRoaster] = useState(bean.roaster || '')
    const [country, setCountry] = useState(bean.country || '')
    const [region, setRegion] = useState(bean.region || '')
    const [producer, setProducer] = useState(bean.producer || '')
    const [variety, setVariety] = useState(bean.variety || '')
    const [process, setProcess] = useState(bean.process || '')
    const [roastDate, setRoastDate] = useState(bean.roast_date || '')

    // Characteristics
    const characteristics = (bean.characteristics as any) || {}
    const [aroma, setAroma] = useState(characteristics.aroma || '')
    const [beginning, setBeginning] = useState(characteristics.beginning || '')
    const [middle, setMiddle] = useState(characteristics.middle || '')
    const [end, setEnd] = useState(characteristics.end || '')
    const [aftertaste, setAftertaste] = useState(characteristics.aftertaste || '')
    const [mouthfeel, setMouthfeel] = useState(characteristics.mouthfeel || '')
    const [colorTone, setColorTone] = useState(characteristics.color_tone || '')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const updatedCharacteristics: Record<string, string> = {}
            if (aroma) updatedCharacteristics.aroma = aroma
            if (beginning) updatedCharacteristics.beginning = beginning
            if (middle) updatedCharacteristics.middle = middle
            if (end) updatedCharacteristics.end = end
            if (aftertaste) updatedCharacteristics.aftertaste = aftertaste
            if (mouthfeel) updatedCharacteristics.mouthfeel = mouthfeel
            if (colorTone) updatedCharacteristics.color_tone = colorTone

            const dbCharacteristics = Object.keys(updatedCharacteristics).length > 0 ? updatedCharacteristics : null

            const { error: updateError } = await supabase
                .from('beans')
                .update({
                    name,
                    roaster: roaster || null,
                    country: country || null,
                    region: region || null,
                    producer: producer || null,
                    variety: variety || null,
                    process: process || null,
                    roast_date: roastDate || null,
                    characteristics: dbCharacteristics,
                })
                .eq('id', bean.id)

            if (updateError) throw updateError

            setOpen(false)
            router.refresh()
        } catch (err: any) {
            console.error('Error updating bean:', err)
            setError(err.message || 'Failed to update bean')
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Bean</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Bean Name</Label>
                            <Input
                                id="edit-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g. Ethiopian Yirgacheffe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-roaster">Roaster</Label>
                            <Input
                                id="edit-roaster"
                                value={roaster}
                                onChange={(e) => setRoaster(e.target.value)}
                                placeholder="e.g. Blue Bottle"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-country">Country</Label>
                            <Input
                                id="edit-country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="e.g. Ethiopia"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-region">Region</Label>
                            <Input
                                id="edit-region"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                placeholder="e.g. Yirgacheffe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-producer">Producer</Label>
                            <Input
                                id="edit-producer"
                                value={producer}
                                onChange={(e) => setProducer(e.target.value)}
                                placeholder="e.g. Smallholder farmers"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-variety">Variety</Label>
                            <Input
                                id="edit-variety"
                                value={variety}
                                onChange={(e) => setVariety(e.target.value)}
                                placeholder="e.g. Heirloom"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-process">Process</Label>
                            <Input
                                id="edit-process"
                                value={process}
                                onChange={(e) => setProcess(e.target.value)}
                                placeholder="e.g. Washed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-roastDate">Roast Date</Label>
                            <Input
                                id="edit-roastDate"
                                type="date"
                                value={roastDate}
                                onChange={(e) => setRoastDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Characteristics */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-4">Characteristics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-aroma">Aroma</Label>
                                <Input id="edit-aroma" value={aroma} onChange={(e) => setAroma(e.target.value)} placeholder="e.g. Floral" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-colorTone">Color Tone</Label>
                                <Input id="edit-colorTone" value={colorTone} onChange={(e) => setColorTone(e.target.value)} placeholder="e.g. Bright Red" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-mouthfeel">Mouthfeel</Label>
                                <Input id="edit-mouthfeel" value={mouthfeel} onChange={(e) => setMouthfeel(e.target.value)} placeholder="e.g. Silky" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-beginning">Beginning (Flavor)</Label>
                                <Input id="edit-beginning" value={beginning} onChange={(e) => setBeginning(e.target.value)} placeholder="e.g. Citrusy start" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-middle">Middle (Flavor)</Label>
                                <Input id="edit-middle" value={middle} onChange={(e) => setMiddle(e.target.value)} placeholder="e.g. Sweet berry notes" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-end">End (Flavor)</Label>
                                <Input id="edit-end" value={end} onChange={(e) => setEnd(e.target.value)} placeholder="e.g. Chocolate finish" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-aftertaste">Aftertaste</Label>
                                <Input id="edit-aftertaste" value={aftertaste} onChange={(e) => setAftertaste(e.target.value)} placeholder="e.g. Lingering sweetness" />
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
