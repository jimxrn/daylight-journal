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

const savedJournalEntry =
    document.querySelector("#saved-journal-entry");

const savedEntryDate =
    document.querySelector("#saved-entry-date");

const savedEntryText =
    document.querySelector("#saved-entry-text");

const editJournalEntryButton =
    document.querySelector("#edit-journal-entry");

const savedPromptEntry =
    document.querySelector("#saved-prompt-entry");

const savedPromptDate =
    document.querySelector("#saved-prompt-date");

const savedPromptQuestion =
    document.querySelector("#saved-prompt-question");

const savedPromptText =
    document.querySelector("#saved-prompt-text");

const editPromptEntryButton =
    document.querySelector("#edit-prompt-entry");

/* ==========================================
   STORAGE
========================================== */

const JOURNAL_SECTION =
    "journal";

const JOURNAL_STORAGE_KEY =
    "daylightJournalEntries";

const JOURNAL_PROMPT_STORAGE_KEY =
    "daylightJournalPromptAssignments";

function getPromptAssignments() {

    const journalData =
        getDaylightSection(
            JOURNAL_SECTION
        );

    return (
        journalData?.promptAssignments &&
        typeof journalData.promptAssignments === "object"
    )
        ? journalData.promptAssignments
        : {};

}


function savePromptAssignments(assignments) {

    const journalData =
        getDaylightSection(
            JOURNAL_SECTION
        );

    saveDaylightSection(
        JOURNAL_SECTION,
        {

            ...(journalData || {}),

            promptAssignments:
                assignments

        }
    );

}


function getRandomPromptIndex(excludeIndex = -1) {

    const assignments =
        getPromptAssignments();

    const usedRecently =
        Object.entries(assignments)
            .sort((a, b) =>
                b[0].localeCompare(a[0])
            )
            .slice(0, 14)
            .map(([, index]) => index);

    let available =
        journalPrompts
            .map((_, index) => index)
            .filter(index =>
                index !== excludeIndex &&
                !usedRecently.includes(index)
            );

    /*
     * If the pool has been heavily used,
     * allow older prompts back into rotation.
     */
    if (!available.length) {

        available =
            journalPrompts
                .map((_, index) => index)
                .filter(index =>
                    index !== excludeIndex
                );

    }

    const randomPosition =
        Math.floor(
            Math.random() *
            available.length
        );

    return available[randomPosition];
}
function getPromptForDate(dateKey) {

    const assignments =
        getPromptAssignments();

    if (
        Number.isInteger(
            assignments[dateKey]
        )
    ) {

        return assignments[dateKey];

    }

    const previousDates =
        Object.keys(assignments)
            .sort()
            .filter(key =>
                key < dateKey
            );

    const previousDate =
        previousDates.length
            ? previousDates[
                previousDates.length - 1
            ]
            : null;

    const previousIndex =
        previousDate
            ? assignments[previousDate]
            : -1;

    const promptIndex =
        getRandomPromptIndex(
            previousIndex
        );

    assignments[dateKey] =
        promptIndex;

    savePromptAssignments(
        assignments
    );

    return promptIndex;
}

