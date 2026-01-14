'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

export function AddBeanForm() {
    const [name, setName] = useState('')
    const [roaster, setRoaster] = useState('')
    const [country, setCountry] = useState('')
    const [region, setRegion] = useState('')
    const [producer, setProducer] = useState('')
    const [variety, setVariety] = useState('')
    const [process, setProcess] = useState('')
    const [roastDate, setRoastDate] = useState('')

    // Characteristics
    const [aroma, setAroma] = useState('')
    const [beginning, setBeginning] = useState('')
    const [middle, setMiddle] = useState('')
    const [end, setEnd] = useState('')
    const [aftertaste, setAftertaste] = useState('')
    const [mouthfeel, setMouthfeel] = useState('')
    const [colorTone, setColorTone] = useState('')

    const [isOpen, setIsOpen] = useState(false)
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

            const characteristics = {
                aroma: aroma || undefined,
                beginning: beginning || undefined,
                middle: middle || undefined,
                end: end || undefined,
                aftertaste: aftertaste || undefined,
                mouthfeel: mouthfeel || undefined,
                color_tone: colorTone || undefined
            }

            // Filter out empty characteristics
            const dbCharacteristics = Object.keys(characteristics).length > 0 ? characteristics : null

            const { error: insertError } = await supabase.from('beans').insert({
                user_id: user.id,
                name,
                roaster: roaster || null,
                country: country || null,
                region: region || null,
                producer: producer || null,
                variety: variety || null,
                process: process || null,
                roast_date: roastDate || null,
                characteristics: dbCharacteristics,
                is_active: true
            })

            if (insertError) throw insertError

            setName('')
            setRoaster('')
            setCountry('')
            setRegion('')
            setProducer('')
            setVariety('')
            setProcess('')
            setRoastDate('')

            setAroma('')
            setBeginning('')
            setMiddle('')
            setEnd('')
            setAftertaste('')
            setMouthfeel('')
            setColorTone('')

            router.refresh()
        } catch (err) {
            console.error(err)
            setError('Failed to add bean')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="py-5">
                <div className="flex items-center justify-between gap-4 min-h-[56px]">
                    <CardTitle>Add New Bean</CardTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-expanded={isOpen}
                        aria-controls="add-bean-panel"
                        onClick={() => setIsOpen((prev) => !prev)}
                    >
                        <ChevronDown
                            className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                        <span className="sr-only">
                            {isOpen ? 'Collapse add bean form' : 'Expand add bean form'}
                        </span>
                    </Button>
                </div>
            </CardHeader>
            {isOpen && (
                <CardContent id="add-bean-panel">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Bean Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="e.g. Ethiopian Yirgacheffe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="roaster">Roaster</Label>
                                <Input
                                    id="roaster"
                                    value={roaster}
                                    onChange={(e) => setRoaster(e.target.value)}
                                    placeholder="e.g. Blue Bottle"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    placeholder="e.g. Ethiopia"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="region">Region</Label>
                                <Input
                                    id="region"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    placeholder="e.g. Yirgacheffe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="producer">Producer</Label>
                                <Input
                                    id="producer"
                                    value={producer}
                                    onChange={(e) => setProducer(e.target.value)}
                                    placeholder="e.g. Smallholder farmers"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="variety">Variety</Label>
                                <Input
                                    id="variety"
                                    value={variety}
                                    onChange={(e) => setVariety(e.target.value)}
                                    placeholder="e.g. Heirloom"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="process">Process</Label>
                                <Input
                                    id="process"
                                    value={process}
                                    onChange={(e) => setProcess(e.target.value)}
                                    placeholder="e.g. Washed"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="roastDate">Roast Date</Label>
                                <Input
                                    id="roastDate"
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
                                    <Label htmlFor="aroma">Aroma</Label>
                                    <Input id="aroma" value={aroma} onChange={(e) => setAroma(e.target.value)} placeholder="e.g. Floral" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="colorTone">Color Tone</Label>
                                    <Input id="colorTone" value={colorTone} onChange={(e) => setColorTone(e.target.value)} placeholder="e.g. Bright Red" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mouthfeel">Mouthfeel</Label>
                                    <Input id="mouthfeel" value={mouthfeel} onChange={(e) => setMouthfeel(e.target.value)} placeholder="e.g. Silky" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="beginning">Beginning (Flavor)</Label>
                                    <Input id="beginning" value={beginning} onChange={(e) => setBeginning(e.target.value)} placeholder="e.g. Citrusy start" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="middle">Middle (Flavor)</Label>
                                    <Input id="middle" value={middle} onChange={(e) => setMiddle(e.target.value)} placeholder="e.g. Sweet berry notes" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end">End (Flavor)</Label>
                                    <Input id="end" value={end} onChange={(e) => setEnd(e.target.value)} placeholder="e.g. Chocolate finish" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="aftertaste">Aftertaste</Label>
                                    <Input id="aftertaste" value={aftertaste} onChange={(e) => setAftertaste(e.target.value)} placeholder="e.g. Lingering sweetness" />
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button type="submit" disabled={loading} className="w-full md:w-auto">
                            {loading ? 'Adding...' : 'Add Bean'}
                        </Button>
                    </form>
                </CardContent>
            )}
        </Card>
    )
}
