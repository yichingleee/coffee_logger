'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type TempUnit = 'celsius' | 'fahrenheit'
type WeightUnit = 'grams' | 'ounces'

interface UnitContextType {
    tempUnit: TempUnit
    weightUnit: WeightUnit
    setTempUnit: (unit: TempUnit) => void
    setWeightUnit: (unit: WeightUnit) => void
    // Helper to format temperature based on current system
    formatTemp: (celsius: number) => string
    // Helper to format weight based on current system
    formatWeight: (grams: number) => string
    // Helper to convert inputs for display
    convertTemp: (celsius: number) => number
    convertWeight: (grams: number) => number
}

const UnitContext = createContext<UnitContextType | undefined>(undefined)

export function UnitProvider({ children }: { children: React.ReactNode }) {
    const [tempUnit, setTempUnit] = useState<TempUnit>('celsius')
    const [weightUnit, setWeightUnit] = useState<WeightUnit>('grams')

    // In a real app, we might persist this to localStorage or fetch from the user profile

    const convertTemp = (celsius: number) => {
        if (tempUnit === 'celsius') return celsius
        return (celsius * 9) / 5 + 32
    }

    const convertWeight = (grams: number) => {
        if (weightUnit === 'grams') return grams
        return grams * 0.035274
    }

    const formatTemp = (celsius: number) => {
        const value = convertTemp(celsius)
        return `${Math.round(value)}°${tempUnit === 'celsius' ? 'C' : 'F'}`
    }

    const formatWeight = (grams: number) => {
        const value = convertWeight(grams)
        const unitLabel = weightUnit === 'grams' ? 'g' : 'oz'
        // If ounces, we might want fewer decimal places, or more? 
        // 1g is ~0.035oz. So 18g is ~0.63oz. We need decimals for oz.
        return `${weightUnit === 'grams' ? Math.round(value * 10) / 10 : value.toFixed(2)}${unitLabel}`
    }

    return (
        <UnitContext.Provider
            value={{
                tempUnit,
                weightUnit,
                setTempUnit,
                setWeightUnit,
                formatTemp,
                formatWeight,
                convertTemp,
                convertWeight
            }}
        >
            {children}
        </UnitContext.Provider>
    )
}

export function useUnits() {
    const context = useContext(UnitContext)
    if (context === undefined) {
        throw new Error('useUnits must be used within a UnitProvider')
    }
    return context
}
