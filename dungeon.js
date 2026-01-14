import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Room template - designed in room-designer.html
// Wall items are marked with wallMount: true, wallSide: "back" or "left"
const roomTemplate = [
  // Back wall items (y = -4)
  { "x": -2, "y": -4, "file": "wall_window_open.gltf", "rotation": 0, "wallMount": true, "wallSide": "back" },
  { "x": -1, "y": -4, "file": "banner_patternA_red.gltf", "rotation": 0, "wallMount": true, "wallSide": "back" },
  { "x": 0, "y": -4, "file": "wall_window_open.gltf", "rotation": 0, "wallMount": true, "wallSide": "back" },
  { "x": 1, "y": -4, "file": "banner_patternC_green.gltf", "rotation": 0, "wallMount": true, "wallSide": "back" },
  { "x": 2, "y": -4, "file": "wall_window_open.gltf", "rotation": 0, "wallMount": true, "wallSide": "back" },
  { "x": 3, "y": -4, "file": "shelf_small_candles.gltf", "rotation": 0, "wallMount": true, "wallSide": "back" },
  // Row y = -3
  { "x": -3, "y": -3, "file": "barrel_large_decorated.gltf", "rotation": 0 },
  { "x": -2, "y": -3, "file": "bottle_C_green.gltf", "rotation": 0 },
  { "x": 2, "y": -3, "file": "box_large.gltf", "rotation": 0 },
  { "x": 3, "y": -3, "file": "box_small_decorated.gltf", "rotation": 0 },
  // Row y = -2
  { "x": -4, "y": -2, "file": "banner_brown.gltf", "rotation": 90, "wallMount": true, "wallSide": "left" },
  { "x": -3, "y": -2, "file": "barrel_large_decorated.gltf", "rotation": 0 },
  { "x": -1, "y": -2, "file": "chair.gltf", "rotation": 180 },
  { "x": 1, "y": -2, "file": "chair.gltf", "rotation": 0 },
  { "x": 4, "y": -2, "file": "barrel_small_stack.gltf", "rotation": 90 },
  // Row y = -1
  { "x": -4, "y": -1, "file": "sword_shield_gold.gltf", "rotation": 90, "wallMount": true, "wallSide": "left" },
  { "x": -1, "y": -1, "file": "chair.gltf", "rotation": 180 },
  { "x": 0, "y": -1, "file": "table_long_decorated_A.gltf", "rotation": 0 },
  { "x": 1, "y": -1, "file": "chair.gltf", "rotation": 0 },
  { "x": 4, "y": -1, "file": "trunk_large_A.gltf", "rotation": 90 },
  // Row y = 0
  { "x": -4, "y": 0, "file": "wall_doorway.gltf", "rotation": 270, "wallMount": true, "wallSide": "left" },
  { "x": -1, "y": 0, "file": "chair.gltf", "rotation": 180 },
  { "x": 1, "y": 0, "file": "chair.gltf", "rotation": 0 },
  // Row y = 1
  { "x": -4, "y": 1, "file": "sword_shield_broken.gltf", "rotation": 90, "wallMount": true, "wallSide": "left" },
  { "x": -3, "y": 1, "file": "trunk_large_B.gltf", "rotation": 0 },
  { "x": 0, "y": 1, "file": "box_large.gltf", "rotation": 0 },
  { "x": 4, "y": 1, "file": "chest.gltf", "rotation": 90 },
  // Row y = 2
  { "x": -4, "y": 2, "file": "banner_patternB_blue.gltf", "rotation": 90, "wallMount": true, "wallSide": "left" },
  { "x": -3, "y": 2, "file": "chest_gold.gltf", "rotation": 0 },
  { "x": 4, "y": 2, "file": "chest_gold.gltf", "rotation": 90 },
  // Row y = 3
  { "x": -4, "y": 3, "file": "shelf_small_candles.gltf", "rotation": 90, "wallMount": true, "wallSide": "left" },
  { "x": -1, "y": 3, "file": "stool.gltf", "rotation": 0 },
  { "x": 1, "y": 3, "file": "stool.gltf", "rotation": 0 },
  // Row y = 4
  { "x": -3, "y": 4, "file": "box_stacked.gltf", "rotation": 0 },
  { "x": -2, "y": 4, "file": "bottle_B_brown.gltf", "rotation": 0 },
  { "x": -1, "y": 4, "file": "bed_frame.gltf", "rotation": 180 },
  { "x": 0, "y": 4, "file": "table_small.gltf", "rotation": 0 },
  { "x": 1, "y": 4, "file": "bed_frame.gltf", "rotation": 180 },
  { "x": 2, "y": 4, "file": "coin_stack_medium.gltf", "rotation": 0 },
  { "x": 4, "y": 4, "file": "crates_stacked.gltf", "rotation": 90 }
];

