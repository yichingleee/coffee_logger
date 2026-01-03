'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Database } from '@/types/database.types'
import { Archive, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DeleteButton } from '@/components/common/DeleteButton'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Bean = Database['public']['Tables']['beans']['Row']

interface BeanListProps {
    initialBeans: Bean[]
}

import { BeanLogsDialog } from './BeanLogsDialog'
import { EditBeanDialog } from './EditBeanDialog'

// Component for listing beans

export function BeanList({ initialBeans }: BeanListProps) {
    const [beans, setBeans] = useState<Bean[]>(initialBeans)

    // Active Filters
    const [activeRoasterFilter, setActiveRoasterFilter] = useState<string>("ALL")
    const [activeCountryFilter, setActiveCountryFilter] = useState<string>("ALL")

    // Archive Filters
    const [archiveRoasterFilter, setArchiveRoasterFilter] = useState<string>("ALL")
    const [archiveCountryFilter, setArchiveCountryFilter] = useState<string>("ALL")

    const router = useRouter()
    const supabase = createClient()

    React.useEffect(() => {
        setBeans(initialBeans)
    }, [initialBeans])

    const toggleStatus = async (beanId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('beans')
                .update({ is_active: !currentStatus })
                .eq('id', beanId)

            if (error) throw error

            setBeans(beans.map(b =>
                b.id === beanId ? { ...b, is_active: !currentStatus } : b
            ))
            router.refresh()
        } catch (err) {
            console.error('Failed to update bean status', err)
        }
    }

    const deleteBean = async (beanId: string) => {
        try {
            const { error } = await supabase.from('beans').delete().eq('id', beanId)
            if (error) throw error

            setBeans(beans.filter(b => b.id !== beanId))
            router.refresh()
        } catch (err) {
            console.error('Failed to delete bean', err)
            alert('Failed to delete bean')
        }
    }

    const archiveAllActive = async () => {
        if (!confirm("Are you sure you want to archive all active beans?")) return

        try {
            const { error } = await supabase
                .from('beans')
                .update({ is_active: false })
                .eq('is_active', true)

            if (error) throw error

            setBeans(beans.map(b => (b.is_active ? { ...b, is_active: false } : b)))
            router.refresh()
        } catch (err) {
            console.error('Failed to archive all beans', err)
        }
    }

    const sortBeans = (a: Bean, b: Bean) => {
        const countryA = a.country || ""
        const countryB = b.country || ""
        const countryDiff = countryA.localeCompare(countryB)

        if (countryDiff !== 0) return countryDiff

        const regionA = a.region || ""
        const regionB = b.region || ""
        return regionA.localeCompare(regionB)
    }

    // --- Active Beans Logic ---
    const rawActiveBeans = beans.filter(b => b.is_active)
    const uniqueActiveRoasters = Array.from(new Set(rawActiveBeans.map(b => b.roaster).filter(Boolean))) as string[]
    const uniqueActiveCountries = Array.from(new Set(rawActiveBeans.map(b => b.country).filter(Boolean))) as string[]
    uniqueActiveRoasters.sort()
    uniqueActiveCountries.sort()

    const visibleActiveBeans = rawActiveBeans
        .filter(b => activeRoasterFilter === "ALL" || b.roaster === activeRoasterFilter)
        .filter(b => activeCountryFilter === "ALL" || b.country === activeCountryFilter)
        .sort(sortBeans)

    // --- Archived Beans Logic ---
    const rawArchivedBeans = beans.filter(b => !b.is_active)
    const uniqueArchiveRoasters = Array.from(new Set(rawArchivedBeans.map(b => b.roaster).filter(Boolean))) as string[]
    const uniqueArchiveCountries = Array.from(new Set(rawArchivedBeans.map(b => b.country).filter(Boolean))) as string[]
    uniqueArchiveRoasters.sort()
    uniqueArchiveCountries.sort()

    const visibleArchivedBeans = rawArchivedBeans
        .filter(b => archiveRoasterFilter === "ALL" || b.roaster === archiveRoasterFilter)
        .filter(b => archiveCountryFilter === "ALL" || b.country === archiveCountryFilter)
        .sort(sortBeans)

    return (
        <div className="space-y-12">
            {/* Active Section */}
            <section>
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">Active Beans</h2>
                            <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{visibleActiveBeans.length}</span>
                        </div>
                        {rawActiveBeans.length > 0 && (
                            <Button variant="outline" size="sm" onClick={archiveAllActive} className="text-muted-foreground hover:text-foreground">
                                <Archive className="mr-2 h-4 w-4" />
                                Archive All
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Select value={activeRoasterFilter} onValueChange={setActiveRoasterFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Roaster" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Roasters</SelectItem>
                                {uniqueActiveRoasters.map(r => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={activeCountryFilter} onValueChange={setActiveCountryFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Countries</SelectItem>
                                {uniqueActiveCountries.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visibleActiveBeans.length === 0 ? (
                        <div className="col-span-2 text-center py-12 border border-dashed border-white/10 rounded-lg">
                            <p className="text-muted-foreground italic">No active beans match your criteria.</p>
                        </div>
                    ) : (
                        visibleActiveBeans.map(bean => (
                            <BeanCard
                                key={bean.id}
                                bean={bean}
                                onToggle={() => toggleStatus(bean.id, true)}
                                onDelete={() => deleteBean(bean.id)}
                            />
                        ))
                    )}
                </div>
            </section>

            {/* Archive Section */}
            {rawArchivedBeans.length > 0 && (
                <section>
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-display font-semibold text-muted-foreground">Archived</h2>
                            <span className="text-sm text-muted-foreground/50">{visibleArchivedBeans.length}</span>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Select value={archiveRoasterFilter} onValueChange={setArchiveRoasterFilter}>
                                <SelectTrigger className="w-[180px] opacity-75">
                                    <SelectValue placeholder="Roaster" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Roasters</SelectItem>
                                    {uniqueArchiveRoasters.map(r => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={archiveCountryFilter} onValueChange={setArchiveCountryFilter}>
                                <SelectTrigger className="w-[180px] opacity-75">
                                    <SelectValue placeholder="Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Countries</SelectItem>
                                    {uniqueArchiveCountries.map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
                        {visibleArchivedBeans.length === 0 ? (
                            <div className="col-span-2 text-center py-12 border border-dashed border-white/10 rounded-lg">
                                <p className="text-muted-foreground italic">No archived beans match your criteria.</p>
                            </div>
                        ) : (
                            visibleArchivedBeans.map(bean => (
                                <BeanCard
                                    key={bean.id}
                                    bean={bean}
                                    onToggle={() => toggleStatus(bean.id, false)}
                                    onDelete={() => deleteBean(bean.id)}
                                />
                            ))
                        )}
                    </div>
                </section>
            )}
        </div>
    )
}

function BeanCard({ bean, onToggle, onDelete }: { bean: Bean, onToggle: () => void, onDelete: () => Promise<void> }) {
    return (
        <Card className="group relative bg-card/40 backdrop-blur-sm border-white/5 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <BeanLogsDialog bean={bean}>
                    <div className="flex flex-col space-y-1 cursor-pointer hover:opacity-80 transition-opacity group/text">
                        <CardTitle className="text-base font-bold font-display tracking-wide group-hover/text:text-primary transition-colors">{bean.name}</CardTitle>
                        {bean.roaster && (
                            <CardDescription className="text-xs">{bean.roaster}</CardDescription>
                        )}
                    </div>
                </BeanLogsDialog>
                <div className="flex items-center gap-1">
                    <EditBeanDialog bean={bean} />
                    <Button variant="ghost" size="icon" onClick={onToggle} title={bean.is_active ? "Archive" : "Activate"} className="hover:text-primary hover:bg-primary/10">
                        {bean.is_active ? <Archive className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                    </Button>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DeleteButton onDelete={onDelete} itemName={bean.name} size="icon" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                    {(bean.country || bean.region) && (
                        <div>
                            📍 {[bean.region, bean.country].filter(Boolean).join(', ')}
                        </div>
                    )}
                    {bean.variety && <div>🌱 {bean.variety}</div>}
                    {bean.process && <div>⚙️ {bean.process}</div>}
                    {bean.roast_date && <div>🔥 Roast Date: {new Date(bean.roast_date).toLocaleDateString()}</div>}
                </div>
            </CardContent>
        </Card>
    )
}
