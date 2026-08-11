/* ==========================================
   DAYLIGHT — JOURNAL PAGE V2
   Date-based Journal History
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

const calendarGrid =
    document.querySelector("#journal-calendar-grid");

const historyMonth =
    document.querySelector("#history-month");

const prevMonthButton =
    document.querySelector("#prev-journal-month");

const nextMonthButton =
    document.querySelector("#next-journal-month");

const backToTodayButton =
    document.querySelector("#back-to-today");

const thoughtsLabel =
    document.querySelector("#thoughts-label");

const todayButton =
    document.querySelector("#journal-today-btn");


/* ==========================================
   STORAGE
========================================== */

const JOURNAL_STORAGE_KEY =
    "daylightJournalEntries";


/* ==========================================
   PROMPTS
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


/* ==========================================
   STATE
========================================== */

const today =
    new Date();


let selectedDate =
    getDateKey(today);


let calendarDate =
    new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );


let currentPromptIndex = 0;


/* ==========================================
   DATE HELPERS
========================================== */

function getDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function parseDateKey(dateKey) {

    const [
        year,
        month,
        day
    ] = dateKey.split("-").map(Number);


    return new Date(
        year,
        month - 1,
        day
    );

}


function isToday(dateKey) {

    return dateKey ===
        getDateKey(new Date());

}


/* ==========================================
   STORAGE HELPERS
========================================== */

function getJournalEntries() {

    const saved =
        localStorage.getItem(
            JOURNAL_STORAGE_KEY
        );


    if (!saved) {

        return {};

    }


    try {

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Unable to load journal history.",
            error
        );

        return {};

    }

}


function saveJournalEntries(entries) {

    localStorage.setItem(
        JOURNAL_STORAGE_KEY,
        JSON.stringify(entries)
    );

}


/* ==========================================
   MIGRATE OLD JOURNAL
========================================== */

function migrateOldJournal() {

    const existingHistory =
        localStorage.getItem(
            JOURNAL_STORAGE_KEY
        );


    /*
       If Journal V2 already exists,
       nothing needs to be migrated.
    */

    if (existingHistory) {

        return;

    }


    const oldEntry =
        localStorage.getItem(
            "journalEntry"
        );

    const oldTime =
        localStorage.getItem(
            "journalTime"
        );


    /*
       Nothing to migrate.
    */

    if (!oldEntry && !oldTime) {

        return;

    }


    const entries = {};


    entries[getDateKey(today)] = {

        thoughts:
            oldEntry || "",

        prompt:
            journalPrompts[0],

        promptResponse:
            "",

        updatedAt:
            oldTime || ""

    };


    saveJournalEntries(entries);

}


/* ==========================================
   GET CURRENT ENTRY
========================================== */

function getSelectedEntry() {

    const entries =
        getJournalEntries();


    return entries[selectedDate] || {

        thoughts: "",

        prompt:
            journalPrompts[currentPromptIndex],

        promptResponse: "",

        updatedAt: ""

    };

}


/* ==========================================
   SAVE SELECTED ENTRY
========================================== */

function saveSelectedEntry() {

    if (!journalEntry) {

        return;

    }


    const entries =
        getJournalEntries();


    const existing =
        entries[selectedDate] || {};


    const now =
        new Date();


    const time =
        now.toLocaleTimeString([], {

            hour: "numeric",
            minute: "2-digit"

        });


    entries[selectedDate] = {

        thoughts:
            journalEntry.value,

        prompt:
            existing.prompt ||
            journalPrompts[currentPromptIndex],

        promptResponse:
            existing.promptResponse || "",

        updatedAt:
            time

    };


    saveJournalEntries(entries);


    updateLastEdited(time);

    renderJournalCalendar();


    showSavedState(
        saveButton,
        "Saved ♡"
    );

}


/* ==========================================
   SAVE PROMPT RESPONSE
========================================== */

function savePromptResponse() {

    if (!promptResponse) {

        return;

    }


    const entries =
        getJournalEntries();


    const existing =
        entries[selectedDate] || {};


    const now =
        new Date();


    const time =
        now.toLocaleTimeString([], {

            hour: "numeric",
            minute: "2-digit"

        });


    entries[selectedDate] = {

        thoughts:
            existing.thoughts ||
            "",

        prompt:
            journalPrompts[currentPromptIndex],

        promptResponse:
            promptResponse.value,

        updatedAt:
            time

    };


    saveJournalEntries(entries);


    updateLastEdited(time);

    renderJournalCalendar();


    showSavedState(
        savePromptButton,
        "Saved ♡"
    );

}


/* ==========================================
   LOAD SELECTED ENTRY
========================================== */

