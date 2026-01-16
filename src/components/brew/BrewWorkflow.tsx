'use client'

import React, { useMemo, useState } from 'react'
import { CheckCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BeanPicker } from '@/components/brew/BeanPicker'
import { RatioCalculator } from '@/components/brew/RatioCalculator'
import { GrinderPicker } from '@/components/brew/GrinderPicker'
import { MethodPicker } from '@/components/brew/MethodPicker'
import { submitBrewLog } from '@/lib/actions/brew'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database.types'

const stepConfig = [
    { id: 'bean', title: 'Bean Protocol' },
    { id: 'method', title: 'Method & Gear' },
    { id: 'dial', title: 'Dial Parameters' },
    { id: 'extraction', title: 'Extraction Timing' },
]

type BeanOption = Pick<Database['public']['Tables']['beans']['Row'], 'id' | 'name' | 'roaster'>
type MethodOption = Pick<Database['public']['Tables']['methods']['Row'], 'id' | 'name'>
type GrinderOption = Pick<Database['public']['Tables']['grinders']['Row'], 'id' | 'name'>

interface BrewWorkflowProps {
    beans?: BeanOption[]
    methods?: MethodOption[]
    grinders?: GrinderOption[]
}

export function BrewWorkflow({ beans = [], methods = [], grinders = [] }: BrewWorkflowProps) {
    const [step, setStep] = useState(0)
    const [selectedBeanId, setSelectedBeanId] = useState('')
    const [selectedGrinderId, setSelectedGrinderId] = useState('')
    const [selectedMethodId, setSelectedMethodId] = useState('')
    const [grindSetting, setGrindSetting] = useState('')
    const [dose, setDose] = useState(15) // Default 15g
    const [ratio, setRatio] = useState(18) // Default 1:18
    const [bloomTime, setBloomTime] = useState<string>('')
    const [totalMinutes, setTotalMinutes] = useState<string>('')
    const [totalSeconds, setTotalSeconds] = useState<string>('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    const canProceed = useMemo(() => {
        if (step === 0) return Boolean(selectedBeanId)
        if (step === 1) return Boolean(selectedMethodId && selectedGrinderId)
        if (step === 2) return dose > 0 && ratio > 0
        return true
    }, [dose, ratio, selectedBeanId, selectedGrinderId, selectedMethodId, step])

    const handleSubmit = async () => {
        setSaving(true)
        setError(null)

        const bloomTimeSeconds = bloomTime ? parseInt(bloomTime) : null
        const totalTimeSeconds = (parseInt(totalMinutes || '0') * 60) + parseInt(totalSeconds || '0')

        try {
            await submitBrewLog({
                bean_id: selectedBeanId || null,
                grinder_id: selectedGrinderId || null,
                method_id: selectedMethodId || null,
                grind_setting: grindSetting || null,
                dose,
                ratio,
                bloom_time: bloomTimeSeconds,
                total_time: totalTimeSeconds > 0 ? totalTimeSeconds : null,
            })

            router.refresh()
            setStep(stepConfig.length)
        } catch (err) {
            console.error(err)
            setError('Failed to save brew log. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleNext = () => {
        if (step === stepConfig.length - 1) {
            handleSubmit()
            return
        }
        setStep((current) => Math.min(stepConfig.length - 1, current + 1))
    }

    const handleBack = () => setStep((current) => Math.max(0, current - 1))

    const resetWizard = () => {
        setStep(0)
        setBloomTime('')
        setTotalMinutes('')
        setTotalSeconds('')
    }

    if (step === stepConfig.length) {
        return (
            <Card className="border-primary/30 bg-gradient-to-b from-primary/10 to-background/60 backdrop-blur-sm">
                <CardContent className="pt-12 pb-12 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                            <CheckCircle className="h-12 w-12 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-display font-bold text-primary tracking-[0.4em] uppercase">
                        Sequence Locked
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm tracking-widest uppercase">
                        Brew data synced to the archive.
                    </CardDescription>
                    <Button
                        onClick={resetWizard}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-wide uppercase px-8 py-6 h-auto"
                    >
                        Initiate New Sequence
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border border-white/5 bg-black/30 backdrop-blur-2xl">
            <CardContent className="p-6 lg:p-10">
                <div className="grid gap-10 lg:grid-cols-[220px,1fr]">
                    <aside className="relative">
                        <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/80 via-primary/20 to-transparent" />
                        <ul className="space-y-6">
                            {stepConfig.map((config, index) => {
                                const isActive = index === step
                                const isComplete = index < step
                                return (
                                    <li key={config.id} className="pl-12 relative">
                                        <button
                                            type="button"
                                            className={`flex flex-col text-left transition-colors ${isActive ? 'text-white' : 'text-muted-foreground/80'}`}
                                            onClick={() => {
                                                if (index <= step) setStep(index)
                                            }}
                                        >
                                            <span className="text-xs uppercase tracking-[0.5em]">{config.title}</span>
                                        </button>
                                        <div className={`absolute left-4 top-1 h-3 w-3 rounded-full border border-white/30 ${isComplete ? 'bg-primary' : isActive ? 'bg-accent' : 'bg-transparent'}`} />
                                    </li>
                                )
                            })}
                        </ul>
                    </aside>
                    <section className="space-y-8">
                        {step === 0 && (
                            <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
                                <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.5em] text-muted-foreground">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    Select Bean Protocol
                                </div>
                                <BeanPicker beans={beans} selectedBeanId={selectedBeanId} onSelect={setSelectedBeanId} />
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-6">
                                <div className="grid gap-6">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground mb-2">Method</p>
                                        <MethodPicker methods={methods} selectedMethodId={selectedMethodId} onSelect={setSelectedMethodId} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground mb-2">Grinder & Setting</p>
                                        <GrinderPicker
                                            grinders={grinders}
                                            selectedGrinderId={selectedGrinderId}
                                            onSelect={setSelectedGrinderId}
                                            grindSetting={grindSetting}
                                            onSettingChange={setGrindSetting}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 rounded-3xl">
                                <RatioCalculator
                                    dose={dose}
                                    ratio={ratio}
                                    onDoseChange={setDose}
                                    onRatioChange={(value) => setRatio(Math.max(1, Number(value) || 1))}
                                />
                            </div>
                        )}

                        {step === 3 && (
                            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1 space-y-2">
                                        <Label htmlFor="bloom-time" className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                                            Bloom
                                        </Label>
                                        <Input
                                            id="bloom-time"
                                            type="number"
                                            min="0"
                                            value={bloomTime}
                                            onChange={(e) => setBloomTime(e.target.value)}
                                            placeholder="e.g. 45"
                                            className="h-14 text-lg bg-black/50 border-white/10 px-4 rounded-xl"
                                        />
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Seconds</p>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                                            Total Brew Time
                                        </Label>
                                        <div className="flex gap-3 items-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={totalMinutes}
                                                    onChange={(e) => setTotalMinutes(e.target.value)}
                                                    placeholder="0"
                                                    className="h-14 w-20 text-lg text-center bg-black/50 border-white/10 rounded-xl"
                                                />
                                                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">MIN</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="59"
                                                    value={totalSeconds}
                                                    onChange={(e) => setTotalSeconds(e.target.value)}
                                                    placeholder="0"
                                                    className="h-14 w-20 text-lg text-center bg-black/50 border-white/10 rounded-xl"
                                                />
                                                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">SEC</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
                                Back
                            </Button>
                            <Button
                                className="px-8"
                                onClick={handleNext}
                                disabled={!canProceed || saving}
                            >
                                {step === stepConfig.length - 1 ? (saving ? 'Saving...' : 'Save Brew Log') : 'Next Step'}
                            </Button>
                        </div>

                        {error && <p className="text-center text-sm text-red-500">{error}</p>}
                    </section>
                </div>
            </CardContent>
        </Card>
    )
}
