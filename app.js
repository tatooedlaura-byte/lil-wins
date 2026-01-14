/**
 * Lil' Wins - Improved Version
 * Habit tracker that grows 3D worlds
 */

// World instances
let kingdom, city, spacebase, dungeon, graveyard, neighborhood;
let currentWorld = 'kingdom';

// User data
let userHabits = [];           // User's chosen habits
let completedToday = {};       // { habitName: true }
let habitStreaks = {};         // { habitName: currentStreak }
let habitHistory = {};         // { 'YYYY-MM-DD': { habitName: true, ... } }
let buildingHistory = [];      // [{ habitName, buildingType, worldPos, date }]

// Streak data
let currentStreak = 0;
let bestStreak = 0;
let totalCompletions = 0;
let daysActive = 0;

// World unlock requirements (based on streak days, not arbitrary tiles)
const UNLOCK_REQUIREMENTS = {
    city: { type: 'streak', value: 0, message: 'Complete a 3-day streak to unlock the City!' },
    spacebase: { type: 'streak', value: 0, message: 'Complete a 7-day streak to unlock Space Base!' },
    dungeon: { type: 'streak', value: 0, message: 'Complete a 14-day streak to unlock the Dungeon!' },
    graveyard: { type: 'streak', value: 0, message: 'Complete a 21-day streak to unlock the Graveyard!' },
    neighborhood: { type: 'streak', value: 0, message: 'Complete a 28-day streak to unlock the Neighborhood!' },
};

// Curated preset habits (reduced from 150+ to manageable categories)
const PRESET_HABITS = {
    morning: [
        'Brush teeth', 'Drink water', 'Make bed', 'Open blinds',
        'Take vitamins', 'Do one stretch', 'Wash face'
    ],
    wellness: [
        'Take a short walk', 'Do one deep breath', 'Drink a cup of water',
        'Stand up and stretch', 'Take 3 slow breaths', 'Step away from screens'
    ],
    evening: [
        'Brush teeth before bed', 'Set out tomorrow\'s clothes', 'Charge phone',
        'Read one page', 'Write one gratitude', 'Set an alarm'
    ],
    home: [
        'Put one dish away', 'Throw away one piece of trash', 'Wipe one surface',
        'Water a plant', 'Tidy one spot', 'Pick up 5 things'
    ],
    mindfulness: [
        'Take a mindful moment', 'Name one emotion', 'Say something positive',
        'Smile at yourself', 'Give yourself credit', 'Write one sentence'
    ],
    movement: [
        'Do 1 push-up', 'Do 1 squat', 'Walk around the room',
        'Dance to one song', 'Hold a stretch', 'Roll your shoulders'
    ]
};

const CATEGORY_NAMES = {
    morning: '🌅 Morning',
    wellness: '💚 Wellness',
    evening: '🌙 Evening',
    home: '🏠 Home',
    mindfulness: '🧘 Mindfulness',
    movement: '🏃 Movement'
};

// Encouraging messages
const MESSAGES = {
    firstWin: [
        "First win of the day! Your world is waking up.",
        "Great start! The builders are getting to work.",
        "Here we go! Something new is appearing..."
    ],
    building: [
        "A new building appeared!", "Your world grew a little!",
        "Nice! Something new just spawned.", "Look what you built!"
    ],
    streak: [
        "🔥 Streak continued! Keep it going!",
        "🔥 Another day, another win!",
        "🔥 You're on fire! Streak extended!"
    ],
    allDone: [
        "🎉 All habits done! Your world is celebrating!",
        "🎉 Perfect day! Confetti everywhere!",
        "🎉 You did it all! The citizens are cheering!"
    ],
    unlock: [
        "🎊 NEW WORLD UNLOCKED! Check the world selector!",
    ],
    worldComplete: [
        "🏆 WORLD COMPLETE! You've built everything!",
        "🏆 This world is finished! Try another world!",
        "🏆 Amazing! Your world is fully built!"
    ],
    compassion: [
        "Your world grows at your pace.",
        "Small wins build big things.",
        "Every step counts. You're doing great."
    ]
};

// ============ TUTORIAL ============

