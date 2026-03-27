'use client';

import * as THREE from 'three';
import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

export default function PixelSwarmText() {
    const points = useRef<THREE.Points>(null);

    // 1. Generate Particle Data (Positions & Sizes)
    const { positions, randomPositions, sizes } = useMemo(() => {
        // Reduced canvas size for performance in React context
        const width = 2048;
        const height = 1024;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Font sizes matched to dev/index.html visual weight (FlowAssist text removed per request)
        ctx.font = 'bold 200px Inter, sans-serif';
        ctx.fillText("Smart Business", width / 2, height / 2);

        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        const targetPos: number[] = [];
        const randomPos: number[] = [];
        const sizeData: number[] = [];

        // Scanning density - adjusted for main page scale
        // step 2 = high density (every 2nd pixel)
        const step = 2;

        // Scale factor to world units
        const scale = 0.0018;

        // Z offset to place it slightly in front of the screen
        const zOffset = -0.2;

        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const i = (y * width + x) * 4;
                if (data[i + 3] > 128) { // If pixel is visible
                    // Centered coordinates
                    const pX = (x - width / 2) * scale;
                    // Flip Y because canvas 0,0 is top-left, 3D is bottom-left
                    const pY = -(y - height / 2) * scale + 0.45; // Match dev/index vertical shift
                    const pZ = zOffset;

                    targetPos.push(pX, pY, Math.random() * 0.1 + pZ); // SLight depth noise

                    // Random start positions (explosion effect)
                    randomPos.push(
                        (Math.random() - 0.5) * 5.0,
                        (Math.random() - 0.5) * 5.0,
                        (Math.random() - 0.5) * 5.0 + 2.0 // Start closer to camera
                    );

                    sizeData.push(Math.random() * 0.03 + 0.01);
                }
            }
        }

        return {
            positions: new Float32Array(targetPos),
            randomPositions: new Float32Array(randomPos),
            sizes: new Float32Array(sizeData)
        };
    }, []);

    // 2. Shaders (Ported from dev/index.html)
    const shaderArgs = useMemo(() => ({
        uniforms: {
            uTime: { value: 0 },
            uProgress: { value: 0 }, // 0 = random, 1 = formed
            uShineProgress: { value: -1.0 },
            uGlobalAlpha: { value: 1.0 },
            uMouse: { value: new THREE.Vector2(0, 0) }
        },
        vertexShader: `
            uniform float uTime;
            uniform float uProgress;
            uniform float uShineProgress;
            uniform float uGlobalAlpha;
            uniform vec2 uMouse;
            
            attribute vec3 aRandomPosition; 
            attribute float aSize;
            
            varying vec3 vColor; 
            varying float vAlpha;

            void main() {
                // Intro animation (Explosion -> Form)
                float t = smoothstep(0.0, 1.0, uProgress);
                vec3 currentPos = mix(aRandomPosition, position, t);
                
                // Mouse interaction (repel) - optional active only when formed
                if (uProgress > 0.9) { 
                    float dist = distance(currentPos.xz, uMouse * 4.0);
                    if (dist < 1.0) {
                        // Push up/down based on distance
                        currentPos.y += (1.0 - dist) * 0.1;
                    }
                }

                vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // Size attenuation based on Z
                // Multiplier 300.0 is standard desktop, can be dynamic
                gl_PointSize = aSize * (300.0 / -mvPosition.z);
                
                // Color Gradient (Cyan to White)
                // Position Z based mix
                float mixFactor = (position.z + 2.0) * 0.25;
                vec3 cyan = vec3(0.0, 1.0, 1.0);
                vec3 white = vec3(1.0, 1.0, 1.0);
                vec3 baseColor = mix(cyan, white, mixFactor);
                
                // Shine Effect (Gold Sweep)
                float sweepPos = mix(-5.0, 5.0, uShineProgress);
                float distX = abs(currentPos.x - sweepPos);
                float shine = smoothstep(1.0, 0.0, distX);
                vec3 gold = vec3(1.0, 0.85, 0.4);
                
                vColor = baseColor + (gold * shine * 1.2);
                
                // Alpha fade in/out
                // Multiplied by 1.2 boost for visibility
                vAlpha = smoothstep(0.0, 0.2, uProgress) * uGlobalAlpha * 1.2;
            }
        `,
        fragmentShader: `
            varying vec3 vColor; 
            varying float vAlpha;

            void main() {
                // Circular particle shape
                vec2 coord = gl_PointCoord - vec2(0.5);
                float dist = length(coord);
                if (dist > 0.5) discard;
                
                // Soft edges
                float strength = pow(1.0 - (dist * 2.0), 2.0);
                
                gl_FragColor = vec4(vColor, strength * vAlpha);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    }), []);

    // 3. Animation Loop
    useFrame((state) => {
        if (!points.current) return;

        const time = state.clock.getElapsedTime();
        const material = points.current.material as THREE.ShaderMaterial;

        material.uniforms.uTime.value = time;

        // Progress: Intro animation 0 -> 1 over first 2.5 seconds
        // starts slower
        const progress = Math.min(time * 0.4, 1.0);
        material.uniforms.uProgress.value = progress;

        // Shine Loop (every 5 seconds)
        if (progress >= 1.0) {
            let shineTime = (time - 2.5) % 5.0;
            if (shineTime < 2.0) { // Shine duration 2s
                // Normalize 0..2 to 0..1
                material.uniforms.uShineProgress.value = shineTime / 2.0;
            } else {
                material.uniforms.uShineProgress.value = -1.0;
            }
        }
    });

    return (
        <points
            ref={points}
            position={[0, 1.8, -1.5]} // Above and behind podium
            rotation={[0.15, 0, 0]} // Slight tilt
        >
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={positions}
                    count={positions.length / 3}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aRandomPosition"
                    array={randomPositions}
                    count={randomPositions.length / 3}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aSize"
                    array={sizes}
                    count={sizes.length}
                    itemSize={1}
                />
            </bufferGeometry>
            <shaderMaterial args={[shaderArgs]} />
        </points>
    );
}
