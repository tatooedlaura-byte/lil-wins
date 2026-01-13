import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Graveyard starter template - custom designed haunted cemetery
const graveyardTemplate = [
    { q: -5, r: -5, tile: 'floor_dirt', building: 'post_skull' },
    { q: -4, r: -5, tile: 'floor_dirt', building: 'coffin_decorated' },
    { q: -2, r: -5, tile: 'floor_dirt', building: 'tree_A' },
    { q: 0, r: -5, tile: 'floor_dirt', building: 'tree_pine_yellow' },
    { q: 2, r: -5, tile: 'floor_dirt', building: 'grave_destroyed' },
    { q: 5, r: -5, tile: 'floor_dirt', building: 'tree_pine_orange' },
    { q: -3, r: -4, tile: 'floor_dirt', building: 'gravemarker_A' },
    { q: -1, r: -4, tile: 'floor_dirt', building: 'tree_C' },
    { q: 4, r: -4, tile: 'floor_dirt', building: 'pumpkin_small' },
    { q: -2, r: -3, tile: 'floor_dirt', building: 'path_A' },
    { q: -1, r: -3, tile: 'floor_dirt', building: 'path_A' },
    { q: 0, r: -3, tile: 'floor_dirt', building: 'path_A' },
    { q: 1, r: -3, tile: 'floor_dirt', building: 'path_A' },
    { q: 2, r: -3, tile: 'floor_dirt', building: 'path_A' },
    { q: 3, r: -3, tile: 'floor_dirt', building: 'path_A' },
    { q: 5, r: -3, tile: 'floor_dirt', building: 'shrine_sp' },
    { q: -5, r: -2, tile: 'floor_dirt', building: 'shrine' },
    { q: -3, r: -2, tile: 'floor_dirt', building: 'gravestone_sp' },
    { q: -2, r: -2, tile: 'floor_dirt', building: 'path_A' },
    { q: 2, r: -2, tile: 'floor_dirt', building: 'grave_destroyed' },
    { q: 3, r: -2, tile: 'floor_dirt', building: 'path_A' },
    { q: 5, r: -2, tile: 'floor_dirt', building: 'tree_A' },
    { q: -2, r: -1, tile: 'floor_dirt', building: 'path_A' },
    { q: 3, r: -1, tile: 'floor_dirt', building: 'path_A' },
    { q: 4, r: -1, tile: 'floor_dirt', building: 'gravemarker_B' },
    { q: 5, r: -1, tile: 'floor_dirt', building: 'coffin_A' },
    { q: -5, r: 0, tile: 'floor_dirt', building: 'shrine' },
    { q: -3, r: 0, tile: 'floor_dirt', building: 'tree_dead_medium' },
    { q: -2, r: 0, tile: 'floor_dirt', building: 'path_A' },
    { q: 0, r: 0, tile: 'floor_dirt', building: 'crypt' },
    { q: 2, r: 0, tile: 'floor_dirt', building: 'coffin_B' },
    { q: 3, r: 0, tile: 'floor_dirt', building: 'path_A' },
    { q: -4, r: 1, tile: 'floor_dirt', building: 'tree_A' },
    { q: -2, r: 1, tile: 'floor_dirt', building: 'path_A' },
    { q: 3, r: 1, tile: 'floor_dirt', building: 'path_A' },
    { q: 5, r: 1, tile: 'floor_dirt', building: 'tree_dead_medium' },
    { q: -4, r: 2, tile: 'floor_dirt', building: 'pumpkin_orange' },
    { q: -2, r: 2, tile: 'floor_dirt', building: 'path_A' },
    { q: -1, r: 2, tile: 'floor_dirt', building: 'post_lantern' },
    { q: 1, r: 2, tile: 'floor_dirt', building: 'bench' },
    { q: 2, r: 2, tile: 'floor_dirt', building: 'skull_candle' },
    { q: 3, r: 2, tile: 'floor_dirt', building: 'path_A' },
    { q: 4, r: 2, tile: 'floor_dirt', building: 'shrine_candles' },
    { q: -5, r: 3, tile: 'floor_dirt', building: 'gravemarker_A' },
    { q: -4, r: 3, tile: 'floor_dirt', building: 'grave_destroyed' },
    { q: -3, r: 3, tile: 'floor_dirt', building: 'gravemarker_B' },
    { q: -2, r: 3, tile: 'floor_dirt', building: 'path_A' },
    { q: -1, r: 3, tile: 'floor_dirt', building: 'path_A' },
    { q: 0, r: 3, tile: 'floor_dirt', building: 'path_A' },
    { q: 1, r: 3, tile: 'floor_dirt', building: 'path_A' },
    { q: 2, r: 3, tile: 'floor_dirt', building: 'path_A' },
    { q: 3, r: 3, tile: 'floor_dirt', building: 'path_A' },
    { q: 4, r: 3, tile: 'floor_dirt', building: 'tree_B' },
    { q: -5, r: 4, tile: 'floor_dirt', building: 'tree_pine_orange' },
    { q: -2, r: 4, tile: 'floor_dirt', building: 'grave_B' },
    { q: 0, r: 4, tile: 'floor_dirt', building: 'path_A' },
    { q: 2, r: 4, tile: 'floor_dirt', building: 'grave_A' },
    { q: 5, r: 4, tile: 'floor_dirt', building: 'tree_dead_decorated' },
    { q: -4, r: 5, tile: 'floor_dirt', building: 'fence' },
    { q: -2, r: 5, tile: 'floor_dirt', building: 'fence' },
    { q: 0, r: 5, tile: 'floor_dirt', building: 'arch_gate' },
    { q: 2, r: 5, tile: 'floor_dirt', building: 'fence' },
    { q: 4, r: 5, tile: 'floor_dirt', building: 'fence_broken' },
];

