'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface PearlProps {
  active: boolean;
}

export function PearlSphere({ active }: PearlProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = useRef(1);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Simulate audio reactivity when active
    if (active) {
       // Create a chaotic but smooth waveform simulation
       const noise = Math.sin(time * 20) * 0.1 + Math.cos(time * 35) * 0.05 + Math.sin(time * 10) * 0.1;
       const intensity = Math.max(0, noise); 
       targetScale.current = THREE.MathUtils.lerp(targetScale.current, 1 + intensity * 0.6, delta * 15);
       
       // Add some vibration/rotation speed up
       meshRef.current.rotation.z = Math.sin(time * 10) * 0.05;
    } else {
       targetScale.current = THREE.MathUtils.lerp(targetScale.current, 1, delta * 3);
       meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, delta * 2);
    }

    meshRef.current.scale.setScalar(targetScale.current);
    meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere args={[1.4, 128, 128]} ref={meshRef}>
          <meshPhysicalMaterial 
            color="#f0f8ff"
            emissive="#001010"
            roughness={0.12}
            metalness={0.2}
            iridescence={1}
            iridescenceIOR={1.4}
            iridescenceThicknessRange={[100, 600]}
            clearcoat={1}
            clearcoatRoughness={0.1}
            sheen={1}
            sheenRoughness={0.5}
            sheenColor="#ffffff"
          />
        </Sphere>
      </Float>
      
      <Sparkles count={60} scale={8} size={2} speed={0.4} opacity={0.3} color="#00f0ff" />
      
      {/* Environmental Lighting for the Pearl */}
      <Environment preset="studio" />
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 5]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={5} color="#00f0ff" distance={15} />
      <pointLight position={[5, -5, -5]} intensity={3} color="#ff4d00" distance={15} />
    </group>
  );
}
