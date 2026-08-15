/* ==========================================
   DAYLIGHT — DASHBOARD
========================================== */


/* ==========================================
   DATE HELPERS
========================================== */

function getDashboardDateKey(date = new Date()) {

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


/* ==========================================
   FULL DATE
========================================== */

function renderDashboardDate() {

    const dateElement =
        document.getElementById(
            "dashboard-full-date"
        );

    if (!dateElement) {
        return;
    }


    const today =
        new Date();


    dateElement.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

}


/* ==========================================
   PLANNER DATA
========================================== */

function getDashboardPlannerData() {

    let todayItems = [];

    let plans = [];


    /*
       Quick-capture tasks
       from the Planner.
    */

    const savedToday =
        localStorage.getItem(
            "daylightToday"
        );


    if (savedToday) {

        try {

            todayItems =
                JSON.parse(savedToday);

        } catch (error) {

            console.error(
                "Unable to read today's Planner tasks.",
                error
            );

        }

    }


    /*
       Dated plans
       from the Planner.
    */

    const savedPlanner =
        localStorage.getItem(
            "daylightPlanner"
        );


    if (savedPlanner) {

        try {

            plans =
                JSON.parse(savedPlanner);

        } catch (error) {

            console.error(
                "Unable to read Planner plans.",
                error
            );

        }

    }


    const todayKey =
        getDashboardDateKey();


    const todaysPlans =
        plans.filter(
            plan =>
                plan.date === todayKey
        );


    return {
        todayItems,
        todaysPlans
    };

}


/* ==========================================
   PLANNER WIDGET
========================================== */

function renderDashboardPlanner() {

    const container =
        document.getElementById(
            "dashboard-planner-content"
        );


    if (!container) {
        return;
    }


    const {
        todayItems,
        todaysPlans
    } =
        getDashboardPlannerData();


    /*
       Combine today's quick tasks
       and today's dated plans.
    */

    const items = [];


    todayItems.forEach(
        item => {

            items.push({
                type: "task",
                text: item.text,
                completed: item.completed
            });

        }
    );


    todaysPlans.forEach(
        plan => {

            items.push({
                type: "plan",
                text: plan.title,
                completed: false
            });

        }
    );


    /*
       Nothing planned.
    */

    if (items.length === 0) {

        container.innerHTML = `
            <div class="dashboard-planner-empty">

                <p class="dashboard-empty-state">
                    Nothing planned for today yet.
                </p>

                <span>
                    Add something in Planner.
                </span>

            </div>
        `;

        return;

    }


    /*
       Keep the Dashboard compact.
       Show only the first 4 items.
    */

    const visibleItems =
        items.slice(0, 4);


    container.innerHTML = `

        <div class="dashboard-plan-list">

            ${visibleItems.map(
                item => `

                    <div
                        class="
                            dashboard-plan-item
                            ${item.completed ? "is-completed" : ""}
                        "
                    >

                        <span class="dashboard-plan-check">

                            ${item.completed ? "✓" : "○"}

                        </span>


                        <span class="dashboard-plan-text">

                            ${escapeDashboardHTML(item.text)}

                        </span>

                    </div>

                `
            ).join("")}

        </div>


        ${
            items.length > 4
                ? `
                    <p class="dashboard-plan-more">
                        + ${items.length - 4} more
                    </p>
                `
                : ""
        }

    `;

}


/* ==========================================
   SAFE TEXT
========================================== */

function escapeDashboardHTML(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

/* ==========================================
   MEMORIES WIDGET
========================================== */
/* ==========================================
   MEMORIES WIDGET
========================================== */

/* ==========================================
   MEMORIES WIDGET
========================================== */

function loadDashboardMemories() {

    const container =
        document.getElementById(
            "dashboard-memories-content"
        );

    if (!container) {
        return;
    }


    /* ==========================================
       READ FROM CENTRAL DAYLIGHT STORAGE
    ========================================== */

    const memories =
        getDaylightSection(
            "memories"
        ) || {};


    /* ==========================================
       TODAY
    ========================================== */

    const todayKey =
        getDashboardDateKey();


    /*
        Prefer today's memory.

        If there is no memory today,
        use the most recent memory
        from a previous date.

        Never show a future memory.
    */

    const dates =
        Object.keys(memories)
            .filter(
                dateKey =>
                    dateKey <= todayKey
            )
            .sort(
                (a, b) =>
                    b.localeCompare(a)
            );


    if (dates.length === 0) {

        container.innerHTML = `
            <p class="dashboard-empty-state">
                Your memories will appear here.
            </p>
        `;

        return;
    }


    /* ==========================================
       SELECT MEMORY
    ========================================== */

    const selectedDate =
        dates[0];

    const selectedMemory =
        memories[selectedDate];


    if (
        !selectedMemory ||
        !selectedMemory.photo
    ) {

        container.innerHTML = `
            <p class="dashboard-empty-state">
                Your memories will appear here.
            </p>
        `;

        return;
    }


    /* ==========================================
       FORMAT DATE
    ========================================== */

    const date =
        new Date(
            `${selectedDate}T00:00:00`
        );


    const formattedDate =
        date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    /* ==========================================
       CAPTION
    ========================================== */

    const caption =
        selectedMemory.caption ||
        "A little moment worth keeping.";


    /* ==========================================
       RENDER
    ========================================== */

    container.innerHTML = `

        <div class="dashboard-memory-preview">

            <img
                src="${selectedMemory.photo}"
                alt=""
                class="dashboard-memory-image"
            >

            <div class="dashboard-memory-info">

                <span
                    class="dashboard-memory-date"
                >
                    ${formattedDate}
                </span>

                <p
                    class="dashboard-memory-caption"
                >
                    “${
                        escapeDashboardHTML(
                            caption
                        )
                    }”
                </p>

            </div>

        </div>

    `;

}

window.addEventListener(
    "focus",
    loadDashboardMemories
);


window.addEventListener(
    "storage",
    loadDashboardMemories
);
/* ==========================================
   JOURNAL WIDGET
========================================== */

function loadDashboardJournal() {

    const preview =
        document.querySelector(
            "#dashboard-journal-preview"
        );


    const status =
        document.querySelector(
            "#dashboard-journal-status"
        );


    if (!preview || !status) {
        return;
    }


    const raw =
        localStorage.getItem(
            "daylightJournalEntries"
        );


    let entries = {};


    if (raw) {

        try {

            entries =
                JSON.parse(raw);

        } catch (error) {

            console.error(
                "Unable to load Dashboard Journal data.",
                error
            );

            return;

        }

    }


    const todayKey =
        getDashboardDateKey();


    const entry =
        entries[todayKey];


    const thought =
        entry &&
        entry.thoughts
            ? entry.thoughts.trim()
            : "";


    if (!thought) {

        preview.innerHTML = `
            <p class="dashboard-empty-state">
                Nothing written today yet.
            </p>
        `;

        status.textContent =
            "No entry today";

        return;

    }


    const maxLength =
        180;


    const previewText =
        thought.length > maxLength

            ? thought
                .substring(0, maxLength)
                .trim() + "..."

            : thought;


    preview.textContent =
        `"${previewText}"`;


    status.textContent =
        "Entry saved today";

}

/* ==========================================
   OPEN JOURNAL
========================================== */

function openJournal() {

    window.location.href =
        "../journal/journal.html";

}
/* ==========================================
   HABITS WIDGET
========================================== */

const DASHBOARD_HABITS_KEY =
    "daylightHabits";


function loadDashboardHabits() {

    const saved =
        localStorage.getItem(
            DASHBOARD_HABITS_KEY
        );

    if (!saved) {
        return [];
    }

    try {

        const parsed =
            JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Unable to load Dashboard Habits.",
            error
        );

        return [];

    }

}


function isDashboardHabitScheduled(
    habit,
    date
) {

    const day =
        date.getDay();


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


function isDashboardHabitCompleted(
    habit,
    dateKey
) {

    return Boolean(
        habit.completions &&
        habit.completions[dateKey]
    );

}


function renderDashboardHabits() {

    const container =
        document.getElementById(
            "dashboard-habits-content"
        );


    if (!container) {
        return;
    }


    const habits =
        loadDashboardHabits();


    const today =
        new Date();


    const todayKey =
        getDashboardDateKey(
            today
        );


    /*
        Only habits scheduled
        for today and not archived.
    */

    const todaysHabits =
        habits.filter(
            habit => {

                if (
                    habit.archived === true
                ) {

                    return false;

                }


                return isDashboardHabitScheduled(
                    habit,
                    today
                );

            }
        );


    const total =
        todaysHabits.length;


    const completed =
        todaysHabits.filter(
            habit =>
                isDashboardHabitCompleted(
                    habit,
                    todayKey
                )
        ).length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    /*
        Progress
    */

    const progressText =
        document.getElementById(
            "dashboard-habits-progress-text"
        );


    const percentageElement =
        document.getElementById(
            "dashboard-habits-percentage"
        );


    const progressFill =
        document.getElementById(
            "dashboard-habits-progress-fill"
        );


    if (progressText) {

        progressText.textContent =
            `${completed} of ${total} completed`;

    }


    if (percentageElement) {

        percentageElement.textContent =
            `${percentage}%`;

    }


    if (progressFill) {

        progressFill.style.width =
            `${percentage}%`;

    }


    /*
        Empty state
    */

    const list =
        document.getElementById(
            "dashboard-habits-list"
        );


    if (!list) {
        return;
    }


    if (todaysHabits.length === 0) {

        list.innerHTML = `

            <div class="dashboard-habits-empty">

                Nothing scheduled today.

            </div>

        `;

        return;

    }


    /*
        Keep Dashboard compact.
        Show up to 4 habits.
    */

    const visibleHabits =
        todaysHabits.slice(0, 4);


    list.innerHTML =
        visibleHabits
            .map(
                habit => {

                    const isCompleted =
                        isDashboardHabitCompleted(
                            habit,
                            todayKey
                        );


                    return `

                        <button
                            type="button"
                            class="
                                dashboard-habit-item
                                ${
                                    isCompleted
                                        ? "completed"
                                        : ""
                                }
                            "
                            data-habit-id="${habit.id}"
                        >

                            <span
                                class="dashboard-habit-check"
                            >
                                ${
                                    isCompleted
                                        ? "✓"
                                        : ""
                                }
                            </span>


                            <span
                                class="dashboard-habit-icon"
                            >
                                ${escapeDashboardHTML(
                                    habit.icon || "♡"
                                )}
                            </span>


                            <span
                                class="dashboard-habit-name"
                            >
                                ${escapeDashboardHTML(
                                    habit.name
                                )}
                            </span>

                        </button>

                    `;

                }
            )
            .join("");


    /*
        Toggle completion directly
        from Dashboard.
    */

    list
        .querySelectorAll(
            ".dashboard-habit-item"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        toggleDashboardHabit(
                            button.dataset.habitId
                        );

                    }
                );

            }
        );

}


