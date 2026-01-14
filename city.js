import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// City template - pre-designed layout with city and forest assets
const cityTemplate = [
  { x: -5, y: -5, file: "Tree_2_E_Color1.gltf", path: "forest", rotation: 0 },
  { x: -4, y: -5, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: -3, y: -5, file: "building_B.gltf", path: "city", rotation: 0 },
  { x: -2, y: -5, file: "building_D.gltf", path: "city", rotation: 0 },
  { x: -1, y: -5, file: "Tree_4_A_Color1.gltf", path: "forest", rotation: 0 },
  { x: 0, y: -5, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 1, y: -5, file: "building_F.gltf", path: "city", rotation: 0 },
  { x: 2, y: -5, file: "building_C.gltf", path: "city", rotation: 0 },
  { x: 3, y: -5, file: "building_B.gltf", path: "city", rotation: 0 },
  { x: 4, y: -5, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 5, y: -5, file: "Tree_2_C_Color1.gltf", path: "forest", rotation: 0 },
  { x: -5, y: -4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: -4, y: -4, file: "road_junction.gltf", path: "city", rotation: 0 },
  { x: -3, y: -4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: -2, y: -4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: -1, y: -4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: 0, y: -4, file: "road_junction.gltf", path: "city", rotation: 0 },
  { x: 1, y: -4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: 2, y: -4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: 3, y: -4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: 4, y: -4, file: "road_junction.gltf", path: "city", rotation: 0 },
  { x: 5, y: -4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: -5, y: -3, file: "building_B.gltf", path: "city", rotation: 90 },
  { x: -4, y: -3, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: -3, y: -3, file: "building_D.gltf", path: "city", rotation: 180 },
  { x: -2, y: -3, file: "building_H.gltf", path: "city", rotation: 180 },
  { x: -1, y: -3, file: "building_C.gltf", path: "city", rotation: 180 },
  { x: 0, y: -3, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 1, y: -3, file: "building_F.gltf", path: "city", rotation: 180 },
  { x: 2, y: -3, file: "building_B.gltf", path: "city", rotation: 180 },
  { x: 3, y: -3, file: "building_D.gltf", path: "city", rotation: 180 },
  { x: 4, y: -3, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 5, y: -3, file: "building_E.gltf", path: "city", rotation: 270 },
  { x: -5, y: -2, file: "building_D.gltf", path: "city", rotation: 90 },
  { x: -4, y: -2, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: -3, y: -2, file: "building_H.gltf", path: "city", rotation: 270 },
  { x: -2, y: -2, file: "Tree_3_A_Color1.gltf", path: "forest", rotation: 0 },
  { x: -1, y: -2, file: "building_D.gltf", path: "city", rotation: 90 },
  { x: 0, y: -2, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 1, y: -2, file: "building_C.gltf", path: "city", rotation: 270 },
  { x: 2, y: -2, file: "Tree_4_A_Color1.gltf", path: "forest", rotation: 0 },
  { x: 3, y: -2, file: "building_E.gltf", path: "city", rotation: 90 },
  { x: 4, y: -2, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 5, y: -2, file: "building_B.gltf", path: "city", rotation: 270 },
  { x: -5, y: -1, file: "building_F.gltf", path: "city", rotation: 90 },
  { x: -4, y: -1, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: -3, y: -1, file: "building_F.gltf", path: "city", rotation: 0 },
  { x: -2, y: -1, file: "building_G.gltf", path: "city", rotation: 0 },
  { x: -1, y: -1, file: "building_A.gltf", path: "city", rotation: 0 },
  { x: 0, y: -1, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 1, y: -1, file: "building_E.gltf", path: "city", rotation: 0 },
  { x: 2, y: -1, file: "building_C.gltf", path: "city", rotation: 0 },
  { x: 3, y: -1, file: "Tree_4_C_Color1.gltf", path: "forest", rotation: 0 },
  { x: 4, y: -1, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 5, y: -1, file: "building_A.gltf", path: "city", rotation: 270 },
  { x: -5, y: 0, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: -4, y: 0, file: "road_junction.gltf", path: "city", rotation: 0 },
  { x: -3, y: 0, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: -2, y: 0, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: -1, y: 0, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: 0, y: 0, file: "road_junction.gltf", path: "city", rotation: 0 },
  { x: 1, y: 0, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: 2, y: 0, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: 3, y: 0, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: 4, y: 0, file: "road_junction.gltf", path: "city", rotation: 0 },
  { x: 5, y: 0, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: -5, y: 1, file: "building_C.gltf", path: "city", rotation: 90 },
  { x: -4, y: 1, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: -3, y: 1, file: "building_F.gltf", path: "city", rotation: 270 },
  { x: -2, y: 1, file: "building_C.gltf", path: "city", rotation: 180 },
  { x: -1, y: 1, file: "building_E.gltf", path: "city", rotation: 180 },
  { x: 0, y: 1, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 1, y: 1, file: "building_H.gltf", path: "city", rotation: 180 },
  { x: 2, y: 1, file: "building_D.gltf", path: "city", rotation: 180 },
  { x: 3, y: 1, file: "building_G.gltf", path: "city", rotation: 180 },
  { x: 4, y: 1, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 5, y: 1, file: "building_F.gltf", path: "city", rotation: 270 },
  { x: -5, y: 2, file: "building_G.gltf", path: "city", rotation: 90 },
  { x: -4, y: 2, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: -3, y: 2, file: "building_E.gltf", path: "city", rotation: 270 },
  { x: -2, y: 2, file: "Tree_1_B_Color1.gltf", path: "forest", rotation: 0 },
  { x: -1, y: 2, file: "building_A.gltf", path: "city", rotation: 90 },
  { x: 0, y: 2, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 1, y: 2, file: "building_E.gltf", path: "city", rotation: 270 },
  { x: 2, y: 2, file: "Tree_1_A_Color1.gltf", path: "forest", rotation: 0 },
  { x: 3, y: 2, file: "building_E.gltf", path: "city", rotation: 90 },
  { x: 4, y: 2, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 5, y: 2, file: "Grass_1_C_Color1.gltf", path: "forest", rotation: 0 },
  { x: -5, y: 3, file: "building_B.gltf", path: "city", rotation: 90 },
  { x: -4, y: 3, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: -3, y: 3, file: "building_G.gltf", path: "city", rotation: 0 },
  { x: -2, y: 3, file: "building_D.gltf", path: "city", rotation: 0 },
  { x: -1, y: 3, file: "building_C.gltf", path: "city", rotation: 90 },
  { x: 0, y: 3, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 1, y: 3, file: "building_C.gltf", path: "city", rotation: 0 },
  { x: 2, y: 3, file: "building_A.gltf", path: "city", rotation: 0 },
  { x: 3, y: 3, file: "building_B.gltf", path: "city", rotation: 0 },
  { x: 4, y: 3, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 5, y: 3, file: "building_F.gltf", path: "city", rotation: 270 },
  { x: -5, y: 4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: -4, y: 4, file: "road_junction.gltf", path: "city", rotation: 0 },
  { x: -3, y: 4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: -2, y: 4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: -1, y: 4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: 0, y: 4, file: "road_junction.gltf", path: "city", rotation: 0 },
  { x: 1, y: 4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: 2, y: 4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: 3, y: 4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: 4, y: 4, file: "road_junction.gltf", path: "city", rotation: 0 },
  { x: 5, y: 4, file: "road_straight.gltf", path: "city", rotation: 90 },
  { x: -5, y: 5, file: "building_F.gltf", path: "city", rotation: 90 },
  { x: -4, y: 5, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: -3, y: 5, file: "building_C.gltf", path: "city", rotation: 180 },
  { x: -2, y: 5, file: "Tree_2_B_Color1.gltf", path: "forest", rotation: 0 },
  { x: -1, y: 5, file: "building_D.gltf", path: "city", rotation: 180 },
  { x: 0, y: 5, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 1, y: 5, file: "building_E.gltf", path: "city", rotation: 180 },
  { x: 2, y: 5, file: "building_C.gltf", path: "city", rotation: 180 },
  { x: 3, y: 5, file: "Tree_2_C_Color1.gltf", path: "forest", rotation: 0 },
  { x: 4, y: 5, file: "road_straight.gltf", path: "city", rotation: 0 },
  { x: 5, y: 5, file: "Tree_4_C_Color1.gltf", path: "forest", rotation: 0 },
];

