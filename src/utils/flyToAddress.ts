import * as THREE from 'three';
import gsap from 'gsap';
// Usunięto statyczny import addressMapping aby uniknąć cache Next.js

export interface AddressData {
    id: string;
    zone: string;
    description: string;
}

export interface FlyToOptions {
    duration?: number;
    offsetY?: number;
    offsetZ?: number;
    pulseColor?: string;
    pulseDuration?: number;
    targetOffsetY?: number; // Dodatkowy offset dla punktu skupienia (np. nad dach)
}

/**
 * Znajduje mesh w scenie po ID
 */
function findMeshById(scene: THREE.Object3D, targetId: string): THREE.Mesh | null {
    let foundMesh: THREE.Mesh | null = null;

    scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.name === targetId) {
            foundMesh = object;
        }
    });

    return foundMesh;
}

/**
 * Animacja pulsowania materiału obiektu
 */
function pulseObject(mesh: THREE.Mesh, duration: number = 1.5, color: string = '#00ffff') {
    const originalEmissive = (mesh.material as any).emissive?.clone() || new THREE.Color(0x000000);
    const originalEmissiveIntensity = (mesh.material as any).emissiveIntensity || 0;

    const pulseColor = new THREE.Color(color);
    const nameUpper = mesh.name.toUpperCase();

    // 1. FILTRACJA: Ignoruj infrastrukturę (ulice nie powinny pulsować jako cele budynkowe)
    const isInfrastructure = nameUpper.includes('ASPHALT') || nameUpper.includes('ROAD') ||
        nameUpper.includes('TUNNEL') || nameUpper.includes('RAIL');

    const isBuildingType = nameUpper.includes('WALL') || nameUpper.includes('STEEL') ||
        nameUpper.includes('CONCRETE') || nameUpper.includes('BUILDING') ||
        nameUpper.includes('ENTRANCE');

    if (isInfrastructure) {
        console.log(`ℹ️ Pominięto pulsowanie dla obiektu infrastruktury: ${mesh.name}`);
        return;
    }

    // Dodatkowa restrykcja: w strefach przemysłowych/biznesowych preferujemy tylko budynki
    // (To zostanie wywołane tylko jeśli flyToAddress wyśle tu mesha który nie jest budynkiem)
    if (!isBuildingType && nameUpper.includes('DEFAULT')) {
        // Jeśli to nie jest znany typ budynku, a zawiera 'DEFAULT' i nie jest infrastrukturą, 
        // możemy dopuścić, ale user prosił o skupienie na strukturach.
    }

    // Animuj emissive
    gsap.to((mesh.material as any), {
        emissiveIntensity: 2,
        duration: duration / 2,
        ease: 'power2.out',
        onStart: () => {
            if ((mesh.material as any).emissive) {
                (mesh.material as any).emissive.copy(pulseColor);
            }
        },
        onComplete: () => {
            gsap.to((mesh.material as any), {
                emissiveIntensity: originalEmissiveIntensity,
                duration: duration / 2,
                ease: 'power2.in',
                onComplete: () => {
                    if ((mesh.material as any).emissive) {
                        (mesh.material as any).emissive.copy(originalEmissive);
                    }
                }
            });
        }
    });

    // Dodatkowa animacja skali dla efektu pulsowania
    const originalScale = mesh.scale.clone();
    gsap.to(mesh.scale, {
        x: originalScale.x * 1.1,
        y: originalScale.y * 1.1,
        z: originalScale.z * 1.1,
        duration: duration / 2,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
    });
}

/**
 * Funkcja wykonująca przelot kamery do określonego adresu
 */
