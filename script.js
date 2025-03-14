let words = [];
let currentIndex = 0;
let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

async function loadWords() {
    try {
        const response = await fetch("updated_sentences.json");
        words = await response.json();
        displayWord();
    } catch (error) {
        console.error("Failed to load words.", error);
    }
}

function displayWord() {
    if (words.length === 0) return;
    document.getElementById("englishWord").textContent = words[currentIndex].english;
    document.getElementById("hebrewTranslation").textContent = words[currentIndex].hebrew;
    document.getElementById("sentenceNumber").textContent = `מילה ${currentIndex + 1} מתוך ${words.length}`;
}

document.getElementById("nextSentenceBtn")?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % words.length;
    displayWord();
});

document.getElementById("prevSentenceBtn")?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    displayWord();
});

document.getElementById("englishWord")?.addEventListener("click", () => {
    const wordToSave = words[currentIndex];
    if (!flashcards.some(flashcard => flashcard.english === wordToSave.english)) {
        flashcards.push(wordToSave);
        localStorage.setItem("flashcards", JSON.stringify(flashcards));
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadWords();
});
