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

function initKeyPopGame() {
    const startButton = document.getElementById('keypop-start');
    const field = document.getElementById('keypop-field');
    const scoreElement = document.getElementById('keypop-score');
    const timeElement = document.getElementById('keypop-time');
    const comboElement = document.getElementById('keypop-combo');
    const bestElement = document.getElementById('keypop-best');
    const statusElement = document.getElementById('keypop-status');
    const input = document.getElementById('keypop-input');

    if (!startButton || !field || !scoreElement || !timeElement || !comboElement || !bestElement || !statusElement || !input) return;

    const roundLength = 30;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const bestScoreKey = 'keyPopBestScore';
    let score = 0;
    let combo = 0;
    let timeLeft = roundLength;
    let countdownTimer = null;
    let spawnTimer = null;
    let isPlaying = false;
    let activeCaps = [];

    function getBestScore() {
        return Number(localStorage.getItem(bestScoreKey)) || 0;
    }

    function setBestScore(nextScore) {
        localStorage.setItem(bestScoreKey, nextScore.toString());
        bestElement.textContent = nextScore.toString();
    }

    function updateDisplay() {
        scoreElement.textContent = score.toString();
        comboElement.textContent = combo.toString();
        timeElement.textContent = timeLeft.toString();
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
        activeCaps = [];
        field.replaceChildren();
        input.value = '';
        input.disabled = true;
    }

    function popCap(cap, bonus) {
        cap.classList.add('keypop-cap-popped');
        window.setTimeout(function () {
            cap.remove();
        }, 180);
        activeCaps = activeCaps.filter(function (c) { return c !== cap; });
        combo += 1;
        score += bonus || 1;
        if (combo > 1 && combo % 5 === 0) {
            score += 2;
            statusElement.textContent = `${combo}x combo! +2 bonus`;
        }
        updateDisplay();
    }

    function missCap(cap) {
        cap.classList.add('keypop-cap-missed');
        window.setTimeout(function () {
            cap.remove();
        }, 300);
        activeCaps = activeCaps.filter(function (c) { return c !== cap; });
        combo = 0;
        updateDisplay();
    }

    function spawnCap() {
        if (!isPlaying) return;

        const letter = letters[Math.floor(Math.random() * letters.length)];
        const cap = document.createElement('div');
        const fieldWidth = field.clientWidth;
        const capSize = 56;
        const maxLeft = Math.max(fieldWidth - capSize, 0);

        cap.className = 'keypop-cap';
        cap.dataset.letter = letter;
        cap.style.left = `${Math.random() * maxLeft}px`;
        cap.innerHTML = `<span class="keypop-cap-letter">${letter}</span>`;

        const lifetime = window.setTimeout(function () {
            if (cap.isConnected) {
                missCap(cap);
            }
        }, 2200);

        cap._lifetime = lifetime;
        activeCaps.push(cap);
        field.appendChild(cap);
    }

    function handleInput() {
        if (!isPlaying) return;

        const typed = input.value.toUpperCase();
        if (!typed) return;

        const lastChar = typed.slice(-1);
        input.value = '';

        const match = activeCaps.find(function (cap) {
            return cap.dataset.letter === lastChar;
        });

        if (match) {
            window.clearTimeout(match._lifetime);
            const bonus = Math.min(Math.floor(combo / 5) + 1, 4);
            popCap(match, bonus);
        } else {
            combo = 0;
            updateDisplay();
            statusElement.textContent = 'Wrong key! Combo reset.';
        }
    }

    function endRound() {
        isPlaying = false;
        clearRound();
        startButton.disabled = false;
        startButton.textContent = 'Play Again';

        const wpm = Math.round((score / roundLength) * 60);
        const bestScore = getBestScore();

        if (score > bestScore) {
            setBestScore(score);
            statusElement.textContent = `New best! ${score} pops (~${wpm} keys/min)`;
        } else {
            statusElement.textContent = `Time! ${score} pops (~${wpm} keys/min). Best: ${bestScore}`;
        }
    }

    function startRound() {
        clearRound();
        isPlaying = true;
        score = 0;
        combo = 0;
        timeLeft = roundLength;
        updateDisplay();
        statusElement.textContent = 'Type the letters before they fade!';
        startButton.disabled = true;
        startButton.textContent = 'Playing...';
        input.disabled = false;
        input.focus();

        spawnCap();
        spawnTimer = window.setInterval(spawnCap, 700);
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
    input.addEventListener('input', handleInput);
}

function initReactionGame() {
    const startButton = document.getElementById('reaction-start');
    const pad = document.getElementById('reaction-pad');
    const roundElement = document.getElementById('reaction-round');
    const resultElement = document.getElementById('reaction-result');
    const bestElement = document.getElementById('reaction-best');
    const statusElement = document.getElementById('reaction-status');

    if (!startButton || !pad || !roundElement || !resultElement || !bestElement || !statusElement) return;

    const totalRounds = 5;
    const bestKey = 'reactionBestAvg';
    let round = 0;
    let times = [];
    let waitTimer = null;
    let startTime = 0;
    let state = 'idle';

    function getBest() {
        return Number(localStorage.getItem(bestKey)) || 0;
    }

    function setBest(avg) {
        localStorage.setItem(bestKey, avg.toString());
        bestElement.textContent = `${avg} ms`;
    }

    function resetPad() {
        pad.className = 'reaction-pad reaction-pad-waiting';
        pad.textContent = 'Wait for green...';
    }

    function clearTimers() {
        if (waitTimer) {
            window.clearTimeout(waitTimer);
            waitTimer = null;
        }
    }

    function finishSession() {
        state = 'done';
        clearTimers();
        const avg = Math.round(times.reduce(function (a, b) { return a + b; }, 0) / times.length);
        resultElement.textContent = `${avg} ms avg`;
        roundElement.textContent = `${totalRounds}/${totalRounds}`;
        pad.className = 'reaction-pad reaction-pad-done';
        pad.textContent = 'Session complete!';
        startButton.disabled = false;
        startButton.textContent = 'Play Again';

        const best = getBest();
        if (!best || avg < best) {
            setBest(avg);
            statusElement.textContent = `New best average: ${avg} ms!`;
        } else {
            statusElement.textContent = `Average: ${avg} ms. Best: ${best} ms.`;
        }
    }

    function scheduleGreen() {
        state = 'waiting';
        resetPad();
        const delay = 1200 + Math.random() * 2800;
        waitTimer = window.setTimeout(function () {
            state = 'ready';
            pad.className = 'reaction-pad reaction-pad-ready';
            pad.textContent = 'CLICK!';
            startTime = performance.now();
        }, delay);
    }

    function startSession() {
        clearTimers();
        round = 0;
        times = [];
        state = 'waiting';
        resultElement.textContent = '—';
        roundElement.textContent = `0/${totalRounds}`;
        startButton.disabled = true;
        startButton.textContent = 'Playing...';
        statusElement.textContent = 'Do not click until the pad turns green.';
        scheduleGreen();
    }

    function handlePadClick() {
        if (state === 'idle' || state === 'done') return;

        if (state === 'waiting') {
            clearTimers();
            state = 'false-start';
            pad.className = 'reaction-pad reaction-pad-false';
            pad.textContent = 'Too soon!';
            statusElement.textContent = 'False start. Click Start to try again.';
            startButton.disabled = false;
            startButton.textContent = 'Try Again';
            return;
        }

        if (state === 'ready') {
            const elapsed = Math.round(performance.now() - startTime);
            times.push(elapsed);
            round += 1;
            roundElement.textContent = `${round}/${totalRounds}`;
            resultElement.textContent = `${elapsed} ms`;
            statusElement.textContent = `Round ${round}: ${elapsed} ms`;

            if (round >= totalRounds) {
                finishSession();
            } else {
                scheduleGreen();
            }
        }
    }

    bestElement.textContent = getBest() ? `${getBest()} ms` : '—';
    startButton.addEventListener('click', startSession);
    pad.addEventListener('click', handlePadClick);
}

function initScrambleGame() {
    const startButton = document.getElementById('scramble-start');
    const wordElement = document.getElementById('scramble-word');
    const scoreElement = document.getElementById('scramble-score');
    const timeElement = document.getElementById('scramble-time');
    const bestElement = document.getElementById('scramble-best');
    const statusElement = document.getElementById('scramble-status');
    const input = document.getElementById('scramble-input');

    if (!startButton || !wordElement || !scoreElement || !timeElement || !bestElement || !statusElement || !input) return;

    const words = [
        'WAKFU', 'MAPLE', 'PIXEL', 'CRAFT', 'QUEST', 'LOOT', 'BUFF', 'SKILL',
        'PARTY', 'RAID', 'HEAL', 'TANK', 'DPS', 'GUILD', 'TRADE', 'GRIND',
        'NOOB', 'POOF', 'SAKURA', 'BEADS', 'COMBO', 'STUN', 'MOB', 'BOSS'
    ];
    const roundLength = 45;
    const bestKey = 'scrambleBestScore';
    let score = 0;
    let timeLeft = roundLength;
    let currentWord = '';
    let countdownTimer = null;
    let isPlaying = false;

    function scramble(word) {
        const chars = word.split('');
        for (let i = chars.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
        }
        const result = chars.join('');
        return result === word ? scramble(word) : result;
    }

    function pickWord() {
        currentWord = words[Math.floor(Math.random() * words.length)];
        wordElement.textContent = scramble(currentWord);
    }

    function getBest() {
        return Number(localStorage.getItem(bestKey)) || 0;
    }

    function setBest(next) {
        localStorage.setItem(bestKey, next.toString());
        bestElement.textContent = next.toString();
    }

    function clearRound() {
        if (countdownTimer) {
            window.clearInterval(countdownTimer);
            countdownTimer = null;
        }
        input.value = '';
        input.disabled = true;
    }

    function endRound() {
        isPlaying = false;
        clearRound();
        startButton.disabled = false;
        startButton.textContent = 'Play Again';
        wordElement.textContent = '—';

        const best = getBest();
        if (score > best) {
            setBest(score);
            statusElement.textContent = `New best: ${score} words solved!`;
        } else {
            statusElement.textContent = `Time! You solved ${score} words. Best: ${best}.`;
        }
    }

    function checkAnswer() {
        if (!isPlaying) return;

        const guess = input.value.trim().toUpperCase();
        if (!guess) return;

        if (guess === currentWord) {
            score += 1;
            scoreElement.textContent = score.toString();
            statusElement.textContent = 'Correct!';
            input.value = '';
            pickWord();
        } else if (guess.length >= currentWord.length) {
            statusElement.textContent = 'Not quite. Keep trying!';
            input.value = '';
        }
    }

    function startRound() {
        clearRound();
        isPlaying = true;
        score = 0;
        timeLeft = roundLength;
        scoreElement.textContent = '0';
        timeElement.textContent = timeLeft.toString();
        statusElement.textContent = 'Unscramble as many words as you can!';
        startButton.disabled = true;
        startButton.textContent = 'Playing...';
        input.disabled = false;
        input.focus();
        pickWord();

        countdownTimer = window.setInterval(function () {
            timeLeft -= 1;
            timeElement.textContent = timeLeft.toString();
            if (timeLeft <= 0) {
                endRound();
            }
        }, 1000);
    }

    bestElement.textContent = getBest().toString();
    timeElement.textContent = roundLength.toString();
    startButton.addEventListener('click', startRound);
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
    input.addEventListener('input', function () {
        if (input.value.trim().toUpperCase() === currentWord) {
            checkAnswer();
        }
    });
}

function initGamesPage() {
    initSakuraGame();
    initKeyPopGame();
    initReactionGame();
    initScrambleGame();
}

document.addEventListener('DOMContentLoaded', initGamesPage);
