'use client'

import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, Pencil, MessageSquare } from 'lucide-react'
import { Database } from '@/types/database.types'
import { formatDistanceToNow } from 'date-fns'
import { generateLogSummary } from '@/lib/log-summary'
import { DeleteButton } from '@/components/common/DeleteButton'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { EditLogDialog } from '@/components/pantry/EditLogDialog'

type LogWithRelations = Database['public']['Tables']['logs']['Row'] & {
    beans: { name: string; roaster: string | null } | null
    grinders: { name: string } | null
    methods: { name: string } | null
}

const hashString = (value: string) => {
    let hash = 0
    for (let i = 0; i < value.length; i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i)
    }
    return hash
}

export function LogTimelineEntry({ log }: { log: LogWithRelations }) {
    const [copied, setCopied] = useState(false)
    const [isEditingNotes, setIsEditingNotes] = useState(false)
    const [notes, setNotes] = useState(log.notes || '')
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const accentColor = useMemo(() => {
        const seed = log.beans?.roaster || log.beans?.name || 'bean'
        const hue = Math.abs(hashString(seed)) % 360
        return `hsl(${hue} 70% 55%)`
    }, [log.beans?.name, log.beans?.roaster])

    const handleCopy = () => {
        const summary = generateLogSummary(log)
        navigator.clipboard.writeText(summary)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSaveNotes = async () => {
        setSaving(true)
        const { error } = await supabase
            .from('logs')
            .update({ notes: notes })
            .eq('id', log.id)

        if (error) {
            console.error('Error updating notes:', error)
            alert('Failed to update notes')
        } else {
            setIsEditingNotes(false)
            router.refresh()
        }
        setSaving(false)
    }

    const handleDelete = async () => {
        const { error } = await supabase.from('logs').delete().eq('id', log.id)
        if (error) {
            console.error('Error deleting log:', error)
            alert('Failed to delete log')
        } else {
            router.refresh()
        }
    }

    const doseLabel = typeof log.dose === 'number' ? log.dose.toString().padStart(2, '0') : '--'
    const timelineLabel = `${doseLabel}g`

    return (
        <div className="relative pl-10">
            <div className="absolute left-4 top-6 h-3 w-3 rounded-full ring-4 ring-black" style={{ background: accentColor }} />
            <div className="rounded-3xl border border-white/5 bg-black/40 p-5 backdrop-blur transition hover:border-white/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-2">
                            <span style={{ color: accentColor }}>{timelineLabel}</span>
                            {log.beans?.roaster || 'Unknown Roaster'}
                        </p>
                        <h3 className="text-xl font-semibold text-white leading-tight">{log.beans?.name || 'Unknown Bean'}</h3>
                        <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                            {log.methods?.name || 'Method?'} • {log.grinders?.name || 'Grinder?'} • {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <EditLogDialog
                            log={log}
                            trigger={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Edit log"
                                    title="Edit log"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            }
                        />
                        <DeleteButton onDelete={handleDelete} itemName="this brew log" size="icon" variant="ghost" ariaLabel="Delete log" />
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-x-2 gap-y-6 text-muted-foreground sm:grid-cols-5 sm:gap-x-4">
                    <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.15em] leading-4 truncate">Dose</p>
                        <p className="text-xl font-semibold text-white leading-tight">{log.dose}g</p>
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.15em] leading-4 truncate">Ratio</p>
                        <p className="text-xl font-semibold text-white leading-tight">1:{log.ratio}</p>
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.15em] leading-4 truncate">Grind</p>
                        <p className="text-xl font-semibold text-white leading-tight">{log.grind_setting || 'N/A'}</p>
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.15em] leading-4 truncate">Duration</p>
                        <p className="text-xl font-semibold text-white leading-tight">
                            {log.total_time ? `${Math.floor(log.total_time / 60)}:${String(log.total_time % 60).padStart(2, '0')}` : '--:--'}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.15em] leading-4 truncate">Bloom</p>
                        <p className="text-xl font-semibold text-white leading-tight">{log.bloom_time || 0}s</p>
                    </div>
                </div>

                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/30 p-4">
                    {isEditingNotes ? (
                        <div className="space-y-3">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-sm text-white focus:border-primary focus:outline-none"
                                placeholder="Sensory notes, brew feedback, etc."
                                rows={3}
                            />
                            <div className="flex justify-end gap-3 text-xs uppercase tracking-[0.3em]">
                                <Button variant="ghost" size="sm" onClick={() => { setIsEditingNotes(false); setNotes(log.notes || ''); }}>
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={handleSaveNotes} disabled={saving}>
                                    {saving ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditingNotes(true)}
                            className="flex w-full items-center justify-between gap-4 text-left"
                        >
                            <div>
                                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-1">Tasting Notes</p>
                                <p className={`text-sm italic ${notes ? 'text-white/90' : 'text-muted-foreground'}`}>
                                    {notes || 'Press to add tasting notes'}
                                </p>
                            </div>
                            {!notes && (
                                <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.4em] bg-white/5 text-white/60 flex items-center gap-2">
                                    <MessageSquare className="h-3 w-3" />
                                    Add
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