// Dungeon class - builds a medieval dungeon with floor tiles and items
class Dungeon {
    constructor(container) {
        this.container = container;
        this.grid = new Map(); // "x,y" -> tile data
        this.models = {};
        this.tileSize = 2; // Each tile is 2x2 units
        this.gridRadius = 4; // Dungeon extends this many tiles from center (9x9 = 81 tiles)
        this.mixers = [];
        this.clock = new THREE.Clock();
        this.templateIndex = 0; // Current position in room template
        this.placedItems = []; // Track placed template items

        this.init();
        this.loadModels();
    }

    init() {
        // Scene - dungeon atmosphere
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x3d3d4a); // Medium grey

        // Add subtle fog for atmosphere
        this.scene.fog = new THREE.Fog(0x3d3d4a, 40, 80);

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

        // Lighting - brighter torchlit dungeon style
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

        // Add warm torch-like point lights
        const torchLight1 = new THREE.PointLight(0xff8844, 1.0, 40);
        torchLight1.position.set(-10, 5, -10);
        this.scene.add(torchLight1);

        const torchLight2 = new THREE.PointLight(0xff8844, 1.0, 40);
        torchLight2.position.set(10, 5, 10);
        this.scene.add(torchLight2);

        const torchLight3 = new THREE.PointLight(0xff6622, 0.8, 30);
        torchLight3.position.set(0, 5, 0);
        this.scene.add(torchLight3);

        // Dark stone ground beneath floor tiles
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.95,
            metalness: 0.05,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.scene.add(ground);

