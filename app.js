/**
 * Main application for Lil' Wins
 * Handles wins/tasks and ties them to world growth
 */

let kingdom;
let city;
let spacebase;
let dungeon;
let currentWorld = 'kingdom'; // 'kingdom', 'city', 'spacebase', or 'dungeon'
let customHabits = [];      // User-added custom habits
let completedToday = {};    // { habitName: completionCount }
let totalCompletions = {};  // { habitName: totalCount }

const CITY_UNLOCK_TILES = 50; // Tiles needed to unlock city
const SPACEBASE_UNLOCK_TILES = 100; // Tiles needed to unlock space base
const DUNGEON_UNLOCK_TILES = 150; // Tiles needed to unlock dungeon

// Encouraging messages for different events
const MESSAGES = {
    newFloor: [
        "Great job! Your building just added a new floor!",
        "Your win power is rising! Another floor has appeared.",
        "Boop! Your building grew taller.",
        "Look at you go—your tower just leveled up!",
        "A fresh new floor popped into existence—nicely done!",
        "Your city noticed your progress and decided to grow.",
        "Wow! Your win fueled a construction boom!",
        "Floor added! Your tiny citizens are very impressed.",
        "Your building is stretching its legs—thanks to you!",
        "Another floor! At this rate you'll reach the clouds.",
    ],
    newBuilding: [
        "A cozy little building appeared to celebrate your progress!",
        "Someone new moved into your tiny town—welcome home!",
        "A fresh building sprouted up. Your wins are magical.",
        "Your city loves your consistency—here's a new building!",
        "A tiny family just unpacked because of YOU.",
        "Your city built something brand-new—no permits required!",
        "A cheerful new spot just appeared in town!",
        "Your win sparked construction—new building unlocked!",
        "Tiny architects thank you for your hard work.",
    ],
    decoration: [
        "A peaceful park element just grew out of your calm energy.",
        "Your progress planted something beautiful.",
        "Trees whisper thank you—new greenery unlocked!",
        "A fresh patch of sunshine appeared in your town.",
        "Your win created a quiet little spot for tiny picnics.",
        "A little something extra appeared in your city!",
        "Your town got a bit cozier.",
    ],
    firstWin: [
        "First win of the day! The city's waking up with you.",
        "Good morning! Your city is buzzing with you.",
        "You're lighting up the skyline today!",
        "The day begins—and so does your progress!",
    ],
    general: [
        "Lil' wins, big magic.",
        "You did something good today. Your city noticed.",
        "Every step counts—and look how your city grows.",
        "Your town believes in you.",
        "Progress doesn't have to be loud to matter.",
        "You're building something beautiful, inside and out.",
        "Small wins build tall cities.",
        "Way to go! You lifted your whole skyline a little higher.",
        "Your city brewed you a warm 'thank you.'",
        "A gentle little accomplishment for a gentle little town.",
        "Your progress feels like tea and sunshine.",
        "The tiny citizens lit a candle in your honor.",
        "A soft breeze of progress passed through your city.",
        "A sparkle of win magic just hit your map!",
        "Poof! Something wonderful appeared.",
        "Your city hummed happily at your accomplishment.",
        "Tiny architects danced with joy!",
    ],
    // Time-of-day greetings
    morning: [
        "Good morning! Your tiny city is stretching and waking up with you.",
        "A new day = a chance for one tiny win. Your city believes in you.",
        "Sunrise in your cozy town—want to build something small today?",
        "Your tiny citizens are sipping tea, wondering what you'll do next.",
        "Morning breeze says: one lil' win is enough.",
        "A sparkle floated across your town this morning.",
        "The tiny architect cat left a note: 'Do your best!'",
    ],
    midday: [
        "Hey! Even one 10-second win can grow your little city.",
        "Your town is humming quietly. Want to add something small?",
        "A tiny burst of progress could add a floor or two…",
        "Your city is proud of you—no matter how today is going.",
        "Here's a tiny thought: small things count.",
        "Construction crews are relaxing… unless you want to give them a job?",
        "A tiny blueprint fluttered in—maybe it's for your next building.",
        "The mayor of your tiny town waved hello.",
    ],
    evening: [
        "The tiny city lights are glowing… did you want to add anything today?",
        "If today was a lot, that's okay. Your city is always here for you.",
        "A tiny win before bedtime? Even brushing your teeth counts.",
        "Your cozy town is winding down—maybe one more lil' win?",
        "You did enough today. Truly.",
        "Your skyline is dreaming of growing.",
        "A gentle magic drifts over your buildings today.",
    ],
    compassion: [
        "Your city grows at your pace—no rush, no rules.",
        "You're doing the best you can. A tiny step is still a step.",
        "Small wins build tall cities… and calmer days.",
        "Progress doesn't need to be loud to matter.",
        "You matter. Your wins matter. Your city loves you.",
        "You don't have to do much. One tiny thing is enough.",
        "If today is heavy, no worries—your city will wait.",
        "Your worth is not tied to your productivity.",
        "Rest is a valid building material.",
        "Be kind to yourself. Your city is.",
    ],
    celebration: [
        "Your city loved what you did today. Really loved it.",
        "Win complete! A tiny celebration is happening downtown.",
        "You did something good today. Your city noticed.",
        "A quiet cheer rises from your cozy city streets.",
        "Your progress today was a warm little spark.",
    ],
    special: [
        "A festival is happening in your tiny city today!",
        "Your bookstore is having a cozy reading day.",
        "A gentle rain is falling on your town.",
        "Your café is baking fresh pastries in your honor.",
        "A new mysterious blueprint appeared…",
        "The city planners sketched something cute today…",
    ],
    allDone: [
        "You did it! Every single win, done. Your city is glowing.",
        "All wins complete! The whole town is celebrating you.",
        "100% today! Fireworks are going off in your tiny city.",
        "You finished everything! A parade is marching through downtown.",
        "All done! Your city has never been prouder.",
        "Every win checked off. You absolute legend.",
        "Complete sweep! Your tiny citizens are throwing confetti.",
        "All wins done! The mayor just declared a holiday in your honor.",
        "You crushed it! The city bells are ringing for you.",
        "Perfect day! A golden star appeared over your city.",
    ],
};