const TUTORIAL_SLIDES = [
    {
        title: "Welcome to Lil' Wins!",
        content: "Small habits, big results. Complete tiny daily habits and watch your world grow.",
        icon: "🌟",
        type: 'icon'
    },
    {
        title: "Build Your World",
        content: "Every habit you complete adds a new building to your kingdom. Watch it come alive!",
        type: 'animation'
    },
    {
        title: "Keep Your Streak",
        content: "Complete at least one habit daily to maintain your streak. Longer streaks unlock new worlds!",
        type: 'streak'
    },
    {
        title: "Unlock New Worlds",
        content: "3-day streak unlocks City. 7 days unlocks Space Base. How far can you go?",
        type: 'worlds'
    }
];

let tutorialSlideIndex = 0;

function showTutorial() {
    const modal = document.getElementById('tutorial-modal');
    modal.classList.remove('hidden');
    tutorialSlideIndex = 0;
    renderTutorialSlide();
    setupTutorialListeners();
}

function renderTutorialSlide() {
    const slide = TUTORIAL_SLIDES[tutorialSlideIndex];
    const container = document.getElementById('tutorial-slides');

    let contentHtml = '<div class="tutorial-slide">';

    // Render based on slide type
    switch (slide.type) {
        case 'icon':
            contentHtml += `<div class="tutorial-icon">${slide.icon}</div>`;
            break;
        case 'animation':
            contentHtml += `
                <div class="building-animation">
                    <div class="ground"></div>
                    <div class="building b1">🏠</div>
                    <div class="building b2">🏪</div>
                    <div class="building b3">⛪</div>
                    <div class="building b4">🏰</div>
                </div>
            `;
            break;
        case 'streak':
            contentHtml += `
                <div class="streak-demo">
                    <span class="fire">🔥</span>
                    <span class="count">7</span>
                </div>
            `;
            break;
        case 'worlds':
            contentHtml += `
                <div class="tutorial-worlds">
                    <div class="tutorial-world"><span>🏰</span><span>Kingdom</span><span class="unlocked">Day 1</span></div>
                    <div class="tutorial-world"><span>🏙️</span><span>City</span><span>3 days</span></div>
                    <div class="tutorial-world"><span>🚀</span><span>Space</span><span>7 days</span></div>
                    <div class="tutorial-world"><span>🏛️</span><span>Dungeon</span><span>14 days</span></div>
                </div>
            `;
            break;
    }

    contentHtml += `<h2>${slide.title}</h2>`;
    contentHtml += `<p>${slide.content}</p>`;
    contentHtml += '</div>';

    container.innerHTML = contentHtml;

    // Update dots
    renderTutorialDots();

    // Update button text
    const nextBtn = document.getElementById('tutorial-next');
    nextBtn.textContent = tutorialSlideIndex === TUTORIAL_SLIDES.length - 1 ? "Let's Go!" : "Next";
}

function renderTutorialDots() {
    const container = document.getElementById('tutorial-dots');
    container.innerHTML = TUTORIAL_SLIDES.map((_, i) =>
        `<span class="dot ${i === tutorialSlideIndex ? 'active' : ''}"></span>`
    ).join('');
}

function setupTutorialListeners() {
    const nextBtn = document.getElementById('tutorial-next');
    const skipBtn = document.getElementById('tutorial-skip');

    // Remove old listeners by cloning
    const newNextBtn = nextBtn.cloneNode(true);
    const newSkipBtn = skipBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    skipBtn.parentNode.replaceChild(newSkipBtn, skipBtn);

    newNextBtn.addEventListener('click', () => {
        if (tutorialSlideIndex < TUTORIAL_SLIDES.length - 1) {
            tutorialSlideIndex++;
            renderTutorialSlide();
        } else {
            endTutorial();
        }
    });

    newSkipBtn.addEventListener('click', endTutorial);
}

function endTutorial() {
    document.getElementById('tutorial-modal').classList.add('hidden');
    localStorage.setItem('lilWinsTutorialSeen', 'true');
    showOnboarding();
}

// ============ INITIALIZATION ============

async function init() {
    // Check if user has completed onboarding
    const hasOnboarded = localStorage.getItem('lilWinsOnboarded');
    const hasTutorialSeen = localStorage.getItem('lilWinsTutorialSeen');

    loadUserData();

    if (!hasOnboarded || userHabits.length === 0) {
        // Show tutorial first if never seen
        if (!hasTutorialSeen) {
            showTutorial();
        } else {
            showOnboarding();
        }
    } else {
        document.getElementById('onboarding-modal').classList.add('hidden');
        document.getElementById('tutorial-modal').classList.add('hidden');
        await initializeApp();
    }
}

