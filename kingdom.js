import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Kingdom class - 3D hexagonal medieval kingdom builder
class Kingdom {
    constructor(container) {
        this.container = container;
        this.hexes = []; // Array of placed hexes with buildings
        this.models = {}; // Cached loaded models
        this.gridRadius = 10; // Hex grid radius (number of rings)
        this.mixers = []; // Animation mixers for characters
        this.characters = []; // Track characters for wandering
        this.clock = new THREE.Clock();

        // Hex dimensions
        this.hexSize = 1;
        this.hexHeight = 0.1;

        this.init();
        this.loadModels();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue

        // Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(8, 10, 8);
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

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -15;
        directionalLight.shadow.camera.right = 15;
        directionalLight.shadow.camera.top = 15;
        directionalLight.shadow.camera.bottom = -15;
        this.scene.add(directionalLight);

        // Handle resize
        window.addEventListener('resize', () => this.onResize());

        // Start render loop
        this.animate();
    }

    async loadModels() {
        this.loader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();

        // Load shared texture
        const texturePath = 'assets/kaykit/buildings/blue/hexagons_medieval.png';
        this.sharedTexture = await this.textureLoader.loadAsync(texturePath);
        this.sharedTexture.flipY = false;

        // Model definitions - buildings and tiles we'll use
        this.modelDefs = {
            // Base tiles
            hex_grass: { path: 'assets/kaykit/tiles/base/hex_grass.gltf', type: 'tile' },
            hex_grass_sloped_low: { path: 'assets/kaykit/tiles/base/hex_grass_sloped_low.gltf', type: 'tile' },
            hex_grass_sloped_high: { path: 'assets/kaykit/tiles/base/hex_grass_sloped_high.gltf', type: 'tile' },
            hex_water: { path: 'assets/kaykit/tiles/base/hex_water.gltf', type: 'tile' },

            // Road tiles
            hex_road_A: { path: 'assets/kaykit/tiles/roads/hex_road_A.gltf', type: 'tile' },
            hex_road_B: { path: 'assets/kaykit/tiles/roads/hex_road_B.gltf', type: 'tile' },
            hex_road_C: { path: 'assets/kaykit/tiles/roads/hex_road_C.gltf', type: 'tile' },
            hex_road_D: { path: 'assets/kaykit/tiles/roads/hex_road_D.gltf', type: 'tile' },
            hex_road_E: { path: 'assets/kaykit/tiles/roads/hex_road_E.gltf', type: 'tile' },
            hex_road_F: { path: 'assets/kaykit/tiles/roads/hex_road_F.gltf', type: 'tile' },

            // Coast tiles
            hex_coast_A: { path: 'assets/kaykit/tiles/coast/hex_coast_A.gltf', type: 'tile' },
            hex_coast_B: { path: 'assets/kaykit/tiles/coast/hex_coast_B.gltf', type: 'tile' },
            hex_coast_C: { path: 'assets/kaykit/tiles/coast/hex_coast_C.gltf', type: 'tile' },

            // Buildings (blue team for now)
            home_A: { path: 'assets/kaykit/buildings/blue/building_home_A_blue.gltf', type: 'building', name: 'House' },
            home_B: { path: 'assets/kaykit/buildings/blue/building_home_B_blue.gltf', type: 'building', name: 'Cottage' },
            church: { path: 'assets/kaykit/buildings/blue/building_church_blue.gltf', type: 'building', name: 'Church' },
            tavern: { path: 'assets/kaykit/buildings/blue/building_tavern_blue.gltf', type: 'building', name: 'Tavern' },
            market: { path: 'assets/kaykit/buildings/blue/building_market_blue.gltf', type: 'building', name: 'Market' },
            blacksmith: { path: 'assets/kaykit/buildings/blue/building_blacksmith_blue.gltf', type: 'building', name: 'Blacksmith' },
            windmill: { path: 'assets/kaykit/buildings/blue/building_windmill_blue.gltf', type: 'building', name: 'Windmill' },
            well: { path: 'assets/kaykit/buildings/blue/building_well_blue.gltf', type: 'building', name: 'Well' },
            lumbermill: { path: 'assets/kaykit/buildings/blue/building_lumbermill_blue.gltf', type: 'building', name: 'Lumbermill' },
            mine: { path: 'assets/kaykit/buildings/blue/building_mine_blue.gltf', type: 'building', name: 'Mine' },

            // Decorations
            trees_A: { path: 'assets/kaykit/decoration/nature/trees_A_medium.gltf', type: 'decoration', name: 'Trees' },
            trees_B: { path: 'assets/kaykit/decoration/nature/trees_B_medium.gltf', type: 'decoration', name: 'Trees' },
            rocks: { path: 'assets/kaykit/decoration/nature/rock_single_A.gltf', type: 'decoration', name: 'Rocks' },
            hills: { path: 'assets/kaykit/decoration/nature/hill_single_A.gltf', type: 'decoration', name: 'Hills' },

            // Characters (villagers)
            knight: { path: 'assets/kaykit/characters/Knight.glb', type: 'character', name: 'Knight', scale: 0.25 },
            barbarian: { path: 'assets/kaykit/characters/Barbarian.glb', type: 'character', name: 'Barbarian', scale: 0.25 },
            mage: { path: 'assets/kaykit/characters/Mage.glb', type: 'character', name: 'Mage', scale: 0.25 },
            ranger: { path: 'assets/kaykit/characters/Ranger.glb', type: 'character', name: 'Ranger', scale: 0.25 },
            rogue: { path: 'assets/kaykit/characters/Rogue.glb', type: 'character', name: 'Rogue', scale: 0.25 },
        };

        // Pre-load grass tile
        await this.loadModel('hex_grass');

        // Load character animations
        try {
            const animGltf = await this.loader.loadAsync('assets/kaykit/characters/Rig_Medium_General.glb');
            const moveGltf = await this.loader.loadAsync('assets/kaykit/characters/Rig_Medium_MovementBasic.glb');
            this.characterAnimations = [...animGltf.animations, ...moveGltf.animations];
            console.log('Loaded animations:', this.characterAnimations.map(a => a.name));
        } catch (e) {
            console.warn('Failed to load character animations:', e);
            this.characterAnimations = [];
        }

        console.log('Kingdom initialized');
        this.loaded = true;

        // Place starting tile
        this.placeHex(0, 0, 'hex_grass');
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

            // Characters use their own embedded textures, buildings use shared texture
            if (def.type !== 'character') {
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
            } else {
                // Characters - just enable shadows, keep their textures
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
            }

            this.models[modelId] = model;
            return model;
        } catch (e) {
            console.warn(`Failed to load model ${modelId}:`, e);
            return null;
        }
    }

    // Convert hex coordinates (axial) to world position
    hexToWorld(q, r) {
        const x = this.hexSize * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
        const z = this.hexSize * (3 / 2 * r);
        return { x, z };
    }

    // Get hex key for storage
    hexKey(q, r) {
        return `${q},${r}`;
    }

    // Hex directions (axial coordinates) - indexed 0-5 clockwise from east
    getHexDirections() {
        return [
            { q: 1, r: 0 },   // 0: East
            { q: 1, r: -1 },  // 1: Northeast
            { q: 0, r: -1 },  // 2: Northwest
            { q: -1, r: 0 },  // 3: West
            { q: -1, r: 1 },  // 4: Southwest
            { q: 0, r: 1 },   // 5: Southeast
        ];
    }

    // Get neighboring hexes that have roads
    getRoadNeighbors(q, r) {
        const directions = this.getHexDirections();
        const neighbors = [];

        for (let i = 0; i < 6; i++) {
            const dir = directions[i];
            const nq = q + dir.q;
            const nr = r + dir.r;
            const hex = this.hexes.find(h => h.q === nq && h.r === nr);
            if (hex && hex.tileType && hex.tileType.startsWith('hex_road')) {
                neighbors.push(i); // Store direction index
            }
        }
        return neighbors;
    }

    // Get the right road tile and rotation based on connections
    // Road tile patterns (assuming standard hex road naming):
    // A = straight (opposite sides: 0-3, 1-4, 2-5)
    // B = corner (adjacent sides)
    // C = Y-junction (3 connections, 120° apart)
    // D = T-junction (3 connections, 2 adjacent + 1 opposite)
    // E = 4-way
    // F = 5-way
    getRoadTileForConnections(connectionDirs) {
        const count = connectionDirs.length;

        if (count === 0) {
            // No neighbors yet - use straight road, random rotation
            return { tile: 'hex_road_A', rotation: Math.floor(Math.random() * 6) * (Math.PI / 3) };
        }

        if (count === 1) {
            // One neighbor - dead end, use straight pointing toward neighbor
            const dir = connectionDirs[0];
            return { tile: 'hex_road_A', rotation: dir * (Math.PI / 3) };
        }

        if (count === 2) {
            const [a, b] = connectionDirs.sort((x, y) => x - y);
            const diff = b - a;

            if (diff === 3) {
                // Opposite sides - straight road
                return { tile: 'hex_road_A', rotation: a * (Math.PI / 3) };
            } else {
                // Adjacent or skip - corner road
                // Rotation should point the corner opening toward the connections
                return { tile: 'hex_road_B', rotation: a * (Math.PI / 3) };
            }
        }

        if (count === 3) {
            // Y or T junction
            return { tile: 'hex_road_C', rotation: connectionDirs[0] * (Math.PI / 3) };
        }

        if (count === 4) {
            return { tile: 'hex_road_D', rotation: connectionDirs[0] * (Math.PI / 3) };
        }

        if (count === 5) {
            return { tile: 'hex_road_E', rotation: connectionDirs[0] * (Math.PI / 3) };
        }

        // 6 connections - full crossroads
        return { tile: 'hex_road_F', rotation: 0 };
    }

    // Find hex object by coordinates
    getHexAt(q, r) {
        return this.hexes.find(h => h.q === q && h.r === r);
    }

    // Update a road tile's model based on current connections
    async updateRoadTile(hex) {
        if (!hex.tileType || !hex.tileType.startsWith('hex_road')) return;

        const connections = this.getRoadNeighbors(hex.q, hex.r);
        const { tile, rotation } = this.getRoadTileForConnections(connections);

        // Remove old tile from scene
        if (hex.tileModel) {
            this.scene.remove(hex.tileModel);
        }

        // Load and place new tile
        const tileModel = await this.loadModel(tile);
        if (tileModel) {
            const pos = this.hexToWorld(hex.q, hex.r);
            hex.tileModel = tileModel.clone();
            hex.tileModel.position.set(pos.x, 0, pos.z);
            hex.tileModel.rotation.y = rotation;
            hex.tileType = tile;
            this.scene.add(hex.tileModel);
        }
    }

    // Update all neighboring road tiles
    async updateNeighborRoads(q, r) {
        const directions = this.getHexDirections();

        for (const dir of directions) {
            const nq = q + dir.q;
            const nr = r + dir.r;
            const hex = this.getHexAt(nq, nr);
            if (hex && hex.tileType && hex.tileType.startsWith('hex_road')) {
                await this.updateRoadTile(hex);
            }
        }
    }

    // Find empty adjacent hex
    findEmptyAdjacentHex() {
        // Hex directions (axial coordinates)
        const directions = [
            { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
            { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }
        ];

        const occupied = new Set(this.hexes.map(h => this.hexKey(h.q, h.r)));

        // If no hexes, return center
        if (this.hexes.length === 0) {
            return { q: 0, r: 0 };
        }

        // Find all empty adjacent hexes
        const candidates = [];
        for (const hex of this.hexes) {
            for (const dir of directions) {
                const newQ = hex.q + dir.q;
                const newR = hex.r + dir.r;
                const key = this.hexKey(newQ, newR);

                // Check if within grid radius and not occupied
                const dist = Math.max(Math.abs(newQ), Math.abs(newR), Math.abs(-newQ - newR));
                if (dist <= this.gridRadius && !occupied.has(key)) {
                    candidates.push({ q: newQ, r: newR, dist });
                }
            }
        }

        if (candidates.length === 0) return null;

        // Prefer hexes closer to center
        candidates.sort((a, b) => a.dist - b.dist);

        // Pick randomly from top candidates
        const topCandidates = candidates.filter(c => c.dist === candidates[0].dist);
        return topCandidates[Math.floor(Math.random() * topCandidates.length)];
    }

    // Place a hex tile with optional building
    async placeHex(q, r, tileType, buildingType = null) {
        const pos = this.hexToWorld(q, r);
        const isRoad = tileType && tileType.startsWith('hex_road');

        // For roads, determine correct tile type and rotation based on neighbors
        let tileRotation = 0;
        if (isRoad) {
            const connections = this.getRoadNeighbors(q, r);
            const roadConfig = this.getRoadTileForConnections(connections);
            tileType = roadConfig.tile;
            tileRotation = roadConfig.rotation;
        }

        // Load and place tile
        let placedTile = null;
        const tileModel = await this.loadModel(tileType);
        if (tileModel) {
            placedTile = tileModel.clone();
            placedTile.position.set(pos.x, 0, pos.z);
            placedTile.rotation.y = tileRotation;
            this.scene.add(placedTile);
        }

        // Load and place building if specified
        let building = null;
        if (buildingType) {
            const def = this.modelDefs[buildingType];

            // Characters need fresh load each time (clone doesn't work well with skinned meshes)
            if (def && def.type === 'character') {
                try {
                    const gltf = await this.loader.loadAsync(def.path);
                    building = gltf.scene;
                    building.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    building.position.set(pos.x, 0, pos.z);
                    if (def.scale) {
                        building.scale.setScalar(def.scale);
                    }
                    // Random rotation so they face different directions
                    building.rotation.y = Math.random() * Math.PI * 2;

                    this.scene.add(building);

                    // Set up animations and wandering
                    if (this.characterAnimations && this.characterAnimations.length > 0) {
                        const mixer = new THREE.AnimationMixer(building);

                        // Get animation clips
                        const idleClip = this.characterAnimations.find(a => a.name === 'Idle_A');
                        const walkClip = this.characterAnimations.find(a => a.name === 'Walking_A');

                        const idleAction = idleClip ? mixer.clipAction(idleClip) : null;
                        const walkAction = walkClip ? mixer.clipAction(walkClip) : null;

                        // Start with idle
                        if (idleAction) idleAction.play();

                        this.mixers.push(mixer);

                        // Track character for wandering
                        this.characters.push({
                            model: building,
                            mixer,
                            idleAction,
                            walkAction,
                            state: 'idle',
                            targetPos: null,
                            nextWanderTime: Date.now() + 2000 + Math.random() * 5000,
                        });
                    }
                } catch (e) {
                    console.warn(`Failed to load character ${buildingType}:`, e);
                }
            } else {
                const buildingModel = await this.loadModel(buildingType);
                if (buildingModel) {
                    building = buildingModel.clone();
                    building.position.set(pos.x, 0, pos.z);
                    // Random rotation for variety
                    building.rotation.y = Math.floor(Math.random() * 6) * (Math.PI / 3);
                    this.scene.add(building);
                }
            }
        }

        this.hexes.push({
            q, r,
            tileType,
            buildingType,
            tileModel: placedTile,
            building,
        });

        // Update neighboring road tiles if we just placed a road
        if (isRoad) {
            await this.updateNeighborRoads(q, r);
        }

        return { q, r, buildingType };
    }

    // Pick a random item from weighted list
    weightedRandom(items, weights) {
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let rand = Math.random() * totalWeight;
        for (let i = 0; i < items.length; i++) {
            rand -= weights[i];
            if (rand <= 0) return items[i];
        }
        return items[0];
    }

    // Grow the kingdom - add a new hex with a building
    async grow(habitName = null) {
        const spot = this.findEmptyAdjacentHex();
        if (!spot) return null;

        // Pick a random tile type (hex_road will be resolved to correct type in placeHex)
        const tileTypes = ['hex_grass', 'hex_grass', 'hex_grass', 'hex_road', 'hex_road',
                          'hex_water', 'hex_coast_A', 'hex_coast_B'];
        const tileWeights = [10, 10, 10, 3, 3, 1, 1, 1]; // Grass most common, roads fairly common
        const tileType = this.weightedRandom(tileTypes, tileWeights);

        // Pick a random building (or none for water/roads/some tiles)
        let buildingType = null;

        // Don't put buildings on water or roads
        if (!tileType.includes('water') && !tileType.includes('road')) {
            const buildingTypes = ['home_A', 'home_B', 'church', 'tavern', 'market',
                                   'blacksmith', 'windmill', 'well', 'lumbermill', 'mine',
                                   'trees_A', 'trees_B', 'rocks', 'hills',
                                   'knight', 'barbarian', 'mage', 'ranger', 'rogue', null];
            const weights = [5, 5, 1, 2, 2, 1, 1, 2, 1, 1, 3, 3, 2, 2,
                            2, 2, 2, 2, 2, 3]; // characters have weight 2 each

            buildingType = this.weightedRandom(buildingTypes, weights);
        }

        const result = await this.placeHex(spot.q, spot.r, tileType, buildingType);
        const worldPos = this.hexToWorld(spot.q, spot.r);

        // Store habit info on the hex for tooltip
        const hex = this.getHexAt(spot.q, spot.r);
        if (hex && habitName) {
            hex.habitName = habitName;
        }

        // Pan camera to the new building
        this.panToPosition(worldPos.x, worldPos.z);

        if (buildingType && this.modelDefs[buildingType]) {
            return {
                type: this.modelDefs[buildingType].type,
                name: this.modelDefs[buildingType].name,
                position: { q: spot.q, r: spot.r, x: worldPos.x, z: worldPos.z },
            };
        }
        return { type: 'tile', name: 'Land', position: { q: spot.q, r: spot.r, x: worldPos.x, z: worldPos.z } };
    }

    // Smoothly pan camera to look at a position
    panToPosition(x, z) {
        const targetX = x;
        const targetZ = z;
        const startTarget = this.controls.target.clone();
        const startTime = Date.now();
        const duration = 800; // ms

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - t, 3);

            this.controls.target.x = startTarget.x + (targetX - startTarget.x) * ease;
            this.controls.target.z = startTarget.z + (targetZ - startTarget.z) * ease;

            if (t < 1) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    getStats() {
        const buildings = this.hexes.filter(h => h.buildingType &&
            this.modelDefs[h.buildingType]?.type === 'building').length;
        const tiles = this.hexes.length;
        return { buildings, tiles };
    }

    save() {
        const data = this.hexes.map(h => ({
            q: h.q,
            r: h.r,
            tileType: h.tileType,
            buildingType: h.buildingType,
            habitName: h.habitName || null,
        }));
        // Support both old and new key names
        localStorage.setItem('tinyHabitsKingdom', JSON.stringify(data));
        localStorage.setItem('tinyHabitsGarden', JSON.stringify(data));
    }

    async load() {
        // Support both old and new key names
        const saved = localStorage.getItem('tinyHabitsKingdom') || localStorage.getItem('tinyHabitsGarden');
        if (!saved) return false;

        try {
            const data = JSON.parse(saved);
            for (const hexData of data) {
                await this.placeHex(hexData.q, hexData.r, hexData.tileType, hexData.buildingType);
                // Restore habit name if saved
                if (hexData.habitName) {
                    const hex = this.getHexAt(hexData.q, hexData.r);
                    if (hex) hex.habitName = hexData.habitName;
                }
            }
            return true;
        } catch (e) {
            console.warn('Failed to load kingdom:', e);
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
        const now = Date.now();

        // Update animations
        for (const mixer of this.mixers) {
            mixer.update(delta);
        }

        // Update character wandering
        for (const char of this.characters) {
            if (char.state === 'idle' && now >= char.nextWanderTime) {
                // Pick a random nearby position to walk to
                this.startWandering(char);
            } else if (char.state === 'walking' && char.targetPos) {
                // Move towards target
                const speed = 0.8 * delta;
                const dx = char.targetPos.x - char.model.position.x;
                const dz = char.targetPos.z - char.model.position.z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist < 0.05) {
                    // Arrived at destination
                    char.model.position.x = char.targetPos.x;
                    char.model.position.z = char.targetPos.z;
                    this.stopWandering(char);
                } else {
                    // Keep walking
                    char.model.position.x += (dx / dist) * speed;
                    char.model.position.z += (dz / dist) * speed;

                    // Face walking direction
                    char.model.rotation.y = Math.atan2(dx, dz);
                }
            }
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    startWandering(char) {
        // Pick a random hex to walk to (within the placed hexes)
        if (this.hexes.length < 2) return;

        const currentPos = char.model.position;

        // Find nearby hexes (not too far, and not water)
        const nearbyHexes = this.hexes.filter(h => {
            // Skip water and coast tiles
            if (h.tileType && (h.tileType.includes('water') || h.tileType.includes('coast'))) {
                return false;
            }

            const pos = this.hexToWorld(h.q, h.r);
            const dx = pos.x - currentPos.x;
            const dz = pos.z - currentPos.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            return dist > 0.5 && dist < 4; // Not current pos, but within 4 units
        });

        if (nearbyHexes.length === 0) return;

        const targetHex = nearbyHexes[Math.floor(Math.random() * nearbyHexes.length)];
        const targetPos = this.hexToWorld(targetHex.q, targetHex.r);

        char.targetPos = { x: targetPos.x, z: targetPos.z };
        char.state = 'walking';

        // Switch to walk animation
        if (char.idleAction && char.walkAction) {
            char.idleAction.fadeOut(0.2);
            char.walkAction.reset().fadeIn(0.2).play();
        }
    }

    stopWandering(char) {
        char.state = 'idle';
        char.targetPos = null;
        char.nextWanderTime = Date.now() + 3000 + Math.random() * 6000; // Wait 3-9 seconds

        // Switch to idle animation
        if (char.idleAction && char.walkAction) {
            char.walkAction.fadeOut(0.2);
            char.idleAction.reset().fadeIn(0.2).play();
        }
    }
}

// Export for use in app.js
window.Kingdom = Kingdom;
