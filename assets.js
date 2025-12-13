/**
 * Asset definitions for Tiny Habits City
 * Catalogs all Kenney isometric assets for buildings, ground, and decorations
 */

const ASSETS = {
    // Base path for assets
    basePath: 'assets/',

    // Complete buildings from PabloGameDev pack (voxel style)
    buildings: [
        { id: 'house1', file: 'pablo/House 1.png', name: 'House' },
        { id: 'house2', file: 'pablo/House 2.png', name: 'House' },
        { id: 'house3', file: 'pablo/House 3.png', name: 'House' },
        { id: 'shop', file: 'pablo/Shop.png', name: 'Shop' },
        { id: 'office', file: 'pablo/Office.png', name: 'Office' },
        { id: 'build1', file: 'pablo/Build 1.png', name: 'Building' },
        { id: 'build2', file: 'pablo/Build 2.png', name: 'Building' },
        { id: 'bar', file: 'pablo/Bar.png', name: 'Bar' },
        { id: 'hospital', file: 'pablo/Hospital.png', name: 'Hospital' },
        { id: 'church', file: 'pablo/Church.png', name: 'Church' },
        { id: 'playground', file: 'pablo/Playground.png', name: 'Playground' },
        { id: 'greenhouse', file: 'pablo/Greenhouse.png', name: 'Greenhouse' },
        { id: 'henhouse', file: 'pablo/Hen house.png', name: 'Hen House' },
        { id: 'fishinghut', file: 'pablo/fishing hut.png', name: 'Fishing Hut' },
        { id: 'waterwell', file: 'pablo/Water well.png', name: 'Water Well' },
        { id: 'simplepark', file: 'pablo/Simple Park.png', name: 'Park' },
        { id: 'tennis', file: 'pablo/Tennis 1.png', name: 'Tennis Court' },
        { id: 'cornfield', file: 'pablo/Cornfield.png', name: 'Cornfield' },
        { id: 'graveyard', file: 'pablo/Graveyard.png', name: 'Graveyard' },
    ],

    // Decorations from PabloGameDev environment pack
    decorations: {
        trees: [
            { id: 'tree1', file: 'pablo/Voxel Isometric enviroment/Arbol 1 PNg.png', weight: 5 },
            { id: 'tree2', file: 'pablo/Voxel Isometric enviroment/Arbol 2 PNg.png', weight: 5 },
            { id: 'tree3', file: 'pablo/Voxel Isometric enviroment/Arbol 3 PNg.png', weight: 4 },
            { id: 'tree4', file: 'pablo/Voxel Isometric enviroment/Arbol 4 PNg.png', weight: 4 },
            { id: 'tree5', file: 'pablo/Voxel Isometric enviroment/Arbol 5 PNg.png', weight: 3 },
        ],
        bushes: [
            { id: 'bush1', file: 'pablo/Voxel Isometric enviroment/Arbusto 1 PNg.png', weight: 3 },
            { id: 'bush2', file: 'pablo/Voxel Isometric enviroment/Arbusto 2 PNg.png', weight: 3 },
            { id: 'bush3', file: 'pablo/Voxel Isometric enviroment/Arbusto 3 PNg.png', weight: 3 },
        ],
        flowers: [
            { id: 'flower1', file: 'pablo/Voxel Isometric enviroment/Flower 1.png', weight: 2 },
            { id: 'flower2', file: 'pablo/Voxel Isometric enviroment/Flower 2.png', weight: 2 },
            { id: 'flower3', file: 'pablo/Voxel Isometric enviroment/Flower 3.png', weight: 2 },
        ],
        rocks: [
            { id: 'rock1', file: 'pablo/Voxel Isometric enviroment/Rocas 1 PNg.png', weight: 2 },
            { id: 'rock2', file: 'pablo/Voxel Isometric enviroment/Rocas 2 PNg.png', weight: 2 },
            { id: 'rock3', file: 'pablo/Voxel Isometric enviroment/Rocas 3 PNg.png', weight: 2 },
        ],
    },

    // Tile dimensions (isometric) - adjusted for new assets
    tileWidth: 200,
    tileHeight: 100,
};

/**
 * Asset loader - preloads all images
 */
class AssetLoader {
    constructor() {
        this.images = {};
        this.loaded = false;
    }

    async loadAll() {
        const imagesToLoad = [];

        // Load all buildings
        ASSETS.buildings.forEach(b => {
            imagesToLoad.push({ key: `building_${b.id}`, path: b.file });
        });

        // Load all decorations
        ASSETS.decorations.trees.forEach(t => {
            imagesToLoad.push({ key: `tree_${t.id}`, path: t.file });
        });
        ASSETS.decorations.bushes.forEach(b => {
            imagesToLoad.push({ key: `bush_${b.id}`, path: b.file });
        });
        ASSETS.decorations.flowers.forEach(f => {
            imagesToLoad.push({ key: `flower_${f.id}`, path: f.file });
        });
        ASSETS.decorations.rocks.forEach(r => {
            imagesToLoad.push({ key: `rock_${r.id}`, path: r.file });
        });

        // Load all images
        const loadPromises = imagesToLoad.map(item => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.images[item.key] = img;
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`Failed to load: ${item.path}`);
                    resolve(); // Don't reject, just warn
                };
                img.src = ASSETS.basePath + item.path;
            });
        });

        await Promise.all(loadPromises);
        this.loaded = true;
        console.log(`Loaded ${Object.keys(this.images).length} images`);
    }

    get(key) {
        return this.images[key];
    }
}

// Global asset loader instance
const assetLoader = new AssetLoader();
