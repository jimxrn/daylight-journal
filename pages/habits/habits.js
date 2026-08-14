/* ==========================================
   DAYLIGHT — HABITS
   Milestone 4: Edit + Frequency
========================================== */

"use strict";


/* ==========================================
   ELEMENTS
========================================== */

const habitList =
    document.getElementById("habitList");

const todayDate =
    document.getElementById("todayDate");

const progressNumber =
    document.getElementById("progressNumber");

const progressText =
    document.getElementById("progressText");

const progressMessage =
    document.getElementById("progressMessage");

const progressCircle =
    document.querySelector(".progress-circle");

const addHabitButton =
    document.getElementById("addHabitButton");

const manageHabitsButton =
    document.getElementById("manageHabitsButton");

const habitModal =
    document.getElementById("habitModal");

const closeHabitModal =
    document.getElementById("closeHabitModal");

const cancelHabit =
    document.getElementById("cancelHabit");

const modalOverlay =
    document.getElementById("modalOverlay");

const saveHabit =
    document.getElementById("saveHabit");

const habitName =
    document.getElementById("habitName");

const habitIcon =
    document.getElementById("habitIcon");

const habitFrequency =
    document.getElementById("habitFrequency");

const habitModalTitle =
    document.getElementById("habitModalTitle");

const habitModalLabel =
    document.getElementById("habitModalLabel");

const rhythmCard =
    document.getElementById("rhythmCard");

const viewAllButton =
    document.getElementById("viewAllButton");


/* ==========================================
   STORAGE
========================================== */

const HABITS_STORAGE_KEY =
    "daylightHabits";


/* ==========================================
   STATE
========================================== */

let habits = [];

let editingHabitId = null;


/* ==========================================
   DATE HELPERS
========================================== */

function getDateKey(date = new Date()) {

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


function formatDate(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric"
        }
    );

}


/* ==========================================
   DEFAULT HABITS
========================================== */

function createDefaultHabits() {

    const today =
        getDateKey();


    return [

        {
            id: crypto.randomUUID(),
            name: "Drink water",
            icon: "💧",
            frequency: "daily",
            createdAt: today,
            completions: {}
        },

        {
            id: crypto.randomUUID(),
            name: "Read for 20 minutes",
            icon: "📖",
            frequency: "daily",
            createdAt: today,
            completions: {}
        },

        {
            id: crypto.randomUUID(),
            name: "Morning walk",
            icon: "🚶",
            frequency: "daily",
            createdAt: today,
            completions: {}
        },

        {
            id: crypto.randomUUID(),
            name: "Journal",
            icon: "✎",
            frequency: "daily",
            createdAt: today,
            completions: {}
        }

    ];

}


/* ==========================================
   MIGRATION
========================================== */

function migrateHabit(habit) {

    return {

        id:
            habit.id ||
            crypto.randomUUID(),

        name:
            habit.name ||
            "Untitled habit",

        icon:
            habit.icon ||
            "♡",

        frequency:
            habit.frequency ||
            "daily",

        createdAt:
            habit.createdAt ||
            getDateKey(),

        archived:
            habit.archived === true,

        completions:
            habit.completions ||
            {}

    };

}


/* ==========================================
   LOAD
========================================== */

function loadHabits() {

    const saved =
        localStorage.getItem(
            HABITS_STORAGE_KEY
        );


    if (!saved) {

        const defaults =
            createDefaultHabits();

        saveHabits(defaults);

        return defaults;

    }


    try {

        const parsed =
            JSON.parse(saved);


        if (!Array.isArray(parsed)) {

            throw new Error(
                "Invalid habit data."
            );

        }


        const migrated =
            parsed.map(
                migrateHabit
            );


        saveHabits(
            migrated
        );


        return migrated;

    }

    catch (error) {

        console.error(
            "Unable to load habits:",
            error
        );


        const defaults =
            createDefaultHabits();

        saveHabits(defaults);

        return defaults;

    }

}


/* ==========================================
   SAVE
========================================== */

function saveHabits(habits) {

    localStorage.setItem(
        HABITS_STORAGE_KEY,
        JSON.stringify(habits)
    );

}


habits =
    loadHabits();


