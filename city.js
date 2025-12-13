import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// City class - builds a proper city with roads and buildings
class City {
    constructor(container) {
        this.container = container;
        this.grid = new Map(); // Map of "x,y" -> tile data
        this.models = {};
        this.tileSize = 2; // Each tile is 2 units (from -1 to 1)
        this.gridRadius = 8; // City extends from -8 to 8
        this.mixers = [];
        this.clock = new THREE.Clock();

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
        this.camera.position.set(15, 20, 15);
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
        this.controls.minDistance = 8;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI / 2.2;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 50;
        dirLight.shadow.camera.left = -20;
        dirLight.shadow.camera.right = 20;
        dirLight.shadow.camera.top = 20;
        dirLight.shadow.camera.bottom = -20;
        this.scene.add(dirLight);

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

        // All available models
        this.modelPaths = {
            // Roads
            road_straight: 'assets/kaykit/city/road_straight.gltf',
            road_corner: 'assets/kaykit/city/road_corner.gltf',
            road_tsplit: 'assets/kaykit/city/road_tsplit.gltf',
            road_junction: 'assets/kaykit/city/road_junction.gltf',

            // Buildings (with base)
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
            trafficlight_A: 'assets/kaykit/city/trafficlight_A.gltf',
        };

        // Building tiers (small to large)
        this.buildingTiers = [
            ['building_A', 'building_B'],           // Tier 0: small
            ['building_C', 'building_D'],           // Tier 1: medium
            ['building_E', 'building_F'],           // Tier 2: large
            ['building_G', 'building_H'],           // Tier 3: skyscrapers
        ];

        console.log('City initialized');
        this.loaded = true;

        // Start with initial layout if no save
        const hasSave = localStorage.getItem('tinyHabitsCity');
        if (!hasSave) {
            await this.buildInitialRoads();
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

    key(x, y) {
        return `${x},${y}`;
    }

    worldPos(x, y) {
        return {
            x: x * this.tileSize,
            z: y * this.tileSize
        };
    }

    // Build the initial road grid
    async buildInitialRoads() {
        // Create a cross of roads at the center
        await this.placeRoad(0, 0);
    }

    // Get adjacent road count and directions
    getAdjacentRoads(x, y) {
        const dirs = [
            { dx: 1, dy: 0, bit: 0 },  // East
            { dx: 0, dy: -1, bit: 1 }, // North
            { dx: -1, dy: 0, bit: 2 }, // West
            { dx: 0, dy: 1, bit: 3 },  // South
        ];

        const adjacent = [];
        for (const dir of dirs) {
            const tile = this.grid.get(this.key(x + dir.dx, y + dir.dy));
            if (tile && tile.type === 'road') {
                adjacent.push(dir.bit);
            }
        }
        return adjacent;
    }

    // Choose road model based on connections
    getRoadModel(connections) {
        const count = connections.length;

        if (count === 0) {
            return { model: 'road_straight', rotation: 0 };
        }
        if (count === 1) {
            // Dead end - use straight pointing toward connection
            const rot = connections[0] * (Math.PI / 2);
            return { model: 'road_straight', rotation: rot };
        }
        if (count === 2) {
            const [a, b] = connections.sort((x, y) => x - y);
            if ((b - a) === 2) {
                // Straight road
                return { model: 'road_straight', rotation: (a % 2) * (Math.PI / 2) };
            } else {
                // Corner
                return { model: 'road_corner', rotation: a * (Math.PI / 2) };
            }
        }
        if (count === 3) {
            // T-split - find missing direction
            const all = [0, 1, 2, 3];
            const missing = all.find(d => !connections.includes(d));
            return { model: 'road_tsplit', rotation: ((missing + 2) % 4) * (Math.PI / 2) };
        }
        // 4-way junction
        return { model: 'road_junction', rotation: 0 };
    }

    async placeRoad(x, y) {
        const k = this.key(x, y);
        if (this.grid.has(k)) return null;

        const connections = this.getAdjacentRoads(x, y);
        const { model: modelId, rotation } = this.getRoadModel(connections);

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
            x, y
        });

        // Update neighboring roads
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
                // Recalculate this road's model
                const connections = this.getAdjacentRoads(nx, ny);
                const { model: modelId, rotation } = this.getRoadModel(connections);

                if (modelId !== tile.modelId) {
                    // Remove old mesh
                    this.scene.remove(tile.mesh);

                    // Add new mesh
                    const model = await this.loadModel(modelId);
                    if (model) {
                        const pos = this.worldPos(nx, ny);
                        const mesh = model.clone();
                        mesh.position.set(pos.x, 0, pos.z);
                        mesh.rotation.y = rotation;
                        this.scene.add(mesh);

                        tile.modelId = modelId;
                        tile.mesh = mesh;
                    }
                } else {
                    // Just update rotation
                    tile.mesh.rotation.y = rotation;
                }
            }
        }
    }

    async placeBuilding(x, y, buildingId) {
        const k = this.key(x, y);
        if (this.grid.has(k)) return null;

        const model = await this.loadModel(buildingId);
        if (!model) return null;

        const pos = this.worldPos(x, y);
        const mesh = model.clone();
        mesh.position.set(pos.x, 0, pos.z);
        mesh.rotation.y = Math.floor(Math.random() * 4) * (Math.PI / 2);
        this.scene.add(mesh);

        this.grid.set(k, {
            type: 'building',
            modelId: buildingId,
            mesh,
            x, y
        });

        return { type: 'building', name: buildingId };
    }

    // Find spots adjacent to roads that don't have buildings
    findBuildingSpots() {
        const spots = [];
        const dirs = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: -1 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
        ];

        for (const [, tile] of this.grid) {
            if (tile.type === 'road') {
                for (const dir of dirs) {
                    const nx = tile.x + dir.dx;
                    const ny = tile.y + dir.dy;
                    const k = this.key(nx, ny);

                    if (!this.grid.has(k) && Math.abs(nx) <= this.gridRadius && Math.abs(ny) <= this.gridRadius) {
                        // Check this spot isn't already in our list
                        if (!spots.find(s => s.x === nx && s.y === ny)) {
                            const dist = Math.abs(nx) + Math.abs(ny);
                            spots.push({ x: nx, y: ny, dist });
                        }
                    }
                }
            }
        }

        return spots;
    }

    // Find spots to extend roads
    findRoadExtensionSpots() {
        const spots = [];
        const dirs = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: -1 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
        ];

        for (const [, tile] of this.grid) {
            if (tile.type === 'road') {
                for (const dir of dirs) {
                    const nx = tile.x + dir.dx;
                    const ny = tile.y + dir.dy;
                    const k = this.key(nx, ny);

                    if (!this.grid.has(k) && Math.abs(nx) <= this.gridRadius && Math.abs(ny) <= this.gridRadius) {
                        if (!spots.find(s => s.x === nx && s.y === ny)) {
                            const dist = Math.abs(nx) + Math.abs(ny);
                            spots.push({ x: nx, y: ny, dist });
                        }
                    }
                }
            }
        }

        return spots;
    }

    // Main grow function - called when habits are completed
    async grow() {
        const tileCount = this.grid.size;

        // Strategy: alternate between roads and buildings
        // Start with more roads, then fill in buildings
        const shouldPlaceRoad = tileCount < 5 || (tileCount % 3 === 0);

        if (shouldPlaceRoad) {
            const roadSpots = this.findRoadExtensionSpots();
            if (roadSpots.length > 0) {
                // Prefer extending in a grid pattern
                roadSpots.sort((a, b) => a.dist - b.dist);
                const spot = roadSpots[Math.floor(Math.random() * Math.min(3, roadSpots.length))];
                return await this.placeRoad(spot.x, spot.y);
            }
        }

        // Place a building
        const buildingSpots = this.findBuildingSpots();
        if (buildingSpots.length > 0) {
            // Sort by distance - closer to center = taller buildings
            buildingSpots.sort((a, b) => a.dist - b.dist);
            const spot = buildingSpots[Math.floor(Math.random() * Math.min(5, buildingSpots.length))];

            // Pick building tier based on distance from center
            let tier;
            if (spot.dist <= 2) tier = 3;      // Downtown skyscrapers
            else if (spot.dist <= 4) tier = 2; // Large buildings
            else if (spot.dist <= 6) tier = 1; // Medium buildings
            else tier = 0;                      // Small buildings

            const buildings = this.buildingTiers[tier];
            const buildingId = buildings[Math.floor(Math.random() * buildings.length)];

            return await this.placeBuilding(spot.x, spot.y, buildingId);
        }

        // If no building spots, try roads again
        const roadSpots = this.findRoadExtensionSpots();
        if (roadSpots.length > 0) {
            const spot = roadSpots[Math.floor(Math.random() * roadSpots.length)];
            return await this.placeRoad(spot.x, spot.y);
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
        const data = [];
        for (const [, tile] of this.grid) {
            data.push({
                x: tile.x,
                y: tile.y,
                type: tile.type,
                modelId: tile.modelId,
            });
        }
        localStorage.setItem('tinyHabitsCity', JSON.stringify(data));
    }

    async load() {
        const saved = localStorage.getItem('tinyHabitsCity');
        if (!saved) return false;

        try {
            const data = JSON.parse(saved);

            // First pass: place roads (they need to update each other)
            for (const tile of data) {
                if (tile.type === 'road') {
                    await this.placeRoad(tile.x, tile.y);
                }
            }

            // Second pass: place buildings
            for (const tile of data) {
                if (tile.type === 'building') {
                    await this.placeBuilding(tile.x, tile.y, tile.modelId);
                }
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