// Graveyard class - 3D spooky graveyard builder
class Graveyard {
    constructor(container) {
        this.container = container;
        this.hexes = [];
        this.models = {};
        this.gridRadius = 10;
        this.clock = new THREE.Clock();
        this.templateIndex = 0;

        this.gridSpacing = 2; // Match designer tileSize
        this.hexHeight = 0.1;

        this.init();
        this.loadModels();
    }

    init() {
        // Spooky dark scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0d0d1a); // Dark night sky
        this.scene.fog = new THREE.Fog(0x0d0d1a, 8, 30); // Creeping fog

        // Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(12, 15, 12);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 40;
        this.controls.maxPolarAngle = Math.PI / 2.2;

        // Spooky ambient with purple tint
        const ambientLight = new THREE.AmbientLight(0x6a5a8a, 0.5);
        this.scene.add(ambientLight);

        // Pale moonlight
        const moonLight = new THREE.DirectionalLight(0xaaaaff, 0.6);
        moonLight.position.set(-5, 15, -5);
        moonLight.castShadow = true;
        moonLight.shadow.mapSize.width = 2048;
        moonLight.shadow.mapSize.height = 2048;
        moonLight.shadow.camera.near = 0.5;
        moonLight.shadow.camera.far = 50;
        moonLight.shadow.camera.left = -15;
        moonLight.shadow.camera.right = 15;
        moonLight.shadow.camera.top = 15;
        moonLight.shadow.camera.bottom = -15;
        this.scene.add(moonLight);

        // Gray ground plane sized to match building grid
        const groundSize = 24; // Template is -5 to 5, gridSpacing 2 = ~22 units
        const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x3a3a3a,  // Dark gray, ominous
            roughness: 1.0,
            metalness: 0
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        ground.receiveShadow = true;
        this.scene.add(ground);

        window.addEventListener('resize', () => this.onResize());
        this.animate();
    }