/* ==========================================
   FREQUENCY
========================================== */

function isHabitScheduledOnDate(
    habit,
    date
) {

    const day =
        date.getDay();

    /*
        0 = Sunday
        1 = Monday
        ...
        6 = Saturday
    */


    if (
        habit.frequency === "weekdays"
    ) {

        return (
            day >= 1 &&
            day <= 5
        );

    }


    if (
        habit.frequency === "weekends"
    ) {

        return (
            day === 0 ||
            day === 6
        );

    }


    return true;

}


/* ==========================================
   ACTIVE ON DATE
========================================== */

function isHabitActiveOnDate(
    habit,
    date
) {

     if (
        habit.archived === true
    ) {

        return false;

    }


    const dateKey =
        getDateKey(date);


    if (
        dateKey <
        habit.createdAt
    ) {

        return false;

    }


    return isHabitScheduledOnDate(
        habit,
        date
    );

}


/* ==========================================
   COMPLETION
========================================== */

function isHabitCompleted(
    habit,
    date = new Date()
) {

    if (
        !isHabitActiveOnDate(
            habit,
            date
        )
    ) {

        return false;

    }


    const dateKey =
        getDateKey(date);


    return Boolean(
        habit.completions &&
        habit.completions[dateKey]
    );

}


/* ==========================================
   TOGGLE
========================================== */

function toggleHabit(id) {

    const habit =
        habits.find(
            item =>
                item.id === id
        );


    if (!habit) return;


    if (!habit.completions) {

        habit.completions = {};

    }


    const today =
        new Date();


    if (
        !isHabitActiveOnDate(
            habit,
            today
        )
    ) {

        return;

    }


    const dateKey =
        getDateKey(today);


    habit.completions[dateKey] =
        !habit.completions[dateKey];


    saveHabits(
        habits
    );


    render();

}


/* ==========================================
   TODAY HABITS
========================================== */

function renderHabits() {

    habitList.innerHTML = "";


    const today =
        new Date();


    const todaysHabits =
        habits.filter(
            habit =>
                isHabitActiveOnDate(
                    habit,
                    today
                )
        );


    if (
        todaysHabits.length === 0
    ) {

        habitList.innerHTML = `

            <div class="habit-empty">

                <strong>
                    A lighter day.
                </strong>

                <span>
                    Nothing needs your attention here.
                </span>

            </div>

        `;

        return;

    }


    todaysHabits.forEach(
        habit => {

            const completed =
                isHabitCompleted(
                    habit,
                    today
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "habit-row";


            if (completed) {

                row.classList.add(
                    "completed"
                );

            }


            row.innerHTML = `

                <button
                    class="habit-check"
                    type="button"
                    aria-label="${
                        completed
                            ? "Mark incomplete"
                            : "Mark complete"
                    }"
                >
                    ${
                        completed
                            ? "✓"
                            : ""
                    }
                </button>


                <div class="habit-icon">
                    ${escapeHTML(
                        habit.icon
                    )}
                </div>


                <span class="habit-name">
                    ${escapeHTML(
                        habit.name
                    )}
                </span>


                <button
                    class="habit-delete"
                    type="button"
                    title="Habit options"
                    aria-label="Habit options"
                >
                    ···
                </button>

            `;


            row.querySelector(
                ".habit-check"
            ).addEventListener(
                "click",
                () => {

                    toggleHabit(
                        habit.id
                    );

                }
            );


            row.querySelector(
                ".habit-delete"
            ).addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    openHabitMenu(
                        habit.id,
                        row.querySelector(
                            ".habit-delete"
                        )
                    );

                }
            );


            habitList.appendChild(
                row
            );

        }
    );

}


/* ==========================================
   HABIT MENU
========================================== */

function openHabitMenu(
    habitId,
    button
) {

    closeHabitMenus();


    const menu =
        document.createElement(
            "div"
        );


    menu.className =
        "habit-action-menu";


    menu.innerHTML = `

        <button
            type="button"
            data-action="edit"
        >
            Edit
        </button>

        <button
            type="button"
            data-action="delete"
        >
            Delete
        </button>

    `;


    const row =
        button.closest(
            ".habit-row"
        );


    row.style.position =
        "relative";


    row.appendChild(
        menu
    );


    menu.querySelector(
        '[data-action="edit"]'
    ).addEventListener(
        "click",
        () => {

            closeHabitMenus();

            openEditHabit(
                habitId
            );

        }
    );


    menu.querySelector(
        '[data-action="delete"]'
    ).addEventListener(
        "click",
        () => {

            closeHabitMenus();

            deleteHabit(
                habitId
            );

        }
    );

}