const journalPrompts = [

    // 01–10 · TODAY & REFLECTION
    "What made today feel a little lighter?",
    "What felt different about today?",
    "What was the most meaningful moment of your day?",
    "What is one thing you want to remember about today?",
    "What surprised you about today?",
    "What part of today would you gladly experience again?",
    "What moment made you pause today?",
    "What did today make you realize?",
    "What was the best part of your day?",
    "If you could describe today in three words, what would they be?",

    // 11–20 · GRATITUDE & APPRECIATION
    "What is something small you're grateful for today?",
    "What is something you have that you don't want to take for granted?",
    "Who or what made your day a little better?",
    "What simple thing brought you comfort today?",
    "What good thing happened that you weren't expecting?",
    "What is something ordinary that you appreciated today?",
    "What made you smile today?",
    "What is something in your life that feels quietly special?",
    "What is something you are thankful you get to experience?",
    "What is one thing you would miss if it suddenly disappeared?",

    // 21–30 · SELF
    "When did you feel most like yourself today?",
    "What did you learn about yourself today?",
    "What are you quietly proud of?",
    "What part of yourself are you understanding better lately?",
    "What is something you handled better than you expected?",
    "What quality in yourself have you been appreciating lately?",
    "What is something about yourself that you want to protect?",
    "What is something you wish you could tell your younger self?",
    "What part of yourself deserves a little more patience?",
    "What is something you are becoming more comfortable with?",

    // 31–40 · EMOTIONS & INNER WORLD
    "What feeling stayed with you the longest today?",
    "What emotion did you find yourself returning to today?",
    "Was there a moment when you felt completely at ease?",
    "What has been quietly taking up space in your mind?",
    "What do you think your mind has been trying to tell you?",
    "What emotion have you been trying to understand lately?",
    "What made you feel safe today?",
    "What made you feel understood today?",
    "What feeling have you been avoiding?",
    "What would you say if you gave your feelings permission to speak freely?",

    // 41–50 · GROWTH & LESSONS
    "What did today teach you?",
    "What is something you're getting better at?",
    "What challenge taught you something useful?",
    "What is one small way you've grown recently?",
    "What are you learning to let go of?",
    "What mistake taught you something valuable?",
    "What is something you understand now that you didn't before?",
    "What habit is helping you become the person you want to be?",
    "What is something you once found difficult that feels easier now?",
    "What lesson do you think you'll carry with you for a long time?",

    // 51–60 · PEACE, REST & SLOWING DOWN
    "What helped you feel calm today?",
    "Where did you find a little peace today?",
    "What do you need a little more of lately?",
    "What could you give yourself permission to slow down from?",
    "What would make tomorrow feel a little gentler?",
    "What helps you feel at home within yourself?",
    "When was the last time you felt truly rested?",
    "What is something you could stop rushing through?",
    "What would a peaceful day look like for you?",
    "What is something you can give yourself permission to leave unfinished?",

    // 61–70 · PEOPLE & CONNECTION
    "Who made you feel seen today?",
    "Who are you grateful to have in your life?",
    "What is something kind someone did for you recently?",
    "Who would you like to spend more time with?",
    "What connection in your life are you thankful for?",
    "Who makes you feel like you can be completely yourself?",
    "What is something you appreciate about someone close to you?",
    "When was the last time someone made you feel genuinely cared for?",
    "Who has influenced the person you are becoming?",
    "What is something you wish you could say to someone right now?",

    // 71–80 · LETTING GO & ACCEPTANCE
    "What is something you'd like to leave behind today?",
    "What thought no longer deserves so much of your energy?",
    "What are you ready to stop carrying?",
    "What would feel lighter if you finally let it go?",
    "What can you accept without needing to fix it?",
    "What expectation could you release?",
    "What are you holding onto simply because it is familiar?",
    "What would you do differently if you stopped worrying about disappointing others?",
    "What is something you don't need an answer to right now?",
    "What deserves less space in your mind?",

    // 81–90 · FUTURE & DREAMS
    "What are you quietly looking forward to?",
    "What is something you want to make more time for?",
    "What would you like tomorrow to feel like?",
    "What is one thing you're excited to experience?",
    "What are you building toward, even if slowly?",
    "What would your ideal ordinary day look like?",
    "What is something you've always wanted to try?",
    "What kind of life are you slowly creating for yourself?",
    "What is something you hope your future self will thank you for?",
    "If you knew you couldn't fail, what would you pursue?",

    // 91–100 · JOY, MEMORY & DEEPER THOUGHTS
    "What ordinary moment felt special today?",
    "What moment from today would you want to remember years from now?",
    "What made you genuinely happy recently?",
    "When did you last feel completely alive?",
    "What little thing brings you more joy than it probably should?",
    "What is something you want more of in your everyday life?",
    "What would you tell yourself about this season of your life?",
    "What is something you hope never becomes ordinary to you?",
    "What is one thought you'd like to leave here tonight?",
    "If your life had a chapter title for this moment, what would it be?"

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


'let currentPromptIndex = 0;'

let isEditingJournalEntry = false;

let isEditingPromptResponse = false;


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

    const journalData =
        getDaylightSection(
            JOURNAL_SECTION
        );

    return (
        journalData?.entries &&
        typeof journalData.entries === "object"
    )
        ? journalData.entries
        : {};

}