function showToast(message) {
    // Remove existing toast if any
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getRandomMessage(type) {
    const messages = MESSAGES[type] || MESSAGES.general;
    return messages[Math.floor(Math.random() * messages.length)];
}

function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'midday';
    return 'evening';
}

function showWelcomeMessage() {
    const timeOfDay = getTimeOfDay();

    // 20% chance to show a compassion message instead
    if (Math.random() < 0.2) {
        showToast(getRandomMessage('compassion'));
    }
    // 10% chance for a special message
    else if (Math.random() < 0.1) {
        showToast(getRandomMessage('special'));
    }
    else {
        showToast(getRandomMessage(timeOfDay));
    }
}

// Preset tiny habits to choose from
const PRESET_HABITS = [
    // Morning
    { name: 'Brush teeth', category: 'morning' },
    { name: 'Wash face', category: 'morning' },
    { name: 'Comb hair', category: 'morning' },
    { name: 'Drink one sip of water', category: 'morning' },
    { name: 'Open blinds', category: 'morning' },
    { name: 'Make the bed (even halfway)', category: 'morning' },
    { name: 'Put one thing away', category: 'morning' },
    { name: 'Take vitamins', category: 'morning' },
    { name: 'Take morning meds', category: 'morning' },
    { name: 'Do one stretch', category: 'morning' },
    { name: 'Step outside for 30 seconds', category: 'morning' },
    { name: 'Start the coffee maker', category: 'morning' },
    { name: 'Feed pets', category: 'morning' },
    { name: 'Pack one item in your bag', category: 'morning' },
    { name: 'Put on deodorant', category: 'morning' },
    { name: 'Check the weather', category: 'morning' },
    { name: 'Put away pajamas', category: 'morning' },
    { name: 'Splash cold water on face', category: 'morning' },
    { name: 'Say good morning to someone', category: 'morning' },

    // Evening / Night
    { name: 'Brush teeth before bed', category: 'evening' },
    { name: 'Wash face before bed', category: 'evening' },
    { name: 'Set out clothes for tomorrow', category: 'evening' },
    { name: 'Charge your phone', category: 'evening' },
    { name: 'Take evening meds', category: 'evening' },
    { name: 'Write one thing that went well today', category: 'evening' },
    { name: 'Set an alarm', category: 'evening' },
    { name: 'Lock the doors', category: 'evening' },
    { name: 'Turn off lights', category: 'evening' },
    { name: 'Put phone on silent', category: 'evening' },
    { name: 'Read one page before sleep', category: 'evening' },
    { name: 'Do a 1-minute wind down', category: 'evening' },
    { name: 'Check tomorrow\'s calendar', category: 'evening' },
    { name: 'Say goodnight to someone', category: 'evening' },
    { name: 'Close all apps', category: 'evening' },

    // Wellness
    { name: 'Drink a cup of water', category: 'wellness' },
    { name: 'Take a short walk', category: 'wellness' },
    { name: 'Do one deep breath', category: 'wellness' },
    { name: 'Eat one vegetable', category: 'wellness' },
    { name: 'Put on comfortable clothes', category: 'wellness' },
    { name: 'Sit for 2 minutes quietly', category: 'wellness' },
    { name: 'Write one sentence in a journal', category: 'wellness' },
    { name: 'Do one balance pose', category: 'wellness' },
    { name: 'Take a mini break', category: 'wellness' },
    { name: 'Touch your toes', category: 'wellness' },
    { name: 'Put on lotion', category: 'wellness' },
    { name: 'Choose a healthy snack', category: 'wellness' },
    { name: 'Stand up and stretch', category: 'wellness' },
    { name: 'Roll your shoulders', category: 'wellness' },
    { name: 'Massage your hands', category: 'wellness' },
    { name: 'Take 3 slow breaths', category: 'wellness' },
    { name: 'Drink herbal tea', category: 'wellness' },
    { name: 'Eat a piece of fruit', category: 'wellness' },
    { name: 'Step away from screens for 5 min', category: 'wellness' },
    { name: 'Do 5 jumping jacks', category: 'wellness' },
    { name: 'Neck stretches', category: 'wellness' },

    // Exercise / Movement
    { name: 'Do 1 push-up', category: 'exercise' },
    { name: 'Do 1 squat', category: 'exercise' },
    { name: 'Do 1 sit-up', category: 'exercise' },
    { name: 'Hold a plank for 10 seconds', category: 'exercise' },
    { name: 'Walk around the block', category: 'exercise' },
    { name: 'Dance to one song', category: 'exercise' },
    { name: 'Do 10 arm circles', category: 'exercise' },
    { name: 'Walk up one flight of stairs', category: 'exercise' },
    { name: 'Jog in place for 30 seconds', category: 'exercise' },
    { name: 'Do a yoga pose', category: 'exercise' },
    { name: 'Stretch for 2 minutes', category: 'exercise' },
    { name: 'Take a standing break', category: 'exercise' },
    { name: 'Do calf raises', category: 'exercise' },
    { name: 'Do lunges across the room', category: 'exercise' },
    { name: 'Shadow box for 30 seconds', category: 'exercise' },

    // Home
    { name: 'Put one dish in the sink', category: 'home' },
    { name: 'Throw away one piece of trash', category: 'home' },
    { name: 'Wipe one surface', category: 'home' },
    { name: 'Fold one item of clothing', category: 'home' },
    { name: 'Tidy one hotspot', category: 'home' },
    { name: 'Start a load of laundry', category: 'home' },
    { name: 'Carry something upstairs/downstairs', category: 'home' },
    { name: 'Water one plant', category: 'home' },
    { name: 'Empty part of the dishwasher', category: 'home' },
    { name: 'Pick up 5 things', category: 'home' },
    { name: 'Light a candle', category: 'home' },
    { name: 'Open a window for fresh air', category: 'home' },
    { name: 'Vacuum one room', category: 'home' },
    { name: 'Take out one bag of trash', category: 'home' },
    { name: 'Sort one pile of mail', category: 'home' },
    { name: 'Clean one mirror', category: 'home' },
    { name: 'Dust one shelf', category: 'home' },
    { name: 'Organize one drawer', category: 'home' },
    { name: 'Replace one empty roll', category: 'home' },
    { name: 'Fluff pillows', category: 'home' },
    { name: 'Straighten shoes by the door', category: 'home' },
    { name: 'Wipe down light switches', category: 'home' },
    { name: 'Clean the sink', category: 'home' },

    // Work / Productivity
    { name: 'Check the calendar', category: 'productivity' },
    { name: 'Read one email (no reply needed)', category: 'productivity' },
    { name: 'Write one to-do', category: 'productivity' },
    { name: 'Start a 2-minute task', category: 'productivity' },
    { name: 'Clear a small part of your desk', category: 'productivity' },
    { name: 'Send one message you\'ve been avoiding', category: 'productivity' },
    { name: 'Move one appointment if needed', category: 'productivity' },
    { name: 'Back up a file', category: 'productivity' },
    { name: 'Turn off one notification', category: 'productivity' },
    { name: 'Review tomorrow\'s meetings', category: 'productivity' },
    { name: 'File one document', category: 'productivity' },
    { name: 'Update one password', category: 'productivity' },
    { name: 'Clear desktop clutter', category: 'productivity' },
    { name: 'Write a quick note of thanks', category: 'productivity' },
    { name: 'Set one timer for focus', category: 'productivity' },
    { name: 'Prioritize top 3 tasks', category: 'productivity' },
    { name: 'Archive old emails', category: 'productivity' },
    { name: 'Review weekly goals', category: 'productivity' },

    // Family / Kids
    { name: 'Read one page of a book', category: 'family' },
    { name: 'Pick up one toy', category: 'family' },
    { name: 'Choose tomorrow\'s outfit', category: 'family' },
    { name: 'Brush teeth (kid)', category: 'family' },
    { name: 'Put on shoes', category: 'family' },
    { name: 'Feed pets together', category: 'family' },
    { name: 'Kindness moment (one small nice thing)', category: 'family' },
    { name: 'Share one fun fact', category: 'family' },
    { name: 'Give someone a hug', category: 'family' },
    { name: 'Play a quick game together', category: 'family' },
    { name: 'Ask about their day', category: 'family' },
    { name: 'Help with homework for 5 min', category: 'family' },
    { name: 'Pack lunch together', category: 'family' },
    { name: 'Check backpack', category: 'family' },
    { name: 'Sign one form', category: 'family' },
    { name: 'Have a snack together', category: 'family' },

    // Digital
    { name: 'Delete one unused photo', category: 'digital' },
    { name: 'Close one tab', category: 'digital' },
    { name: 'Plug in phone', category: 'digital' },
    { name: 'Turn on do not disturb', category: 'digital' },
    { name: 'Unsubscribe from one email', category: 'digital' },
    { name: 'Save one photo to an album', category: 'digital' },
    { name: 'Back up today\'s photos', category: 'digital' },
    { name: 'Delete one unused app', category: 'digital' },
    { name: 'Clear notifications', category: 'digital' },
    { name: 'Organize one folder', category: 'digital' },
    { name: 'Update one app', category: 'digital' },
    { name: 'Check screen time', category: 'digital' },
    { name: 'Clean phone screen', category: 'digital' },
    { name: 'Review subscriptions', category: 'digital' },
    { name: 'Empty trash folder', category: 'digital' },
    { name: 'Log out of unused accounts', category: 'digital' },

    // Emotional / Mental Health
    { name: 'Say one positive thought', category: 'emotional' },
    { name: 'Write one gratitude word', category: 'emotional' },
    { name: 'Text someone "thinking of you"', category: 'emotional' },
    { name: 'Smile at yourself in a mirror', category: 'emotional' },
    { name: 'Sit or breathe for 10 seconds', category: 'emotional' },
    { name: 'Name one emotion you\'re feeling', category: 'emotional' },
    { name: 'Give yourself a compliment', category: 'emotional' },
    { name: 'Forgive yourself for one thing', category: 'emotional' },
    { name: 'Write down a worry to let it go', category: 'emotional' },
    { name: 'Listen to a calming song', category: 'emotional' },
    { name: 'Look at a happy photo', category: 'emotional' },
    { name: 'Say "I am enough"', category: 'emotional' },
    { name: 'Take a mindful moment', category: 'emotional' },
    { name: 'Hug yourself', category: 'emotional' },
    { name: 'Write one hope for today', category: 'emotional' },

    // Social / Connection
    { name: 'Text a friend', category: 'social' },
    { name: 'Call someone for 2 minutes', category: 'social' },
    { name: 'Send a meme to a friend', category: 'social' },
    { name: 'Comment on a friend\'s post', category: 'social' },
    { name: 'Say hi to a neighbor', category: 'social' },
    { name: 'Thank someone', category: 'social' },
    { name: 'Make plans with someone', category: 'social' },
    { name: 'Share something you enjoyed', category: 'social' },
    { name: 'Compliment a stranger', category: 'social' },
    { name: 'Respond to one message', category: 'social' },
    { name: 'Send a voice note', category: 'social' },
    { name: 'Write a quick email to family', category: 'social' },

    // Creative / Learning
    { name: 'Doodle for 1 minute', category: 'creative' },
    { name: 'Learn one new word', category: 'creative' },
    { name: 'Read one article', category: 'creative' },
    { name: 'Watch one tutorial', category: 'creative' },
    { name: 'Write one sentence of a story', category: 'creative' },
    { name: 'Take one photo', category: 'creative' },
    { name: 'Listen to a podcast for 5 min', category: 'creative' },
    { name: 'Practice an instrument for 2 min', category: 'creative' },
    { name: 'Sketch something you see', category: 'creative' },
    { name: 'Write a haiku', category: 'creative' },
    { name: 'Try a new recipe step', category: 'creative' },
    { name: 'Learn one phrase in another language', category: 'creative' },
    { name: 'Color for 5 minutes', category: 'creative' },
    { name: 'Do one puzzle', category: 'creative' },

    // Finance / Adulting
    { name: 'Check bank balance', category: 'finance' },
    { name: 'Log one expense', category: 'finance' },
    { name: 'Pay one bill', category: 'finance' },
    { name: 'Review one subscription', category: 'finance' },
    { name: 'Add to savings (any amount)', category: 'finance' },
    { name: 'Check credit score', category: 'finance' },
    { name: 'File one receipt', category: 'finance' },
    { name: 'Update budget', category: 'finance' },
    { name: 'Cancel unused subscription', category: 'finance' },
    { name: 'Review auto-payments', category: 'finance' },

    // Self-Care / Relaxation
    { name: 'Take a bath or shower', category: 'selfcare' },
    { name: 'Apply face mask', category: 'selfcare' },
    { name: 'Paint nails', category: 'selfcare' },
    { name: 'Use a heating pad', category: 'selfcare' },
    { name: 'Lie down for 5 minutes', category: 'selfcare' },
    { name: 'Listen to nature sounds', category: 'selfcare' },
    { name: 'Drink something warm', category: 'selfcare' },
    { name: 'Wrap up in a cozy blanket', category: 'selfcare' },
    { name: 'Use hand cream', category: 'selfcare' },
    { name: 'Brush or braid hair', category: 'selfcare' },
    { name: 'Clip nails', category: 'selfcare' },
    { name: 'Put on fresh socks', category: 'selfcare' },

    // Outdoors / Nature
    { name: 'Step outside for fresh air', category: 'outdoors' },
    { name: 'Look at the sky', category: 'outdoors' },
    { name: 'Touch a plant or tree', category: 'outdoors' },
    { name: 'Listen to birds', category: 'outdoors' },
    { name: 'Walk barefoot on grass', category: 'outdoors' },
    { name: 'Sit in the sun for 2 minutes', category: 'outdoors' },
    { name: 'Take a photo outside', category: 'outdoors' },
    { name: 'Water outdoor plants', category: 'outdoors' },
    { name: 'Watch a sunset or sunrise', category: 'outdoors' },
    { name: 'Pick up one piece of litter', category: 'outdoors' },
];