function closeHabitMenus() {

    document
        .querySelectorAll(
            ".habit-action-menu"
        )
        .forEach(
            menu =>
                menu.remove()
        );

}


document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".habit-delete"
            ) &&
            !event.target.closest(
                ".habit-action-menu"
            )
        ) {

            closeHabitMenus();

        }

    }
);


/* ==========================================
   DELETE
========================================== */

function deleteHabit(id) {

    const habit =
        habits.find(
            item =>
                item.id === id
        );


    if (!habit) return;


    const confirmed =
        confirm(
            `Remove "${habit.name}" from your habits?`
        );


    if (!confirmed) return;


    habits =
        habits.filter(
            item =>
                item.id !== id
        );


    saveHabits(
        habits
    );


    render();

}
/* ==========================================
   ARCHIVE
========================================== */

function archiveHabit(id) {

    const habit =
        habits.find(
            item =>
                item.id === id
        );


    if (!habit) return;


    habit.archived =
        true;


    saveHabits(
        habits
    );


    render();

}


/* ==========================================
   RESTORE
========================================== */

function restoreHabit(id) {

    const habit =
        habits.find(
            item =>
                item.id === id
        );


    if (!habit) return;


    habit.archived =
        false;


    saveHabits(
        habits
    );


    render();

}

/* ==========================================
   MANAGE HABITS
========================================== */

