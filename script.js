let words = [];
let currentIndex = 0;
let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
let knownWords = JSON.parse(localStorage.getItem("knownWords")) || [];

// Update counter
function updateKnownWordsCounter() {
    document.getElementById("knownWordsCounter").textContent = `מילים ידועות: ${knownWords.length}`;
}

document.addEventListener("DOMContentLoaded", () => {
    loadWords();
    updateKnownWordsCounter();
    document.getElementById("englishWord").addEventListener("click", addToFlashcards);
    document.getElementById("hebrewTranslation").addEventListener("click", addToFlashcards);
    document.getElementById("removeWordBtn").addEventListener("click", removeKnownWord);
    document.getElementById("shareBtn").addEventListener("click", shareProgress);
});

async function loadWords() {
    try {
        const response = await fetch("updated_sentences.json");
        words = await response.json();
        words = words.filter(word => !knownWords.some(known => known.english === word.english)); // Remove known words
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
    let englishWord = document.getElementById("englishWord").textContent;
    let hebrewTranslation = document.getElementById("hebrewTranslation").textContent;
    let messageBox = document.getElementById("messageBox");
    
    if (!flashcards.some(card => card.english === englishWord)) {
        flashcards.push({ english: englishWord, hebrew: hebrewTranslation });
        localStorage.setItem("flashcards", JSON.stringify(flashcards));
        
        messageBox.textContent = "✅ המילה נוספה לכרטיסיות!";
        messageBox.classList.remove("hidden");
        
        setTimeout(() => {
            messageBox.classList.add("hidden");
        }, 2000);
    }
}

function removeKnownWord() {
    let englishWord = document.getElementById("englishWord").textContent;
    let hebrewTranslation = document.getElementById("hebrewTranslation").textContent;
    
    knownWords.push({ english: englishWord, hebrew: hebrewTranslation });
    localStorage.setItem("knownWords", JSON.stringify(knownWords));
    updateKnownWordsCounter();
    
    words = words.filter(word => word.english !== englishWord);
    currentIndex = Math.min(currentIndex, words.length - 1);
    displayWord();
}

function shareProgress() {
    const shareText = `אני לומד עברית! אני כבר יודע ${knownWords.length} מילים! 🌟
    נסו גם: https://yourlanguagewebsite.com`;
    if (navigator.share) {
        navigator.share({ text: shareText })
            .then(() => console.log("Shared successfully"))
            .catch(error => console.error("Error sharing:", error));
    } else {
        alert("Sharing not supported on this browser.");
    }
}