    async loadModels() {
        this.loader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();

        // Load Halloween texture
        const texturePath = 'assets/kaykit/halloween/halloweenbits_texture.png';
        this.sharedTexture = await this.textureLoader.loadAsync(texturePath);
        this.sharedTexture.flipY = false;

        // Model definitions - Halloween and Spooktober assets
        this.modelDefs = {
            // Floor tiles
            floor_dirt: { path: 'assets/kaykit/halloween/floor_dirt.gltf', type: 'tile' },
            floor_dirt_grave: { path: 'assets/kaykit/halloween/floor_dirt_grave.gltf', type: 'tile' },
            floor_dirt_small: { path: 'assets/kaykit/halloween/floor_dirt_small.gltf', type: 'tile' },
            path_A: { path: 'assets/kaykit/halloween/path_A.gltf', type: 'tile' },
            path_B: { path: 'assets/kaykit/halloween/path_B.gltf', type: 'tile' },

            // Graves and crypts
            crypt: { path: 'assets/kaykit/halloween/crypt.gltf', type: 'building', name: 'Crypt' },
            grave_A: { path: 'assets/kaykit/halloween/grave_A.gltf', type: 'building', name: 'Grave' },
            grave_A_destroyed: { path: 'assets/kaykit/halloween/grave_A_destroyed.gltf', type: 'building', name: 'Ruined Grave' },
            grave_B: { path: 'assets/kaykit/halloween/grave_B.gltf', type: 'building', name: 'Grave' },
            gravestone: { path: 'assets/kaykit/halloween/gravestone.gltf', type: 'building', name: 'Gravestone' },
            gravemarker_A: { path: 'assets/kaykit/halloween/gravemarker_A.gltf', type: 'building', name: 'Grave Marker' },
            gravemarker_B: { path: 'assets/kaykit/halloween/gravemarker_B.gltf', type: 'building', name: 'Grave Marker' },
            coffin: { path: 'assets/kaykit/halloween/coffin.gltf', type: 'building', name: 'Coffin' },
            coffin_decorated: { path: 'assets/kaykit/halloween/coffin_decorated.gltf', type: 'building', name: 'Decorated Coffin' },

            // Fences and structures
            fence: { path: 'assets/kaykit/halloween/fence.gltf', type: 'decoration', name: 'Fence' },
            fence_broken: { path: 'assets/kaykit/halloween/fence_broken.gltf', type: 'decoration', name: 'Broken Fence' },
            fence_gate: { path: 'assets/kaykit/halloween/fence_gate.gltf', type: 'building', name: 'Fence Gate' },
            fence_pillar: { path: 'assets/kaykit/halloween/fence_pillar.gltf', type: 'decoration', name: 'Fence Pillar' },
            fence_pillar_broken: { path: 'assets/kaykit/halloween/fence_pillar_broken.gltf', type: 'decoration', name: 'Broken Pillar' },
            arch: { path: 'assets/kaykit/halloween/arch.gltf', type: 'building', name: 'Stone Arch' },
            arch_gate: { path: 'assets/kaykit/halloween/arch_gate.gltf', type: 'building', name: 'Gate Arch' },
            pillar: { path: 'assets/kaykit/halloween/pillar.gltf', type: 'decoration', name: 'Pillar' },

            // Shrines and decor
            shrine: { path: 'assets/kaykit/halloween/shrine.gltf', type: 'building', name: 'Shrine' },
            shrine_candles: { path: 'assets/kaykit/halloween/shrine_candles.gltf', type: 'building', name: 'Candle Shrine' },
            bench: { path: 'assets/kaykit/halloween/bench.gltf', type: 'decoration', name: 'Bench' },
            bench_decorated: { path: 'assets/kaykit/halloween/bench_decorated.gltf', type: 'decoration', name: 'Decorated Bench' },
            plaque: { path: 'assets/kaykit/halloween/plaque.gltf', type: 'decoration', name: 'Plaque' },
            plaque_candles: { path: 'assets/kaykit/halloween/plaque_candles.gltf', type: 'decoration', name: 'Candle Plaque' },

            // Candles and lights
            candle: { path: 'assets/kaykit/halloween/candle.gltf', type: 'decoration', name: 'Candle' },
            candle_melted: { path: 'assets/kaykit/halloween/candle_melted.gltf', type: 'decoration', name: 'Melted Candle' },
            candle_thin: { path: 'assets/kaykit/halloween/candle_thin.gltf', type: 'decoration', name: 'Thin Candle' },
            candle_triple: { path: 'assets/kaykit/halloween/candle_triple.gltf', type: 'decoration', name: 'Triple Candles' },
            lantern_standing: { path: 'assets/kaykit/halloween/lantern_standing.gltf', type: 'decoration', name: 'Lantern' },
            lantern_hanging: { path: 'assets/kaykit/halloween/lantern_hanging.gltf', type: 'decoration', name: 'Hanging Lantern' },
            post_lantern: { path: 'assets/kaykit/halloween/post_lantern.gltf', type: 'building', name: 'Lamp Post' },
            post_skull: { path: 'assets/kaykit/halloween/post_skull.gltf', type: 'building', name: 'Skull Post' },
            post: { path: 'assets/kaykit/halloween/post.gltf', type: 'decoration', name: 'Post' },

            // Bones and skulls
            skull: { path: 'assets/kaykit/halloween/skull.gltf', type: 'decoration', name: 'Skull' },
            skull_candle: { path: 'assets/kaykit/halloween/skull_candle.gltf', type: 'decoration', name: 'Skull with Candle' },
            bone_pile: { path: 'assets/kaykit/halloween/bone_A.gltf', type: 'decoration', name: 'Bones' },
            bone_B: { path: 'assets/kaykit/halloween/bone_B.gltf', type: 'decoration', name: 'Bones' },
            bone_C: { path: 'assets/kaykit/halloween/bone_C.gltf', type: 'decoration', name: 'Bones' },
            ribcage: { path: 'assets/kaykit/halloween/ribcage.gltf', type: 'decoration', name: 'Ribcage' },

            // Pumpkins
            pumpkin_orange: { path: 'assets/kaykit/halloween/pumpkin_orange.gltf', type: 'decoration', name: 'Pumpkin' },
            pumpkin_jacko: { path: 'assets/kaykit/halloween/pumpkin_orange_jackolantern.gltf', type: 'decoration', name: 'Jack-o-Lantern' },
            pumpkin_small: { path: 'assets/kaykit/halloween/pumpkin_orange_small.gltf', type: 'decoration', name: 'Small Pumpkin' },
            pumpkin_yellow: { path: 'assets/kaykit/halloween/pumpkin_yellow.gltf', type: 'decoration', name: 'Yellow Pumpkin' },
            pumpkin_yellow_jacko: { path: 'assets/kaykit/halloween/pumpkin_yellow_jackolantern.gltf', type: 'decoration', name: 'Yellow Jack-o-Lantern' },

            // Trees
            tree_dead_large: { path: 'assets/kaykit/halloween/tree_dead_large.gltf', type: 'decoration', name: 'Dead Tree' },
            tree_dead_large_decorated: { path: 'assets/kaykit/halloween/tree_dead_large_decorated.gltf', type: 'decoration', name: 'Spooky Tree' },
            tree_dead_medium: { path: 'assets/kaykit/halloween/tree_dead_medium.gltf', type: 'decoration', name: 'Dead Tree' },
            tree_dead_small: { path: 'assets/kaykit/halloween/tree_dead_small.gltf', type: 'decoration', name: 'Dead Sapling' },
            tree_pine_orange: { path: 'assets/kaykit/halloween/tree_pine_orange_large.gltf', type: 'decoration', name: 'Autumn Pine' },
            tree_pine_yellow: { path: 'assets/kaykit/halloween/tree_pine_yellow_large.gltf', type: 'decoration', name: 'Yellow Pine' },

            // Spooktober extras
            cauldron: { path: 'assets/kaykit/spooktober/cauldron.gltf.glb', type: 'building', name: 'Cauldron' },
            jackolantern_big: { path: 'assets/kaykit/spooktober/jackolantern_big.gltf.glb', type: 'decoration', name: 'Big Jack-o-Lantern' },
            jackolantern_small: { path: 'assets/kaykit/spooktober/jackolantern_small.gltf.glb', type: 'decoration', name: 'Small Jack-o-Lantern' },
            candyBucket: { path: 'assets/kaykit/spooktober/candyBucket.gltf.glb', type: 'decoration', name: 'Candy Bucket' },
            candyBag: { path: 'assets/kaykit/spooktober/candyBag.gltf.glb', type: 'decoration', name: 'Candy Bag' },
            lollipopA: { path: 'assets/kaykit/spooktober/lollipopA.gltf.glb', type: 'decoration', name: 'Lollipop' },
            lollipopB: { path: 'assets/kaykit/spooktober/lollipopB.gltf.glb', type: 'decoration', name: 'Lollipop' },

            // Spooktober trees, shrines, coffins
            tree_A: { path: 'assets/kaykit/spooktober/treeA_graveyard.gltf.glb', type: 'decoration', name: 'Spooky Tree' },
            tree_B: { path: 'assets/kaykit/spooktober/treeB_graveyard.gltf.glb', type: 'decoration', name: 'Spooky Tree' },
            tree_C: { path: 'assets/kaykit/spooktober/treeC_graveyard.gltf.glb', type: 'decoration', name: 'Spooky Tree' },
            shrine_sp: { path: 'assets/kaykit/spooktober/shrine.gltf.glb', type: 'building', name: 'Shrine' },
            gravestone_sp: { path: 'assets/kaykit/spooktober/gravestone.gltf.glb', type: 'building', name: 'Gravestone' },
            coffin_A: { path: 'assets/kaykit/spooktober/coffinA_top.gltf.glb', type: 'building', name: 'Coffin' },
            coffin_B: { path: 'assets/kaykit/spooktober/coffinB_top.gltf.glb', type: 'building', name: 'Coffin' },
            grave_destroyed: { path: 'assets/kaykit/halloween/grave_A_destroyed.gltf', type: 'building', name: 'Ruined Grave' },
            tree_dead_decorated: { path: 'assets/kaykit/halloween/tree_dead_large_decorated.gltf', type: 'decoration', name: 'Decorated Dead Tree' },
        };

        // Pre-load dirt floor
        await this.loadModel('floor_dirt');

        console.log('Graveyard initialized');
        this.loaded = true;
    }

