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

            // More buildings
            barracks: { path: 'assets/kaykit/buildings/blue/building_barracks_blue.gltf', type: 'building', name: 'Barracks' },
            archeryrange: { path: 'assets/kaykit/buildings/blue/building_archeryrange_blue.gltf', type: 'building', name: 'Archery Range' },
            grain: { path: 'assets/kaykit/buildings/neutral/building_grain.gltf', type: 'building', name: 'Grain Storage' },
            stage: { path: 'assets/kaykit/buildings/neutral/building_stage_A.gltf', type: 'building', name: 'Stage' },

            // Nature decorations
            trees_A: { path: 'assets/kaykit/decoration/nature/trees_A_medium.gltf', type: 'decoration', name: 'Trees' },
            trees_B: { path: 'assets/kaykit/decoration/nature/trees_B_medium.gltf', type: 'decoration', name: 'Trees' },
            rocks: { path: 'assets/kaykit/decoration/nature/rock_single_A.gltf', type: 'decoration', name: 'Rocks' },
            hills: { path: 'assets/kaykit/decoration/nature/hill_single_A.gltf', type: 'decoration', name: 'Hills' },

            // Props
            target: { path: 'assets/kaykit/decoration/props/target.gltf', type: 'decoration', name: 'Target' },
            tent: { path: 'assets/kaykit/decoration/props/tent.gltf', type: 'decoration', name: 'Tent' },
            barrel: { path: 'assets/kaykit/decoration/props/barrel.gltf', type: 'decoration', name: 'Barrel' },
            crate: { path: 'assets/kaykit/decoration/props/crate_A_big.gltf', type: 'decoration', name: 'Crate' },
            sack: { path: 'assets/kaykit/decoration/props/sack.gltf', type: 'decoration', name: 'Sack' },
            weaponrack: { path: 'assets/kaykit/decoration/props/weaponrack.gltf', type: 'decoration', name: 'Weapon Rack' },
            wheelbarrow: { path: 'assets/kaykit/decoration/props/wheelbarrow.gltf', type: 'decoration', name: 'Wheelbarrow' },
            lumber: { path: 'assets/kaykit/decoration/props/resource_lumber.gltf', type: 'decoration', name: 'Lumber' },
            flag: { path: 'assets/kaykit/decoration/props/flag_blue.gltf', type: 'decoration', name: 'Flag' },

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

    // Find hex object by coordinates
    getHexAt(q, r) {
        return this.hexes.find(h => h.q === q && h.r === r);
    }

    // Get hex distance from center
    hexDistance(q, r) {
        return Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r));
    }

    // Get the zone for a hex (determines what can be built there)
    getZone(q, r) {
        const dist = this.hexDistance(q, r);
        if (dist === 0) return 'center';      // Castle/Church
        if (dist <= 2) return 'commercial';   // Market, Tavern, Well (includes ring 1-2)
        if (dist <= 4) return 'residential';  // Homes
        return 'outskirts';                   // Farms, nature, characters
    }

    // Find the next hex to place using a spiral pattern from center
    findNextHexSpiral() {
        const occupied = new Set(this.hexes.map(h => this.hexKey(h.q, h.r)));

        // If no hexes, return center
        if (this.hexes.length === 0) {
            return { q: 0, r: 0 };
        }

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

    // Get all hexes in a ring at distance 'ring' from center
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

    // Find empty adjacent hex (legacy method, now uses spiral)
    findEmptyAdjacentHex() {
        return this.findNextHexSpiral();
    }

    // Place a hex tile with optional building
    async placeHex(q, r, tileType, buildingType = null) {
        const pos = this.hexToWorld(q, r);

        // Load and place tile
        let placedTile = null;
        const tileModel = await this.loadModel(tileType);
        if (tileModel) {
            placedTile = tileModel.clone();
            placedTile.position.set(pos.x, 0, pos.z);
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

    // Get appropriate building for a zone
    getBuildingForZone(zone) {
        switch (zone) {
            case 'center':
                // First building is always church (town center)
                if (this.hexes.length === 0) return { tile: 'hex_grass', building: 'church' };
                return { tile: 'hex_grass', building: 'church' };

            case 'commercial':
                // Market, tavern, well, blacksmith
                const commercial = ['market', 'tavern', 'well', 'blacksmith'];
                const commercialWeights = [3, 3, 2, 2];
                return {
                    tile: 'hex_grass',
                    building: this.weightedRandom(commercial, commercialWeights)
                };

            case 'residential':
                // Mostly homes, occasionally a well or trees
                const residential = ['home_A', 'home_B', 'home_A', 'home_B', 'well', 'trees_A', null];
                const residentialWeights = [4, 4, 4, 4, 1, 2, 1];
                return {
                    tile: 'hex_grass',
                    building: this.weightedRandom(residential, residentialWeights)
                };

            case 'outskirts':
            default:
                // Farms, nature, and characters
                // Check if this should be a road
                const outskirts = [
                    'windmill', 'lumbermill', 'mine',
                    'trees_A', 'trees_B', 'rocks', 'hills',
                    'knight', 'barbarian', 'mage', 'ranger', 'rogue',
                    null, null
                ];
                const outskirtsWeights = [
                    2, 2, 2,
                    4, 4, 2, 2,
                    1, 1, 1, 1, 1,
                    3, 3
                ];
                return {
                    tile: 'hex_grass',
                    building: this.weightedRandom(outskirts, outskirtsWeights)
                };
        }
    }

    // Grow the kingdom - add a new hex with a building
    async grow(habitName = null) {
        const spot = this.findEmptyAdjacentHex();
        if (!spot) return null;

        const zone = this.getZone(spot.q, spot.r);

        // Determine tile and building based on zone
        const zoneConfig = this.getBuildingForZone(zone);
        let tileType = zoneConfig.tile;
        let buildingType = zoneConfig.building;

        // Small chance of water/coast on outskirts (for variety)
        if (zone === 'outskirts' && !buildingType && Math.random() < 0.1) {
            const waterTiles = ['hex_water', 'hex_coast_A', 'hex_coast_B'];
            tileType = waterTiles[Math.floor(Math.random() * waterTiles.length)];
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

        // If no saved game, check for starter template
        if (!saved) {
            const starterLoaded = await this.loadStarterTemplate();
            return starterLoaded;
        }

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

    // Load starter template created in kingdom-designer.html
    async loadStarterTemplate() {
        const starterTemplate = localStorage.getItem('kingdomStarterTemplate');
        if (!starterTemplate) return false;

        try {
            const items = JSON.parse(starterTemplate);
            console.log('Loading starter template with', items.length, 'items');

            // Group items by hex position
            const hexMap = new Map();
            for (const item of items) {
                const key = `${item.q},${item.r}`;
                if (!hexMap.has(key)) {
                    hexMap.set(key, { q: item.q, r: item.r, layers: [] });
                }
                hexMap.get(key).layers.push(item);
            }

            // Place each hex
            for (const [key, hexData] of hexMap) {
                let tileType = 'hex_grass';
                let buildingType = null;
                let rotation = 0;

                // Process layers (0=ground, 1=base tile, 2=building, 3=decoration)
                for (const layer of hexData.layers) {
                    const asset = layer.asset;

                    // Determine what type of asset this is
                    if (asset.startsWith('hex_')) {
                        // It's a tile
                        tileType = asset;
                        rotation = layer.rotation || 0;
                    } else if (this.modelDefs[asset]) {
                        // It's a building/decoration/character
                        buildingType = asset;
                    }
                }

                await this.placeHex(hexData.q, hexData.r, tileType, buildingType);

                // Apply rotation if specified
                const hex = this.getHexAt(hexData.q, hexData.r);
                if (hex && rotation && hex.tileModel) {
                    hex.tileModel.rotation.y = rotation;
                }
            }

            // Save this as the current kingdom state
            this.save();
            console.log('Starter template loaded successfully');
            return true;

        } catch (e) {
            console.warn('Failed to load starter template:', e);
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
