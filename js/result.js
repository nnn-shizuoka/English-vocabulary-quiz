// 保存データ取得
const isClear = localStorage.getItem("isClear");
const level = localStorage.getItem("level");
const playedWords =
    JSON.parse(localStorage.getItem("playedWords")) || [];

// 要素取得
const judgeEl = document.getElementById("judge");
const levelEl = document.getElementById("level");
const listEl = document.getElementById("wordList");

// クリア判定表示
if (isClear === "true") {
    judgeEl.textContent = "🎉 クリア！おめでとう！";
} else {
    judgeEl.textContent = "⏰ 時間切れ...失敗です";
}

// 難易度表示
levelEl.textContent =
    "難易度：" + (level === "easy" ? "初級" : "上級");

// 出題単語表示
playedWords.forEach(word => {
    const container = document.createElement("div");

    const answerEl = document.createElement("div");
    answerEl.textContent = `【${word.answer}】${word.isCorrect ? "◯" : "×"}`;

    const questionEl = document.createElement("div");
    questionEl.textContent = word.question;

    container.appendChild(answerEl);
    container.appendChild(questionEl);

    container.style.marginBottom = "10px";

    listEl.appendChild(container);
});