function loadSelectedEntry() {

    const entry =
        getSelectedEntry();


    journalEntry.value =
        entry.thoughts || "";


    promptResponse.value =
        entry.promptResponse || "";


    /*
       If the saved entry has a prompt,
       find that prompt in our list.
    */

    const promptIndex =
        journalPrompts.indexOf(
            entry.prompt
        );


    if (promptIndex >= 0) {

        currentPromptIndex =
            promptIndex;

    }


    journalPrompt.textContent =
        `“${journalPrompts[currentPromptIndex]}”`;


    updateWordCount();


    updateLastEdited(
        entry.updatedAt
    );


    updateThoughtsLabel();


    updateBackToTodayButton();

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
   LAST EDITED
========================================== */

function updateLastEdited(time) {

    if (!lastEdited) {

        return;

    }


    if (!time) {

        lastEdited.textContent =
            "Not saved yet";

        return;

    }


    lastEdited.textContent =
        `Edited ${time}`;

}


/* ==========================================
   SAVED BUTTON STATE
========================================== */

function showSavedState(button, text) {

    if (!button) {

        return;

    }


    const original =
        button.textContent;


    button.textContent =
        text;


    setTimeout(() => {

        button.textContent =
            original;

    }, 1400);

}


/* ==========================================
   PROMPT NAVIGATION
========================================== */

function showNextPrompt() {

    /*
       Save the current response before
       moving to the next prompt.
    */

    savePromptResponse();


    currentPromptIndex =
        (
            currentPromptIndex + 1
        ) % journalPrompts.length;


    journalPrompt.style.opacity =
        "0";


    promptResponse.style.opacity =
        "0";


    setTimeout(() => {

        journalPrompt.textContent =
            `“${journalPrompts[currentPromptIndex]}”`;


        const entry =
            getSelectedEntry();


        promptResponse.value =
            entry.prompt ===
            journalPrompts[currentPromptIndex]

                ? entry.promptResponse || ""

                : "";


        journalPrompt.style.opacity =
            "1";

        promptResponse.style.opacity =
            "1";

    }, 180);

}


/* ==========================================
   JOURNAL CALENDAR
========================================== */

function renderJournalCalendar() {

    if (!calendarGrid) {

        return;

    }


    calendarGrid.innerHTML =
        "";


    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const entries =
        getJournalEntries();


    const monthName =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    historyMonth.textContent =
        monthName;


    /*
       Empty cells before the first day.
    */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "journal-day empty";

        calendarGrid.appendChild(
            empty
        );

    }


    /*
       Actual days.
    */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const dateKey =
            getDateKey(date);


        const button =
            document.createElement("button");


        button.type =
            "button";


        button.className =
            "journal-day";


        button.textContent =
            day;


        if (isToday(dateKey)) {

            button.classList.add(
                "today"
            );

        }


        if (dateKey === selectedDate) {

            button.classList.add(
                "selected"
            );

        }


        if (hasJournalEntry(
            entries[dateKey]
        )) {

            button.classList.add(
                "has-entry"
            );

        }


        /*
           Future dates cannot be selected.
        */

        if (
            date >
            new Date()
        ) {

            button.disabled =
                true;

            button.style.opacity =
                "0.45";

        } else {

            button.addEventListener(
                "click",
                () => {

                    openJournalDate(
                        dateKey
                    );

                }
            );

        }


        calendarGrid.appendChild(
            button
        );

    }

}


/* ==========================================
   CHECK IF DATE HAS ENTRY
========================================== */

function hasJournalEntry(entry) {

    if (!entry) {

        return false;

    }


    return Boolean(

        (entry.thoughts &&
            entry.thoughts.trim()) ||

        (entry.promptResponse &&
            entry.promptResponse.trim())

    );

}


/* ==========================================
   OPEN JOURNAL DATE
========================================== */

function openJournalDate(dateKey) {

    selectedDate =
        dateKey;


    const date =
        parseDateKey(dateKey);


    /*
       Change the calendar month
       if necessary.
    */

    calendarDate =
        new Date(
            date.getFullYear(),
            date.getMonth(),
            1
        );


    loadSelectedEntry();

    renderJournalCalendar();

}


/* ==========================================
   TODAY
========================================== */

function goToToday() {

    selectedDate =
        getDateKey(
            new Date()
        );


    const now =
        new Date();


    calendarDate =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );


    loadSelectedEntry();

    renderJournalCalendar();

}


/* ==========================================
   LABEL
========================================== */

function updateThoughtsLabel() {

    if (!thoughtsLabel) {

        return;

    }


    if (isToday(selectedDate)) {

        thoughtsLabel.textContent =
            "THOUGHTS TODAY";

        return;

    }


    const date =
        parseDateKey(
            selectedDate
        );


    const formatted =
        date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric"
            }
        );


    thoughtsLabel.textContent =
        `THOUGHTS — ${formatted.toUpperCase()}`;

}


/* ==========================================
   BACK TO TODAY BUTTON
========================================== */

function updateBackToTodayButton() {

    if (!backToTodayButton) {

        return;

    }


    backToTodayButton.classList.toggle(
        "hidden",
        isToday(selectedDate)
    );

}


/* ==========================================
   CALENDAR MONTH NAVIGATION
========================================== */

function changeCalendarMonth(direction) {

    calendarDate =
        new Date(
            calendarDate.getFullYear(),
            calendarDate.getMonth() +
                direction,
            1
        );


    renderJournalCalendar();

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
        saveSelectedEntry
    );

}


if (savePromptButton) {

    savePromptButton.addEventListener(
        "click",
        savePromptResponse
    );

}


if (newPromptButton) {

    newPromptButton.addEventListener(
        "click",
        showNextPrompt
    );

}


if (prevMonthButton) {

    prevMonthButton.addEventListener(
        "click",
        () => {

            changeCalendarMonth(-1);

        }
    );

}


if (nextMonthButton) {

    nextMonthButton.addEventListener(
        "click",
        () => {

            changeCalendarMonth(1);

        }
    );

}


if (backToTodayButton) {

    backToTodayButton.addEventListener(
        "click",
        goToToday
    );

}


if (todayButton) {

    todayButton.addEventListener(
        "click",
        goToToday
    );

}


/* ==========================================
   INITIALIZE
========================================== */

migrateOldJournal();

loadSelectedEntry();

renderJournalCalendar();