export async function flyToAddress(
    address: string,
    scene: THREE.Object3D,
    camera: THREE.Camera,
    controls: any,
    options: FlyToOptions = {},
    mapping?: Record<string, any>
): Promise<boolean> {
    const {
        duration = 2,
        offsetY = 50,
        offsetZ = 50,
        pulseColor = '#00ffff',
        pulseDuration = 1.5,
        targetOffsetY = 10 // Domyślnie lekko nad środek obiektu
    } = options;

    // Sprawdź czy adres istnieje w mapowaniu (użyj przekazanego lub globalnego)
    const currentMapping = mapping || (typeof window !== 'undefined' ? (window as any).addressMapping : {});
    const addressData = (currentMapping as Record<string, AddressData>)[address];

    if (!addressData) {
        console.warn(`❌ Adres "${address}" nie istnieje w bazie`);
        return false;
    }

    console.log(`🚁 Rozpoczynam przelot do: ${address}`);
    console.log(`📍 Obiekt: ${addressData.id} (${addressData.zone})`);

    // Znajdź mesh w scenie
    const targetMesh = findMeshById(scene, addressData.id);

    if (!targetMesh) {
        console.warn(`❌ Nie znaleziono obiektu ${addressData.id} w scenie`);
        return false;
    }

    // Pobierz pozycję światową obiektu
    const targetPosition = new THREE.Vector3();
    targetMesh.getWorldPosition(targetPosition);

    // Punkt skupienia (lekko nad budynkiem)
    const focusPosition = new THREE.Vector3(
        targetPosition.x,
        targetPosition.y + targetOffsetY,
        targetPosition.z
    );

    console.log(`📐 Pozycja celu: x=${targetPosition.x.toFixed(2)}, y=${targetPosition.y.toFixed(2)}, z=${targetPosition.z.toFixed(2)}`);

    // Oblicz pozycję kamery dla kąta 45 stopni (izometryczny rzut)
    // OffsetY = dystans w pionie, OffsetZ = dystans w poziomie
    // Aby uzyskać ~45 stopni, Y powinno być zbliżone do odległości poziomej.
    const cameraTarget = new THREE.Vector3(
        targetPosition.x + (offsetZ * 0.5), // Przesunięcie X
        targetPosition.y + offsetY,         // Wysokość (Y)
        targetPosition.z + offsetZ          // Dystans (Z)
    );

    console.log(`🎥 Kamera: x=${cameraTarget.x.toFixed(2)}, y=${cameraTarget.y.toFixed(2)}, z=${cameraTarget.z.toFixed(2)}`);

    // Animuj kamerę z GSAP
    return new Promise((resolve) => {
        gsap.to(camera.position, {
            x: cameraTarget.x,
            y: cameraTarget.y,
            z: cameraTarget.z,
            duration: duration,
            ease: 'power2.inOut',
            onUpdate: () => {
                // Aktualizuj controls target podczas lotu (celujemy w focusPosition)
                if (controls) {
                    controls.target.copy(focusPosition);
                    controls.update();
                }
            },
            onComplete: () => {
                console.log('✅ Przelot zakończony');

                // Pulsowanie obiektu po przylocie
                pulseObject(targetMesh, pulseDuration, pulseColor);

                resolve(true);
            }
        });
    });
}

/**
 * Pobiera listę wszystkich dostępnych adresów
 */
export function getAllAddresses(mapping?: Record<string, any>): string[] {
    const currentMapping = mapping || (typeof window !== 'undefined' ? (window as any).addressMapping : {});
    return Object.keys(currentMapping);
}

/**
 * Wyszukuje adresy pasujące do wzorca (dla autocomplete)
 */
export function searchAddresses(query: string, limit: number = 10, mapping?: Record<string, any>): string[] {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();
    const addresses = getAllAddresses(mapping);

    return addresses
        .filter(addr => addr.toLowerCase().includes(lowerQuery))
        .slice(0, limit);
}

/**
 * Sprawdza czy adres istnieje w bazie
 */
export function isValidAddress(address: string, mapping?: Record<string, any>): boolean {
    const currentMapping = mapping || (typeof window !== 'undefined' ? (window as any).addressMapping : {});
    return address in currentMapping;
}
