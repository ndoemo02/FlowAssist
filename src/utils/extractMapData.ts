import * as THREE from 'three';

export interface MapObject {
    id: string;
    pos: {
        x: number;
        y: number;
        z: number;
    };
    type?: string;
    boundingBox?: {
        min: { x: number; y: number; z: number };
        max: { x: number; y: number; z: number };
    };
}

/**
 * Analizuje scenę Three.js i ekstrahuje dane o wszystkich obiektach typu Mesh
 * @param scene - Scena lub grupa Three.js z załadowanego modelu GLTF
 * @param scaleMultiplier - Mnożnik skali (np. 1000 jeśli model jest przeskalowany)
 * @returns Tablica obiektów z nazwami i pozycjami światowymi
 */
export function extractMapData(scene: THREE.Object3D, scaleMultiplier: number = 1000): MapObject[] {
    const mapObjects: MapObject[] = [];
    const worldPosition = new THREE.Vector3();
    const boundingBox = new THREE.Box3();

    console.log('🔍 Rozpoczynam analizę sceny...');
    console.log(`📦 Całkowita liczba dzieci w scenie: `, scene.children.length);

    // Przechodzimy przez wszystkie obiekty w scenie
    scene.traverse((object) => {
        // Interesują nas tylko obiekty typu Mesh
        if (object instanceof THREE.Mesh) {
            // Obliczamy pozycję w przestrzeni świata
            object.getWorldPosition(worldPosition);

            // Obliczamy bounding box dla dodatkowych informacji
            if (object.geometry) {
                object.geometry.computeBoundingBox();
                if (object.geometry.boundingBox) {
                    boundingBox.copy(object.geometry.boundingBox);
                    boundingBox.applyMatrix4(object.matrixWorld);
                }
            }

            const meshData: MapObject = {
                id: object.name || `unnamed_${object.uuid}`,
                pos: {
                    x: parseFloat(worldPosition.x.toFixed(2)),
                    y: parseFloat(worldPosition.y.toFixed(2)),
                    z: parseFloat(worldPosition.z.toFixed(2)),
                },
                type: object.type,
                boundingBox: {
                    min: {
                        x: parseFloat(boundingBox.min.x.toFixed(2)),
                        y: parseFloat(boundingBox.min.y.toFixed(2)),
                        z: parseFloat(boundingBox.min.z.toFixed(2)),
                    },
                    max: {
                        x: parseFloat(boundingBox.max.x.toFixed(2)),
                        y: parseFloat(boundingBox.max.y.toFixed(2)),
                        z: parseFloat(boundingBox.max.z.toFixed(2)),
                    },
                },
            };

            mapObjects.push(meshData);
        }
    });

    console.log(`✅ Znaleziono ${mapObjects.length} obiektów typu Mesh`);

    return mapObjects;
}

/**
 * Wyświetla dane w konsoli w czytelnym formacie
 */
export function logMapData(mapObjects: MapObject[]) {
    console.log('\n📊 EKSTRAKCJA DANYCH MAPY');
    console.log('═'.repeat(60));

    console.table(
        mapObjects.map((obj, idx) => ({
            '№': idx + 1,
            'ID': obj.id,
            'X': obj.pos.x,
            'Y': obj.pos.y,
            'Z': obj.pos.z,
        }))
    );

    console.log('\n📋 DANE W FORMACIE JSON:');
    console.log(JSON.stringify(mapObjects, null, 2));

    console.log('\n💾 Eksport do zmiennej:');
    console.log('window.mapData =', mapObjects);

    // Przypisujemy do globalnej zmiennej dla łatwego dostępu w konsoli
    if (typeof window !== 'undefined') {
        (window as any).mapData = mapObjects;
        console.log('✅ Dane zapisane w window.mapData');
    }
}

/**
 * Filtruje obiekty według nazwy (regex)
 */
export function filterByName(mapObjects: MapObject[], pattern: string): MapObject[] {
    const regex = new RegExp(pattern, 'i');
    return mapObjects.filter(obj => regex.test(obj.id));
}

/**
 * Znajduje obiekty w określonym obszarze (bounding box)
 */
export function filterByArea(
    mapObjects: MapObject[],
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number
): MapObject[] {
    return mapObjects.filter(
        obj =>
            obj.pos.x >= minX &&
            obj.pos.x <= maxX &&
            obj.pos.z >= minZ &&
            obj.pos.z <= maxZ
    );
}

/**
 * Eksportuje dane do pliku JSON (do pobrania w przeglądarce)
 */
export function downloadAsJSON(mapObjects: MapObject[], filename: string = 'map_data.json') {
    const json = JSON.stringify(mapObjects, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    console.log(`📥 Pobrano plik: ${filename}`);
}
