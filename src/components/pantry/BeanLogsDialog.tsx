"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database.types"
import { Calendar, Clock, Droplets, Scale, Thermometer, Timer } from "lucide-react"
import { EditLogDialog } from "./EditLogDialog"

type Bean = Database['public']['Tables']['beans']['Row']
type Log = Database['public']['Tables']['logs']['Row'] & {
    methods: { name: string } | null
    grinders: { name: string } | null
}

interface BeanLogsDialogProps {
    bean: Bean
    children: React.ReactNode
}

export function BeanLogsDialog({ bean, children }: BeanLogsDialogProps) {
    const [logs, setLogs] = useState<Log[]>([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const supabase = createClient()

    const fetchLogs = useCallback(async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('logs')
                .select(`
                    *,
                    methods (name),
                    grinders (name)
                `)
                .eq('bean_id', bean.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            // Cast the data to include the joined tables, as Supabase types might not infer them automatically
            setLogs(data as unknown as Log[])
        } catch (err) {
            console.error('Failed to fetch logs', err)
        } finally {
            setLoading(false)
        }
    }, [bean.id, supabase])

    useEffect(() => {
        if (open) {
            fetchLogs()
        }
    }, [open, fetchLogs])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-[90vw] max-h-[85vh] bg-black/90 border-white/10 backdrop-blur-xl flex flex-col gap-0 p-6">
                <DialogHeader className="flex-shrink-0 mb-4">
                    <div className="space-y-4">
                        <div>
                            <DialogTitle className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                {bean.name}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">
                                {bean.roaster}
                            </p>
                        </div>

                        {/* Bean Details */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            {(bean.country || bean.region) && (
                                <div className="col-span-2 text-muted-foreground">
                                    📍 <span className="text-foreground">{[bean.region, bean.country].filter(Boolean).join(', ')}</span>
                                </div>
                            )}
                            {bean.producer && (
                                <div className="text-muted-foreground">
                                    Producer: <span className="text-foreground">{bean.producer}</span>
                                </div>
                            )}
                            {bean.variety && (
                                <div className="text-muted-foreground">
                                    Variety: <span className="text-foreground">{bean.variety}</span>
                                </div>
                            )}
                            {bean.process && (
                                <div className="text-muted-foreground">
                                    Process: <span className="text-foreground">{bean.process}</span>
                                </div>
                            )}
                        </div>

                        {/* Characteristics */}
                        {bean.characteristics && Object.keys(bean.characteristics).length > 0 && (
                            <div className="bg-white/5 rounded-lg p-3 space-y-2">
                                <p className="text-xs uppercase opacity-70 mb-2">Characteristics</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                                    {Object.entries(bean.characteristics).map(([key, value]) => (
                                        value && (
                                            <div key={key} className="flex flex-col">
                                                <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}</span>
                                                <span className="text-foreground font-medium">{value as string}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="h-px bg-white/10 my-2" />
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 -mr-6 pr-6 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No brew logs recorded for this bean yet.</p>
                            <p className="text-xs mt-2 opacity-50">Start brewing to see data here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-4">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="group relative overflow-hidden rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 transition-all duration-300 p-5"
                                >
                                    {/* Action Buttons */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <EditLogDialog log={log} onSuccess={fetchLogs} />
                                    </div>

                                    {/* Background Accent */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10 flex flex-col gap-4">
                                        {/* Header: Date and Method */}
                                        <div className="flex justify-between items-start pr-8">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-primary font-medium">
                                                    <Calendar className="h-4 w-4" />
                                                    <span className="text-sm">
                                                        {new Date(log.created_at).toLocaleDateString([], {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="text-lg font-semibold text-foreground">
                                                    {log.methods?.name || 'Unknown Method'}
                                                </div>
                                            </div>
                                            {log.yield && (
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold font-display text-accent">
                                                        {log.yield}g
                                                    </div>
                                                    <div className="text-xs text-muted-foreground uppercase">Yield</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Grid Stats */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-t border-white/5 border-b">
                                            {log.dose && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Scale className="h-3 w-3" /> DOSE
                                                    </span>
                                                    <span className="font-medium">{log.dose}g</span>
                                                </div>
                                            )}
                                            {log.water_temp && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Thermometer className="h-3 w-3" /> TEMP
                                                    </span>
                                                    <span className="font-medium">{log.water_temp}°</span>
                                                </div>
                                            )}
                                            {log.total_time && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> TIME
                                                    </span>
                                                    <span className="font-medium">
                                                        {Math.floor(log.total_time / 60)}:{(log.total_time % 60).toString().padStart(2, '0')}
                                                    </span>
                                                </div>
                                            )}
                                            {/* Bloom Time Display */}
                                            {log.bloom_time !== null && log.bloom_time !== undefined && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Timer className="h-3 w-3" /> BLOOM
                                                    </span>
                                                    <span className="font-medium">{log.bloom_time}s</span>
                                                </div>
                                            )}
                                            {log.ratio && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Droplets className="h-3 w-3" /> RATIO
                                                    </span>
                                                    <span className="font-medium">1:{log.ratio}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer: Grinder & Notes */}
                                        <div className="space-y-3">
                                            {log.grinder_id && (
                                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <span className="text-xs uppercase opacity-70">Grinder:</span>
                                                    <span>{log.grinders?.name}</span>
                                                    {log.grind_setting && (
                                                        <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs">
                                                            {log.grind_setting}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {log.notes && (
                                                <div className="bg-black/20 rounded p-3 text-sm italic text-gray-400">
                                                    {`"${log.notes}"`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