async function initializeApp() {
    // Wait for world classes
    await new Promise(resolve => {
        const check = () => {
            if (window.Kingdom && window.City && window.SpaceBase && window.Dungeon && window.Graveyard) resolve();
            else setTimeout(check, 50);
        };
        check();
    });

    // Initialize kingdom
    const container = document.getElementById('kingdom-container');
    kingdom = new Kingdom(container);

    await new Promise(resolve => {
        const check = () => {
            if (kingdom.loaded) resolve();
            else setTimeout(check, 50);
        };
        check();
    });

    await kingdom.load();

    // Switch to saved world if unlocked
    const savedWorld = localStorage.getItem('lilWinsCurrentWorld') || 'kingdom';
    if (savedWorld !== 'kingdom' && isWorldUnlocked(savedWorld)) {
        await switchWorld(savedWorld);
    }

    setupEventListeners();
    renderHabits();
    updateUI();

    // Initialize notifications
    if (window.NotificationManager) {
        await window.NotificationManager.init();
    }

    // Show welcome message
    setTimeout(() => {
        if (Math.random() < 0.3) {
            showToast(getRandomMessage('compassion'));
        }
    }, 1000);
}

// ============ ONBOARDING ============

function showOnboarding() {
    const modal = document.getElementById('onboarding-modal');
    modal.classList.remove('hidden');

    const categoriesContainer = document.getElementById('onboarding-categories');
    let selectedHabits = [];
    let currentCategory = 'morning';

    // Render category tabs
    function renderCategories() {
        categoriesContainer.innerHTML = Object.entries(CATEGORY_NAMES).map(([key, name]) => `
            <button class="onboarding-category ${currentCategory === key ? 'active' : ''}" data-category="${key}">
                ${name}
            </button>
        `).join('') + `
            <div class="onboarding-habits" id="onboarding-habits"></div>
        `;

        renderHabitsForCategory();

        // Add category click handlers
        categoriesContainer.querySelectorAll('.onboarding-category').forEach(btn => {
            btn.addEventListener('click', () => {
                currentCategory = btn.dataset.category;
                renderCategories();
            });
        });
    }

    function renderHabitsForCategory() {
        const habitsContainer = document.getElementById('onboarding-habits');
        const habits = PRESET_HABITS[currentCategory] || [];

        habitsContainer.innerHTML = habits.map(habit => `
            <div class="onboarding-habit ${selectedHabits.includes(habit) ? 'selected' : ''}" data-habit="${escapeAttr(habit)}">
                <span class="check">${selectedHabits.includes(habit) ? '✓' : ''}</span>
                <span>${habit}</span>
            </div>
        `).join('');

        habitsContainer.querySelectorAll('.onboarding-habit').forEach(el => {
            el.addEventListener('click', () => {
                const habit = el.dataset.habit;
                if (selectedHabits.includes(habit)) {
                    selectedHabits = selectedHabits.filter(h => h !== habit);
                } else if (selectedHabits.length < 5) {
                    selectedHabits.push(habit);
                }
                renderCategories();
                renderSelectedHabits();
            });
        });
    }

    function renderSelectedHabits() {
        document.getElementById('selected-count').textContent = selectedHabits.length;

        const container = document.getElementById('selected-habits');
        container.innerHTML = selectedHabits.map(habit => `
            <span class="selected-habit-tag">
                ${habit}
                <span class="remove" data-habit="${escapeAttr(habit)}">×</span>
            </span>
        `).join('') || '<span style="color: var(--text-muted);">Pick some habits above...</span>';

        container.querySelectorAll('.remove').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedHabits = selectedHabits.filter(h => h !== el.dataset.habit);
                renderCategories();
                renderSelectedHabits();
            });
        });

        // Update start button
        const startBtn = document.getElementById('start-btn');
        startBtn.disabled = selectedHabits.length < 1;
    }

    renderCategories();
    renderSelectedHabits();

    // Start button
    document.getElementById('start-btn').addEventListener('click', async () => {
        if (selectedHabits.length > 0) {
            userHabits = [...selectedHabits];
            saveUserData();
            localStorage.setItem('lilWinsOnboarded', 'true');
            modal.classList.add('hidden');
            await initializeApp();
        }
    });
}

// ============ DATA MANAGEMENT ============

