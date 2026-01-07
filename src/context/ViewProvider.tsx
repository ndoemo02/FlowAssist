'use client'

import React, { createContext, useContext, useState } from 'react'

type ViewType = 'HOME' | 'DEV_PANEL'

interface ViewContextType {
    currentView: ViewType
    setView: (view: ViewType) => void
}

const ViewContext = createContext<ViewContextType | undefined>(undefined)

export const ViewProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentView, setView] = useState<ViewType>('HOME')

    return (
        <ViewContext.Provider value={{ currentView, setView }}>
            {children}
        </ViewContext.Provider>
    )
}

export const useView = () => {
    const context = useContext(ViewContext)
    if (!context) {
        throw new Error('useView must be used within a ViewProvider')
    }
    return context
}
