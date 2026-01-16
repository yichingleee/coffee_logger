'use client'

import React, { useState, useMemo } from 'react'
import { LogWithRelations } from '@/types/logs'
import { LogCard } from '@/components/dashboard/LogCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X, SlidersHorizontal } from 'lucide-react'

export function LogHistory({ initialLogs }: { initialLogs: LogWithRelations[] }) {
    const [selectedBean, setSelectedBean] = useState<string>('all')
    const [selectedMethod, setSelectedMethod] = useState<string>('all')
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

    // Extract unique filter options
    const beanOptions = useMemo(() => {
        const beans = new Set<string>()
        initialLogs.forEach(log => {
            if (log.beans?.name) beans.add(log.beans.name)
        })
        return Array.from(beans).sort()
    }, [initialLogs])

    const methodOptions = useMemo(() => {
        const methods = new Set<string>()
        initialLogs.forEach(log => {
            if (log.methods?.name) methods.add(log.methods.name)
        })
        return Array.from(methods).sort()
    }, [initialLogs])

    // Filter and Sort
    const filteredLogs = useMemo(() => {
        let result = [...initialLogs]

        if (selectedBean !== 'all') {
            result = result.filter(log => log.beans?.name === selectedBean)
        }

        if (selectedMethod !== 'all') {
            result = result.filter(log => log.methods?.name === selectedMethod)
        }

        result.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime()
            const dateB = new Date(b.created_at).getTime()
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
        })

        return result
    }, [initialLogs, selectedBean, selectedMethod, sortOrder])

    const clearFilters = () => {
        setSelectedBean('all')
        setSelectedMethod('all')
        setSortOrder('newest')
    }

    // Determine if any filters are active
    const hasActiveFilters = selectedBean !== 'all' || selectedMethod !== 'all' || sortOrder !== 'newest'

    return (
        <div className="space-y-8">
            {/* Controls Panel */}
            <div className="bg-card/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-primary font-display font-bold uppercase tracking-wider text-sm">
                    <SlidersHorizontal className="h-4 w-4" /> Filter & Sort
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-wrap">
                        <div className="w-full md:w-48">
                            <Select value={selectedBean} onValueChange={setSelectedBean}>
                                <SelectTrigger className="bg-background/50 border-white/10 hover:border-primary/50 transition-colors">
                                    <SelectValue placeholder="Filter by Bean" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Beans</SelectItem>
                                    {beanOptions.map(bean => (
                                        <SelectItem key={bean} value={bean}>{bean}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-48">
                            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                                <SelectTrigger className="bg-background/50 border-white/10 hover:border-primary/50 transition-colors">
                                    <SelectValue placeholder="Filter by Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Methods</SelectItem>
                                    {methodOptions.map(method => (
                                        <SelectItem key={method} value={method}>{method}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-48">
                            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
                                <SelectTrigger className="bg-background/50 border-white/10 hover:border-primary/50 transition-colors">
                                    <SelectValue placeholder="Sort Order" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 whitespace-nowrap group"
                        >
                            <X className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" /> Clear Filters
                        </Button>
                    )}
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                    Showing {filteredLogs.length} matching logs
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLogs.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-card/10 rounded-2xl border border-dashed border-white/5">
                        <p className="text-muted-foreground">No logs match your filter criteria.</p>
                        <Button variant="link" onClick={clearFilters} className="text-primary mt-2">Reset Filters</Button>
                    </div>
                ) : (
                    filteredLogs.map(log => (
                        <LogCard key={log.id} log={log} />
                    ))
                )}
            </div>
        </div>
    )
}
