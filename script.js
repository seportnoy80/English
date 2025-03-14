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
    document.getElementById("hebrewTranslation").classList.add("hidden");
    document.getElementById("sentenceNumber").textContent = `מילה ${currentIndex + 1} מתוך ${words.length}`;
}

document.getElementById("showTranslation").addEventListener("click", () => {
    document.getElementById("hebrewTranslation").classList.toggle("hidden");
});

document.getElementById("nextSentenceBtn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % words.length;
    displayWord();
});

document.getElementById("prevSentenceBtn").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    displayWord();
});

document.getElementById("englishWord").addEventListener("click", () => {
    const wordToSave = words[currentIndex];
    if (!flashcards.some(flashcard => flashcard.english === wordToSave.english)) {
        flashcards.push(wordToSave);
        localStorage.setItem("flashcards", JSON.stringify(flashcards));
    }
});

function loadFlashcards() {
    if (flashcards.length === 0) {
        document.getElementById("flashcardEnglish").textContent = "אין כרטיסיות";
        document.getElementById("flashcardHebrew").textContent = "";
        return;
    }
    document.getElementById("flashcardEnglish").textContent = flashcards[currentIndex].english;
    document.getElementById("flashcardHebrew").textContent = flashcards[currentIndex].hebrew;
    document.getElementById("flashcardNumber").textContent = `כרטיס ${currentIndex + 1} מתוך ${flashcards.length}`;
}

document.getElementById("nextFlashcardBtn").addEventListener("click", () => {
    if (flashcards.length === 0) return;
    currentIndex = (currentIndex + 1) % flashcards.length;
    loadFlashcards();
});

document.getElementById("prevFlashcardBtn").addEventListener("click", () => {
    if (flashcards.length === 0) return;
    currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
    loadFlashcards();
});

document.getElementById("deleteFlashcardBtn").addEventListener("click", () => {
    if (flashcards.length === 0) return;
    flashcards.splice(currentIndex, 1);
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    currentIndex = Math.min(currentIndex, flashcards.length - 1);
    loadFlashcards();
});

document.getElementById("shuffleFlashcardsBtn").addEventListener("click", () => {
    flashcards = flashcards.sort(() => Math.random() - 0.5);
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    loadFlashcards();
});

document.addEventListener("DOMContentLoaded", () => {
    loadWords();
    loadFlashcards();
});
