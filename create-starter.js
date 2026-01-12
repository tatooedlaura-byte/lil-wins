// Run this in the browser console to create a starter kingdom template
// Or run with: node create-starter.js (won't work without browser localStorage)

const template = [
    // ===== CENTER (Ring 0) - Town Square =====
    { q: 0, r: 0, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 0, r: 0, layer: 2, asset: 'church', rotation: 0 },

    // ===== RING 1 - Plaza Roads =====
    { q: 1, r: 0, layer: 1, asset: 'hex_road_A', rotation: 0 },
    { q: 0, r: 1, layer: 1, asset: 'hex_road_A', rotation: Math.PI / 3 },
    { q: -1, r: 1, layer: 1, asset: 'hex_road_A', rotation: 2 * Math.PI / 3 },
    { q: -1, r: 0, layer: 1, asset: 'hex_road_A', rotation: Math.PI },
    { q: 0, r: -1, layer: 1, asset: 'hex_road_A', rotation: -2 * Math.PI / 3 },
    { q: 1, r: -1, layer: 1, asset: 'hex_road_A', rotation: -Math.PI / 3 },

    // ===== RING 2 - Commercial District =====
    // Main spots with buildings
    { q: 2, r: 0, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 2, r: 0, layer: 2, asset: 'market', rotation: Math.PI },

    { q: 1, r: 1, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 1, r: 1, layer: 2, asset: 'tavern', rotation: -2 * Math.PI / 3 },

    { q: -1, r: 2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -1, r: 2, layer: 2, asset: 'well', rotation: 0 },

    { q: -2, r: 1, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -2, r: 1, layer: 2, asset: 'blacksmith', rotation: Math.PI / 3 },

    { q: -2, r: 0, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -2, r: 0, layer: 2, asset: 'home_A', rotation: 0 },

    { q: -1, r: -1, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -1, r: -1, layer: 2, asset: 'home_B', rotation: Math.PI / 3 },

    { q: 0, r: -2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 0, r: -2, layer: 2, asset: 'trees_A', rotation: 0 },

    { q: 1, r: -2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 1, r: -2, layer: 2, asset: 'home_A', rotation: -Math.PI / 3 },

    { q: 2, r: -2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 2, r: -2, layer: 2, asset: 'home_B', rotation: -Math.PI / 3 },

    { q: 2, r: -1, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 2, r: -1, layer: 2, asset: 'well', rotation: 0 },

    { q: 0, r: 2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 0, r: 2, layer: 2, asset: 'trees_B', rotation: Math.PI / 2 },

    { q: -2, r: 2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -2, r: 2, layer: 2, asset: 'home_A', rotation: 2 * Math.PI / 3 },

    // ===== RING 3 - Residential =====
    { q: 3, r: 0, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 3, r: 0, layer: 2, asset: 'home_A', rotation: Math.PI },

    { q: 3, r: -1, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 3, r: -1, layer: 2, asset: 'home_B', rotation: Math.PI },

    { q: 3, r: -2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 3, r: -2, layer: 2, asset: 'trees_A', rotation: 0 },

    { q: 3, r: -3, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 3, r: -3, layer: 2, asset: 'home_A', rotation: -Math.PI / 3 },

    { q: 2, r: 1, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 2, r: 1, layer: 2, asset: 'home_B', rotation: -2 * Math.PI / 3 },

    { q: 1, r: 2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 1, r: 2, layer: 2, asset: 'home_A', rotation: -2 * Math.PI / 3 },

    { q: 0, r: 3, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 0, r: 3, layer: 2, asset: 'trees_B', rotation: 0 },

    { q: -1, r: 3, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -1, r: 3, layer: 2, asset: 'home_B', rotation: 2 * Math.PI / 3 },

    { q: -2, r: 3, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -2, r: 3, layer: 2, asset: 'home_A', rotation: 2 * Math.PI / 3 },

    { q: -3, r: 3, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -3, r: 3, layer: 2, asset: 'windmill', rotation: 0 },

    { q: -3, r: 2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -3, r: 2, layer: 2, asset: 'home_B', rotation: Math.PI / 3 },

    { q: -3, r: 1, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -3, r: 1, layer: 2, asset: 'trees_A', rotation: Math.PI / 4 },

    { q: -3, r: 0, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -3, r: 0, layer: 2, asset: 'home_A', rotation: 0 },

    { q: -2, r: -1, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -2, r: -1, layer: 2, asset: 'home_B', rotation: 0 },

    { q: -1, r: -2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -1, r: -2, layer: 2, asset: 'home_A', rotation: -Math.PI / 3 },

    { q: 0, r: -3, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 0, r: -3, layer: 2, asset: 'lumbermill', rotation: 0 },

    { q: 1, r: -3, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 1, r: -3, layer: 2, asset: 'trees_B', rotation: 0 },

    { q: 2, r: -3, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 2, r: -3, layer: 2, asset: 'home_B', rotation: -Math.PI / 3 },

    // ===== Some outer farms and nature =====
    { q: 4, r: -2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 4, r: -2, layer: 2, asset: 'mine', rotation: Math.PI },

    { q: -4, r: 2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -4, r: 2, layer: 2, asset: 'rocks', rotation: 0 },

    { q: -4, r: 4, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: -4, r: 4, layer: 2, asset: 'hills', rotation: 0 },

    // A wandering knight
    { q: 2, r: 2, layer: 1, asset: 'hex_grass', rotation: 0 },
    { q: 2, r: 2, layer: 2, asset: 'knight', rotation: Math.PI },
];

// Output for saving
console.log('Kingdom Starter Template');
console.log('========================');
console.log('Copy this to browser console to save:\n');
console.log(`localStorage.setItem('kingdomStarterTemplate', '${JSON.stringify(template)}');`);
console.log(`localStorage.removeItem('tinyHabitsKingdom');`);
console.log(`localStorage.removeItem('tinyHabitsGarden');`);
console.log('\nThen refresh the main app!');

// If running in browser, save directly
if (typeof localStorage !== 'undefined') {
    localStorage.setItem('kingdomStarterTemplate', JSON.stringify(template));
    localStorage.removeItem('tinyHabitsKingdom');
    localStorage.removeItem('tinyHabitsGarden');
    console.log('\n✓ Template saved to localStorage!');
}