function openManageHabits() {

    const existing =
        document.getElementById(
            "manageHabitsModal"
        );

    if (existing) {
        existing.remove();
    }


    const modal =
        document.createElement("div");


    modal.id =
        "manageHabitsModal";

    modal.className =
        "history-modal";


    const activeHabits =
        habits.filter(
            habit =>
                habit.archived !== true
        );


    const archivedHabits =
        habits.filter(
            habit =>
                habit.archived === true
        );

    const activeRows =
    activeHabits
        .map(habit => {

            const frequencyLabel =
                getFrequencyLabel(
                    habit.frequency
                );

            return `

                <div class="manage-habit-row">

                    <div class="manage-habit-icon">
                        ${escapeHTML(habit.icon)}
                    </div>


                    <div class="manage-habit-info">

                        <span class="manage-habit-name">
                            ${escapeHTML(habit.name)}
                        </span>

                        <span class="manage-habit-frequency">
                            ${frequencyLabel}
                        </span>

                    </div>


                    <div class="manage-habit-actions">

                        <button
                            type="button"
                            class="manage-habit-edit"
                            data-id="${habit.id}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="manage-habit-archive"
                            data-id="${habit.id}"
                        >
                            Archive
                        </button>

                    </div>

                </div>

            `;

        })
        .join("");


    const archivedRows =
        archivedHabits
            .map(habit => {

                return `

                    <div
                        class="
                            manage-habit-row
                            archived-habit-row
                        "
                    >

                        <div
                            class="manage-habit-icon"
                        >
                            ${escapeHTML(
                                habit.icon
                            )}
                        </div>


                        <div
                            class="manage-habit-info"
                        >

                            <span
                                class="manage-habit-name"
                            >
                                ${escapeHTML(
                                    habit.name
                                )}
                            </span>


                            <span
                                class="
                                    manage-habit-frequency
                                "
                            >
                                Archived
                            </span>

                        </div>


                        <button
                            type="button"
                            class="
                                manage-habit-restore
                            "
                            data-id="${habit.id}"
                        >
                            Restore
                        </button>

                    </div>

                `;

            })
            .join("");


    modal.innerHTML = `

        <div
            class="history-overlay"
        ></div>


        <div
            class="
                history-panel
                manage-habits-panel
            "
        >

            <button
                class="history-close"
                type="button"
            >
                ×
            </button>


            <p class="section-label">
                YOUR HABITS
            </p>


            <h2>
                Manage your habits.
            </h2>


            <p class="history-summary">
                Keep your practices simple
                and easy to return to.
            </p>


            <div
                class="manage-section"
            >

                <p class="manage-section-label">
                    ACTIVE
                </p>


                <div
                    class="manage-habits-list"
                >

                    ${
                        activeRows ||
                        `
                            <div
                                class="manage-empty"
                            >
                                <strong>
                                    No active habits.
                                </strong>

                                <span>
                                    Add something small
                                    to begin.
                                </span>
                            </div>
                        `
                    }

                </div>

            </div>


            ${
                archivedHabits.length
                    ? `

                        <div
                            class="
                                manage-section
                                archived-section
                            "
                        >

                            <p
                                class="
                                    manage-section-label
                                "
                            >
                                ARCHIVED
                            </p>


                            <div
                                class="
                                    manage-habits-list
                                "
                            >

                                ${archivedRows}

                            </div>

                        </div>

                    `
                    : ""
            }


            <button
                type="button"
                class="manage-add-button"
            >
                + Add a habit
            </button>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const close =
        () => modal.remove();


    modal.querySelector(
        ".history-close"
    ).addEventListener(
        "click",
        close
    );


    modal.querySelector(
        ".history-overlay"
    ).addEventListener(
        "click",
        close
    );


    /* ======================================
       EDIT
    ====================================== */

    modal.querySelectorAll(
        ".manage-habit-edit"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;


                    modal.remove();


                    openEditHabit(
                        id
                    );

                }
            );

        }
    );


    /* ======================================
       ARCHIVE
    ====================================== */

    modal.querySelectorAll(
        ".manage-habit-archive"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    archiveHabit(
                        button.dataset.id
                    );

                    modal.remove();

                    openManageHabits();

                }
            );

        }
    );


    /* ======================================
       RESTORE
    ====================================== */

    modal.querySelectorAll(
        ".manage-habit-restore"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    restoreHabit(
                        button.dataset.id
                    );

                    modal.remove();

                    openManageHabits();

                }
            );

        }
    );


    /* ======================================
       ADD
    ====================================== */

    modal.querySelector(
        ".manage-add-button"
    ).addEventListener(
        "click",
        () => {

            modal.remove();

            openHabitModal();

        }
    );

}


/* ==========================================
   FREQUENCY LABEL
========================================== */

function getFrequencyLabel(
    frequency
) {

    if (
        frequency === "weekdays"
    ) {

        return "Weekdays";

    }


    if (
        frequency === "weekends"
    ) {

        return "Weekends";

    }


    return "Every day";

}


/* ==========================================
   DAY STATS
========================================== */

function getDayStats(date) {

    const activeHabits =
        habits.filter(
            habit =>
                isHabitActiveOnDate(
                    habit,
                    date
                )
        );


    const completed =
        activeHabits.filter(
            habit =>
                isHabitCompleted(
                    habit,
                    date
                )
        );


    return {

        total:
            activeHabits.length,

        completed:
            completed.length

    };

}


/* ==========================================
   PROGRESS
========================================== */

function renderProgress() {

    const stats =
        getDayStats(
            new Date()
        );


    const total =
        stats.total;

    const completed =
        stats.completed;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                completed /
                total *
                100
            );


    progressNumber.textContent =
        `${percentage}%`;


    progressText.textContent =
        `${completed} of ${total} completed`;


    if (
        total === 0
    ) {

        progressMessage.textContent =
            "A lighter day.";

    }

    else if (
        completed === 0
    ) {

        progressMessage.textContent =
            "Start with one small thing.";

    }

    else if (
        completed < total
    ) {

        progressMessage.textContent =
            "You're doing enough. Keep going gently.";

    }

    else {

        progressMessage.textContent =
            "You showed up for yourself today. ♡";

    }


    const degrees =
        percentage * 3.6;


    progressCircle.style.background =
        `radial-gradient(
            circle,
            #FFFFFF 56%,
            transparent 58%
        ),
        conic-gradient(
            #9274B5 ${degrees}deg,
            #E3D9EB ${degrees}deg
        )`;

}


/* ==========================================
   RHYTHM
========================================== */

function getRhythmStatus(date) {

    const stats =
        getDayStats(date);


    if (
        stats.total === 0
    ) {

        return "empty";

    }


    if (
        stats.completed ===
        stats.total
    ) {

        return "complete";

    }


    if (
        stats.completed > 0
    ) {

        return "partial";

    }


    return "empty";

}


function renderRhythm() {

    rhythmCard.innerHTML = "";


    const today =
        new Date();


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date();


        date.setHours(
            0,
            0,
            0,
            0
        );


        date.setDate(
            today.getDate() - i
        );


        const status =
            getRhythmStatus(
                date
            );


        const weekday =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        const number =
            date.getDate();


        const item =
            document.createElement(
                "button"
            );


        item.type =
            "button";


        item.className =
            "rhythm-day";


        item.innerHTML = `

            <div class="rhythm-weekday">
                ${weekday}
            </div>

            <div class="rhythm-date">
                ${number}
            </div>

            <div
                class="
                    rhythm-dot
                    ${status}
                    ${i === 0
                        ? "today"
                        : ""}
                "
            ></div>

        `;


        item.addEventListener(
            "click",
            () => {

                showDayHistory(
                    date
                );

            }
        );


        rhythmCard.appendChild(
            item
        );

    }

}
/* ==========================================
   MONTHLY CONSISTENCY INSIGHT
========================================== */

function renderConsistencyInsight() {

    const existing =
        document.getElementById(
            "consistencyInsight"
        );

    if (existing) {
        existing.remove();
    }


    const today =
        new Date();


    const year =
        today.getFullYear();

    const month =
        today.getMonth();


    /*
        Start of current month
    */

    const monthStart =
        new Date(
            year,
            month,
            1
        );


    let scheduledPractices = 0;
    let completedPractices = 0;


    /*
        Go through every day from
        the beginning of the month
        through today.
    */

    for (
        let date = new Date(monthStart);
        date <= today;
        date.setDate(
            date.getDate() + 1
        )
    ) {

        const day =
            new Date(date);


        habits.forEach(
            habit => {

                /*
                    Archived habits should
                    not contribute to future
                    consistency.

                    But we still allow their
                    historical completion data
                    to remain untouched.
                */

                if (
                    habit.archived === true
                ) {

                    return;

                }


                if (
                    !isHabitActiveOnDate(
                        habit,
                        day
                    )
                ) {

                    return;

                }


                scheduledPractices++;


                if (
                    isHabitCompleted(
                        habit,
                        day
                    )
                ) {

                    completedPractices++;

                }

            }
        );

    }


    const percentage =
        scheduledPractices === 0
            ? 0
            : Math.round(
                completedPractices /
                scheduledPractices *
                100
            );


    const insight =
        document.createElement(
            "div"
        );


    insight.id =
        "consistencyInsight";


    insight.className =
        "consistency-insight";


    let message;


    if (
        scheduledPractices === 0
    ) {

        message =
            "Your rhythm is just beginning.";

    }

    else if (
        percentage === 100
    ) {

        message =
            "You've been showing up beautifully.";

    }

    else if (
        percentage >= 75
    ) {

        message =
            "You've built a lovely rhythm.";

    }

    else if (
        percentage >= 50
    ) {

        message =
            "You're finding your rhythm.";

    }

    else if (
        percentage > 0
    ) {

        message =
            "Every return is part of the practice.";

    }

    else {

        message =
            "There's always room to begin again.";

    }


    insight.innerHTML = `

        <div class="consistency-insight-icon">
            ✦
        </div>


        <div class="consistency-insight-content">

            <p class="consistency-label">
                THIS MONTH
            </p>


            <h3>
                A little consistency
                goes a long way.
            </h3>


            <p class="consistency-stat">

                ${
                    scheduledPractices === 0
                        ? "No scheduled practices yet."
                        : `
                            You've completed
                            <strong>
                                ${completedPractices}
                            </strong>
                            of
                            <strong>
                                ${scheduledPractices}
                            </strong>
                            scheduled practices
                            this month.
                        `

                }

            </p>


            <p class="consistency-message">
                ${message}
            </p>

        </div>


        <div class="consistency-percentage">
            ${percentage}%
        </div>

    `;


    /*
        Put the insight directly
        underneath the 7-day rhythm.
    */

    rhythmCard.insertAdjacentElement(
        "afterend",
        insight
    );

}


/* ==========================================
   SINGLE DAY HISTORY
========================================== */

function showDayHistory(date) {

    const stats =
        getDayStats(
            date
        );


    const existing =
        document.getElementById(
            "dayHistoryModal"
        );


    if (existing) {

        existing.remove();

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "dayHistoryModal";

    modal.className =
        "history-modal";


    const activeHabits =
        habits.filter(
            habit =>
                isHabitActiveOnDate(
                    habit,
                    date
                )
        );


    const habitRows =
        activeHabits
            .map(
                habit => {

                    const completed =
                        isHabitCompleted(
                            habit,
                            date
                        );


                    return `

                        <div
                            class="
                                history-habit
                                ${
                                    completed
                                        ? "history-completed"
                                        : ""
                                }
                            "
                        >

                            <span
                                class="history-icon"
                            >
                                ${escapeHTML(
                                    habit.icon
                                )}
                            </span>

                            <span
                                class="history-name"
                            >
                                ${escapeHTML(
                                    habit.name
                                )}
                            </span>

                            <span
                                class="history-status"
                            >
                                ${
                                    completed
                                        ? "✓"
                                        : "○"
                                }
                            </span>

                        </div>

                    `;

                }
            )
            .join("");


    modal.innerHTML = `

        <div
            class="history-overlay"
        ></div>


        <div
            class="history-panel"
        >

            <button
                class="history-close"
                type="button"
            >
                ×
            </button>


            <p class="section-label">
                YOUR RHYTHM
            </p>


            <h2>
                ${formatDate(date)}
            </h2>


            <p class="history-summary">

                ${
                    stats.total === 0
                        ? "No habits were scheduled."
                        : `${stats.completed} of ${stats.total} completed`
                }

            </p>


            <div class="history-list">

                ${
                    activeHabits.length
                        ? habitRows
                        : `
                            <p>
                                No habits were scheduled
                                on this day.
                            </p>
                        `
                }

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const close =
        () => modal.remove();


    modal.querySelector(
        ".history-close"
    ).addEventListener(
        "click",
        close
    );


    modal.querySelector(
        ".history-overlay"
    ).addEventListener(
        "click",
        close
    );

}


