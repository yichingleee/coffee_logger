'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useUnits } from '@/context/UnitContext'

interface RatioCalculatorProps {
    dose: number // in grams
    ratio: number
    onDoseChange: (dose: number) => void
    onRatioChange: (ratio: number) => void
}

export function RatioCalculator({ dose, ratio, onDoseChange, onRatioChange }: RatioCalculatorProps) {
    const { weightUnit, formatWeight } = useUnits()

    const targetWater = dose * ratio
    const ratioLabel = Number.isFinite(ratio) && ratio > 0 ? ratio.toFixed(1) : '--'

    const clampRatio = (value: number) => Math.max(1, Math.min(30, value || 1))

    const handleSliderChange = (values: number[]) => {
        if (!values.length) return
        onRatioChange(clampRatio(values[0]))
    }

    return (
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-black/40 via-primary/5 to-background/80 p-6 shadow-2xl shadow-black/40 text-foreground">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/5 pb-6">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Dose</p>
                    <p className="text-4xl font-semibold text-white">{dose || '--'}g</p>
                    {weightUnit === 'ounces' && (
                        <p className="text-xs text-muted-foreground">≈ {formatWeight(dose)}</p>
                    )}
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Ratio</p>
                    <p className="text-4xl font-semibold text-primary">1:{ratioLabel}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Target Water</p>
                    <p className="text-4xl font-semibold text-accent">{Math.round(targetWater) || 0}g</p>
                    {weightUnit === 'ounces' && (
                        <p className="text-xs text-muted-foreground">({formatWeight(targetWater)})</p>
                    )}
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <Label htmlFor="dose" className="text-xs uppercase tracking-[0.5em] text-muted-foreground">Dose Input</Label>
                    <Input
                        id="dose"
                        type="number"
                        className="bg-black/40 border-white/10 h-12 text-lg tracking-wide"
                        value={dose || ''}
                        onChange={(e) => onDoseChange(parseFloat(e.target.value) || 0)}
                        step={0.1}
                    />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="ratio" className="text-xs uppercase tracking-[0.5em] text-muted-foreground">Ratio Target</Label>
                    <Input
                        id="ratio"
                        type="number"
                        className="bg-black/40 border-white/10 h-12 text-lg tracking-wide"
                        value={ratio || ''}
                        onChange={(e) => onRatioChange(clampRatio(parseFloat(e.target.value)))}
                        step={0.1}
                    />
                </div>
            </div>

            <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-muted-foreground">
                    <span>Ratio Sweep</span>
                    <span>Adjust 1:{ratioLabel}</span>
                </div>
                <Slider
                    value={[ratio || 1]}
                    min={1}
                    max={30}
                    step={0.5}
                    onValueChange={handleSliderChange}
                    className="cursor-pointer"
                />
            </div>
        </div>
    )
}