    async loadModel(modelId) {
        if (this.models[modelId]) return this.models[modelId];

        const def = this.modelDefs[modelId];
        if (!def) {
            console.warn(`Unknown model: ${modelId}`);
            return null;
        }

        try {
            const gltf = await this.loader.loadAsync(def.path);
            const model = gltf.scene;

            model.traverse((child) => {
                if (child.isMesh) {
                    // Use shared texture for halloween assets
                    if (!def.path.includes('spooktober')) {
                        child.material = new THREE.MeshStandardMaterial({
                            map: this.sharedTexture,
                            roughness: 0.8,
                            metalness: 0.1,
                        });
                    }
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            this.models[modelId] = model;
            return model;
        } catch (e) {
            console.warn(`Failed to load model ${modelId}:`, e);
            return null;
        }
    }

    hexToWorld(q, r) {
        // Square grid - matches the designer layout
        const x = this.gridSpacing * q;
        const z = this.gridSpacing * r;
        return { x, z };
    }

    hexKey(q, r) {
        return `${q},${r}`;
    }

    getHexDirections() {
        return [
            { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
            { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 },
        ];
    }

    getHexAt(q, r) {
        return this.hexes.find(h => h.q === q && h.r === r);
    }

    hexDistance(q, r) {
        return Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r));
    }

    getZone(q, r) {
        const dist = this.hexDistance(q, r);
        if (dist === 0) return 'center';
        if (dist <= 2) return 'graveyard';
        if (dist <= 4) return 'fence';
        return 'forest';
    }

    findNextHexSpiral() {
        const occupied = new Set(this.hexes.map(h => this.hexKey(h.q, h.r)));
        if (this.hexes.length === 0) return { q: 0, r: 0 };

        // Spiral outward from center, filling each ring in order
        for (let ring = 0; ring <= this.gridRadius; ring++) {
            const hexesInRing = this.getHexRing(ring);

            // Return the first empty hex in this ring (in order)
            for (const hex of hexesInRing) {
                if (!occupied.has(this.hexKey(hex.q, hex.r))) {
                    return hex;
                }
            }
        }
        return null;
    }

    getHexRing(ring) {
        if (ring === 0) return [{ q: 0, r: 0 }];

        const results = [];

        // Directions to walk around the ring (in order)
        const walkDirections = [
            { q: 1, r: 0 },   // East
            { q: 0, r: 1 },   // Southeast
            { q: -1, r: 1 },  // Southwest
            { q: -1, r: 0 },  // West
            { q: 0, r: -1 },  // Northwest
            { q: 1, r: -1 }, // Northeast
        ];

        // Start at "north" position of the ring
        let q = 0, r = -ring;

        for (let side = 0; side < 6; side++) {
            const dir = walkDirections[side];
            for (let step = 0; step < ring; step++) {
                results.push({ q, r });
                q += dir.q;
                r += dir.r;
            }
        }

        return results;
    }

    async placeHex(q, r, tileType, buildingType = null) {
        const pos = this.hexToWorld(q, r);
        const modelScale = 1; // Match designer scale

        let placedTile = null;
        const tileModel = await this.loadModel(tileType);
        if (tileModel) {
            placedTile = tileModel.clone();
            placedTile.position.set(pos.x, 0, pos.z);
            placedTile.scale.setScalar(modelScale);
            this.scene.add(placedTile);
        }

        let building = null;
        if (buildingType) {
            const buildingModel = await this.loadModel(buildingType);
            if (buildingModel) {
                building = buildingModel.clone();
                building.position.set(pos.x, 0, pos.z);
                building.scale.setScalar(modelScale);
                // No random rotation - keep original orientation from designer
                this.scene.add(building);
            }
        }

        this.hexes.push({
            q, r, tileType, buildingType,
            tileModel: placedTile, building,
        });

        return { q, r, buildingType };
    }

    weightedRandom(items, weights) {
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let rand = Math.random() * totalWeight;
        for (let i = 0; i < items.length; i++) {
            rand -= weights[i];
            if (rand <= 0) return items[i];
        }
        return items[0];
    }

    getBuildingForZone(zone) {
        switch (zone) {
            case 'center':
                return { tile: 'floor_dirt_grave', building: 'crypt' };

            case 'graveyard':
                const graves = ['grave_A', 'grave_B', 'gravestone', 'gravemarker_A', 'gravemarker_B',
                               'coffin', 'skull_candle', 'candle_triple', 'lantern_standing'];
                const graveWeights = [4, 4, 3, 2, 2, 2, 2, 2, 2];
                return { tile: 'floor_dirt', building: this.weightedRandom(graves, graveWeights) };

            case 'fence':
                const fenceItems = ['fence', 'fence_broken', 'fence_gate', 'fence_pillar', 'tree_dead_medium',
                                   'pumpkin_jacko', 'shrine', 'post_skull', 'arch'];
                const fenceWeights = [4, 3, 2, 2, 3, 3, 2, 2, 1];
                return { tile: 'floor_dirt', building: this.weightedRandom(fenceItems, fenceWeights) };

            case 'forest':
            default:
                const forestItems = ['tree_dead_large', 'tree_dead_large_decorated', 'tree_pine_orange', 'tree_pine_yellow',
                                    'pumpkin_orange', 'pumpkin_yellow', 'cauldron', 'jackolantern_big', 'candyBucket',
                                    'bone_pile', 'ribcage', null];
                const forestWeights = [4, 3, 3, 3, 2, 2, 2, 2, 1, 2, 1, 3];
                return { tile: 'floor_dirt', building: this.weightedRandom(forestItems, forestWeights) };
        }
    }

    async grow(habitName = null) {
        // Use template if available
        if (this.templateIndex < graveyardTemplate.length) {
            const item = graveyardTemplate[this.templateIndex];
            this.templateIndex++;
            await this.placeHex(item.q, item.r, item.tile, item.building);
            const worldPos = this.hexToWorld(item.q, item.r);
            this.panToPosition(worldPos.x, worldPos.z);

            if (item.building && this.modelDefs[item.building]) {
                return {
                    type: this.modelDefs[item.building].type,
                    name: this.modelDefs[item.building].name,
                    position: { q: item.q, r: item.r, x: worldPos.x, z: worldPos.z },
                };
            }
            return { type: 'tile', name: 'Haunted Ground', position: { q: item.q, r: item.r } };
        }

        // After template, grow randomly
        const spot = this.findNextHexSpiral();
        if (!spot) return null;

        const zone = this.getZone(spot.q, spot.r);
        const zoneConfig = this.getBuildingForZone(zone);

        await this.placeHex(spot.q, spot.r, zoneConfig.tile, zoneConfig.building);
        const worldPos = this.hexToWorld(spot.q, spot.r);
        this.panToPosition(worldPos.x, worldPos.z);

        const hex = this.getHexAt(spot.q, spot.r);
        if (hex && habitName) hex.habitName = habitName;

        if (zoneConfig.building && this.modelDefs[zoneConfig.building]) {
            return {
                type: this.modelDefs[zoneConfig.building].type,
                name: this.modelDefs[zoneConfig.building].name,
                position: { q: spot.q, r: spot.r, x: worldPos.x, z: worldPos.z },
            };
        }
        return { type: 'tile', name: 'Haunted Ground', position: { q: spot.q, r: spot.r } };
    }

    panToPosition(x, z) {
        const startTarget = this.controls.target.clone();
        const startTime = Date.now();
        const duration = 800;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            this.controls.target.x = startTarget.x + (x - startTarget.x) * ease;
            this.controls.target.z = startTarget.z + (z - startTarget.z) * ease;
            if (t < 1) requestAnimationFrame(animate);
        };
        animate();
    }

    getStats() {
        const buildings = this.hexes.filter(h => h.buildingType &&
            this.modelDefs[h.buildingType]?.type === 'building').length;
        return { buildings, tiles: this.hexes.length };
    }

    save() {
        const data = {
            hexes: this.hexes.map(h => ({
                q: h.q, r: h.r, tileType: h.tileType, buildingType: h.buildingType,
                habitName: h.habitName || null,
            })),
            templateIndex: this.templateIndex,
        };
        localStorage.setItem('tinyHabitsGraveyard', JSON.stringify(data));
    }

    async load() {
        const saved = localStorage.getItem('tinyHabitsGraveyard');
        if (!saved) return false;

        try {
            const data = JSON.parse(saved);
            this.templateIndex = data.templateIndex || 0;
            for (const hexData of data.hexes) {
                await this.placeHex(hexData.q, hexData.r, hexData.tileType, hexData.buildingType);
                if (hexData.habitName) {
                    const hex = this.getHexAt(hexData.q, hexData.r);
                    if (hex) hex.habitName = hexData.habitName;
                }
            }
            return true;
        } catch (e) {
            console.warn('Failed to load graveyard:', e);
            return false;
        }
    }

    onResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

window.Graveyard = Graveyard;
