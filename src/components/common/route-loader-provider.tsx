'use client'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

type RouteLoaderContextType = {
    startNavigation: () => void;
    stopNavigation: () => void;
    isNavigating: boolean;
}

const RouteLoaderContext = createContext<RouteLoaderContextType>({
    startNavigation: () => { },
    stopNavigation: () => { },
    isNavigating: false,
})

const RouteTopBar = ({ active }: { active: boolean }) => {
    return (
        <div className="pointer-events-none fixed left-0 top-0 z-[9999] h-1 w-full">
            <div
                className={cn(
                    'h-full w-full bg-primary origin-left',
                    'transition-[transform,opacity] duration-300',
                    active
                        ? 'scale-x-100 opacity-100 animate-[pulse_1.4s_ease-in-out_infinite]'
                        : 'scale-x-0 opacity-0'
                )}
            />
        </div>
    )
}

export const RouteLoaderProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const [isNavigating, setIsNavigating] = useState(false)
    const settleTimer = useRef<NodeJS.Timeout | null>(null)

    const stopNavigation = useCallback(() => {
        if (settleTimer.current) {
            clearTimeout(settleTimer.current)
            settleTimer.current = null
        }
        settleTimer.current = setTimeout(() => setIsNavigating(false), 300)
    }, [])

    useEffect(() => {
        if (!isNavigating) return
        stopNavigation()
        return () => {
            if (settleTimer.current) {
                clearTimeout(settleTimer.current)
            }
        }
    }, [pathname, isNavigating, stopNavigation])

    const startNavigation = useCallback(() => {
        if (settleTimer.current) {
            clearTimeout(settleTimer.current)
            settleTimer.current = null
        }
        setIsNavigating(true)
    }, [])

    return (
        <RouteLoaderContext.Provider value={{ startNavigation, stopNavigation, isNavigating }}>
            {children}
            <RouteTopBar active={isNavigating} />
        </RouteLoaderContext.Provider>
    )
}

export const useRouteLoader = () => useContext(RouteLoaderContext)