function loadUserData() {
    try {
        userHabits = JSON.parse(localStorage.getItem('lilWinsHabits') || '[]');
        habitStreaks = JSON.parse(localStorage.getItem('lilWinsStreaks') || '{}');
        habitHistory = JSON.parse(localStorage.getItem('lilWinsHistory') || '{}');
        buildingHistory = JSON.parse(localStorage.getItem('lilWinsBuildingHistory') || '[]');
        currentStreak = parseInt(localStorage.getItem('lilWinsCurrentStreak') || '0');
        bestStreak = parseInt(localStorage.getItem('lilWinsBestStreak') || '0');
        totalCompletions = parseInt(localStorage.getItem('lilWinsTotalCompletions') || '0');

        // Load today's completions
        const today = getDateString();
        const lastDate = localStorage.getItem('lilWinsLastDate');

        if (lastDate === today) {
            completedToday = JSON.parse(localStorage.getItem('lilWinsCompletedToday') || '{}');
        } else {
            // New day - check if streak should reset
            if (lastDate) {
                const yesterday = getDateString(new Date(Date.now() - 86400000));
                if (lastDate !== yesterday) {
                    // Missed a day - reset streak
                    currentStreak = 0;
                }
            }
            completedToday = {};
            localStorage.setItem('lilWinsLastDate', today);
        }

        // Calculate days active
        daysActive = Object.keys(habitHistory).length;

    } catch (e) {
        console.error('Error loading user data:', e);
    }
}

function saveUserData() {
    localStorage.setItem('lilWinsHabits', JSON.stringify(userHabits));
    localStorage.setItem('lilWinsStreaks', JSON.stringify(habitStreaks));
    localStorage.setItem('lilWinsHistory', JSON.stringify(habitHistory));
    localStorage.setItem('lilWinsBuildingHistory', JSON.stringify(buildingHistory));
    localStorage.setItem('lilWinsCompletedToday', JSON.stringify(completedToday));
    localStorage.setItem('lilWinsCurrentStreak', currentStreak.toString());
    localStorage.setItem('lilWinsBestStreak', bestStreak.toString());
    localStorage.setItem('lilWinsTotalCompletions', totalCompletions.toString());
    localStorage.setItem('lilWinsLastDate', getDateString());
}

function getDateString(date = new Date()) {
    return date.toISOString().split('T')[0];
}

// ============ HABITS ============

function renderHabits() {
    const container = document.getElementById('habits-list');

    if (userHabits.length === 0) {
        container.innerHTML = `
            <div class="empty-habits">
                <p>No habits yet!</p>
                <button class="btn btn-primary" onclick="showAddHabitModal()">Add your first habit</button>
            </div>
        `;
        return;
    }

    container.innerHTML = userHabits.map(habit => {
        const isCompleted = completedToday[habit];
        const streak = habitStreaks[habit] || 0;

        return `
            <div class="habit-item ${isCompleted ? 'completed' : ''}" data-habit="${escapeAttr(habit)}">
                <div class="habit-checkbox">${isCompleted ? '✓' : ''}</div>
                <div class="habit-item-content">
                    <span class="habit-name">${escapeHtml(habit)}</span>
                    ${streak > 0 ? `<div class="habit-meta"><span class="streak">🔥 ${streak} day${streak > 1 ? 's' : ''}</span></div>` : ''}
                </div>
                <button class="habit-delete" data-delete="${escapeAttr(habit)}">×</button>
            </div>
        `;
    }).join('');

    // Add click handlers
    container.querySelectorAll('.habit-item').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.classList.contains('habit-delete')) {
                deleteHabit(e.target.dataset.delete);
                return;
            }
            toggleHabit(el.dataset.habit);
        });
    });

    // Update mobile habits too
    renderMobileHabits();

    // Show suggestions if user has few habits
    const suggestionsSection = document.getElementById('suggestions-section');
    if (userHabits.length < 5) {
        suggestionsSection.classList.remove('hidden');
        renderSuggestions();
    } else {
        suggestionsSection.classList.add('hidden');
    }
}