/* ==========================================
   30-DAY HISTORY
========================================== */

function showAllHistory() {

    const existing =
        document.getElementById(
            "allHistoryModal"
        );


    if (existing) {

        existing.remove();

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "allHistoryModal";

    modal.className =
        "history-modal";


    const days = [];


    const today =
        new Date();


    for (
        let i = 29;
        i >= 0;
        i--
    ) {

        const date =
            new Date();


        date.setHours(
            0,
            0,
            0,
            0
        );


        date.setDate(
            today.getDate() - i
        );


        days.push(
            date
        );

    }


    const historyRows =
        days
            .map(
                date => {

                    const stats =
                        getDayStats(
                            date
                        );


                    const status =
                        getRhythmStatus(
                            date
                        );


                    let summary;


                    if (
                        stats.total === 0
                    ) {

                        summary = "—";

                    }

                    else {

                        summary =
                            `${stats.completed}/${stats.total}`;

                    }


                    let percentage;


                    if (
                        stats.total === 0
                    ) {

                        percentage = "—";

                    }

                    else {

                        percentage =
                            `${Math.round(
                                stats.completed /
                                stats.total *
                                100
                            )}%`;

                    }


                    return `

                        <button
                            class="
                                history-day-row
                                ${status}
                            "
                            type="button"
                        >

                            <span>
                                ${formatDate(
                                    date
                                )}
                            </span>

                            <span>
                                ${summary}
                            </span>

                            <span>
                                ${percentage}
                            </span>

                        </button>

                    `;

                }
            )
            .join("");


    modal.innerHTML = `

        <div
            class="history-overlay"
        ></div>


        <div
            class="
                history-panel
                all-history-panel
            "
        >

            <button
                class="history-close"
                type="button"
            >
                ×
            </button>


            <p class="section-label">
                HABIT HISTORY
            </p>


            <h2>
                Your last 30 days.
            </h2>


            <p class="history-summary">
                A quiet look at the rhythm
                you've built.
            </p>


            <div
                class="all-history-list"
            >

                ${historyRows}

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const close =
        () => modal.remove();


    modal.querySelector(
        ".history-close"
    ).addEventListener(
        "click",
        close
    );


    modal.querySelector(
        ".history-overlay"
    ).addEventListener(
        "click",
        close
    );


    modal.querySelectorAll(
        ".history-day-row"
    ).forEach(
        (
            row,
            index
        ) => {

            row.addEventListener(
                "click",
                () => {

                    const selectedDate =
                        days[index];


                    modal.remove();


                    showDayHistory(
                        selectedDate
                    );

                }
            );

        }
    );

}


/* ==========================================
   ADD / EDIT MODAL
========================================== */

function openHabitModal() {

    editingHabitId =
        null;

    habitModalLabel.textContent =
        "NEW HABIT";

    habitModalTitle.textContent =
        "Add something worth practicing.";


    saveHabit.textContent =
        "Add habit";


    habitName.value =
        "";


    habitIcon.value =
        "💧";


    habitFrequency.value =
        "daily";


    habitModal.classList.remove(
        "hidden"
    );


    setTimeout(
        () => habitName.focus(),
        50
    );

}


function openEditHabit(id) {

    const habit =
        habits.find(
            item =>
                item.id === id
        );


    if (!habit) return;


    editingHabitId =
        id;
    
    habitModalLabel.textContent =
        "EDIT HABIT";

    habitModalTitle.textContent =
        "Make a small change.";


    saveHabit.textContent =
        "Save changes";


    habitName.value =
        habit.name;


    habitIcon.value =
        habit.icon;


    habitFrequency.value =
        habit.frequency ||
        "daily";


    habitModal.classList.remove(
        "hidden"
    );


    setTimeout(
        () => habitName.focus(),
        50
    );

}


function closeModal() {

    habitModal.classList.add(
        "hidden"
    );


    editingHabitId =
        null;

}


/* ==========================================
   SAVE HABIT
========================================== */

function saveHabitChanges() {

    const name =
        habitName.value.trim();


    if (!name) {

        habitName.focus();

        return;

    }


    /*
        EDIT
    */

    if (
        editingHabitId
    ) {

        const habit =
            habits.find(
                item =>
                    item.id ===
                    editingHabitId
            );


        if (!habit) return;


        habit.name =
            name;


        habit.icon =
            habitIcon.value;


        habit.frequency =
            habitFrequency.value;


        saveHabits(
            habits
        );


        closeModal();

        render();

        return;

    }


    /*
        ADD
    */

    habits.push({

        id:
            crypto.randomUUID(),

        name,

        icon:
            habitIcon.value,

        frequency:
            habitFrequency.value,

        createdAt:
            getDateKey(),

        archived: false,

        completions: {}

    });


    saveHabits(
        habits
    );


    closeModal();

    render();

}


/* ==========================================
   EVENTS
========================================== */

addHabitButton.addEventListener(
    "click",
    openHabitModal
);

manageHabitsButton.addEventListener(
    "click",
    openManageHabits
);


closeHabitModal.addEventListener(
    "click",
    closeModal
);


cancelHabit.addEventListener(
    "click",
    closeModal
);


modalOverlay.addEventListener(
    "click",
    closeModal
);


saveHabit.addEventListener(
    "click",
    saveHabitChanges
);


habitName.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            saveHabitChanges();

        }

    }
);


viewAllButton.addEventListener(
    "click",
    showAllHistory
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

            closeHabitMenus();

        }

    }
);


/* ==========================================
   TODAY BUTTON
========================================== */

document
    .getElementById(
        "todayButton"
    )
    .addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );


/* ==========================================
   HTML SAFETY
========================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* ==========================================
   RENDER
========================================== */

function render() {

    renderTodayDate();

    renderHabits();

    renderProgress();

    renderRhythm();

    renderConsistencyInsight();

}

function renderTodayDate() {

    todayDate.textContent =
        formatDate(
            new Date()
        );

}


/* ==========================================
   START
========================================== */

render();