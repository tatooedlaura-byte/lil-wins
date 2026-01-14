import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Neighborhood starter template - custom designed cozy park
const neighborhoodTemplate = [
    { q: -4, r: 5, tile: 'floor_grass', building: 'fence_straight_long' },
    { q: -5, r: 5, tile: 'floor_grass', building: 'fence_corner' },
    { q: -2, r: 1, tile: 'floor_grass', building: 'house' },
    { q: -3, r: -3, tile: 'floor_grass', building: 'swing_B_large' },
    { q: -3, r: 3, tile: 'floor_grass', building: 'bush' },
    { q: -1, r: 3, tile: 'floor_grass', building: 'bush_large' },
    { q: -5, r: -5, tile: 'floor_grass', building: 'hedge_corner', rotation: 0 },
    { q: -5, r: -4, tile: 'floor_grass', building: 'hedge_straight', rotation: 90 },
    { q: -5, r: -3, tile: 'floor_grass', building: 'hedge_straight', rotation: 90 },
    { q: -5, r: -2, tile: 'floor_grass', building: 'hedge_straight', rotation: 90 },
    { q: -5, r: -1, tile: 'floor_grass', building: 'hedge_straight', rotation: 90 },
    { q: -5, r: 0, tile: 'floor_grass', building: 'hedge_straight', rotation: 90 },
    { q: -5, r: 1, tile: 'floor_grass', building: 'hedge_straight', rotation: 90 },
    { q: -5, r: 2, tile: 'floor_grass', building: 'hedge_straight', rotation: 90 },
    { q: -5, r: 3, tile: 'floor_grass', building: 'hedge_straight', rotation: 90 },
    { q: -5, r: 4, tile: 'floor_grass', building: 'hedge_straight', rotation: 90 },
    { q: -4, r: -5, tile: 'floor_grass', building: 'hedge_straight' },
    { q: -3, r: -5, tile: 'floor_grass', building: 'hedge_straight' },
    { q: -2, r: -5, tile: 'floor_grass', building: 'hedge_straight' },
    { q: -1, r: -5, tile: 'floor_grass', building: 'hedge_straight' },
    { q: 0, r: -5, tile: 'floor_grass', building: 'hedge_straight' },
    { q: 1, r: -5, tile: 'floor_grass', building: 'hedge_straight' },
    { q: 2, r: -5, tile: 'floor_grass', building: 'hedge_straight' },
    { q: 3, r: -5, tile: 'floor_grass', building: 'hedge_straight' },
    { q: 4, r: -5, tile: 'floor_grass', building: 'hedge_straight' },
    { q: 5, r: -5, tile: 'floor_grass', building: 'hedge_straight' },
    { q: 1, r: 5, tile: 'floor_grass', building: 'fence_straight_long' },
    { q: 2, r: 5, tile: 'floor_grass', building: 'fence_straight_long' },
    { q: 3, r: 5, tile: 'floor_grass', building: 'fence_straight_long' },
    { q: 4, r: 5, tile: 'floor_grass', building: 'fence_straight_long' },
    { q: 5, r: 5, tile: 'floor_grass', building: 'fence_straight_long' },
    { q: 0, r: 5, tile: 'floor_grass', building: 'fence_straight_long' },
    { q: -3, r: 5, tile: 'floor_grass', building: 'mailbox' },
    { q: 2, r: -3, tile: 'floor_grass', building: 'slide_B' },
    { q: 5, r: 0, tile: 'floor_grass', building: 'merry_go_round' },
    { q: 0, r: 1, tile: 'floor_grass', building: 'picnic_table' },
    { q: 4, r: -3, tile: 'floor_grass', building: 'swing_A_large' },
    { q: -2, r: 3, tile: 'floor_grass', building: 'cobble_stones_large' },
    { q: -2, r: 4, tile: 'floor_grass', building: 'cobble_stones_large' },
    { q: -2, r: 5, tile: 'floor_grass', building: 'cobble_stones_large' },
    { q: 0, r: 4, tile: 'floor_grass', building: 'cart' },
    { q: 0, r: -3, tile: 'floor_grass', building: 'seesaw_small' },
    { q: -4, r: -4, tile: 'floor_grass', building: 'tree_large' },
    { q: -4, r: 1, tile: 'floor_grass', building: 'tree_large' },
    { q: 5, r: -4, tile: 'floor_grass', building: 'tree_large' },
    { q: -2, r: -1, tile: 'floor_grass', building: 'monkeybar_B' },
    { q: 2, r: 2, tile: 'floor_grass', building: 'blanket_red' },
    { q: 2, r: 1, tile: 'floor_grass', building: 'pillow_large_green' },
    { q: 2, r: 3, tile: 'floor_grass', building: 'pillow_large_blue' },
    { q: 1, r: 2, tile: 'floor_grass', building: 'picnic_basket_round' },
    { q: 5, r: 3, tile: 'floor_grass', building: 'sandbox_round_decorated' },
    { q: 4, r: 4, tile: 'floor_grass', building: 'tree_large' },
    { q: 3, r: 1, tile: 'floor_grass', building: 'sandwich' },
    { q: 3, r: 3, tile: 'floor_grass', building: 'serving_tray' },
    { q: 5, r: 2, tile: 'floor_grass', building: 'bucket_A' },
    { q: -1, r: 5, tile: 'floor_grass', building: 'bench' },
    { q: -3, r: -4, tile: 'floor_grass', building: 'grass_B' },
    { q: -2, r: -4, tile: 'floor_grass', building: 'grass_A' },
    { q: -4, r: -1, tile: 'floor_grass', building: 'flower_B' },
    { q: 1, r: -1, tile: 'floor_grass', building: 'flower_A' },
    { q: 3, r: -1, tile: 'floor_grass', building: 'bird' },
    { q: -1, r: 4, tile: 'floor_grass', building: 'boots' },
    { q: -3, r: 4, tile: 'floor_grass', building: 'package' },
    { q: -4, r: 3, tile: 'floor_grass', building: 'foliage_A' },
    { q: -1, r: -3, tile: 'floor_grass', building: 'foliage_B' },
    { q: -1, r: -4, tile: 'floor_grass', building: 'bush' },
    { q: 1, r: -4, tile: 'floor_grass', building: 'bush' },
    { q: 1, r: -2, tile: 'floor_grass', building: 'bush_large' },
    { q: 2, r: 4, tile: 'floor_grass', building: 'flower_A' },
    { q: 1, r: 4, tile: 'floor_grass', building: 'bird' },
    { q: 2, r: 0, tile: 'floor_grass', building: 'doormat' },
];