function renderMobileHabits() {
    const container = document.getElementById('mobile-habits-list');
    if (!container) return;

    const completedCount = Object.values(completedToday).filter(v => v).length;
    document.getElementById('sheet-progress').textContent = `${completedCount}/${userHabits.length}`;
    document.getElementById('fab-badge').textContent = completedCount;

    container.innerHTML = userHabits.map(habit => {
        const isCompleted = completedToday[habit];
        return `
            <div class="habit-item ${isCompleted ? 'completed' : ''}" data-habit="${escapeAttr(habit)}">
                <div class="habit-checkbox">${isCompleted ? '✓' : ''}</div>
                <span class="habit-name">${escapeHtml(habit)}</span>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.habit-item').forEach(el => {
        el.addEventListener('click', () => toggleHabit(el.dataset.habit));
    });
}

function renderSuggestions() {
    const container = document.getElementById('habit-suggestions');
    const allPresets = Object.values(PRESET_HABITS).flat();
    const available = allPresets.filter(h => !userHabits.includes(h));
    const suggestions = shuffleArray(available).slice(0, 3);

    container.innerHTML = suggestions.map(habit => `
        <div class="suggestion-chip" data-habit="${escapeAttr(habit)}">
            <span>${habit}</span>
            <span class="add-icon">+</span>
        </div>
    `).join('');

    container.querySelectorAll('.suggestion-chip').forEach(el => {
        el.addEventListener('click', () => {
            addHabit(el.dataset.habit);
        });
    });
}

async function toggleHabit(habitName) {
    const wasCompleted = completedToday[habitName];

    if (!wasCompleted) {
        // Complete the habit
        completedToday[habitName] = true;
        totalCompletions++;

        // Update habit streak
        habitStreaks[habitName] = (habitStreaks[habitName] || 0) + 1;

        // Record in history
        const today = getDateString();
        if (!habitHistory[today]) habitHistory[today] = {};
        habitHistory[today][habitName] = true;

        // Check if this is first completion today (for daily streak)
        const completedCount = Object.values(completedToday).filter(v => v).length;
        const isFirstToday = completedCount === 1;

        if (isFirstToday) {
            currentStreak++;
            if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
            }
            daysActive = Object.keys(habitHistory).length;
        }

        // Check for world unlocks
        checkWorldUnlocks();

        // Grow the world and get building info
        const worlds = { kingdom, city, spacebase, dungeon, graveyard, neighborhood };
        const world = worlds[currentWorld];
        const buildingInfo = await world.grow(habitName);

        // Save building history for tooltip
        if (buildingInfo) {
            buildingHistory.push({
                habitName,
                buildingType: buildingInfo.type,
                buildingName: buildingInfo.name,
                position: buildingInfo.position,
                date: today,
                world: currentWorld
            });
        }

        // Show appropriate message
        const allDone = completedCount === userHabits.length;
        let messageType = 'building';
        if (!buildingInfo) {
            // World is complete!
            messageType = 'worldComplete';
        } else if (allDone) {
            messageType = 'allDone';
        } else if (isFirstToday && currentStreak > 1) {
            messageType = 'streak';
        } else if (isFirstToday) {
            messageType = 'firstWin';
        }

        showToast(getRandomMessage(messageType), messageType === 'allDone' || messageType === 'worldComplete');

        // Save and update
        world.save();
        saveUserData();

    } else {
        // Allow unchecking
        completedToday[habitName] = false;
        saveUserData();
    }

    renderHabits();
    updateUI();
}

function addHabit(habitName) {
    if (!userHabits.includes(habitName)) {
        userHabits.push(habitName);
        saveUserData();
        renderHabits();
        showToast(`Added: ${habitName}`);
    }
}

function deleteHabit(habitName) {
    if (confirm(`Remove "${habitName}" from your habits?`)) {
        userHabits = userHabits.filter(h => h !== habitName);
        delete completedToday[habitName];
        saveUserData();
        renderHabits();
    }
}

// ============ WORLD MANAGEMENT ============

function isWorldUnlocked(worldName) {
    if (worldName === 'kingdom') return true;

    const req = UNLOCK_REQUIREMENTS[worldName];
    if (!req) return false;

    if (req.type === 'streak') {
        return bestStreak >= req.value;
    }

    return false;
}

function checkWorldUnlocks() {
    const worlds = ['city', 'spacebase', 'dungeon', 'graveyard', 'neighborhood'];

    for (const worldName of worlds) {
        const wasLocked = !localStorage.getItem(`lilWins_${worldName}_unlocked`);
        const isNowUnlocked = isWorldUnlocked(worldName);

        if (wasLocked && isNowUnlocked) {
            localStorage.setItem(`lilWins_${worldName}_unlocked`, 'true');
            setTimeout(() => {
                showToast(getRandomMessage('unlock'), true);
            }, 1500);
        }
    }

    updateWorldSelector();
}

function updateWorldSelector() {
    const buttons = document.querySelectorAll('.world-btn');

    buttons.forEach(btn => {
        const worldName = btn.dataset.world;
        const isUnlocked = isWorldUnlocked(worldName);
        const isActive = worldName === currentWorld;

        btn.classList.toggle('locked', !isUnlocked);
        btn.classList.toggle('active', isActive);

        // Update progress bar for locked worlds
        if (!isUnlocked && UNLOCK_REQUIREMENTS[worldName]) {
            const req = UNLOCK_REQUIREMENTS[worldName];
            const progress = Math.min(100, (bestStreak / req.value) * 100);
            const progressEl = btn.querySelector('.world-progress');
            if (progressEl) {
                progressEl.style.setProperty('--progress', `${progress}%`);
            }
            btn.title = req.message;
        }
    });

    // Update subtitle
    const subtitles = {
        kingdom: 'Build your kingdom, one win at a time',
        city: 'Build your city, one win at a time',
        spacebase: 'Explore the cosmos, one win at a time',
        dungeon: 'Discover secrets, one win at a time',
        graveyard: 'Haunt the night, one win at a time',
        neighborhood: 'Grow your cozy corner, one win at a time',
    };
    document.getElementById('world-subtitle').textContent = subtitles[currentWorld];
}

async function switchWorld(worldName) {
    if (worldName === currentWorld) return;
    if (!isWorldUnlocked(worldName)) {
        showToast(UNLOCK_REQUIREMENTS[worldName].message);
        return;
    }

    const container = document.getElementById('kingdom-container');
    const worlds = { kingdom, city, spacebase, dungeon, graveyard, neighborhood };

    // Save and cleanup current world
    if (worlds[currentWorld]) {
        worlds[currentWorld].save();
        container.innerHTML = '';
    }

    currentWorld = worldName;
    localStorage.setItem('lilWinsCurrentWorld', currentWorld);

    const waitForLoad = (world) => new Promise(resolve => {
        const check = () => {
            if (world.loaded) resolve();
            else setTimeout(check, 50);
        };
        check();
    });

    // Initialize new world
    if (worldName === 'city') {
        city = new City(container);
        await waitForLoad(city);
        await city.load();
    } else if (worldName === 'spacebase') {
        spacebase = new SpaceBase(container);
        await waitForLoad(spacebase);
        await spacebase.load();
    } else if (worldName === 'dungeon') {
        dungeon = new Dungeon(container);
        await waitForLoad(dungeon);
        await dungeon.load();
    } else if (worldName === 'graveyard') {
        graveyard = new Graveyard(container);
        await waitForLoad(graveyard);
        await graveyard.load();
    } else if (worldName === 'neighborhood') {
        neighborhood = new Neighborhood(container);
        await waitForLoad(neighborhood);
        await neighborhood.load();
    } else {
        kingdom = new Kingdom(container);
        await waitForLoad(kingdom);
        await kingdom.load();
    }

    updateWorldSelector();
    updateUI();
    showToast(`Welcome to the ${worldName.charAt(0).toUpperCase() + worldName.slice(1)}!`);
}

// ============ UI UPDATES ============

function updateUI() {
    // Update streak displays
    document.getElementById('streak-count').textContent = currentStreak;
    document.getElementById('mobile-streak-count').textContent = currentStreak;

    // Update stats
    const worlds = { kingdom, city, spacebase, dungeon, graveyard, neighborhood };
    const world = worlds[currentWorld];
    if (world) {
        const stats = world.getStats();
        document.getElementById('buildings-count').textContent = stats.buildings;
        document.getElementById('decorations-count').textContent = stats.tiles;
    }

    const completedCount = Object.values(completedToday).filter(v => v).length;
    document.getElementById('today-count').textContent = `${completedCount}/${userHabits.length}`;

    updateWorldSelector();
}

// ============ MODALS ============

function showAddHabitModal() {
    const modal = document.getElementById('add-habit-modal');
    modal.classList.remove('hidden');

    let currentCategory = 'morning';

    function renderTabs() {
        const tabsContainer = document.getElementById('category-tabs');
        tabsContainer.innerHTML = Object.entries(CATEGORY_NAMES).map(([key, name]) => `
            <button class="category-tab ${currentCategory === key ? 'active' : ''}" data-category="${key}">
                ${name}
            </button>
        `).join('');

        tabsContainer.querySelectorAll('.category-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                currentCategory = btn.dataset.category;
                renderTabs();
                renderCategoryHabits();
            });
        });
    }

    function renderCategoryHabits() {
        const container = document.getElementById('category-habits');
        const habits = PRESET_HABITS[currentCategory] || [];

        container.innerHTML = habits.map(habit => {
            const isAdded = userHabits.includes(habit);
            return `
                <div class="category-habit ${isAdded ? 'added' : ''}" data-habit="${escapeAttr(habit)}">
                    <span>${habit}</span>
                    ${isAdded ? '<span style="color: var(--success);">Added</span>' : '<span class="add-btn">+ Add</span>'}
                </div>
            `;
        }).join('');

        container.querySelectorAll('.category-habit:not(.added)').forEach(el => {
            el.addEventListener('click', () => {
                addHabit(el.dataset.habit);
                renderCategoryHabits();
            });
        });
    }

    renderTabs();
    renderCategoryHabits();
}

function showHistoryModal() {
    const modal = document.getElementById('history-modal');
    modal.classList.remove('hidden');

    // Update stats
    document.getElementById('total-completions').textContent = totalCompletions;
    document.getElementById('best-streak').textContent = bestStreak;
    document.getElementById('days-active').textContent = daysActive;

    // Render calendar
    renderCalendar();
}

function showSettingsModal() {
    const modal = document.getElementById('settings-modal');
    modal.classList.remove('hidden');

    // Load current settings
    if (window.NotificationManager) {
        const settings = window.NotificationManager.getSettings();
        document.getElementById('notification-toggle').checked = settings.enabled;
        document.getElementById('notification-time').value = settings.time;
        document.getElementById('notification-time-row').classList.toggle('visible', settings.enabled);

        // Clear any previous status
        const status = document.getElementById('notification-status');
        status.className = 'settings-status';
        status.textContent = '';
    }
}

function renderCalendar(date = new Date()) {
    const container = document.getElementById('calendar-container');
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const today = getDateString();

    let daysHtml = '';

    // Day headers
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        daysHtml += `<div class="calendar-day-header">${day}</div>`;
    });

    // Empty cells for padding
    for (let i = 0; i < startPadding; i++) {
        daysHtml += `<div class="calendar-day other-month"></div>`;
    }

    // Days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasActivity = habitHistory[dateStr] && Object.keys(habitHistory[dateStr]).length > 0;
        const isToday = dateStr === today;

        daysHtml += `
            <div class="calendar-day ${hasActivity ? 'has-activity' : ''} ${isToday ? 'today' : ''}">
                ${day}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="calendar-header">
            <h3>${monthNames[month]} ${year}</h3>
            <div class="calendar-nav">
                <button onclick="renderCalendar(new Date(${year}, ${month - 1}))">←</button>
                <button onclick="renderCalendar(new Date(${year}, ${month + 1}))">→</button>
            </div>
        </div>
        <div class="calendar-grid">${daysHtml}</div>
    `;
}

// ============ EVENT LISTENERS ============

function setupEventListeners() {
    // World buttons
    document.querySelectorAll('.world-btn').forEach(btn => {
        btn.addEventListener('click', () => switchWorld(btn.dataset.world));
    });

    // Add habit button
    document.getElementById('add-habits-btn')?.addEventListener('click', showAddHabitModal);

    // History button
    document.getElementById('view-history-btn')?.addEventListener('click', showHistoryModal);

    // Close modals
    document.getElementById('close-history')?.addEventListener('click', () => {
        document.getElementById('history-modal').classList.add('hidden');
    });

    document.getElementById('close-add-habit')?.addEventListener('click', () => {
        document.getElementById('add-habit-modal').classList.add('hidden');
    });

    // Custom habit input
    document.getElementById('save-habit-btn')?.addEventListener('click', () => {
        const input = document.getElementById('new-habit-input');
        const value = input.value.trim();
        if (value) {
            addHabit(value);
            input.value = '';
            document.getElementById('add-habit-modal').classList.add('hidden');
        }
    });

    document.getElementById('new-habit-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('save-habit-btn').click();
        }
    });

    // Refresh suggestions
    document.getElementById('refresh-suggestions')?.addEventListener('click', renderSuggestions);

    // Reset buttons
    document.getElementById('reset-world-btn')?.addEventListener('click', resetCurrentWorld);
    document.getElementById('reset-habits-btn')?.addEventListener('click', () => {
        if (confirm('This will let you re-select your habits. Continue?')) {
            localStorage.removeItem('lilWinsOnboarded');
            location.reload();
        }
    });

    // Settings button
    document.getElementById('settings-btn')?.addEventListener('click', showSettingsModal);

    // Help button - show tutorial
    document.getElementById('help-btn')?.addEventListener('click', () => {
        showTutorial();
    });

    // Close settings
    document.getElementById('close-settings')?.addEventListener('click', () => {
        document.getElementById('settings-modal').classList.add('hidden');
    });

    // Notification toggle
    document.getElementById('notification-toggle')?.addEventListener('change', async (e) => {
        const enabled = e.target.checked;
        const timeInput = document.getElementById('notification-time');
        const time = timeInput.value || '09:00';
        const timeRow = document.getElementById('notification-time-row');
        const status = document.getElementById('notification-status');

        timeRow.classList.toggle('visible', enabled);

        if (window.NotificationManager) {
            const result = await window.NotificationManager.toggle(enabled, time);

            if (enabled && !result.success) {
                e.target.checked = false;
                timeRow.classList.remove('visible');
                status.className = 'settings-status error visible';
                status.textContent = result.message;
            } else if (enabled) {
                status.className = 'settings-status success visible';
                status.textContent = result.message;
            } else {
                status.className = 'settings-status';
                status.classList.remove('visible');
                status.textContent = '';
            }
        }
    });

    // Time change
    document.getElementById('notification-time')?.addEventListener('change', async (e) => {
        const time = e.target.value;
        const enabled = document.getElementById('notification-toggle').checked;
        const status = document.getElementById('notification-status');

        if (enabled && window.NotificationManager) {
            const result = await window.NotificationManager.toggle(true, time);
            status.className = 'settings-status success visible';
            status.textContent = `Reminder updated to ${window.NotificationManager.formatTime(time)} daily`;
        }
    });

    // Mobile sidebar toggle
    document.getElementById('menu-toggle')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('open');
        getOrCreateOverlay().classList.add('visible');
    });

    document.getElementById('close-sidebar')?.addEventListener('click', closeSidebar);

    // Mobile FAB
    document.getElementById('mobile-fab')?.addEventListener('click', () => {
        const sheet = document.getElementById('mobile-habits-sheet');
        sheet.classList.toggle('visible');
        sheet.classList.remove('hidden');
    });

    // Click outside to close modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

function getOrCreateOverlay() {
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', closeSidebar);
        document.getElementById('app').appendChild(overlay);
    }
    return overlay;
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    getOrCreateOverlay().classList.remove('visible');
}

function resetCurrentWorld() {
    const worldNames = { kingdom: 'Kingdom', city: 'City', spacebase: 'Space Base', dungeon: 'Dungeon', graveyard: 'Graveyard', neighborhood: 'Neighborhood' };

    if (!confirm(`Completely reset ${worldNames[currentWorld]}? This will clear all buildings AND habits, starting fresh.`)) return;

    const keys = {
        kingdom: ['tinyHabitsGarden', 'tinyHabitsKingdom'],
        city: ['tinyHabitsCity'],
        spacebase: ['tinyHabitsSpaceBase'],
        dungeon: ['tinyHabitsDungeon'],
        graveyard: ['tinyHabitsGraveyard'],
        neighborhood: ['tinyHabitsNeighborhood']
    };

    // Clear all building data for this world
    for (const key of keys[currentWorld]) {
        localStorage.removeItem(key);
    }

    // Clear ALL user data to start completely fresh
    localStorage.removeItem('lilWinsOnboarded');
    localStorage.removeItem('lilWinsHabits');
    localStorage.removeItem('lilWinsStreaks');
    localStorage.removeItem('lilWinsHistory');
    localStorage.removeItem('lilWinsBuildingHistory');
    localStorage.removeItem('lilWinsCompletedToday');
    localStorage.removeItem('lilWinsCurrentStreak');
    localStorage.removeItem('lilWinsBestStreak');
    localStorage.removeItem('lilWinsTotalCompletions');
    localStorage.removeItem('lilWinsLastDate');

    location.reload();
}

// ============ UTILITIES ============

function showToast(message, celebrate = false) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${celebrate ? 'celebration' : ''}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);

    // Show confetti for celebrations!
    if (celebrate) {
        launchConfetti();
    }
}

function launchConfetti() {
    const colors = ['#e94560', '#4ade80', '#fbbf24', '#60a5fa', '#a78bfa', '#f472b6'];
    const confettiCount = 150;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

        // Random shape
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }

        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => confetti.remove(), 4000);
    }
}

function getRandomMessage(type) {
    const messages = MESSAGES[type] || MESSAGES.building;
    return messages[Math.floor(Math.random() * messages.length)];
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeAttr(text) {
    return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Make renderCalendar globally accessible for nav buttons
window.renderCalendar = renderCalendar;
window.showAddHabitModal = showAddHabitModal;

// Start the app
init();