// DOM Elements
const habitsList = document.getElementById('habits-list');
const newHabitInput = document.getElementById('new-habit-input');
const saveHabitBtn = document.getElementById('save-habit-btn');

// Stats elements
const buildingsCount = document.getElementById('buildings-count');
const decorationsCount = document.getElementById('decorations-count');

// Initialize app
async function init() {
    // Clear old data if format changed (v10 = multi-world support)
    const version = localStorage.getItem('tinyHabitsVersion');
    if (version !== 'v10') {
        localStorage.removeItem('tinyHabitsGarden');
        localStorage.setItem('tinyHabitsVersion', 'v10');
    }

    // Wait for all classes to be available
    await new Promise(resolve => {
        const check = () => {
            if (window.Kingdom && window.City && window.SpaceBase && window.Dungeon) resolve();
            else setTimeout(check, 50);
        };
        check();
    });

    // Initialize kingdom first (always load as base)
    const container = document.getElementById('kingdom-container');
    kingdom = new Kingdom(container);

    // Wait for kingdom to load
    await new Promise(resolve => {
        const check = () => {
            if (kingdom.loaded) resolve();
            else setTimeout(check, 50);
        };
        check();
    });

    // Load saved data
    loadData();
    await kingdom.load();

    // Check saved world preference
    const savedWorld = localStorage.getItem('tinyHabitsCurrentWorld') || 'kingdom';
    currentWorld = 'kingdom'; // Start with kingdom, then switch if needed
    updateWorldSelector();

    // Switch to saved world if different and unlocked
    if (savedWorld === 'city' && isCityUnlocked()) {
        await switchWorld('city');
    } else if (savedWorld === 'spacebase' && isSpacebaseUnlocked()) {
        await switchWorld('spacebase');
    } else if (savedWorld === 'dungeon' && isDungeonUnlocked()) {
        await switchWorld('dungeon');
    }

    // Render habits
    renderHabits();
    updateStats();

    // Set up event listeners
    setupEventListeners();

    // Show welcome message after a short delay
    setTimeout(showWelcomeMessage, 500);
}

