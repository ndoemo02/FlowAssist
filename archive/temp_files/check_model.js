const fs = require('fs');
const glbPath = 'c:/FlowAssistant/public/virtual_studio_ver_02.glb';
const buffer = fs.readFileSync(glbPath);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonString = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonString);

const meshes = [];
gltf.meshes.forEach(mesh => {
    const primitive = mesh.primitives[0];
    if (primitive && primitive.attributes.POSITION !== undefined) {
        const accessor = gltf.accessors[primitive.attributes.POSITION];
        if (accessor && accessor.min && accessor.max) {
            const x = Math.abs(accessor.max[0] - accessor.min[0]);
            const y = Math.abs(accessor.max[1] - accessor.min[1]);
            const z = Math.abs(accessor.max[2] - accessor.min[2]);
            const dims = [x, y, z].sort((a, b) => b - a);
            const ratio = dims[0] / dims[1];
            if (ratio > 1.76 && ratio < 1.79) {
                console.log(`EXACT MATCH: ${mesh.name} | ${dims[0].toFixed(3)} x ${dims[1].toFixed(3)} | R: ${ratio.toFixed(4)}`);
            }
        }
    }
});