function toggleDashboardHabit(
    habitId
) {

    const habits =
        loadDashboardHabits();


    const habit =
        habits.find(
            item =>
                item.id === habitId
        );


    if (!habit) {
        return;
    }


    if (!habit.completions) {

        habit.completions = {};

    }


    const todayKey =
        getDashboardDateKey();


    habit.completions[todayKey] =
        !habit.completions[todayKey];


    localStorage.setItem(
        DASHBOARD_HABITS_KEY,
        JSON.stringify(habits)
    );


    renderDashboardHabits();

}


/* ==========================================
   DASHBOARD HABITS REFRESH
========================================== */

window.addEventListener(
    "focus",
    renderDashboardHabits
);


window.addEventListener(
    "storage",
    renderDashboardHabits
);


/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderDashboardDate();

        renderDashboardPlanner();

        renderDashboardCalendar();
        
        renderDashboardHabits();

        loadDashboardJournal();

        loadDashboardMemories();


        const openJournalButton =
            document.querySelector(
                "#open-journal"
            );


        if (openJournalButton) {

            openJournalButton.addEventListener(
                "click",
                openJournal
            );

        }

    }
);
/* ==========================================
   CALENDAR DATA
========================================== */

function getDashboardCalendarData() {

    const todayKey =
        getDashboardDateKey();


    let events = [];

    try {

        events =
            JSON.parse(
                localStorage.getItem("daylightEvents")
            ) || [];

    } catch (error) {

        console.error(
            "Unable to read Calendar events.",
            error
        );

    }


    const todayEvents =
        events
            .filter(event =>
                event.date === todayKey
            )
            .sort((a, b) => {

                /*
                   Events with a time come first.
                   All-day events come after.
                */

                if (!a.time && !b.time) {
                    return 0;
                }

                if (!a.time) {
                    return 1;
                }

                if (!b.time) {
                    return -1;
                }

                return a.time.localeCompare(
                    b.time
                );

            });


    /*
       Birthdays
       Use the existing Calendar birthday system.
    */

    let birthdays = [];

    if (
        typeof getBirthdays === "function"
    ) {

        try {

            birthdays =
                getBirthdays() || [];

        } catch (error) {

            console.error(
                "Unable to read birthdays.",
                error
            );

        }

    }


    const today =
        new Date();


    const todayBirthdays =
        birthdays.filter(
            birthday => {

                if (birthday.date) {

                    const birthDate =
                        new Date(
                            birthday.date
                        );


                    return (
                        birthDate.getMonth()
                            === today.getMonth()
                        &&
                        birthDate.getDate()
                            === today.getDate()
                    );

                }


                return (
                    birthday.month
                        === today.getMonth() + 1
                    &&
                    birthday.day
                        === today.getDate()
                );

            }
        );


    return {
        todayEvents,
        todayBirthdays
    };

}