        window.addEventListener('resize', () => this.onResize());
        this.animate();
    }

    async loadModels() {
        this.loader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();

        // Load texture
        const texturePath = 'assets/dungeon/dungeon_texture.png';
        this.sharedTexture = await this.textureLoader.loadAsync(texturePath);
        this.sharedTexture.flipY = false;

        // Model paths - using many more assets from the pack!
        this.modelPaths = {
            // Floor tiles
            floor_tile: 'assets/dungeon/floor_tile_large.gltf',

            // Walls
            wall: 'assets/dungeon/wall.gltf',

            // Wall decorations (hung on walls)
            torch_lit: 'assets/dungeon/torch_lit.gltf',
            torch_mounted: 'assets/dungeon/torch_mounted.gltf',
            banner_red: 'assets/dungeon/banner_red.gltf',
            banner_blue: 'assets/dungeon/banner_blue.gltf',
            banner_green: 'assets/dungeon/banner_green.gltf',
            banner_yellow: 'assets/dungeon/banner_yellow.gltf',
            banner_white: 'assets/dungeon/banner_white.gltf',
            banner_brown: 'assets/dungeon/banner_brown.gltf',
            banner_shield_red: 'assets/dungeon/banner_shield_red.gltf',
            banner_shield_blue: 'assets/dungeon/banner_shield_blue.gltf',
            banner_shield_gold: 'assets/dungeon/banner_shield_yellow.gltf',
            banner_triple_red: 'assets/dungeon/banner_triple_red.gltf',
            banner_triple_blue: 'assets/dungeon/banner_triple_blue.gltf',
            sword_shield: 'assets/dungeon/sword_shield.gltf',
            sword_shield_gold: 'assets/dungeon/sword_shield_gold.gltf',
            sword_shield_broken: 'assets/dungeon/sword_shield_broken.gltf',
            shelf_candles: 'assets/dungeon/shelf_small_candles.gltf',
            keyring_hanging: 'assets/dungeon/keyring_hanging.gltf',

            // Floor items - treasure
            chest: 'assets/dungeon/chest.gltf',
            chest_gold: 'assets/dungeon/chest_gold.gltf',
            coin_stack_large: 'assets/dungeon/coin_stack_large.gltf',
            coin_stack_medium: 'assets/dungeon/coin_stack_medium.gltf',
            trunk_large_A: 'assets/dungeon/trunk_large_A.gltf',
            trunk_large_B: 'assets/dungeon/trunk_large_B.gltf',
            trunk_medium_A: 'assets/dungeon/trunk_medium_A.gltf',
            trunk_small_A: 'assets/dungeon/trunk_small_A.gltf',

            // Floor items - structures
            pillar: 'assets/dungeon/pillar.gltf',
            pillar_decorated: 'assets/dungeon/pillar_decorated.gltf',
            column: 'assets/dungeon/column.gltf',
            barrier: 'assets/dungeon/barrier.gltf',
            barrier_column: 'assets/dungeon/barrier_column.gltf',

            // Floor items - furniture
            table_long: 'assets/dungeon/table_long.gltf',
            table_long_decorated: 'assets/dungeon/table_long_decorated_A.gltf',
            table_long_tablecloth: 'assets/dungeon/table_long_tablecloth.gltf',
            table_medium: 'assets/dungeon/table_medium.gltf',
            table_medium_decorated: 'assets/dungeon/table_medium_decorated_A.gltf',
            table_small: 'assets/dungeon/table_small.gltf',
            table_small_decorated: 'assets/dungeon/table_small_decorated_A.gltf',
            chair: 'assets/dungeon/chair.gltf',
            stool: 'assets/dungeon/stool.gltf',
            bed_decorated: 'assets/dungeon/bed_decorated.gltf',
            bed_frame: 'assets/dungeon/bed_frame.gltf',
            bed_floor: 'assets/dungeon/bed_floor.gltf',
            shelves: 'assets/dungeon/shelves.gltf',
            shelf_large: 'assets/dungeon/shelf_large.gltf',
            shelf_small: 'assets/dungeon/shelf_small.gltf',

            // Floor items - storage
            barrel_large: 'assets/dungeon/barrel_large.gltf',
            barrel_large_decorated: 'assets/dungeon/barrel_large_decorated.gltf',
            barrel_small: 'assets/dungeon/barrel_small.gltf',
            barrel_stack: 'assets/dungeon/barrel_small_stack.gltf',
            box_large: 'assets/dungeon/box_large.gltf',
            box_small: 'assets/dungeon/box_small.gltf',
            box_stacked: 'assets/dungeon/box_stacked.gltf',
            crates_stacked: 'assets/dungeon/crates_stacked.gltf',
            keg: 'assets/dungeon/keg.gltf',
            keg_decorated: 'assets/dungeon/keg_decorated.gltf',

            // Floor items - decorations
            candle_triple: 'assets/dungeon/candle_triple.gltf',
            candle_lit: 'assets/dungeon/candle_lit.gltf',
            plate_food_A: 'assets/dungeon/plate_food_A.gltf',
            plate_food_B: 'assets/dungeon/plate_food_B.gltf',
            plate_stack: 'assets/dungeon/plate_stack.gltf',
            bottle_A: 'assets/dungeon/bottle_A_green.gltf',
            bottle_B: 'assets/dungeon/bottle_B_brown.gltf',
            rubble_large: 'assets/dungeon/rubble_large.gltf',
        };

        // Wall decorations
        this.wallDecorations = [
            'torch_lit', 'torch_mounted',
            'banner_red', 'banner_blue', 'banner_green', 'banner_yellow', 'banner_white', 'banner_brown',
            'banner_shield_red', 'banner_shield_blue', 'banner_shield_gold',
            'banner_triple_red', 'banner_triple_blue',
            'sword_shield', 'sword_shield_gold', 'sword_shield_broken',
            'shelf_candles', 'keyring_hanging'
        ];

        // Floor items
        this.floorItems = [
            // Treasure
            'chest', 'chest_gold', 'coin_stack_large', 'coin_stack_medium',
            'trunk_large_A', 'trunk_large_B', 'trunk_medium_A', 'trunk_small_A',
            // Structures
            'pillar', 'pillar_decorated', 'column', 'barrier', 'barrier_column',
            // Furniture
            'table_long', 'table_long_decorated', 'table_long_tablecloth',
            'table_medium', 'table_medium_decorated', 'table_small', 'table_small_decorated',
            'chair', 'stool', 'bed_decorated', 'bed_frame', 'bed_floor',
            'shelves', 'shelf_large', 'shelf_small',
            // Storage
            'barrel_large', 'barrel_large_decorated', 'barrel_small', 'barrel_stack',
            'box_large', 'box_small', 'box_stacked', 'crates_stacked',
            'keg', 'keg_decorated',
            // Decorations
            'candle_triple', 'candle_lit', 'plate_food_A', 'plate_food_B', 'plate_stack',
            'bottle_A', 'bottle_B', 'rubble_large'
        ];

        // Track wall positions and available floor positions
        this.wallPositions = [];
        this.floorPositions = [];

        // Precompute growth order - spiral out from center
        this.computeGrowthOrder();

        console.log('Dungeon initialized');
        this.loaded = true;

        // Build the dungeon
        this.buildDungeon();
    }

    // Build the dungeon with floor, walls
    async buildDungeon() {
        // Build floor grid
        for (let x = -this.gridRadius; x <= this.gridRadius; x++) {
            for (let y = -this.gridRadius; y <= this.gridRadius; y++) {
                await this.placeFloor(x, y);
                // Track floor positions for random item placement
                this.floorPositions.push({ x, y, hasItem: false });
            }
        }

        // Build back walls along upper edges (negative Y and negative X edges)
        // Back wall along Z axis (negative Y in grid = negative Z in world)
        for (let x = -this.gridRadius; x <= this.gridRadius; x++) {
            await this.placeWall(x, -this.gridRadius - 1, 0); // facing into room
            this.wallPositions.push({ x, y: -this.gridRadius - 1, hasDecor: false, rotation: 0 });
        }

        // Side wall along X axis (negative X edge)
        for (let y = -this.gridRadius; y <= this.gridRadius; y++) {
            await this.placeWall(-this.gridRadius - 1, y, Math.PI / 2); // facing into room
            this.wallPositions.push({ x: -this.gridRadius - 1, y, hasDecor: false, rotation: Math.PI / 2 });
        }

        // Shuffle floor positions for random placement
        this.shuffleArray(this.floorPositions);

        console.log('Dungeon built');
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // No spiral needed - we use wall positions first, then random floor positions
    computeGrowthOrder() {
        // Not used anymore
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
                        roughness: 0.85,
                        metalness: 0.15,
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

    async placeFloor(x, y) {
        const modelId = 'floor_tile';

        const model = await this.loadModel(modelId);
        if (!model) return null;

        const pos = this.worldPos(x, y);
        const mesh = model.clone();
        mesh.position.set(pos.x, 0, pos.z);
        mesh.rotation.y = 0;
        this.scene.add(mesh);

        return { type: 'floor', name: 'Floor' };
    }

    async placeWall(x, y, rotation) {
        const model = await this.loadModel('wall');
        if (!model) return null;

        const pos = this.worldPos(x, y);
        const mesh = model.clone();
        mesh.position.set(pos.x, 0, pos.z);
        mesh.rotation.y = rotation;
        this.scene.add(mesh);

        return { type: 'wall', name: 'Wall' };
    }

    async placeWallDecor(wallPos, modelId) {
        const model = await this.loadModel(modelId);
        if (!model) return null;

        const pos = this.worldPos(wallPos.x, wallPos.y);
        const mesh = model.clone();
        // Position on wall (slightly in front)
        if (wallPos.rotation === 0) {
            mesh.position.set(pos.x, 0, pos.z + 0.5);
        } else {
            mesh.position.set(pos.x + 0.5, 0, pos.z);
        }
        mesh.rotation.y = wallPos.rotation;
        this.scene.add(mesh);

        wallPos.hasDecor = true;
        wallPos.decorModelId = modelId;
        wallPos.decorMesh = mesh;

        const displayName = modelId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        return { type: 'wall_decor', name: displayName };
    }

    async placeFloorItem(floorPos, modelId) {
        const model = await this.loadModel(modelId);
        if (!model) return null;

        const pos = this.worldPos(floorPos.x, floorPos.y);
        const mesh = model.clone();
        mesh.position.set(pos.x, 0, pos.z);
        mesh.rotation.y = Math.floor(Math.random() * 4) * (Math.PI / 2);
        this.scene.add(mesh);

        floorPos.hasItem = true;
        floorPos.itemModelId = modelId;
        floorPos.itemMesh = mesh;

        const displayName = modelId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        return { type: 'floor_item', name: displayName };
    }

    // Main grow function - places next item from room template
    async grow() {
        if (this.templateIndex >= roomTemplate.length) {
            // Template complete - room is fully built!
            return null;
        }

        const item = roomTemplate[this.templateIndex];
        const result = await this.placeTemplateItem(item);
        this.templateIndex++;

        return result;
    }

    async placeTemplateItem(item) {
        const path = `assets/dungeon/${item.file}`;

        try {
            const gltf = await this.loader.loadAsync(path);
            const model = gltf.scene;

            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        map: this.sharedTexture,
                        roughness: 0.85,
                        metalness: 0.15,
                    });
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            const pos = this.worldPos(item.x, item.y);

            // Wall-mounted items get pushed back against the wall
            if (item.wallMount) {
                if (item.wallSide === 'left') {
                    // Left wall (x = -gridRadius - 1), push item toward negative X
                    model.position.set(pos.x - this.tileSize * 0.4, 0, pos.z);
                } else {
                    // Back wall (y = -gridRadius - 1), push item toward negative Z
                    model.position.set(pos.x, 0, pos.z - this.tileSize * 0.4);
                }
            } else {
                model.position.set(pos.x, 0, pos.z);
            }

            model.rotation.y = (item.rotation * Math.PI) / 180;
            this.scene.add(model);

            this.placedItems.push({ ...item, mesh: model });

            const displayName = item.file.replace('.gltf', '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            return { type: 'template_item', name: displayName };
        } catch (e) {
            console.warn(`Failed to load ${item.file}:`, e);
            return null;
        }
    }

    getStats() {
        return {
            buildings: this.placedItems.length,
            tiles: roomTemplate.length
        };
    }

    save() {
        const data = {
            templateIndex: this.templateIndex,
            placedItems: this.placedItems.map(item => ({
                x: item.x, y: item.y, file: item.file, rotation: item.rotation
            }))
        };
        localStorage.setItem('tinyHabitsDungeon', JSON.stringify(data));
    }

    async load() {
        const saved = localStorage.getItem('tinyHabitsDungeon');
        if (!saved) return false;

        try {
            const data = JSON.parse(saved);

            // Restore placed items from template
            if (data.placedItems) {
                for (const item of data.placedItems) {
                    await this.placeTemplateItem(item);
                }
                this.templateIndex = data.templateIndex || data.placedItems.length;
            }

            return true;
        } catch (e) {
            console.warn('Failed to load dungeon:', e);
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

window.Dungeon = Dungeon;
