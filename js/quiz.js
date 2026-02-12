// URLパラメータ取得
const params = new URLSearchParams(location.search);
const level = params.get("level");

if (level !== "easy" && level !== "hard") {
    location.href = "index.html";
}

// 出題数・制限時間
const totalQuestions = level === "easy" ? 5 : 8;
const TIME_LIMIT = 15; // 1問の制限時間（秒）

// 状態管理
let currentIndex = 0;
let correctCount = 0;
let currentWord = null;
let playedWords = [];

let timeLeft = TIME_LIMIT;
let timerId = null;

let isAnswered = false;

// 問題データ初期化
let words = shuffleArray(QUESTIONS[level]).slice(0, totalQuestions);

// 要素取得
const questionEl = document.getElementById("question");
const hintEl = document.getElementById("hint");
const resultEl = document.getElementById("result");
const progressEl = document.getElementById("progress");
const answerEl = document.getElementById("answer");
const checkBtn = document.getElementById("checkBtn");
const timerEl = document.getElementById("timer");

// 問題表示
function showQuestion() {
    isAnswered = false;
    currentWord = words[currentIndex];

    questionEl.textContent = currentWord.question;

    if (level === "easy") {
        hintEl.textContent = createHint(currentWord.answer);
    } else {
        hintEl.textContent = createHardHint(currentWord.answer);
    }


    progressEl.textContent = `${currentIndex + 1} / ${totalQuestions}`;
    answerEl.value = "";
    resultEl.classList.remove("show");
    resultEl.textContent = "";
    answerEl.focus();

    clearInterval(timerId);
    startTimer();
}

function createHardHint(word) {
    return word
        .split("")
        .map(ch => ch === " " ? "⃞" : "？")
        .join(" ");
}


// タイマー開始
function startTimer() {
    timeLeft = TIME_LIMIT;
    timerEl.textContent = `残り時間：${timeLeft}秒`;

    timerId = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `残り時間：${timeLeft}秒`;

        if (timeLeft <= 0) {
            clearInterval(timerId);
            timeUp();
        }
    }, 1000);
}

// 時間切れ処理（即失敗）
function timeUp() {
    // ★ 今出題中の問題だけ「未回答」として追加
    playedWords.push({
        question: currentWord.question,
        answer: currentWord.answer,
        isCorrect: false
    });

    localStorage.setItem("level", level);
    localStorage.setItem(
        "playedWords",
        JSON.stringify(playedWords)
    );
    localStorage.setItem("isClear", "false");

    location.href = "result.html";
}



// 回答チェック
function checkAnswer() {
    if (isAnswered) return;
    const input = answerEl.value.trim().toLowerCase();

    if (input === currentWord.answer.toLowerCase()) {
        isAnswered = true;
        clearInterval(timerId);

        resultEl.textContent = "◯";
        resultEl.classList.remove("show");
        void resultEl.offsetWidth;
        resultEl.classList.add("show");
        correctCount++;

        playedWords.push({
            question: currentWord.question,
            answer: currentWord.answer,
            isCorrect: true
        });

        // 正解したときだけ次へ
        setTimeout(nextQuestion, 800);
    } else {
        answerEl.value = "";
        answerEl.focus();
    }
}

// 次の問題へ
function nextQuestion() {
    currentIndex++;

    if (currentIndex >= totalQuestions) {
        localStorage.setItem("level", level);
        localStorage.setItem(
            "playedWords",
            JSON.stringify(playedWords)
        );
        localStorage.setItem("isClear", "true");

        location.href = "result.html";
    } else {
        showQuestion();
    }
}

// Enterキー対応
answerEl.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        checkAnswer();
    }
});

checkBtn.addEventListener("click", checkAnswer);

// シャッフル
function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

// 初級用ヒント生成
function createHint(word) {
    const chars = word.split("");
    const hint = chars.map(ch => ch === " " ? "⃞" : "_");

    const letterIndexes = chars
        .map((ch, i) => ch !== " " ? i : null)
        .filter(i => i !== null);

    const revealCount = Math.max(
        1,
        Math.floor(letterIndexes.length / 2)
    );

    const indexes = letterIndexes
        .sort(() => Math.random() - 0.5)
        .slice(0, revealCount);

    indexes.forEach(i => {
        hint[i] = chars[i];
    });

    return hint.join(" ");
}

// 初回表示
showQuestion();
