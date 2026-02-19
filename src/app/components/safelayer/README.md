# FlowAssist - Protected Core Components

This directory contains critical, high-value components that demonstrate advanced techniques and should **NOT** be moved or deleted during cleanup operations.

## 🔒 Protected Components

### 1. **Lanyard.tsx** - Spring Physics Badge Simulation
**Status**: ✅ **PROTECTED** - Do not archive  
**Type**: Physics Simulation (Verlet Integration)  
**Value**: Educational demo of advanced 3D physics

**Features**:
- Realistic rope dynamics with 20-segment Verlet integration
- Interactive mouse dragging with soft spring forces
- Velocity-based rotation and swing animations
- Glass badge with "SECURE ACCESS GRANTED" visuals

**Documentation**: See [`Lanyard.README.md`](./Lanyard.README.md)

---

### 2. **StatusPearl.tsx** - Pearl Material Status Indicator
**Status**: ✅ **PROTECTED** - Production component  
**Type**: Material Visualization + Status Management  

**Features**:
- MeshPhysicalMaterial with clearcoat (pearl effect)
- SafeLayerStatus integration
- Real-time status color changes
- Used in Carbon Dashboard

---

### 3. **ErrorAlertMaterial.tsx** - Error Flash Visualization
**Status**: ✅ **PROTECTED** - Production component  
**Type**: Visual Error Signaling  

**Features**:
- Pulsing red flash on system errors
- Integrated with SafeLayer error states
- Non-blocking visual alert

---

## ⚠️ Archive Automation Rules

**DO NOT MOVE/DELETE:**
- `safelayer/Lanyard.tsx`
- `safelayer/Lanyard.README.md`
- `safelayer/StatusPearl.tsx`
- `safelayer/ErrorAlertMaterial.tsx`

**Reason**: These components represent:
1. Advanced physics demonstrations (educational value)
2. Active production dependencies (used in dashboards)
3. Future integration opportunities (planned features)

---

## 📂 Directory Structure

```
src/app/components/safelayer/
├── Lanyard.tsx              # Spring physics badge (PROTECTED)
├── Lanyard.README.md        # Component documentation
├── StatusPearl.tsx          # Pearl material status (PROTECTED)
├── ErrorAlertMaterial.tsx   # Error flash visual (PROTECTED)
└── README.md                # This file
```

---

## 🔗 Integration Points

### Carbon Dashboard (`/carbon`)
- Uses: `StatusPearl`, `ErrorAlertMaterial`
- Status: Active

### Future Integrations
- **Lanyard**: Planned for security badge demos, access control UI
- **StatusPearl**: Status indicators across dashboards
- **ErrorFlash**: Global error visualization layer

---

## 🛡️ Preservation Policy

**Category**: Core Experiential Components  
**Protection Level**: High  
**Rationale**: Demonstrates advanced Three.js techniques (physics, materials, interactions) that serve as:
- Technical reference implementations
- Future feature foundations
- Educational examples for team

---

**Last Updated**: 2026-02-11  
**Maintainer**: System Architect  
**Review Frequency**: Quarterly