function isCityUnlocked() {
    return true; // TODO: remove this after testing
    if (!kingdom) return false;
    const stats = kingdom.getStats();
    return stats.tiles >= CITY_UNLOCK_TILES;
}

function isSpacebaseUnlocked() {
    return true; // TODO: remove this after testing
    if (!kingdom) return false;
    const stats = kingdom.getStats();
    return stats.tiles >= SPACEBASE_UNLOCK_TILES;
}

function isDungeonUnlocked() {
    return true; // TODO: remove this after testing
    if (!kingdom) return false;
    const stats = kingdom.getStats();
    return stats.tiles >= DUNGEON_UNLOCK_TILES;
}

function updateWorldSelector() {
    const kingdomBtn = document.querySelector('[data-world="kingdom"]');
    const cityBtn = document.querySelector('[data-world="city"]');
    const spacebaseBtn = document.querySelector('[data-world="spacebase"]');
    const dungeonBtn = document.querySelector('[data-world="dungeon"]');
    const subtitle = document.getElementById('world-subtitle');

    // Update active state
    kingdomBtn.classList.toggle('active', currentWorld === 'kingdom');
    cityBtn.classList.toggle('active', currentWorld === 'city');
    spacebaseBtn.classList.toggle('active', currentWorld === 'spacebase');
    dungeonBtn.classList.toggle('active', currentWorld === 'dungeon');

    // Update lock states
    const cityUnlocked = isCityUnlocked();
    const spacebaseUnlocked = isSpacebaseUnlocked();
    const dungeonUnlocked = isDungeonUnlocked();

    cityBtn.classList.toggle('locked', !cityUnlocked);
    spacebaseBtn.classList.toggle('locked', !spacebaseUnlocked);
    dungeonBtn.classList.toggle('locked', !dungeonUnlocked);

    const stats = kingdom ? kingdom.getStats() : { tiles: 0 };

    if (cityUnlocked) {
        cityBtn.title = 'Modern City';
    } else {
        cityBtn.title = `Modern City (${stats.tiles}/${CITY_UNLOCK_TILES} tiles to unlock)`;
    }

    if (spacebaseUnlocked) {
        spacebaseBtn.title = 'Space Base';
    } else {
        spacebaseBtn.title = `Space Base (${stats.tiles}/${SPACEBASE_UNLOCK_TILES} tiles to unlock)`;
    }

    if (dungeonUnlocked) {
        dungeonBtn.title = 'Dungeon';
    } else {
        dungeonBtn.title = `Dungeon (${stats.tiles}/${DUNGEON_UNLOCK_TILES} tiles to unlock)`;
    }

    // Update subtitle
    const subtitles = {
        kingdom: 'Build your kingdom, one win at a time',
        city: 'Build your city, one win at a time',
        spacebase: 'Build your space colony, one win at a time',
        dungeon: 'Build your dungeon, one win at a time'
    };
    subtitle.textContent = subtitles[currentWorld] || subtitles.kingdom;
}

