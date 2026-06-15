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

function initSakuraGame() {
    const startButton = document.getElementById('sakura-game-start');
    const field = document.getElementById('sakura-game-field');
    const scoreElement = document.getElementById('sakura-game-score');
    const timeElement = document.getElementById('sakura-game-time');
    const bestElement = document.getElementById('sakura-game-best');
    const statusElement = document.getElementById('sakura-game-status');

    if (!startButton || !field || !scoreElement || !timeElement || !bestElement || !statusElement) return;

    const roundLength = 20;
    const petals = ['✿', '❀'];
    const bestScoreKey = 'sakuraGameBestScore';
    let score = 0;
    let timeLeft = roundLength;
    let spawnTimer = null;
    let countdownTimer = null;
    let isPlaying = false;

    function getBestScore() {
        return Number(localStorage.getItem(bestScoreKey)) || 0;
    }

    function setBestScore(nextScore) {
        localStorage.setItem(bestScoreKey, nextScore.toString());
        bestElement.textContent = nextScore.toString();
    }

    function updateScore(nextScore) {
        score = nextScore;
        scoreElement.textContent = score.toString();
    }

    function clearRound() {
        if (spawnTimer) {
            window.clearInterval(spawnTimer);
            spawnTimer = null;
        }

        if (countdownTimer) {
            window.clearInterval(countdownTimer);
            countdownTimer = null;
        }

        field.replaceChildren();
    }

    function endRound() {
        isPlaying = false;
        clearRound();
        startButton.disabled = false;
        startButton.textContent = 'Play Again';

        const bestScore = getBestScore();
        if (score > bestScore) {
            setBestScore(score);
            statusElement.textContent = `New best: ${score} petals!`;
        } else {
            statusElement.textContent = `Nice! You caught ${score} petals.`;
        }
    }

    function createTarget() {
        if (!isPlaying) return;

        const fieldWidth = field.clientWidth;
        const targetSize = 44;
        const target = document.createElement('button');
        const maxLeft = Math.max(fieldWidth - targetSize, 0);

        target.className = 'sakura-target';
        target.type = 'button';
        target.textContent = petals[Math.floor(Math.random() * petals.length)];
        target.setAttribute('aria-label', 'Catch this sakura petal');
        target.style.left = `${Math.random() * maxLeft}px`;
        target.style.setProperty('--fall-duration', `${2.1 + Math.random() * 1.5}s`);

        target.addEventListener('click', function () {
            if (!isPlaying) return;
            updateScore(score + 1);
            target.remove();
        });

        target.addEventListener('animationend', function () {
            target.remove();
        });

        field.appendChild(target);
    }

    function startRound() {
        clearRound();
        isPlaying = true;
        timeLeft = roundLength;
        updateScore(0);
        timeElement.textContent = timeLeft.toString();
        statusElement.textContent = 'Catch the petals!';
        startButton.disabled = true;
        startButton.textContent = 'Playing...';

        createTarget();
        spawnTimer = window.setInterval(createTarget, 520);
        countdownTimer = window.setInterval(function () {
            timeLeft -= 1;
            timeElement.textContent = timeLeft.toString();

            if (timeLeft <= 0) {
                endRound();
            }
        }, 1000);
    }

    bestElement.textContent = getBestScore().toString();
    timeElement.textContent = roundLength.toString();
    startButton.addEventListener('click', startRound);
}

document.addEventListener('DOMContentLoaded', function () {
    createSakura();
    initSakuraGame();

    const toggleButton = document.getElementById('snow-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleSakura);
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