// City class - builds a proper city with road grid and buildings
class City {
    constructor(container) {
        this.container = container;
        this.grid = new Map(); // "x,y" -> tile data
        this.models = {};
        this.tileSize = 2; // Each tile is 2x2 units
        this.blockSize = 3; // Buildings in 3x3 blocks
        this.gridRadius = 5; // City extends this many tiles from center (matches template)
        this.mixers = [];
        this.clock = new THREE.Clock();
        this.growthOrder = []; // Track order to grow city
        this.templateIndex = 0; // Track which template item to place next

        this.init();
        this.loadModels();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);

        // Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(20, 25, 20);
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
        this.controls.minDistance = 3;
        this.controls.maxDistance = 60;
        this.controls.maxPolarAngle = Math.PI / 2.2;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(15, 30, 15);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 100;
        dirLight.shadow.camera.left = -30;
        dirLight.shadow.camera.right = 30;
        dirLight.shadow.camera.top = 30;
        dirLight.shadow.camera.bottom = -30;
        this.scene.add(dirLight);

        // Ground plane - grass green base for the city
        const groundSize = (this.gridRadius * 2 + 1) * this.tileSize + 4; // Slightly larger than grid
        const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x4a7c4e }); // Grass green
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

        // Load texture
        const texturePath = 'assets/kaykit/city/citybits_texture.png';
        this.sharedTexture = await this.textureLoader.loadAsync(texturePath);
        this.sharedTexture.flipY = false;

        // Model paths
        this.modelPaths = {
            // Roads (all have integrated bases)
            road_straight: 'assets/kaykit/city/road_straight.gltf',
            road_corner: 'assets/kaykit/city/road_corner.gltf',
            road_tsplit: 'assets/kaykit/city/road_tsplit.gltf',
            road_junction: 'assets/kaykit/city/road_junction.gltf',

            // Buildings (with base - standalone)
            building_A: 'assets/kaykit/city/building_A.gltf',
            building_B: 'assets/kaykit/city/building_B.gltf',
            building_C: 'assets/kaykit/city/building_C.gltf',
            building_D: 'assets/kaykit/city/building_D.gltf',
            building_E: 'assets/kaykit/city/building_E.gltf',
            building_F: 'assets/kaykit/city/building_F.gltf',
            building_G: 'assets/kaykit/city/building_G.gltf',
            building_H: 'assets/kaykit/city/building_H.gltf',

            // Decorations
            bush: 'assets/kaykit/city/bush.gltf',
            bench: 'assets/kaykit/city/bench.gltf',
            streetlight: 'assets/kaykit/city/streetlight.gltf',
            firehydrant: 'assets/kaykit/city/firehydrant.gltf',
            trash_A: 'assets/kaykit/city/trash_A.gltf',
            dumpster: 'assets/kaykit/city/dumpster.gltf',

            // Vehicles
            car_sedan: 'assets/kaykit/city/car_sedan.gltf',
            car_taxi: 'assets/kaykit/city/car_taxi.gltf',
            car_police: 'assets/kaykit/city/car_police.gltf',
        };

        // Building tiers by size
        this.buildingTiers = {
            small: ['building_A', 'building_B'],
            medium: ['building_C', 'building_D'],
            large: ['building_E', 'building_F'],
            skyscraper: ['building_G', 'building_H'],
        };

        // Precompute growth order - spiral out from center
        this.computeGrowthOrder();

        console.log('City initialized');
        this.loaded = true;

        // Sort template by distance from center for spiral growth effect
        this.sortedTemplate = [...cityTemplate].sort((a, b) => {
            const distA = Math.max(Math.abs(a.x), Math.abs(a.y));
            const distB = Math.max(Math.abs(b.x), Math.abs(b.y));
            return distA - distB;
        });
    }

    // Compute spiral growth order from center
    computeGrowthOrder() {
        this.growthOrder = [];
        const maxDist = this.gridRadius;

        // Add positions in order of distance from center
        for (let dist = 0; dist <= maxDist; dist++) {
            for (let x = -dist; x <= dist; x++) {
                for (let y = -dist; y <= dist; y++) {
                    if (Math.max(Math.abs(x), Math.abs(y)) === dist) {
                        this.growthOrder.push({ x, y });
                    }
                }
            }
        }
    }

    async loadModel(modelId) {
        if (this.models[modelId]) return this.models[modelId];

        const path = this.modelPaths[modelId];
        if (!path) {
            console.warn(`Unknown model: ${modelId}`);
            return null;
        }

        try {
            const gltf = await this.loader.loadAsync(path);
            const model = gltf.scene;

            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        map: this.sharedTexture,
                        roughness: 0.8,
                        metalness: 0.1,
                    });
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            this.models[modelId] = model;
            return model;
        } catch (e) {
            console.warn(`Failed to load ${modelId}:`, e);
            return null;
        }
    }

    // Load model by file path (for template-based loading)
    async loadModelByPath(file, assetPath = 'city') {
        const cacheKey = `${assetPath}/${file}`;
        if (this.models[cacheKey]) return this.models[cacheKey];

        const fullPath = `assets/kaykit/${assetPath}/${file}`;

        try {
            const gltf = await this.loader.loadAsync(fullPath);
            const model = gltf.scene;

            model.traverse((child) => {
                if (child.isMesh) {
                    // Only apply city texture to city assets
                    if (assetPath === 'city') {
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

            this.models[cacheKey] = model;
            return model;
        } catch (e) {
            console.warn(`Failed to load ${fullPath}:`, e);
            return null;
        }
    }

    key(x, y) {
        return `${x},${y}`;
    }

    worldPos(x, y) {
        return {
            x: x * this.tileSize,
            z: y * this.tileSize
        };
    }

    // Check if a position should be a road
    isRoadPosition(x, y) {
        // Roads every (blockSize + 1) tiles, creating a grid
        const spacing = this.blockSize + 1; // 4
        return (x % spacing === 0) || (y % spacing === 0);
    }

    // Check if position is at a road intersection
    isIntersection(x, y) {
        const spacing = this.blockSize + 1;
        return (x % spacing === 0) && (y % spacing === 0);
    }

    // Get adjacent tiles that are roads
    getAdjacentRoads(x, y) {
        const dirs = [
            { dx: 1, dy: 0, bit: 0 },  // East
            { dx: 0, dy: -1, bit: 1 }, // North
            { dx: -1, dy: 0, bit: 2 }, // West
            { dx: 0, dy: 1, bit: 3 },  // South
        ];

        const adjacent = [];
        for (const dir of dirs) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            const tile = this.grid.get(this.key(nx, ny));
            if (tile && tile.type === 'road') {
                adjacent.push(dir.bit);
            }
        }
        return adjacent;
    }

    // Determine road model and rotation based on connections
    // Adding 90 degrees (Math.PI/2) to all rotations to fix alignment
    getRoadConfig(connections) {
        const count = connections.length;
        const offset = Math.PI / 2; // 90 degree offset

        if (count === 0) {
            return { model: 'road_straight', rotation: offset };
        }
        if (count === 1) {
            // Dead end - point toward connection
            return { model: 'road_straight', rotation: connections[0] * (Math.PI / 2) + offset };
        }
        if (count === 2) {
            const [a, b] = connections.sort((x, y) => x - y);
            if (b - a === 2) {
                // Straight (opposite sides)
                return { model: 'road_straight', rotation: a * (Math.PI / 2) + offset };
            } else {
                // Corner - rotation based on which corner
                // Connections are: 0=E, 1=N, 2=W, 3=S
                if (a === 0 && b === 1) return { model: 'road_corner', rotation: Math.PI + offset }; // NE
                if (a === 1 && b === 2) return { model: 'road_corner', rotation: Math.PI / 2 + offset }; // NW
                if (a === 2 && b === 3) return { model: 'road_corner', rotation: 0 + offset }; // SW
                if (a === 0 && b === 3) return { model: 'road_corner', rotation: -Math.PI / 2 + offset }; // SE
                return { model: 'road_corner', rotation: a * (Math.PI / 2) + offset };
            }
        }
        if (count === 3) {
            // T-split - find the missing direction
            const all = [0, 1, 2, 3];
            const missing = all.find(d => !connections.includes(d));
            return { model: 'road_tsplit', rotation: (missing + 2) * (Math.PI / 2) + offset };
        }
        // 4-way junction
        return { model: 'road_junction', rotation: offset };
    }

    async placeRoad(x, y) {
        const k = this.key(x, y);
        if (this.grid.has(k)) return null;

        const connections = this.getAdjacentRoads(x, y);
        const { model: modelId, rotation } = this.getRoadConfig(connections);

        const model = await this.loadModel(modelId);
        if (!model) return null;

        const pos = this.worldPos(x, y);
        const mesh = model.clone();
        mesh.position.set(pos.x, 0, pos.z);
        mesh.rotation.y = rotation;
        this.scene.add(mesh);

        this.grid.set(k, {
            type: 'road',
            modelId,
            mesh,
            rotation,
            x, y
        });

        // Update adjacent roads to reconnect properly
        await this.updateAdjacentRoads(x, y);

        return { type: 'road', name: 'Road' };
    }

    async updateAdjacentRoads(x, y) {
        const dirs = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: -1 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
        ];

        for (const dir of dirs) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            const tile = this.grid.get(this.key(nx, ny));

            if (tile && tile.type === 'road') {
                const connections = this.getAdjacentRoads(nx, ny);
                const { model: modelId, rotation } = this.getRoadConfig(connections);

                // Only update if model or rotation changed
                if (modelId !== tile.modelId || rotation !== tile.rotation) {
                    this.scene.remove(tile.mesh);

                    const model = await this.loadModel(modelId);
                    if (model) {
                        const pos = this.worldPos(nx, ny);
                        const mesh = model.clone();
                        mesh.position.set(pos.x, 0, pos.z);
                        mesh.rotation.y = rotation;
                        this.scene.add(mesh);

                        tile.modelId = modelId;
                        tile.mesh = mesh;
                        tile.rotation = rotation;
                    }
                }
            }
        }
    }

    async placeBuilding(x, y, modelId) {
        const k = this.key(x, y);
        if (this.grid.has(k)) return null;

        const model = await this.loadModel(modelId);
        if (!model) return null;

        const pos = this.worldPos(x, y);
        const mesh = model.clone();
        mesh.position.set(pos.x, 0, pos.z);
        // Random rotation in 90 degree increments
        mesh.rotation.y = Math.floor(Math.random() * 4) * (Math.PI / 2);
        this.scene.add(mesh);

        this.grid.set(k, {
            type: 'building',
            modelId,
            mesh,
            x, y
        });

        return { type: 'building', name: modelId.replace('building_', 'Building ') };
    }

    // Pick a building based on distance from center
    pickBuilding(x, y) {
        const dist = Math.max(Math.abs(x), Math.abs(y));

        let tier;
        if (dist <= 2) {
            tier = 'skyscraper';
        } else if (dist <= 5) {
            tier = 'large';
        } else if (dist <= 8) {
            tier = 'medium';
        } else {
            tier = 'small';
        }

        const options = this.buildingTiers[tier];
        return options[Math.floor(Math.random() * options.length)];
    }

    // Find next empty position to grow
    findNextGrowthPosition() {
        for (const pos of this.growthOrder) {
            const k = this.key(pos.x, pos.y);
            if (!this.grid.has(k) &&
                Math.abs(pos.x) <= this.gridRadius &&
                Math.abs(pos.y) <= this.gridRadius) {
                return pos;
            }
        }
        return null;
    }

    // Place a template item
    async placeTemplateItem(item) {
        const k = this.key(item.x, item.y);
        if (this.grid.has(k)) return null;

        const model = await this.loadModelByPath(item.file, item.path);
        if (!model) return null;

        const pos = this.worldPos(item.x, item.y);
        const mesh = model.clone();
        mesh.position.set(pos.x, 0, pos.z);
        mesh.rotation.y = (item.rotation * Math.PI) / 180;
        this.scene.add(mesh);

        // Determine type from filename
        const isRoad = item.file.includes('road_');
        const isBuilding = item.file.includes('building_');
        const type = isRoad ? 'road' : isBuilding ? 'building' : 'decoration';

        this.grid.set(k, {
            type,
            file: item.file,
            path: item.path,
            rotation: item.rotation,
            mesh,
            x: item.x,
            y: item.y
        });

        // Return a name for the toast
        const name = item.file.replace('.gltf', '').replace(/_/g, ' ');
        return { type, name };
    }

    // Main grow function - places items from template
    async grow() {
        if (this.templateIndex >= this.sortedTemplate.length) {
            return null; // Template complete
        }

        // Find next unplaced template item
        while (this.templateIndex < this.sortedTemplate.length) {
            const item = this.sortedTemplate[this.templateIndex];
            const k = this.key(item.x, item.y);
            this.templateIndex++;

            if (!this.grid.has(k)) {
                return await this.placeTemplateItem(item);
            }
        }

        return null;
    }

    getStats() {
        let buildings = 0;
        let roads = 0;

        for (const [, tile] of this.grid) {
            if (tile.type === 'building') buildings++;
            else if (tile.type === 'road') roads++;
        }

        return { buildings, tiles: this.grid.size };
    }

    save() {
        // Save all placed items with their file, path, and rotation
        const data = [];
        for (const [, tile] of this.grid) {
            data.push({
                x: tile.x,
                y: tile.y,
                file: tile.file,
                path: tile.path,
                rotation: tile.rotation || 0,
            });
        }
        localStorage.setItem('tinyHabitsCity', JSON.stringify(data));
    }

    async load() {
        const saved = localStorage.getItem('tinyHabitsCity');
        if (!saved) return false;

        try {
            const data = JSON.parse(saved);

            // Sort by distance from center
            data.sort((a, b) => {
                const distA = Math.max(Math.abs(a.x), Math.abs(a.y));
                const distB = Math.max(Math.abs(b.x), Math.abs(b.y));
                return distA - distB;
            });

            // Load all saved items
            for (const item of data) {
                await this.placeTemplateItem({
                    x: item.x,
                    y: item.y,
                    file: item.file,
                    path: item.path,
                    rotation: item.rotation || 0
                });
            }

            // Update template index to skip already placed items
            this.templateIndex = this.sortedTemplate.findIndex(t => {
                const k = this.key(t.x, t.y);
                return !this.grid.has(k);
            });
            if (this.templateIndex === -1) {
                this.templateIndex = this.sortedTemplate.length;
            }

            return true;
        } catch (e) {
            console.warn('Failed to load city:', e);
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
        const delta = this.clock.getDelta();
        for (const mixer of this.mixers) {
            mixer.update(delta);
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

window.City = City;