async function switchWorld(worldName) {
    if (worldName === currentWorld) return;

    // Check unlock requirements
    if (worldName === 'city' && !isCityUnlocked()) {
        showToast(`Build ${CITY_UNLOCK_TILES} tiles in the Kingdom to unlock the City!`);
        return;
    }
    if (worldName === 'spacebase' && !isSpacebaseUnlocked()) {
        showToast(`Build ${SPACEBASE_UNLOCK_TILES} tiles in the Kingdom to unlock the Space Base!`);
        return;
    }
    if (worldName === 'dungeon' && !isDungeonUnlocked()) {
        showToast(`Build ${DUNGEON_UNLOCK_TILES} tiles in the Kingdom to unlock the Dungeon!`);
        return;
    }

    const container = document.getElementById('kingdom-container');

    // Clean up current world
    const worlds = { kingdom, city, spacebase, dungeon };
    if (worlds[currentWorld]) {
        worlds[currentWorld].save();
        container.innerHTML = '';
    }

    currentWorld = worldName;
    localStorage.setItem('tinyHabitsCurrentWorld', currentWorld);

    const waitForLoad = (world) => new Promise(resolve => {
        const check = () => {
            if (world.loaded) resolve();
            else setTimeout(check, 50);
        };
        check();
    });

    if (worldName === 'city') {
        city = new City(container);
        await waitForLoad(city);
        await city.load();
        showToast('Welcome to the City! Keep stacking those wins.');
    } else if (worldName === 'spacebase') {
        spacebase = new SpaceBase(container);
        await waitForLoad(spacebase);
        await spacebase.load();
        showToast('Welcome to the Space Base! Explore the cosmos.');
    } else if (worldName === 'dungeon') {
        dungeon = new Dungeon(container);
        await waitForLoad(dungeon);
        await dungeon.load();
        showToast('Welcome to the Dungeon! Discover ancient secrets.');
    } else {
        // Switch to kingdom
        kingdom = new Kingdom(container);
        await waitForLoad(kingdom);
        await kingdom.load();
        showToast('Welcome back to the Kingdom!');
    }

    updateWorldSelector();
    updateStats();
}

