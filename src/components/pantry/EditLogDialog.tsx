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

type Log = Database['public']['Tables']['logs']['Row']

interface EditLogDialogProps {
    log: Log
    trigger?: React.ReactNode
    onOpenerChange?: (open: boolean) => void
    onSuccess?: () => void
}

export function EditLogDialog({ log, trigger, onSuccess }: EditLogDialogProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    // State for fields
    // bloom_time and total_time are stored as seconds in DB
    const [bloomTime, setBloomTime] = useState<number | string>(log.bloom_time || 0)
    const [dose, setDose] = useState<number | string>(log.dose || 0)
    const [ratio, setRatio] = useState<number | string>(log.ratio || 0)
    const [grindSetting, setGrindSetting] = useState<string>(log.grind_setting || '')

    // Convert total_time (seconds) to minutes and seconds for easier editing
    const [minutes, setMinutes] = useState<number | string>(log.total_time ? Math.floor(log.total_time / 60) : 0)
    const [seconds, setSeconds] = useState<number | string>(log.total_time ? log.total_time % 60 : 0)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Calculate total seconds
            const totalTimeSeconds = (Number(minutes) * 60) + Number(seconds)
            const bloomTimeSeconds = Number(bloomTime)

            const { error: updateError } = await supabase
                .from('logs')
                .update({
                    total_time: totalTimeSeconds,
                    bloom_time: bloomTimeSeconds,
                    dose: Number(dose),
                    ratio: Number(ratio),
                    grind_setting: grindSetting || null,
                })
                .eq('id', log.id)

            if (updateError) throw updateError

            setOpen(false)
            onSuccess?.()
            router.refresh()
        } catch (err: any) {
            console.error('Error updating log:', err)
            setError(err.message || 'Failed to update log')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-300">
                        <Pencil className="h-3 w-3" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md glass-panel">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-foreground">Edit Brew Log</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dose" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Dose (g)</Label>
                            <Input
                                id="dose"
                                type="number"
                                min="0"
                                className="input-cyber text-lg"
                                value={dose}
                                onChange={(e) => setDose(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ratio" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Ratio (1:X)</Label>
                            <Input
                                id="ratio"
                                type="number"
                                min="0"
                                className="input-cyber text-lg"
                                value={ratio}
                                onChange={(e) => setRatio(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="grind-setting" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Grind Setting</Label>
                            <Input
                                id="grind-setting"
                                type="text"
                                className="input-cyber text-lg"
                                value={grindSetting}
                                onChange={(e) => setGrindSetting(e.target.value)}
                                placeholder="e.g. 4.5"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bloom-time" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Bloom Time (s)</Label>
                            <Input
                                id="bloom-time"
                                type="number"
                                min="0"
                                className="input-cyber text-lg"
                                value={bloomTime}
                                onChange={(e) => setBloomTime(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Brew Time</Label>
                            <div className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="Min"
                                        className="input-cyber text-lg"
                                        value={minutes}
                                        onChange={(e) => setMinutes(e.target.value)}
                                    />
                                    <span className="text-[10px] uppercase text-muted-foreground mt-1 ml-1 tracking-widest">Minutes</span>
                                </div>
                                <span className="text-xl text-primary/70 pb-4">:</span>
                                <div className="flex-1">
                                    <Input
                                        type="number"
                                        min="0"
                                        max="59"
                                        placeholder="Sec"
                                        className="input-cyber text-lg"
                                        value={seconds}
                                        onChange={(e) => setSeconds(e.target.value)}
                                    />
                                    <span className="text-[10px] uppercase text-muted-foreground mt-1 ml-1 tracking-widest">Seconds</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-400 bg-red-900/10 p-2 rounded border border-red-500/20">{error}</p>}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" className="hover:bg-white/5 hover:text-white" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
