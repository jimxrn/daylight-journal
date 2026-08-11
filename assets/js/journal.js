/* ==========================================
JOURNAL WIDGET
========================================== */

const journalEntry = document.querySelector("#journal-entry");
const wordCount = document.querySelector("#word-count");
const lastEdited = document.querySelector("#last-edited");

if (journalEntry) {

    loadJournal();

    journalEntry.addEventListener("input", saveJournal);

}

function saveJournal() {

    const text = journalEntry.value;

    localStorage.setItem("journalEntry", text);

    const words = text
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0);

    wordCount.textContent = `${words.length} words`;

    const now = new Date();

    const time = now.toLocaleTimeString([], {

        hour: "numeric",
        minute: "2-digit"

    });

    lastEdited.textContent = `Edited ${time}`;

    localStorage.setItem("journalTime", time);

}

function loadJournal() {

    const savedText = localStorage.getItem("journalEntry");
    const savedTime = localStorage.getItem("journalTime");

    if (savedText) {

        journalEntry.value = savedText;

        const words = savedText
            .trim()
            .split(/\s+/)
            .filter(word => word.length > 0);

        wordCount.textContent = `${words.length} words`;

    }

    if (savedTime) {

        lastEdited.textContent = `Edited ${savedTime}`;

    }

}