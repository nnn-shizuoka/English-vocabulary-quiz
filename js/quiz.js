// URLパラメータ取得
const params = new URLSearchParams(location.search);
const level = params.get("level");

if (level !== "easy" && level !== "hard") {
    location.href = "index.html";
}

// 出題数・制限時間
const totalQuestions = level === "easy" ? 5 : 8;
const TIME_LIMIT = 10; // 1問の制限時間（秒）

// 状態管理
let currentIndex = 0;
let correctCount = 0;
let currentWord = null;
let playedWords = [];

let timeLeft = TIME_LIMIT;
let timerId = null;

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
    currentWord = words[currentIndex];

    questionEl.textContent = currentWord.question;

    if (level === "easy") {
        hintEl.textContent = createHint(currentWord.answer);
    } else {
        hintEl.textContent = "？".repeat(currentWord.answer.length);
    }

    progressEl.textContent = `${currentIndex + 1} / ${totalQuestions}`;
    answerEl.value = "";
    resultEl.textContent = "";
    answerEl.focus();

    clearInterval(timerId);
    startTimer();
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
    const input = answerEl.value.trim().toLowerCase();

    if (input === currentWord.answer.toLowerCase()) {
        clearInterval(timerId);

        resultEl.textContent = "◯";
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
    const hint = Array(chars.length).fill("_");

    const revealCount = Math.max(1, Math.floor(chars.length / 2));

    const indexes = [...chars.keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, revealCount);

    indexes.forEach(i => {
        hint[i] = chars[i];
    });

    return hint.join(" ");
}

// 初回表示
showQuestion();
