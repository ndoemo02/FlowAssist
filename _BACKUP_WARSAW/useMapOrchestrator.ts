'use client';

import { useState, useCallback } from 'react';

export interface MapViewState {
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
}

const DEFAULT_VIEW: MapViewState = {
    center: [21.0122, 52.2297],
    zoom: 14.5,
    pitch: 55,
    bearing: -15
};

export function useMapOrchestrator() {
    const [viewState, setViewState] = useState<MapViewState>(DEFAULT_VIEW);
    const [isLoaded, setIsLoaded] = useState(false);

    const flyTo = useCallback((center: [number, number], zoom = 15) => {
        setViewState(prev => ({ ...prev, center, zoom }));
    }, []);

    const resetView = useCallback(() => {
        setViewState(DEFAULT_VIEW);
    }, []);

    return {
        viewState,
        setViewState,
        isLoaded,
        setIsLoaded,
        flyTo,
        resetView
    };
}
