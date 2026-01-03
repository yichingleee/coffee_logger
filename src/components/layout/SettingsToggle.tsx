'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Settings, Thermometer, Scale } from 'lucide-react'
import { useUnits } from '@/context/UnitContext'

export function SettingsToggle() {
    const { tempUnit, setTempUnit, weightUnit, setWeightUnit } = useUnits()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" title="Settings">
                    <Settings className="h-5 w-5 text-gray-600" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4" align="end">
                <div className="space-y-4">
                    <h4 className="font-medium leading-none">Preferences</h4>
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground flex items-center gap-2">
                            <Thermometer className="h-3 w-3" /> Temperature
                        </Label>
                        <div className="flex bg-muted rounded-lg p-1">
                            <button
                                onClick={() => setTempUnit('celsius')}
                                className={`flex-1 text-sm py-1 rounded-md transition-all ${tempUnit === 'celsius' ? 'bg-card border-border shadow-sm font-bold text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                °C
                            </button>
                            <button
                                onClick={() => setTempUnit('fahrenheit')}
                                className={`flex-1 text-sm py-1 rounded-md transition-all ${tempUnit === 'fahrenheit' ? 'bg-card border-border shadow-sm font-bold text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                °F
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground flex items-center gap-2">
                            <Scale className="h-3 w-3" /> Weight
                        </Label>
                        <div className="flex bg-muted rounded-lg p-1">
                            <button
                                onClick={() => setWeightUnit('grams')}
                                className={`flex-1 text-sm py-1 rounded-md transition-all ${weightUnit === 'grams' ? 'bg-card border-border shadow-sm font-bold text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Grams
                            </button>
                            <button
                                onClick={() => setWeightUnit('ounces')}
                                className={`flex-1 text-sm py-1 rounded-md transition-all ${weightUnit === 'ounces' ? 'bg-card border-border shadow-sm font-bold text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Ounces
                            </button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