function setupEventListeners() {
    saveHabitBtn.addEventListener('click', addCustomHabit);

    newHabitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCustomHabit();
        }
    });

    // World selector buttons
    document.querySelectorAll('.world-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const world = btn.dataset.world;
            switchWorld(world);
        });
    });

    // Reset habits at midnight
    scheduleMidnightReset();
}

function addCustomHabit() {
    const name = newHabitInput.value.trim();
    if (!name) return;

    // Add to custom habits list
    if (!customHabits.includes(name)) {
        customHabits.push(name);
        saveCustomHabits();
    }

    newHabitInput.value = '';
    renderHabits();
}

function deleteCustomHabit(name) {
    customHabits = customHabits.filter(h => h !== name);
    saveCustomHabits();
    renderHabits();
}

async function toggleHabit(habitName) {
    const wasCompleted = completedToday[habitName];

    if (!wasCompleted) {
        // Mark as complete and grow world!
        completedToday[habitName] = true;
        totalCompletions[habitName] = (totalCompletions[habitName] || 0) + 1;

        // Check if this is the first habit of the day
        const completedCount = Object.values(completedToday).filter(v => v).length;
        const isFirstHabit = completedCount === 1;

        // Check if city was locked before this grow
        const wasLocked = currentWorld === 'kingdom' && !isCityUnlocked();

        // Grow the current world - one building per habit completion
        const worlds = { kingdom, city, spacebase, dungeon };
        const world = worlds[currentWorld];
        const result = await world.grow();

        // Check if ALL habits are now complete
        const totalHabits = customHabits.length + PRESET_HABITS.length;
        const allCompleted = completedCount === totalHabits;

        // Show encouraging message
        let messageType = 'general';
        if (allCompleted) {
            messageType = 'allDone';
        } else if (isFirstHabit) {
            messageType = 'firstWin';
        } else if (result) {
            messageType = 'decoration';
        }
        showToast(getRandomMessage(messageType));

        // Save everything
        world.save();
        saveData();

        // Update UI
        renderHabits();
        updateStats();
        updateWorldSelector();

        // Notify if city was just unlocked
        if (wasLocked && isCityUnlocked()) {
            setTimeout(() => {
                showToast('🎉 You unlocked the Modern City! Click the City button to start building.');
            }, 2000);
        }

    } else {
        // Allow unchecking (but don't shrink world)
        completedToday[habitName] = false;
        saveData();
        renderHabits();
    }
}