/* ==========================================
   CALENDAR WIDGET
========================================== */

function renderDashboardCalendar() {

    const container =
        document.getElementById(
            "dashboard-calendar-content"
        );


    if (!container) {
        return;
    }


    const {
        todayEvents,
        todayBirthdays
    } =
        getDashboardCalendarData();


    const items = [];


    /*
       Birthdays first
    */

    todayBirthdays.forEach(
        birthday => {

            items.push({

                type: "birthday",

                title:
                    birthday.name,

                time:
                    "Birthday",

                category:
                    ""

            });

        }
    );


    /*
       Today's events
    */

    todayEvents.forEach(
        event => {

            items.push({

                type: "event",

                title:
                    event.title,

                time:
                    event.time || "All Day",

                category:
                    event.category || ""

            });

        }
    );


    /*
       Empty state
    */

    if (items.length === 0) {

        container.innerHTML = `

            <div class="dashboard-calendar-empty">

                <p class="dashboard-empty-state">
                    Nothing scheduled for today.
                </p>

                <span>
                    Your day is clear.
                </span>

            </div>

        `;

        return;

    }


    /*
       Show first 4 items.
    */

    const visibleItems =
        items.slice(0, 4);


    container.innerHTML = `

        <div class="dashboard-calendar-list">

            ${visibleItems.map(
                item => `

                    <div
                        class="
                            dashboard-calendar-item
                            ${item.type === "birthday"
                                ? "is-birthday"
                                : ""}
                        "
                    >

                        <span class="dashboard-calendar-icon">

                            ${
                                item.type === "birthday"
                                    ? "🎂"
                                    : "📅"
                            }

                        </span>


                        <div class="dashboard-calendar-info">

                            <strong>
                                ${escapeDashboardHTML(
                                    item.title
                                )}
                            </strong>


                            <span>

                            ${escapeDashboardHTML(item.time)}

                            </span>

                        </div>

                    </div>

                `
            ).join("")}

        </div>


        ${
            items.length > 4
                ? `
                    <p class="dashboard-calendar-more">
                        + ${items.length - 4} more
                    </p>
                `
                : ""
        }

    `;

}