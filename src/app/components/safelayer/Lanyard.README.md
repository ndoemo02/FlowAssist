# Lanyard Component - Spring Physics Badge

## Overview
Interactive 3D badge hanging from a spring-physics rope simulation.

## Features
- **Verlet Integration Physics** - Realistic rope dynamics (20 segments)
- **Interactive Dragging** - Mouse/pointer interaction with soft spring pull
- **Catmull-Rom Curves** - Smooth rope rendering
- **Badge Swing Animation** - Natural rotation based on velocity
- **Visual Design** - Glass card with "SECURE ACCESS GRANTED" text

## Technical Implementation

### Physics Engine
- **Algorithm**: Verlet Integration for rope cloth simulation
- **Gravity**: -9.81 m/s²
- **Damping**: 0.99 (air resistance)
- **Segments**: 20 points with distance constraints
- **Simulation**: 10 substeps per frame for stability

### Component Structure
```tsx
<Lanyard position={[x, y, z]} />
```

### Parameters
- `position`: `[number, number, number]` - Anchor point (default: `[0, 6, 0]`)

## Usage Example

```tsx
import Lanyard from '@/app/components/safelayer/Lanyard';

export default function Scene() {
  return (
    <Canvas>
      <Lanyard position={[2, 5, 0]} />
      {/* Other scene elements */}
    </Canvas>
  );
}
```

## Physics Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `SEGMENTS` | 20 | Number of rope points |
| `LENGTH` | 5.0 | Total rope length (meters) |
| `GRAVITY` | [0, -9.81, 0] | Gravitational acceleration |
| `DAMPING` | 0.99 | Velocity damping factor |
| `SIMULATION_STEPS` | 10 | Substeps per frame (stiffness) |

## Visual Components

### 1. Rope Thread
- **Rendering**: Catmull-Rom spline (smooth curve)
- **Material**: Semi-transparent gray (#aaaaaa, opacity: 0.5)

### 2. Metal Clip
- **Geometry**: Cylinder (diameter: 0.08m, height: 0.3m)
- **Material**: Metallic silver (#888, metalness: 1, roughness: 0.2)

### 3. Badge Card
- **Geometry**: Box (1.8 × 2.8 × 0.05 meters)
- **Material**: Glass (transmission: 0.8, clearcoat: 1.0)
- **Content**:
  - "SECURE" (white, 0.3 fontSize)
  - "ACCESS GRANTED" (cyan #00ffcc, 0.18 fontSize)
  - Gold chip visual (#d4af37)

## Interaction Behavior

### Mouse Events
- **Hover**: Cursor changes to `grab`, spring pull activates
- **Drag**: Soft spring force (20% pull strength)
- **Release**: Natural swing animation based on velocity

### Rotation Dynamics
- **Z-axis**: Follows rope tangent angle
- **Y-axis**: Horizontal velocity swing (×-2.0 multiplier)
- **X-axis**: Vertical velocity tilt (×2.0 multiplier)

## Performance Considerations

- **Physics Update**: ~10 substeps per frame
- **Geometry Update**: CatmullRom regeneration every frame
- **Optimization**: Memoized Point class instances
- **Delta Time Clamping**: Max 0.05s to prevent instability

## Future Enhancements

- [ ] Collision detection with scene objects
- [ ] Wind effect simulation
- [ ] Customizable badge content (text/image)
- [ ] Multiple lanyards with collision avoidance
- [ ] Cloth/fabric shader for realistic thread
- [ ] Audio feedback on swing/collision

## Dependencies

```json
{
  "@react-three/fiber": "^8.x.x",
  "@react-three/drei": "^9.x.x",
  "three": "^0.16x.x"
}
```

## License
Internal FlowAssist Component - Educational/Demo Use

---

**Status**: ✅ Production Ready  
**Created**: 2026-01  
**Location**: `src/app/components/safelayer/Lanyard.tsx`  
**Type**: Interactive 3D Component (Physics Simulation)