function renderHabits() {
    // Category display names
    const categoryNames = {
        custom: 'My Habits',
        morning: 'Morning',
        evening: 'Evening',
        wellness: 'Wellness',
        exercise: 'Exercise',
        home: 'Home',
        productivity: 'Work & Productivity',
        family: 'Family & Kids',
        digital: 'Digital',
        emotional: 'Emotional & Mental Health',
        social: 'Social & Connection',
        creative: 'Creative & Learning',
        finance: 'Finance & Adulting',
        selfcare: 'Self-Care',
        outdoors: 'Outdoors & Nature'
    };

    // Build categories with custom habits first
    const categories = {};

    // Add custom habits
    if (customHabits.length > 0) {
        categories.custom = customHabits.map(name => ({ name, category: 'custom', isCustom: true }));
    }

    // Add preset habits
    PRESET_HABITS.forEach(preset => {
        if (!categories[preset.category]) {
            categories[preset.category] = [];
        }
        categories[preset.category].push(preset);
    });

    // Check which categories are expanded (default: custom is open, others closed)
    const expandedCategories = JSON.parse(localStorage.getItem('tinyHabitsExpanded') || '{"custom": true}');

    // Render all categories as dropdowns
    habitsList.innerHTML = Object.entries(categories).map(([category, habits]) => {
        const isExpanded = expandedCategories[category];
        const completedInCategory = habits.filter(h => completedToday[h.name]).length;
        const totalInCategory = habits.length;

        return `
        <div class="habit-category ${isExpanded ? 'expanded' : ''}">
            <button class="habit-category-header" data-category="${category}">
                <span class="habit-category-arrow">▶</span>
                <span class="habit-category-title">${categoryNames[category] || category}</span>
                <span class="habit-category-count">${completedInCategory}/${totalInCategory}</span>
            </button>
            <div class="habit-list">
                ${habits.map(habit => {
                    const isCompleted = completedToday[habit.name];
                    return `<button class="habit-chip ${isCompleted ? 'completed' : ''}"
                        data-habit="${escapeAttr(habit.name)}"
                        ${habit.isCustom ? 'data-custom="true"' : ''}>
                        <span class="habit-check">${isCompleted ? '✓' : ''}</span>
                        <span class="habit-name">${escapeHtml(habit.name)}</span>
                        ${habit.isCustom ? `<span class="habit-delete" data-delete="${escapeAttr(habit.name)}">&times;</span>` : ''}
                    </button>`;
                }).join('')}
            </div>
        </div>
    `}).join('');

    // Add click handlers for category headers
    habitsList.querySelectorAll('.habit-category-header').forEach(header => {
        header.addEventListener('click', () => {
            const category = header.dataset.category;
            const expanded = JSON.parse(localStorage.getItem('tinyHabitsExpanded') || '{}');
            expanded[category] = !expanded[category];
            localStorage.setItem('tinyHabitsExpanded', JSON.stringify(expanded));

            // Toggle the expanded class
            header.parentElement.classList.toggle('expanded');
        });
    });

    // Add click handlers for habit chips
    habitsList.querySelectorAll('.habit-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Don't toggle if clicking delete button
            if (e.target.classList.contains('habit-delete')) {
                e.stopPropagation();
                deleteCustomHabit(e.target.dataset.delete);
                return;
            }
            toggleHabit(btn.dataset.habit);
        });
    });
}

