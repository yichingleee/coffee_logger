'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, Pencil } from 'lucide-react'
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

export function LogCard({ log }: { log: LogWithRelations }) {
    const [copied, setCopied] = useState(false)
    const [isEditingNotes, setIsEditingNotes] = useState(false)
    const [notes, setNotes] = useState(log.notes || '')
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const supabase = createClient()

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
        if (!confirm('Are you sure you want to delete this log?')) return

        const { error } = await supabase.from('logs').delete().eq('id', log.id)
        if (error) {
            console.error('Error deleting log:', error)
            alert('Failed to delete log')
        } else {
            router.refresh()
        }
    }

    return (
        <Card className="hover:border-primary/50 transition-colors group relative bg-card/40 backdrop-blur-sm border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-white/5">
                <div>
                    <CardTitle className="text-base font-bold text-foreground font-display tracking-wide uppercase">
                        {log.beans?.name || 'Unknown Bean'}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1">
                        {log.beans?.roaster} • {log.methods?.name && <span className="text-primary/70">{log.methods.name} • </span>} {log.grinders?.name && <span className="text-accent/70">{log.grinders.name} • </span>} {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                    <EditLogDialog
                        log={log}
                        trigger={
                            <Button variant="ghost" size="icon" title="Edit Log" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        }
                    />
                    <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy Summary" className="hover:bg-primary/10 hover:text-primary transition-colors">
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DeleteButton onDelete={handleDelete} itemName="this brew log" size="icon" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                    <div>
                        <span className="block text-[10px] text-primary/70 uppercase tracking-widest mb-1">Dose IN</span>
                        <span className="font-bold text-foreground font-display text-lg">{log.dose}g</span>
                    </div>
                    <div>
                        <span className="block text-[10px] text-primary/70 uppercase tracking-widest mb-1">Ratio</span>
                        <span className="font-bold text-foreground font-display text-lg">1:{log.ratio}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] text-primary/70 uppercase tracking-widest mb-1">Grind</span>
                        <span className="font-bold text-foreground font-display text-lg">{log.grind_setting || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] text-primary/70 uppercase tracking-widest mb-1">Duration</span>
                        <span className="font-bold text-foreground font-display text-lg">
                            {log.total_time ? `${Math.floor(log.total_time / 60)}:${String(log.total_time % 60).padStart(2, '0')}` : '--:--'}
                        </span>
                    </div>
                    <div>
                        <span className="block text-[10px] text-primary/70 uppercase tracking-widest mb-1">Bloom</span>
                        <span className="font-bold text-foreground font-display text-lg">{log.bloom_time || 0}s</span>
                    </div>
                </div>

                {isEditingNotes ? (
                    <div className="space-y-2">
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-background/50 border border-white/10 rounded-md p-2 text-xs text-foreground focus:outline-none focus:border-primary/50 resize-y min-h-[60px]"
                            autoFocus
                            placeholder="Add notes..."
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => { setIsEditingNotes(false); setNotes(log.notes || ''); }} className="h-6 text-xs hover:bg-white/5">Cancel</Button>
                            <Button variant="secondary" size="sm" onClick={handleSaveNotes} disabled={saving} className="h-6 text-xs">
                                {saving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => setIsEditingNotes(true)}
                        className="bg-secondary/50 p-3 rounded-md text-xs text-muted-foreground italic border border-white/5 cursor-pointer hover:bg-secondary/70 hover:border-primary/30 transition-colors relative group"
                    >
                        "{notes || 'No notes recorded.'}"
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] bg-primary/20 text-primary px-1 rounded">Edit</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