// Neighborhood class - 3D cozy suburban park
class Neighborhood {
    constructor(container) {
        this.container = container;
        this.hexes = [];
        this.models = {};
        this.gridRadius = 10;
        this.clock = new THREE.Clock();
        this.templateIndex = 0;

        this.gridSpacing = 2;
        this.hexHeight = 0.1;

        this.init();
        this.loadModels();
    }

    init() {
        // Scene with bright sunny sky
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        this.scene.fog = new THREE.Fog(0x87CEEB, 20, 60);

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
        this.controls.minDistance = 3;
        this.controls.maxDistance = 40;
        this.controls.maxPolarAngle = Math.PI / 2.2;

        // Bright ambient lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        // Warm sun light
        const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.0);
        sunLight.position.set(10, 20, 10);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.camera.left = -20;
        sunLight.shadow.camera.right = 20;
        sunLight.shadow.camera.top = 20;
        sunLight.shadow.camera.bottom = -20;
        this.scene.add(sunLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-10, 10, -10);
        this.scene.add(fillLight);

        // Green grass ground with texture matching the tiles
        const groundSize = 30;
        const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);

        // Load the grass texture
        const textureLoader = new THREE.TextureLoader();
        const grassTexture = textureLoader.load('assets/tinytreats/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/Textures/tiny_treats_grass_texture.png');
        grassTexture.wrapS = THREE.RepeatWrapping;
        grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(15, 15); // Tile the texture across the ground
        grassTexture.colorSpace = THREE.SRGBColorSpace;

        const groundMat = new THREE.MeshStandardMaterial({
            map: grassTexture,
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

        const basePath = 'assets/tinytreats';

        // Model definitions from Tiny Treats packs
        this.modelDefs = {
            // Floor tiles (Pretty Park)
            floor_grass: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/floor_grass_sliced_base.gltf`, type: 'tile' },
            floor_grass_A: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/floor_grass_sliced_A.gltf`, type: 'tile' },
            cobble_stones: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/cobble_stones.gltf`, type: 'tile' },
            cobble_stones_large: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/cobble_stones_large.gltf`, type: 'tile' },

            // Homely House tiles
            cobblestones: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/cobblestones.gltf`, type: 'tile' },
            floor_base: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/floor_base.gltf`, type: 'tile' },

            // Pretty Park - Main features
            fountain: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/fountain.gltf`, type: 'building', name: 'Fountain' },
            bench: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/bench.gltf`, type: 'building', name: 'Park Bench' },
            street_lantern: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/street_lantern.gltf`, type: 'building', name: 'Street Lamp' },
            trashcan: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/trashcan.gltf`, type: 'decoration', name: 'Trash Can' },

            // Pretty Park - Nature
            tree: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/tree.gltf`, type: 'decoration', name: 'Tree' },
            tree_large: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/tree_large.gltf`, type: 'building', name: 'Large Tree' },
            bush: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/bush.gltf`, type: 'decoration', name: 'Bush' },
            bush_large: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/bush_large.gltf`, type: 'decoration', name: 'Large Bush' },
            flower_A: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/flower_A.gltf`, type: 'decoration', name: 'Flowers' },
            flower_B: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/flower_B.gltf`, type: 'decoration', name: 'Flowers' },
            grass_A: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/grass_A.gltf`, type: 'decoration', name: 'Grass' },
            grass_B: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/grass_B.gltf`, type: 'decoration', name: 'Grass' },
            bird: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/bird.gltf`, type: 'decoration', name: 'Bird' },

            // Pretty Park - Hedges
            hedge_straight: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/hedge_straight.gltf`, type: 'decoration', name: 'Hedge' },
            hedge_straight_long: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/hedge_straight_long.gltf`, type: 'decoration', name: 'Long Hedge' },
            hedge_corner: { path: `${basePath}/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/hedge_corner.gltf`, type: 'decoration', name: 'Corner Hedge' },

            // Homely House - Buildings
            house: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/house.gltf`, type: 'building', name: 'Cozy House' },
            mailbox: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/mailbox.gltf`, type: 'decoration', name: 'Mailbox' },
            bench_A: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/bench_A.gltf`, type: 'decoration', name: 'Garden Bench' },
            bench_B: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/bench_B.gltf`, type: 'decoration', name: 'Garden Bench' },

            // Homely House - Fences
            fence_straight: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/fence_straight.gltf`, type: 'decoration', name: 'Fence' },
            fence_straight_long: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/fence_straight_long.gltf`, type: 'decoration', name: 'Long Fence' },
            fence_corner: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/fence_corner.gltf`, type: 'decoration', name: 'Corner Fence' },
            fence_open: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/fence_open.gltf`, type: 'decoration', name: 'Open Fence' },
            gate_single: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/gate_single.gltf`, type: 'building', name: 'Garden Gate' },

            // Homely House - Decor
            foliage_A: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/foliage_A.gltf`, type: 'decoration', name: 'Foliage' },
            foliage_B: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/foliage_B.gltf`, type: 'decoration', name: 'Foliage' },
            doormat: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/doormat.gltf`, type: 'decoration', name: 'Doormat' },
            boots: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/boots.gltf`, type: 'decoration', name: 'Boots' },
            package: { path: `${basePath}/Tiny_Treats_Homely_House_1.0_FREE/Assets/gltf/package.gltf`, type: 'decoration', name: 'Package' },

            // Fun Playground
            swing_A_large: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/swing_A_large.gltf`, type: 'building', name: 'Swing Set' },
            swing_A_small: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/swing_A_small.gltf`, type: 'building', name: 'Small Swing' },
            swing_B_large: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/swing_B_large.gltf`, type: 'building', name: 'Swing Set' },
            slide_A: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/slide_A.gltf`, type: 'building', name: 'Slide' },
            slide_B: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/slide_B.gltf`, type: 'building', name: 'Tall Slide' },
            merry_go_round: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/merry_go_round.gltf`, type: 'building', name: 'Merry-Go-Round' },
            seesaw_large: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/seesaw_large.gltf`, type: 'building', name: 'Seesaw' },
            seesaw_small: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/seesaw_small.gltf`, type: 'building', name: 'Small Seesaw' },
            monkeybar_A: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/monkeybar_A.gltf`, type: 'building', name: 'Monkey Bars' },
            monkeybar_B: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/monkeybar_B.gltf`, type: 'building', name: 'Monkey Bars' },
            sandbox_round: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/sandbox_round.gltf`, type: 'building', name: 'Sandbox' },
            sandbox_round_decorated: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/sandbox_round_decorated.gltf`, type: 'building', name: 'Decorated Sandbox' },
            sandbox_square: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/sandbox_square.gltf`, type: 'building', name: 'Square Sandbox' },
            spring_horse_A: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/spring_horse_A.gltf`, type: 'decoration', name: 'Spring Horse' },
            spring_horse_B: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/spring_horse_B.gltf`, type: 'decoration', name: 'Spring Horse' },
            picnic_table: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/picnic_table.gltf`, type: 'building', name: 'Picnic Table' },
            sandcastle_A: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/sandcastle_A.gltf`, type: 'decoration', name: 'Sandcastle' },
            sandcastle_B: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/sandcastle_B.gltf`, type: 'decoration', name: 'Sandcastle' },
            bucket_A: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/bucket_A.gltf`, type: 'decoration', name: 'Bucket' },
            cart: { path: `${basePath}/Tiny_Treats_Fun_Playground_1.0_FREE/Assets/gltf/cart.gltf`, type: 'decoration', name: 'Cart' },

            // House Plants
            plant_A: { path: `${basePath}/Tiny_Treats_House_Plants_1.0_FREE/Assets/gltf/cacti_plant_pot_large.gltf`, type: 'decoration', name: 'Potted Plant' },
            plant_B: { path: `${basePath}/Tiny_Treats_House_Plants_1.0_FREE/Assets/gltf/cacti_plant_pot_small.gltf`, type: 'decoration', name: 'Potted Plant' },

            // Pleasant Picnic
            blanket_red: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/picnic_blanket_red.gltf`, type: 'decoration', name: 'Picnic Blanket' },
            blanket_blue: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/picnic_blanket_blue.gltf`, type: 'decoration', name: 'Picnic Blanket' },
            blanket_green: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/picnic_blanket_green.gltf`, type: 'decoration', name: 'Picnic Blanket' },
            pillow_large_red: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/pillow_large_red.gltf`, type: 'decoration', name: 'Pillow' },
            pillow_large_green: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/pillow_large_green.gltf`, type: 'decoration', name: 'Pillow' },
            pillow_large_blue: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/pillow_large_blue.gltf`, type: 'decoration', name: 'Pillow' },
            picnic_basket_round: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/picnic_basket_round.gltf`, type: 'decoration', name: 'Picnic Basket' },
            picnic_basket_square: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/picnic_basket_square.gltf`, type: 'decoration', name: 'Picnic Basket' },
            sandwich: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/sandwich.gltf`, type: 'decoration', name: 'Sandwich' },
            serving_tray: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/serving_tray_round.gltf`, type: 'decoration', name: 'Serving Tray' },
            cooler: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/cooler.gltf`, type: 'decoration', name: 'Cooler' },
            frisbee: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/frisbee.gltf`, type: 'decoration', name: 'Frisbee' },
            radio: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/radio.gltf`, type: 'decoration', name: 'Radio' },
            teapot: { path: `${basePath}/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/teapot.gltf`, type: 'decoration', name: 'Teapot' },
        };

        console.log('Neighborhood initialized');
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
        const x = this.gridSpacing * q;
        const z = this.gridSpacing * r;
        return { x, z };
    }

    hexKey(q, r) {
        return `${q},${r}`;
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
        if (dist <= 2) return 'park';
        if (dist <= 4) return 'playground';
        return 'neighborhood';
    }

    findNextHexSpiral() {
        const occupied = new Set(this.hexes.map(h => this.hexKey(h.q, h.r)));
        if (this.hexes.length === 0) return { q: 0, r: 0 };

        for (let ring = 0; ring <= this.gridRadius; ring++) {
            const hexesInRing = this.getHexRing(ring);
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
        const walkDirections = [
            { q: 1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 1 },
            { q: -1, r: 0 }, { q: 0, r: -1 }, { q: 1, r: -1 },
        ];

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

    async placeHex(q, r, tileType, buildingType = null, rotation = 0) {
        const pos = this.hexToWorld(q, r);
        const modelScale = 1;

        let placedTile = null;
        if (tileType) {
            const tileModel = await this.loadModel(tileType);
            if (tileModel) {
                placedTile = tileModel.clone();
                placedTile.position.set(pos.x, 0, pos.z);
                placedTile.scale.setScalar(modelScale);
                this.scene.add(placedTile);
            }
        }

        let building = null;
        if (buildingType) {
            const buildingModel = await this.loadModel(buildingType);
            if (buildingModel) {
                building = buildingModel.clone();
                building.position.set(pos.x, 0, pos.z);
                building.scale.setScalar(modelScale);
                building.rotation.y = (rotation * Math.PI) / 180;
                this.scene.add(building);
            }
        }

        this.hexes.push({
            q, r, tileType, buildingType, rotation,
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
                return { tile: 'floor_grass', building: 'fountain' };

            case 'park':
                const parkItems = ['bench', 'flower_A', 'flower_B', 'bush', 'bush_large',
                                  'tree', 'grass_A', 'bird', 'street_lantern'];
                const parkWeights = [3, 4, 4, 3, 2, 3, 2, 2, 2];
                return { tile: 'floor_grass', building: this.weightedRandom(parkItems, parkWeights) };

            case 'playground':
                const playItems = ['swing_A_large', 'slide_A', 'slide_B', 'merry_go_round',
                                  'seesaw_large', 'sandbox_round_decorated', 'monkeybar_A',
                                  'spring_horse_A', 'picnic_table', 'sandcastle_A', 'bucket_A'];
                const playWeights = [3, 3, 2, 3, 2, 3, 2, 3, 3, 2, 2];
                return { tile: 'floor_grass', building: this.weightedRandom(playItems, playWeights) };

            case 'neighborhood':
            default:
                const houseItems = ['house', 'tree_large', 'fence_straight', 'mailbox',
                                   'foliage_A', 'foliage_B', 'bench_A', 'gate_single',
                                   'hedge_straight', 'package', 'plant_A'];
                const houseWeights = [4, 3, 3, 2, 3, 3, 2, 2, 3, 1, 2];
                return { tile: 'floor_grass', building: this.weightedRandom(houseItems, houseWeights) };
        }
    }

    async grow(habitName = null) {
        // Use template only - stop after template is done
        if (this.templateIndex < neighborhoodTemplate.length) {
            const item = neighborhoodTemplate[this.templateIndex];
            this.templateIndex++;
            await this.placeHex(item.q, item.r, item.tile, item.building, item.rotation || 0);
            const worldPos = this.hexToWorld(item.q, item.r);
            this.panToPosition(worldPos.x, worldPos.z);

            if (item.building && this.modelDefs[item.building]) {
                return {
                    type: this.modelDefs[item.building].type,
                    name: this.modelDefs[item.building].name,
                    position: { q: item.q, r: item.r, x: worldPos.x, z: worldPos.z },
                };
            }
            return { type: 'tile', name: 'Park Ground', position: { q: item.q, r: item.r } };
        }

        // Template complete - no more growth
        return { type: 'complete', name: 'Neighborhood Complete!', position: null };
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
                rotation: h.rotation || 0,
                habitName: h.habitName || null,
            })),
            templateIndex: this.templateIndex,
        };
        localStorage.setItem('tinyHabitsNeighborhood', JSON.stringify(data));
    }

    async load() {
        const saved = localStorage.getItem('tinyHabitsNeighborhood');
        if (!saved) return false;

        try {
            const data = JSON.parse(saved);
            this.templateIndex = data.templateIndex || 0;
            for (const hexData of data.hexes) {
                await this.placeHex(hexData.q, hexData.r, hexData.tileType, hexData.buildingType, hexData.rotation || 0);
                if (hexData.habitName) {
                    const hex = this.getHexAt(hexData.q, hexData.r);
                    if (hex) hex.habitName = hexData.habitName;
                }
            }
            return true;
        } catch (e) {
            console.warn('Failed to load neighborhood:', e);
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

window.Neighborhood = Neighborhood;