function updateStats() {
    const worlds = { kingdom, city, spacebase, dungeon };
    const world = worlds[currentWorld];
    if (!world) return;
    const stats = world.getStats();
    buildingsCount.textContent = stats.buildings;
    decorationsCount.textContent = stats.tiles;
}

// Persistence
function saveData() {
    localStorage.setItem('tinyHabitsCompleted', JSON.stringify(completedToday));
    localStorage.setItem('tinyHabitsTotals', JSON.stringify(totalCompletions));
}

function saveCustomHabits() {
    localStorage.setItem('tinyHabitsCustom', JSON.stringify(customHabits));
}

function loadData() {
    // Load custom habits
    const savedCustom = localStorage.getItem('tinyHabitsCustom');
    if (savedCustom) {
        try {
            customHabits = JSON.parse(savedCustom);
        } catch (e) {
            customHabits = [];
        }
    }

    // Load total completions
    const savedTotals = localStorage.getItem('tinyHabitsTotals');
    if (savedTotals) {
        try {
            totalCompletions = JSON.parse(savedTotals);
        } catch (e) {
            totalCompletions = {};
        }
    }

    // Load today's completions (or reset if new day)
    const lastReset = localStorage.getItem('tinyHabitsLastReset');
    const today = new Date().toDateString();

    if (lastReset === today) {
        const savedCompleted = localStorage.getItem('tinyHabitsCompleted');
        if (savedCompleted) {
            try {
                completedToday = JSON.parse(savedCompleted);
            } catch (e) {
                completedToday = {};
            }
        }
    } else {
        // New day - reset completions
        completedToday = {};
        localStorage.setItem('tinyHabitsLastReset', today);
        saveData();
    }
}

function scheduleMidnightReset() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow - now;

    setTimeout(() => {
        // Reset today's completions
        completedToday = {};
        localStorage.setItem('tinyHabitsLastReset', new Date().toDateString());
        saveData();
        renderHabits();

        // Schedule next reset
        scheduleMidnightReset();
    }, msUntilMidnight);
}

// Reset current world
function resetCurrentWorld() {
    const worldNames = {
        kingdom: 'Kingdom',
        city: 'City',
        spacebase: 'Space Base',
        dungeon: 'Dungeon'
    };

    if (!confirm(`Reset ${worldNames[currentWorld]}? This will clear all buildings in this world.`)) {
        return;
    }

    // Clear localStorage for current world
    const storageKeys = {
        kingdom: 'tinyHabitsGarden',
        city: 'tinyHabitsCity',
        spacebase: 'tinyHabitsSpaceBase',
        dungeon: 'tinyHabitsDungeon'
    };

    localStorage.removeItem(storageKeys[currentWorld]);

    // Reload the page to reinitialize
    location.reload();
}

// Set up reset button
document.getElementById('reset-world-btn').addEventListener('click', resetCurrentWorld);

// Utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeAttr(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Start the app
init();
