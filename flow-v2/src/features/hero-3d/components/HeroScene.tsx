// import ResponsiveCameraRig from './ResponsiveCameraRig'; // Temporarily disabled
// import DevCameraPanel from './DevCameraPanel'; // Disabled in favor of HTML panel in page.tsx
import DevCameraConfig from './DevCameraConfig';

export default function HeroScene({ config }: { config?: any }) {
    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
            }}
            className="w-full h-full"
        >
            <color attach="background" args={['#050208']} />

            <DevCameraConfig config={config} />

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 2.2}
                minDistance={2}
                maxDistance={50}
                dampingFactor={0.05}
            />

            <Suspense fallback={null}>
                <Environment preset="night" blur={0.8} background={false} />

                <GalaxyLighting />
                <StarField count={8000} />
                <CosmicSnow count={200} />

                <GalaxyStudioModel config={{ rotY: 1.64, scale: 0.6 }} />
                <SampleObject />
            </Suspense>
        </Canvas>
    );
}

import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ResponsiveCameraRig() {
    const { camera, size } = useThree();

    useFrame(() => {
        // Oblicz aspekt (szerokość / wysokość)
        const aspect = size.width / size.height;

        // Bazowa odległość dla szerokich ekranów (Desktop)
        const baseDist = 5.0;

        // Logika "Cover": jeśli ekran jest wąski (Mobile), odsuń kamerę
        // Im węższy ekran, tym większy dystans
        let targetZ = baseDist;

        if (aspect < 1.0) {
            // Mobile (Portrait)
            // Empiryczny wzór: im mniejszy aspekt, tym dalej kamera
            // Np. dla aspect 0.5 (telefon) -> 5.0 / 0.5 = 10.0
            // Dzielimy przez aspekt z lekkim tłumieniem, żeby nie uciekła za daleko
            targetZ = baseDist / (aspect * 0.85);
        }

        // Płynna interpolacja pozycji kamery
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);

        // Zawsze patrz w środek (0, 0.5, 0) - lekko w górę
        camera.lookAt(0, 0.5, 0);
    });

    return (
        <PerspectiveCamera
            makeDefault
            position={[0, 0.5, 5.0]} // Startowa pozycja
            fov={60}
        />
    );
}