function saveJournalEntries(entries) {

    const journalData =
        getDaylightSection(
            JOURNAL_SECTION
        );

    saveDaylightSection(
        JOURNAL_SECTION,
        {

            ...(journalData || {}),

            entries

        }
    );

}
function migrateJournalToCentralStorage() {

    const centralized =
        getDaylightSection(
            JOURNAL_SECTION
        );


    const legacyEntriesRaw =
        localStorage.getItem(
            "daylightJournalEntries"
        );


    const legacyAssignmentsRaw =
        localStorage.getItem(
            "daylightJournalPromptAssignments"
        );


    let entries =
        centralized?.entries || {};


    let promptAssignments =
        centralized?.promptAssignments || {};


    if (
        Object.keys(entries).length === 0 &&
        legacyEntriesRaw
    ) {

        try {

            const migratedEntries =
                JSON.parse(
                    legacyEntriesRaw
                );

            if (
                migratedEntries &&
                typeof migratedEntries === "object"
            ) {

                entries =
                    migratedEntries;

            }

        } catch (error) {

            console.error(
                "Unable to migrate Journal entries.",
                error
            );

        }

    }


    if (
        Object.keys(promptAssignments).length === 0 &&
        legacyAssignmentsRaw
    ) {

        try {

            const migratedAssignments =
                JSON.parse(
                    legacyAssignmentsRaw
                );

            if (
                migratedAssignments &&
                typeof migratedAssignments === "object"
            ) {

                promptAssignments =
                    migratedAssignments;

            }

        } catch (error) {

            console.error(
                "Unable to migrate Journal prompt assignments.",
                error
            );

        }

    }


    saveDaylightSection(
        JOURNAL_SECTION,
        {

            ...(centralized || {}),

            entries,

            promptAssignments

        }
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

    const existing =
        entries[selectedDate];

    const promptIndex =
        getPromptForDate(selectedDate);


    if (existing) {

        return {

            thoughts:
                existing.thoughts || "",

            prompt:
                journalPrompts[promptIndex],

            promptResponse:
                existing.promptResponse || "",

            updatedAt:
                existing.updatedAt || ""

        };

    }


    return {

        thoughts: "",

        prompt:
            journalPrompts[promptIndex],

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


    const text =
        journalEntry.value.trim();


    if (!text) {
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
            text,

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


    isEditingJournalEntry = false;


    journalEntry.value = "";

    updateWordCount();


    showSavedJournalEntry(
        entries[selectedDate]
    );


    updateSaveButton();


    showSavedState(
        saveButton,
        "Saved ♡"
    );

}

function showSavedJournalEntry(entry) {

    if (
        !savedJournalEntry ||
        !savedEntryText ||
        !savedEntryDate
    ) {
        return;
    }


    if (
        !entry ||
        !entry.thoughts ||
        !entry.thoughts.trim()
    ) {

        savedJournalEntry.classList.add(
            "hidden"
        );

        return;
    }


    const date =
        parseDateKey(selectedDate);


    savedEntryDate.textContent =
        date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    savedEntryText.textContent =
        entry.thoughts;


    savedJournalEntry.classList.remove(
        "hidden"
    );

}
function editSelectedJournalEntry() {

    const entry =
        getSelectedEntry();


    if (
        !entry ||
        !entry.thoughts
    ) {
        return;
    }


    journalEntry.value =
        entry.thoughts;


    isEditingJournalEntry = true;


    updateWordCount();


    updateSaveButton();


    journalEntry.focus();


    journalEntry.setSelectionRange(
        journalEntry.value.length,
        journalEntry.value.length
    );

}
function updateSaveButton() {

    if (!saveButton) {
        return;
    }


    saveButton.innerHTML =
        isEditingJournalEntry

            ? `Update Entry <span>♡</span>`

            : `Save Entry <span>♡</span>`;
}


/* ==========================================
   SAVE PROMPT RESPONSE
========================================== */

function savePromptResponse() {

    if (!promptResponse) {
        return;
    }


    const text =
        promptResponse.value.trim();


    if (!text) {
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
            existing.thoughts || "",

        prompt:
            journalPrompts[
                currentPromptIndex
            ],

        promptResponse:
            text,

        updatedAt:
            time

    };


    saveJournalEntries(entries);


    updateLastEdited(time);

    renderJournalCalendar();


    isEditingPromptResponse =
        false;


    promptResponse.value =
        "";


    showSavedPromptEntry(
        entries[selectedDate]
    );


    updatePromptSaveButton();


    showSavedState(
        savePromptButton,
        "Saved ♡"
    );

}

function showSavedPromptEntry(entry) {

    if (
        !savedPromptEntry ||
        !savedPromptText ||
        !savedPromptQuestion ||
        !savedPromptDate
    ) {
        return;
    }


    if (
        !entry ||
        !entry.promptResponse ||
        !entry.promptResponse.trim()
    ) {

        savedPromptEntry.classList.add(
            "hidden"
        );

        return;

    }


    const date =
        parseDateKey(selectedDate);


    savedPromptDate.textContent =
        date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    savedPromptQuestion.textContent =
        `“${entry.prompt}”`;


    savedPromptText.textContent =
        entry.promptResponse;


    savedPromptEntry.classList.remove(
        "hidden"
    );

}
function editPromptResponse() {

    const entry =
        getSelectedEntry();


    if (
        !entry ||
        !entry.promptResponse
    ) {
        return;
    }


    promptResponse.value =
        entry.promptResponse;


    isEditingPromptResponse =
        true;


    updatePromptSaveButton();


    promptResponse.focus();


    promptResponse.setSelectionRange(
        promptResponse.value.length,
        promptResponse.value.length
    );

}
function updatePromptSaveButton() {

    if (!savePromptButton) {
        return;
    }


    savePromptButton.innerHTML =
        isEditingPromptResponse

            ? `Update Response ♡`

            : `Save Response ♡`;

}

/* ==========================================
   LOAD SELECTED ENTRY
========================================== */

function loadSelectedEntry() {

    const entry =
        getSelectedEntry();


    journalEntry.value =
        "";


    promptResponse.value = "";

        isEditingPromptResponse = false;

        updatePromptSaveButton();

        showSavedPromptEntry(entry);
        
        showSavedJournalEntry(entry);


    currentPromptIndex =
        journalPrompts.indexOf(
            entry.prompt
        );


    if (currentPromptIndex < 0) {

        currentPromptIndex =
            getPromptForDate(
                selectedDate
            );

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

    const previousIndex =
        currentPromptIndex;


    const newIndex =
        getRandomPromptIndex(
            previousIndex
        );


    currentPromptIndex =
        newIndex;


    const assignments =
        getPromptAssignments();


    assignments[selectedDate] =
        newIndex;


    savePromptAssignments(
        assignments
    );


    journalPrompt.style.opacity =
        "0";

    promptResponse.style.opacity =
        "0";


    setTimeout(() => {

        journalPrompt.textContent =
            `“${journalPrompts[currentPromptIndex]}”`;

        promptResponse.value =
            "";

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
if (editJournalEntryButton) {

    editJournalEntryButton.addEventListener(
        "click",
        editSelectedJournalEntry
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
if (editPromptEntryButton) {

    editPromptEntryButton.addEventListener(
        "click",
        editPromptResponse
    );

}


/* ==========================================
   INITIALIZE
========================================== */

migrateOldJournal();

migrateJournalToCentralStorage();

loadSelectedEntry();

renderJournalCalendar();