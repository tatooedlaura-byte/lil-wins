import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Space base template - designed in space-designer.html
const spaceTemplate = [
  { "x": -6, "y": -6, "file": "basemodule_E.gltf", "rotation": 0 },
  { "x": -5, "y": -6, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": -4, "y": -6, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": -3, "y": -6, "file": "basemodule_A.gltf", "rotation": 0 },
  { "x": -2, "y": -6, "file": "tunnel_straight_B.gltf", "rotation": 0 },
  { "x": -1, "y": -6, "file": "tunnel_straight_B.gltf", "rotation": 0 },
  { "x": 0, "y": -6, "file": "tunnel_straight_B.gltf", "rotation": 0 },
  { "x": 1, "y": -6, "file": "basemodule_A.gltf", "rotation": 0 },
  { "x": 2, "y": -6, "file": "spacetruck_large.gltf", "rotation": 0 },
  { "x": 5, "y": -6, "file": "terrain_low_curved.gltf", "rotation": 0 },
  { "x": 6, "y": -6, "file": "terrain_low.gltf", "rotation": 0 },
  { "x": -6, "y": -5, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": -5, "y": -5, "file": "roofmodule_cargo_C.gltf", "rotation": 0 },
  { "x": -4, "y": -5, "file": "cargo_B_stacked.gltf", "rotation": 0 },
  { "x": -3, "y": -5, "file": "tunnel_straight_B.gltf", "rotation": 90 },
  { "x": -2, "y": -5, "file": "terrain_slope_outer_corner.gltf", "rotation": 270 },
  { "x": -1, "y": -5, "file": "terrain_slope_outer_corner.gltf", "rotation": 180 },
  { "x": 1, "y": -5, "file": "tunnel_straight_B.gltf", "rotation": 90 },
  { "x": 2, "y": -5, "file": "spacetruck_large.gltf", "rotation": 0 },
  { "x": 3, "y": -5, "file": "landingpad_small.gltf", "rotation": 0 },
  { "x": 4, "y": -5, "file": "lander_base.gltf", "rotation": 0 },
  { "x": 5, "y": -5, "file": "rock_A.gltf", "rotation": 0 },
  { "x": 6, "y": -5, "file": "terrain_low_curved.gltf", "rotation": 0 },
  { "x": -6, "y": -4, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": -5, "y": -4, "file": "cargo_A_stacked.gltf", "rotation": 0 },
  { "x": -4, "y": -4, "file": "roofmodule_cargo_B.gltf", "rotation": 0 },
  { "x": -3, "y": -4, "file": "tunnel_straight_B.gltf", "rotation": 90 },
  { "x": -2, "y": -4, "file": "terrain_slope_outer_corner.gltf", "rotation": 0 },
  { "x": -1, "y": -4, "file": "terrain_slope_outer_corner.gltf", "rotation": 90 },
  { "x": 1, "y": -4, "file": "basemodule_D.gltf", "rotation": 0 },
  { "x": 2, "y": -4, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": 3, "y": -4, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": 4, "y": -4, "file": "basemodule_E.gltf", "rotation": 0 },
  { "x": -6, "y": -3, "file": "basemodule_garage.gltf", "rotation": 0 },
  { "x": -5, "y": -3, "file": "tunnel_straight_B.gltf", "rotation": 0 },
  { "x": -4, "y": -3, "file": "tunnel_straight_B.gltf", "rotation": 0 },
  { "x": -3, "y": -3, "file": "basemodule_D.gltf", "rotation": 0 },
  { "x": 0, "y": -3, "file": "tunnel_diagonal_long_A.gltf", "rotation": 90 },
  { "x": 1, "y": -3, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": 2, "y": -3, "file": "roofmodule_cargo_C.gltf", "rotation": 0 },
  { "x": 3, "y": -3, "file": "windturbine_tall.gltf", "rotation": 0 },
  { "x": 4, "y": -3, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": 6, "y": -3, "file": "terrain_slope_outer_corner.gltf", "rotation": 270 },
  { "x": -6, "y": -2, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": -5, "y": -2, "file": "tunnel_diagonal_long_A.gltf", "rotation": 0 },
  { "x": -3, "y": -2, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": -1, "y": -2, "file": "tunnel_diagonal_long_A.gltf", "rotation": 270 },
  { "x": 1, "y": -2, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": 2, "y": -2, "file": "cargodepot_C.gltf", "rotation": 0 },
  { "x": 3, "y": -2, "file": "tunnel_diagonal_short_B.gltf", "rotation": 0 },
  { "x": 4, "y": -2, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": 6, "y": -2, "file": "terrain_slope_outer_corner.gltf", "rotation": 0 },
  { "x": -6, "y": -1, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": -4, "y": -1, "file": "basemodule_garage.gltf", "rotation": 0 },
  { "x": -3, "y": -1, "file": "basemodule_E.gltf", "rotation": 0 },
  { "x": -2, "y": -1, "file": "basemodule_D.gltf", "rotation": 0 },
  { "x": -1, "y": -1, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": 0, "y": -1, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": 1, "y": -1, "file": "basemodule_E.gltf", "rotation": 0 },
  { "x": 2, "y": -1, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": 3, "y": -1, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": 4, "y": -1, "file": "basemodule_A.gltf", "rotation": 0 },
  { "x": 6, "y": -1, "file": "solarpanel.gltf", "rotation": 90 },
  { "x": -6, "y": 0, "file": "basemodule_E.gltf", "rotation": 0 },
  { "x": -5, "y": 0, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": -4, "y": 0, "file": "basemodule_D.gltf", "rotation": 0 },
  { "x": -3, "y": 0, "file": "basemodule_C.gltf", "rotation": 0 },
  { "x": -1, "y": 0, "file": "tunnel_diagonal_long_A.gltf", "rotation": 0 },
  { "x": 1, "y": 0, "file": "tunnel_straight_B.gltf", "rotation": 90 },
  { "x": 2, "y": 0, "file": "containers_B.gltf", "rotation": 0 },
  { "x": 3, "y": 0, "file": "tunnel_diagonal_long_A.gltf", "rotation": 90 },
  { "x": 5, "y": 0, "file": "structure_tall.gltf", "rotation": 0 },
  { "x": 6, "y": 0, "file": "solarpanel.gltf", "rotation": 90 },
  { "x": -6, "y": 1, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": -5, "y": 1, "file": "roofmodule_solarpanels.gltf", "rotation": 0 },
  { "x": -4, "y": 1, "file": "tunnel_straight_B.gltf", "rotation": 90 },
  { "x": -3, "y": 1, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": -1, "y": 1, "file": "roofmodule_cargo_C.gltf", "rotation": 0 },
  { "x": 0, "y": 1, "file": "tunnel_diagonal_long_A.gltf", "rotation": 0 },
  { "x": 1, "y": 1, "file": "tunnel_straight_B.gltf", "rotation": 90 },
  { "x": 2, "y": 1, "file": "tunnel_diagonal_long_A.gltf", "rotation": 90 },
  { "x": 3, "y": 1, "file": "rock_A.gltf", "rotation": 0 },
  { "x": 5, "y": 1, "file": "structure_tall.gltf", "rotation": 0 },
  { "x": 6, "y": 1, "file": "solarpanel.gltf", "rotation": 90 },
  { "x": -6, "y": 2, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": -5, "y": 2, "file": "lander_B.gltf", "rotation": 0 },
  { "x": -4, "y": 2, "file": "tunnel_straight_B.gltf", "rotation": 270 },
  { "x": -3, "y": 2, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": -2, "y": 2, "file": "roofmodule_cargo_B.gltf", "rotation": 0 },
  { "x": 0, "y": 2, "file": "cargodepot_B.gltf", "rotation": 180 },
  { "x": 1, "y": 2, "file": "basemodule_E.gltf", "rotation": 0 },
  { "x": 2, "y": 2, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": 3, "y": 2, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": 4, "y": 2, "file": "basemodule_D.gltf", "rotation": 0 },
  { "x": 6, "y": 2, "file": "solarpanel.gltf", "rotation": 90 },
  { "x": -6, "y": 3, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": -4, "y": 3, "file": "basemodule_garage.gltf", "rotation": 0 },
  { "x": -3, "y": 3, "file": "basemodule_C.gltf", "rotation": 0 },
  { "x": -1, "y": 3, "file": "roofmodule_solarpanels.gltf", "rotation": 0 },
  { "x": 0, "y": 3, "file": "tunnel_diagonal_long_B.gltf", "rotation": 90 },
  { "x": 1, "y": 3, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": 2, "y": 3, "file": "roofmodule_cargo_A.gltf", "rotation": 0 },
  { "x": 3, "y": 3, "file": "roofmodule_cargo_B.gltf", "rotation": 0 },
  { "x": 4, "y": 3, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": 6, "y": 3, "file": "terrain_slope_outer_corner.gltf", "rotation": 270 },
  { "x": -6, "y": 4, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": -5, "y": 4, "file": "tunnel_diagonal_long_B.gltf", "rotation": 90 },
  { "x": -4, "y": 4, "file": "tunnel_straight_B.gltf", "rotation": 90 },
  { "x": -3, "y": 4, "file": "tunnel_diagonal_long_B.gltf", "rotation": 0 },
  { "x": -1, "y": 4, "file": "tunnel_diagonal_long_B.gltf", "rotation": 90 },
  { "x": 1, "y": 4, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": 2, "y": 4, "file": "cargo_A_stacked.gltf", "rotation": 0 },
  { "x": 3, "y": 4, "file": "cargo_B.gltf", "rotation": 0 },
  { "x": 4, "y": 4, "file": "tunnel_straight_A.gltf", "rotation": 90 },
  { "x": 6, "y": 4, "file": "terrain_slope.gltf", "rotation": 0 },
  { "x": -6, "y": 5, "file": "basemodule_B.gltf", "rotation": 0 },
  { "x": -4, "y": 5, "file": "landingpad_small.gltf", "rotation": 0 },
  { "x": -3, "y": 5, "file": "lander_B.gltf", "rotation": 0 },
  { "x": -2, "y": 5, "file": "basemodule_C.gltf", "rotation": 0 },
  { "x": -1, "y": 5, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": 0, "y": 5, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": 1, "y": 5, "file": "basemodule_garage.gltf", "rotation": 0 },
  { "x": 2, "y": 5, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": 3, "y": 5, "file": "tunnel_straight_A.gltf", "rotation": 0 },
  { "x": 4, "y": 5, "file": "basemodule_E.gltf", "rotation": 0 }
];

// SpaceBase class - builds a space colony on an alien planet
class SpaceBase {
    constructor(container) {
        this.container = container;
        this.grid = new Map(); // "x,y" -> tile data
        this.models = {};
        this.tileSize = 2; // Each tile is 2x2 units
        this.blockSize = 3; // Modules in 3x3 blocks
        this.gridRadius = 6; // Base extends this many tiles from center (matches template)
        this.mixers = [];
        this.clock = new THREE.Clock();
        this.growthOrder = []; // Track order to grow base
        this.templateIndex = 0; // Current position in template
        this.placedItems = []; // Track placed template items

        this.init();
        this.loadModels();
    }

    init() {
        // Scene - Mars atmosphere
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xc2703a); // Mars orange-red sky

        // Add fog for dusty Mars atmosphere
        this.scene.fog = new THREE.Fog(0xc2703a, 30, 80);

        // Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(15, 18, 15);
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
        this.controls.maxDistance = 35;
        this.controls.maxPolarAngle = Math.PI / 2.2;

        // Lighting - Mars style with warm tones
        const ambientLight = new THREE.AmbientLight(0xffccaa, 0.5);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
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

        // Add warm Mars sunlight
        const pointLight1 = new THREE.PointLight(0xffaa66, 0.4, 50);
        pointLight1.position.set(-10, 8, -10);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff8844, 0.4, 50);
        pointLight2.position.set(10, 8, 10);
        this.scene.add(pointLight2);

        // Ground plane - Mars red dirt surface
        const groundGeometry = new THREE.PlaneGeometry(35, 35);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513, // Mars rusty red-brown
            roughness: 0.95,
            metalness: 0.05,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
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
        const texturePath = 'assets/space/spacebits_texture.png';
        this.sharedTexture = await this.textureLoader.loadAsync(texturePath);
        this.sharedTexture.flipY = false;

        // Model paths - tunnels are connectors, modules are structures
        this.modelPaths = {
            // Tunnels (connectors - like roads)
            tunnel_straight: 'assets/space/tunnel_straight_A.gltf',
            tunnel_corner: 'assets/space/tunnel_diagonal_short_A.gltf',

            // Base modules (main structures)
            basemodule_A: 'assets/space/basemodule_A.gltf',
            basemodule_B: 'assets/space/basemodule_B.gltf',
            basemodule_C: 'assets/space/basemodule_C.gltf',
            basemodule_D: 'assets/space/basemodule_D.gltf',
            basemodule_E: 'assets/space/basemodule_E.gltf',
            basemodule_garage: 'assets/space/basemodule_garage.gltf',

            // Structures
            structure_low: 'assets/space/structure_low.gltf',
            structure_tall: 'assets/space/structure_tall.gltf',
            drill_structure: 'assets/space/drill_structure.gltf',
            windturbine_low: 'assets/space/windturbine_low.gltf',
            windturbine_tall: 'assets/space/windturbine_tall.gltf',

            // Cargo & storage
            cargodepot_A: 'assets/space/cargodepot_A.gltf',
            cargodepot_B: 'assets/space/cargodepot_B.gltf',
            cargodepot_C: 'assets/space/cargodepot_C.gltf',
            containers_A: 'assets/space/containers_A.gltf',
            containers_B: 'assets/space/containers_B.gltf',
            containers_C: 'assets/space/containers_C.gltf',
            containers_D: 'assets/space/containers_D.gltf',

            // Landing pads and vehicles
            landingpad_large: 'assets/space/landingpad_large.gltf',
            landingpad_small: 'assets/space/landingpad_small.gltf',
            lander_A: 'assets/space/lander_A.gltf',
            lander_B: 'assets/space/lander_B.gltf',
            spacetruck: 'assets/space/spacetruck.gltf',

            // Decorations
            solarpanel: 'assets/space/solarpanel.gltf',
            lights: 'assets/space/lights.gltf',
            rock_A: 'assets/space/rock_A.gltf',
            rock_B: 'assets/space/rock_B.gltf',
        };

        // Building tiers by importance (center = most important)
        this.buildingTiers = {
            core: ['basemodule_E', 'structure_tall', 'drill_structure'],
            primary: ['basemodule_A', 'basemodule_B', 'basemodule_C', 'basemodule_D'],
            secondary: ['cargodepot_A', 'cargodepot_B', 'structure_low', 'windturbine_tall'],
            outer: ['containers_A', 'containers_B', 'solarpanel', 'windturbine_low'],
        };

        // Precompute growth order - spiral out from center
        this.computeGrowthOrder();

        console.log('SpaceBase initialized');
        this.loaded = true;

        // Only build tunnel grid if NOT using a template
        if (spaceTemplate.length === 0) {
            this.buildTunnelGrid();
        }
    }

    // Build the complete tunnel grid upfront
    async buildTunnelGrid() {
        const spacing = this.blockSize + 1; // 4

        // Place tunnels in a grid pattern
        for (let x = -this.gridRadius; x <= this.gridRadius; x++) {
            for (let y = -this.gridRadius; y <= this.gridRadius; y++) {
                if (this.isTunnelPosition(x, y)) {
                    await this.placeTunnel(x, y);
                }
            }
        }

        console.log('Tunnel grid complete');
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
                        roughness: 0.6,
                        metalness: 0.3,
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

    // Check if a position should be a tunnel (but NOT intersections - those are buildable)
    isTunnelPosition(x, y) {
        const spacing = this.blockSize + 1; // 4
        const onXAxis = (x % spacing === 0);
        const onYAxis = (y % spacing === 0);
        // Tunnel if on one axis but NOT both (intersections are buildable)
        return (onXAxis || onYAxis) && !(onXAxis && onYAxis);
    }

    // Check if position is at an intersection (these are now buildable spaces)
    isIntersection(x, y) {
        const spacing = this.blockSize + 1;
        return (x % spacing === 0) && (y % spacing === 0);
    }

    // Get adjacent tiles that are tunnels
    getAdjacentTunnels(x, y) {
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
            if (tile && tile.type === 'tunnel') {
                adjacent.push(dir.bit);
            }
        }
        return adjacent;
    }

    // Determine tunnel model and rotation based on connections
    getTunnelConfig(connections) {
        const count = connections.length;
        const offset = Math.PI; // 180 degree offset (90 + 90 counterclockwise)

        if (count === 0) {
            return { model: 'tunnel_straight', rotation: offset };
        }
        if (count === 1) {
            return { model: 'tunnel_straight', rotation: connections[0] * (Math.PI / 2) + offset };
        }
        if (count === 2) {
            const [a, b] = connections.sort((x, y) => x - y);
            if (b - a === 2) {
                // Straight (opposite sides)
                return { model: 'tunnel_straight', rotation: a * (Math.PI / 2) + offset };
            } else {
                // Corner
                if (a === 0 && b === 1) return { model: 'tunnel_corner', rotation: Math.PI + offset };
                if (a === 1 && b === 2) return { model: 'tunnel_corner', rotation: Math.PI / 2 + offset };
                if (a === 2 && b === 3) return { model: 'tunnel_corner', rotation: 0 + offset };
                if (a === 0 && b === 3) return { model: 'tunnel_corner', rotation: -Math.PI / 2 + offset };
                return { model: 'tunnel_corner', rotation: a * (Math.PI / 2) + offset };
            }
        }
        // 3 or 4 connections - just use straight tunnel
        return { model: 'tunnel_straight', rotation: offset };
    }

    async placeTunnel(x, y) {
        const k = this.key(x, y);
        if (this.grid.has(k)) return null;

        const connections = this.getAdjacentTunnels(x, y);
        const { model: modelId, rotation } = this.getTunnelConfig(connections);

        const model = await this.loadModel(modelId);
        if (!model) return null;

        const pos = this.worldPos(x, y);
        const mesh = model.clone();
        mesh.position.set(pos.x, 0, pos.z);
        mesh.rotation.y = rotation;
        this.scene.add(mesh);

        this.grid.set(k, {
            type: 'tunnel',
            modelId,
            mesh,
            rotation,
            x, y
        });

        // Update adjacent tunnels to reconnect properly
        await this.updateAdjacentTunnels(x, y);

        return { type: 'tunnel', name: 'Tunnel' };
    }

    async updateAdjacentTunnels(x, y) {
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

            if (tile && tile.type === 'tunnel') {
                const connections = this.getAdjacentTunnels(nx, ny);
                const { model: modelId, rotation } = this.getTunnelConfig(connections);

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

    async placeModule(x, y, modelId) {
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
            type: 'module',
            modelId,
            mesh,
            x, y
        });

        // Format display name
        const displayName = modelId
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());

        return { type: 'module', name: displayName };
    }

    // Pick a module based on distance from center
    pickModule(x, y) {
        const dist = Math.max(Math.abs(x), Math.abs(y));

        let tier;
        if (dist <= 2) {
            tier = 'core';
        } else if (dist <= 5) {
            tier = 'primary';
        } else if (dist <= 8) {
            tier = 'secondary';
        } else {
            tier = 'outer';
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

    // Main grow function - uses template if available, otherwise random placement
    async grow() {
        // If we have a template, use it
        if (spaceTemplate.length > 0) {
            if (this.templateIndex >= spaceTemplate.length) {
                return null; // Template complete
            }
            const item = spaceTemplate[this.templateIndex];
            const result = await this.placeTemplateItem(item);
            this.templateIndex++;
            return result;
        }

        // Otherwise use random spiral placement
        const pos = this.findNextGrowthPosition();
        if (!pos) return null;

        // Skip tunnel positions - they're already built
        if (this.isTunnelPosition(pos.x, pos.y)) {
            // Find next non-tunnel position
            for (const p of this.growthOrder) {
                const k = this.key(p.x, p.y);
                if (!this.grid.has(k) && !this.isTunnelPosition(p.x, p.y)) {
                    const moduleId = this.pickModule(p.x, p.y);
                    return await this.placeModule(p.x, p.y, moduleId);
                }
            }
            return null;
        }

        const moduleId = this.pickModule(pos.x, pos.y);
        return await this.placeModule(pos.x, pos.y, moduleId);
    }

    async placeTemplateItem(item) {
        const path = `assets/space/${item.file}`;

        try {
            const gltf = await this.loader.loadAsync(path);
            const model = gltf.scene;

            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        map: this.sharedTexture,
                        roughness: 0.6,
                        metalness: 0.3,
                    });
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            const pos = this.worldPos(item.x, item.y);
            model.position.set(pos.x, 0, pos.z);
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
        // If using template, report template progress
        if (spaceTemplate.length > 0) {
            return {
                buildings: this.placedItems.length,
                tiles: spaceTemplate.length
            };
        }

        // Otherwise count grid items
        let modules = 0;
        let tunnels = 0;

        for (const [, tile] of this.grid) {
            if (tile.type === 'module') modules++;
            else if (tile.type === 'tunnel') tunnels++;
        }

        return { buildings: modules, tiles: this.grid.size };
    }

    save() {
        // If using template, save template progress
        if (spaceTemplate.length > 0) {
            const data = {
                templateIndex: this.templateIndex,
                placedItems: this.placedItems.map(item => ({
                    x: item.x, y: item.y, file: item.file, rotation: item.rotation
                }))
            };
            localStorage.setItem('tinyHabitsSpaceBase', JSON.stringify(data));
            return;
        }

        // Otherwise save modules - tunnels are auto-generated
        const data = [];
        for (const [, tile] of this.grid) {
            if (tile.type === 'module') {
                data.push({
                    x: tile.x,
                    y: tile.y,
                    modelId: tile.modelId,
                });
            }
        }
        localStorage.setItem('tinyHabitsSpaceBase', JSON.stringify(data));
    }

    async load() {
        const saved = localStorage.getItem('tinyHabitsSpaceBase');
        if (!saved) return false;

        try {
            const data = JSON.parse(saved);

            // If using template and data has placedItems, load template progress
            if (spaceTemplate.length > 0 && data.placedItems) {
                for (const item of data.placedItems) {
                    await this.placeTemplateItem(item);
                }
                this.templateIndex = data.templateIndex || data.placedItems.length;
                return true;
            }

            // Otherwise load legacy module data
            if (Array.isArray(data)) {
                // Sort by distance from center
                data.sort((a, b) => {
                    const distA = Math.max(Math.abs(a.x), Math.abs(a.y));
                    const distB = Math.max(Math.abs(b.x), Math.abs(b.y));
                    return distA - distB;
                });

                // Only load modules - tunnels are already built
                for (const tile of data) {
                    await this.placeModule(tile.x, tile.y, tile.modelId);
                }
            }

            return true;
        } catch (e) {
            console.warn('Failed to load space base:', e);
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

window.SpaceBase = SpaceBase;
