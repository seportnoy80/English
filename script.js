let words = [];
let currentIndex = 0;
let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

document.addEventListener("DOMContentLoaded", () => {
    loadWords();
    document.getElementById("englishWord").addEventListener("click", addToFlashcards);
    document.getElementById("hebrewTranslation").addEventListener("click", addToFlashcards);
});

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
    document.getElementById("hebrewTranslation").classList.add("opacity-0");
    document.getElementById("coverLayer").classList.remove("hidden");
    document.getElementById("sentenceNumber").textContent = `מילה ${currentIndex + 1} מתוך ${words.length}`;
}

document.getElementById("coverLayer")?.addEventListener("click", function() {
    document.getElementById("coverLayer").classList.add("hidden");
    document.getElementById("hebrewTranslation").classList.remove("opacity-0");
});

document.getElementById("nextSentenceBtn")?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % words.length;
    displayWord();
});

document.getElementById("prevSentenceBtn")?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + words.length) % words.length;
    displayWord();
});

function addToFlashcards() {
    let englishWord = document.getElementById("englishWord")?.textContent;
    let hebrewTranslation = document.getElementById("hebrewTranslation")?.textContent;
    let messageBox = document.getElementById("messageBox");

    console.log("Trying to add:", englishWord, hebrewTranslation);

    if (!englishWord || !hebrewTranslation) {
        console.error("Error: Could not find words.");
        return;
    }

    if (!flashcards.some(card => card.english === englishWord)) {
        flashcards.push({ english: englishWord, hebrew: hebrewTranslation });
        localStorage.setItem("flashcards", JSON.stringify(flashcards));
        
        console.log("✅ Word added to flashcards:", flashcards);
        
        messageBox.textContent = "✅ המילה נוספה לכרטיסיות!";
        messageBox.classList.remove("hidden");

        setTimeout(() => {
            messageBox.classList.add("hidden");
        }, 2000);
    } else {
        console.log("ℹ️ Word already exists in flashcards.");
    }
}
