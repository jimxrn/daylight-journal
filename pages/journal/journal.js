/* ==========================================
   DAYLIGHT — JOURNAL PAGE
========================================== */


/* ==========================================
   ELEMENTS
========================================== */

const journalEntry =
    document.querySelector("#journal-entry");

const wordCount =
    document.querySelector("#word-count");

const lastEdited =
    document.querySelector("#last-edited");

const saveButton =
    document.querySelector("#save-journal");

const newPromptButton =
    document.querySelector("#new-prompt");

const journalPrompt =
    document.querySelector("#journal-prompt");

const promptResponse =
    document.querySelector("#prompt-response");

const savePromptButton =
    document.querySelector("#save-prompt");


/* ==========================================
   JOURNAL PROMPTS
========================================== */

const journalPrompts = [

    "What made today feel a little lighter?",

    "What is something you want to remember about today?",

    "What felt good, even if only for a moment?",

    "What has been quietly taking up space in your mind?",

    "What is something you're grateful for today?",

    "What do you need a little more of today?",

    "What is one thought you'd like to leave here?",

    "What are you learning about yourself lately?"

];


let currentPromptIndex = 0;


/* ==========================================
   PROMPT RESPONSES
========================================== */

function getPromptResponses() {

    const saved =
        localStorage.getItem("promptResponses");

    if (!saved) {
        return {};
    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Unable to load prompt responses.",
            error
        );

        return {};

    }

}


function savePromptResponse() {

    if (!promptResponse || !journalPrompt) {
        return;
    }


    const prompt =
        journalPrompts[currentPromptIndex];

    const response =
        promptResponse.value;


    const responses =
        getPromptResponses();


    responses[prompt] =
        response;


    localStorage.setItem(
        "promptResponses",
        JSON.stringify(responses)
    );


    const originalText =
        savePromptButton.textContent;


    savePromptButton.textContent =
        "Saved ♡";


    setTimeout(() => {

        savePromptButton.textContent =
            originalText;

    }, 1400);

}


function loadPromptResponse() {

    if (!promptResponse) {
        return;
    }


    const prompt =
        journalPrompts[currentPromptIndex];

    const responses =
        getPromptResponses();


    promptResponse.value =
        responses[prompt] || "";

}


/* ==========================================
   WORD COUNT
========================================== */

function updateWordCount() {

    if (!journalEntry || !wordCount) {
        return;
    }


    const text =
        journalEntry.value.trim();


    const words =
        text
            ? text.split(/\s+/)
            : [];


    const count =
        words.length;


    wordCount.textContent =
        `${count} ${count === 1 ? "word" : "words"}`;

}


/* ==========================================
   LOAD JOURNAL
========================================== */

function loadJournal() {

    if (!journalEntry) {
        return;
    }


    const savedText =
        localStorage.getItem("journalEntry");

    const savedTime =
        localStorage.getItem("journalTime");


    if (savedText !== null) {

        journalEntry.value =
            savedText;

    }


    if (savedTime && lastEdited) {

        lastEdited.textContent =
            `Edited ${savedTime}`;

    }


    updateWordCount();

}


/* ==========================================
   SAVE JOURNAL
========================================== */

function saveJournal() {

    if (!journalEntry) {
        return;
    }


    const text =
        journalEntry.value;


    localStorage.setItem(
        "journalEntry",
        text
    );


    const now =
        new Date();


    const time =
        now.toLocaleTimeString([], {

            hour: "numeric",
            minute: "2-digit"

        });


    localStorage.setItem(
        "journalTime",
        time
    );


    updateWordCount();


    if (lastEdited) {

        lastEdited.textContent =
            `Edited ${time}`;

    }


    const originalText =
        saveButton.innerHTML;


    saveButton.innerHTML =
        "Saved ♡";


    setTimeout(() => {

        saveButton.innerHTML =
            originalText;

    }, 1400);

}


/* ==========================================
   NEW PROMPT
========================================== */

function showNextPrompt() {

    /*
       Save the current response before
       moving to another prompt.
    */

    savePromptResponse();


    currentPromptIndex =
        (currentPromptIndex + 1)
        % journalPrompts.length;


    journalPrompt.style.opacity =
        "0";


    promptResponse.style.opacity =
        "0";


    setTimeout(() => {

        journalPrompt.textContent =
            `“${journalPrompts[currentPromptIndex]}”`;


        loadPromptResponse();


        journalPrompt.style.opacity =
            "1";

        promptResponse.style.opacity =
            "1";

    }, 150);

}


/* ==========================================
   EVENT LISTENERS
========================================== */

if (journalEntry) {

    journalEntry.addEventListener(
        "input",
        updateWordCount
    );

}


if (saveButton) {

    saveButton.addEventListener(
        "click",
        saveJournal
    );

}


if (newPromptButton) {

    newPromptButton.addEventListener(
        "click",
        showNextPrompt
    );

}


if (savePromptButton) {

    savePromptButton.addEventListener(
        "click",
        savePromptResponse
    );

}


/* ==========================================
   INITIALIZE
========================================== */

loadJournal();

loadPromptResponse();
