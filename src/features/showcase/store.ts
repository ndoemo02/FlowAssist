import { create } from 'zustand';

export type UnitType = 'fleet' | 'squadron';

export interface UnitData {
    id: string;
    type: UnitType;
    label: string;
    position: [number, number, number];
    status: 'idle' | 'moving' | 'patrol';
}

interface ShowcaseStore {
    units: UnitData[];
    selectedUnitId: string | null;
    logs: string[];

    // Actions
    selectUnit: (id: string | null) => void;
    moveUnit: (id: string, targetPosition: [number, number, number]) => void;
    addLog: (message: string) => void;
}

// Początkowe pozycje jednostek (nad Lwowem)
const INITIAL_UNITS: UnitData[] = [
    { id: 'alfa', type: 'fleet', label: 'Alfa Team', position: [100, 50, 100], status: 'idle' },
    { id: 'bravo', type: 'squadron', label: 'Bravo Air', position: [-200, 150, -100], status: 'patrol' },
    { id: 'charlie', type: 'fleet', label: 'Charlie Logs', position: [300, 50, -200], status: 'idle' },
    { id: 'delta', type: 'squadron', label: 'Delta Force', position: [50, 200, 300], status: 'patrol' },
];

export const useShowcaseStore = create<ShowcaseStore>((set) => ({
    units: INITIAL_UNITS,
    selectedUnitId: null,
    logs: ['System initialized.', 'Map data loaded.', 'Units on standby.'],

    selectUnit: (id) => set({ selectedUnitId: id }),

    moveUnit: (id, targetPosition) => set((state) => ({
        units: state.units.map(unit =>
            unit.id === id
                ? { ...unit, position: targetPosition, status: 'moving' }
                : unit
        ),
        logs: [...state.logs.slice(-4), `Command execution: Unit ${id.toUpperCase()} relocating...`]
    })),

    addLog: (message) => set((state) => ({
        logs: [...state.logs.slice(-4), message]
    })),
}));
