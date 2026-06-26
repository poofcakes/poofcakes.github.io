function getSakuraPreference() {
    const saved = localStorage.getItem('sakuraEnabled');
    return saved === null ? true : saved === 'true';
}

function setSakuraPreference(enabled) {
    localStorage.setItem('sakuraEnabled', enabled.toString());
}

function toggleSakura() {
    const snowContainer = document.getElementById('snow-container');
    const toggleText = document.getElementById('snow-toggle-text');

    if (!snowContainer || !toggleText) return;

    const isHidden = snowContainer.classList.contains('hidden');

    if (isHidden) {
        snowContainer.classList.remove('hidden');
        toggleText.textContent = 'Sakura 🌸';
        setSakuraPreference(true);
    } else {
        snowContainer.classList.add('hidden');
        toggleText.textContent = 'No Sakura 💔';
        setSakuraPreference(false);
    }
}

function createSakura() {
    const snowContainer = document.getElementById('snow-container');
    if (!snowContainer) return;

    const sakuraPetals = ['✿', '❀'];
    const pastelPinks = ['#FFB6C1', '#FFC0CB', '#FFD1DC', '#FFE4E1', '#F8C8DC', '#FFB3DE', '#FFCCE5'];
    const numPetals = 50;

    for (let i = 0; i < numPetals; i++) {
        const petal = document.createElement('div');
        petal.className = 'snowflake';
        petal.textContent = sakuraPetals[Math.floor(Math.random() * sakuraPetals.length)];

        const randomColor = pastelPinks[Math.floor(Math.random() * pastelPinks.length)];
        petal.style.color = randomColor;
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 5 + 3) + 's';
        petal.style.animationDelay = (Math.random() * 2) + 's';
        petal.style.fontSize = (Math.random() * 0.5 + 0.5) + 'em';
        petal.style.opacity = Math.random() * 0.5 + 0.5;

        snowContainer.appendChild(petal);
    }

    const sakuraEnabled = getSakuraPreference();
    if (!sakuraEnabled) {
        snowContainer.classList.add('hidden');
        const toggleText = document.getElementById('snow-toggle-text');
        if (toggleText) {
            toggleText.textContent = 'No Sakura 💔';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    createSakura();

    const toggleButton = document.getElementById('snow-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleSakura);
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
